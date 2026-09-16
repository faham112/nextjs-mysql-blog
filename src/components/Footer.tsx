import Link from "next/link";
export default function Footer() {
  return (
    <footer className="mt-16 border-t border-dark-800 bg-dark-900 text-white">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-12">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="font-heading text-xl font-extrabold">Global<span className="text-brand-500">CareerHub</span></p>
            <p className="mt-2 max-w-sm text-xs text-slate-400">Clear writing on careers, skills, and study. Managed by Abdul Faheem.</p>
          </div>
          <nav className="flex flex-wrap gap-6 text-xs font-semibold text-slate-400">
            <Link href="/" className="hover:text-white">Home</Link>
            <Link href="/articles" className="hover:text-white">Articles</Link>
            <Link href="/about" className="hover:text-white">About</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/login" className="hover:text-brand-500">Sign in</Link>
          </nav>
        </div>
        <div className="border-t border-dark-800 pt-6 text-xs text-slate-500">
          © {new Date().getFullYear()} Global Career Hub · Abdul Faheem. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
