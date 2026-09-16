"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  return (
    <header className="sticky top-0 z-[80] border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo.svg" alt="Global Career Hub" className="h-10 w-10 rounded-xl" />
          <p className="font-heading text-xl font-extrabold leading-none tracking-tight">Global<span className="text-brand-600">CareerHub</span></p>
        </Link>
        <nav className="hidden items-center gap-1 text-sm font-semibold text-slate-700 md:flex">
          <Link href="/" className={`rounded-lg px-4 py-2 hover:bg-slate-100 ${pathname === "/" ? "text-brand-600" : ""}`}>Home</Link>
          <Link href="/articles" className={`rounded-lg px-4 py-2 hover:bg-slate-100 ${pathname.startsWith("/articles") ? "text-brand-600" : ""}`}>Articles</Link>
          <Link href="/about" className={`rounded-lg px-4 py-2 hover:bg-slate-100 ${pathname.startsWith("/about") ? "text-brand-600" : ""}`}>About</Link>
          <Link href="/contact" className={`rounded-lg px-4 py-2 hover:bg-slate-100 ${pathname.startsWith("/contact") ? "text-brand-600" : ""}`}>Contact</Link>
        </nav>
        <button className="relative z-[90] rounded-lg p-2 md:hidden" onClick={() => setOpen((v) => !v)} type="button" aria-label={open ? "Close menu" : "Open menu"}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-[70] md:hidden">
          <button className="absolute inset-0 bg-black/40" type="button" aria-label="Close" onClick={() => setOpen(false)} />
          <div className="absolute right-3 top-[62px] w-[min(280px,calc(100%-1.5rem))] rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
            <Link href="/" className="block rounded-lg px-3 py-2.5 text-sm font-semibold" onClick={() => setOpen(false)}>Home</Link>
            <Link href="/articles" className="block rounded-lg px-3 py-2.5 text-sm font-semibold" onClick={() => setOpen(false)}>Articles</Link>
            <Link href="/about" className="block rounded-lg px-3 py-2.5 text-sm font-semibold" onClick={() => setOpen(false)}>About</Link>
            <Link href="/contact" className="block rounded-lg px-3 py-2.5 text-sm font-semibold" onClick={() => setOpen(false)}>Contact</Link>
          </div>
        </div>
      )}
    </header>
  );
}
