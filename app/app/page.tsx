import { Avatar } from "@/components/Avatar";
import { Navbar } from "@/components/Navbar";
import { Portfolio } from "@/components/Portfolio";
import { Links } from "@/components/Links";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="mx-auto flex max-w-lg flex-col px-6 pb-20 pt-4">
        <Avatar />

        <h1 className="mt-6 text-xl font-semibold tracking-tight text-ink">
          Christophe Ribeiro
        </h1>
        <p className="text-grey">Entrepreneur &amp; Software Engineer</p>

        <p className="mt-6 leading-relaxed text-body">
          Currently building a portfolio of simple but powerful B2B products.
        </p>

        <div className="mt-10 flex flex-col gap-9">
          <Portfolio />
          <Links />
        </div>
      </main>
    </>
  );
}
