export function LinkRow({
  href,
  title,
  subtitle,
  cta,
}: {
  href: string;
  title: string;
  subtitle?: string;
  cta?: string;
}) {
  return (
    <a
      href={href}
      className="group flex items-center justify-between gap-4 rounded-xl border border-line px-4 py-3.5 transition-colors hover:bg-line"
    >
      <span className="flex flex-col">
        <span className="font-medium text-ink">{title}</span>
        {subtitle ? <span className="text-sm text-grey">{subtitle}</span> : null}
      </span>
      <span className="flex items-center gap-1.5 whitespace-nowrap text-sm">
        {cta ? (
          <span className="text-ink opacity-60 transition-opacity group-hover:opacity-100">
            {cta}
          </span>
        ) : null}
        <span
          aria-hidden="true"
          className="text-grey transition-transform group-hover:translate-x-0.5"
        >
          ↗
        </span>
      </span>
    </a>
  );
}
