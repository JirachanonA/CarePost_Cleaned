"use client";

import { BellRing, X } from "lucide-react";
import type { MedScheduleItem } from "@/lib/types/care-plan";

interface Props {
  reminder: MedScheduleItem;
  onDismiss: () => void;
}

export function MedReminderBanner({ reminder, onDismiss }: Props) {
  return (
    <div role="status" className="glass flex items-center gap-4 rounded-[28px] p-4 pl-5">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-sun-wash text-sun-ink">
        <BellRing className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-bold uppercase tracking-[0.06em] text-sun-ink">
          Time for medicine · {reminder.time_local}
        </p>
        <p className="text-[17px] font-semibold leading-snug">{reminder.label}</p>
      </div>
      <button
        onClick={onDismiss}
        aria-label="Dismiss reminder"
        className="pressable flex size-11 shrink-0 items-center justify-center rounded-full text-label-2 active:bg-black/5"
      >
        <X className="size-5" />
      </button>
    </div>
  );
}
