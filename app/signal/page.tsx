"use client";

import { motion } from "framer-motion";
import { Navbar } from "../components/landing/Navbar";
import { SignalFeed } from "../components/signal/SignalFeed";
import { DiscordIcon } from "../components/ui/Icons";

export default function SignalPage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-zinc-50">
      <Navbar />

      <main className="mx-auto max-w-2xl px-6 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            The Signal Board
          </p>
          <h1 className="text-3xl font-bold text-zinc-100 sm:text-4xl">
            Community Pulse
          </h1>
          <p className="mt-3 text-zinc-400">
            Real-time activity from the vibe coding community. Live alerts, new
            streamers, and trending BBS threads.
          </p>
        </motion.div>

        <div className="mt-10">
          <SignalFeed />
        </div>
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
