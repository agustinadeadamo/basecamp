import { CalendarDays, Minus, Plus, Users, Video, Wifi } from "lucide-react";

import type { Coliving } from "@/lib/types";
import type { FitFactor, FitResult } from "@/lib/fit";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      <span className="mt-0.5 text-[0.625rem] font-medium tracking-wide uppercase opacity-80">
        fit
      </span>
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

export function ColivingCard({ coliving, fit }: { coliving: Coliving; fit: FitResult }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="font-display text-xl tracking-tight">{coliving.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{coliving.city}</p>
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

        <div className="flex flex-wrap gap-1.5">
          {coliving.vibeTags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="secondary" className="font-normal">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="mt-auto border-t pt-4">
          <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Why this fit
          </p>
          <div className="flex flex-wrap gap-1.5">
            {fit.factors.map((factor) => (
              <FactorChip key={factor.label} factor={factor} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
