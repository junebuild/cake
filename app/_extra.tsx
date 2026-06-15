// Pre-route escape hatch — two endpoints on the Vercel Node runtime:
//
//   GET /api/activity  → a live "kitchen activity" feed over Server-Sent Events
//                        (the server half of june.build/docs/features-live-updates).
//   GET /api/visits    → a real, persistent visit counter backed by Turso (libsql).
//
// The visit counter is the Vercel + Turso experiment: a plain HTTPS libsql
// connection (url + token from the function's env) works on the Node runtime with
// no socket and no platform binding. @libsql/client/web is the pure-fetch client,
// so it bundles into the function (June's deploy ships one bundle, no node_modules).
import { createClient } from "@libsql/client/web";

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

// --- Turso (libsql) visit counter -------------------------------------------
// One client per warm instance (Fluid compute reuses instances). Credentials come
// from the function's environment — never bundled, never logged.
let client: ReturnType<typeof createClient> | undefined;
let schemaReady = false;

function turso() {
  if (!client) {
    client = createClient({
      url: process.env.TURSO_DATABASE_URL ?? "",
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  return client;
}

async function visitCounter(): Promise<Response> {
  if (!process.env.TURSO_DATABASE_URL) {
    return Response.json({ error: "TURSO_DATABASE_URL not configured" }, { status: 503 });
  }
  try {
    const c = turso();
    if (!schemaReady) {
      await c.execute("CREATE TABLE IF NOT EXISTS visits (id INTEGER PRIMARY KEY, count INTEGER NOT NULL DEFAULT 0)");
      await c.execute("INSERT OR IGNORE INTO visits (id, count) VALUES (1, 0)");
      schemaReady = true;
    }
    await c.execute("UPDATE visits SET count = count + 1 WHERE id = 1");
    const r = await c.execute("SELECT count FROM visits WHERE id = 1");
    const visits = Number((r.rows[0] as { count?: number | bigint })?.count ?? 0);
    return Response.json({ visits });
  } catch (err) {
    // Don't leak connection details — just the failure class.
    return Response.json({ error: "turso query failed", detail: String((err as Error).message) }, { status: 500 });
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
