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
    <>
      <header className="sticky top-0 z-[80]" style={{ background: "#ffffff", borderBottom: "1px solid #e2e8f0", color: "#0f172a" }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex min-w-0 items-center gap-2">
            <img src="/logo.svg" alt="Global Career Hub" width={40} height={40} className="h-10 w-10 shrink-0 rounded-xl" />
            <span className="truncate font-heading text-lg font-extrabold">Global<span style={{ color: "#e11d48" }}>CareerHub</span></span>
          </Link>
          <nav className="hidden items-center gap-1 text-sm font-semibold md:flex">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="rounded-lg px-4 py-2">{l.label}</Link>
            ))}
            <ThemeToggle />
          </nav>
          <div className="flex shrink-0 items-center gap-1 md:hidden">
            <ThemeToggle />
            <button type="button" aria-label="Open menu" className="p-2" onClick={() => setOpen(true)}><Menu size={22} /></button>
          </div>
        </div>
      </header>
      {open ? (
        <div role="dialog" aria-modal="true" className="md:hidden" style={{ position: "fixed", inset: 0, zIndex: 99999, background: "#ffffff", color: "#0f172a" }}>
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid #e2e8f0" }}>
            <span className="font-heading text-base font-extrabold">Menu</span>
            <button type="button" aria-label="Close menu" className="p-2" onClick={() => setOpen(false)}><X size={22} /></button>
          </div>
          <nav className="flex flex-col p-4 text-base font-semibold">
            {links.map((l) => {
              const active = pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href));
              return (
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)} style={{ display: "block", padding: "14px 16px", borderRadius: 12, marginBottom: 8, background: active ? "#e11d48" : "#f1f5f9", color: active ? "#ffffff" : "#0f172a" }}>{l.label}</Link>
              );
            })}
          </nav>
        </div>
      ) : null}
    </>
  );
}
