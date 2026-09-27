import Link from "next/link";
import CookieSettingsButton from "@/components/CookieSettingsButton";
import { AUTHOR_NAME } from "@/lib/schema";

const columns: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Topics",
    links: [
      { label: "Careers", href: "/category/careers" },
      { label: "Scholarships", href: "/category/scholarships" },
      { label: "Study Abroad", href: "/category/study-abroad" },
      { label: "Skills", href: "/category/skills" },
      { label: "Applications", href: "/category/applications" },
      { label: "Technology", href: "/category/technology" },
    ],
  },
  {
    title: "Site",
    links: [
      { label: "All guides", href: "/articles" },
      { label: "About the author", href: "/about" },
      { label: "Editorial policy", href: "/about#editorial-policy" },
      { label: "Contact", href: "/contact" },
      { label: "Search", href: "/search" },
      { label: "RSS feed", href: "/rss.xml" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", href: "/privacy" },
      { label: "Cookie notice", href: "/cookies" },
      { label: "Terms", href: "/terms" },
      { label: "Disclaimer", href: "/disclaimer" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="site-footer mt-16">
      <div className="mx-auto max-w-[1280px] px-5 pb-8 pt-12 sm:px-8 lg:pt-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.svg" alt="" width={36} height={36} className="h-9 w-9 rounded-[10px]" loading="lazy" />
              <span className="font-heading text-xl font-extrabold tracking-tight">
                Global<span className="text-rose-600">Career</span>Hub
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-[14px] leading-6" style={{ color: "var(--muted)" }}>
              Free, practical guides for students and job seekers in Pakistan: careers, skills, scholarships
              and study abroad. Independent, not an agency. Every guide links to the official source.
            </p>
            <p className="mt-4 text-[13px]" style={{ color: "var(--muted)" }}>
              Written and edited by{" "}
              <Link href="/about" className="font-semibold underline-offset-4 hover:underline" style={{ color: "var(--fg)" }}>
                {AUTHOR_NAME}
              </Link>
            </p>
          </div>
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: "var(--muted)" }}>
                {col.title}
              </div>
              <ul className="space-y-2 text-[14px]">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="transition hover:text-rose-600" style={{ color: "var(--fg)" }}>
                      {l.label}
                    </Link>
                  </li>
                ))}
                {col.title === "Legal" ? (
                  <li>
                    <CookieSettingsButton label="Cookie settings" className="text-left text-[var(--fg)] transition hover:text-rose-600" />
                  </li>
                ) : null}
              </ul>
            </nav>
          ))}
        </div>

        <div
          className="mt-10 flex flex-col gap-2 border-t pt-6 text-[12px] sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: "var(--border)", color: "var(--muted)" }}
        >
          <span>© {new Date().getFullYear()} GlobalCareerHub.org · All rights reserved.</span>
          <span>Information only, not immigration, legal or financial advice. Always confirm on the official site.</span>
        </div>
      </div>
    </footer>
  );
}
