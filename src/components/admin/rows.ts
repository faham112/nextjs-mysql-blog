/** Server-side helpers: turn DB rows into plain, pre-formatted rows for the client table. */
export type AdminPostStatus = "published" | "draft" | "scheduled";
export type AdminPostRow = {
  id: number;
  title: string;
  slug: string;
  status: AdminPostStatus;
  category: string | null;
  updated: string;
  updatedTitle: string;
  scheduledFor: string | null;
};

type DbRow = {
  id: number;
  title: string;
  slug: string;
  status: string;
  updated_at: Date | string;
  published_at?: Date | string | null;
  category_name?: string | null;
};

const TZ = "Asia/Karachi";

function fmt(d: Date, opts: Intl.DateTimeFormatOptions) {
  try {
    return d.toLocaleString("en-GB", { timeZone: TZ, ...opts });
  } catch {
    return d.toLocaleString("en-GB", opts);
  }
}

function relative(d: Date, now: number) {
  const s = Math.round((now - d.getTime()) / 1000);
  if (s < 0) return fmt(d, { day: "numeric", month: "short" });
  if (s < 60) return "Just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 7 * 86400) return `${Math.floor(s / 86400)}d ago`;
  const sameYear = fmt(d, { year: "numeric" }) === fmt(new Date(now), { year: "numeric" });
  return fmt(d, sameYear ? { day: "numeric", month: "short" } : { day: "numeric", month: "short", year: "numeric" });
}

export function statusOf(row: { status: string; published_at?: Date | string | null }, now = Date.now()): AdminPostStatus {
  if (row.status === "published") return "published";
  if (row.published_at) {
    const t = new Date(row.published_at).getTime();
    if (!Number.isNaN(t) && t > now) return "scheduled";
  }
  return "draft";
}

export function toAdminRows(rows: DbRow[]): AdminPostRow[] {
  const now = Date.now();
  return rows.map((r) => {
    const updated = new Date(r.updated_at);
    const valid = !Number.isNaN(updated.getTime());
    const status = statusOf(r, now);
    return {
      id: Number(r.id),
      title: String(r.title || "Untitled"),
      slug: String(r.slug || ""),
      status,
      category: r.category_name ?? null,
      updated: valid ? relative(updated, now) : "",
      updatedTitle: valid ? fmt(updated, { dateStyle: "medium", timeStyle: "short" }) + " PKT" : "",
      scheduledFor:
        status === "scheduled" && r.published_at
          ? fmt(new Date(r.published_at), { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
          : null,
    };
  });
}
