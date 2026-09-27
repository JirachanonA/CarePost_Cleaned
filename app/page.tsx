"use client";

import Link from "next/link";
import { CalendarCheck, ChevronRight, MessageCircleHeart, Upload } from "lucide-react";
import { ButtonLink, Disclaimer, Logo, ProgressBar, Screen, Wordmark } from "@/components/ui";
import { checklistProgress, useCarePlan } from "@/lib/use-care-plan";

export default function HomePage() {
  const { plan, ready } = useCarePlan();
  const progress = checklistProgress(plan);

  return (
    <Screen className="items-center text-center">
      <div className="rise mt-8 flex flex-col items-center">
        <Logo size={168} />
        <h1 className="display mt-1 text-[52px]">
          <Wordmark />
        </h1>
        <p className="mt-2 max-w-[19rem] text-[19px] leading-snug text-label-2">
          Your discharge papers, turned into a simple plan for today.
        </p>
      </div>

      <div className="mt-10 flex w-full max-w-sm flex-col gap-3.5">
        {ready && plan ? (
          <Link
            href="/plan"
            style={{ "--i": 1 } as React.CSSProperties}
            className="rise pressable flex items-center gap-4 rounded-[28px] bg-gradient-to-br from-brand to-brand-deep p-5 text-left text-white shadow-[0_10px_30px_rgb(8_145_178/0.35)]"
          >
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-medium text-white/85">Continue your plan</span>
              <span className="block text-[22px] font-bold">
                {progress.total ? `${progress.done} of ${progress.total} done today` : "Open today’s plan"}
              </span>
              {progress.total > 0 && <ProgressBar value={progress.ratio} className="mt-3" />}
            </span>
            <ChevronRight className="size-6 shrink-0" />
          </Link>
        ) : (
          <ButtonLink
            href="/upload"
            variant="primary"
            className="rise w-full"
            style={{ "--i": 1 } as React.CSSProperties}
          >
            <Upload className="size-5" strokeWidth={2.4} />
            Upload discharge papers
          </ButtonLink>
        )}

        <ButtonLink
          href={ready && plan ? "/upload" : "/plan"}
          className="rise w-full"
          style={{ "--i": 2 } as React.CSSProperties}
        >
          {ready && plan ? (
            <>
              <Upload className="size-5 text-sun" strokeWidth={2.4} />
              Upload new papers
            </>
          ) : (
            <>
              <CalendarCheck className="size-5 text-brand" strokeWidth={2.4} />
              Your plan
            </>
          )}
        </ButtonLink>

        <ButtonLink
          href="/check-in"
          className="rise w-full text-brand-ink"
          style={{ "--i": 3 } as React.CSSProperties}
        >
          <MessageCircleHeart className="size-5" strokeWidth={2.4} />
          Chat with Companion
        </ButtonLink>
      </div>

      <Disclaimer className="mt-auto max-w-xs pt-10" />
    </Screen>
  );
}
