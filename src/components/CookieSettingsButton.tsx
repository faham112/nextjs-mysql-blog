"use client";

/** Re-opens the cookie banner so readers can change their choice. */
export default function CookieSettingsButton({
  className = "font-semibold text-brand-600 underline",
  label = "Change cookie settings",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event("gch-open-consent"))} className={className}>
      {label}
    </button>
  );
}
