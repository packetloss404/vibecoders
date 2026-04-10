"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

const WELCOME_SCREEN = `
╔══════════════════════════════════════════════════╗
║               Welcome to VibeBBS                 ║
║           The Vibe Coding Community BBS           ║
║                  v3.2.1                          ║
╚══════════════════════════════════════════════════╝

  Type HELP for commands, or select a board:

  [1] General Discussion     - Chat about anything
  [2] Project Showcase       - Show what you've built
  [3] AI & Tools             - Latest AI coding tools
  [4] Stream Highlights      - Best moments from streams
  [5] Off Topic              - Everything else

`;

const HELP_TEXT = `
Available commands:
  HELP          - Show this help message
  LIST          - List all boards
  READ <n>      - Read board number <n>
  WHO           - Show online users
  CLEAR         - Clear screen
  ABOUT         - About VibeBBS

`;

const BOARD_CONTENT: Record<string, string> = {
  "1": `
━━━ General Discussion ━━━

  [NEW] dyoburon: Anyone else excited about Claude's new
        features? The tool use is insane.
        └─ 12 replies │ 2h ago

  [HOT] khuur: What's your vibe coding setup? Share your
        desk pics!
        └─ 34 replies │ 6h ago

  [   ] Quad H: Building a game engine live on stream
        tomorrow. Come hang!
        └─ 8 replies │ 1d ago

Type BACK to return.
`,
  "2": `
━━━ Project Showcase ━━━

  [NEW] Jordan Lee: Just launched my AI automation tool
        for small businesses. 100% vibe coded!
        └─ 18 replies │ 4h ago

  [HOT] Enterprise Vibe Code: Open source DevOps
        dashboard - built entirely with AI assistants
        └─ 27 replies │ 12h ago

  [   ] BridgeMind: BridgeMind v2.0 is live. Third
        startup, biggest launch yet.
        └─ 15 replies │ 2d ago

Type BACK to return.
`,
  "3": `
━━━ AI & Tools ━━━

  [NEW] Nate Needham: The gap between idea and product
        has officially disappeared. Here's proof.
        └─ 22 replies │ 1h ago

  [HOT] Clearmud: Data-driven comparison of AI coding
        assistants - the results surprised me
        └─ 41 replies │ 8h ago

  [   ] André Mikalsen: Stop making demos, start making
        products. Here's my framework.
        └─ 19 replies │ 1d ago

Type BACK to return.
`,
  "4": `
━━━ Stream Highlights ━━━

  [NEW] Dubibubii: Business diary update - revenue
        crossed $5k/mo mark!
        └─ 31 replies │ 3h ago

  [   ] Bilbro: That moment when the AI wrote better
        code than me... clip inside
        └─ 14 replies │ 1d ago

Type BACK to return.
`,
  "5": `
━━━ Off Topic ━━━

  [HOT] Community: Best coffee for late night coding
        sessions? ☕
        └─ 56 replies │ 2h ago

  [   ] Random: Anyone going to the vibe coding meetup
        in Austin?
        └─ 9 replies │ 3d ago

Type BACK to return.
`,
};

const WHO_TEXT = `
Online users (7):
  ● dyoburon        - lurking
  ● khuur           - reading AI & Tools
  ● Quad_H          - posting in General
  ● guest_42        - browsing
  ● vibe_coder_99   - reading Project Showcase
  ● nate_n          - posting in AI & Tools
  ● bridgemind_dev  - lurking

`;

const ABOUT_TEXT = `
╔══════════════════════════════════════════════════╗
║                 About VibeBBS                    ║
╠══════════════════════════════════════════════════╣
║  VibeBBS is the community bulletin board for     ║
║  the vibe coding movement. A place for deeper    ║
║  discussions, project showcases, and connecting  ║
║  beyond the stream.                              ║
║                                                  ║
║  Web: vibebbs.io                                 ║
║  Telnet: telnet://vibebbs.io:23                  ║
║  Part of the Vibe Social ecosystem               ║
╚══════════════════════════════════════════════════╝

`;

