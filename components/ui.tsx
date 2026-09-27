import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ChevronLeft, ChevronRight, FileUp } from "lucide-react";
import { LogoMark } from "@/components/LogoMark";

export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

export function Logo({ size = 64, className }: { size?: number; className?: string }) {
  return <LogoMark size={size} className={cx("select-none", className)} />;
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cx("font-bold tracking-[-0.03em] text-brand", className)}>CarePost</span>
  );
}

/* Buttons ---------------------------------------------------------------- */

type Variant = "primary" | "pill" | "danger" | "ghost";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-brand-ink text-white shadow-[0_6px_16px_rgb(14_116_144/0.3)] active:bg-brand-deep",
  pill: "pill text-label",
  danger: "bg-danger text-white shadow-[0_6px_16px_rgb(220_38_38/0.3)] active:bg-danger-ink",
  ghost: "text-brand-ink active:bg-brand-wash",
};

const BASE =
  "pressable inline-flex min-h-14 items-center justify-center gap-2.5 rounded-pill px-7 text-[17px] font-semibold disabled:opacity-50 disabled:active:scale-100";

export function Button({
  variant = "pill",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return <button type="button" className={cx(BASE, VARIANTS[variant], className)} {...props} />;
}

export function ButtonLink({
  variant = "pill",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={cx(BASE, VARIANTS[variant], className)} {...props} />;
}

/* Layout ----------------------------------------------------------------- */

export function Screen({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <main className={cx("flex flex-1 flex-col px-5 pb-36 pt-[calc(4.25rem+env(safe-area-inset-top))] lg:px-12 lg:pb-16 lg:pt-12", className)}>
      {children}
    </main>
  );
}

export function BackHeader({ title, href = "/plan", subtitle }: { title: string; href?: string; subtitle?: string }) {
  return (
    <header className="mb-6 flex items-center gap-3">
      <Link
        href={href}
        aria-label="Back"
        className="pressable pill flex size-12 shrink-0 items-center justify-center rounded-pill text-label"
      >
        <ChevronLeft className="size-6" strokeWidth={2.4} />
      </Link>
      <div className="min-w-0">
        <h1 className="display text-[28px] font-bold">{title}</h1>
        {subtitle && <p className="text-[15px] text-label-2">{subtitle}</p>}
      </div>
    </header>
  );
}

export function SectionLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={cx("mb-3 px-1 text-[13px] font-semibold uppercase tracking-[0.06em] text-label-3", className)}>
      {children}
    </h2>
  );
}

/** The Figma "Sheet - Inspector": soft gray, 34px radius, gentle lift. */
export function Sheet({ children, className, title }: { children: ReactNode; className?: string; title?: string }) {
  return (
    <section className={cx("rounded-sheet bg-surface p-2 shadow-card", className)}>
      {title && <h2 className="px-4 pb-1 pt-3 text-center text-[17px] font-semibold">{title}</h2>}
      {children}
    </section>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cx("rounded-card bg-white p-5 shadow-card ring-1 ring-hairline", className)}>{children}</div>
  );
}

export function IconBadge({ children, tone = "brand" }: { children: ReactNode; tone?: "brand" | "sun" | "danger" | "sky" }) {
  const tones = {
    brand: "bg-brand-wash text-brand-ink",
    sun: "bg-sun-wash text-sun-ink",
    danger: "bg-danger-wash text-danger-ink",
    sky: "bg-sky-wash text-brand-ink",
  };
  return (
    <span className={cx("flex size-11 shrink-0 items-center justify-center rounded-2xl", tones[tone])}>
      {children}
    </span>
  );
}

/** Tappable row used for navigation lists (Figma "Sidebar Row"). */
export function RowLink({
  href,
  icon,
  title,
  detail,
  tone,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  detail?: string;
  tone?: "brand" | "sun" | "danger" | "sky";
}) {
  return (
    <Link
      href={href}
      className="pressable flex min-h-[68px] items-center gap-4 rounded-[26px] px-3 py-2.5 active:bg-black/[0.04]"
    >
      <IconBadge tone={tone}>{icon}</IconBadge>
      <span className="min-w-0 flex-1">
        <span className="block text-[17px] font-semibold">{title}</span>
        {detail && <span className="block truncate text-[15px] text-label-2">{detail}</span>}
      </span>
      <ChevronRight className="size-5 shrink-0 text-label-3" />
    </Link>
  );
}

export function ProgressBar({ value, className, tone = "light" }: { value: number; className?: string; tone?: "light" | "dark" }) {
  const pct = Math.max(0, Math.min(100, value * 100));
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      className={cx("h-2.5 overflow-hidden rounded-pill", tone === "light" ? "bg-white/30" : "bg-black/[0.07]", className)}
    >
      <div
        className={cx(
          "h-full origin-left rounded-pill transition-transform duration-500 ease-[var(--ease-out)]",
          tone === "light" ? "bg-white" : "bg-brand"
        )}
        style={{ transform: `scaleX(${Math.max(pct, 3) / 100})` }}
      />
    </div>
  );
}

export function EmptyPlan({ title = "No plan yet" }: { title?: string }) {
  return (
    <div className="rise flex flex-1 flex-col items-center justify-center py-10 text-center">
      <div className="flex size-20 items-center justify-center rounded-[28px] bg-sky-wash">
        <FileUp className="size-9 text-sun" strokeWidth={2.2} />
      </div>
      <h2 className="display mt-5 text-[26px] font-bold">{title}</h2>
      <p className="mt-2 max-w-[18rem] text-label-2">
        Add a photo or PDF of your discharge papers and we&apos;ll turn it into a simple daily plan.
      </p>
      <ButtonLink href="/upload" variant="primary" className="mt-7 w-full max-w-xs">
        Upload discharge papers
      </ButtonLink>
    </div>
  );
}

export function Disclaimer({ className }: { className?: string }) {
  return (
    <p className={cx("mt-8 text-center text-[13px] leading-relaxed text-label-3", className)}>
      Demo only — every upload shows the same sample plan, not your real
      instructions. Not medical advice. In an emergency, call 911.
    </p>
  );
}
