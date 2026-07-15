import type { ReactNode } from "react";

// Section label ("eyebrow"): the single source for every section title.
// Quiet baseline — small, uppercase, wide tracking, in grey.
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-3 text-xs font-medium uppercase tracking-widest text-grey">
      {children}
    </h2>
  );
}
