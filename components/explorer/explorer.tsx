"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { Coliving } from "@/lib/types";
import { DEFAULT_PROFILE, type UserProfile } from "@/lib/profile";
import { computeFit } from "@/lib/fit";
import { ColivingCard } from "./coliving-card";
import { EmptyState } from "./empty-state";
import { ProfileControl } from "./profile-control";

// Below this fit score, a place isn't a meaningful match. If nothing clears it,
// we show an intentional empty state rather than a grid of weak results.
const STRONG_MATCH_THRESHOLD = 50;

export function Explorer({ colivings }: { colivings: Coliving[] }) {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  // Recompute + rank best-fit-first whenever the profile changes.
  const ranked = useMemo(
    () =>
      colivings
        .map((coliving) => ({ coliving, fit: computeFit(profile, coliving) }))
        .sort((a, b) => b.fit.score - a.fit.score),
    [colivings, profile],
  );

  const hasStrongMatch = ranked.some(({ fit }) => fit.score >= STRONG_MATCH_THRESHOLD);

  // Re-trigger the score/reasoning reveal once the profile settles (debounced so
  // dragging the budget slider doesn't fire a flurry of animations).
  const [revealKey, setRevealKey] = useState(0);
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const t = setTimeout(() => setRevealKey((k) => k + 1), 120);
    return () => clearTimeout(t);
  }, [profile]);

  return (
    <div className="flex flex-col gap-8">
      <section aria-label="Your preferences">
        <ProfileControl value={profile} onChange={setProfile} />
      </section>

      {hasStrongMatch ? (
        <section aria-labelledby="results-heading" className="flex flex-col gap-6">
          <h2 id="results-heading" className="sr-only">
            Coliving matches
          </h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {ranked.map(({ coliving, fit }, index) => (
              <ColivingCard
                key={coliving.id}
                coliving={coliving}
                fit={fit}
                revealKey={revealKey}
                index={index}
              />
            ))}
          </div>
        </section>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
