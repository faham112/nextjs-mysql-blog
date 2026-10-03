import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Write to Faham Baloch at Global Career Hub. Corrections, privacy requests and republishing notes go to admin@globalcareerhub.org.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <article className="prose-blog mx-auto max-w-3xl px-4 py-16">
      <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Contact</p>
      <h1 className="font-heading text-4xl font-extrabold">Get in touch</h1>
      <p className="text-xs" style={{ color: "var(--muted)" }}>
        Faham Baloch · Global Career Hub · Last updated: 3 October 2026
      </p>
      <p>
        I read the mail for this site myself. The address is{" "}
        <a href="mailto:admin@globalcareerhub.org">admin@globalcareerhub.org</a>. Use it for a
        correction, a question about a guide, a privacy request, or a note about republishing.
        I do not sell lists, and I do not pass your address to a third party for marketing.
      </p>
      <p>
        Global Career Hub is a reading desk, not a consultancy. A message does not open a case,
        reserve a visa appointment, or put you in a queue for a scholarship. If you need a
        decision from a university, an embassy, HEC, or an employer, write to that office. The
        guide should already link to the official page.
      </p>

      <h2>What to send if a guide is wrong</h2>
      <p>
        Corrections are the most useful mail I get. Include three things so I can fix the page
        instead of guessing:
      </p>
      <ul>
        <li>The address of the guide, copied from the browser bar.</li>
        <li>The sentence or date that looks wrong, and what you think it should say.</li>
        <li>
          A link to the official page you checked (a university, a ministry, a scholarship
          portal, or an employer). If the official page and this site disagree, the official
          page wins and the guide should change.
        </li>
      </ul>
      <p>
        You do not need to rewrite the article. A short note is enough. I correct the page when
        the source checks out. I do not publish your email address next to the correction.
      </p>

      <h2>What this inbox is not for</h2>
      <ul>
        <li>I do not file visa, scholarship, or job applications for readers.</li>
        <li>I do not charge a processing fee, and I do not sell an agent package.</li>
        <li>
          I do not review a full SOP, CV, or document set as a paid service. The{" "}
          <Link href="/posts/how-to-write-a-statement-of-purpose-that-a-reviewer-actually-finishes">
            statement of purpose guide
          </Link>{" "}
          and the other application notes are there to use on your own draft.
        </li>
        <li>
          I cannot tell you whether you will be admitted, funded, or hired. Those decisions sit
          with the body named in the guide.
        </li>
      </ul>

      <h2>Privacy requests</h2>
      <p>
        If you want to know what personal data this site holds about you, or you want it
        corrected or deleted, use the same address and put &ldquo;Privacy&rdquo; in the subject.
        The <Link href="/privacy">privacy policy</Link> explains comments, cookies, and
        advertising. Privacy requests are answered within 30 days, which is the commitment
        already stated on that page. Ordinary editorial questions do not have a fixed reply
        clock. I answer them when I can read them properly.
      </p>

      <h2>Republishing and quoting</h2>
      <p>
        You may quote a short passage if you link back to the guide. Copying a full article onto
        another site needs written permission. Say which page you want to reuse, where it would
        appear, and whether the piece would be edited. The <Link href="/terms">terms of use</Link>{" "}
        cover ownership in more detail.
      </p>

      <h2>Advertising</h2>
      <p>
        The site may show ads, including through Google AdSense. An advertiser does not write the
        guides and does not get your email because you wrote to me. If an ad looks like it is
        pretending to be an official scholarship or a job offer, forward the page address and a
        short description. Editorial complaints are separate from ad personalisation, which you
        can change on the <Link href="/cookies">cookie notice</Link>.
      </p>

      <h2>Write</h2>
      <p>
        Direct email:{" "}
        <a className="font-semibold" href="mailto:admin@globalcareerhub.org">
          admin@globalcareerhub.org
        </a>
        . The form below opens your own email app with that address filled in. Nothing is stored
        on this website when you use it. If the button does nothing, your browser has no mail
        app set up — copy the address instead.
      </p>
      <form action="mailto:admin@globalcareerhub.org" method="post" encType="text/plain" className="not-prose card mt-6 space-y-3 p-6">
        <label className="block text-sm font-semibold" htmlFor="contact-name">
          Your name
        </label>
        <input id="contact-name" name="name" required autoComplete="name" placeholder="Your name" className="input" />
        <label className="block text-sm font-semibold" htmlFor="contact-email">
          Your email
        </label>
        <input id="contact-email" name="email" type="email" required autoComplete="email" placeholder="Your email" className="input" />
        <label className="block text-sm font-semibold" htmlFor="contact-message">
          Message
        </label>
        <textarea id="contact-message" name="message" required rows={6} placeholder="Page address, what looks wrong, and the official link if you have one" className="input" />
        <button className="btn" type="submit">
          Open email draft
        </button>
      </form>
      <p className="text-sm" style={{ color: "var(--muted)" }}>
        Also see <Link href="/about">about the author</Link> and the{" "}
        <Link href="/disclaimer">disclaimer</Link>.
      </p>
    </article>
  );
}
