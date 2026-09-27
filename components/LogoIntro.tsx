"use client";

import { useEffect, useState } from "react";
import { LogoMark } from "@/components/LogoMark";

export const INTRO_KEY = "carepost-intro-seen";

/**
 * Desktop-only load animation. Rendered on the server so there's no flash of
 * the app first; an inline script in <head> sets html[data-intro="skip"] for
 * phones, reduced-motion users, and anyone who already saw it this session.
 */
export function LogoIntro() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (document.documentElement.dataset.intro === "skip") {
      setGone(true);
      return;
    }
    try { sessionStorage.setItem(INTRO_KEY, "1"); } catch { /* storage blocked */ }
    const t = setTimeout(() => setGone(true), 2300);
    return () => clearTimeout(t);
  }, []);

  if (gone) return null;

  return (
    <div className="intro" aria-hidden onClick={() => setGone(true)}>
      <div className="intro-stage">
        <LogoMark size={220} animated />
        <span className="intro-word">CarePost</span>
      </div>
    </div>
  );
}

/**
 * Google Translate swaps text nodes for <font> wrappers behind React's back, so
 * React's later removeChild/insertBefore calls can target nodes that moved and
 * crash the page. Fall back gracefully instead (the widely used workaround).
 */
export const translateGuardScript = `(function(){if(typeof Node!=='function'||!Node.prototype)return;var r=Node.prototype.removeChild;Node.prototype.removeChild=function(c){if(c.parentNode!==this){return c}return r.apply(this,arguments)};var i=Node.prototype.insertBefore;Node.prototype.insertBefore=function(n,ref){if(ref&&ref.parentNode!==this){return i.call(this,n,null)}return i.apply(this,arguments)}})()`;

/** Runs before paint; keep it tiny and dependency-free. */
export const introGateScript = `(function(){try{var s=!matchMedia('(min-width:1024px)').matches||matchMedia('(prefers-reduced-motion: reduce)').matches||sessionStorage.getItem('${INTRO_KEY}');if(s)document.documentElement.dataset.intro='skip'}catch(e){document.documentElement.dataset.intro='skip'}})()`;
