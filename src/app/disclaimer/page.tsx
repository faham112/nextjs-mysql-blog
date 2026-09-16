import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Educational disclaimer for Global Career Hub guides and advertising.",
  alternates: { canonical: "/disclaimer" },
};
export default function DisclaimerPage() {
  return (
    <article className="prose-blog mx-auto max-w-3xl px-4 py-16">
      <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Legal</p>
      <h1 className="font-heading text-4xl font-extrabold">Disclaimer</h1>
      <p>Global Career Hub publishes general information about careers, skills, and study. A guide is not a personal recommendation and it is not a guarantee of admission, funding, or employment.</p>
      <p>University pages, visa desks, and employers are the final source. If this site and an official page disagree, trust the official page.</p>
      <p>Some pages may include advertisements. An advertiser does not write or approve the editorial guides. Sponsored mentions, if any, will be labeled.</p>
      <p>Read the <Link href="/privacy">privacy policy</Link> and <Link href="/terms">terms</Link> for the rest of the legal notes.</p>
    </article>
  );
}
