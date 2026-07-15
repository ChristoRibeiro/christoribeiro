import { Avatar } from "@/components/Avatar";
import { Portfolio } from "@/components/Portfolio";
import { Links } from "@/components/Links";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-20">
      <Avatar />

      <h1 className="mt-6 text-xl font-semibold tracking-tight text-ink">
        Christophe Ribeiro
      </h1>
      <p className="text-grey">Founder &amp; software engineer · France</p>

      <p className="mt-6 leading-relaxed text-body">
        I&apos;m a founder and software engineer building a portfolio of simple
        but powerful B2B products.
      </p>

      <div className="mt-8">
        <Portfolio />
      </div>

      <Links />
    </main>
  );
}
