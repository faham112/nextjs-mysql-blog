import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "Terms for reading and reusing material on Global Career Hub, operated by Faham Baloch.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <article className="prose-blog mx-auto max-w-3xl px-4 py-16">
      <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Legal</p>
      <h1 className="font-heading text-4xl font-extrabold">Terms of use</h1>
      <p className="text-xs" style={{ color: "var(--muted)" }}>
        Last updated: 3 October 2026
      </p>
      <p>
        These terms cover your use of globalcareerhub.org, an independent reading site operated
        by <strong>Faham Baloch</strong>. By using the site you agree to them. If you do not
        agree, leave the site. They are the house rules for reading and reusing the writing.
        They are not a contract for immigration, recruitment, or legal services.
      </p>

      <h2>The writing is educational</h2>
      <p>
        Guides describe approaches that help readers think more clearly about work and study. They
        are not legal, immigration, or financial advice. Deadlines and rules change. Check the
        official body before you apply. A guide that names a programme should also link to the
        office that owns the rule. If the two disagree, trust the official page. Read the{" "}
        <Link href="/disclaimer">disclaimer</Link> for the same point in plain language.
      </p>

      <h2>No agency relationship</h2>
      <p>
        Reading a guide, sending a correction, or leaving a comment does not make Faham Baloch
        your agent, adviser, or representative. The site does not submit forms for you, does not
        hold your passport or transcripts, and does not take a fee to &ldquo;process&rdquo; an
        application. Anyone who emails you asking for money in the name of Global Career Hub is
        not acting for this site. Check the address against{" "}
        <a href="mailto:admin@globalcareerhub.org">admin@globalcareerhub.org</a> and the{" "}
        <Link href="/contact">contact page</Link>.
      </p>

      <h2>Ownership</h2>
      <p>
        Text and original images on this site belong to <strong>Faham Baloch</strong> unless a
        credit says otherwise. You may quote a short passage with a link back to the guide. Do
        not copy a full article onto another site, into a newsletter, or into a video script
        without written permission. You may link to any public page. Linking does not need
        permission.
      </p>
      <p>
        Official names, logos, and programme titles that appear in a guide (for example a
        scholarship brand or a government portal) belong to their owners. Mentioning them is so
        you can find the real page. It is not a claim that this site is endorsed by that body.
      </p>

      <h2>Your comments and messages</h2>
      <p>
        Do not post spam, insults, or anyone else&apos;s private details. Do not paste a full
        passport number, national identity number, or bank detail into a comment. We can refuse
        or remove a comment. Mail sent to the contact address is read so a page can be corrected
        or a privacy request can be answered. It is not a public comment and it is not added to
        a mailing list. See the <Link href="/privacy">privacy policy</Link> for what is stored.
      </p>

      <h2>Accounts</h2>
      <p>
        Public guides do not need an account. The writer desk is for people who operate this
        site. Do not try to sign up in order to publish on the public site, and do not share a
        writer session. Trying to break into the desk, scrape the site in a way that knocks it
        offline, or stuff pages with hidden text is not allowed.
      </p>

      <h2>Advertising</h2>
      <p>
        Some pages may show third-party ads, including Google ads. An ad is not part of the
        guide. Clicking an ad leaves this site and is covered by that advertiser&apos;s own terms.
        The presence of an ad is not a recommendation of the product, the university, or the job
        it mentions. How advertising cookies work is on the <Link href="/cookies">cookie notice</Link>.
      </p>

      <h2>Liability</h2>
      <p>
        The site is provided as it stands. We are not responsible for decisions you make after
        reading a guide, or for content on websites we link to. We do not promise that a page is
        free of mistakes, only that confirmed mistakes are corrected when they are pointed out.
      </p>

      <h2>Changes</h2>
      <p>
        These terms can be updated when the site&apos;s practices change. The date at the top of
        this page is the date of the latest edit. Continuing to read the site after that date
        means you accept the updated terms.
      </p>

      <p>
        Questions: <Link href="/contact">contact page</Link> or{" "}
        <a href="mailto:admin@globalcareerhub.org">admin@globalcareerhub.org</a>
      </p>
    </article>
  );
}
