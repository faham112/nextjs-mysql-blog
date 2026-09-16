import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "About the author",
  description: "Faham Baloch writes Global Career Hub — free guides on careers, skills, and study.",
  alternates: { canonical: "/about" },
};
export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Author</p>
      <h1 className="mt-2 font-heading text-4xl font-extrabold">Faham Baloch</h1>
      <div className="card mt-8 space-y-5 p-8">
        <img src="/logo.svg" alt="Global Career Hub" className="h-16 w-16 rounded-2xl" />
        <p className="text-sm leading-7 text-slate-700">Author is Faham Baloch. Global Career Hub is a small reading site, not a recruitment agency. The pages here are guides I would have wanted when filling forms at midnight.</p>
        <p className="text-sm leading-7 text-slate-700">Nothing here is a promise of a visa, a scholarship, or a job. Read the guide, check the official source, then decide.</p>
        <p className="text-sm">Email: <a className="font-semibold text-brand-600" href="mailto:admin@globalcareerhub.org">admin@globalcareerhub.org</a> · <Link href="/contact" className="font-semibold text-brand-600">Contact</Link></p>
      </div>
    </div>
  );
}
