import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How Global Career Hub collects and uses information, including cookies and advertising.",
  alternates: { canonical: "/privacy" },
};
export default function PrivacyPage() {
  return (
    <article className="prose-blog mx-auto max-w-3xl px-4 py-16">
      <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Legal</p>
      <h1 className="font-heading text-4xl font-extrabold">Privacy policy</h1>
      <p className="text-xs text-slate-500">Last updated: 16 September 2026</p>
      <p>Global Career Hub is an independent reading site operated by Abdul Faheem. You can read articles without creating an account.</p>
      <h2>What we collect</h2>
      <p>If you leave a comment, we store the name and message you type so the note can be reviewed before it appears. If you sign in as a writer, we store a session cookie so the desk stays open on your browser.</p>
      <p>The hosting company and our analytics script may log standard request data such as page path, approximate region, and browser type. That log is used to see which guides people open, not to build a marketing profile of a named reader.</p>
      <h2>Cookies and ads</h2>
      <p>The site may show advertising through Google AdSense or a similar partner. Those partners can use cookies or similar tools to understand which ads are seen. You can limit ad personalization in your Google account ads settings. Essential cookies for writer login stay on this domain.</p>
      <h2>How long we keep it</h2>
      <p>Published comments stay with the article until they are removed. Session cookies expire. Server logs follow the host’s normal rotation.</p>
      <h2>Contact</h2>
      <p>Privacy questions: admin@globalcareerhub.org</p>
    </article>
  );
}
