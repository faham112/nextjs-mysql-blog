import Link from "next/link";
import { query } from "@/lib/db";
export const dynamic = "force-dynamic";
type CountRow = { n: number };
export default async function AdminHome() {
  let posts = 0, published = 0, pending = 0, categories = 0;
  try {
    const [a, b, c, d] = await Promise.all([
      query<CountRow>("SELECT COUNT(*) AS n FROM posts"),
      query<CountRow>("SELECT COUNT(*) AS n FROM posts WHERE status = 'published'"),
      query<CountRow>("SELECT COUNT(*) AS n FROM comments WHERE approved = 0"),
      query<CountRow>("SELECT COUNT(*) AS n FROM categories"),
    ]);
    posts = a[0]?.n ?? 0; published = b[0]?.n ?? 0; pending = c[0]?.n ?? 0; categories = d[0]?.n ?? 0;
  } catch (e) { console.error(e); }
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="morph-card-red"><p className="text-xs font-bold uppercase tracking-wider text-white/70">All articles</p><p className="mt-3 font-heading text-4xl font-extrabold">{posts}</p></div>
        <div className="morph-card-red"><p className="text-xs font-bold uppercase tracking-wider text-white/70">Published</p><p className="mt-3 font-heading text-4xl font-extrabold">{published}</p></div>
        <div className="morph-card"><p className="text-xs font-bold uppercase tracking-wider text-white/60">Pending comments</p><p className="mt-3 font-heading text-4xl font-extrabold">{pending}</p></div>
        <div className="morph-card"><p className="text-xs font-bold uppercase tracking-wider text-white/60">Categories</p><p className="mt-3 font-heading text-4xl font-extrabold">{categories}</p></div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/admin/posts/new" className="morph-card-red block"><p className="font-heading text-xl font-bold">Write</p><p className="mt-2 text-sm text-white/80">Open the editor and publish a new guide.</p></Link>
        <Link href="/admin/posts" className="morph-card block"><p className="font-heading text-xl font-bold">Manage</p><p className="mt-2 text-sm text-white/70">Edit drafts, live posts, and categories.</p></Link>
        <Link href="/admin/settings" className="morph-card block"><p className="font-heading text-xl font-bold">Settings</p><p className="mt-2 text-sm text-white/70">Account, site name, and writer login.</p></Link>
      </div>
    </div>
  );
}
