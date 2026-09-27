"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Apple,
  BookOpen,
  CalendarDays,
  Check,
  ChevronRight,
  Footprints,
  ListChecks,
  Pill,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import type { CarePlan, MedScheduleItem } from "@/lib/types/care-plan";
import { MedReminderBanner } from "@/components/MedReminderBanner";
import { Disclaimer, EmptyPlan, Logo, ProgressBar, RowLink, Screen, SectionLabel, Sheet, cx } from "@/components/ui";
import { checklistProgress, useCarePlan } from "@/lib/use-care-plan";
import { getActiveReminder, requestNotificationPermission, scheduleMedReminders } from "@/lib/reminders";

const CATEGORY_ICON: Record<CarePlan["todays_checklist"][number]["category"], LucideIcon> = {
  medication: Pill,
  activity: Footprints,
  diet: Apple,
  follow_up: CalendarDays,
  education: BookOpen,
  other: ListChecks,
};

function todayLabel() {
  return new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

export default function TodayPage() {
  const { plan, ready, update } = useCarePlan();
  const [activeReminder, setActiveReminder] = useState<MedScheduleItem | null>(null);
  const [dismissedTimes, setDismissedTimes] = useState<Set<string>>(new Set());
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const schedule = plan?.medication_schedule_today;
    if (!schedule?.length) return;

    requestNotificationPermission();
    cleanupRef.current?.();
    cleanupRef.current = scheduleMedReminders(schedule, (item) => setActiveReminder(item));

    function checkBanner() {
      const reminder = getActiveReminder(schedule!);
      if (reminder && !dismissedTimes.has(reminder.time_local)) setActiveReminder(reminder);
    }

    checkBanner();
    const interval = setInterval(checkBanner, 60_000);
    return () => {
      clearInterval(interval);
      cleanupRef.current?.();
    };
    // Re-schedule only when the schedule itself changes, not on every checklist tick
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan?.medication_schedule_today, dismissedTimes]);

  function dismissReminder() {
    if (!activeReminder) return;
    setDismissedTimes((prev) => new Set(prev).add(activeReminder.time_local));
    setActiveReminder(null);
  }

  function toggle(id: string) {
    if (!plan) return;
    update({
      ...plan,
      todays_checklist: plan.todays_checklist.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      ),
    });
  }

  if (!ready) return <Screen>{null}</Screen>;
  if (!plan) return <Screen><EmptyPlan /></Screen>;

  const progress = checklistProgress(plan);
  const allDone = progress.total > 0 && progress.done === progress.total;
  const serious = plan.red_flags.filter((f) => f.severity_hint === "emergency" || f.severity_hint === "urgent");
  const watch = (serious.length ? serious : plan.red_flags).slice(0, 2);
  const meds = plan.medications;
  const nextFollowUp = plan.follow_ups[0];

  return (
    <Screen>
      <div className="flex justify-center lg:hidden">
        <Logo size={56} />
      </div>

      <div className="lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-start lg:gap-8">
      <div className="lg:sticky lg:top-12">

      {/* Hero — Figma "Your Plan Today" card, solid teal for legible white text */}
      <section className="rise mt-3 rounded-[40px] lg:py-10 bg-gradient-to-br from-brand to-brand-deep px-6 pb-7 pt-6 text-center text-white shadow-[0_14px_36px_rgb(8_145_178/0.3)]">
        <p className="text-[15px] font-medium text-white/85">{todayLabel()} · Sample plan</p>
        <h1 className="display mt-1 text-[36px] font-bold">Your Plan Today</h1>
        <p className="mt-1 text-[20px] font-bold tabular-nums" aria-live="polite">
          {allDone ? "All done — nice work" : `${progress.done} of ${progress.total} done`}
        </p>
        <ProgressBar value={progress.ratio} className="mx-auto mt-4 max-w-[16rem]" />
        <p className="mt-4 line-clamp-2 text-[15px] text-white/85">{plan.diagnosis_or_reason}</p>
      </section>

      {activeReminder && (
        <div className="rise mt-4">
          <MedReminderBanner reminder={activeReminder} onDismiss={dismissReminder} />
        </div>
      )}

      {/* Warning signs stay on Today — the most important safety content */}
      {watch.length > 0 && (
        <Link
          href="/plan/warnings"
          style={{ "--i": 1 } as React.CSSProperties}
          className="rise pressable mt-4 flex gap-4 rounded-[28px] bg-danger-wash p-5 ring-1 ring-danger/15"
        >
          <TriangleAlert className="mt-0.5 size-7 shrink-0 text-danger" strokeWidth={2.4} />
          <span className="min-w-0 flex-1">
            <span className="block text-[13px] font-bold uppercase tracking-[0.06em] text-danger-ink">
              Get help if you have
            </span>
            {watch.map((f, i) => (
              <span key={i} className="mt-1 block text-[17px] font-semibold leading-snug text-label">
                {f.text}
              </span>
            ))}
            <span className="mt-2 inline-flex items-center gap-1 text-[15px] font-semibold text-danger-ink">
              All warning signs <ChevronRight className="size-4" />
            </span>
          </span>
        </Link>
      )}

      </div>

      <div>
      {/* Checklist — Figma "Sheet - Inspector" */}
      <Sheet title="Checklist" className="rise mt-5 lg:mt-3" >
        {plan.todays_checklist.length === 0 ? (
          <p className="px-4 pb-4 pt-2 text-center text-label-2">Nothing to check off today.</p>
        ) : (
          <ul className="flex flex-col gap-1 pt-1">
            {plan.todays_checklist.map((item) => {
              const Icon = CATEGORY_ICON[item.category] ?? ListChecks;
              const done = !!item.done;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={done}
                    onClick={() => toggle(item.id)}
                    className="pressable flex min-h-[64px] w-full items-center gap-3.5 rounded-[26px] px-3 py-2.5 text-left active:bg-black/[0.04]"
                  >
                    <span
                      className={cx(
                        "flex size-8 shrink-0 items-center justify-center rounded-full transition-[background-color,box-shadow,transform] duration-200 ease-[var(--ease-out)]",
                        done ? "scale-100 bg-brand" : "bg-white ring-2 ring-inset ring-label-3/50"
                      )}
                    >
                      <Check
                        className={cx(
                          "size-5 text-white transition-[opacity,transform] duration-200 ease-[var(--ease-out)]",
                          done ? "scale-100 opacity-100" : "scale-50 opacity-0"
                        )}
                        strokeWidth={3}
                      />
                    </span>
                    <span
                      className={cx(
                        "min-w-0 flex-1 text-[17px] leading-snug transition-colors duration-200",
                        done ? "text-label-3 line-through decoration-label-3/60" : "text-label"
                      )}
                    >
                      {item.label}
                    </span>
                    <Icon className="size-5 shrink-0 text-label-3" aria-hidden />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </Sheet>

      <SectionLabel className="mt-8">Your care</SectionLabel>
      <Sheet className="p-1.5">
        <RowLink
          href="/plan/medications"
          icon={<Pill className="size-5" />}
          title="Medications"
          detail={meds.length ? meds.map((m) => m.name).join(", ") : "None listed"}
        />
        <RowLink
          href="/plan/warnings"
          tone="danger"
          icon={<TriangleAlert className="size-5" />}
          title="Warning signs"
          detail={`${plan.red_flags.length} to watch for`}
        />
        <RowLink
          href="/plan/appointments"
          tone="sun"
          icon={<CalendarDays className="size-5" />}
          title="Appointments"
          detail={nextFollowUp ? `${nextFollowUp.type} · ${nextFollowUp.within_text}` : "None listed"}
        />
        <RowLink
          href="/plan/details"
          tone="sky"
          icon={<BookOpen className="size-5" />}
          title="Diet, activity & summary"
        />
      </Sheet>
      </div>
      </div>

      <Disclaimer />
    </Screen>
  );
}
