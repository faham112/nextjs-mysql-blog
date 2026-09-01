"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Header({ isWriter, writerName }: { isWriter: boolean; writerName?: string }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isAdmin = pathname.startsWith("/admin") || pathname.startsWith("/login");
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-[#f6f1e8]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="leading-tight">
          <span className="block font-serif text-xl tracking-tight sm:text-2xl">Global<span className="text-accent">CareerHub</span></span>
          <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Abdul Faheem</span>
        </Link>
        {!isHome && !isAdmin && (
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <Link href="/articles" className="hover:text-accent">Articles</Link>
            <Link href="/about" className="hover:text-accent">About</Link>
            <Link href="/contact" className="hover:text-accent">Contact</Link>
            <Link href="/search" className="hover:text-accent">Search</Link>
          </nav>
        )}
        {isWriter ? (
          <div className="flex items-center gap-3">
            {!isAdmin && <span className="hidden text-xs text-moss sm:inline">Hi, {writerName}</span>}
            <Link href="/admin" className="btn !px-4 !py-1.5 text-xs">Writer desk</Link>
          </div>
        ) : (
          <Link href="/login" className="btn-outline !px-4 !py-1.5 text-xs">Writer login</Link>
        )}
      </div>
    </header>
  );
}
