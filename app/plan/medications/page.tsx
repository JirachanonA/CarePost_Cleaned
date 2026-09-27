"use client";

import { Clock, Pill } from "lucide-react";
import { SmsReminders } from "@/components/SmsReminderSetup";
import { BackHeader, Card, Disclaimer, EmptyPlan, IconBadge, Screen, SectionLabel } from "@/components/ui";
import { useCarePlan } from "@/lib/use-care-plan";

export default function MedicationsPage() {
  const { plan, ready } = useCarePlan();
  if (!ready) return <Screen>{null}</Screen>;
  if (!plan) return <Screen><EmptyPlan /></Screen>;

  const schedule = plan.medication_schedule_today ?? [];
  const smsSchedule = schedule.length
    ? schedule
    : plan.medications.map((m) => ({
        time_local: "as scheduled",
        label: `${m.name}${m.dose ? ` ${m.dose}` : ""} — ${m.frequency_text ?? ""}`,
      }));

  return (
    <Screen>
      <BackHeader title="Medications" />

      {schedule.length > 0 && (
        <>
          <SectionLabel>Today&apos;s times</SectionLabel>
          <ol className="relative mb-8 ml-3 border-l-2 border-sky pl-6">
            {schedule.map((m, i) => (
              <li key={`${m.time_local}-${i}`} className="rise relative pb-5 last:pb-0" style={{ "--i": i } as React.CSSProperties}>
                <span className="absolute -left-[33px] top-1 flex size-4 items-center justify-center rounded-full bg-white ring-4 ring-brand" />
                <p className="text-[22px] font-bold tabular-nums text-brand-ink">{m.time_local}</p>
                <p className="text-[17px] text-label">{m.label}</p>
              </li>
            ))}
          </ol>
        </>
      )}

      <SectionLabel>Your medications</SectionLabel>
      {plan.medications.length === 0 ? (
        <p className="text-label-2">No medications were found in your papers.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {plan.medications.map((m, i) => (
            <li key={i} className="rise" style={{ "--i": i } as React.CSSProperties}>
              <Card className="flex gap-4">
                <IconBadge><Pill className="size-5" /></IconBadge>
                <div className="min-w-0 flex-1">
                  <p className="text-[19px] font-semibold leading-snug">
                    {m.name}
                    {m.dose && <span className="font-normal text-label-2"> · {m.dose}</span>}
                  </p>
                  {m.frequency_text && (
                    <p className="mt-1 flex items-center gap-1.5 text-[17px] text-label">
                      <Clock className="size-4 text-brand" /> {m.frequency_text}
                    </p>
                  )}
                  {m.notes && (
                    <p className="mt-2 inline-block rounded-pill bg-sun-wash px-3 py-1 text-[15px] font-medium text-sun-ink">
                      {m.notes}
                    </p>
                  )}
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-3 px-1 text-[15px] text-label-3">
        Check doses against your pill bottles. Ask your pharmacist if anything looks different.
      </p>

      <SectionLabel className="mt-8">Reminders</SectionLabel>
      <SmsReminders schedule={smsSchedule} />

      <Disclaimer />
    </Screen>
  );
}
