"use client";

export function LiveBadge({ size = "md" }: { size?: "sm" | "md" }) {
  const dotSize = size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2";
  const padding = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-red-500/15 border border-red-500/30 ${padding} font-bold text-red-400 uppercase tracking-wide`}
    >
      <span className={`relative flex ${dotSize}`}>
        <span
          className={`absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75`}
        />
        <span className={`relative inline-flex ${dotSize} rounded-full bg-red-500`} />
      </span>
      Live
    </span>
  );
}
