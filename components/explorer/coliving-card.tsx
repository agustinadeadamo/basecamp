import { CalendarDays, Info, MapPin, Minus, Plus, ShieldCheck, Users, Video, Wifi } from "lucide-react";

import type { Coliving, DataConfidence, Review } from "@/lib/types";
import { greatForNotFor, type FitFactor, type FitResult } from "@/lib/fit";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Reveal } from "./reveal";

// A colored header band keyed to community type — cool sage/teal for focus,
// warm amber/terracotta for social, soft neutral-gold for balanced. The band
// carries the city name (so each card reads as a place), with a matching slim
// left accent border tying the card to its type. Tokens carry the AA-checked
// fill / foreground / accent triple; full class names are listed so Tailwind
// keeps them at build time.
const BAND_BY_TYPE: Record<
  Coliving["communityType"],
  { band: string; text: string; accent: string }
> = {
  focus: {
    band: "bg-band-focus",
    text: "text-band-focus-foreground",
    accent: "border-l-band-focus-accent",
  },
  social: {
    band: "bg-band-social",
    text: "text-band-social-foreground",
    accent: "border-l-band-social-accent",
  },
  balanced: {
    band: "bg-band-balanced",
    text: "text-band-balanced-foreground",
    accent: "border-l-band-balanced-accent",
  },
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
    <div
      role="img"
      aria-label={`Fit score ${score} out of 100`}
      className={cn("flex flex-col items-center rounded-lg px-3 py-1.5 leading-none", tier)}
    >
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
      {positive ? <Plus className="size-3" aria-hidden /> : <Minus className="size-3" aria-hidden />}
      <span className="sr-only">{positive ? "Pro: " : "Con: "}</span>
      {factor.label}
    </span>
  );
}

function Stat({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Wifi;
  /** Full accessible description, e.g. "Wi-Fi speed 320 megabits per second". */
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <Icon className="size-4 shrink-0" aria-hidden />
      <span aria-hidden="true">{children}</span>
      <span className="sr-only">{label}</span>
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
  const band = BAND_BY_TYPE[coliving.communityType];
  return (
    <Card className={cn("flex flex-col border-l-4", band.accent)}>
      {/* Colored, type-keyed header — names the place and signals the vibe. */}
      <div
        className={cn(
          "-mt-(--card-spacing) flex h-24 items-end px-(--card-spacing) pb-3",
          band.band,
        )}
      >
        <span
          className={cn(
            "inline-flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase",
            band.text,
          )}
        >
          <MapPin className="size-3.5 shrink-0" aria-hidden />
          {coliving.city}
        </span>
      </div>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <h3 className="font-display text-xl font-semibold leading-snug tracking-tight">
              {coliving.name}
            </h3>
            <ConfidenceMarker confidence={coliving.dataConfidence} />
          </div>
          <Reveal key={`badge-${revealKey}`} index={index}>
            <FitBadge score={fit.score} />
          </Reveal>
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
          <Stat icon={Wifi} label={`Wi-Fi speed ${coliving.wifiMbps} megabits per second`}>
            {coliving.wifiMbps} Mbps
          </Stat>
          <Stat icon={CalendarDays} label={`Minimum stay ${coliving.minStayDays} nights`}>
            {coliving.minStayDays}-night min
          </Stat>
          <Stat
            icon={Video}
            label={`Video calls ${coliving.callsFriendly ? "ready" : "limited"}`}
          >
            {coliving.callsFriendly ? "Calls ready" : "Calls limited"}
          </Stat>
          <Stat icon={Users} label={`Community type: ${coliving.communityType}`}>
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

        <Reveal key={`reasoning-${revealKey}`} index={index} className="mt-auto">
          <div className="flex flex-col gap-4 border-t pt-4">
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
        </Reveal>
      </CardContent>
    </Card>
  );
}
