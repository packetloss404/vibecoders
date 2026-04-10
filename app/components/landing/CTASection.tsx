"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export function CTASection() {
  return (
    <motion.section
      className="relative overflow-hidden px-6 py-24"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] as const }}
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full bg-teal-500/[0.08] blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold text-zinc-100 sm:text-4xl">
          Ready to join the grid?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-zinc-400">
          Discover streamers, connect with the community, and explore the BBS.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="#streamers"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500 px-8 py-3 text-sm font-semibold text-black shadow-[0_4px_30px_rgba(20,184,166,0.35)] transition-all hover:from-teal-400 hover:via-cyan-400 hover:to-emerald-400 hover:shadow-[0_4px_30px_rgba(20,184,166,0.5)]"
          >
            Explore Streams
          </Link>
          <Link
            href="/bbs"
            className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/[0.08] px-8 py-3 text-sm font-medium text-teal-300 transition-all hover:border-teal-500/45 hover:bg-teal-500/[0.15]"
          >
            Open BBS Terminal
          </Link>
        </div>

        {/* Community callout */}
        <div className="mt-16">
          <p className="text-sm uppercase tracking-wider text-zinc-500">
            Compiled and Promoted by:
          </p>
          <a
            href="https://discord.gg/VnszZzaZ"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex flex-col items-center gap-3 rounded-2xl border border-zinc-800/50 bg-zinc-900/80 px-8 py-6 backdrop-blur-sm transition-all hover:border-teal-500/30 hover:bg-zinc-900"
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
              <p className="text-lg font-semibold text-zinc-100">
                Vibecoding Bunker
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                Join the community on Discord
              </p>
            </div>
          </a>
        </div>
      </div>
    </motion.section>
  );
}
