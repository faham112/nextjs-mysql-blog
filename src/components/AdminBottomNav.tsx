"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ChevronRight,
  ExternalLink,
  FileText,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Plus,
  Settings,
  Sun,
  Wrench,
  X,
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { isActive } from "@/components/admin/nav";

/** Mobile (< md) bottom tab bar with a "More" sheet. */
export default function AdminBottomNav({ name, email }: { name: string; email: string }) {
  const pathname = usePathname() || "/admin";
  const { theme, toggle } = useTheme();
  const [more, setMore] = useState(false);
  const light = theme === "light";

  useEffect(() => setMore(false), [pathname]);
  useEffect(() => {
    if (!more) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMore(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [more]);

  const moreActive = ["/admin/settings", "/admin/tools"].some((h) => isActive(pathname, h));
  const writeActive = isActive(pathname, "/admin/posts/new");

  const tab = (href: string, label: string, Icon: typeof FileText) => {
    const active = isActive(pathname, href);
    return (
      <Link href={href} className="a-tab" aria-current={active ? "page" : undefined}>
        <Icon size={22} strokeWidth={active ? 2.2 : 1.8} />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <>
      <nav
        className="a-tabbar a-glass a-border fixed inset-x-0 bottom-0 z-40 border-t md:hidden"
        aria-label="Admin tabs"
      >
        <div className="mx-auto grid max-w-md grid-cols-5 items-end px-1">
          {tab("/admin", "Overview", LayoutDashboard)}
          {tab("/admin/posts", "Posts", FileText)}
          <Link
            href="/admin/posts/new"
            className="a-tab"
            aria-current={writeActive ? "page" : undefined}
            aria-label="Write a new article"
          >
            <span className="a-fab -mt-6">
              <Plus size={26} strokeWidth={2.4} />
            </span>
            <span>Write</span>
          </Link>
          {tab("/admin/categories", "Categories", FolderTree)}
          <button
            type="button"
            className="a-tab"
            aria-current={moreActive ? "page" : undefined}
            aria-haspopup="dialog"
            aria-expanded={more}
            onClick={() => setMore(true)}
          >
            <Menu size={22} strokeWidth={moreActive ? 2.2 : 1.8} />
            <span>More</span>
          </button>
        </div>
      </nav>

      {more && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="More">
          <button
            type="button"
            className="a-backdrop absolute inset-0 bg-black/50"
            aria-label="Close menu"
            onClick={() => setMore(false)}
          />
          <div
            className="a-sheet a-surface a-border absolute inset-x-0 bottom-0 rounded-t-2xl border-t px-3 pt-2"
            style={{ boxShadow: "var(--a-shadow-lg)" }}
          >
            <div className="mx-auto mb-2 h-1 w-10 rounded-full" style={{ background: "var(--a-border-strong)" }} />
            <div className="flex items-center justify-between px-2 pb-2">
              <div className="min-w-0">
                <p className="a-fg truncate text-sm font-semibold">{name}</p>
                <p className="a-muted truncate text-xs">{email}</p>
              </div>
              <button type="button" className="a-icon-btn" aria-label="Close" onClick={() => setMore(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="a-border space-y-0.5 border-t pt-2">
              <Link href="/admin/settings" className="a-menu-item" aria-current={isActive(pathname, "/admin/settings") ? "page" : undefined}>
                <Settings size={20} /> <span className="flex-1">Settings</span> <ChevronRight size={16} />
              </Link>
              <Link href="/admin/tools" className="a-menu-item" aria-current={isActive(pathname, "/admin/tools") ? "page" : undefined}>
                <Wrench size={20} /> <span className="flex-1">Tools</span> <ChevronRight size={16} />
              </Link>
              <Link href="/" className="a-menu-item">
                <ExternalLink size={20} /> <span className="flex-1">View site</span> <ChevronRight size={16} />
              </Link>
              <button type="button" className="a-menu-item" onClick={toggle}>
                {light ? <Moon size={20} /> : <Sun size={20} />}
                <span className="flex-1">{light ? "Dark mode" : "Light mode"}</span>
              </button>
              <div className="a-border !my-2 border-t" />
              <form action="/api/auth/logout" method="post">
                <button type="submit" className="a-menu-item !text-red-600 dark:!text-red-400">
                  <LogOut size={20} className="!text-current" /> <span className="flex-1">Log out</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
