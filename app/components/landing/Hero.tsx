"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const },
  },
};

const statVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] as const },
  },
};

export function Hero({
  liveCount,
  totalStreamers,
}: {
  liveCount: number;
  totalStreamers: number;
}) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-6 py-24">
      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-teal-500/[0.07] blur-[100px]"
          animate={{ opacity: [0.05, 0.12, 0.05] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-cyan-500/[0.07] blur-[100px]"
          animate={{ opacity: [0.08, 0.15, 0.08] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-teal-400/[0.04] blur-[80px]"
          animate={{ opacity: [0.03, 0.08, 0.03] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
        />
      </div>

      <motion.div
        className="relative z-10 mx-auto max-w-4xl text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.p
          className="mb-6 text-xs font-semibold uppercase tracking-[0.25em] bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent"
          variants={itemVariants}
        >
          Vibe Social
        </motion.p>

        <motion.h1
          className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl"
          variants={itemVariants}
        >
          <span className="text-zinc-100">Your portal to the</span>
          <br />
          <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            vibe coding universe.
          </span>
        </motion.h1>

        <motion.p
          className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400"
          variants={itemVariants}
        >
          Discover streams. Explore the BBS. Connect with the community building
          the future, one vibe at a time.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          variants={itemVariants}
        >
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
        </motion.div>

        {/* Stat widgets */}
        <motion.div
          className="mt-16 flex flex-col items-center justify-center gap-4 sm:flex-row"
          variants={containerVariants}
        >
          <motion.div
            className="flex min-w-[140px] flex-col items-center rounded-2xl border border-red-500/20 bg-red-500/[0.06] px-6 py-4 backdrop-blur-sm"
            variants={statVariants}
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-red-400">
              Live Now
            </span>
            <span className="mt-1 text-2xl font-bold text-zinc-100">
              {liveCount}
            </span>
          </motion.div>
          <motion.div
            className="flex min-w-[140px] flex-col items-center rounded-2xl border border-teal-500/20 bg-teal-500/[0.06] px-6 py-4 backdrop-blur-sm"
            variants={statVariants}
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-teal-400">
              Streamers
            </span>
            <span className="mt-1 text-2xl font-bold text-zinc-100">
              {totalStreamers}
            </span>
          </motion.div>
          <motion.div
            className="flex min-w-[140px] flex-col items-center rounded-2xl border border-cyan-500/20 bg-cyan-500/[0.06] px-6 py-4 backdrop-blur-sm"
            variants={statVariants}
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-cyan-400">
              Community
            </span>
            <span className="mt-1 text-2xl font-bold text-zinc-100">
              Growing
            </span>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <motion.div
          className="h-8 w-5 rounded-full border-2 border-zinc-600 p-1"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="h-1.5 w-1.5 rounded-full bg-teal-400"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
