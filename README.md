# 🍫 Cake Site

A chocolate-cake recipe site where **one page serves four surfaces** — HTML
for people, Markdown + JSON + `llms.txt` for agents. Built with
[June](https://june.build), the agent-ready React framework.

**Live (same build, two clouds):**
[recipe](https://june-cake.vercel.app/recipes/chocolate-cake) ·
[`.md`](https://june-cake.vercel.app/recipes/chocolate-cake.md) ·
[`.json`](https://june-cake.vercel.app/recipes/chocolate-cake.json) ·
[`llms.txt`](https://june-cake.vercel.app/llms.txt)

## The whole app

The loader runs once; each surface is a projection of the same data. The
default export is the view; named exports configure the rest:

```tsx
// app/recipes/[slug]/page.tsx
export const loader = (ctx) => ({ recipe: RECIPES[ctx.params.slug] });

export default function Page({ recipe }) {                 // → HTML
  return <RecipePage recipe={recipe} />;
}

export const json = ({ recipe }) => recipe;                // → .json
export const md   = ({ recipe }) => `# ${recipe.title}\n…`; // → .md
```

Three small files, one per concern:
[`recipes.ts`](app/recipes/%5Bslug%5D/recipes.ts) (data) ·
[`RecipePage.tsx`](app/recipes/%5Bslug%5D/RecipePage.tsx) (view) ·
[`page.tsx`](app/recipes/%5Bslug%5D/page.tsx) (the route).

`llms.txt`, the sitemap, and an MCP endpoint derive from the routes
automatically — there's no second codebase for the machine surface, and
nothing to keep in sync by hand.

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
june deploy          # → Cloudflare Workers (the default adapter)
june deploy --prod   # → Vercel Edge — set deploy.adapter: vercel() in june.config.ts
```

The target is the **adapter**, not a rewrite: `vercel()` (from `@junejs/server`)
emits the Vercel Build Output API straight from the same `june build` bundle —
the framework core is just `fetch(Request) → Response`, so the identical worker
runs on Cloudflare Workers and Vercel Edge.

## How the page stays light

The HTML is the content as semantic markup — no hydration, no client React
bundle, no serialized state (the only script is ~1KB of Speculation-Rules
prefetch for instant navigation). Styling is Tailwind v4 compiled at build
time into a single `<style>` block (`npm run styles` regenerates
`app/_styles.ts`).

---

Like the idea? A star on the framework helps a tiny 0.0.x project:
**[github.com/junebuild/june](https://github.com/junebuild/june)**
