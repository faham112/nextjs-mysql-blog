"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Search } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

type Cat = { name: string; slug: string };

export default function EditorialNav({ categories }: { categories: Cat[] }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    setSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(term)}`);
  }

  return (
    <>
      <header
        className="sticky top-0 z-50 border-b backdrop-blur"
        style={{
          background: "var(--nav)",
          borderColor: "var(--border)",
          color: "var(--fg)",
        }}
      >
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          {/* No desktop page links — hamburger + center logo + tools on ALL sizes */}
          <div className="grid h-20 grid-cols-[auto_1fr_auto] items-center gap-3 sm:h-24">
            <button
              type="button"
              aria-label="Open menu"
              className="rounded-md p-2"
              style={{ color: "var(--fg)" }}
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={22} />
            </button>

            <Link
              href="/"
              className="flex flex-col items-center justify-center justify-self-center text-center"
            >
              <div className="flex items-center space-x-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.svg"
                  alt="Global Career Hub"
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

            <div className="flex items-center justify-end gap-2">
              <ThemeToggle />
              <button
                type="button"
                aria-label="Search"
                className="rounded-lg border p-2 shadow-sm sm:p-2.5"
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

        {/* Category strip */}
        <div
          className="border-t"
          style={{ borderColor: "var(--border)", background: "var(--bg2)" }}
        >
          <div className="mx-auto max-w-[1400px] px-2 sm:px-6">
            <div
              className="category-scroll flex items-center overflow-x-auto whitespace-nowrap text-[11px] font-bold uppercase tracking-wider"
              style={{ color: "var(--fg)" }}
            >
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/category/${c.slug}`}
                  className="flex-shrink-0 border-r px-5 py-3.5 transition hover:text-rose-600"
                  style={{ borderColor: "var(--border)" }}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Drawer */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[99999] bg-slate-950/60 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
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
                <span className="font-heading text-xl font-extrabold">Menu</span>
                <button
                  type="button"
                  aria-label="Close"
                  className="p-2"
                  onClick={() => setMenuOpen(false)}
                >
                  <X size={22} />
                </button>
              </div>
              <nav className="mt-6 flex flex-col space-y-1 text-sm font-bold uppercase tracking-wider">
                <Link
                  href="/"
                  className="rounded-xl px-4 py-3"
                  onClick={() => setMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/articles"
                  className="rounded-xl px-4 py-3"
                  onClick={() => setMenuOpen(false)}
                >
                  Articles
                </Link>
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/category/${c.slug}`}
                    className="rounded-xl px-4 py-3"
                    onClick={() => setMenuOpen(false)}
                  >
                    {c.name}
                  </Link>
                ))}
                <Link
                  href="/about"
                  className="rounded-xl px-4 py-3"
                  onClick={() => setMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="rounded-xl px-4 py-3"
                  onClick={() => setMenuOpen(false)}
                >
                  Contact
                </Link>
              </nav>
            </div>
            <div
              className="text-center text-xs"
              style={{ color: "var(--muted)" }}
            >
              © {new Date().getFullYear()} GlobalCareerHub
            </div>
          </div>
        </div>
      )}

      {/* Search modal */}
      {searchOpen && (
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
                className="absolute right-2 top-2 rounded-lg bg-rose-600 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
