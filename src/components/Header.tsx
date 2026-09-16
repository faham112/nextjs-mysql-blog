"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
const links = [
  { href: "/", label: "Home" },
  { href: "/articles", label: "Articles" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];
export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  return (
    <header className="site-header sticky top-0 z-[80] backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo.svg" alt="Global Career Hub" className="h-10 w-10 rounded-xl" />
          <p className="font-heading text-xl font-extrabold leading-none tracking-tight">Global<span className="text-brand-600">CareerHub</span></p>
        </Link>
        <nav className="hidden items-center gap-1 text-sm font-semibold md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={`rounded-lg px-4 py-2 hover:text-brand-600 ${pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href)) ? "text-brand-600" : ""}`}>{l.label}</Link>
          ))}
          <ThemeToggle />
        </nav>
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button className="relative z-[90] rounded-lg p-2" onClick={() => setOpen(true)} type="button" aria-label="Open menu"><Menu size={22} /></button>
        </div>
      </div>
      <div className={`fixed inset-0 z-[90] md:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`} aria-hidden={!open}>
        <button className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} type="button" aria-label="Close" onClick={() => setOpen(false)} />
        <aside className={`absolute right-0 top-0 flex h-full w-[min(82vw,320px)] flex-col border-l shadow-2xl transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`} style={{ background: "var(--bg2)", borderColor: "var(--border)", color: "var(--fg)" }}>
          <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center gap-2">
              <img src="/logo.svg" alt="" className="h-8 w-8 rounded-lg" />
              <span className="font-heading text-sm font-extrabold">Menu</span>
            </div>
            <button className="rounded-lg p-2" type="button" aria-label="Close menu" onClick={() => setOpen(false)}><X size={20} /></button>
          </div>
          <nav className="flex flex-col p-3 text-sm font-semibold">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={`rounded-xl px-4 py-3 ${pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href)) ? "bg-brand-600 text-white" : ""}`} onClick={() => setOpen(false)}>{l.label}</Link>
            ))}
          </nav>
        </aside>
      </div>
    </header>
  );
}
