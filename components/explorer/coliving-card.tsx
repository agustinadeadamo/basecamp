import { Info, ShieldCheck } from "lucide-react";

import type { Coliving, CommunityType, DataConfidence, Review } from "@/lib/types";
import { greatForNotFor, type FitFactor, type FitResult } from "@/lib/fit";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Reveal } from "./reveal";

// Whisper-level temperature cue by community type — a single step within the
// stone family (focus cooler, social warmer, balanced neutral), never a new
// hue. The visible type signal is the typographic mark below, not this.
const SURFACE_BY_TYPE: Record<CommunityType, string> = {
  focus: "bg-surface-focus",
  social: "bg-surface-social",
  balanced: "bg-surface-balanced",
};

function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Community type as one quiet, on-palette mark: a small dot whose fill encodes
 * the focus↔social spectrum — solid sage for focus, solid stone for social, and
 * a half-and-half split for balanced — paired with a small-caps label. No fill
 * block; meaning never rides on color alone (the word always carries it).
 */
function TypeMark({ type }: { type: CommunityType }) {
  const label = type[0].toUpperCase() + type.slice(1);
  const dot =
    type === "focus" ? (
      <span className="size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
    ) : type === "social" ? (
      <span className="size-1.5 shrink-0 rounded-full bg-foreground/35" aria-hidden />
    ) : (
      <span
        className="size-1.5 shrink-0 rounded-full"
        // Tokens only — half sage (focus), half stone (social): "balanced".
        style={{
          background:
            "linear-gradient(90deg, var(--primary) 0 50%, var(--muted-foreground) 50% 100%)",
        }}
        aria-hidden
      />
    );
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wider text-muted-foreground uppercase">
      {dot}
      {label}
    </span>
  );
}

/**
 * Fit score — the soul of the product, treated as a considered figure rather
 * than a badge. Display face (shared with the place name), quiet caption, tone
 * stepped by tier so quality reads without a colored fill.
 */
function FitScore({ score }: { score: number }) {
  const tone = score >= 75 ? "text-primary" : score >= 50 ? "text-foreground" : "text-muted-foreground";
  return (
    <div
      role="img"
      aria-label={`Fit score ${score} out of 100`}
      className="flex shrink-0 flex-col items-end leading-none"
    >
      <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">Fit</span>
      <span className={cn("mt-1.5 font-display text-3xl font-semibold tabular-nums", tone)}>
        {score}
      </span>
    </div>
  );
}

/** One reasoning line — a quiet ledger row: signed marker, reason, contribution. */
function FactorRow({ factor }: { factor: FitFactor }) {
  const positive = factor.sign === "positive";
  return (
    <li className="flex items-baseline justify-between gap-3 text-sm">
      <span className="flex items-baseline gap-2.5">
        <span
          aria-hidden
          className={cn(
            "w-2 shrink-0 text-center font-medium tabular-nums",
            positive ? "text-primary" : "text-muted-foreground",
          )}
        >
          {positive ? "+" : "−"}
        </span>
        <span className="sr-only">{positive ? "Pro: " : "Con: "}</span>
        <span className={positive ? "text-foreground" : "text-muted-foreground"}>{factor.label}</span>
      </span>
      <span className="shrink-0 text-xs tabular-nums text-muted-foreground" aria-hidden>
        {positive ? "+" : "−"}
        {Math.abs(factor.points)}
      </span>
    </li>
  );
}

/** One hard fact in the spec strip — small-caps label over an emphasized value. */
function Spec({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 px-4 first:pl-0">
      <dt className="text-xs tracking-wider text-muted-foreground uppercase">{label}</dt>
      <dd className="text-sm font-medium tabular-nums text-foreground">{children}</dd>
    </div>
  );
}

/**
 * Honest-uncertainty marker. Thin records are shown as a first-class, clearly
 * marked state — never dressed up to look as confident as verified ones.
 */
function ConfidenceMarker({ confidence }: { confidence: DataConfidence }) {
  const thin = confidence.level === "thin";
  const Icon = thin ? Info : ShieldCheck;
  const reports = `${confidence.reportsCount} report${confidence.reportsCount === 1 ? "" : "s"}`;
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1 text-xs",
        thin ? "rounded-md border bg-muted/50 px-2 py-0.5 text-foreground" : "text-muted-foreground",
      )}
    >
      <Icon className="size-3.5 shrink-0" aria-hidden />
      <span className="sr-only">Data confidence: </span>
      {thin ? "Limited data" : "Verified"}
      <span className="text-muted-foreground">· {reports}</span>
    </span>
  );
}

