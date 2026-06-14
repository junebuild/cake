// One <style> block of build-time-compiled Tailwind. (`npm run styles`
// recompiles app/_styles.ts.) The header carries one client ISLAND (SaveButton)
// inside the swap region, so a morph navigation preserves its state.
import { css } from "./_styles";
import { Island } from "@junejs/core/islands";

import { SaveButton } from "./SaveButton";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-amber-50 text-stone-900 antialiased">
      <style>{css}</style>
      <header className="mx-auto flex max-w-2xl items-baseline justify-between px-6 pt-10 pb-2">
        <a href="/" className="text-sm font-semibold tracking-widest uppercase text-amber-700">
          Cake Site
        </a>
        <Island name="SaveButton" component={SaveButton} persist />
      </header>
      <main className="mx-auto max-w-2xl px-6 py-8">{children}</main>
      <footer className="mx-auto max-w-2xl px-6 py-10 text-sm text-stone-400">
        Built with June — this page is also <a className="underline" href="/recipes/chocolate-cake.md">markdown</a> and{" "}
        <a className="underline" href="/recipes/chocolate-cake.json">JSON</a>.
      </footer>
    </div>
  );
}
