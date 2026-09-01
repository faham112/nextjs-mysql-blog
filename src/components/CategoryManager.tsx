"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@/lib/categories";

export default function CategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    form.reset();
    router.refresh();
  }

  async function remove(id: number) {
    if (!confirm("Delete this category?")) return;
    await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={onSubmit} className="card space-y-3 p-5">
        <h2 className="font-serif text-xl">Add category</h2>
        <input name="name" required placeholder="Name" className="input" />
        <input name="description" placeholder="Description" className="input" />
        <button className="btn" type="submit">
          Create
        </button>
      </form>
      <ul className="space-y-2">
        {categories.map((c) => (
          <li key={c.id} className="card flex items-center justify-between p-4 text-sm">
            <div>
              <p className="font-medium">{c.name}</p>
              <p className="text-slate-500">/{c.slug}</p>
            </div>
            <button onClick={() => remove(c.id)} className="text-red-600">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
