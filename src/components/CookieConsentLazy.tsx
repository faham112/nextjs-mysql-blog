"use client";

import dynamic from "next/dynamic";

/**
 * The cookie banner is not needed for first paint: load its code in a separate chunk after
 * hydration (it only ever opens from an effect, so there is no visual difference).
 */
const CookieConsent = dynamic(() => import("@/components/CookieConsent"), { ssr: false });

export default function CookieConsentLazy() {
  return <CookieConsent />;
}
