import type { Metadata } from "next";
export const metadata: Metadata = { title: "About" };
export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-12 px-4 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <span className="rounded-md bg-brand-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-700">Creator Profile</span>
        <h1 className="mt-4 font-heading text-4xl font-extrabold sm:text-5xl">About GlobalCareerHub</h1>
      </div>
      <div className="card space-y-8 p-8 sm:p-12">
        <div className="flex flex-col items-center gap-8 border-b border-slate-200 pb-8 md:flex-row">
          <div className="flex h-32 w-32 flex-shrink-0 items-center justify-center rounded-3xl border-4 border-slate-800 bg-dark-900 text-4xl font-black text-brand-600">AF.</div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Founder & Primary Author</p>
            <h2 className="mt-2 font-heading text-3xl font-extrabold">Abdul Faheem</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">GlobalCareerHub publishes clear, free guides on careers, software, and study paths.</p>
          </div>
        </div>
        <form action="mailto:admin@globalcareerhub.org" method="post" encType="text/plain" className="space-y-4">
          <h3 className="font-heading text-xl font-bold">Send a Direct Message</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <input name="name" required placeholder="Your Name" className="input" />
            <input name="email" type="email" required placeholder="Your Email" className="input" />
          </div>
          <textarea name="message" rows={4} required placeholder="How can Abdul help you?" className="input" />
          <button className="rounded-xl bg-dark-900 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white" type="submit">Submit Message</button>
        </form>
      </div>
    </div>
  );
}
