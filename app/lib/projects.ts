export type Project = {
  name: string;
  tagline: string;
  href?: string;
  status: "live" | "building" | "idea";
  // Stealth projects stay false until Christophe explicitly reveals them.
  isPublic: boolean;
};

export const PROJECTS: Project[] = [
  { name: "Foreach", tagline: "B2B consulting studio", href: "https://foreach.dev", status: "live", isPublic: true },
  { name: "Eanscan", tagline: "Product data sheets for retailers", href: "https://eanscan.com", status: "live", isPublic: false },
  { name: "IndieFounders", tagline: "A French-speaking indie hacker community", href: "https://indiefounders.io", status: "idea", isPublic: false },
  { name: "BleuSermon", tagline: "Turn sermons into content", href: "https://bluesermon.com", status: "idea", isPublic: false },
];
