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
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);
  return (
    <>
      <header className="site-header sticky top-0 z-[80] backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <img src="/logo.svg" alt="Global Career Hub" className="h-10 w-10 shrink-0 rounded-xl" />
            <p className="truncate font-heading text-xl font-extrabold leading-none tracking-tight">Global<span className="text-brand-600">CareerHub</span></p>
          </Link>
          <nav className="hidden items-center gap-1 text-sm font-semibold md:flex">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={`rounded-lg px-4 py-2 hover:text-brand-600 ${pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href)) ? "text-brand-600" : ""}`}>{l.label}</Link>
            ))}
            <ThemeToggle />
          </nav>
          <div className="flex shrink-0 items-center gap-1 md:hidden">
            <ThemeToggle />
            <button className="rounded-lg p-2" onClick={() => setOpen(true)} type="button" aria-label="Open menu"><Menu size={22} /></button>
          </div>
        </div>
      </header>
      {open ? (
        <div className="fixed inset-0 z-[200] md:hidden">
          <button className="absolute inset-0 bg-black/60" type="button" aria-label="Close menu" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 right-0 flex w-[78vw] max-w-[300px] flex-col bg-white text-slate-900 shadow-2xl dark:bg-zinc-950 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 dark:border-zinc-800">
              <span className="font-heading text-sm font-extrabold">Menu</span>
              <button className="rounded-lg p-2" type="button" aria-label="Close" onClick={() => setOpen(false)}><X size={20} /></button>
            </div>
            <nav className="flex flex-col gap-1 p-3 text-sm font-semibold">
              {links.map((l) => {
                const active = pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href));
                return (
                  <Link key={l.href} href={l.href} className={`rounded-xl px-4 py-3 ${active ? "bg-brand-600 text-white" : "hover:bg-slate-100 dark:hover:bg-zinc-800"}`} onClick={() => setOpen(false)}>{l.label}</Link>
                );
              })}
            </nav>
          </aside>
        </div>
      ) : null}
    </>
  );
}
