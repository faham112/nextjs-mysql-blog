"use client";

import { useState } from "react";
import Link from "next/link";

type Cat = { name: string; slug: string };

export default function EditorialNav({ categories }: { categories: Cat[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#dcdcd7] bg-[#f7f7f5]/95 backdrop-blur">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <div className="flex min-h-[76px] items-center justify-between gap-5">
            <Link href="/" className="shrink-0">
              <div className="font-heading text-[25px] font-bold tracking-[-0.05em] sm:text-[30px] text-[#111827]">
                GlobalCareer<span className="text-[#c5222a]">Hub</span>
              </div>
              <div className="mt-0.5 hidden text-[9px] font-semibold uppercase tracking-[0.24em] text-[#777] sm:block">
                Careers · Skills · Study
              </div>
            </Link>

            <nav className="hidden items-center gap-7 lg:flex">
              <a
                href="#latest"
                className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#111827] transition hover:text-[#c5222a]"
              >
                Latest
              </a>
              <Link
                href="/category/careers"
                className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#111827] transition hover:text-[#c5222a]"
              >
                Careers
              </Link>
              <Link
                href="/category/scholarships"
                className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#111827] transition hover:text-[#c5222a]"
              >
                Scholarships
              </Link>
              <Link
                href="/category/study-abroad"
                className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#111827] transition hover:text-[#c5222a]"
              >
                Study Abroad
              </Link>
              <Link
                href="/category/technology"
                className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#111827] transition hover:text-[#c5222a]"
              >
                Technology
              </Link>
              <Link
                href="/articles"
                className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#111827] transition hover:text-[#c5222a]"
              >
                All
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSearchOpen((v) => !v)}
                className="flex h-10 w-10 items-center justify-center border border-[#d7d7d2] text-[#111827] transition hover:border-[#111827]"
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
                className="flex h-10 w-10 items-center justify-center border border-[#d7d7d2] text-[#111827] lg:hidden"
                aria-label="Menu"
              >
                <span className="text-xl">☰</span>
              </button>
            </div>
          </div>

          {searchOpen && (
            <div className="border-t border-[#deded9] py-4">
              <form
                action="/search"
                className="flex border border-[#cfcfca] bg-white"
              >
                <input
                  autoFocus
                  name="q"
                  type="search"
                  placeholder="Search careers, scholarships, skills..."
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-[#111827] outline-none"
                  aria-label="Search guides"
                />
                <button
                  type="submit"
                  className="bg-[#111827] px-6 text-[11px] font-bold uppercase tracking-[0.1em] text-white"
                >
                  Search
                </button>
              </form>
            </div>
          )}

          {menuOpen && (
            <nav className="border-t border-[#deded9] py-3 lg:hidden">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/category/${c.slug}`}
                  className="block border-b border-[#e5e5e1] py-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#111827]"
                  onClick={() => setMenuOpen(false)}
                >
                  {c.name}
                </Link>
              ))}
              <Link
                href="/articles"
                className="block py-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#111827]"
                onClick={() => setMenuOpen(false)}
              >
                All articles
              </Link>
            </nav>
          )}
        </div>
      </header>

      <div className="border-b border-[#deded9] bg-white">
        <div className="mx-auto flex max-w-[1440px] overflow-x-auto px-5 sm:px-8">
          {categories.map((c, index) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className={`whitespace-nowrap border-r border-[#deded9] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#111827] transition first:border-l hover:bg-[#111827] hover:text-white ${
                index === 0 ? "border-l" : ""
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
