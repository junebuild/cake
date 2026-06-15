// A live island in the header. It opens a Server-Sent Events connection to
// /api/activity (the server half lives in app/_extra.tsx) and shows the latest
// kitchen event with a pulsing "live" dot.
//
// Two things to watch when you click between recipes:
//   1. the connection does NOT reconnect — because this island is <... persist>,
//      clientRouter carries the live node (and its open EventSource) across the
//      morph navigation instead of tearing it down;
//   2. the event count keeps climbing — the accumulated state survives too.
//
// EventSource lives entirely inside useEffect, so the server-rendered markup is
// just the "connecting…" shell; nothing runs until the browser hydrates it.
import { useEffect, useState } from "react";

type Activity = { text: string; at: number };

export function StatusFeed() {
  const [latest, setLatest] = useState<Activity | null>(null);
  const [count, setCount] = useState(0);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const es = new EventSource("/api/activity");
    es.addEventListener("open", () => setLive(true));
    es.addEventListener("error", () => setLive(false)); // EventSource auto-reconnects
    es.addEventListener("activity", (e) => {
      const a = JSON.parse((e as MessageEvent).data) as Activity;
      setLatest(a);
      setCount((n) => n + 1);
    });
    return () => es.close();
  }, []);

  return (
    <span
      className="inline-flex max-w-[14rem] items-center gap-2 rounded-full bg-white px-3 py-1 text-xs text-stone-500 ring-1 ring-stone-900/5"
      title={`${count} live events this session`}
    >
      <span
        aria-hidden
        className={`h-2 w-2 shrink-0 rounded-full ${live ? "animate-pulse bg-red-500" : "bg-stone-300"}`}
      />
      <span className="truncate">{latest ? latest.text : "connecting…"}</span>
      {count > 0 && <span className="shrink-0 tabular-nums text-stone-400">· {count}</span>}
    </span>
  );
}
