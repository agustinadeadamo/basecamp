import { getColivings } from "@/lib/colivings";
import { Explorer } from "@/components/explorer/explorer";

export default function Home() {
  const colivings = getColivings();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-gutter py-12 md:py-16">
      <header className="mb-10 max-w-2xl">
        <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">Basecamp</p>
        <h1 className="mt-2 text-4xl font-semibold text-foreground text-balance">
          Find your coliving fit.
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
          Set your basics and we&apos;ll rank spaces by fit — and always show the reasons behind
          each score, never just a number.
        </p>
      </header>

      <Explorer colivings={colivings} />
    </main>
  );
}
