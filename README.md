# 🍰 Cake Site

A cake-recipe site where **one page serves four surfaces** — HTML for people,
Markdown + JSON + `llms.txt` for agents — and adds an interactive layer (morph
navigation + a live feed) only where it earns one. Built with
[June](https://june.build), the agent-ready React framework, and deployed on
Vercel Edge.

**Live:**
[chocolate](https://june-cake.vercel.app/recipes/chocolate-cake) ·
[carrot](https://june-cake.vercel.app/recipes/carrot-cake) ·
[`.md`](https://june-cake.vercel.app/recipes/chocolate-cake.md) ·
[`.json`](https://june-cake.vercel.app/recipes/chocolate-cake.json) ·
[`llms.txt`](https://june-cake.vercel.app/llms.txt) ·
[`/mcp`](https://june-cake.vercel.app/mcp)

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

## Progressive by layer

The recipe content is **zero-JS**: semantic HTML, no hydration, no serialized
state. The interactive layer is opt-in, and this site turns on three pieces to
show them off:

- **Morph navigation** (`clientRouter: true`) — same-origin clicks swap the page
  in place over the same HTML the server already serves; no router, no Flight
  payload, history just works.
- **Persist islands** — the header carries two ([`SaveButton`](app/SaveButton.tsx),
  [`StatusFeed`](app/StatusFeed.tsx)) marked `persist`, so a morph navigation
  carries their live nodes across instead of tearing them down. Click ♥, navigate
  between recipes, the count holds.
- **A live feed over SSE** — [`StatusFeed`](app/StatusFeed.tsx) opens an
  `EventSource` to [`/api/activity`](app/_extra.tsx) (a streaming endpoint mounted
  via the `app/_extra.tsx` escape hatch). Because the island is `persist`, the
  connection keeps streaming **across navigation without reconnecting** — the
  event count climbs straight through every page change.

That last one is the [Live updates](https://june.build/docs/features-live-updates)
how-to made real: a server-push connection that survives navigation, written to
stay cheap (it parks between ticks, closes before the host's streaming cap so the
browser reconnects, and tears down the moment the client disconnects).

## Run it

```bash
npm install
npm run dev        # the june CLI runs on Bun (https://bun.sh)

curl localhost:3000/recipes/chocolate-cake.md
curl localhost:3000/recipes/chocolate-cake.json
curl localhost:3000/llms.txt
curl -N localhost:3000/api/activity     # the live feed, raw
```

## Deploy

```bash
june deploy        # uses the adapter from june.config.ts
```

The target is the **adapter**, not a rewrite. This site sets
`deploy.adapter: vercel()` (from `@junejs/server`), which emits the Vercel Build
Output API straight from the same `june build` bundle. Drop the adapter and
`june deploy` ships to Cloudflare Workers from the *identical* bundle — the
framework core is just `fetch(Request) → Response`, so the same worker runs on
both.

## Styling

`app/global.css` is auto-linked by June — no import, no `<style>` block. It's
plain Tailwind v4 (`@import "tailwindcss"`); `june build` content-hashes and
minifies it into one immutable `/_june/global.<hash>.css`, and `june dev`
recompiles it on reload.

---

Like the idea? A star on the framework helps a tiny 0.0.x project:
**[github.com/junebuild/june](https://github.com/junebuild/june)**
