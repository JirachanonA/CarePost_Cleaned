"use client";

import { Hospital, Phone, Siren, Stethoscope } from "lucide-react";
import type { CarePlan } from "@/lib/types/care-plan";
import { BackHeader, ButtonLink, Disclaimer, EmptyPlan, Screen, cx } from "@/components/ui";
import { useCarePlan } from "@/lib/use-care-plan";

type Flag = CarePlan["red_flags"][number];

const GROUPS = [
  {
    key: "emergency",
    title: "Call 911 now",
    Icon: Siren,
    match: (f: Flag) => f.severity_hint === "emergency",
    tone: "bg-danger text-white",
    itemTone: "bg-white/15",
  },
  {
    key: "urgent",
    title: "Go to the ER or urgent care",
    Icon: Hospital,
    match: (f: Flag) => f.severity_hint === "urgent",
    tone: "bg-danger-wash text-danger-ink ring-1 ring-danger/15",
    itemTone: "bg-white text-label",
  },
  {
    key: "contact",
    title: "Call your doctor",
    Icon: Stethoscope,
    match: (f: Flag) => f.severity_hint !== "emergency" && f.severity_hint !== "urgent",
    tone: "bg-sun-wash text-sun-ink",
    itemTone: "bg-white text-label",
  },
] as const;

export default function WarningsPage() {
  const { plan, ready } = useCarePlan();
  if (!ready) return <Screen>{null}</Screen>;
  if (!plan) return <Screen><EmptyPlan /></Screen>;

  return (
    <Screen className="lg:max-w-3xl">
      <BackHeader title="Warning signs" subtitle="What to do if something feels wrong" />

      <ButtonLink href="tel:911" variant="danger" className="w-full text-[19px] lg:w-auto lg:px-10">
        <Phone className="size-5" strokeWidth={2.6} /> Call 911
      </ButtonLink>

      <div className="mt-6 flex flex-col gap-4">
        {GROUPS.map(({ key, title, Icon, match, tone, itemTone }, gi) => {
          const flags = plan.red_flags.filter(match);
          if (!flags.length) return null;
          return (
            <section key={key} className={cx("rise rounded-[32px] p-5", tone)} style={{ "--i": gi } as React.CSSProperties}>
              <h2 className="flex items-center gap-2.5 text-[19px] font-bold">
                <Icon className="size-6" strokeWidth={2.4} /> {title}
              </h2>
              <ul className="mt-3 flex flex-col gap-2">
                {flags.map((f, i) => (
                  <li key={i} className={cx("rounded-[20px] px-4 py-3.5 text-[17px] font-medium leading-snug", itemTone)}>
                    {f.text}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
        {plan.red_flags.length === 0 && (
          <p className="text-label-2">No warning signs were listed in your papers. If you feel worse, call your doctor.</p>
        )}
      </div>

      <Disclaimer />
    </Screen>
  );
}
