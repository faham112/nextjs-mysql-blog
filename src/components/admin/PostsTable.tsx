"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronRight, ExternalLink, FileText, Pencil, Search, X } from "lucide-react";
import StatusBadge from "./StatusBadge";
import type { AdminPostRow, AdminPostStatus } from "./rows";

type Filter = "all" | AdminPostStatus;
const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "published", label: "Live" },
  { id: "draft", label: "Drafts" },
  { id: "scheduled", label: "Scheduled" },
];

export default function PostsTable({
  rows,
  initialStatus = "all",
  syncUrl = false,
  title,
  footer,
}: {
  rows: AdminPostRow[];
  initialStatus?: Filter;
  syncUrl?: boolean;
  title?: string;
  footer?: React.ReactNode;
}) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<Filter>(initialStatus);
  const [cat, setCat] = useState("");

  const categories = useMemo(
    () => Array.from(new Set(rows.map((r) => r.category).filter(Boolean) as string[])).sort(),
    [rows]
  );
  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: rows.length, published: 0, draft: 0, scheduled: 0 };
    rows.forEach((r) => c[r.status]++);
    return c;
  }, [rows]);

  const visible = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter(
      (r) =>
        (status === "all" || r.status === status) &&
        (!cat || r.category === cat) &&
        (!needle || r.title.toLowerCase().includes(needle) || r.slug.toLowerCase().includes(needle))
    );
  }, [rows, q, status, cat]);

  function pick(f: Filter) {
    setStatus(f);
    if (syncUrl && typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (f === "all") url.searchParams.delete("status");
      else url.searchParams.set("status", f);
      window.history.replaceState(null, "", url.pathname + url.search);
    }
  }

  const filtered = q || cat || status !== "all";

  return (
    <div className="a-card overflow-hidden">
      {/* Toolbar */}
      <div className="a-border flex flex-col gap-3 border-b p-3 sm:p-4 lg:flex-row lg:items-center">
        {title ? <h3 className="a-h2 mr-auto hidden lg:block">{title}</h3> : null}
        <div className="-mx-1 overflow-x-auto px-1 lg:order-last">
          <div className="a-seg" role="group" aria-label="Filter by status">
            {FILTERS.map((f) => (
              <button key={f.id} type="button" aria-pressed={status === f.id} onClick={() => pick(f.id)}>
                {f.label}
                <span className="a-count">{counts[f.id]}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2 lg:w-auto">
          <label className="relative block min-w-0 flex-1 lg:w-64">
            <span className="sr-only">Search posts</span>
            <Search size={16} className="a-subtle pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search posts"
              className="input !pl-9 !pr-9"
            />
            {q ? (
              <button
                type="button"
                onClick={() => setQ("")}
                className="a-subtle absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md hover:opacity-80"
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            ) : null}
          </label>
          {categories.length > 1 ? (
            <label className="block w-[8.5rem] shrink-0 sm:w-44">
              <span className="sr-only">Filter by category</span>
              <select value={cat} onChange={(e) => setCat(e.target.value)} className="input">
                <option value="">All sections</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center px-6 py-14 text-center">
          <span className="a-tile a-tile-slate mb-3">
            <FileText size={18} />
          </span>
          <p className="a-fg text-sm font-semibold">{rows.length === 0 ? "No posts yet" : "No posts match these filters"}</p>
          <p className="a-muted mt-1 text-sm">
            {rows.length === 0 ? "Your first article is one click away." : "Try a different search or status."}
          </p>
          <div className="mt-4">
            {rows.length === 0 ? (
              <Link href="/admin/posts/new" className="btn btn-sm">
                Write the first
              </Link>
            ) : (
              <button
                type="button"
                className="btn-outline btn-sm"
                onClick={() => {
                  setQ("");
                  setCat("");
                  pick("all");
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Desktop / tablet table */}
          <div className="hidden md:block">
            <table className="a-table">
              <thead>
                <tr>
                  <th className="w-[46%]">Title</th>
                  <th>Status</th>
                  <th className="hidden lg:table-cell">Section</th>
                  <th>Updated</th>
                  <th className="text-right">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((p) => (
                  <tr key={p.id}>
                    <td className="max-w-0">
                      <Link href={`/admin/posts/${p.id}/edit`} className="a-fg block truncate font-medium hover:underline">
                        {p.title}
                      </Link>
                      <span className="a-subtle block truncate text-xs">/posts/{p.slug}</span>
                    </td>
                    <td>
                      <StatusBadge status={p.status} when={p.scheduledFor} />
                      {p.scheduledFor ? <span className="a-muted mt-1 block text-xs">{p.scheduledFor}</span> : null}
                    </td>
                    <td className="a-muted hidden lg:table-cell">{p.category || "—"}</td>
                    <td className="a-muted whitespace-nowrap" title={p.updatedTitle}>
                      {p.updated}
                    </td>
                    <td className="text-right">
                      <div className="a-row-actions inline-flex items-center gap-1">
                        {p.status === "published" ? (
                          <a
                            href={`/posts/${p.slug}`}
                            target="_blank"
                            rel="noopener"
                            className="a-icon-btn !h-8 !w-8"
                            aria-label={`View “${p.title}” on the site`}
                            title="View live"
                          >
                            <ExternalLink size={15} />
                          </a>
                        ) : null}
                        <Link href={`/admin/posts/${p.id}/edit`} className="btn-outline btn-sm">
                          <Pencil size={14} /> Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="a-divide md:hidden">
            {visible.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/admin/posts/${p.id}/edit`}
                  className="a-hoverable flex min-h-[64px] items-center gap-3 px-4 py-3.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="a-fg line-clamp-2 text-[15px] font-medium leading-snug">{p.title}</p>
                    <div className="a-muted mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                      <StatusBadge status={p.status} when={p.scheduledFor} />
                      {p.category ? <span>{p.category}</span> : null}
                      <span aria-hidden>·</span>
                      <span>{p.scheduledFor ? `Goes live ${p.scheduledFor}` : p.updated}</span>
                    </div>
                  </div>
                  <ChevronRight size={18} className="a-subtle shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="a-border a-surface-2 flex items-center justify-between gap-3 border-t px-4 py-2.5 text-xs">
        <span className="a-muted">
          {filtered ? `${visible.length} of ${rows.length}` : `${rows.length}`} post{rows.length === 1 ? "" : "s"}
        </span>
        {footer}
      </div>
    </div>
  );
}
