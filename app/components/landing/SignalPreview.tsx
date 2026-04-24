"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { SignalEvent, SignalEventType } from "../../lib/signalEvents";

function getEventIcon(type: SignalEventType) {
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
      return `${event.streamerName} just went live`;
    case "went_offline":
      return `${event.streamerName} ended their stream`;
    case "new_streamer":
      return `${event.streamerName} joined the directory`;
  }
}

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
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

function SkeletonRow({ index }: { index: number }) {
  return (
    <div
      className="flex items-center gap-3 rounded-xl border-l-2 border-l-zinc-700/30 bg-zinc-800/30 px-4 py-3 animate-pulse"
      style={{ animationDelay: `${index * 120}ms` }}
    >
      <div className="h-8 w-8 flex-shrink-0 rounded-full bg-zinc-800/70" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-2/3 rounded bg-zinc-800/70" />
      </div>
      <div className="h-3 w-12 rounded bg-zinc-800/50" />
    </div>
  );
}

export function SignalPreview() {
  const [events, setEvents] = useState<SignalEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errored, setErrored] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchEvents() {
      try {
        const res = await fetch("/api/signal-events");
        if (!res.ok) {
          throw new Error(`Signal preview request failed: ${res.status}`);
        }
        const data = (await res.json()) as { events?: SignalEvent[] };
        if (!cancelled) {
          setEvents(Array.isArray(data.events) ? data.events.slice(0, 5) : []);
        }
      } catch (err) {
        console.error("SignalPreview fetch failed", err);
        if (!cancelled) {
          setErrored(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchEvents();
    return () => {
      cancelled = true;
    };
  }, []);

  function renderBody() {
    if (loading) {
      return (
        <div className="space-y-1">
          {[0, 1, 2].map((i) => (
            <SkeletonRow key={i} index={i} />
          ))}
        </div>
      );
    }

    if (errored || events.length === 0) {
      return (
        <p className="text-center text-sm text-zinc-500 py-8">
          Signal board is quiet.
        </p>
      );
    }

    return (
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
              <p className="text-sm text-zinc-300 truncate">
                {getEventTitle(event)}
              </p>
            </div>
            <span className="text-xs text-zinc-500 whitespace-nowrap">
              {timeAgo(event.timestamp)}
            </span>
          </motion.div>
        ))}
      </div>
    );
  }

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
          {renderBody()}
        </div>
      </div>
    </motion.section>
  );
}
