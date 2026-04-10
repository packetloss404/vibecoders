import { streamers } from '../../data/streamers';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// In-memory cache to stay within YouTube API quota
let cachedResult: { data: Record<string, boolean>; timestamp: number } | null = null;
const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes

export async function GET() {
  if (!YOUTUBE_API_KEY) {
    return Response.json({ error: 'YouTube API key not configured' }, { status: 500 });
  }

  // Return cached result if fresh
  if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_TTL_MS) {
    return Response.json(cachedResult.data, {
      headers: { 'Cache-Control': 'public, max-age=180, s-maxage=180' },
    });
  }

  const liveStatus: Record<string, boolean> = {};

  try {
    // Check each channel for live streams using YouTube search API
    // Batch into a single request per channel to minimize quota usage
    const results = await Promise.allSettled(
      streamers.map(async (streamer) => {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${streamer.channelId}&type=video&eventType=live&key=${YOUTUBE_API_KEY}`,
        );
        const data = await res.json();
        return {
          channelId: streamer.channelId,
          isLive: Array.isArray(data.items) && data.items.length > 0,
        };
      }),
    );

    for (const result of results) {
      if (result.status === 'fulfilled') {
        liveStatus[result.value.channelId] = result.value.isLive;
      }
    }

    cachedResult = { data: liveStatus, timestamp: Date.now() };

    return Response.json(liveStatus, {
      headers: { 'Cache-Control': 'public, max-age=180, s-maxage=180' },
    });
  } catch {
    return Response.json({ error: 'Failed to check live status' }, { status: 500 });
  }
}
