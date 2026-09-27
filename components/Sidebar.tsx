"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  CalendarCheck,
  CalendarDays,
  House,
  MessageCircleHeart,
  Pill,
  TriangleAlert,
  Upload,
  type LucideIcon,
} from "lucide-react";
import { LogoMark } from "@/components/LogoMark";
import { LanguagePicker } from "@/components/GoogleTranslate";
import { cx } from "@/components/ui";

const MAIN: [string, string, LucideIcon][] = [
  ["/", "Home", House],
  ["/upload", "Upload", Upload],
  ["/plan", "Today", CalendarCheck],
  ["/check-in", "Chat", MessageCircleHeart],
];

const CARE: [string, string, LucideIcon][] = [
  ["/plan/medications", "Medications", Pill],
  ["/plan/warnings", "Warning signs", TriangleAlert],
  ["/plan/appointments", "Appointments", CalendarDays],
  ["/plan/details", "Diet & activity", BookOpen],
];

function Row({ href, label, Icon, active }: { href: string; label: string; Icon: LucideIcon; active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cx(
        "pressable flex h-12 items-center gap-3 rounded-[16px] px-3.5 text-[16px] font-semibold transition-colors duration-150",
        active ? "bg-fill text-brand-ink" : "text-label hover:bg-black/[0.04]"
      )}
    >
      <Icon className="size-5 shrink-0" strokeWidth={active ? 2.5 : 2} />
      {label}
    </Link>
  );
}

/** Desktop navigation (≥1024px). Phones use the floating TabBar instead. */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-hairline bg-surface/80 px-4 py-6 backdrop-blur-xl lg:flex">
      <Link href="/" className="mb-8 flex items-center gap-2.5 px-2" aria-label="CarePost home">
        <LogoMark size={40} />
        <span className="text-[24px] font-bold tracking-[-0.03em] text-brand">CarePost</span>
      </Link>

      <nav aria-label="Main" className="flex flex-col gap-1">
        {MAIN.map(([href, label, Icon]) => (
          <Row key={href} href={href} label={label} Icon={Icon} active={pathname === href} />
        ))}
      </nav>

      <p className="mb-2 mt-8 px-3.5 text-[12px] font-semibold uppercase tracking-[0.06em] text-label-3">
        Your care
      </p>
      <nav aria-label="Your care" className="flex flex-col gap-1">
        {CARE.map(([href, label, Icon]) => (
          <Row key={href} href={href} label={label} Icon={Icon} active={pathname === href} />
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-3">
        <LanguagePicker variant="sidebar" />
        <p className="px-2 text-[12px] leading-relaxed text-label-3">
          Not medical advice. In an emergency, call 911.
        </p>
      </div>
    </aside>
  );
}
