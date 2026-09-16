import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Cookies",
  description: "How cookies are used on Global Career Hub.",
  alternates: { canonical: "/cookies" },
};
export default function CookiesPage() {
  return (
    <article className="prose-blog mx-auto max-w-3xl px-4 py-16">
      <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Legal</p>
      <h1 className="font-heading text-4xl font-extrabold">Cookie notice</h1>
      <p>A cookie is a small file stored by your browser. This site uses a session cookie after a writer signs in. Analytics and advertising partners may set their own cookies when those scripts are active.</p>
      <p>You can block or delete cookies in your browser. The public articles will still open. Writer login may not stay open if cookies are blocked.</p>
      <p>More detail sits in the <Link href="/privacy">privacy policy</Link>.</p>
    </article>
  );
}
