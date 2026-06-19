import { Telescope } from "lucide-react";

/**
 * Calm, intentional empty state for when a strict profile yields no strong
 * matches — a deliberate "nothing fits well yet" message rather than a grid of
 * poor results dressed up as good ones.
 */
export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-20 text-center">
      <div
        className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground"
        aria-hidden
      >
        <Telescope className="size-6" />
      </div>
      <h3 className="font-display text-xl text-foreground">No strong matches yet</h3>
      <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
        Nothing fits this profile well right now. Try widening your budget, or easing the
        atmosphere or stay length — the results will update as you go.
      </p>
    </div>
  );
}
