import type { Metadata } from "next";
export const metadata: Metadata = { title: "Privacy" };
export default function PrivacyPage() {
  return (
    <article className="prose-blog mx-auto max-w-3xl">
      <p className="text-xs uppercase tracking-[0.2em] text-accent">Legal</p>
      <h1 className="font-serif text-4xl">Privacy</h1>
      <p>You can read articles without an account. Comments may ask for a name and email to reduce spam.</p>
      <p>Login is only for the site owner. Questions: admin@globalcareerhub.org</p>
    </article>
  );
}
