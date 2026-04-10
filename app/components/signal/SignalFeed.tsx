"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { streamers, type Streamer } from "../../data/streamers";

type EventType = "went_live" | "went_offline" | "new_streamer" | "bbs_trending";

interface SignalEvent {
  id: string;
  type: EventType;
  streamerName: string;
  title: string;
  timestamp: Date;
  emoji?: string;
}

type FilterType = "all" | "live" | "community";

function getEventIcon(type: EventType) {
  switch (type) {
    case "went_live":
      return <span className="text-base">🔴</span>;
    case "went_offline":
      return <span className="text-base">⚫</span>;
    case "new_streamer":
      return <span className="text-base">🆕</span>;
    case "bbs_trending":
      return <span className="text-base">💬</span>;
  }
}

function getBorderColor(type: EventType) {
  switch (type) {
    case "went_live":
      return "border-l-red-500/50";
    case "went_offline":
      return "border-l-zinc-500/30";
    case "new_streamer":
      return "border-l-teal-500/50";
    case "bbs_trending":
      return "border-l-cyan-500/50";
  }
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const REACTION_EMOJIS = ["🔥", "💜", "🚀", "👀", "🎉", "💀"];

function ReactionBar({ eventId }: { eventId: string }) {
  const [reactions, setReactions] = useState<Record<string, number>>({});

  function handleReact(emoji: string) {
    setReactions((prev) => ({
      ...prev,
      [emoji]: (prev[emoji] || 0) + 1,
    }));
  }

  return (
    <div className="flex items-center gap-1 mt-2">
      {REACTION_EMOJIS.map((emoji) => {
        const count = reactions[emoji] || 0;
        return (
          <button
            key={`${eventId}-${emoji}`}
            onClick={() => handleReact(emoji)}
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs transition-all hover:scale-105 active:scale-95 ${
              count > 0
                ? "bg-teal-500/15 border border-teal-500/25 text-zinc-300"
                : "bg-zinc-800/50 border border-zinc-700/30 text-zinc-500 hover:border-zinc-600/50"
            }`}
          >
            <span>{emoji}</span>
            {count > 0 && <span>{count}</span>}
          </button>
        );
      })}
    </div>
  );
}

function generateEvents(
  allStreamers: Streamer[],
  liveStatus: Record<string, boolean>
): SignalEvent[] {
  const events: SignalEvent[] = [];
  const now = Date.now();

  // Live events from real status
  for (const s of allStreamers) {
    if (liveStatus[s.channelId]) {
      events.push({
        id: `live-${s.channelId}`,
        type: "went_live",
        streamerName: s.name,
        title: `${s.name} just went live on YouTube`,
        timestamp: new Date(now - Math.random() * 600000), // within last 10 min
      });
    }
  }

  // Simulate recent activity for demo
  const offlineStreamers = allStreamers.filter((s) => !liveStatus[s.channelId]);
  const timeOffsets = [
    1800000, 3600000, 7200000, 14400000, 21600000, 43200000, 86400000,
    129600000, 172800000, 259200000,
  ];

  for (let i = 0; i < Math.min(offlineStreamers.length, 8); i++) {
    events.push({
      id: `offline-${offlineStreamers[i].channelId}`,
      type: "went_offline",
      streamerName: offlineStreamers[i].name,
      title: `${offlineStreamers[i].name} ended their stream`,
      timestamp: new Date(now - timeOffsets[i]),
    });
  }

  // BBS trending
  events.push({
    id: "bbs-1",
    type: "bbs_trending",
    streamerName: "",
    title: "Trending on BBS: Best AI coding tools of 2026",
    timestamp: new Date(now - 5400000),
  });
  events.push({
    id: "bbs-2",
    type: "bbs_trending",
    streamerName: "",
    title: "Trending on BBS: Show your latest vibe coded project",
    timestamp: new Date(now - 28800000),
  });

  // New streamer event
  events.push({
    id: "new-jordan",
    type: "new_streamer",
    streamerName: "Jordan Lee",
    title: "Jordan Lee joined the directory",
    timestamp: new Date(now - 172800000),
  });

  return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export function SignalFeed() {
  const [liveStatus, setLiveStatus] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<FilterType>("all");

  useEffect(() => {
    async function fetchLiveStatus() {
      try {
        const res = await fetch("/api/live-status");
        if (res.ok) {
          setLiveStatus(await res.json());
        }
      } catch {
        // silently fail
      }
    }
    fetchLiveStatus();
    const interval = setInterval(fetchLiveStatus, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const events = generateEvents(streamers, liveStatus);

  const filtered = events.filter((e) => {
    if (filter === "all") return true;
    if (filter === "live") return e.type === "went_live" || e.type === "went_offline";
    if (filter === "community") return e.type === "bbs_trending" || e.type === "new_streamer";
    return true;
  });

  const filterButtons: { label: string; value: FilterType }[] = [
    { label: "All", value: "all" },
    { label: "Live", value: "live" },
    { label: "Community", value: "community" },
  ];

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-6">
        {filterButtons.map((btn) => (
          <button
            key={btn.value}
            onClick={() => setFilter(btn.value)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
              filter === btn.value
                ? "bg-teal-500/15 border border-teal-500/30 text-teal-400"
                : "bg-zinc-800/50 border border-zinc-700/30 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600/50"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Events */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {filtered.map((event) => (
            <motion.div
              key={event.id}
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={`border-l-2 ${getBorderColor(event.type)} rounded-xl bg-zinc-800/30 px-5 py-4`}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-zinc-800/50">
                  {getEventIcon(event.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-300">{event.title}</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {timeAgo(event.timestamp)}
                  </p>
                  <ReactionBar eventId={event.id} />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-sm text-zinc-500 py-12">
          No signals yet — the grid is quiet.
        </p>
      )}
    </div>
  );
}
