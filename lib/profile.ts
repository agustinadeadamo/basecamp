// The user's profile — a few fast inputs that drive the whole Explorer.
// Kept separate from the coliving domain model (lib/types.ts) and consumed by
// the pure fit function (lib/fit.ts).

/** How much social energy the user wants from a place. */
export type CommunityPreference = "quiet" | "balanced" | "community";

export interface UserProfile {
  /** Target all-in monthly spend, expressed in USD for comparison. */
  monthlyBudgetUsd: number;
  /** Whether the user takes frequent video calls (needs quiet + fast wifi). */
  needsCalls: boolean;
  communityPreference: CommunityPreference;
  /** Intended length of stay, in days. */
  stayLengthDays: number;
}

export const DEFAULT_PROFILE: UserProfile = {
  monthlyBudgetUsd: 1200,
  needsCalls: true,
  communityPreference: "balanced",
  stayLengthDays: 30,
};

// Budget slider bounds.
export const BUDGET_MIN = 500;
export const BUDGET_MAX = 3000;
export const BUDGET_STEP = 50;

/** Fast stay-length presets, in days. */
export const STAY_PRESETS: { label: string; days: number }[] = [
  { label: "2 weeks", days: 14 },
  { label: "1 month", days: 30 },
  { label: "3 months", days: 90 },
];

export const COMMUNITY_OPTIONS: { value: CommunityPreference; label: string }[] = [
  { value: "quiet", label: "Quiet" },
  { value: "balanced", label: "Balanced" },
  { value: "community", label: "Community" },
];
