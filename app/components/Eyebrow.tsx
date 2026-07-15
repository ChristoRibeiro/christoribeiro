import type { ReactNode } from "react";

// Section label ("eyebrow"): the single source for every section title.
// Reads as a small heading — 13px, semibold, tighter tracking, in the brighter
// `body` tone so it's clearly visible in both light and dark.
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.08em] text-body">
      {children}
    </h2>
  );
}
