"use client";

import {
  BUDGET_MAX,
  BUDGET_MIN,
  BUDGET_STEP,
  COMMUNITY_OPTIONS,
  STAY_PRESETS,
  type CommunityPreference,
  type UserProfile,
} from "@/lib/profile";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

function Field({ label, htmlFor, children }: { label: string; htmlFor?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      <Label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}

export function ProfileControl({
  value,
  onChange,
}: {
  value: UserProfile;
  onChange: (next: UserProfile) => void;
}) {
  function set<K extends keyof UserProfile>(key: K, v: UserProfile[K]) {
    onChange({ ...value, [key]: v });
  }

  const budgetLabel = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value.monthlyBudgetUsd);

  return (
    <Card className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-4">
      <Field label="Monthly budget" htmlFor="budget">
        <div className="flex items-baseline justify-between">
          <span className="text-lg font-semibold tabular-nums text-foreground">{budgetLabel}</span>
          <span className="text-xs text-muted-foreground">all-in / mo</span>
        </div>
        <Slider
          id="budget"
          min={BUDGET_MIN}
          max={BUDGET_MAX}
          step={BUDGET_STEP}
          value={[value.monthlyBudgetUsd]}
          onValueChange={([v]) => set("monthlyBudgetUsd", v)}
          aria-label="Monthly budget in US dollars"
        />
      </Field>

      <Field label="Frequent video calls">
        <div className="flex items-center gap-3 pt-1">
          <Switch
            id="calls"
            checked={value.needsCalls}
            onCheckedChange={(checked) => set("needsCalls", checked)}
          />
          <Label htmlFor="calls" className="text-sm text-muted-foreground">
            {value.needsCalls ? "Needs quiet + fast wifi" : "Not a priority"}
          </Label>
        </div>
      </Field>

      <Field label="Atmosphere">
        <ToggleGroup
          type="single"
          variant="outline"
          aria-label="Atmosphere preference"
          value={value.communityPreference}
          onValueChange={(v) => v && set("communityPreference", v as CommunityPreference)}
          className="w-full"
        >
          {COMMUNITY_OPTIONS.map((opt) => (
            <ToggleGroupItem key={opt.value} value={opt.value} className="flex-1">
              {opt.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </Field>

      <Field label="Stay length">
        <ToggleGroup
          type="single"
          variant="outline"
          aria-label="Stay length"
          value={String(value.stayLengthDays)}
          onValueChange={(v) => v && set("stayLengthDays", Number(v))}
          className="w-full"
        >
          {STAY_PRESETS.map((preset) => (
            <ToggleGroupItem key={preset.days} value={String(preset.days)} className="flex-1">
              {preset.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </Field>
    </Card>
  );
}
