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
      <p className="text-xs" style={{ color: "var(--muted)" }}>Last updated: 3 October 2026</p>
      <p>
        Global Career Hub publishes general information about careers, skills, scholarships,
        visas, and study. The site is written and edited by <strong>Faham Baloch</strong>. A
        guide is not legal, immigration, or financial advice. It is not a personal recommendation
        and it is not a guarantee of admission, funding, a visa, or a job.
      </p>

      <h2>Official pages come first</h2>
      <p>
        University pages, visa desks, scholarship portals, and employers are the final source. If
        this site and an official page disagree, trust the official page. Programme rules, fees,
        and dates change. Confirm them the week you apply, on the site that will actually receive
        your form. A worked example in a guide is an illustration of the order of steps. It is
        not your file, and it is not a promise that the same calendar still applies.
      </p>

      <h2>Not an official partner</h2>
      <p>
        Guides mention public programmes so you can find them. Naming HEC, a scholarship brand, a
        test, or a government portal does not mean that body wrote the page, checked it, or
        appointed this site as an agent. There is no application desk here. Do not send documents
        to the contact email expecting them to be forwarded.
      </p>

      <h2>Your own judgment</h2>
      <p>
        Career and study choices depend on your marks, your budget, your family, and the rules in
        force that month. A guide can show how to read a requirement. It cannot know whether the
        requirement fits you. If a decision involves a contract, a visa refusal risk, or a large
        payment, talk to the office that issues the decision, or to a qualified adviser you have
        chosen yourself. Nothing on this site is that conversation.
      </p>

      <h2>Advertising</h2>
      <p>
        Some pages may include advertisements or third-party trackers. An advertiser does not
        write or approve the editorial guides. An ad is not an endorsement by Faham Baloch or by
        Global Career Hub. Sponsored mentions, if any, will be labeled on the page. If you never
        see a label, the surrounding article is editorial. How ads use cookies is described in
        the <Link href="/privacy">privacy policy</Link> and the <Link href="/cookies">cookie notice</Link>.
      </p>

      <h2>External links</h2>
      <p>
        Guides link out so you can check a claim. Those sites have their own terms and their own
        privacy notices. We do not control them, and a link is not a recommendation to pay a fee
        you have not verified. Be especially careful with pages that ask for money, a password,
        or identity documents. The scholarship-scam guide on this site is a starting checklist,
        not a list of every fraudulent page on the internet.
      </p>

      <h2>Corrections</h2>
      <p>
        If a date or a rule on a guide is out of date, write via the <Link href="/contact">contact page</Link>{" "}
        with the official link. Confirmed errors are corrected on the page. Until that edit is
        published, treat the official source as the one that counts.
      </p>

      <p>
        Also read <Link href="/about">about the author</Link> and the <Link href="/terms">terms of use</Link>.
      </p>
    </article>
  );
}
