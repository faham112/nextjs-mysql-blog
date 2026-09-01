import Link from "next/link";
import { query } from "@/lib/db";
import { getSession } from "@/lib/auth";
export const dynamic = "force-dynamic";
type CountRow = { n: number };
export default async function AdminHome() {
  const user = await getSession();
  let posts = 0, published = 0, pending = 0;
  try {
    const [postRows, publishedRows, pendingRows] = await Promise.all([
      query<CountRow>("SELECT COUNT(*) AS n FROM posts"),
      query<CountRow>("SELECT COUNT(*) AS n FROM posts WHERE status = 'published'"),
      query<CountRow>("SELECT COUNT(*) AS n FROM comments WHERE approved = 0"),
    ]);
    posts = postRows[0]?.n ?? 0;
    published = publishedRows[0]?.n ?? 0;
    pending = pendingRows[0]?.n ?? 0;
  } catch (error) { console.error(error); }
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-accent">Overview</p>
      <h1 className="mt-2 font-serif text-4xl">Welcome, {user?.name}.</h1>
      <p className="mt-2 text-slate-600">Write and publish from this desk.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="card p-5"><p className="text-sm text-slate-500">All posts</p><p className="mt-2 font-serif text-4xl">{posts}</p></div>
        <div className="card p-5"><p className="text-sm text-slate-500">Published</p><p className="mt-2 font-serif text-4xl">{published}</p></div>
        <div className="card p-5"><p className="text-sm text-slate-500">Pending comments</p><p className="mt-2 font-serif text-4xl">{pending}</p></div>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/admin/posts/new" className="btn">New article</Link>
        <Link href="/admin/posts" className="btn-outline">Manage posts</Link>
        <Link href="/admin/settings" className="btn-outline">Settings</Link>
      </div>
    </div>
  );
}
