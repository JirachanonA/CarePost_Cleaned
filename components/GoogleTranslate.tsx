"use client";

import { useEffect } from "react";
import Script from "next/script";
import { Globe } from "lucide-react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: new (options: object, elementId: string) => void;
      };
    };
  }
}

/** Language picker as a small glass pill; Google's <select> is restyled in globals.css. */
export function GoogleTranslate() {
  useEffect(() => {
    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) return;
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "es,zh-CN,zh-TW,ko,vi,tl,ar,fr,pt,ru,ja,hi,fa,ur",
          layout: 0,
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };
  }, []);

  return (
    <>
      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="lazyOnload"
      />
      <div className="glass fixed right-4 top-[max(0.75rem,env(safe-area-inset-top))] z-40 flex h-11 items-center gap-1 rounded-pill pl-3 pr-2">
        <Globe className="size-[18px] shrink-0 text-brand-ink" aria-hidden />
        <div id="google_translate_element" aria-label="Choose language" />
      </div>
    </>
  );
}
