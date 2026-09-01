import Link from "next/link";

export default function Footer() {
  return (
    <>
      <footer className="mt-20 border-t border-ink/10 bg-[#efe7d8] pb-24 md:pb-0">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3">
          <div>
            <p className="font-serif text-2xl">Global<span className="text-accent">CareerHub</span></p>
            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">
              Practical career writing by Abdul Faheem for readers who want the next step.
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">For readers</p>
            <nav className="mt-3 grid gap-2 text-sm">
              <Link href="/articles" className="hover:text-accent">All articles</Link>
              <Link href="/about" className="hover:text-accent">About Abdul Faheem</Link>
              <Link href="/contact" className="hover:text-accent">Contact</Link>
              <Link href="/privacy" className="hover:text-accent">Privacy</Link>
              <Link href="/search" className="hover:text-accent">Search</Link>
            </nav>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">For the writer</p>
            <nav className="mt-3 grid gap-2 text-sm">
              <Link href="/login" className="hover:text-accent">Writer login</Link>
              <Link href="/admin" className="hover:text-accent">Admin dashboard</Link>
              <Link href="/admin/posts/new" className="hover:text-accent">New article</Link>
              <Link href="/admin/settings" className="hover:text-accent">Settings</Link>
            </nav>
          </div>
        </div>
        <div className="border-t border-ink/10">
          <p className="mx-auto max-w-6xl px-4 py-6 text-xs text-slate-500">
            © {new Date().getFullYear()} Global Career Hub · Founder Abdul Faheem · globalcareerhub.org
          </p>
        </div>
      </footer>
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-ink/10 bg-[#f6f1e8]/95 backdrop-blur md:hidden">
        <div className="grid grid-cols-4 text-center text-[11px] font-medium">
          <Link href="/" className="py-3">Home</Link>
          <Link href="/articles" className="py-3">Articles</Link>
          <Link href="/search" className="py-3">Search</Link>
          <Link href="/about" className="py-3">About</Link>
        </div>
      </nav>
    </>
  );
}
