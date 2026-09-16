import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Contact",
  description: "Write to Global Career Hub. Corrections, questions, and partnership notes go to admin@globalcareerhub.org.",
  alternates: { canonical: "/contact" },
};
export default function ContactPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Contact</p>
      <h1 className="mt-2 font-heading text-4xl font-extrabold">Get in touch</h1>
      <p className="mt-3 text-sm leading-7 text-slate-600">Use this page for a correction, a question about a guide, or a note about republishing. I read mail myself. I do not sell lists or pass your address to a third party for marketing.</p>
      <p className="mt-4 text-sm">Direct email: <a className="font-semibold text-brand-600" href="mailto:admin@globalcareerhub.org">admin@globalcareerhub.org</a></p>
      <form action="mailto:admin@globalcareerhub.org" method="post" encType="text/plain" className="card mt-8 space-y-3 p-6">
        <input name="name" required placeholder="Your name" className="input" />
        <input name="email" type="email" required placeholder="Your email" className="input" />
        <textarea name="message" required rows={6} placeholder="Your message" className="input" />
        <button className="btn" type="submit">Open email draft</button>
      </form>
      <p className="mt-3 text-xs text-slate-500">The button opens your own email app with the address already filled.</p>
    </div>
  );
}
