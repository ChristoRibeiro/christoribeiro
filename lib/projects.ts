export type Project = { name: string; tagline: string; url?: string; cta?: string };

// Notion "Portfolio" database — the single source of truth.
const DATABASE_ID =
  process.env.NOTION_DATABASE_ID ?? "37301ac6-83c7-806e-93d3-fa4e67bac68b";

type RichText = { plain_text: string }[];
const plain = (rich?: RichText) =>
  Array.isArray(rich) ? rich.map((t) => t.plain_text).join("") : "";
const abs = (u: string) => (u && !/^https?:\/\//i.test(u) ? `https://${u}` : u);

// Fetched at build time (the page is force-static): edit Notion + redeploy to
// update the site. Non-stealth projects only.
export async function getProjects(): Promise<Project[]> {
  const token = process.env.NOTION_TOKEN;
  if (!token) {
    throw new Error("NOTION_TOKEN is required (set it as a build arg in Dokploy).");
  }

  const res = await fetch(
    `https://api.notion.com/v1/databases/${DATABASE_ID}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ page_size: 100 }),
      cache: "force-cache",
    },
  );
  if (!res.ok) throw new Error(`Notion ${res.status}: ${await res.text()}`);

  const { results } = (await res.json()) as {
    results: { properties: Record<string, any> }[];
  };
  return results
    .filter(
      (page) => !page.properties.Stealth?.checkbox && plain(page.properties.Name?.title),
    )
    .map((page) => {
      const p = page.properties;
      const url = p.Website?.url || p.Github?.url || "";
      return {
        name: plain(p.Name?.title),
        tagline: plain(p.Description?.rich_text),
        url: url ? abs(url) : undefined,
        cta: plain(p.CTA?.rich_text) || undefined,
      };
    });
}
