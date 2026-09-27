import {
  LayoutDashboard,
  FileText,
  PenSquare,
  FolderTree,
  Settings,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export type AdminNavItem = {
  href: string;
  label: string;
  title: string;
  icon: LucideIcon;
  group: "content" | "system";
};

export const ADMIN_NAV: AdminNavItem[] = [
  { href: "/admin", label: "Overview", title: "Overview", icon: LayoutDashboard, group: "content" },
  { href: "/admin/posts", label: "All posts", title: "Posts", icon: FileText, group: "content" },
  { href: "/admin/posts/new", label: "Write", title: "New article", icon: PenSquare, group: "content" },
  { href: "/admin/categories", label: "Categories", title: "Categories", icon: FolderTree, group: "content" },
  { href: "/admin/settings", label: "Settings", title: "Settings", icon: Settings, group: "system" },
  { href: "/admin/tools", label: "Tools", title: "Tools", icon: Wrench, group: "system" },
];

/** Exact-ish matching so "All posts" isn't lit up while writing a new post. */
export function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  if (href === "/admin/posts") {
    return pathname === "/admin/posts" || (pathname.startsWith("/admin/posts/") && !pathname.startsWith("/admin/posts/new"));
  }
  return pathname === href || pathname.startsWith(href + "/");
}

export function pageTitle(pathname: string) {
  if (/^\/admin\/posts\/[^/]+\/edit/.test(pathname)) return "Edit article";
  const hit = ADMIN_NAV.find((i) => isActive(pathname, i.href));
  return hit?.title ?? "Admin";
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] || "A") + (parts[1]?.[0] || "")).toUpperCase();
}
