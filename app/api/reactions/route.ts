import type { NextRequest } from "next/server";

// Valid reaction emojis — mirrors REACTION_EMOJIS in SignalFeed.tsx.
const VALID_EMOJIS = ["🔥", "💜", "🚀", "👀", "🎉", "💀"] as const;
type ValidEmoji = (typeof VALID_EMOJIS)[number];

// NOTE: In-memory state. This resets on serverless cold-start / deploy.
// That trade-off is acceptable for the Signal feature at this stage —
// reactions are ephemeral community signal, not durable data.
// A Map preserves insertion order, which we rely on for LRU-style eviction.
const MAX_EVENTS = 1000;
const store: Map<string, Map<string, number>> = new Map();

// Rate limiting: per-IP sliding window.
const RATE_WINDOW_MS = 10_000;
const RATE_MAX_REQUESTS = 10;
const rateBuckets: Map<string, number[]> = new Map();

function isValidEmoji(value: unknown): value is ValidEmoji {
  return typeof value === "string" && (VALID_EMOJIS as readonly string[]).includes(value);
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    // x-forwarded-for can be a comma-separated list; first entry is the client.
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = request.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const cutoff = now - RATE_WINDOW_MS;
  const existing = rateBuckets.get(ip) ?? [];
  // Drop timestamps outside the window.
  const recent = existing.filter((t) => t > cutoff);
  if (recent.length >= RATE_MAX_REQUESTS) {
    rateBuckets.set(ip, recent);
    return false;
  }
  recent.push(now);
  rateBuckets.set(ip, recent);
  return true;
}

function snapshot(eventReactions: Map<string, number>): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [emoji, count] of eventReactions) {
    out[emoji] = count;
  }
  return out;
}

function getOrCreateEvent(eventId: string): Map<string, number> {
  let existing = store.get(eventId);
  if (existing) {
    // Re-insert to mark as most-recently-used in insertion-order Map.
    store.delete(eventId);
    store.set(eventId, existing);
    return existing;
  }
  existing = new Map();
  store.set(eventId, existing);
  // Evict oldest entries if over capacity.
  while (store.size > MAX_EVENTS) {
    const oldestKey = store.keys().next().value;
    if (oldestKey === undefined) break;
    store.delete(oldestKey);
  }
  return existing;
}

export async function GET(request: NextRequest) {
  const eventId = request.nextUrl.searchParams.get("eventId");
  if (!eventId) {
    return Response.json({ error: "eventId query param is required" }, { status: 400 });
  }
  const reactions = store.get(eventId);
  return Response.json({
    eventId,
    reactions: reactions ? snapshot(reactions) : {},
  });
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (!checkRateLimit(ip)) {
    return Response.json(
      { error: "Too many reactions. Slow down." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return Response.json({ error: "Body must be an object" }, { status: 400 });
  }

  const { eventId, emoji } = body as { eventId?: unknown; emoji?: unknown };
  if (typeof eventId !== "string" || eventId.length === 0) {
    return Response.json({ error: "eventId is required" }, { status: 400 });
  }
  if (!isValidEmoji(emoji)) {
    return Response.json({ error: "emoji must be one of the allowed set" }, { status: 400 });
  }

  const eventReactions = getOrCreateEvent(eventId);
  eventReactions.set(emoji, (eventReactions.get(emoji) ?? 0) + 1);

  return Response.json({
    eventId,
    reactions: snapshot(eventReactions),
  });
}
