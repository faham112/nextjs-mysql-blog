"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const KEY = "gch-consent";
/** "granted" = ads + analytics; "essential" = first-party analytics only (ads off). */
type Choice = "granted" | "essential";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function applyConsent(choice: Choice) {
  try {
    window.dataLayer = window.dataLayer || [];
    const gtag =
      window.gtag ||
      function gtag() {
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer!.push(arguments);
      };
    const ads = choice === "granted" ? "granted" : "denied";
    // Always keep first-party measurement on. Ads stay gated behind "Accept all".
    gtag("consent", "update", {
      ad_storage: ads,
      ad_user_data: ads,
      ad_personalization: ads,
      analytics_storage: "granted",
    });
  } catch {
    /* ignore */
  }
}

/** Basic cookie banner. Stores the choice locally and forwards it to Google Consent Mode v2. */
export default function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(KEY);
    } catch {
      /* storage blocked */
    }
    // Migrate the old "denied" value (which also blocked analytics) to "essential".
    if (stored === "denied") {
      try {
        localStorage.setItem(KEY, "essential");
      } catch {
        /* ignore */
      }
      applyConsent("essential");
      stored = "essential";
    }
    if (stored !== "granted" && stored !== "essential") setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener("gch-open-consent", reopen);
    return () => window.removeEventListener("gch-open-consent", reopen);
  }, []);

  function choose(choice: Choice) {
    try {
      localStorage.setItem(KEY, choice);
    } catch {
      /* ignore */
    }
    applyConsent(choice);
    setOpen(false);
  }

  if (!open) return null;

  // Compact bottom bar: one short line + two buttons (about 100px tall on a 390px phone).
  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[100] border-t px-4 py-2.5 shadow-[0_-8px_30px_rgba(0,0,0,0.18)] sm:py-3"
      style={{ background: "var(--bg2)", color: "var(--fg)", borderColor: "var(--border)" }}
    >
      <div className="mx-auto flex max-w-[1280px] flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-4">
        <p className="text-[12px] leading-[1.45] sm:text-[13px]" style={{ color: "var(--muted)" }}>
          We use cookies for site measurement. With your OK, Google and partners may also use them for personalised ads.{" "}
          <Link href="/privacy" className="font-semibold underline underline-offset-2" style={{ color: "var(--fg)" }}>Privacy</Link>
          {" · "}
          <Link href="/cookies" className="font-semibold underline underline-offset-2" style={{ color: "var(--fg)" }}>Cookies</Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => choose("essential")}
            className="h-8 flex-1 rounded-full border px-4 sm:h-9 text-[12.5px] font-bold sm:flex-none"
            style={{ borderColor: "var(--border)", color: "var(--fg)" }}
          >
            Essential only
          </button>
          <button
            type="button"
            onClick={() => choose("granted")}
            className="h-8 flex-1 rounded-full bg-brand-600 px-5 sm:h-9 text-[12.5px] font-bold text-white sm:flex-none"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
