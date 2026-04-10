"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Streamer } from "../../data/streamers";

interface SignalEvent {
  id: string;
  type: "went_live" | "went_offline" | "new_streamer";
  streamerName: string;
  title: string;
  timeAgo: string;
}

function getEventIcon(type: SignalEvent["type"]) {
  switch (type) {
    case "went_live":
      return (
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/15 text-sm">
          🔴
        </span>
      );
    case "went_offline":
      return (
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-500/15 text-sm">
          ⚫
        </span>
      );
    case "new_streamer":
      return (
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-500/15 text-sm">
          🆕
        </span>
      );
  }
}

function getBorderColor(type: SignalEvent["type"]) {
  switch (type) {
    case "went_live":
      return "border-l-red-500/50";
    case "went_offline":
      return "border-l-zinc-500/30";
    case "new_streamer":
      return "border-l-teal-500/50";
  }
}

function generateSignalEvents(
  streamers: Streamer[],
  liveStatus: Record<string, boolean>
): SignalEvent[] {
  const events: SignalEvent[] = [];

  // Generate live events from actual live status
  for (const s of streamers) {
    if (liveStatus[s.channelId]) {
      events.push({
        id: `live-${s.channelId}`,
        type: "went_live",
        streamerName: s.name,
        title: `${s.name} just went live`,
        timeAgo: "Just now",
      });
    }
  }

  // Add some placeholder recent activity
  const recentStreamers = streamers.slice(0, 5);
  const timeAgos = ["2h ago", "4h ago", "6h ago", "12h ago", "1d ago"];
  for (let i = 0; i < recentStreamers.length; i++) {
    if (!liveStatus[recentStreamers[i].channelId]) {
      events.push({
        id: `offline-${recentStreamers[i].channelId}`,
        type: "went_offline",
        streamerName: recentStreamers[i].name,
        title: `${recentStreamers[i].name} ended stream`,
        timeAgo: timeAgos[i],
      });
    }
  }

  return events.slice(0, 6);
}

export function SignalPreview({
  streamers,
  liveStatus,
}: {
  streamers: Streamer[];
  liveStatus: Record<string, boolean>;
}) {
  const events = generateSignalEvents(streamers, liveStatus);

  return (
    <motion.section
      className="mx-auto max-w-5xl px-6 py-20"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] as const }}
    >
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            The Signal Board
          </p>
          <h2 className="text-3xl font-bold text-zinc-100 sm:text-4xl">
            Community Pulse, Zero Noise
          </h2>
          <p className="mt-4 text-zinc-400 leading-relaxed">
            A real-time activity feed that runs itself. Live alerts, new
            streamers, and trending BBS threads — all auto-generated, no
            moderation needed. Just signal, no noise.
          </p>
          <Link
            href="/signal"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-teal-400 transition-colors hover:text-teal-300"
          >
            View Full Feed
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/60 p-4 backdrop-blur-sm">
          <div className="space-y-1">
            {events.map((event, i) => (
              <motion.div
                key={event.id}
                className={`flex items-center gap-3 rounded-xl border-l-2 ${getBorderColor(event.type)} bg-zinc-800/30 px-4 py-3`}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.3 }}
              >
                {getEventIcon(event.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-300 truncate">{event.title}</p>
                </div>
                <span className="text-xs text-zinc-500 whitespace-nowrap">
                  {event.timeAgo}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
