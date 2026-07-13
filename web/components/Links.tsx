import { LINKS } from "@/lib/links";

export function Links() {
  return (
    <nav aria-label="Liens" className="flex flex-col gap-2">
      {LINKS.map((link) => (
        <a
          key={link.label}
          href={link.href}
          className="group flex items-baseline gap-3 font-mono text-muted transition-colors hover:text-star"
        >
          <span className="w-20 text-amber">{link.label}</span>
          <span className="group-hover:text-sky">{link.value}</span>
        </a>
      ))}
    </nav>
  );
}
