import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = { title: "About" };
export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl">
      <p className="text-xs uppercase tracking-[0.2em] text-accent">The writer</p>
      <h1 className="mt-2 font-serif text-4xl sm:text-5xl">Abdul Faheem</h1>
      <p className="mt-6 text-lg leading-8 text-slate-700">
        Global Career Hub is Abdul Faheem&apos;s public notebook on work, skills, and career decisions.
      </p>
      <div className="prose-blog mt-8">
        <p>This site is for students, job seekers, and working people. No paywall. No account required to read.</p>
        <p>Questions and topic ideas belong on the contact page. Publishing happens on a separate writer desk.</p>
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/articles" className="btn">Read the articles</Link>
        <Link href="/contact" className="btn-outline">Contact</Link>
      </div>
    </article>
  );
}
