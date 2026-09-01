"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/posts", label: "Articles" },
  { href: "/admin/posts/new", label: "New article" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/settings", label: "Settings" },
];
export default function AdminNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(href + "/");
  }
  return (
    <div>
      <button type="button" className="mb-3 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-bold lg:hidden" onClick={() => setOpen((v) => !v)}>
        {open ? "Close menu" : "Open menu"}
      </button>
      <nav className={`${open ? "grid" : "hidden"} gap-1 lg:grid`}>
        {links.map((item) => (
          <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={`admin-link ${isActive(item.href) ? "admin-link-active" : ""}`}>{item.label}</Link>
        ))}
        <Link href="/" className="admin-link" onClick={() => setOpen(false)}>View site</Link>
        <form action="/api/auth/logout" method="post">
          <button className="admin-link w-full text-left text-white/60" type="submit">Log out</button>
        </form>
      </nav>
    </div>
  );
}
