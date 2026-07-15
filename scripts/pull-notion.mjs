#!/usr/bin/env node
// Pull the Notion "Portfolio" database → /data.json.
// SECURITY: this is the ONLY place stealth is filtered. Stealth projects and the
// MRR field never reach data.json (which lives in a PUBLIC repo). Only name,
// tagline, url and status of non-stealth projects are written, plus a boolean
// saying whether any stealth project exists.
//
// Env:
//   NOTION_TOKEN         (required) — internal integration secret
//   NOTION_DATABASE_ID   (optional) — defaults to the Portfolio DB id below
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const token = process.env.NOTION_TOKEN;
const dbId = process.env.NOTION_DATABASE_ID || "37301ac6-83c7-806e-93d3-fa4e67bac68b";
if (!token) {
  console.error("NOTION_TOKEN is required");
  process.exit(1);
}

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const res = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ page_size: 100 }),
});
if (!res.ok) {
  const detail = await res.text();
  if (res.status === 404) {
    console.error(
      `Notion 404 — the integration behind NOTION_TOKEN cannot see database ${dbId}.\n` +
        `Fix (in Notion): open the Portfolio database → ••• (top-right) → Connections → add that integration.\n` +
        detail
    );
  } else {
    console.error(`Notion API ${res.status}: ${detail}`);
  }
  process.exit(1);
}
const { results } = await res.json();

const plain = (rich) => (Array.isArray(rich) ? rich.map((t) => t.plain_text).join("") : "");

const rows = results.map((page) => {
  const p = page.properties;
  return {
    name: plain(p.Name?.title),
    cta: plain(p.CTA?.rich_text), // optional "CTA" text property → the link's button label
    tagline: plain(p.Description?.rich_text),
    url: p.Website?.url || p.Github?.url || "",
    status: (p.Status?.status?.name || "").toLowerCase(),
    stealth: Boolean(p.Stealth?.checkbox),
  };
});

const projects = rows
  .filter((r) => !r.stealth && r.name)
  .map(({ stealth, ...rest }) => rest); // drop the stealth flag; keep only public fields
// Only tease stealth when something is actually cooking (building or live), not a mere idea.
const hasStealth = rows.some(
  (r) => r.stealth && (r.status === "building" || r.status === "live")
);

const data = { generatedAt: new Date().toISOString(), hasStealth, projects };
writeFileSync(join(root, "data.json"), JSON.stringify(data, null, 2) + "\n");
console.log(`pulled ${projects.length} public project(s), hasStealth=${hasStealth}`);
