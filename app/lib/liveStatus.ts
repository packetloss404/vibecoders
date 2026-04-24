import { streamers } from '../data/streamers';
import { recordLiveStatusSnapshot } from './signalEvents';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CACHE_TTL_MS = 3 * 60 * 1000;

// Check the most recent N uploads per channel. Catches the case where a
// streamer uploaded a VOD after starting a live broadcast, which would push
// the live item out of the #1 slot.
const TOP_N_UPLOADS = 5;

// After observing a channel live, keep reporting live for this long even if
// a later poll returns false. Smooths over brief YouTube flag flips.
const LIVE_GRACE_MS = 5 * 60 * 1000;

let cachedResult: { data: Record<string, boolean>; timestamp: number } | null = null;
const uploadsPlaylistCache: Map<string, string> = new Map();
const lastSeenLiveAt: Map<string, number> = new Map();

interface ChannelsListResponse {
  items?: Array<{
    id: string;
    contentDetails?: { relatedPlaylists?: { uploads?: string } };
  }>;
}

interface PlaylistItemsResponse {
  items?: Array<{ contentDetails?: { videoId?: string } }>;
}

interface VideosListResponse {
  items?: Array<{
    id: string;
    snippet?: { liveBroadcastContent?: string };
    liveStreamingDetails?: { actualStartTime?: string; actualEndTime?: string };
  }>;
}

async function ytFetch<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`YouTube API error: ${res.status}`);
  return (await res.json()) as T;
}

async function ensureUploadsPlaylists(channelIds: string[]): Promise<void> {
  const missing = channelIds.filter((id) => !uploadsPlaylistCache.has(id));
  if (missing.length === 0) return;

  for (let i = 0; i < missing.length; i += 50) {
    const chunk = missing.slice(i, i + 50);
    const url =
      `https://www.googleapis.com/youtube/v3/channels` +
      `?part=contentDetails&id=${chunk.join(',')}&key=${YOUTUBE_API_KEY}`;
    const data = await ytFetch<ChannelsListResponse>(url);
    for (const item of data.items ?? []) {
      const uploads = item.contentDetails?.relatedPlaylists?.uploads;
      if (uploads) uploadsPlaylistCache.set(item.id, uploads);
    }
  }
}

async function fetchLatestVideoIds(playlistId: string, count: number): Promise<string[]> {
  const url =
    `https://www.googleapis.com/youtube/v3/playlistItems` +
    `?part=contentDetails&maxResults=${count}&playlistId=${playlistId}&key=${YOUTUBE_API_KEY}`;
  const data = await ytFetch<PlaylistItemsResponse>(url);
  const ids: string[] = [];
  for (const item of data.items ?? []) {
    const videoId = item.contentDetails?.videoId;
    if (videoId) ids.push(videoId);
  }
  return ids;
}

async function fetchVideoLiveStatus(videoIds: string[]): Promise<Map<string, boolean>> {
  const result = new Map<string, boolean>();
  if (videoIds.length === 0) return result;

  for (let i = 0; i < videoIds.length; i += 50) {
    const chunk = videoIds.slice(i, i + 50);
    const url =
      `https://www.googleapis.com/youtube/v3/videos` +
      `?part=snippet,liveStreamingDetails&id=${chunk.join(',')}&key=${YOUTUBE_API_KEY}`;
    const data = await ytFetch<VideosListResponse>(url);
    for (const item of data.items ?? []) {
      const broadcastLive = item.snippet?.liveBroadcastContent === 'live';
      const details = item.liveStreamingDetails;
      const detailsLive = Boolean(details?.actualStartTime && !details?.actualEndTime);
      result.set(item.id, broadcastLive || detailsLive);
    }
  }
  return result;
}

export async function getLiveStatus(): Promise<Record<string, boolean> | null> {
  if (!YOUTUBE_API_KEY) return null;

  if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_TTL_MS) {
    return cachedResult.data;
  }

  const liveStatus: Record<string, boolean> = {};
  for (const s of streamers) liveStatus[s.channelId] = false;

  try {
    const channelIds = streamers.map((s) => s.channelId);
    await ensureUploadsPlaylists(channelIds);

    // Fetch the top N most-recent video IDs per channel so an uploaded VOD
    // mid-stream doesn't hide the live broadcast.
    const videoIdsByChannel = new Map<string, string[]>();
    await Promise.allSettled(
      channelIds.map(async (channelId) => {
        const playlistId = uploadsPlaylistCache.get(channelId);
        if (!playlistId) return;
        const ids = await fetchLatestVideoIds(playlistId, TOP_N_UPLOADS);
        if (ids.length) videoIdsByChannel.set(channelId, ids);
      }),
    );

    const allVideoIds = Array.from(
      new Set(Array.from(videoIdsByChannel.values()).flat()),
    );
    const liveByVideoId = await fetchVideoLiveStatus(allVideoIds);

    const now = Date.now();
    for (const channelId of channelIds) {
      const ids = videoIdsByChannel.get(channelId) ?? [];
      const anyLive = ids.some((id) => liveByVideoId.get(id) === true);

      if (anyLive) {
        lastSeenLiveAt.set(channelId, now);
        liveStatus[channelId] = true;
      } else {
        const since = lastSeenLiveAt.get(channelId);
        // Grace window: keep reporting live for LIVE_GRACE_MS after the last
        // true reading to smooth over brief YouTube flag flips.
        liveStatus[channelId] =
          since !== undefined && now - since < LIVE_GRACE_MS;
      }
    }

    cachedResult = { data: liveStatus, timestamp: Date.now() };
    recordLiveStatusSnapshot(liveStatus);
    return liveStatus;
  } catch {
    return null;
  }
}
