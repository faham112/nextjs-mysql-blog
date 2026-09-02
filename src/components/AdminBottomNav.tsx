"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/admin", label: "Home" },
  { href: "/admin/posts", label: "Posts" },
  { href: "/admin/posts/new", label: "Write" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminBottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 grid grid-cols-4 border-t border-white/10 bg-dark-900/95 text-center text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur">
      {tabs.map((tab) => {
        const active = tab.href === "/admin" ? pathname === "/admin" : pathname.startsWith(tab.href);
        return (
          <Link key={tab.href} href={tab.href} className={`py-3 ${active ? "text-brand-200" : "text-white/70"}`}>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
