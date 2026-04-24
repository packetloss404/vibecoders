"use client";

import { Navbar } from "../components/landing/Navbar";

export default function BBSPage() {
  return (
    <div className="h-screen overflow-hidden bg-[#0f0f0f] text-zinc-50">
      <Navbar />

      <main className="mt-14 h-[calc(100vh-3.5rem)] mx-auto w-full max-w-7xl px-4 py-3 flex flex-col">
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden rounded border border-zinc-700/50 bg-[#060e1b]">
          {/* Terminal chrome */}
          <div className="flex flex-shrink-0 items-center gap-2 border-b border-zinc-700/50 bg-zinc-900/80 px-4 py-2">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <div className="h-3 w-3 rounded-full bg-green-500/80" />
            </div>
            <span className="ml-2 font-mono text-xs text-zinc-500">
              bbs.packetloss404.com
            </span>
            <div className="ml-auto flex items-center gap-3">
              <button
                onClick={() =>
                  navigator.clipboard?.writeText(
                    "telnet telnet.packetloss404.com",
                  )
                }
                className="font-mono text-[11px] text-zinc-500 transition-colors hover:text-teal-400"
                title="Copy telnet command"
              >
                telnet telnet.packetloss404.com
              </button>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-[10px] text-zinc-500">Connected</span>
              </div>
            </div>
          </div>

          <iframe
            src="https://bbs.packetloss404.com"
            className="flex-1 w-full border-0 block"
            scrolling="no"
            title="VibeBBS"
            allow="clipboard-write"
          />
        </div>
      </main>
    </div>
  );
}
