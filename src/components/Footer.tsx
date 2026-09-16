import Link from "next/link";
export default function Footer() {
  return (
    <footer className="mt-16 border-t border-dark-800 bg-dark-900 text-white">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-12">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
          <div>
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="" className="h-10 w-10 rounded-lg" />
              <p className="font-heading text-xl font-extrabold">Global<span className="text-brand-500">CareerHub</span></p>
            </div>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">Abdul Faheem</p>
            <p className="mt-2 max-w-sm text-xs text-slate-400">Free guides on careers, skills, and study.</p>
          </div>
          <nav className="grid grid-cols-2 gap-x-10 gap-y-2 text-xs font-semibold text-slate-400">
            <Link href="/about" className="hover:text-white">About</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/disclaimer" className="hover:text-white">Disclaimer</Link>
            <Link href="/cookies" className="hover:text-white">Cookies</Link>
          </nav>
        </div>
        <div className="border-t border-dark-800 pt-6 text-xs text-slate-500">
          © {new Date().getFullYear()} Global Career Hub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
