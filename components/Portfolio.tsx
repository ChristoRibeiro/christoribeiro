import { getProjects } from "@/lib/projects";
import { Eyebrow } from "@/components/Eyebrow";
import { LinkRow } from "@/components/LinkRow";

export async function Portfolio() {
  const projects = await getProjects();
  return (
    <section>
      <Eyebrow>Building</Eyebrow>
      <div className="flex flex-col gap-3">
        {projects.map((p) => (
          <LinkRow
            key={p.name}
            href={p.url ?? "#"}
            title={p.name}
            subtitle={p.tagline}
            cta={p.cta}
          />
        ))}
      </div>
    </section>
  );
}
