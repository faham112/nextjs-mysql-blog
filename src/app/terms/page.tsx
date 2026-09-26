import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "Terms for reading and reusing material on Global Career Hub.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <article className="prose-blog mx-auto max-w-3xl px-4 py-16">
      <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Legal</p>
      <h1 className="font-heading text-4xl font-extrabold">Terms of use</h1>
      <p className="text-xs" style={{ color: "var(--muted)" }}>
        Last updated: 26 September 2026
      </p>
      <p>
        By using globalcareerhub.org you agree to these terms. If you do not agree, leave the site.
      </p>
      <h2>The writing is educational</h2>
      <p>
        Guides describe approaches that help readers think more clearly about work and study. They
        are not legal, immigration, or financial advice. Deadlines and rules change. Check the
        official body before you apply.
      </p>
      <h2>Ownership</h2>
      <p>
        Text and original images on this site belong to <strong>Faham Baloch</strong> (legal name:
        Abdul Faheem) unless a credit says otherwise. You may quote a short passage with a link
        back. Do not copy a full article onto another site without written permission.
      </p>
      <h2>Your comments</h2>
      <p>
        Do not post spam, insults, or anyone else&apos;s private details. We can refuse or remove a
        comment.
      </p>
      <h2>Liability</h2>
      <p>
        The site is provided as it stands. We are not responsible for decisions you make after
        reading a guide, or for content on websites we link to.
      </p>
      <p>
        Questions: <Link href="/contact">contact page</Link> or{" "}
        <a href="mailto:admin@globalcareerhub.org">admin@globalcareerhub.org</a>
      </p>
    </article>
  );
}
