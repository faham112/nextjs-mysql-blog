"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { ADMIN_NAV, isActive } from "@/components/admin/nav";

/** Desktop sidebar (md and up). Mobile uses AdminBottomNav instead. */
export default function AdminNav() {
  const pathname = usePathname() || "/admin";
  const groups: { id: "content" | "system"; label: string }[] = [
    { id: "content", label: "Content" },
    { id: "system", label: "System" },
  ];
  return (
    <aside
      className="a-surface a-border fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r md:flex"
      aria-label="Admin navigation"
    >
      <Link href="/admin" className="a-border flex h-16 shrink-0 items-center gap-2.5 border-b px-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="" width={32} height={32} className="h-8 w-8 rounded-lg" />
        <span className="min-w-0 leading-tight">
          <span className="a-fg block truncate text-sm font-bold tracking-tight">GlobalCareerHub</span>
          <span className="a-subtle block text-[11px] font-medium">Admin console</span>
        </span>
      </Link>
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        {groups.map((g) => (
          <div key={g.id} className="mb-6">
            <p className="a-eyebrow mb-2 px-3">{g.label}</p>
            <ul className="space-y-0.5">
              {ADMIN_NAV.filter((i) => i.group === g.id).map((item) => {
                const active = isActive(pathname, item.href);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link href={item.href} className="a-nav-link" aria-current={active ? "page" : undefined}>
                      <Icon size={18} strokeWidth={1.9} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="a-border border-t p-3">
        <Link href="/" className="a-nav-link">
          <ExternalLink size={18} strokeWidth={1.9} />
          View site
        </Link>
      </div>
    </aside>
  );
}
