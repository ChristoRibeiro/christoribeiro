import { Hero } from "@/components/Hero";
import { Links } from "@/components/Links";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-10 px-6 py-16">
      <Hero />

      <section className="max-w-prose text-sky">
        <p>
          Je construis des produits et des outils. Entrepreneur et ingénieur logiciel,
          basé en France.
        </p>
      </section>

      <Links />

      <footer className="font-mono text-sm text-muted">
        <span className="text-amber-dim">$</span> npx christo
      </footer>
    </main>
  );
}
