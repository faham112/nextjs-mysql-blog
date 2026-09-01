import Link from "next/link";
import { getSession } from "@/lib/auth";

export default async function Header() {
  const user = await getSession().catch(() => null);
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-[#f6f1e8]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="leading-tight">
          <span className="block font-serif text-xl tracking-tight sm:text-2xl">
            Global<span className="text-accent">CareerHub</span>
          </span>
          <span className="hidden text-[11px] uppercase tracking-[0.18em] text-slate-500 sm:block">
            Abdul Faheem
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link href="/" className="hover:text-accent">Home</Link>
          <Link href="/articles" className="hover:text-accent">Articles</Link>
          <Link href="/about" className="hover:text-accent">About</Link>
          <Link href="/contact" className="hover:text-accent">Contact</Link>
          <Link href="/search" className="hover:text-accent">Search</Link>
        </nav>
        {user ? (
          <Link href="/admin" className="btn !px-4 !py-1.5 text-xs">Writer desk</Link>
        ) : (
          <Link href="/login" className="text-xs text-slate-500 hover:text-ink">Writer login</Link>
        )}
      </div>
    </header>
  );
}
