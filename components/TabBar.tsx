"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck, House, MessageCircleHeart, Upload } from "lucide-react";

const TABS = [
  { href: "/", label: "Home", Icon: House },
  { href: "/upload", label: "Upload", Icon: Upload },
  { href: "/plan", label: "Today", Icon: CalendarCheck },
  { href: "/check-in", label: "Chat", Icon: MessageCircleHeart },
] as const;

function activeIndex(pathname: string) {
  const i = TABS.findIndex(({ href }) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`)
  );
  return i;
}

/** Floating Liquid Glass tab bar from the Figma "Home" component. */
export function TabBar() {
  const pathname = usePathname();
  const active = activeIndex(pathname);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40">
      <div className="edge-fade-bottom absolute inset-x-0 bottom-0 h-28" aria-hidden />
      <nav
        aria-label="Main"
        className="glass pointer-events-auto relative mx-auto mb-[max(1rem,env(safe-area-inset-bottom))] w-[min(22rem,calc(100%-2.5rem))] rounded-pill p-1.5"
      >
        <ul className="relative grid grid-cols-4">
          {/* Selection capsule slides between tabs (transform only) */}
          {active >= 0 && (
            <li
              aria-hidden
              className="absolute inset-y-0 left-0 w-1/4 rounded-pill bg-fill transition-transform duration-300 ease-[var(--ease-out)]"
              style={{ transform: `translateX(${active * 100}%)` }}
            />
          )}
          {TABS.map(({ href, label, Icon }, i) => {
            const on = i === active;
            return (
              <li key={href} className="relative">
                <Link
                  href={href}
                  aria-current={on ? "page" : undefined}
                  className={`pressable flex h-[58px] flex-col items-center justify-center gap-1 rounded-pill text-[12px] font-semibold ${
                    on ? "text-brand-ink" : "text-label"
                  }`}
                >
                  <Icon className="size-[22px]" strokeWidth={on ? 2.5 : 2} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
