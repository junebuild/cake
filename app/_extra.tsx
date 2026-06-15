// Pre-route escape hatch — two endpoints on the Vercel Node runtime:
//
//   GET /api/activity  → a live "kitchen activity" feed over Server-Sent Events
//                        (the server half of june.build/docs/features-live-updates).
//   GET /api/visits    → a real, persistent visit counter on Turso, reached through
//                        June's AMBIENT db — no client, no credentials here.
//
// The visit counter is the whole data story in five lines: `import { db }` and
// query. june.config.ts declared `db: turso()`; June opened it from the env and
// runs every request in its scope, so `db` just works. The SAME code on Workers
// would talk to D1 — the declaration is the only thing that changes.
import { db } from "@junejs/db";

const MESSAGES = [
  "🧁 someone saved Carrot Cake",
  "🍫 Chocolate Cake came out of the oven",
  "🥕 grating carrots for batch #2",
  "⏲️ 170°C — 40 minutes to go",
  "🧈 cream-cheese frosting whipped",
  "🍰 a slice was served",
];

// Vercel streams for up to 300s; close a little early so the reconnect is clean
// rather than a hard cutoff. EventSource auto-reconnects with the retry hint.
const SESSION_MS = 250_000;
const TICK_MS = 4000;

// --- visit counter, via the ambient db --------------------------------------
let schemaReady = false;

async function visitCounter(): Promise<Response> {
  try {
    if (!schemaReady) {
      await db.exec("CREATE TABLE IF NOT EXISTS visits (id INTEGER PRIMARY KEY, count INTEGER NOT NULL DEFAULT 0)");
      await db.run("INSERT OR IGNORE INTO visits (id, count) VALUES (1, 0)");
      schemaReady = true;
    }
    await db.run("UPDATE visits SET count = count + 1 WHERE id = 1");
    const row = await db.get<{ count: number | bigint }>("SELECT count FROM visits WHERE id = 1");
    return Response.json({ visits: Number(row?.count ?? 0) });
  } catch (err) {
    return Response.json({ error: "db query failed", detail: String((err as Error).message) }, { status: 500 });
  }
}

// --- Live activity feed (SSE) -----------------------------------------------
function activityFeed(request: Request): Response {
  const encoder = new TextEncoder();
  const started = Date.now();
  let i = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const send = (data: unknown) =>
        controller.enqueue(encoder.encode(`event: activity\ndata: ${JSON.stringify(data)}\n\n`));
      const stop = () => {
        if (timer) clearTimeout(timer);
        timer = undefined;
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      };

      // First byte immediately — set the client's reconnect backoff and announce.
      controller.enqueue(encoder.encode("retry: 3000\n\n"));
      send({ text: "🔴 live feed connected", at: started });

      const tick = () => {
        if (Date.now() - started > SESSION_MS) return stop(); // bounded session → reconnect
        send({ text: MESSAGES[i++ % MESSAGES.length], at: Date.now() });
        timer = setTimeout(tick, TICK_MS); // parked here between ticks: no active CPU
      };
      timer = setTimeout(tick, TICK_MS);

      // Client navigated away / closed the tab → release the connection at once.
      request.signal.addEventListener("abort", stop);
    },
    cancel() {
      if (timer) clearTimeout(timer);
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      "x-accel-buffering": "no", // defeat proxy buffering so events arrive live
    },
  });
}

export default async function extra(request: Request, url: URL): Promise<Response | null> {
  if (url.pathname === "/api/visits") return visitCounter();
  if (url.pathname === "/api/activity") return activityFeed(request);
  return null; // not ours → fall through to routing
}
