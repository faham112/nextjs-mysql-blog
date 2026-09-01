import { query } from "@/lib/db";
export const dynamic = "force-dynamic";
type CountRow = { n: number };
export default async function AdminHome() {
  let posts = 0, published = 0, pending = 0;
  try {
    const [a, b, c] = await Promise.all([
      query<CountRow>("SELECT COUNT(*) AS n FROM posts"),
      query<CountRow>("SELECT COUNT(*) AS n FROM posts WHERE status = 'published'"),
      query<CountRow>("SELECT COUNT(*) AS n FROM comments WHERE approved = 0"),
    ]);
    posts = a[0]?.n ?? 0; published = b[0]?.n ?? 0; pending = c[0]?.n ?? 0;
  } catch (e) { console.error(e); }
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      <div className="card space-y-2 p-6"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">All posts</p><p className="font-heading text-3xl font-extrabold">{posts}</p></div>
      <div className="card space-y-2 p-6"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Published</p><p className="font-heading text-3xl font-extrabold text-brand-600">{published}</p></div>
      <div className="card space-y-2 p-6"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Pending comments</p><p className="font-heading text-3xl font-extrabold">{pending}</p></div>
    </div>
  );
}
