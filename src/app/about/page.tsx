import type { Metadata } from "next";
import Link from "next/link";
import { organizationJsonLd, personJsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "About the author",
  description:
    "Faham Baloch writes Global Career Hub — independent guides on careers, skills, scholarships and study routes. Not an agency.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const jsonLd = [organizationJsonLd(), personJsonLd()];
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Author</p>
      <h1 id="person" className="mt-2 font-heading text-4xl font-extrabold">
        Faham Baloch
      </h1>
      <p className="mt-3 text-sm" style={{ color: "var(--muted)" }}>
        Writes and edits Global Career Hub. Legal name: Abdul Faheem. Last reviewed 26 September
        2026.
      </p>

      <div className="card mt-8 space-y-5 p-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="Global Career Hub" className="h-16 w-16 rounded-2xl" />
        <p className="text-sm leading-7" style={{ color: "var(--fg)" }}>
          I publish practical guides for students and early-career readers who are filling forms at
          night — scholarships, skills, study routes, and the first years of work. The site is a
          reading desk. It is not a consultancy, a visa shop, or a job board.
        </p>
        <p className="text-sm leading-7" style={{ color: "var(--fg)" }}>
          When a page names a programme, it also points at the official source: HEC, DAAD,
          Chevening, GOV.UK, USEFP, and similar. If this site and that page disagree, trust the
          official page. Dates move. I would rather send you there than invent a deadline.
        </p>
        <h2 className="font-heading text-xl font-extrabold">Background</h2>
        <p className="text-sm leading-7" style={{ color: "var(--fg)" }}>
          I write from the perspective of someone who has spent years following application routes,
          hiring screens, and official programme pages — not as a licensed immigration adviser or
          recruiter. Guides that touch visas or scholarships always link to the body that owns the
          rule. Corrections are welcome by email.
        </p>
        <h2 className="font-heading text-xl font-extrabold">What I will not do here</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-7">
          <li>Promise a visa, a scholarship, or a job.</li>
          <li>Sell a “processing fee” or an agent package.</li>
          <li>Publish a guide that cannot be checked against a public source.</li>
        </ul>
        <h2 className="font-heading text-xl font-extrabold">How to use the site</h2>
        <p className="text-sm leading-7" style={{ color: "var(--fg)" }}>
          Start with a category, open the official link in the article, then keep your own file.
          Useful starting points:{" "}
          <Link
            className="font-semibold text-brand-600"
            href="/posts/official-scholarship-map-pakistan-2026-hec-fulbright-daad"
          >
            the scholarship map
          </Link>
          ,{" "}
          <Link
            className="font-semibold text-brand-600"
            href="/posts/germany-2026-pakistani-students-daad-aps-calendar"
          >
            Germany / DAAD
          </Link>
          , and{" "}
          <Link
            className="font-semibold text-brand-600"
            href="/posts/uk-skilled-worker-visa-sponsor-check-2026"
          >
            UK sponsor checks
          </Link>
          .
        </p>
        <p className="text-sm">
          Email:{" "}
          <a className="font-semibold text-brand-600" href="mailto:admin@globalcareerhub.org">
            admin@globalcareerhub.org
          </a>
          {" · "}
          <Link href="/contact" className="font-semibold text-brand-600">
            Contact
          </Link>
          {" · "}
          <Link href="/disclaimer" className="font-semibold text-brand-600">
            Disclaimer
          </Link>
        </p>
      </div>
    </div>
  );
}
