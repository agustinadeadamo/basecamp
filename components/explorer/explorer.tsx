"use client";

import { useMemo, useState } from "react";

import type { Coliving } from "@/lib/types";
import { DEFAULT_PROFILE, type UserProfile } from "@/lib/profile";
import { computeFit } from "@/lib/fit";
import { ColivingCard } from "./coliving-card";
import { ProfileControl } from "./profile-control";

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

  return (
    <div className="flex flex-col gap-8">
      <ProfileControl value={profile} onChange={setProfile} />

      <section aria-label="Coliving results" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ranked.map(({ coliving, fit }) => (
          <ColivingCard key={coliving.id} coliving={coliving} fit={fit} />
        ))}
      </section>
    </div>
  );
}
