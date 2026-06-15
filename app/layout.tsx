// Styling is app/global.css (`@import "tailwindcss"`) — June auto-links it as a
// content-hashed, minified, immutable stylesheet; no <style> block, no manual
// compile step. The header carries two client ISLANDS, both `persist`: SaveButton
// (in-memory state) and StatusFeed (a live SSE connection). A morph navigation
// preserves both — the ♥ count holds AND the feed keeps streaming without
// reconnecting.
import { Island } from "@junejs/core/islands";

import { SaveButton } from "./SaveButton";
import { StatusFeed } from "./StatusFeed";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-amber-50 text-stone-900 antialiased">
      <header className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-6 pt-10 pb-2">
        <a href="/" className="shrink-0 text-sm font-semibold tracking-widest uppercase text-amber-700">
          Cake Site
        </a>
        <div className="flex items-center gap-3">
          <Island name="StatusFeed" component={StatusFeed} persist />
          <Island name="SaveButton" component={SaveButton} persist />
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-6 py-8">{children}</main>
      <footer className="mx-auto max-w-2xl px-6 py-10 text-sm text-stone-400">
        Built with June — this page is also <a className="underline" href="/recipes/chocolate-cake.md">markdown</a> and{" "}
        <a className="underline" href="/recipes/chocolate-cake.json">JSON</a>.
      </footer>
    </div>
  );
}
