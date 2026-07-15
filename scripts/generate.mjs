#!/usr/bin/env node
// Single source of truth = /data.json (public projects only, no MRR, no stealth names).
// This regenerates every public surface from it:
//   - README.md          (between the <!-- projects:start/end --> markers)
//   - lib/projects.ts     (the site's Portfolio data)
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

// ---- README: replace the managed block ----
const readmePath = join(root, "README.md");
const items = pub.map((p) =>
  p.url ? `- [**${p.name}**](${p.url}) — ${p.tagline}` : `- **${p.name}** — ${p.tagline}`
);
const block = `<!-- projects:start -->\n${items.join("\n")}\n<!-- projects:end -->`;
const readme = readFileSync(readmePath, "utf8");
const nextReadme = readme.replace(
  /<!-- projects:start -->[\s\S]*?<!-- projects:end -->/,
  block
);
if (!/<!-- projects:start -->/.test(readme)) {
  throw new Error("README.md is missing the <!-- projects:start --> markers");
}
writeFileSync(readmePath, nextReadme);

// ---- site: app/lib/projects.ts ----
const ts = `// GENERATED from /data.json by scripts/generate.mjs — do not edit by hand.
export type Project = { name: string; cta?: string; tagline: string; url?: string; status: string };

export const PROJECTS: Project[] = ${JSON.stringify(pub, null, 2)};

export const HAS_STEALTH = ${hasStealth};
`;
writeFileSync(join(root, "lib/projects.ts"), ts);

console.log(`generated: ${projects.length} public project(s), hasStealth=${hasStealth}`);
