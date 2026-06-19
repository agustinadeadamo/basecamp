// Transparent fit scoring.
//
// `computeFit` is a pure, deterministic function: same (profile, coliving) in,
// same result out, no I/O or globals — so it's trivially unit-testable. It
// returns not just a number but the signed factors that produced it, so the UI
// can always explain a score instead of asserting one.
//
// Scores are built from a low base plus *continuous* factors, deliberately
// tuned so a near-perfect match tops out in the high 90s and 100 is effectively
// unreachable. That keeps the ranking meaningful (no pile-up of tied 100s) and
// keeps the score honest rather than promotional.

import type { Coliving, Currency } from "@/lib/types";
import type { CommunityPreference, UserProfile } from "@/lib/profile";

export type FactorSign = "positive" | "negative";

export interface FitFactor {
  /** Short, scannable reason, e.g. "calls-friendly wifi" or "30-night minimum". */
  label: string;
  sign: FactorSign;
  /** Signed point contribution to the score (drives ordering + transparency). */
  points: number;
}

export interface FitResult {
  /** 0–100, clamped. Realistic ceiling ~98 by design. */
  score: number;
  /** Positives first, then negatives — each ordered by magnitude. */
  factors: FitFactor[];
}

// Rough FX so prices in different currencies compare against a USD budget.
// Approximation only — a real app would use live rates at the data boundary.
const USD_PER_UNIT: Record<Currency, number> = { USD: 1, EUR: 1.08 };

const BASE_SCORE = 35;
const CALLS_WIFI_REF = 250; // Mbps treated as "great" for video calls

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function toUsd(amount: number, currency: Currency): number {
  return amount * USD_PER_UNIT[currency];
}

function signOf(points: number): FactorSign {
  return points >= 0 ? "positive" : "negative";
}

function budgetFactor(profile: UserProfile, c: Coliving): FitFactor {
  const price = toUsd(c.monthlyAllIn, c.currency);
  const budget = profile.monthlyBudgetUsd;

  if (price <= budget) {
    const headroom = (budget - price) / budget; // 0..1
    const points = Math.round(clamp(4 + (Math.min(headroom, 0.4) / 0.4) * 14, 4, 18));
    return {
      label: headroom >= 0.15 ? "well under budget" : "within budget",
      sign: "positive",
      points,
    };
  }

  const over = (price - budget) / budget;
  const points = -Math.round(clamp(6 + (Math.min(over, 0.5) / 0.5) * 22, 6, 28));
  return { label: `~$${Math.round(price - budget)} over budget`, sign: "negative", points };
}

// How socially-charged a place is, 0 (heads-down) .. 1 (buzzing), blending the
// declared community type with the measured focus score.
function socialness(c: Coliving): number {
  const typeVal = c.communityType === "social" ? 1 : c.communityType === "balanced" ? 0.5 : 0;
  return 0.6 * typeVal + 0.4 * (1 - c.focusScore);
}

const SOCIAL_TARGET: Record<CommunityPreference, number> = {
  quiet: 0.1,
  balanced: 0.5,
  community: 0.9,
};

function atmosphereLabel(
  pref: CommunityPreference,
  socialLean: number,
  target: number,
  points: number,
): string {
  if (points >= 0) {
    if (pref === "quiet") return points >= 12 ? "quiet, focus-friendly" : "fairly calm";
    if (pref === "community") return points >= 12 ? "strong social scene" : "some community";
    return points >= 12 ? "balanced rhythm" : "roughly your vibe";
  }
  if (pref === "quiet") return "livelier than you want";
  if (pref === "community") return "quieter than you want";
  return socialLean > target ? "leans social" : "leans quiet";
}

function atmosphereFactor(profile: UserProfile, c: Coliving): FitFactor {
  const socialLean = socialness(c);
  const target = SOCIAL_TARGET[profile.communityPreference];
  const align = 1 - Math.abs(socialLean - target); // 1 = exact match
  let points = Math.round(clamp((align - 0.65) * 60, -20, 22));
  if (points === 0) points = 1; // never render a bare "+0" chip
  return {
    label: atmosphereLabel(profile.communityPreference, socialLean, target, points),
    sign: signOf(points),
    points,
  };
}

function callsFactor(profile: UserProfile, c: Coliving): FitFactor | null {
  if (!profile.needsCalls) return null;
  const wifi = Math.min(1, c.wifiMbps / CALLS_WIFI_REF);
  const quality = c.callsFriendly ? 0.7 + 0.3 * wifi : 0.3 * wifi;
  const points = Math.round(clamp((quality - 0.55) * 40, -18, 18));
  const label =
    points >= 10
      ? "calls-friendly wifi"
      : points >= 0
        ? "okay for calls"
        : points > -12
          ? "so-so for calls"
          : "weak for calls";
  return { label, sign: signOf(points), points };
}

function stayFactor(profile: UserProfile, c: Coliving): FitFactor | null {
  if (profile.stayLengthDays < c.minStayDays) {
    const deficit = (c.minStayDays - profile.stayLengthDays) / c.minStayDays;
    const points = -Math.round(clamp(6 + deficit * 14, 6, 20));
    return { label: `${c.minStayDays}-night minimum`, sign: "negative", points };
  }
  if (c.minStayDays <= 14) return { label: "flexible minimum stay", sign: "positive", points: 5 };
  return null; // meets the minimum but nothing notable to surface
}

export function computeFit(profile: UserProfile, coliving: Coliving): FitResult {
  const factors: FitFactor[] = [budgetFactor(profile, coliving), atmosphereFactor(profile, coliving)];

  const calls = callsFactor(profile, coliving);
  if (calls) factors.push(calls);

  const stay = stayFactor(profile, coliving);
  if (stay) factors.push(stay);

  // When calls aren't required, that dimension can neither help nor hurt, so we
  // rebase to keep the achievable range comparable to the calls-on case —
  // otherwise no-calls profiles could never reach the high 90s.
  const base = BASE_SCORE + (profile.needsCalls ? 0 : 12);
  const raw = factors.reduce((sum, f) => sum + f.points, base);
  const score = Math.max(0, Math.min(100, Math.round(raw)));

  // Positives before negatives; within each, larger magnitude first.
  factors.sort((a, b) => {
    if (a.sign !== b.sign) return a.sign === "positive" ? -1 : 1;
    return Math.abs(b.points) - Math.abs(a.points);
  });

  return { score, factors };
}

/**
 * A scannable, honest one-liner about who a place suits — derived from the
 * declared community type and the measured focus score. Pure and testable.
 */
export function greatForNotFor(c: Coliving): { great: string; not: string } {
  if (c.communityType === "social" || c.focusScore <= 0.4) {
    return { great: "meeting people & built-in social life", not: "quiet, heads-down weeks" };
  }
  if (c.communityType === "focus" || c.focusScore >= 0.7) {
    return { great: "deep focus & heads-down work", not: "a big social scene" };
  }
  return { great: "a balance of focus and community", not: "total silence or non-stop parties" };
}
