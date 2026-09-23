import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Educational disclaimer for Global Career Hub guides, visas, scholarships and advertising.",
  alternates: { canonical: "/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <article className="prose-blog mx-auto max-w-3xl px-4 py-16">
      <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Legal</p>
      <h1 className="font-heading text-4xl font-extrabold">Disclaimer</h1>
      <p className="text-xs" style={{ color: "var(--muted)" }}>Last updated: 23 September 2026</p>
      <p>
        Global Career Hub publishes general information about careers, skills, scholarships, visas,
        and study. A guide is not legal, immigration, or financial advice. It is not a personal
        recommendation and it is not a guarantee of admission, funding, a visa, or a job.
      </p>
      <p>
        University pages, visa desks, scholarship portals, and employers are the final source. If
        this site and an official page disagree, trust the official page. Programme rules and dates
        change; confirm them the week you apply.
      </p>
      <p>
        Some pages may include advertisements or third-party trackers the site owner adds in
        settings. An advertiser does not write or approve the editorial guides. Sponsored mentions,
        if any, will be labeled.
      </p>
      <p>
        Read the <Link href="/privacy">privacy policy</Link>, <Link href="/terms">terms</Link>, and{" "}
        <Link href="/about">about the author</Link> for the rest of the notes.
      </p>
    </article>
  );
}
