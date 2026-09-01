import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = { title: "Terms" };
export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="card space-y-8 p-8 sm:p-12">
        <div className="border-b border-slate-200 pb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Legal Overview</p>
          <h1 className="mt-2 font-heading text-3xl font-extrabold">Terms & Conditions</h1>
        </div>
        <div className="space-y-6 text-sm leading-relaxed text-slate-700">
          <p>Guides on GlobalCareerHub by Abdul Faheem are for education. Written materials belong to Abdul Faheem unless stated otherwise.</p>
          <p>Questions: <Link href="/about" className="font-bold text-brand-600 underline">About page</Link>.</p>
        </div>
      </div>
    </div>
  );
}
