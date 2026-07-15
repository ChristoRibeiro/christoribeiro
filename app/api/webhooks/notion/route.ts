import crypto from "node:crypto";

export const runtime = "nodejs";

// Relay: Notion webhook → GitHub repository_dispatch → sync workflow → redeploy.
// Env (set in Dokploy):
//   NOTION_WEBHOOK_SECRET  — the verification_token Notion gives at setup (enables signature checks)
//   GITHUB_DISPATCH_TOKEN  — fine-grained PAT with Contents: read/write on the repo
//   GITHUB_REPO            — "owner/repo" (defaults below)
const GITHUB_REPO = process.env.GITHUB_REPO ?? "ChristoRibeiro/christoribeiro";

export async function POST(req: Request) {
  const raw = await req.text();

  let body: Record<string, unknown> | null = null;
  try {
    body = JSON.parse(raw);
  } catch {
    body = null;
  }

  // 1) One-time verification handshake: Notion POSTs { verification_token }.
  //    Grab it from the Dokploy logs and paste it back into Notion to activate.
  if (body && typeof body.verification_token === "string") {
    console.log("[notion-webhook] verification_token:", body.verification_token);
    return new Response("ok", { status: 200 });
  }

  // 2) Verify the Notion signature on real events (if the secret is configured).
  const secret = process.env.NOTION_WEBHOOK_SECRET;
  if (secret) {
    const provided = (req.headers.get("x-notion-signature") ?? "").replace(/^sha256=/, "");
    const expected = crypto.createHmac("sha256", secret).update(raw).digest("hex");
    const a = Buffer.from(provided);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      return new Response("bad signature", { status: 401 });
    }
  }

  // 3) Ignore noise (comments, view changes). Content/property edits trigger a sync.
  const type = typeof body?.type === "string" ? body.type : "";
  if (type.startsWith("comment.") || type.startsWith("view.")) {
    return new Response("ignored", { status: 200 });
  }

  // 4) Fire the GitHub Action that pulls Notion and regenerates everything.
  const token = process.env.GITHUB_DISPATCH_TOKEN;
  if (!token) {
    console.error("[notion-webhook] GITHUB_DISPATCH_TOKEN is not set");
    return new Response("not configured", { status: 500 });
  }
  const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/dispatches`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "User-Agent": "christoribeiro-notion-webhook",
    },
    body: JSON.stringify({ event_type: "sync-portfolio" }),
  });
  if (!res.ok) {
    console.error("[notion-webhook] dispatch failed", res.status, await res.text());
    return new Response("dispatch failed", { status: 502 });
  }
  return new Response("synced", { status: 202 });
}
