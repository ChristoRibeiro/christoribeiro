// The site's projects — the single source of truth, edited by hand.
export type Project = { name: string; tagline: string; url?: string; cta?: string };

export const PROJECTS: Project[] = [
  { name: "Eanscan", tagline: "Product sheets API", url: "https://eanscan.com" },
  { name: "Foreach", tagline: "B2B consulting", url: "https://foreach.dev", cta: "work with me" },
];
