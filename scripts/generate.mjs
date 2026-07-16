#!/usr/bin/env node
// Single source of truth = /data.json (public projects only, no MRR, no stealth names).
// This regenerates the site's Portfolio data (lib/projects.ts) from it.
// Runs offline — no network. Run by hand (`node scripts/generate.mjs`) or by the
// sync workflow after pull-notion.mjs refreshes data.json.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const data = JSON.parse(readFileSync(join(root, "data.json"), "utf8"));
const projects = Array.isArray(data.projects) ? data.projects : [];
const hasStealth = Boolean(data.hasStealth);

// Notion's Website field may lack a protocol ("eanscan.com") — make links absolute.
const httpUrl = (u) => (u && !/^https?:\/\//i.test(u) ? `https://${u}` : u);
// The Notion Portfolio DB has no CTA column, so a sync blanks the CTA — pin
// business CTAs here (by project name) so they survive syncs.
const CTA_OVERRIDES = { Foreach: "work with me" };
const pub = projects.map((p) => ({
  ...p,
  url: p.url ? httpUrl(p.url) : p.url,
  cta: p.cta || CTA_OVERRIDES[p.name] || p.cta,
}));

// ---- site: lib/projects.ts ----
const ts = `// GENERATED from /data.json by scripts/generate.mjs — do not edit by hand.
export type Project = { name: string; cta?: string; tagline: string; url?: string; status: string };

export const PROJECTS: Project[] = ${JSON.stringify(pub, null, 2)};

export const HAS_STEALTH = ${hasStealth};
`;
writeFileSync(join(root, "lib/projects.ts"), ts);

console.log(`generated: ${projects.length} public project(s), hasStealth=${hasStealth}`);
