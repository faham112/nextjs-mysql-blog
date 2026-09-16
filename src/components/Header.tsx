"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-dark-800 bg-dark-900 text-2xl font-extrabold text-brand-600">
            G<span className="text-white">.</span>
          </div>
          <div>
            <p className="font-heading text-xl font-extrabold leading-none tracking-tight">
              Global<span className="text-brand-600">CareerHub</span>
            </p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">By Abdul Faheem</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-1 text-sm font-semibold text-slate-700 md:flex">
          <Link href="/" className={`rounded-lg px-4 py-2 hover:bg-slate-100 hover:text-brand-600 ${pathname === "/" ? "text-brand-600" : ""}`}>Home</Link>
          <Link href="/articles" className={`rounded-lg px-4 py-2 hover:bg-slate-100 hover:text-brand-600 ${pathname.startsWith("/articles") ? "text-brand-600" : ""}`}>Articles</Link>
          <Link href="/about" className={`rounded-lg px-4 py-2 hover:bg-slate-100 hover:text-brand-600 ${pathname.startsWith("/about") ? "text-brand-600" : ""}`}>About</Link>
          <Link href="/search" className={`rounded-lg px-4 py-2 hover:bg-slate-100 hover:text-brand-600 ${pathname.startsWith("/search") ? "text-brand-600" : ""}`}>Search</Link>
        </nav>
        <button className="p-2 md:hidden" onClick={() => setOpen((v) => !v)} type="button" aria-label="Open menu">☰</button>
      </div>
      {open && (
        <div className="space-y-2 border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <Link href="/" className="block rounded-lg px-3 py-2" onClick={() => setOpen(false)}>Home</Link>
          <Link href="/articles" className="block rounded-lg px-3 py-2" onClick={() => setOpen(false)}>Articles</Link>
          <Link href="/about" className="block rounded-lg px-3 py-2" onClick={() => setOpen(false)}>About</Link>
          <Link href="/search" className="block rounded-lg px-3 py-2" onClick={() => setOpen(false)}>Search</Link>
        </div>
      )}
    </header>
  );
}
