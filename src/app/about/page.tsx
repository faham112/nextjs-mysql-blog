import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "About the author",
  description: "Meet Abdul Faheem, who publishes Global Career Hub. Online he also writes as Faham Baloch.",
  alternates: { canonical: "/about" },
};
export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="text-xs font-bold uppercase tracking-widest text-brand-600">About the author</p>
      <h1 className="mt-2 font-heading text-4xl font-extrabold">Abdul Faheem</h1>
      <p className="mt-2 text-sm text-slate-500">Internet name: Faham Baloch</p>
      <div className="card mt-8 space-y-5 p-8">
        <img src="/logo.svg" alt="Global Career Hub" className="h-16 w-16 rounded-2xl border border-slate-200 bg-dark-900 p-1" />
        <p className="text-sm leading-7 text-slate-700">I run Global Career Hub as a small reading site, not a recruitment agency. The pages here are guides I would have wanted when I was filling forms at midnight: how to talk about a skill without padding a CV, how to keep a job search from taking over the house, how to write a statement that still sounds like a person.</p>
        <p className="text-sm leading-7 text-slate-700">On the internet I publish as <strong>Faham Baloch</strong>. On this site the byline stays Abdul Faheem, which is my given name. Both refer to the same writer.</p>
        <p className="text-sm leading-7 text-slate-700">Nothing here is a promise of a visa, a scholarship, or a job. Read the guide, check the official source, then decide. If a line is wrong, write to me and I will correct it.</p>
        <p className="text-sm">Email: <a className="font-semibold text-brand-600" href="mailto:admin@globalcareerhub.org">admin@globalcareerhub.org</a> · <Link href="/contact" className="font-semibold text-brand-600">Contact page</Link></p>
      </div>
    </div>
  );
}
