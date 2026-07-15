import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

// Top-of-page primitive: full-width, static, fixed height. The left slot holds
// per-page content (a title, breadcrumb, …) — empty on the landing. The theme
// toggle lives on the right and is always present.
export function Navbar({ children }: { children?: ReactNode }) {
  return (
    <header className="flex h-14 w-full items-center justify-between px-6">
      <div className="flex min-w-0 items-center">{children}</div>
      <ThemeToggle />
    </header>
  );
}
