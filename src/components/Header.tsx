"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Search } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const menuLinks = [
  { href: "/", label: "Home" },
  { href: "/articles", label: "Articles" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");

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

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    setSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(term)}`);
  }

  return (
    <>
      {/* Mini top bar */}
      <div className="border-b border-slate-800 bg-[#0a101d] px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-white sm:px-8">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-rose-500" />
            <span>Global Career & Study Desk</span>
          </div>
          <div className="hidden font-medium text-slate-400 sm:block">
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}{" "}
            Edition
          </div>
        </div>
      </div>

      <header
        className="sticky top-0 z-[80] border-b backdrop-blur-md"
        style={{
          background: "var(--nav)",
          borderColor: "var(--border)",
          color: "var(--fg)",
        }}
      >
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="grid h-20 grid-cols-[auto_1fr_auto] items-center gap-3 sm:h-24">
            {/* Left: hamburger only (all breakpoints) */}
            <button
              type="button"
              aria-label="Open menu"
              className="rounded-md p-2 transition hover:opacity-80"
              style={{ color: "var(--fg)" }}
              onClick={() => setOpen(true)}
            >
              <Menu size={22} />
            </button>

            {/* Center logo */}
            <Link
              href="/"
              className="flex flex-col items-center justify-center justify-self-center text-center"
            >
              <div className="flex items-center space-x-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.svg"
                  alt=""
                  width={40}
                  height={40}
                  className="h-9 w-9 rounded-xl border-2 border-rose-600 object-contain shadow-md sm:h-10 sm:w-10"
                />
                <span className="font-heading text-2xl font-extrabold tracking-tight sm:text-3xl">
                  Global<span className="text-rose-600">Career</span>Hub
                </span>
              </div>
              <span
                className="mt-1 text-[9px] font-bold uppercase tracking-[0.28em] sm:text-[10px]"
                style={{ color: "var(--muted)" }}
              >
                Careers · Skills · Study
              </span>
            </Link>

            {/* Right: theme + search */}
            <div className="flex items-center justify-end gap-2">
              <ThemeToggle />
              <button
                type="button"
                aria-label="Search"
                title="Search"
                className="rounded-lg border p-2 shadow-sm transition sm:p-2.5"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--fg)",
                  background: "var(--bg2)",
                }}
                onClick={() => setSearchOpen(true)}
              >
                <Search size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Drawer — all screen sizes */}
      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[99999] bg-slate-950/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="fixed inset-y-0 left-0 flex w-80 max-w-[85vw] flex-col justify-between p-6 shadow-2xl"
            style={{ background: "var(--bg)", color: "var(--fg)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div
                className="flex items-center justify-between border-b pb-6"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo.svg"
                    alt=""
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-lg"
                  />
                  <span className="font-heading text-xl font-extrabold">Menu</span>
                </div>
                <button
                  type="button"
                  aria-label="Close menu"
                  className="p-2"
                  onClick={() => setOpen(false)}
                >
                  <X size={22} />
                </button>
              </div>
              <nav className="mt-6 flex flex-col space-y-1 text-sm font-bold uppercase tracking-wider">
                {menuLinks.map((l) => {
                  const active =
                    pathname === l.href ||
                    (l.href !== "/" && pathname.startsWith(l.href));
                  return (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="rounded-xl px-4 py-3 transition"
                      style={{
                        background: active ? "#e11d48" : "transparent",
                        color: active ? "#fff" : "var(--fg)",
                      }}
                    >
                      {l.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div
              className="text-center text-xs font-medium"
              style={{ color: "var(--muted)" }}
            >
              © {new Date().getFullYear()} GlobalCareerHub
            </div>
          </div>
        </div>
      ) : null}

      {/* Search modal */}
      {searchOpen ? (
        <div
          className="fixed inset-0 z-[99999] flex items-start justify-center bg-slate-950/70 px-4 pt-20 backdrop-blur-md"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl rounded-2xl border p-6 shadow-2xl"
            style={{
              background: "var(--bg2)",
              borderColor: "var(--border)",
              color: "var(--fg)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close search"
              className="absolute right-4 top-4 p-1"
              style={{ color: "var(--muted)" }}
              onClick={() => setSearchOpen(false)}
            >
              <X size={22} />
            </button>
            <h3 className="mb-4 font-heading text-lg font-bold">
              Search GlobalCareerHub
            </h3>
            <form onSubmit={submitSearch} className="relative">
              <input
                autoFocus
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Type keywords (e.g. Cybersecurity, Scholarship)..."
                className="w-full rounded-xl border px-5 py-3.5 pr-28 text-sm outline-none"
                style={{
                  background: "var(--bg)",
                  borderColor: "var(--border)",
                  color: "var(--fg)",
                }}
              />
              <button
                type="submit"
                className="absolute right-2 top-2 rounded-lg bg-rose-600 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-rose-700"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
