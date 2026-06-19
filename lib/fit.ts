// Transparent fit scoring.
//
// `computeFit` is a pure, deterministic function: same (profile, coliving) in,
// same result out, no I/O or globals — so it's trivially unit-testable. It
// returns not just a number but the signed factors that produced it, so the UI
// can always explain a score instead of asserting one.

import type { Coliving, Currency } from "@/lib/types";
import type { UserProfile } from "@/lib/profile";

export type FactorSign = "positive" | "negative";

export interface FitFactor {
  /** Short, scannable reason, e.g. "calls-friendly wifi" or "30-night minimum". */
  label: string;
  sign: FactorSign;
  /** Signed point contribution to the score (drives ordering + transparency). */
  points: number;
}

export interface FitResult {
  /** 0–100, clamped. */
  score: number;
  /** Positives first, then negatives — each ordered by magnitude. */
  factors: FitFactor[];
}

// Rough FX so prices in different currencies compare against a USD budget.
// Approximation only — a real app would use live rates at the data boundary.
const USD_PER_UNIT: Record<Currency, number> = { USD: 1, EUR: 1.08 };

const BASE_SCORE = 50;
const MIN_CALLS_WIFI = 80; // Mbps comfortable for steady video calls

function toUsd(amount: number, currency: Currency): number {
  return amount * USD_PER_UNIT[currency];
}

function budgetFactor(profile: UserProfile, c: Coliving): FitFactor {
  const priceUsd = toUsd(c.monthlyAllIn, c.currency);
  const budget = profile.monthlyBudgetUsd;

  if (priceUsd <= budget) {
    const headroom = (budget - priceUsd) / budget; // 0..1
    const points = Math.min(20, Math.round(8 + headroom * 30));
    return {
      label: headroom >= 0.15 ? "well under budget" : "within budget",
      sign: "positive",
      points,
    };
  }

  const overUsd = Math.round(priceUsd - budget);
  const points = -Math.min(30, Math.round(8 + ((priceUsd - budget) / budget) * 90));
  return { label: `~$${overUsd} over budget`, sign: "negative", points };
}

function atmosphereFactor(profile: UserProfile, c: Coliving): FitFactor {
  const focus = c.focusScore; // 0..1, higher = quieter/deep-work

  if (profile.communityPreference === "quiet") {
    if (focus >= 0.65) return { label: "quiet, focus-friendly", sign: "positive", points: 22 };
    if (focus >= 0.45) return { label: "moderately calm", sign: "positive", points: 8 };
    return { label: "lively, not quiet", sign: "negative", points: -16 };
  }

  if (profile.communityPreference === "community") {
    if (c.communityType === "social" || focus <= 0.45)
      return { label: "strong social scene", sign: "positive", points: 22 };
    if (c.communityType === "balanced")
      return { label: "some community", sign: "positive", points: 8 };
    return { label: "quiet, fewer events", sign: "negative", points: -16 };
  }

  // balanced
  if (c.communityType === "balanced") return { label: "balanced rhythm", sign: "positive", points: 22 };
  if (focus >= 0.4 && focus <= 0.7) return { label: "fairly balanced", sign: "positive", points: 8 };
  return {
    label: c.communityType === "focus" ? "leans quiet" : "leans social",
    sign: "negative",
    points: -10,
  };
}

function callsFactor(profile: UserProfile, c: Coliving): FitFactor | null {
  if (!profile.needsCalls) return null;
  const goodWifi = c.wifiMbps >= MIN_CALLS_WIFI;
  if (c.callsFriendly && goodWifi)
    return { label: "calls-friendly wifi", sign: "positive", points: 18 };
  if (c.callsFriendly || goodWifi)
    return { label: "so-so for calls", sign: "negative", points: -8 };
  return { label: "not ideal for calls", sign: "negative", points: -18 };
}

function stayFactor(profile: UserProfile, c: Coliving): FitFactor | null {
  if (profile.stayLengthDays < c.minStayDays)
    return { label: `${c.minStayDays}-night minimum`, sign: "negative", points: -14 };
  if (c.minStayDays <= 14)
    return { label: "flexible minimum stay", sign: "positive", points: 6 };
  return null; // meets the minimum but nothing notable to surface
}

export function computeFit(profile: UserProfile, coliving: Coliving): FitResult {
  const factors: FitFactor[] = [budgetFactor(profile, coliving), atmosphereFactor(profile, coliving)];

  const calls = callsFactor(profile, coliving);
  if (calls) factors.push(calls);

  const stay = stayFactor(profile, coliving);
  if (stay) factors.push(stay);

  const raw = factors.reduce((sum, f) => sum + f.points, BASE_SCORE);
  const score = Math.max(0, Math.min(100, Math.round(raw)));

  // Positives before negatives; within each, larger magnitude first.
  factors.sort((a, b) => {
    if (a.sign !== b.sign) return a.sign === "positive" ? -1 : 1;
    return Math.abs(b.points) - Math.abs(a.points);
  });

  return { score, factors };
}
