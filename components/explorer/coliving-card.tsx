import { CalendarDays, Info, Minus, Plus, ShieldCheck, Users, Video, Wifi } from "lucide-react";

import type { Coliving, DataConfidence, Review } from "@/lib/types";
import { greatForNotFor, type FitFactor, type FitResult } from "@/lib/fit";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Soft top wash keyed to community type — cool for focus, warm for social,
// neutral for balanced. Doubles as an at-a-glance signal of the type.
const BAND_BY_TYPE: Record<Coliving["communityType"], string> = {
  focus: "from-band-focus",
  social: "from-band-social",
  balanced: "from-band-balanced",
};

function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Score badge — tiered by token color so quality reads at a glance, never bare. */
function FitBadge({ score }: { score: number }) {
  const tier =
    score >= 75
      ? "bg-primary text-primary-foreground"
      : score >= 50
        ? "bg-primary/10 text-primary"
        : "bg-muted text-muted-foreground";
  return (
    <div className={cn("flex flex-col items-center rounded-lg px-3 py-1.5 leading-none", tier)}>
      <span className="text-xl font-semibold tabular-nums">{score}</span>
      <span className="mt-0.5 text-[0.625rem] font-medium tracking-wide uppercase">fit</span>
    </div>
  );
}

function FactorChip({ factor }: { factor: FitFactor }) {
  const positive = factor.sign === "positive";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium",
        positive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
      )}
    >
      {positive ? <Plus className="size-3" /> : <Minus className="size-3" />}
      {factor.label}
    </span>
  );
}

function Stat({ icon: Icon, children }: { icon: typeof Wifi; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <Icon className="size-4 shrink-0" aria-hidden />
      {children}
    </li>
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
        thin
          ? "rounded-md border bg-muted/50 px-2 py-0.5 text-foreground"
          : "text-muted-foreground",
      )}
    >
      <Icon className="size-3.5 shrink-0" aria-hidden />
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
      <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        The spread
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {shown.map((r) => (
          <figure key={r.quote} className="rounded-md bg-muted/40 p-3">
            <span
              className={cn(
                "text-[0.625rem] font-semibold tracking-wide uppercase",
                r.axis === "focus" ? "text-primary" : "text-muted-foreground",
              )}
            >
              {r.axis === "focus" ? "Focus" : "Social"}
            </span>
            <blockquote className="mt-1.5 text-sm leading-snug text-foreground">
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

export function ColivingCard({ coliving, fit }: { coliving: Coliving; fit: FitResult }) {
  return (
    <Card className="relative flex flex-col">
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 -z-10 h-24 bg-gradient-to-b to-transparent",
          BAND_BY_TYPE[coliving.communityType],
        )}
      />
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <CardTitle className="font-display text-xl tracking-tight">{coliving.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{coliving.city}</p>
            <ConfidenceMarker confidence={coliving.dataConfidence} />
          </div>
          <FitBadge score={fit.score} />
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-semibold text-foreground tabular-nums">
            {formatPrice(coliving.monthlyAllIn, coliving.currency)}
          </span>
          <span className="text-sm text-muted-foreground">/mo all-in</span>
        </div>

        <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
          <Stat icon={Wifi}>{coliving.wifiMbps} Mbps</Stat>
          <Stat icon={CalendarDays}>{coliving.minStayDays}-night min</Stat>
          <Stat icon={Video}>{coliving.callsFriendly ? "Calls ready" : "Calls limited"}</Stat>
          <Stat icon={Users}>
            <span className="capitalize">{coliving.communityType}</span>
          </Stat>
        </ul>

        <Verdict coliving={coliving} />

        <div className="flex flex-wrap gap-1.5">
          {coliving.vibeTags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="secondary" className="font-normal">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-4 border-t pt-4">
          <div>
            <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Why this fit
            </p>
            <div className="flex flex-wrap gap-1.5">
              {fit.factors.map((factor) => (
                <FactorChip key={factor.label} factor={factor} />
              ))}
            </div>
          </div>

          <ReviewSpread reviews={coliving.reviews} />
        </div>
      </CardContent>
    </Card>
  );
}
