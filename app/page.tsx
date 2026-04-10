"use client";

import { useEffect, useState } from "react";
import { streamers } from "./data/streamers";
import { Navbar } from "./components/landing/Navbar";
import { Hero } from "./components/landing/Hero";
import { StreamerSection } from "./components/landing/StreamerSection";
import { SignalPreview } from "./components/landing/SignalPreview";
import { BBSTeaser } from "./components/landing/BBSTeaser";
import { CTASection } from "./components/landing/CTASection";
import { DiscordIcon } from "./components/ui/Icons";

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
        // Silently fail
      }
    }

    fetchLiveStatus();
    const interval = setInterval(fetchLiveStatus, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const liveCount = Object.values(liveStatus).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-zinc-50">
      <Navbar />

      <main className="pt-14">
        <Hero liveCount={liveCount} totalStreamers={streamers.length} />

        {/* Divider */}
        <div className="mx-auto max-w-5xl px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
        </div>

        <StreamerSection streamers={streamers} liveStatus={liveStatus} />

        <div className="mx-auto max-w-5xl px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
        </div>

        <SignalPreview streamers={streamers} liveStatus={liveStatus} />

        <div className="mx-auto max-w-5xl px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
        </div>

        <BBSTeaser />

        <div className="mx-auto max-w-5xl px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
        </div>

        <CTASection />
      </main>

      <footer className="border-t border-zinc-800/50 py-8">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <span className="text-sm text-zinc-500">
              &copy; {new Date().getFullYear()} Vibe Social
            </span>
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
      </footer>
    </div>
  );
}
