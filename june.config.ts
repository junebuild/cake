import { defineJune } from "@junejs/core/config";
import { vercel } from "@junejs/server";

// Deploys to Vercel Edge via the built-in adapter (Build Output API v3). The same
// portable fetch(Request)→Response bundle also ships to Cloudflare Workers — the
// target is just the adapter.
export default defineJune({
  site: { name: "Cake Site" },
  deploy: { adapter: vercel() },
});
