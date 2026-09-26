import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "How Global Career Hub collects and uses information, including cookies and Google advertising.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <article className="prose-blog mx-auto max-w-3xl px-4 py-16">
      <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Legal</p>
      <h1 className="font-heading text-4xl font-extrabold">Privacy policy</h1>
      <p className="text-xs" style={{ color: "var(--muted)" }}>
        Last updated: 26 September 2026
      </p>

      <p>
        Global Career Hub (globalcareerhub.org) is an independent reading site operated by{" "}
        <strong>Faham Baloch</strong> (legal name: Abdul Faheem). You can read articles without
        creating an account.
      </p>

      <h2>What we collect</h2>
      <p>
        If you leave a comment, we store the name and message you type so the note can be reviewed
        before it appears. If you sign in as a writer, we store a session cookie so the desk stays
        open on your browser.
      </p>
      <p>
        The hosting company may log standard request data such as page path, approximate region, and
        browser type. That log is used for security and reliability, not to build a marketing
        profile of a named reader. We do not currently run a third-party analytics script on public
        pages. If we add one later (for example Google Analytics 4), this policy will be updated.
      </p>

      <h2>Cookies and advertising (including Google)</h2>
      <p>
        This site may display advertising through Google AdSense or similar partners. Third-party
        vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to
        this website or other websites.
      </p>
      <p>
        Google&apos;s use of advertising cookies enables it and its partners to serve ads to users
        based on their visit to this site and/or other sites on the Internet.
      </p>
      <p>
        Users may opt out of personalised advertising by visiting{" "}
        <a href="https://adssettings.google.com" rel="noopener noreferrer" target="_blank">
          Google Ads Settings
        </a>
        . You can also visit{" "}
        <a href="https://www.aboutads.info" rel="noopener noreferrer" target="_blank">
          www.aboutads.info
        </a>{" "}
        for more information about opt-out options from participating companies.
      </p>
      <p>
        Essential cookies for writer login stay on this domain and are required for the admin desk
        to work.
      </p>

      <h2>How long we keep data</h2>
      <p>
        Published comments stay with the article until they are removed. Session cookies expire.
        Server logs follow the host&apos;s normal rotation.
      </p>

      <h2>Your choices</h2>
      <p>
        You can block or delete cookies in your browser. Public articles will still open. Writer
        login may not stay open if cookies are blocked. More detail is on the{" "}
        <Link href="/cookies">cookie notice</Link>.
      </p>

      <h2>Contact</h2>
      <p>
        Privacy questions:{" "}
        <a href="mailto:admin@globalcareerhub.org">admin@globalcareerhub.org</a>
      </p>
    </article>
  );
}
