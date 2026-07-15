import { LINKS } from "@/lib/links";
import { Eyebrow } from "@/components/Eyebrow";

const NAMES: Record<string, string> = {
  x: "X/Twitter",
  github: "GitHub",
  linkedin: "LinkedIn",
};

// Socials only — drop the self-referential "site" and (per design) email.
const shown = LINKS.filter((l) => l.label !== "site" && l.label !== "email");

export function Links() {
  return (
    <section>
      <Eyebrow>Contact</Eyebrow>
      <ul className="flex flex-col gap-2 text-body">
        {shown.map((link) => (
          <li key={link.label} className="flex items-baseline gap-2.5">
            <span aria-hidden="true" className="text-grey">
              •
            </span>
            <a
              href={link.href}
              className="underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              {NAMES[link.label] ?? link.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
