"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { FolderTree, Plus, Trash2 } from "lucide-react";
import type { Category } from "@/lib/categories";

export default function CategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setBusy(true);
    try {
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      form.reset();
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: number) {
    if (!confirm("Delete this category?")) return;
    await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[340px_minmax(0,1fr)] lg:items-start lg:gap-6">
      <form onSubmit={onSubmit} className="a-card lg:sticky lg:top-24">
        <div className="a-card-head">
          <h3 className="a-h2">Add category</h3>
        </div>
        <div className="a-card-body space-y-4">
          <div>
            <label htmlFor="cat-name" className="a-label">
              Name
            </label>
            <input id="cat-name" name="name" required placeholder="e.g. Scholarships" className="input" />
          </div>
          <div>
            <label htmlFor="cat-desc" className="a-label">
              Description <span className="a-subtle font-normal">(optional)</span>
            </label>
            <input id="cat-desc" name="description" placeholder="Short description" className="input" />
            <p className="a-help">The URL slug is generated from the name.</p>
          </div>
          <button className="btn w-full" type="submit" disabled={busy}>
            <Plus size={16} strokeWidth={2.4} />
            {busy ? "Creating..." : "Create"}
          </button>
        </div>
      </form>

      <section className="a-card overflow-hidden">
        <div className="a-card-head">
          <h3 className="a-h2">All categories</h3>
          <span className="a-muted text-xs tabular-nums">{categories.length}</span>
        </div>
        {categories.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-12 text-center">
            <span className="a-tile a-tile-slate mb-3">
              <FolderTree size={18} />
            </span>
            <p className="a-fg text-sm font-semibold">No categories yet</p>
            <p className="a-muted mt-1 text-sm">Create one with the form.</p>
          </div>
        ) : (
          <ul className="a-divide">
            {categories.map((c) => (
              <li key={c.id} className="a-hoverable flex min-h-[64px] items-center gap-3 px-4 py-3 sm:px-5">
                <span className="a-tile a-tile-rose shrink-0 max-sm:!hidden">
                  <FolderTree size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="a-fg truncate text-sm font-medium">{c.name}</p>
                  <p className="a-muted truncate text-xs">
                    /{c.slug}
                    {c.description ? <span className="a-subtle"> · {c.description}</span> : null}
                  </p>
                </div>
                {typeof c.post_count !== "undefined" ? (
                  <span className="a-badge a-badge-draft shrink-0 before:!hidden max-sm:!hidden" title="Live posts">
                    {Number(c.post_count)} live
                  </span>
                ) : null}
                <button
                  onClick={() => remove(c.id)}
                  className="a-icon-btn shrink-0 hover:!text-red-600"
                  aria-label={`Delete category ${c.name}`}
                  title="Delete"
                >
                  <Trash2 size={17} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
