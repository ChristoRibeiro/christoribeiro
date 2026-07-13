import { PROJECTS } from "@/lib/projects";

export function Portfolio() {
  const shown = PROJECTS.filter((p) => p.isPublic);
  const hasStealth = PROJECTS.some((p) => !p.isPublic);

  return (
    <section className="mt-9">
      <p className="text-xs font-medium uppercase tracking-widest text-grey">
        Building
      </p>
      <ul className="mt-3 flex flex-col gap-2">
        {shown.map((p) => (
          <li key={p.name} className="text-body">
            {p.href ? (
              <a
                href={p.href}
                className="font-medium text-ink underline-offset-4 hover:underline"
              >
                {p.name}
              </a>
            ) : (
              <span className="font-medium text-ink">{p.name}</span>
            )}
            <span className="text-grey"> — {p.tagline}</span>
          </li>
        ))}
        {hasStealth && <li className="text-grey">More, in stealth.</li>}
      </ul>
    </section>
  );
}
