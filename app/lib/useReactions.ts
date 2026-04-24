import { useCallback, useEffect, useRef, useState } from "react";

// Client hook — imported by the "use client" SignalFeed component.
// Hook files themselves don't need the "use client" directive; only the
// component module that owns the client boundary does.

interface ReactionsResponse {
  eventId: string;
  reactions: Record<string, number>;
}

const DEBOUNCE_MS = 200;

export function useReactions(eventId: string): {
  reactions: Record<string, number>;
  react: (emoji: string) => void;
  loading: boolean;
} {
  const [reactions, setReactions] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  // Track the latest state in a ref so async callbacks can read without
  // re-binding on every render.
  const reactionsRef = useRef<Record<string, number>>({});
  reactionsRef.current = reactions;

  // Per-emoji debounce timers + pending click counts to coalesce rapid bursts
  // for a single trailing network send. We still fire one POST per burst
  // (not per click) to avoid hammering the server — the spec allows batching.
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const pendingRef = useRef<Map<string, number>>(new Map());

  // Guard against setState after unmount.
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    let cancelled = false;
    setLoading(true);

    async function load() {
      try {
        const res = await fetch(
          `/api/reactions?eventId=${encodeURIComponent(eventId)}`,
        );
        if (!res.ok) throw new Error(`status ${res.status}`);
        const data = (await res.json()) as ReactionsResponse;
        if (cancelled || !mountedRef.current) return;
        setReactions(data.reactions ?? {});
      } catch {
        if (cancelled || !mountedRef.current) return;
        // Leave empty on error, per spec.
        setReactions({});
      } finally {
        if (!cancelled && mountedRef.current) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
      mountedRef.current = false;
      // Clear any outstanding debounce timers on unmount.
      for (const timer of timersRef.current.values()) {
        clearTimeout(timer);
      }
      timersRef.current.clear();
      pendingRef.current.clear();
    };
  }, [eventId]);

  const flush = useCallback(
    async (emoji: string) => {
      const count = pendingRef.current.get(emoji) ?? 0;
      pendingRef.current.delete(emoji);
      timersRef.current.delete(emoji);
      if (count <= 0) return;

      try {
        const res = await fetch(`/api/reactions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eventId, emoji }),
        });
        if (!res.ok) throw new Error(`status ${res.status}`);
        const data = (await res.json()) as ReactionsResponse;
        if (!mountedRef.current) return;
        setReactions(data.reactions ?? {});
      } catch (err) {
        // Roll back the optimistic increment we applied on click.
        if (mountedRef.current) {
          setReactions((prev) => {
            const current = prev[emoji] ?? 0;
            const next = Math.max(0, current - count);
            const copy = { ...prev };
            if (next === 0) {
              delete copy[emoji];
            } else {
              copy[emoji] = next;
            }
            return copy;
          });
        }
        console.error("useReactions: failed to persist reaction", err);
      }
    },
    [eventId],
  );

  const react = useCallback(
    (emoji: string) => {
      // Optimistic update — bump immediately so the UI feels instant.
      setReactions((prev) => ({
        ...prev,
        [emoji]: (prev[emoji] ?? 0) + 1,
      }));

      // Coalesce bursts within DEBOUNCE_MS into one network call.
      pendingRef.current.set(emoji, (pendingRef.current.get(emoji) ?? 0) + 1);

      const existing = timersRef.current.get(emoji);
      if (existing) clearTimeout(existing);

      const timer = setTimeout(() => {
        void flush(emoji);
      }, DEBOUNCE_MS);
      timersRef.current.set(emoji, timer);
    },
    [flush],
  );

  return { reactions, react, loading };
}
