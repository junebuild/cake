#!/usr/bin/env bash
# Deploy this June app to Vercel Edge using the Build Output API. June has no
# Vercel adapter yet (0.0.x) — but it doesn't need a special one: `june build`
# emits a self-contained fetch(Request) → Response worker, and a Vercel Edge
# Function is exactly that. ~15 lines of glue, the same bundle that ships to
# Cloudflare Workers.
set -euo pipefail

npm run build   # → dist/worker.js (+ chunks), the workerd-ready bundle

fn=.vercel/output/functions/index.func
rm -rf .vercel/output && mkdir -p "$fn"
cp dist/*.js "$fn/"

cat > "$fn/entry.js" <<'JS'
import worker from "./worker.js";
export default (request) => worker.fetch(request);
JS

echo '{ "runtime": "edge", "entrypoint": "entry.js" }' > "$fn/.vc-config.json"
echo '{ "version": 3, "routes": [{ "handle": "filesystem" }, { "src": "/(.*)", "dest": "/index" }] }' \
  > .vercel/output/config.json

npx vercel deploy --prebuilt --prod
