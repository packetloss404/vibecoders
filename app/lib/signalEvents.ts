import { streamers } from '../data/streamers';

export type SignalEventType = 'went_live' | 'went_offline' | 'new_streamer';

export interface SignalEvent {
  id: string; // stable: `${type}-${channelId}-${timestamp}`
  type: SignalEventType;
  streamerName: string;
  channelId: string;
  timestamp: string; // ISO string
}

const MAX_EVENTS = 100;

// Module-level event log + snapshot. These persist across requests within the
// same Node.js process (i.e. same server instance). They reset on redeploy.
const eventLog: SignalEvent[] = [];
let previousSnapshot: Record<string, boolean> | null = null;

function channelIdToName(channelId: string): string {
  const match = streamers.find((s) => s.channelId === channelId);
  return match ? match.name : channelId;
}

function makeEventId(type: SignalEventType, channelId: string, timestamp: string): string {
  return `${type}-${channelId}-${timestamp}`;
}

/**
 * Append an event to the in-memory log. Dedupes consecutive identical
 * transitions (same type + channelId as the most recent entry of that channel).
 * Caps the log at 100 entries (newest kept).
 */
export function appendEvent(event: SignalEvent): void {
  // Dedupe: if the most recent event for this channel has the same type, skip.
  // We check the most recent live/offline transition for this channel so rapid
  // flaps between identical states don't spam the feed.
  const lastForChannel = eventLog
    .slice()
    .reverse()
    .find((e) => e.channelId === event.channelId && e.type !== 'new_streamer');

  if (
    lastForChannel &&
    lastForChannel.type === event.type &&
    event.type !== 'new_streamer'
  ) {
    return;
  }

  eventLog.push(event);

  // Cap at MAX_EVENTS: drop oldest.
  if (eventLog.length > MAX_EVENTS) {
    eventLog.splice(0, eventLog.length - MAX_EVENTS);
  }
}

/**
 * Returns events sorted newest-first (by timestamp desc).
 */
export function getEvents(): SignalEvent[] {
  return eventLog
    .slice()
    .sort((a, b) => (a.timestamp < b.timestamp ? 1 : a.timestamp > b.timestamp ? -1 : 0));
}

/**
 * Compare current live-status snapshot to the previously recorded one and emit
 * went_live / went_offline events for any transitions, then update the stored
 * snapshot. First call establishes the baseline without emitting transitions.
 */
export function recordLiveStatusSnapshot(current: Record<string, boolean>): void {
  const now = new Date().toISOString();

  if (previousSnapshot === null) {
    // First snapshot — baseline only, don't synthesize transitions.
    previousSnapshot = { ...current };
    return;
  }

  for (const [channelId, isLive] of Object.entries(current)) {
    const wasLive = previousSnapshot[channelId] ?? false;
    if (wasLive === isLive) continue;

    const type: SignalEventType = isLive ? 'went_live' : 'went_offline';
    const timestamp = now;
    appendEvent({
      id: makeEventId(type, channelId, timestamp),
      type,
      streamerName: channelIdToName(channelId),
      channelId,
      timestamp,
    });
  }

  previousSnapshot = { ...current };
}

// Seed the log with real "new_streamer" events for the two recently added
// streamers. This gives the feed honest content at boot. Timestamp is now
// at module load; they'll be the oldest real events until transitions occur.
(function seedNewStreamers() {
  const newStreamerNames = ['Unpuzzle', 'Nico G'];
  const bootTimestamp = new Date().toISOString();

  for (const name of newStreamerNames) {
    const streamer = streamers.find((s) => s.name === name);
    if (!streamer) continue;

    const type: SignalEventType = 'new_streamer';
    eventLog.push({
      id: makeEventId(type, streamer.channelId, bootTimestamp),
      type,
      streamerName: streamer.name,
      channelId: streamer.channelId,
      timestamp: bootTimestamp,
    });
  }
})();
