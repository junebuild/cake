import { defineJune } from "@junejs/core/config";
import { turso, vercel } from "@junejs/server";

// Deploys to the Vercel Node runtime via the built-in adapter (Build Output API
// v3). The same portable fetch(Request)→Response bundle also ships to Cloudflare
// Workers — the target is just the adapter. clientRouter turns same-origin links
// into MORPH navigations: the header island's state survives, the agent surface
// stays whole.
//
// db: turso() — libsql over HTTPS, opened from TURSO_DATABASE_URL /
// TURSO_AUTH_TOKEN. Reach it ambiently with `import { db } from "@junejs/db"`
// anywhere (no request object threaded); on Workers the same code would use D1.
export default defineJune({
  site: { name: "Cake Site" },
  clientRouter: true,
  deploy: { adapter: vercel() },
  resources: { db: turso() },
});
