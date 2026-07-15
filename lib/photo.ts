import { readFileSync } from "node:fs";
import { join } from "node:path";

// The avatar as a base64 data URI, for build-time image generation (favicon, OG,
// apple icon). Robust to the build cwd — Docker builds from /app, a local
// `next build app` runs from the repo root.
export function photoDataUri(): string {
  for (const p of [
    join(process.cwd(), "public/me.jpg"),
    join(process.cwd(), "app/public/me.jpg"),
  ]) {
    try {
      return `data:image/jpeg;base64,${readFileSync(p).toString("base64")}`;
    } catch {
      /* try the next candidate path */
    }
  }
  throw new Error("public/me.jpg not found");
}
