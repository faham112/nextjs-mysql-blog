import Link from "next/link";
import { ArrowRight, CalendarClock, CircleCheck, FilePen, Files, MessageSquare, Plus } from "lucide-react";
import { query } from "@/lib/db";
import { getSession } from "@/lib/auth";
import PageHeader from "@/components/admin/PageHeader";
import PostsTable from "@/components/admin/PostsTable";
import { toAdminRows } from "@/components/admin/rows";

export const dynamic = "force-dynamic";

type Row = {
  id: number;
  title: string;
  slug: string;
  status: string;
  updated_at: Date | string;
  published_at: Date | string | null;
  category_name: string | null;
};
type Counts = { total: number | string | null; live: number | string | null; drafts: number | string | null; scheduled: number | string | null };

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone,
  href,
  highlight,
}: {
  label: string;
  value: number;
  hint: string;
  icon: typeof Files;
  tone: string;
  href?: string;
  highlight?: boolean;
}) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="a-muted text-[13px] font-medium">{label}</p>
        <span className={`a-tile a-tile-${tone}`}>
          <Icon size={18} strokeWidth={2} />
        </span>
      </div>
      <p className="a-fg mt-2 text-[28px] font-bold leading-none tracking-tight tabular-nums">{value.toLocaleString("en-US")}</p>
      <p className={`mt-2 text-xs ${highlight ? "font-medium text-amber-600 dark:text-amber-300" : "a-subtle"}`}>{hint}</p>
    </>
  );
  const cls = "a-card block p-4 sm:p-5";
  return href ? (
    <Link href={href} className={`${cls} a-focus transition hover:-translate-y-px hover:shadow-md`} style={{ borderColor: highlight ? "rgba(245,158,11,.45)" : undefined }}>
      {body}
    </Link>
  ) : (
    <div className={cls} style={{ borderColor: highlight ? "rgba(245,158,11,.45)" : undefined }}>
      {body}
    </div>
  );
}

export default async function AdminHome() {
  let posts = 0;
  let published = 0;
  let drafts = 0;
  let scheduled = 0;
  let pending = 0;
  let rows: Row[] = [];
  const user = await getSession().catch(() => null);
  try {
    const [c, d, r] = await Promise.all([
      query<Counts>(
        `SELECT COUNT(*) AS total,
                SUM(status = 'published') AS live,
                SUM(status = 'draft' AND (published_at IS NULL OR published_at <= NOW())) AS drafts,
                SUM(status = 'draft' AND published_at > NOW()) AS scheduled
         FROM posts`
      ),
      query<{ n: number }>("SELECT COUNT(*) AS n FROM comments WHERE approved = 0"),
      query<Row>(
        `SELECT p.id, p.title, p.slug, p.status, p.updated_at, p.published_at, c.name AS category_name
         FROM posts p LEFT JOIN categories c ON c.id = p.category_id
         ORDER BY p.updated_at DESC LIMIT 20`
      ),
    ]);
    posts = Number(c[0]?.total ?? 0);
    published = Number(c[0]?.live ?? 0);
    drafts = Number(c[0]?.drafts ?? 0);
    scheduled = Number(c[0]?.scheduled ?? 0);
    pending = Number(d[0]?.n ?? 0);
    rows = r;
  } catch (e) {
    console.error(e);
  }

  const first = (user?.name || "").trim().split(/\s+/)[0];
  const livePct = posts > 0 ? Math.round((published / posts) * 100) : 0;

  return (
    <div>
      <PageHeader
        title={first ? `Welcome back, ${first}` : "Overview"}
        description={
          pending > 0 ? (
            <>
              <span className="font-medium text-amber-600 dark:text-amber-300">
                {pending} comment{pending === 1 ? "" : "s"} waiting
              </span>{" "}
              · {published} live · {drafts + scheduled} draft · {posts} total
            </>
          ) : (
            <>
              Queue clear · {published} live · {drafts + scheduled} draft · {posts} total
            </>
          )
        }
        actions={
          <Link href="/admin/posts/new" className="btn max-sm:!hidden">
            <Plus size={16} strokeWidth={2.4} /> New article
          </Link>
        }
      />

      <section aria-label="Stats" className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
        <div className="col-span-2 lg:col-span-1">
          <StatCard label="Total posts" value={posts} hint="All articles" icon={Files} tone="slate" href="/admin/posts" />
        </div>
        <StatCard label="Live" value={published} hint={`${livePct}% of total`} icon={CircleCheck} tone="green" href="/admin/posts?status=published" />
        <StatCard label="Drafts" value={drafts} hint="Not scheduled" icon={FilePen} tone="gray" href="/admin/posts?status=draft" />
        <StatCard label="Scheduled" value={scheduled} hint="Auto-publishing" icon={CalendarClock} tone="blue" href="/admin/posts?status=scheduled" />
        <StatCard
          label="Comments waiting"
          value={pending}
          hint={pending > 0 ? "Needs review" : "All caught up"}
          icon={MessageSquare}
          tone={pending > 0 ? "amber" : "rose"}
          highlight={pending > 0}
        />
      </section>

      <PostsTable
        rows={toAdminRows(rows)}
        title="Recently updated"
        footer={
          <Link href="/admin/posts" className="a-accent-text inline-flex min-h-[32px] items-center gap-1 font-semibold hover:underline">
            View all posts <ArrowRight size={14} />
          </Link>
        }
      />
    </div>
  );
}
