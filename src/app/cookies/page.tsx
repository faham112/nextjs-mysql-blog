import type { Metadata } from "next";
import Link from "next/link";
import CookieSettingsButton from "@/components/CookieSettingsButton";

export const metadata: Metadata = {
  title: "Cookies",
  description: "How cookies are used on Global Career Hub, including advertising cookies.",
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  return (
    <article className="prose-blog mx-auto max-w-3xl px-4 py-16">
      <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Legal</p>
      <h1 className="font-heading text-4xl font-extrabold">Cookie notice</h1>
      <p className="text-xs" style={{ color: "var(--muted)" }}>
        Last updated: 27 September 2026
      </p>
      <p>
        A cookie is a small file stored by your browser. Some features use similar browser storage
        (localStorage). This page lists what Global Career Hub uses.
      </p>
      <h2>Essential (always on)</h2>
      <ul>
        <li>
          <strong>blog_session</strong> (cookie): keeps a writer signed in to the admin desk. Only set
          after login.
        </li>
        <li>
          <strong>gch-consent</strong> (localStorage): remembers your cookie choice.
        </li>
        <li>
          <strong>gch-theme</strong> (localStorage): remembers light or dark mode.
        </li>
      </ul>
      <h2>Advertising and analytics (only with consent where required)</h2>
      <p>
        When advertising is enabled, third-party vendors, including Google, use cookies to serve ads
        based on your prior visits to this website or other websites. Google&apos;s use of
        advertising cookies enables it and its partners to serve ads based on visits to this site
        and/or other sites on the Internet. You can opt out of personalised advertising at{" "}
        <a href="https://adssettings.google.com" rel="noopener noreferrer" target="_blank">
          Google Ads Settings
        </a>{" "}
        or at{" "}
        <a href="https://www.aboutads.info/choices" rel="noopener noreferrer" target="_blank">
          aboutads.info
        </a>
        .
      </p>
      <h2>Change your choice</h2>
      <p>
        <CookieSettingsButton /> You can also block or delete cookies in your browser. Public
        articles will still open; writer login may not stay open if cookies are blocked.
      </p>
      <p>
        More detail sits in the <Link href="/privacy">privacy policy</Link>.
      </p>
    </article>
  );
}
