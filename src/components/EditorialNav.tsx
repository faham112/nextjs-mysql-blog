"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

type Cat = { name: string; slug: string };

export default function EditorialNav({ categories }: { categories: Cat[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

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
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <div className="flex min-h-[76px] items-center justify-between gap-5">
            <Link href="/" className="shrink-0">
              <div className="font-heading text-[25px] font-bold tracking-[-0.05em] sm:text-[30px]">
                GlobalCareer<span style={{ color: "var(--accent)" }}>Hub</span>
              </div>
              <div
                className="mt-0.5 hidden text-[9px] font-semibold uppercase tracking-[0.24em] sm:block"
                style={{ color: "var(--muted)" }}
              >
                Careers · Skills · Study
              </div>
            </Link>

            <nav className="hidden items-center gap-7 lg:flex">
              {(
                [
                  ["#latest", "Latest"],
                  ["/category/careers", "Careers"],
                  ["/category/scholarships", "Scholarships"],
                  ["/category/study-abroad", "Study Abroad"],
                  ["/category/technology", "Technology"],
                  ["/articles", "All"],
                ] as const
              ).map(([href, label]) =>
                href.startsWith("#") ? (
                  <a
                    key={href}
                    href={href}
                    className="text-[12px] font-semibold uppercase tracking-[0.08em] transition hover:opacity-80"
                    style={{ color: "var(--fg)" }}
                  >
                    {label}
                  </a>
                ) : (
                  <Link
                    key={href}
                    href={href}
                    className="text-[12px] font-semibold uppercase tracking-[0.08em] transition"
                    style={{ color: "var(--fg)" }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.color =
                        "var(--accent)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.color =
                        "var(--fg)")
                    }
                  >
                    {label}
                  </Link>
                )
              )}
            </nav>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                type="button"
                onClick={() => setSearchOpen((v) => !v)}
                className="flex h-10 w-10 items-center justify-center border transition"
                style={{ borderColor: "var(--border)", color: "var(--fg)" }}
                aria-label="Search"
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-4-4" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="flex h-10 w-10 items-center justify-center border lg:hidden"
                style={{ borderColor: "var(--border)", color: "var(--fg)" }}
                aria-label="Menu"
              >
                <span className="text-xl">☰</span>
              </button>
            </div>
          </div>

          {searchOpen && (
            <div
              className="border-t py-4"
              style={{ borderColor: "var(--border)" }}
            >
              <form
                action="/search"
                className="flex border"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--bg2)",
                }}
              >
                <input
                  autoFocus
                  name="q"
                  type="search"
                  placeholder="Search careers, scholarships, skills..."
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none"
                  style={{ color: "var(--fg)" }}
                  aria-label="Search guides"
                />
                <button
                  type="submit"
                  className="px-6 text-[11px] font-bold uppercase tracking-[0.1em] text-white"
                  style={{ background: "var(--ink)" }}
                >
                  Search
                </button>
              </form>
            </div>
          )}

          {menuOpen && (
            <nav
              className="border-t py-3 lg:hidden"
              style={{ borderColor: "var(--border)" }}
            >
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/category/${c.slug}`}
                  className="block border-b py-3 text-[12px] font-semibold uppercase tracking-[0.08em]"
                  style={{ borderColor: "var(--border)", color: "var(--fg)" }}
                  onClick={() => setMenuOpen(false)}
                >
                  {c.name}
                </Link>
              ))}
              <Link
                href="/articles"
                className="block py-3 text-[12px] font-semibold uppercase tracking-[0.08em]"
                style={{ color: "var(--fg)" }}
                onClick={() => setMenuOpen(false)}
              >
                All articles
              </Link>
            </nav>
          )}
        </div>
      </header>

      <div
        className="border-b"
        style={{ borderColor: "var(--border)", background: "var(--bg2)" }}
      >
        <div className="mx-auto flex max-w-[1440px] overflow-x-auto px-5 sm:px-8">
          {categories.map((c, index) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className={`whitespace-nowrap border-r px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] transition first:border-l hover:opacity-90 ${
                index === 0 ? "border-l" : ""
              }`}
              style={{
                borderColor: "var(--border)",
                color: "var(--fg)",
              }}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
