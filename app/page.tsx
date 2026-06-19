// Placeholder shell — proves the design tokens render. Not a feature.
// All colors, type, spacing, and radii below resolve to Basecamp tokens.
export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center px-gutter py-section">
      <div className="flex max-w-xl flex-col gap-stack text-center">
        <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
          Basecamp
        </p>
        <h1 className="text-4xl font-semibold text-foreground text-balance">
          A calm way to find your coliving fit.
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          The project shell is ready. Design tokens, typography, light &amp; dark
          themes, and shadcn/ui are wired up — features come next.
        </p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <span className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
            Primary
          </span>
          <span className="rounded-lg border bg-card px-5 py-2.5 text-sm font-medium text-card-foreground">
            Surface
          </span>
        </div>
      </div>
    </main>
  );
}
