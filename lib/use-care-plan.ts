"use client";

import { useCallback, useEffect, useState } from "react";
import type { CarePlan } from "@/lib/types/care-plan";
import { loadCarePlan, saveCarePlan } from "@/lib/care-plan-storage";

/** Reads the saved plan after mount; `ready` avoids flashing the empty state. */
export function useCarePlan() {
  const [plan, setPlan] = useState<CarePlan | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setPlan(loadCarePlan());
    setReady(true);
  }, []);

  const update = useCallback((next: CarePlan) => {
    setPlan(next);
    saveCarePlan(next, { keepReminders: true });
  }, []);

  return { plan, ready, update };
}

export function checklistProgress(plan: CarePlan | null) {
  const items = plan?.todays_checklist ?? [];
  const done = items.filter((i) => i.done).length;
  return { done, total: items.length, ratio: items.length ? done / items.length : 0 };
}
