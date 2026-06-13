// One <style> block of build-time-compiled Tailwind. Zero JS, no hydration —
// view-source stays clean. (June's build-integrated Tailwind story is on the
// roadmap; until then: `npm run styles` recompiles app/_styles.ts.)
import { css } from "./_styles";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-amber-50 text-stone-900 antialiased">
      <style>{css}</style>
      <header className="mx-auto max-w-2xl px-6 pt-10 pb-2">
        <a href="/" className="text-sm font-semibold tracking-widest uppercase text-amber-700">
          Cake Site
        </a>
      </header>
      <main className="mx-auto max-w-2xl px-6 py-8">{children}</main>
      <footer className="mx-auto max-w-2xl px-6 py-10 text-sm text-stone-400">
        Built with June — this page is also <a className="underline" href="/recipes/chocolate-cake.md">markdown</a> and{" "}
        <a className="underline" href="/recipes/chocolate-cake.json">JSON</a>.
      </footer>
    </div>
  );
}
