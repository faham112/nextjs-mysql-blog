import Link from "next/link";
import { query } from "@/lib/db";
import { PenLine } from "lucide-react";

export const dynamic = "force-dynamic";

type CountRow = { n: number };
type Row = {
  id: number;
  title: string;
  slug: string;
  status: string;
  updated_at: Date | string;
  category_name: string | null;
};

function when(d: Date | string) {
  try {
    return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  } catch {
    return "";
  }
}

export default async function AdminHome() {
  let posts = 0;
  let published = 0;
  let drafts = 0;
  let pending = 0;
  let rows: Row[] = [];
  try {
    const [a, b, c, d, r] = await Promise.all([
      query<CountRow>("SELECT COUNT(*) AS n FROM posts"),
      query<CountRow>("SELECT COUNT(*) AS n FROM posts WHERE status = 'published'"),
      query<CountRow>("SELECT COUNT(*) AS n FROM posts WHERE status = 'draft'"),
      query<CountRow>("SELECT COUNT(*) AS n FROM comments WHERE approved = 0"),
      query<Row>(
        `SELECT p.id, p.title, p.slug, p.status, p.updated_at, c.name AS category_name
         FROM posts p LEFT JOIN categories c ON c.id = p.category_id
         ORDER BY p.updated_at DESC LIMIT 20`
      ),
    ]);
    posts = a[0]?.n ?? 0;
    published = b[0]?.n ?? 0;
    drafts = c[0]?.n ?? 0;
    pending = d[0]?.n ?? 0;
    rows = r;
  } catch (e) {
    console.error(e);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">Overview</p>
          <p className="mt-1 text-sm text-white/80">
            {pending > 0 ? (
              <span className="text-amber-300">{pending} comment{pending === 1 ? "" : "s"} waiting</span>
            ) : (
              <span>Queue clear.</span>
            )}
            <span className="text-white/35"> · </span>
            {published} live · {drafts} draft · {posts} total
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-semibold text-white"
        >
          <PenLine size={16} />
          Write
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="text-[11px] uppercase tracking-wider text-white/40">
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="hidden px-4 py-3 font-medium sm:table-cell">Status</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Section</th>
              <th className="hidden px-4 py-3 font-medium lg:table-cell">Updated</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03]">
                <td className="max-w-[220px] truncate px-4 py-3 font-medium text-white">{p.title}</td>
                <td className="hidden px-4 py-3 sm:table-cell">
                  <span
                    className={
                      p.status === "published"
                        ? "rounded-md bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-300"
                        : "rounded-md bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-white/60"
                    }
                  >
                    {p.status}
                  </span>
                </td>
                <td className="hidden px-4 py-3 text-white/50 md:table-cell">{p.category_name || "—"}</td>
                <td className="hidden px-4 py-3 text-white/40 lg:table-cell">{when(p.updated_at)}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/posts/${p.id}/edit`} className="text-xs font-semibold text-brand-400 hover:text-white">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className="px-4 py-10 text-white/50" colSpan={5}>
                  No posts yet.{" "}
                  <Link href="/admin/posts/new" className="font-semibold text-brand-400">
                    Write the first
                  </Link>
                  .
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
