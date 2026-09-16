"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, PenLine, Folder, Settings, ExternalLink } from "lucide-react";
const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/posts", label: "All posts", icon: FileText },
  { href: "/admin/posts/new", label: "Write", icon: PenLine },
  { href: "/admin/categories", label: "Categories", icon: Folder },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];
export default function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="grid gap-1">
      {links.map((item) => {
        const active = item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + "/");
        const Icon = item.icon;
        return (
          <Link key={item.href} href={item.href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${active ? "bg-brand-600 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>
            <Icon size={18} />
            {item.label}
          </Link>
        );
      })}
      <Link href="/" className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/50 hover:bg-white/10 hover:text-white">
        <ExternalLink size={18} /> View site
      </Link>
    </nav>
  );
}
