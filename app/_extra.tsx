// Pre-route escape hatch: a live "kitchen activity" feed over Server-Sent Events,
// mounted at GET /api/activity. This is the server half of the Live-updates how-to
// (june.build/docs/features-live-updates) made real on Vercel's edge runtime.
//
// It is written to SHOW the cost shape, not just to stream: between ticks the
// handler is parked on a timer (no active CPU — you only pay edge memory-time
// while the connection is held), it closes itself before Vercel's streaming cap
// so the browser's EventSource reconnects cleanly, and it tears down immediately
// when the client navigates away or closes the tab (request.signal abort).
//
// The events are simulated (a recipe demo has no real kitchen) — the mechanism is
// what's real: idle-cheap push + a connection the client keeps alive across morph
// navigations via a <Island persist>.

const MESSAGES = [
  "🧁 someone saved Carrot Cake",
  "🍫 Chocolate Cake came out of the oven",
  "🥕 grating carrots for batch #2",
  "⏲️ 170°C — 40 minutes to go",
  "🧈 cream-cheese frosting whipped",
  "🍰 a slice was served",
];

// Vercel edge streams for up to 300s; close a little early so the reconnect is
// clean rather than a hard cutoff. EventSource auto-reconnects with the retry hint.
const SESSION_MS = 250_000;
const TICK_MS = 4000;

export default async function extra(request: Request, url: URL): Promise<Response | null> {
  if (url.pathname !== "/api/activity") return null; // not ours → fall through to routing

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

      // First byte immediately (edge requires the response to start < 25s) — set
      // the client's reconnect backoff and announce the connection.
      controller.enqueue(encoder.encode("retry: 3000\n\n"));
      send({ text: "🔴 live feed connected", at: started });

      const tick = () => {
        if (Date.now() - started > SESSION_MS) return stop(); // bounded session → reconnect
        send({ text: MESSAGES[i++ % MESSAGES.length], at: Date.now() });
        timer = setTimeout(tick, TICK_MS); // parked here between ticks: no active CPU
      };
      timer = setTimeout(tick, TICK_MS);

      // Client navigated away / closed the tab → release the connection at once,
      // so we stop accruing memory-time the moment nobody is listening.
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
