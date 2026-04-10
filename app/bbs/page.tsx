"use client";

import { motion } from "framer-motion";
import { Navbar } from "../components/landing/Navbar";
import { DiscordIcon } from "../components/ui/Icons";

export default function BBSPage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-zinc-50">
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            VibeBBS
          </p>
          <h1 className="text-3xl font-bold text-zinc-100 sm:text-4xl">
            Jack Into the Grid
          </h1>
          <p className="mt-3 text-zinc-400">
            Browse boards, read threads, and explore the BBS right from your
            browser — or connect via telnet for the full experience.
          </p>
        </motion.div>

        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="overflow-hidden rounded-none border border-zinc-700/50 bg-[#060e1b]">
            {/* Terminal header */}
            <div className="flex items-center gap-2 border-b border-zinc-700/50 bg-zinc-900/80 px-4 py-2.5">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
              </div>
              <span className="ml-2 text-xs text-zinc-500 font-mono">
                bbs.packetloss404.com
              </span>
              <div className="ml-auto flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-[10px] text-zinc-500">Connected</span>
              </div>
            </div>

            {/* BBS iframe */}
            <iframe
              src="https://bbs.packetloss404.com"
              className="w-full border-0"
              style={{ height: "600px" }}
              title="VibeBBS"
              allow="clipboard-write"
            />
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-zinc-500">
                telnet telnet.packetloss404.com
              </span>
              <button
                onClick={() =>
                  navigator.clipboard?.writeText(
                    "telnet telnet.packetloss404.com"
                  )
                }
                className="rounded border border-zinc-700/50 bg-zinc-800/50 px-2 py-0.5 text-[10px] text-zinc-500 transition-colors hover:text-teal-400 hover:border-teal-500/30"
              >
                Copy
              </button>
            </div>
            <p className="text-xs text-zinc-600">
              For the full experience, connect via your favorite telnet client.
            </p>
          </div>
        </motion.div>
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
