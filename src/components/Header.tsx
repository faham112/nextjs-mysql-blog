"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
export default function Header({ isWriter }: { isWriter: boolean; writerName?: string }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin") || pathname === "/login";
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="border-b border-dark-800 bg-dark-900 text-xs text-slate-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
          <span className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span className="hidden sm:inline">Guides & resources by Abdul Faheem</span>
            <span className="sm:hidden">GlobalCareerHub</span>
          </span>
          <Link href={isWriter ? "/admin" : "/login"} className="font-semibold text-brand-500 hover:text-white">Writer Desk</Link>
        </div>
      </div>
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-dark-800 bg-dark-900 text-2xl font-extrabold text-brand-600">G<span className="text-white">.</span></div>
            <div>
              <p className="font-heading text-xl font-extrabold leading-none tracking-tight">Global<span className="text-brand-600">CareerHub</span></p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">By Abdul Faheem</p>
            </div>
          </Link>
          {!isAdmin && (
            <nav className="hidden items-center gap-1 text-sm font-semibold text-slate-700 md:flex">
              <Link href="/" className="rounded-lg px-4 py-2 hover:bg-slate-100 hover:text-brand-600">Home</Link>
              <Link href="/articles" className="rounded-lg px-4 py-2 hover:bg-slate-100 hover:text-brand-600">Latest Articles</Link>
              <Link href="/about" className="rounded-lg px-4 py-2 hover:bg-slate-100 hover:text-brand-600">About Author</Link>
              <Link href="/terms" className="rounded-lg px-4 py-2 hover:bg-slate-100 hover:text-brand-600">Terms & Legal</Link>
            </nav>
          )}
          <div className="hidden items-center gap-3 sm:flex">
            {isWriter ? <Link href="/admin" className="btn">Dashboard</Link> : <Link href="/login" className="btn-outline">Writer Login</Link>}
          </div>
          <button className="p-2 md:hidden" onClick={() => setOpen((v) => !v)} type="button">☰</button>
        </div>
        {open && !isAdmin && (
          <div className="space-y-2 border-t border-slate-200 bg-white px-4 py-4 md:hidden">
            <Link href="/" className="block rounded-lg px-3 py-2" onClick={() => setOpen(false)}>Home</Link>
            <Link href="/articles" className="block rounded-lg px-3 py-2" onClick={() => setOpen(false)}>Latest Articles</Link>
            <Link href="/about" className="block rounded-lg px-3 py-2" onClick={() => setOpen(false)}>About Author</Link>
            <Link href="/terms" className="block rounded-lg px-3 py-2" onClick={() => setOpen(false)}>Terms</Link>
            <Link href="/login" className="btn mt-2 w-full" onClick={() => setOpen(false)}>Writer Login</Link>
          </div>
        )}
      </header>
    </>
  );
}
