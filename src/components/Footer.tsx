"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Footer() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isAdmin = pathname.startsWith("/admin") || pathname.startsWith("/login");
  if (isHome) {
    return (
      <footer className="mt-16 border-t border-ink/10">
        <p className="mx-auto max-w-6xl px-4 py-8 text-xs text-slate-500">© {new Date().getFullYear()} Global Career Hub · Abdul Faheem</p>
      </footer>
    );
  }
  return (
    <>
      <footer className="mt-20 border-t border-ink/10 bg-[#efe7d8] pb-24 md:pb-0">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-2">
          <div>
            <p className="font-serif text-2xl">Global<span className="text-accent">CareerHub</span></p>
            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">Writing by Abdul Faheem.</p>
          </div>
          <nav className="grid gap-2 text-sm">
            {!isAdmin && (
              <>
                <Link href="/articles" className="hover:text-accent">Articles</Link>
                <Link href="/about" className="hover:text-accent">About</Link>
                <Link href="/contact" className="hover:text-accent">Contact</Link>
                <Link href="/privacy" className="hover:text-accent">Privacy</Link>
              </>
            )}
            <Link href="/login" className="hover:text-accent">Writer login</Link>
          </nav>
        </div>
        <p className="mx-auto max-w-6xl px-4 py-6 text-xs text-slate-500">© {new Date().getFullYear()} Global Career Hub · Abdul Faheem</p>
      </footer>
      {!isAdmin && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-ink/10 bg-[#f6f1e8]/95 backdrop-blur md:hidden">
          <div className="grid grid-cols-4 text-center text-[11px] font-medium">
            <Link href="/" className="py-3">Home</Link>
            <Link href="/articles" className="py-3">Articles</Link>
            <Link href="/search" className="py-3">Search</Link>
            <Link href="/about" className="py-3">About</Link>
          </div>
        </nav>
      )}
    </>
  );
}
