import { Avatar } from "@/components/Avatar";
import { Portfolio } from "@/components/Portfolio";
import { Links } from "@/components/Links";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-20">
      <Avatar />

      <h1 className="mt-6 text-xl font-semibold tracking-tight text-ink">
        Christophe Ribeiro
      </h1>
      <p className="text-grey">Founder &amp; software engineer · France</p>

      <div className="mt-7 flex flex-col gap-4 leading-relaxed text-body">
        <p>I&apos;m a founder and software engineer building a portfolio of B2B products.</p>
        <p>
          Foreach, my consulting studio, funds the work. The rest goes into
          products of my own — a few still in stealth — and small tools I ship in
          the open, like <code className="font-mono text-[0.9em]">npx christo</code>.
        </p>
      </div>

      <Portfolio />

      <Links />
    </main>
  );
}
