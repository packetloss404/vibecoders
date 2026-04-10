"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { streamers } from "./data/streamers";

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 border border-red-500/30 px-2.5 py-0.5 text-xs font-bold text-red-400 uppercase tracking-wide">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
      </span>
      Live
    </span>
  );
}

export default function Home() {
  const [liveStatus, setLiveStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchLiveStatus() {
      try {
        const res = await fetch("/api/live-status");
        if (res.ok) {
          const data = await res.json();
          setLiveStatus(data);
        }
      } catch {
        // Silently fail — live badges just won't show
      }
    }

    fetchLiveStatus();
    const interval = setInterval(fetchLiveStatus, 3 * 60 * 1000); // Poll every 3 minutes
    return () => clearInterval(interval);
  }, []);

  // Sort: live streamers first
  const sortedStreamers = [...streamers].sort((a, b) => {
    const aLive = liveStatus[a.channelId] ? 1 : 0;
    const bLive = liveStatus[b.channelId] ? 1 : 0;
    return bLive - aLive;
  });

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-zinc-50">
      <header className="border-b border-zinc-800/50 bg-gradient-to-r from-[#0f0f0f] via-zinc-900 to-[#0f0f0f] px-6 py-6">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Vibe Coders
            </span>
          </h1>
          <p className="mt-2 text-base text-zinc-400">
            Streamers who code with good vibes
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-6 sm:grid-cols-2">
          {sortedStreamers.map((streamer) => {
            const isLive = liveStatus[streamer.channelId];
            return (
              <article
                key={streamer.name}
                className={`group relative min-h-56 overflow-hidden rounded-2xl border p-6 pb-16 backdrop-blur-sm transition-all ${
                  isLive
                    ? "border-red-500/30 bg-zinc-900/80 hover:border-red-500/50 hover:bg-zinc-900"
                    : "border-zinc-800/50 bg-zinc-900/80 hover:border-zinc-700/50 hover:bg-zinc-900"
                }`}
              >
                <div className="flex items-start gap-4">
                  {streamer.avatarUrl && (
                    <div className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full ring-2 transition-all ${
                      isLive
                        ? "ring-red-500/50 group-hover:ring-red-500/70"
                        : "ring-zinc-800 group-hover:ring-teal-500/50"
                    }`}>
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
                        <h2 className="text-xl font-semibold">{streamer.name}</h2>
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
                        <svg className="h-4 w-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
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
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                      Watch
                    </>
                  )}
                </a>
              </article>
            );
          })}
        </div>

        <div className="mt-16 flex flex-col items-center">
          <p className="text-sm uppercase tracking-wider text-zinc-500">
            Compiled and Promoted by:
          </p>
          <a
            href="https://discord.gg/VnszZzaZ"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex flex-col items-center gap-3 rounded-2xl border border-zinc-800/50 bg-zinc-900/80 px-8 py-6 backdrop-blur-sm transition-all hover:border-teal-500/30 hover:bg-zinc-900"
          >
            <div className="relative h-16 w-16 overflow-hidden rounded-full ring-2 ring-zinc-800 transition-all hover:ring-teal-500/30">
              <Image
                src="https://cdn.discordapp.com/icons/1477335952035807444/6d2baf5d2c8d93ea64ed08b837e0ee34.png"
                alt="Vibecoding Bunker"
                fill
                className="object-cover"
              />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">Vibecoding Bunker</p>
              <p className="mt-1 text-sm text-zinc-400">Join the community on Discord</p>
            </div>
          </a>
        </div>
      </main>

      <footer className="border-t border-zinc-800/50 py-8">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-3">
              <span className="text-sm text-zinc-500">
                &copy; {new Date().getFullYear()} Vibe Coders
              </span>
            </div>
            <div className="flex items-center gap-6">
              <a
                href="https://discord.gg/VnszZzaZ"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-teal-400"
              >
                <DiscordIcon className="h-4 w-4" />
                Join Discord
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
