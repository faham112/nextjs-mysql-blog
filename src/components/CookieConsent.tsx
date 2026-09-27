"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const KEY = "gch-consent";
type Choice = "granted" | "denied";

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
    gtag("consent", "update", {
      ad_storage: choice,
      ad_user_data: choice,
      ad_personalization: choice,
      analytics_storage: choice,
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
    if (stored !== "granted" && stored !== "denied") setOpen(true);
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

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[100] border-t p-4 shadow-2xl sm:p-5"
      style={{ background: "var(--bg)", color: "var(--fg)", borderColor: "var(--border)" }}
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 sm:text-sm" style={{ color: "var(--muted)" }}>
          We use essential cookies to run this site. With your permission, Google and other
          advertising partners may also use cookies to show and measure ads, including personalised
          ads. See our <Link href="/privacy" className="font-semibold text-brand-600 underline">privacy policy</Link>{" "}
          and <Link href="/cookies" className="font-semibold text-brand-600 underline">cookie notice</Link>.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => choose("denied")}
            className="rounded-lg border px-4 py-2 text-xs font-bold"
            style={{ borderColor: "var(--border)" }}
          >
            Essential only
          </button>
          <button
            type="button"
            onClick={() => choose("granted")}
            className="rounded-lg bg-brand-600 px-4 py-2 text-xs font-bold text-white"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
