# Cake Site

The chocolate-cake demo from [a Reddit thread](https://www.reddit.com/r/reactjs/):
**one `route()` definition, four surfaces** — built with [June](https://june.build),
the agent-ready React framework.

```bash
npm install
npm run dev   # the june CLI runs on Bun (https://bun.sh)
```

Then:

```bash
curl localhost:3000/recipes/chocolate-cake        # HTML (view-source: just the content)
curl localhost:3000/recipes/chocolate-cake.md     # markdown
curl localhost:3000/recipes/chocolate-cake.json   # data
curl localhost:3000/llms.txt                      # how agents find all of the above
```

The entire app is [one route file](app/recipes/%5Bslug%5D/page.tsx) plus a
[layout](app/layout.tsx). Styling is Tailwind v4 compiled at build time into a
single `<style>` block (`npm run styles` regenerates `app/_styles.ts`) — the
page still ships zero JavaScript and no hydration payload.
