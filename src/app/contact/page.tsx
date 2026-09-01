import type { Metadata } from "next";
export const metadata: Metadata = { title: "Contact" };
export default function ContactPage() {
  return (
    <div className="mx-auto max-w-xl">
      <p className="text-xs uppercase tracking-[0.2em] text-accent">Inbox</p>
      <h1 className="mt-2 font-serif text-4xl">Write to Abdul Faheem</h1>
      <p className="mt-3 text-slate-600">Questions, ideas, and corrections are welcome.</p>
      <form action="mailto:admin@globalcareerhub.org" method="post" encType="text/plain" className="card mt-8 space-y-3 p-6">
        <input name="name" required placeholder="Your name" className="input" />
        <input name="email" type="email" required placeholder="Your email" className="input" />
        <textarea name="message" required rows={6} placeholder="How can we help?" className="input" />
        <button className="btn" type="submit">Send message</button>
      </form>
      <p className="mt-4 text-sm text-slate-500">Direct: admin@globalcareerhub.org</p>
    </div>
  );
}
