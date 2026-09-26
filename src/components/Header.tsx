"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const leftLinks = [
  { href: "/", label: "Home" },
  { href: "/articles", label: "Articles" },
];

const rightLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const allLinks = [...leftLinks, ...rightLinks];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function isActive(href: string) {
    return (
      pathname === href || (href !== "/" && pathname.startsWith(href))
    );
  }

  return (
    <>
      <header
        className="sticky top-0 z-[80] border-b backdrop-blur-md"
        style={{
          background: "var(--nav)",
          borderColor: "var(--border)",
          color: "var(--fg)",
        }}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-3">
          {/* LEFT NAV */}
          <nav className="hidden items-center justify-start gap-1 text-sm font-semibold md:flex">
            {leftLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-lg px-3 py-2 transition"
                style={{
                  color: isActive(l.href) ? "var(--fg)" : "var(--muted)",
                  background: isActive(l.href)
                    ? "color-mix(in srgb, var(--fg) 8%, transparent)"
                    : "transparent",
                }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Mobile: spacer left for balance */}
          <div className="md:hidden" />

          {/* CENTER LOGO */}
          <Link
            href="/"
            className="flex flex-col items-center justify-center gap-1 justify-self-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.svg"
              alt="Global Career Hub"
              width={44}
              height={44}
              className="h-11 w-11 rounded-xl object-contain"
            />
            <span className="font-heading text-sm font-extrabold tracking-tight sm:text-base">
              Global<span className="text-brand-500">CareerHub</span>
            </span>
          </Link>

          {/* RIGHT NAV + THEME */}
          <div className="flex items-center justify-end gap-1">
            <nav className="hidden items-center gap-1 text-sm font-semibold md:flex">
              {rightLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-lg px-3 py-2 transition"
                  style={{
                    color: isActive(l.href) ? "var(--fg)" : "var(--muted)",
                    background: isActive(l.href)
                      ? "color-mix(in srgb, var(--fg) 8%, transparent)"
                      : "transparent",
                  }}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <ThemeToggle />
            <button
              type="button"
              aria-label="Open menu"
              className="p-2 md:hidden"
              onClick={() => setOpen(true)}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          className="md:hidden"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            background: "var(--bg)",
            color: "var(--fg)",
          }}
        >
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: "1px solid var(--border)" }}
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
              <span className="font-heading text-base font-extrabold">Menu</span>
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
          <nav className="flex flex-col p-4 text-base font-semibold">
            {allLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                style={{
                  display: "block",
                  padding: "14px 16px",
                  borderRadius: 12,
                  marginBottom: 8,
                  background: isActive(l.href) ? "#e11d48" : "var(--bg2)",
                  color: isActive(l.href) ? "#ffffff" : "var(--fg)",
                }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </>
  );
}
