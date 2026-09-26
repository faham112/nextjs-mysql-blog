import type { Metadata } from "next";
import Link from "next/link";

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
        Last updated: 26 September 2026
      </p>
      <p>
        A cookie is a small file stored by your browser. This site uses a session cookie after a
        writer signs in so the admin desk stays open.
      </p>
      <p>
        When advertising is enabled, third-party vendors — including Google — may use cookies to
        serve ads based on prior visits to this site and other sites. You can manage personalised
        ads at{" "}
        <a href="https://adssettings.google.com" rel="noopener noreferrer" target="_blank">
          Google Ads Settings
        </a>{" "}
        and learn more at{" "}
        <a href="https://www.aboutads.info" rel="noopener noreferrer" target="_blank">
          aboutads.info
        </a>
        .
      </p>
      <p>
        You can block or delete cookies in your browser. Public articles will still open. Writer
        login may not stay open if cookies are blocked.
      </p>
      <p>
        More detail sits in the <Link href="/privacy">privacy policy</Link>.
      </p>
    </article>
  );
}
