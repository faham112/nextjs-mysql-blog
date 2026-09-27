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
        Last updated: 27 September 2026
      </p>

      <p>
        Global Career Hub (globalcareerhub.org) is an independent reading site operated by{" "}
        <strong>Faham Baloch</strong>. You can read articles without creating an account.
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
        profile of a named reader. We may use an analytics tool (for example Google Analytics or a
        self-hosted counter) to see which pages are read, in aggregate. Where your consent is
        required, it only runs after you accept cookies.
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
        Third-party vendors and ad networks may also serve ads on this site. You can learn how
        Google uses information from sites that use its services at{" "}
        <a
          href="https://policies.google.com/technologies/partner-sites"
          rel="noopener noreferrer"
          target="_blank"
        >
          How Google uses information from sites or apps that use our services
        </a>
        .
      </p>

      <h2>Your consent</h2>
      <p>
        When you first visit, a cookie banner asks whether you accept advertising and analytics
        cookies. If you choose &ldquo;Essential only&rdquo;, we signal Google (through Google
        Consent Mode) not to use advertising cookies for personalisation; ads may still appear but
        they are not based on your browsing history. Visitors from the European Economic Area, the
        United Kingdom and Switzerland are treated as &ldquo;not consented&rdquo; until they accept.
        You can change your choice at any time on the <Link href="/cookies">cookie notice</Link>{" "}
        page.
      </p>
      <p>
        Essential cookies for writer login stay on this domain and are required for the admin desk
        to work.
      </p>

      <h2>Your rights</h2>
      <p>
        Depending on where you live (for example under the GDPR in the EU/UK or the CCPA in
        California), you may ask what personal data we hold about you, ask us to correct or delete
        it, or object to its use. Email us at the address below and we will reply within 30 days.
        We do not sell personal information.
      </p>

      <h2>Children</h2>
      <p>
        This site is written for students and adults and is not directed at children under 13. We
        do not knowingly collect personal information from children.
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
