import { useId } from "react";

/*
 * The CarePost cross, traced from the Figma PNG (625×625 grid):
 * an orange "L" (top + right arms) and a sky "L" (left + bottom arms),
 * with teal wherever they overlap.
 */
const ORANGE = (
  <>
    <rect x="230" y="52" width="152" height="330" rx="76" />
    <rect x="230" y="230" width="332" height="152" rx="76" />
  </>
);
const SKY = (
  <>
    <rect x="50" y="230" width="332" height="152" rx="76" />
    <rect x="230" y="230" width="152" height="330" rx="76" />
  </>
);

export function LogoMark({
  size = 64,
  className,
  animated = false,
}: {
  size?: number;
  className?: string;
  /** Adds classes the intro animation targets (see globals.css `.intro`). */
  animated?: boolean;
}) {
  const clip = useId();
  return (
    <svg
      viewBox="0 0 625 625"
      width={size}
      height={size}
      className={className}
      aria-hidden
      focusable="false"
    >
      <defs>
        <clipPath id={clip}>{ORANGE}</clipPath>
      </defs>
      <g fill="#bae6fd" className={animated ? "intro-sky" : undefined}>{SKY}</g>
      <g fill="#f59e0b" className={animated ? "intro-sun" : undefined}>{ORANGE}</g>
      <g fill="#0891b2" clipPath={`url(#${clip})`} className={animated ? "intro-core" : undefined}>
        {SKY}
      </g>
    </svg>
  );
}
