# 🍫 Cake Site

A chocolate-cake recipe site where **one `route()` definition serves four
surfaces** — HTML for people, Markdown + JSON + `llms.txt` for agents. Built
with [June](https://june.build), the agent-ready React framework.

**Live (same build, two clouds):**
[recipe](https://june-cake.vercel.app/recipes/chocolate-cake) ·
[`.md`](https://june-cake.vercel.app/recipes/chocolate-cake.md) ·
[`.json`](https://june-cake.vercel.app/recipes/chocolate-cake.json) ·
[`llms.txt`](https://june-cake.vercel.app/llms.txt)

## The whole app

One file. `load()` runs once; each surface is a projection of the same data:

```tsx
export default route({
  load: (ctx) => RECIPES[ctx.params.slug],
  view: (r) => <article>…</article>,   // GET /recipes/chocolate-cake      → HTML
  json: (r) => r,                      // GET /recipes/chocolate-cake.json → data
  md:   (r) => `# ${r.title}\n…`,      // GET /recipes/chocolate-cake.md   → markdown
});
```

`llms.txt`, the sitemap, and an MCP endpoint derive from the routes
automatically — there's no second codebase for the machine surface, and
nothing to keep in sync by hand. See [`app/recipes/[slug]/page.tsx`](app/recipes/%5Bslug%5D/page.tsx).

## Run it

```bash
npm install
npm run dev        # the june CLI runs on Bun (https://bun.sh)

curl localhost:3000/recipes/chocolate-cake.md
curl localhost:3000/recipes/chocolate-cake.json
curl localhost:3000/llms.txt
```

## Deploy

```bash
june deploy         # → Cloudflare Workers (built-in)
./deploy-vercel.sh  # → Vercel Edge (15 lines of glue, same bundle)
```

Both run the **identical** `june build` output. The framework core is just
`fetch(Request) → Response`, so a deploy target is an adapter, not a rewrite.

## How the page stays light

The HTML is the content as semantic markup — no hydration, no client React
bundle, no serialized state (the only script is ~1KB of Speculation-Rules
prefetch for instant navigation). Styling is Tailwind v4 compiled at build
time into a single `<style>` block (`npm run styles` regenerates
`app/_styles.ts`).

---

Like the idea? A star on the framework helps a tiny 0.0.x project:
**[github.com/junebuild/june](https://github.com/junebuild/june)**
