"use client";

/** Re-opens the cookie banner so readers can change their choice. */
export default function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("gch-open-consent"))}
      className="font-semibold text-brand-600 underline"
    >
      Change cookie settings
    </button>
  );
}
