"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Streamer } from "../../data/streamers";
import { LiveBadge } from "../ui/LiveBadge";
import {
  TwitterIcon,
  GithubIcon,
  DiscordIcon,
  YouTubeIcon,
  ClockIcon,
} from "../ui/Icons";

function StreamerCard({
  streamer,
  isLive,
}: {
  streamer: Streamer;
  isLive: boolean;
}) {
  return (
    <article
      className={`group relative min-h-56 overflow-hidden rounded-2xl border p-6 pb-16 backdrop-blur-sm transition-all ${
        isLive
          ? "border-red-500/30 bg-zinc-900/80 hover:border-red-500/50 hover:bg-zinc-900"
          : "border-zinc-800/50 bg-zinc-900/80 hover:border-zinc-700/50 hover:bg-zinc-900"
      }`}
    >
      <div className="flex items-start gap-4">
        {streamer.avatarUrl && (
          <div
            className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full ring-2 transition-all ${
              isLive
                ? "ring-red-500/50 group-hover:ring-red-500/70"
                : "ring-zinc-800 group-hover:ring-teal-500/50"
            }`}
          >
            <Image
              src={streamer.avatarUrl}
              alt={streamer.name}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold">{streamer.name}</h3>
              {isLive && <LiveBadge />}
            </div>
            {streamer.socials && (
              <div className="flex items-center gap-2">
                {streamer.socials.twitter && (
                  <a
                    href={streamer.socials.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-500 transition-colors hover:text-teal-400"
                  >
                    <TwitterIcon className="h-4 w-4" />
                  </a>
                )}
                {streamer.socials.github && (
                  <a
                    href={streamer.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-500 transition-colors hover:text-teal-400"
                  >
                    <GithubIcon className="h-4 w-4" />
                  </a>
                )}
                {streamer.socials.discord && (
                  <a
                    href={streamer.socials.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-500 transition-colors hover:text-teal-400"
                  >
                    <DiscordIcon className="h-4 w-4" />
                  </a>
                )}
              </div>
            )}
          </div>

          {streamer.schedule && (
            <div className="mt-1 flex items-center gap-2 text-sm text-zinc-400">
              <ClockIcon className="h-4 w-4 text-teal-400" />
              {streamer.schedule}
            </div>
          )}
        </div>
      </div>

      {streamer.bio && (
        <p className="mt-4 mb-6 text-sm text-zinc-400 line-clamp-4">
          {streamer.bio}
        </p>
      )}

      <a
        href={streamer.channelUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`absolute bottom-6 right-6 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all ${
          isLive
            ? "bg-red-500 text-white hover:bg-red-400 hover:shadow-lg hover:shadow-red-500/20"
            : "bg-gradient-to-r from-teal-500 to-cyan-500 text-black hover:from-teal-400 hover:to-cyan-400 hover:shadow-lg hover:shadow-teal-500/20"
        }`}
      >
        {isLive ? (
          <>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            Watch Live
          </>
        ) : (
          <>
            <YouTubeIcon className="h-4 w-4" />
            Watch
          </>
        )}
      </a>
    </article>
  );
}

export function StreamerSection({
  streamers,
  liveStatus,
}: {
  streamers: Streamer[];
  liveStatus: Record<string, boolean>;
}) {
  const sortedStreamers = [...streamers].sort((a, b) => {
    const aLive = liveStatus[a.channelId] ? 1 : 0;
    const bLive = liveStatus[b.channelId] ? 1 : 0;
    return bLive - aLive;
  });

  return (
    <motion.section
      id="streamers"
      className="mx-auto max-w-5xl px-6 py-20"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] as const }}
    >
      <div className="mb-12 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
          Streamer Directory
        </p>
        <h2 className="text-3xl font-bold text-zinc-100 sm:text-4xl">
          Find Your Vibe Coder
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-zinc-400">
          Discover streamers who build, teach, and create with good vibes.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {sortedStreamers.map((streamer, i) => (
          <motion.div
            key={streamer.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.4,
              delay: i * 0.05,
              ease: [0.4, 0, 0.2, 1] as const,
            }}
          >
            <StreamerCard
              streamer={streamer}
              isLive={!!liveStatus[streamer.channelId]}
            />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
