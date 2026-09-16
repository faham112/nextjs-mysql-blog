"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, PenLine, Settings } from "lucide-react";
const tabs = [
  { href: "/admin", label: "Home", icon: LayoutDashboard, exact: true },
  { href: "/admin/posts", label: "Posts", icon: FileText },
  { href: "/admin/posts/new", label: "Write", icon: PenLine },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];
export default function AdminBottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-dark-900/95 backdrop-blur lg:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-4">
        {tabs.map((tab) => {
          const active = tab.exact ? pathname === tab.href : pathname === tab.href || pathname.startsWith(tab.href + "/");
          const Icon = tab.icon;
          return (
            <Link key={tab.href} href={tab.href} className={`flex flex-col items-center gap-1 py-3 text-[10px] font-bold uppercase tracking-wider ${active ? "text-brand-500" : "text-white/55"}`}>
              <Icon size={20} strokeWidth={2.2} />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
