"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const terminalLines = [
  "> connect bbs.packetloss404.com",
  "Connected to VibeBBS v3.2.1",
  "",
  "Welcome to the grid, vibe coder.",
  "",
  "[1] General Discussion",
  "[2] Project Showcase",
  "[3] AI & Tools",
  "[4] Off Topic",
  "",
  "Select board: _",
];

function TerminalTyping() {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (currentLine >= terminalLines.length) {
      setDone(true);
      return;
    }

    const line = terminalLines[currentLine];

    // Empty lines appear instantly
    if (line === "") {
      setDisplayedLines((prev) => [...prev, ""]);
      setCurrentLine((l) => l + 1);
      setCurrentChar(0);
      return;
    }

    if (currentChar < line.length) {
      const timer = setTimeout(() => {
        setDisplayedLines((prev) => {
          const next = [...prev];
          if (next.length <= currentLine) {
            next.push(line[currentChar]);
          } else {
            next[currentLine] = line.slice(0, currentChar + 1);
          }
          return next;
        });
        setCurrentChar((c) => c + 1);
      }, 35);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setCurrentLine((l) => l + 1);
        setCurrentChar(0);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentLine, currentChar]);

  return (
    <div className="font-mono text-sm leading-relaxed">
      {displayedLines.map((line, i) => (
        <div key={i} className={`min-h-[1.5em] ${i === 0 ? "text-teal-400" : "text-zinc-300"}`}>
          {line}
        </div>
      ))}
      {!done && (
        <motion.span
          className="inline-block h-4 w-2 bg-teal-400"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1.06, repeat: Infinity }}
        />
      )}
      {done && (
        <motion.span
          className="inline-block h-4 w-2 bg-teal-400"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1.06, repeat: Infinity }}
        />
      )}
    </div>
  );
}

export function BBSTeaser() {
  return (
    <motion.section
      className="mx-auto max-w-5xl px-6 py-20"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] as const }}
    >
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        {/* Terminal window */}
        <div className="order-2 lg:order-1">
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
            </div>
            {/* Terminal body */}
            <div className="p-5 min-h-[280px]">
              <TerminalTyping />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="font-mono text-xs text-zinc-500">
              telnet telnet.packetloss404.com
            </span>
            <button
              onClick={() =>
                navigator.clipboard?.writeText(
                  "telnet telnet.packetloss404.com"
                )
              }
              className="text-xs text-zinc-600 transition-colors hover:text-teal-400"
            >
              [copy]
            </button>
          </div>
        </div>

        {/* Text content */}
        <div className="order-1 lg:order-2">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            VibeBBS
          </p>
          <h2 className="text-3xl font-bold text-zinc-100 sm:text-4xl">
            Jack Into the Grid
          </h2>
          <p className="mt-4 text-zinc-400 leading-relaxed">
            Threaded discussions, retro aesthetics, modern accessibility. Browse
            boards, read threads, and post messages right from your browser — or
            connect via telnet for the full experience.
          </p>
          <p className="mt-3 text-zinc-500 text-sm">
            BBS activity feeds back into The Signal Board, surfacing trending
            threads to the wider community.
          </p>
          <Link
            href="/bbs"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500 px-6 py-2.5 text-sm font-semibold text-black shadow-[0_4px_30px_rgba(20,184,166,0.35)] transition-all hover:from-teal-400 hover:via-cyan-400 hover:to-emerald-400"
          >
            Enter the BBS
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
