import Link from "next/link";
import { query } from "@/lib/db";
import { FileText, Globe, MessageSquareWarning, FolderOpen, PenLine, Settings } from "lucide-react";

export const dynamic = "force-dynamic";
type CountRow = { n: number };
type Recent = { id: number; title: string; slug: string; status: string; updated_at: Date | string };

export default async function AdminHome() {
  let posts = 0;
  let published = 0;
  let pending = 0;
  let categories = 0;
  let recent: Recent[] = [];
  try {
    const [a, b, c, d, r] = await Promise.all([
      query<CountRow>("SELECT COUNT(*) AS n FROM posts"),
      query<CountRow>("SELECT COUNT(*) AS n FROM posts WHERE status = 'published'"),
      query<CountRow>("SELECT COUNT(*) AS n FROM comments WHERE approved = 0"),
      query<CountRow>("SELECT COUNT(*) AS n FROM categories"),
      query<Recent>("SELECT id, title, slug, status, updated_at FROM posts ORDER BY updated_at DESC LIMIT 6"),
    ]);
    posts = a[0]?.n ?? 0;
    published = b[0]?.n ?? 0;
    pending = c[0]?.n ?? 0;
    categories = d[0]?.n ?? 0;
    recent = r;
  } catch (e) {
    console.error(e);
  }

  const stats = [
    { label: "All posts", value: posts, href: "/admin/posts", icon: FileText },
    { label: "Live", value: published, href: "/articles", icon: Globe },
    { label: "Pending comments", value: pending, href: "/admin/posts", icon: MessageSquareWarning },
    { label: "Categories", value: categories, href: "/admin/categories", icon: FolderOpen },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} href={s.href} className="morph-card block hover:border-brand-500/50">
              <div className="flex items-center justify-between text-white/60">
                <p className="text-[11px] font-bold uppercase tracking-wider">{s.label}</p>
                <Icon size={16} />
              </div>
              <p className="mt-3 font-heading text-4xl font-extrabold text-white">{s.value}</p>
            </Link>
          );
        })}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Link href="/admin/posts/new" className="morph-card-red flex items-center gap-4">
          <PenLine size={22} />
          <div>
            <p className="font-heading text-lg font-bold">Write a guide</p>
            <p className="text-sm text-white/80">Open the editor.</p>
          </div>
        </Link>
        <Link href="/admin/settings" className="morph-card flex items-center gap-4">
          <Settings size={22} />
          <div>
            <p className="font-heading text-lg font-bold">Settings</p>
            <p className="text-sm text-white/70">Account and site URL.</p>
          </div>
        </Link>
      </div>
      <div className="morph-card">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-bold uppercase tracking-wider text-white/60">Recent posts</p>
          <Link href="/admin/posts" className="text-xs font-bold text-brand-400">See all</Link>
        </div>
        {recent.length === 0 ? (
          <p className="text-sm text-white/60">No posts yet. Write the first guide.</p>
        ) : (
          <ul className="divide-y divide-white/10">
            {recent.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{p.title}</p>
                  <p className="text-[11px] uppercase tracking-wider text-white/45">{p.status}</p>
                </div>
                <Link href={`/admin/posts/${p.id}/edit`} className="shrink-0 text-xs font-bold text-brand-400">Edit</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
