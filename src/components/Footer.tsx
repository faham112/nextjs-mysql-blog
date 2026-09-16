import Link from "next/link";
export default function Footer() {
  return (
    <footer className="site-footer mt-16">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-12">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
          <div>
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="" className="h-10 w-10 rounded-lg" />
              <p className="font-heading text-xl font-extrabold">Global<span className="text-brand-500">CareerHub</span></p>
            </div>
            <p className="mt-2 max-w-sm text-xs" style={{ color: "var(--muted)" }}>Free guides on careers, skills, and study.</p>
          </div>
          <nav className="grid grid-cols-2 gap-x-10 gap-y-2 text-xs font-semibold" style={{ color: "var(--muted)" }}>
            <Link href="/about" className="hover:text-brand-600">About</Link>
            <Link href="/contact" className="hover:text-brand-600">Contact</Link>
            <Link href="/privacy" className="hover:text-brand-600">Privacy</Link>
            <Link href="/terms" className="hover:text-brand-600">Terms</Link>
            <Link href="/disclaimer" className="hover:text-brand-600">Disclaimer</Link>
            <Link href="/cookies" className="hover:text-brand-600">Cookies</Link>
          </nav>
        </div>
        <div className="border-t pt-6 text-xs" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
          © {new Date().getFullYear()} Global Career Hub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