export function BBSTerminal() {
  const [lines, setLines] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [ready, setReady] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initial typing animation
  useEffect(() => {
    const connectLines = [
      "> connect vibebbs.io",
      "Connecting...",
      "Connected to VibeBBS v3.2.1",
    ];

    let lineIndex = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    function addLine() {
      if (lineIndex < connectLines.length) {
        setLines((prev) => [...prev, connectLines[lineIndex]]);
        lineIndex++;
        timers.push(setTimeout(addLine, 500));
      } else {
        // Show welcome screen
        timers.push(
          setTimeout(() => {
            setLines((prev) => [...prev, ...WELCOME_SCREEN.split("\n")]);
            setReady(true);
          }, 300)
        );
      }
    }

    timers.push(setTimeout(addLine, 500));
    return () => timers.forEach(clearTimeout);
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const handleCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim().toUpperCase();
    setLines((prev) => [...prev, `> ${cmd}`]);

    if (trimmed === "HELP") {
      setLines((prev) => [...prev, ...HELP_TEXT.split("\n")]);
    } else if (trimmed === "LIST") {
      setLines((prev) => [
        ...prev,
        "",
        "Boards:",
        "  [1] General Discussion",
        "  [2] Project Showcase",
        "  [3] AI & Tools",
        "  [4] Stream Highlights",
        "  [5] Off Topic",
        "",
      ]);
    } else if (
      trimmed === "1" ||
      trimmed === "2" ||
      trimmed === "3" ||
      trimmed === "4" ||
      trimmed === "5" ||
      trimmed.startsWith("READ ")
    ) {
      const num = trimmed.startsWith("READ ")
        ? trimmed.replace("READ ", "")
        : trimmed;
      const content = BOARD_CONTENT[num];
      if (content) {
        setLines((prev) => [...prev, ...content.split("\n")]);
      } else {
        setLines((prev) => [...prev, `Board ${num} not found.`]);
      }
    } else if (trimmed === "WHO") {
      setLines((prev) => [...prev, ...WHO_TEXT.split("\n")]);
    } else if (trimmed === "ABOUT") {
      setLines((prev) => [...prev, ...ABOUT_TEXT.split("\n")]);
    } else if (trimmed === "CLEAR") {
      setLines([]);
    } else if (trimmed === "BACK") {
      setLines((prev) => [...prev, ...WELCOME_SCREEN.split("\n")]);
    } else if (trimmed === "") {
      // do nothing
    } else {
      setLines((prev) => [
        ...prev,
        `Unknown command: ${cmd}. Type HELP for available commands.`,
      ]);
    }
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ready) return;
    handleCommand(input);
    setInput("");
  }

  return (
    <div
      className="flex flex-col overflow-hidden rounded-none border border-zinc-700/50 bg-[#060e1b]"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Terminal header */}
      <div className="flex items-center gap-2 border-b border-zinc-700/50 bg-zinc-900/80 px-4 py-2.5">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-500/80" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <div className="h-3 w-3 rounded-full bg-green-500/80" />
        </div>
        <span className="ml-2 text-xs text-zinc-500 font-mono">
          vibebbs.io — VibeBBS Terminal
        </span>
        <div className="ml-auto flex items-center gap-1">
          <div
            className={`h-2 w-2 rounded-full ${
              ready ? "bg-green-500" : "bg-yellow-500 animate-pulse"
            }`}
          />
          <span className="text-[10px] text-zinc-500">
            {ready ? "Connected" : "Connecting..."}
          </span>
        </div>
      </div>

      {/* Terminal body */}
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-sm leading-relaxed min-h-[400px] max-h-[600px]"
      >
        {lines.map((line, i) => {
          const text = line ?? "";
          return (
            <div
              key={i}
              className={
                text.startsWith(">")
                  ? "text-teal-400"
                  : text.includes("[NEW]")
                    ? "text-emerald-300"
                    : text.includes("[HOT]")
                      ? "text-amber-300"
                      : text.includes("═") || text.includes("║") || text.includes("╔") || text.includes("╚") || text.includes("╠") || text.includes("╗") || text.includes("╝") || text.includes("╣") || text.includes("━")
                        ? "text-teal-400/70"
                        : "text-zinc-300"
              }
            >
              {text || "\u00A0"}
            </div>
          );
        })}

        {/* Input line */}
        {ready && (
          <form onSubmit={handleSubmit} className="flex items-center mt-1">
            <span className="text-teal-400 mr-1">&gt;</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent text-zinc-300 font-mono text-sm outline-none caret-teal-400"
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
            <motion.span
              className="inline-block h-4 w-2 bg-teal-400 ml-0.5"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1.06, repeat: Infinity }}
            />
          </form>
        )}

        {!ready && (
          <motion.span
            className="inline-block h-4 w-2 bg-teal-400"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1.06, repeat: Infinity }}
          />
        )}
      </div>
    </div>
  );
}
