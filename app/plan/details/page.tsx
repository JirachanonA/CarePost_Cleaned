"use client";

import { Apple, Ban, CircleCheck, Footprints } from "lucide-react";
import type { ReactNode } from "react";
import { BackHeader, Card, Disclaimer, EmptyPlan, Screen, SectionLabel } from "@/components/ui";
import { useCarePlan } from "@/lib/use-care-plan";

function DoAvoid({ title, icon, good, bad }: { title: string; icon: ReactNode; good: string[]; bad: string[] }) {
  return (
    <Card>
      <h2 className="flex items-center gap-2.5 text-[19px] font-bold">{icon} {title}</h2>
      {good.length > 0 && (
        <ul className="mt-4 flex flex-col gap-2.5">
          {good.map((x, i) => (
            <li key={i} className="flex items-start gap-3 text-[17px] leading-snug">
              <CircleCheck className="mt-0.5 size-5 shrink-0 text-brand" strokeWidth={2.4} /> {x}
            </li>
          ))}
        </ul>
      )}
      {bad.length > 0 && (
        <ul className="mt-4 flex flex-col gap-2.5 border-t border-hairline pt-4">
          {bad.map((x, i) => (
            <li key={i} className="flex items-start gap-3 text-[17px] leading-snug">
              <Ban className="mt-0.5 size-5 shrink-0 text-danger" strokeWidth={2.4} /> {x}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export default function DetailsPage() {
  const { plan, ready } = useCarePlan();
  if (!ready) return <Screen>{null}</Screen>;
  if (!plan) return <Screen><EmptyPlan /></Screen>;

  return (
    <Screen className="lg:max-w-3xl">
      <BackHeader title="About your care" />

      <SectionLabel>In plain words</SectionLabel>
      <p className="rounded-[28px] bg-sky-wash p-5 text-[19px] leading-relaxed">{plan.plain_language_summary}</p>

      <div className="mt-6 grid gap-3 lg:grid-cols-2 lg:items-start">
        <DoAvoid
          title="Activity"
          icon={<Footprints className="size-6 text-brand" />}
          good={plan.activity.allowances}
          bad={plan.activity.restrictions}
        />
        <DoAvoid
          title="Food & drink"
          icon={<Apple className="size-6 text-brand" />}
          good={plan.diet.do}
          bad={plan.diet.avoid}
        />
      </div>

      <Disclaimer />
    </Screen>
  );
}
