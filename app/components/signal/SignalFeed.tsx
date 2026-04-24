"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SignalEvent, SignalEventType } from "../../lib/signalEvents";
import { useReactions } from "../../lib/useReactions";

type FilterType = "all" | "live" | "community";

function getEventIcon(type: SignalEventType) {
  switch (type) {
    case "went_live":
      return <span className="text-base">🔴</span>;
    case "went_offline":
      return <span className="text-base">⚫</span>;
    case "new_streamer":
      return <span className="text-base">🆕</span>;
  }
}

function getBorderColor(type: SignalEventType) {
  switch (type) {
    case "went_live":
      return "border-l-red-500/50";
    case "went_offline":
      return "border-l-zinc-500/30";
    case "new_streamer":
      return "border-l-teal-500/50";
  }
}

function getEventTitle(event: SignalEvent): string {
  switch (event.type) {
    case "went_live":
      return `${event.streamerName} just went live on YouTube`;
    case "went_offline":
      return `${event.streamerName} ended their stream`;
    case "new_streamer":
      return `${event.streamerName} joined the directory`;
  }
}

function timeAgo(isoTimestamp: string, _tick: number): string {
  const then = new Date(isoTimestamp).getTime();
  if (Number.isNaN(then)) return "";
  const seconds = Math.floor((Date.now() - then) / 1000);
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
  const { reactions, react } = useReactions(eventId);

  return (
    <div className="flex items-center gap-1 mt-2">
      {REACTION_EMOJIS.map((emoji) => {
        const count = reactions[emoji] || 0;
        return (
          <button
            key={`${eventId}-${emoji}`}
            onClick={() => react(emoji)}
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

function SkeletonRow({ index }: { index: number }) {
  return (
    <div
      className="border-l-2 border-l-zinc-700/30 rounded-xl bg-zinc-800/30 px-5 py-4 animate-pulse"
      style={{ animationDelay: `${index * 120}ms` }}
    >
      <div className="flex items-start gap-3">
        <div className="h-8 w-8 flex-shrink-0 rounded-full bg-zinc-800/70" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-2/3 rounded bg-zinc-800/70" />
          <div className="h-2 w-20 rounded bg-zinc-800/50" />
          <div className="h-5 w-40 rounded-full bg-zinc-800/40 mt-2" />
        </div>
      </div>
    </div>
  );
}

export function SignalFeed() {
  const [events, setEvents] = useState<SignalEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [tick, setTick] = useState<number>(0);

  // Poll /api/signal-events every 60s
  useEffect(() => {
    let cancelled = false;

    async function fetchEvents() {
      try {
        const res = await fetch("/api/signal-events");
        if (!res.ok) {
          throw new Error(`Signal feed request failed: ${res.status}`);
        }
        const data = (await res.json()) as { events?: SignalEvent[] };
        if (!cancelled) {
          setEvents(Array.isArray(data.events) ? data.events : []);
        }
      } catch (err) {
        // Handle silently but log; do not crash the feed.
        console.error("SignalFeed fetch failed", err);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchEvents();
    const interval = setInterval(fetchEvents, 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  // Re-render time labels every 30s without refetching
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 30 * 1000);
    return () => clearInterval(interval);
  }, []);

  const filtered = events.filter((e) => {
    if (filter === "all") return true;
    if (filter === "live")
      return e.type === "went_live" || e.type === "went_offline";
    if (filter === "community") return e.type === "new_streamer";
    return true;
  });

  const filterButtons: { label: string; value: FilterType }[] = [
    { label: "All", value: "all" },
    { label: "Live", value: "live" },
    { label: "Community", value: "community" },
  ];

  function renderBody() {
    if (loading) {
      return (
        <div className="space-y-2">
          {[0, 1, 2, 3].map((i) => (
            <SkeletonRow key={i} index={i} />
          ))}
        </div>
      );
    }

    if (events.length === 0) {
      return (
        <p className="text-center text-sm text-zinc-500 py-12">
          No signals yet — the grid is quiet.
        </p>
      );
    }

    if (filtered.length === 0) {
      const perFilterMessage =
        filter === "live"
          ? "No live activity right now."
          : filter === "community"
            ? "No community signals in this window."
            : "No signals match this filter.";
      return (
        <p className="text-center text-sm text-zinc-500 py-12">
          {perFilterMessage}
        </p>
      );
    }

    return (
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
                  <p className="text-sm text-zinc-300">
                    {getEventTitle(event)}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {timeAgo(event.timestamp, tick)}
                  </p>
                  <ReactionBar eventId={event.id} />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  }

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

      {renderBody()}
    </div>
  );
}
