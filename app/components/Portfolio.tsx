import { PROJECTS, HAS_STEALTH } from "@/lib/projects";

export function Portfolio() {
  return (
    <section className="flex flex-col gap-3">
      {PROJECTS.map((p) => {
        const label = p.cta || p.name;
        const sub = p.cta ? `${p.name} · ${p.tagline}` : p.tagline;
        return (
          <a
            key={p.name}
            href={p.url}
            className="group flex items-center justify-between gap-4 rounded-xl border border-line px-4 py-3.5 transition-colors hover:bg-line"
          >
            <span className="flex flex-col">
              <span className="font-medium text-ink">{label}</span>
              <span className="text-sm text-grey">{sub}</span>
            </span>
            <span
              aria-hidden="true"
              className="text-grey transition-transform group-hover:translate-x-0.5"
            >
              ↗
            </span>
          </a>
        );
      })}
      {HAS_STEALTH && (
        <p className="px-1 pt-1 text-sm text-grey">More, in stealth.</p>
      )}
    </section>
  );
}
