"use client";

import { CalendarDays, Check, Clock, MapPin, MessageSquare } from "lucide-react";
import { BackHeader, Card, Disclaimer, EmptyPlan, IconBadge, Screen, SectionLabel, Sheet } from "@/components/ui";
import { useCarePlan } from "@/lib/use-care-plan";

const BRING = ["Photo ID & insurance card", "These discharge papers", "All your medicine bottles", "A list of allergies"];

export default function AppointmentsPage() {
  const { plan, ready } = useCarePlan();
  if (!ready) return <Screen>{null}</Screen>;
  if (!plan) return <Screen><EmptyPlan /></Screen>;

  const mention = [
    `Why you were in the hospital: ${plan.diagnosis_or_reason}`,
    ...plan.medications.map((m) => `${m.name}${m.dose ? ` ${m.dose}` : ""}${m.frequency_text ? ` — ${m.frequency_text}` : ""}`),
    ...plan.red_flags.slice(0, 3).map((f) => `Any signs of: ${f.text}`),
  ];

  return (
    <Screen>
      <BackHeader title="Appointments" />

      {plan.follow_ups.length === 0 ? (
        <p className="text-label-2">No follow-up visits were found in your papers.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {plan.follow_ups.map((f, i) => (
            <li key={i} className="rise" style={{ "--i": i } as React.CSSProperties}>
              <Card className="flex gap-4">
                <IconBadge tone="sun"><CalendarDays className="size-5" /></IconBadge>
                <div className="min-w-0 flex-1">
                  <p className="text-[19px] font-semibold leading-snug">
                    {f.type}
                    {f.provider && <span className="font-normal text-label-2"> — {f.provider}</span>}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-[17px] font-semibold text-brand-ink">
                    <Clock className="size-4" /> {f.datetime_if_known || f.within_text}
                  </p>
                  {f.location && (
                    <p className="mt-1 flex items-center gap-1.5 text-[15px] text-label-2">
                      <MapPin className="size-4" /> {f.location}
                    </p>
                  )}
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <SectionLabel className="mt-8">What to bring</SectionLabel>
      <Sheet className="p-4">
        <ul className="flex flex-col gap-3">
          {BRING.map((item) => (
            <li key={item} className="flex items-center gap-3 text-[17px]">
              <Check className="size-5 shrink-0 text-brand" strokeWidth={2.6} /> {item}
            </li>
          ))}
        </ul>
      </Sheet>

      <SectionLabel className="mt-8">What to tell your doctor</SectionLabel>
      <Sheet className="p-4">
        <ul className="flex flex-col gap-3">
          {mention.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-[17px] leading-snug">
              <MessageSquare className="mt-0.5 size-5 shrink-0 text-brand" /> {item}
            </li>
          ))}
        </ul>
      </Sheet>

      <Disclaimer />
    </Screen>
  );
}
