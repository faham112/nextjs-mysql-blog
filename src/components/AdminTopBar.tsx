"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ExternalLink, LogOut, Moon, Plus, Settings, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { initials, pageTitle } from "@/components/admin/nav";

export default function AdminTopBar({ name, email }: { name: string; email: string }) {
  const pathname = usePathname() || "/admin";
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const title = pageTitle(pathname);
  const light = theme === "light";

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="a-glass a-border sticky top-0 z-20 border-b">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:px-6 md:h-16 lg:px-8">
        <Link href="/admin" className="shrink-0 md:hidden" aria-label="Admin home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="GlobalCareerHub" width={32} height={32} className="h-8 w-8 rounded-lg" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="a-subtle hidden text-xs font-medium md:block">Admin</p>
          <h1 className="a-fg truncate text-base font-semibold leading-tight md:text-[15px]">{title}</h1>
        </div>

        <Link href="/admin/posts/new" className="btn btn-sm max-md:!hidden">
          <Plus size={16} strokeWidth={2.4} />
          Write
        </Link>

        <button
          type="button"
          onClick={toggle}
          className="a-icon-btn"
          aria-label={light ? "Switch to dark mode" : "Switch to light mode"}
          title={light ? "Dark mode" : "Light mode"}
        >
          {light ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="a-focus a-hoverable flex min-h-[44px] items-center gap-2 rounded-lg px-1.5 md:min-h-0 md:py-1"
            aria-haspopup="menu"
            aria-expanded={open}
            aria-label="Account menu"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-rose-700 text-xs font-bold text-[#fff]">
              {initials(name)}
            </span>
            <span className="hidden max-w-[140px] truncate text-left text-sm font-medium lg:block">{name}</span>
            <ChevronDown size={14} className="a-subtle hidden lg:block" />
          </button>
          {open && (
            <div
              role="menu"
              className="a-pop a-surface a-border absolute right-0 top-full mt-2 w-64 rounded-xl border p-1.5"
              style={{ boxShadow: "var(--a-shadow-lg)" }}
            >
              <div className="a-border mb-1 border-b px-3 pb-2.5 pt-2">
                <p className="a-fg truncate text-sm font-semibold">{name}</p>
                <p className="a-muted truncate text-xs">{email}</p>
              </div>
              <Link href="/admin/settings" role="menuitem" className="a-menu-item">
                <Settings size={16} /> Settings
              </Link>
              <Link href="/" role="menuitem" className="a-menu-item">
                <ExternalLink size={16} /> View site
              </Link>
              <button type="button" role="menuitem" className="a-menu-item" onClick={toggle}>
                {light ? <Moon size={16} /> : <Sun size={16} />} {light ? "Dark mode" : "Light mode"}
              </button>
              <div className="a-border my-1 border-t" />
              <form action="/api/auth/logout" method="post">
                <button type="submit" role="menuitem" className="a-menu-item">
                  <LogOut size={16} /> Log out
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