/** Scannable verdict — who the place suits and who it doesn't. */
function Verdict({ coliving }: { coliving: Coliving }) {
  const { great, not } = greatForNotFor(coliving);
  return (
    <p className="text-sm leading-relaxed text-muted-foreground">
      <span className="font-medium text-foreground">Great for</span> {great}
      <span className="px-1.5 text-muted-foreground/60">·</span>
      <span className="font-medium text-foreground">Not for</span> {not}
    </p>
  );
}

/** The spread — a focus-leaning review next to a social-leaning one. */
function ReviewSpread({ reviews }: { reviews: Review[] }) {
  const shown = [
    reviews.find((r) => r.axis === "focus"),
    reviews.find((r) => r.axis === "social"),
  ].filter((r): r is Review => Boolean(r));
  if (shown.length === 0) return null;
  return (
    <div>
      <p className="mb-3 text-xs font-medium tracking-wider text-muted-foreground uppercase">
        The spread
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {shown.map((r) => (
          <figure key={r.quote} className="border-l border-border pl-3.5">
            <span
              className={cn(
                "text-xs font-medium tracking-wider uppercase",
                r.axis === "focus" ? "text-primary" : "text-muted-foreground",
              )}
            >
              {r.axis === "focus" ? "Focus" : "Social"}
            </span>
            <blockquote className="mt-1.5 text-sm leading-relaxed text-foreground">
              &ldquo;{r.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-2 text-xs text-muted-foreground">
              {r.author} · {r.source}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

export function ColivingCard({
  coliving,
  fit,
  revealKey = 0,
  index = 0,
}: {
  coliving: Coliving;
  fit: FitResult;
  /** Changing this re-triggers the score/reasoning reveal (e.g. on profile change). */
  revealKey?: number;
  index?: number;
}) {
  return (
    <Card className={cn("flex flex-col [--card-spacing:--spacing(5)]", SURFACE_BY_TYPE[coliving.communityType])}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <TypeMark type={coliving.communityType} />
            <h3 className="font-display text-2xl font-semibold leading-tight tracking-tight text-foreground">
              {coliving.name}
            </h3>
            <p className="text-sm text-muted-foreground">{coliving.city}</p>
          </div>
          <Reveal key={`badge-${revealKey}`} index={index}>
            <FitScore score={fit.score} />
          </Reveal>
        </div>
        <ConfidenceMarker confidence={coliving.dataConfidence} />
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-6">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold tabular-nums tracking-tight text-foreground">
            {formatPrice(coliving.monthlyAllIn, coliving.currency)}
          </span>
          <span className="text-xs tracking-wider text-muted-foreground uppercase">/mo all-in</span>
        </div>

        <dl className="grid grid-cols-3 divide-x divide-border border-y border-border py-4">
          <Spec label="Wi-Fi">
            {coliving.wifiMbps} <span className="font-normal text-muted-foreground">Mbps</span>
          </Spec>
          <Spec label="Min stay">
            {coliving.minStayDays} <span className="font-normal text-muted-foreground">nights</span>
          </Spec>
          <Spec label="Calls">{coliving.callsFriendly ? "Ready" : "Limited"}</Spec>
        </dl>

        <Verdict coliving={coliving} />

        <div className="flex flex-wrap gap-1.5">
          {coliving.vibeTags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="secondary" className="rounded-full font-normal">
              {tag}
            </Badge>
          ))}
        </div>

        <Reveal key={`reasoning-${revealKey}`} index={index} className="mt-auto">
          <div className="flex flex-col gap-5 border-t pt-5">
            <div>
              <p className="mb-3 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Why this fit
              </p>
              <ul className="flex flex-col gap-2">
                {fit.factors.map((factor) => (
                  <FactorRow key={factor.label} factor={factor} />
                ))}
              </ul>
            </div>

            <ReviewSpread reviews={coliving.reviews} />
          </div>
        </Reveal>
      </CardContent>
    </Card>
  );
}
