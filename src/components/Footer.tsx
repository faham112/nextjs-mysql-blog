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
        <p className="mx-auto max-w-6xl px-4 py-8 text-xs text-slate-500">
          © {new Date().getFullYear()} Global Career Hub · Abdul Faheem
        </p>
      </footer>
    );
  }

  return (
    <footer className="mt-20 border-t border-ink/10 bg-[#efe7d8]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-2">
        <div>
          <p className="font-serif text-2xl">
            Global<span className="text-accent">CareerHub</span>
          </p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">
            Writing by Abdul Faheem. Readers browse freely. Publishing stays on the writer desk.
          </p>
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
      <p className="mx-auto max-w-6xl px-4 py-6 text-xs text-slate-500">
        © {new Date().getFullYear()} Global Career Hub · Abdul Faheem · globalcareerhub.org
      </p>
    </footer>
  );
}
