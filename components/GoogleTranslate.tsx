"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { ChevronDown, Globe } from "lucide-react";
import { cx } from "@/components/ui";

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

// Native names so people can find their language without reading English.
const LANGUAGES = [
  ["en", "English"],
  ["es", "Español"],
  ["zh-CN", "中文 (简体)"],
  ["zh-TW", "中文 (繁體)"],
  ["ko", "한국어"],
  ["vi", "Tiếng Việt"],
  ["tl", "Tagalog"],
  ["ar", "العربية"],
  ["fr", "Français"],
  ["pt", "Português"],
  ["ru", "Русский"],
  ["ja", "日本語"],
  ["hi", "हिन्दी"],
  ["fa", "فارسی"],
  ["ur", "اردو"],
] as const;

function currentLanguage() {
  const match = document.cookie.match(/(?:^|;\s*)googtrans=\/[^/]+\/([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "en";
}

/**
 * Other languages: drive Google's own (visually hidden) <select>, which
 * translates in place and remembers the choice in the `googtrans` cookie.
 * English: Google's widget has no reliable way back, so clear that cookie on
 * every domain variant Google may have written and reload the original page.
 */
function setLanguage(lang: string) {
  if (lang === "en") {
    const host = location.hostname;
    const past = "; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    ["", `; domain=${host}`, `; domain=.${host}`].forEach((d) => (document.cookie = `googtrans=${past}${d}`));
    location.reload();
    return;
  }
  const combo = document.querySelector<HTMLSelectElement>("#google_translate_element select.goog-te-combo");
  if (combo) {
    combo.value = lang;
    combo.dispatchEvent(new Event("change"));
  } else {
    // Script not loaded yet — fall back to cookie + reload
    document.cookie = `googtrans=/en/${lang}; path=/`;
    location.reload();
  }
}

/** Loads Google Translate once for the whole app. */
export function GoogleTranslate() {
  useEffect(() => {
    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) return;
      new window.google.translate.TranslateElement(
        { pageLanguage: "en", autoDisplay: false },
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
      <div id="google_translate_element" className="sr-only" aria-hidden />
    </>
  );
}

export function LanguagePicker({ variant }: { variant: "floating" | "sidebar" }) {
  const [lang, setLang] = useState("en");
  useEffect(() => setLang(currentLanguage()), []);

  function choose(next: string) {
    setLang(next);
    setLanguage(next);
  }

  return (
    <label
      translate="no"
      className={cx(
        "notranslate pressable relative flex h-11 items-center gap-2 rounded-pill pl-3.5 pr-3",
        variant === "floating" ? "glass" : "pill w-full"
      )}
    >
      <Globe className="size-[18px] shrink-0 text-brand-ink" aria-hidden />
      <span className="sr-only">Language</span>
      <select
        value={lang}
        onChange={(e) => choose(e.target.value)}
        className="min-w-0 flex-1 cursor-pointer appearance-none bg-transparent pr-5 text-[15px] font-semibold outline-none"
      >
        {LANGUAGES.map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 size-4 text-label-3" aria-hidden />
    </label>
  );
}
