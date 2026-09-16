"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, PenLine, Folder, Settings, Wrench, ExternalLink } from "lucide-react";
const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/posts", label: "All posts", icon: FileText },
  { href: "/admin/posts/new", label: "Write", icon: PenLine },
  { href: "/admin/categories", label: "Categories", icon: Folder },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/tools", label: "Tools", icon: Wrench },
];
export default function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="grid gap-1">
      {links.map((item) => {
        const active = item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + "/");
        const Icon = item.icon;
        return (
          <Link key={item.href} href={item.href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${active ? "bg-brand-600 text-white" : "opacity-70 hover:opacity-100"}`}>
            <Icon size={18} />{item.label}
          </Link>
        );
      })}
      <Link href="/" className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold opacity-50"><ExternalLink size={18} />View site</Link>
    </nav>
  );
}
