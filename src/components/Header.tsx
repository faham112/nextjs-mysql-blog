"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X, Search } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const SearchModal = dynamic(() => import("@/components/SearchModal"));

export type NavCategory = { name: string; slug: string; count: number | null };

const siteLinks = [
  { href: "/about", label: "About the author" },
  { href: "/about#editorial-policy", label: "Editorial policy" },
  { href: "/contact", label: "Contact" },
  { href: "/search", label: "Search" },
];
const legalLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/cookies", label: "Cookies" },
  { href: "/terms", label: "Terms" },
  { href: "/disclaimer", label: "Disclaimer" },
];

function Chip({ href, label, count, active }: { href: string; label: string; count: number | null; active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      data-active={active || undefined}
      className="inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 text-[13px] font-semibold transition hover:border-[var(--accent)]"
      style={
        active
          ? { background: "var(--fg)", color: "var(--bg)", borderColor: "var(--fg)" }
          : { background: "var(--bg2)", color: "var(--fg)", borderColor: "var(--border)" }
      }
    >
      {label}
      {count ? (
        <span
          className="min-w-[20px] rounded-full px-1.5 text-center text-[11px] font-bold tabular-nums leading-[18px]"
          style={
            active
              ? { background: "color-mix(in srgb, var(--bg) 22%, transparent)", color: "var(--bg)" }
              : { background: "color-mix(in srgb, var(--accent) 14%, transparent)", color: "var(--accent)" }
          }
        >
          {count}
        </span>
      ) : null}
    </Link>
  );
}

/**
 * Site header for every public page: compact bar (menu, logo, theme, search) plus ONE topic
 * menu (chips with guide counts; swipeable on mobile, a single centred row on desktop).
 */
export default function Header({ categories }: { categories: NavCategory[] }) {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open || searchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, searchOpen]);

  // Keep the active chip visible in the swipe row (horizontal scroll only, never the page).
  useEffect(() => {
    const row = rowRef.current;
    const chip = row?.querySelector<HTMLElement>("[data-active]");
    if (row && chip && row.scrollWidth > row.clientWidth) {
      row.scrollLeft = chip.offsetLeft - (row.clientWidth - chip.offsetWidth) / 2;
    }
  }, [pathname]);

  const total = categories.reduce((n, c) => n + (c.count || 0), 0);
  const catActive = (slug: string) => pathname === `/category/${slug}`;

  return (
    <>
      <header
        className="sticky top-0 z-[80] border-b backdrop-blur-md"
        style={{ background: "var(--nav)", borderColor: "var(--border)", color: "var(--fg)" }}
      >
        <div className="mx-auto max-w-[1280px] px-3 sm:px-8">
          <div className="grid h-16 grid-cols-[auto_1fr_auto] items-center gap-2 sm:h-[72px]">
            <button
              type="button"
              aria-label="Open menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg transition hover:opacity-80"
              style={{ color: "var(--fg)" }}
              onClick={() => setOpen(true)}
            >
              <Menu size={22} />
            </button>

            <Link href="/" aria-label="GlobalCareerHub home" className="flex flex-col items-center justify-self-center text-center">
              <span className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.svg" alt="" width={36} height={36} className="h-8 w-8 rounded-[10px] border-2 border-rose-600 object-contain sm:h-9 sm:w-9" />
                <span className="font-heading text-[21px] font-extrabold tracking-tight sm:text-[26px]">
                  Global<span className="text-rose-600">Career</span>Hub
                </span>
              </span>
              <span className="mt-0.5 hidden text-[10px] font-bold uppercase tracking-[0.26em] sm:block" style={{ color: "var(--muted)" }}>
                Careers · Scholarships · Study abroad
              </span>
            </Link>

            <div className="flex items-center justify-end gap-2">
              <ThemeToggle />
              <button
                type="button"
                aria-label="Search"
                title="Search"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border transition"
                style={{ borderColor: "var(--border)", color: "var(--fg)", background: "var(--bg2)" }}
                onClick={() => setSearchOpen(true)}
              >
                <Search size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {categories.length > 0 ? (
        <nav aria-label="Topics" className="border-b" style={{ borderColor: "var(--border)", background: "var(--bg)" }}>
          <div
            ref={rowRef}
            className="overflow-x-auto [mask-image:linear-gradient(to_right,#000_calc(100%-28px),transparent)] [scrollbar-width:none] lg:[mask-image:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="mx-auto flex w-max gap-2 px-4 py-2.5 sm:px-8">
              <Chip href="/articles" label="All guides" count={total || null} active={pathname === "/articles"} />
              {categories.map((c) => (
                <Chip key={c.slug} href={`/category/${c.slug}`} label={c.name} count={c.count} active={catActive(c.slug)} />
              ))}
            </div>
          </div>
        </nav>
      ) : null}

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-[99999] bg-slate-950/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="fixed inset-y-0 left-0 flex w-80 max-w-[86vw] flex-col overflow-y-auto p-5 shadow-2xl"
            style={{ background: "var(--bg)", color: "var(--fg)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: "var(--border)" }}>
              <span className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.svg" alt="" width={32} height={32} className="h-8 w-8 rounded-lg" />
                <span className="font-heading text-lg font-extrabold">GlobalCareerHub</span>
              </span>
              <button type="button" aria-label="Close menu" className="inline-flex h-10 w-10 items-center justify-center" onClick={() => setOpen(false)}>
                <X size={22} />
              </button>
            </div>

            <nav aria-label="Menu" className="mt-4 flex flex-col text-[15px] font-semibold">
              {[{ href: "/", label: "Home", count: null as number | null }, { href: "/articles", label: "All guides", count: total || null }]
                .concat(categories.map((c) => ({ href: `/category/${c.slug}`, label: c.name, count: c.count })))
                .map((l) => {
                  const active = pathname === l.href;
                  return (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between rounded-lg px-3 py-2.5 transition"
                      style={{ background: active ? "var(--accent)" : "transparent", color: active ? "#fff" : "var(--fg)" }}
                    >
                      {l.label}
                      {l.count ? <span className="text-[12px] font-bold tabular-nums" style={{ color: active ? "#fff" : "var(--muted)" }}>{l.count}</span> : null}
                    </Link>
                  );
                })}
              <div className="my-3 border-t" style={{ borderColor: "var(--border)" }} />
              {siteLinks.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5" style={{ color: "var(--fg)" }}>
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 border-t pt-4 text-[12px]" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
              {legalLinks.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="hover:underline">
                  {l.label}
                </Link>
              ))}
              <span className="w-full pt-2">© {new Date().getFullYear()} GlobalCareerHub</span>
            </div>
          </div>
        </div>
      ) : null}

      {searchOpen ? <SearchModal onClose={() => setSearchOpen(false)} /> : null}
    </>
  );
}
