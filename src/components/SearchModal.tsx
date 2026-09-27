"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

/** Site search dialog. Loaded on demand (next/dynamic) the first time the search button is used. */
export default function SearchModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    onClose();
    router.push(`/search?q=${encodeURIComponent(term)}`);
  }

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-start justify-center bg-slate-950/70 px-4 pt-20 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl border p-6 shadow-2xl"
        style={{
          background: "var(--bg2)",
          borderColor: "var(--border)",
          color: "var(--fg)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close search"
          className="absolute right-4 top-4 p-1"
          style={{ color: "var(--muted)" }}
          onClick={onClose}
        >
          <X size={22} />
        </button>
        <h3 className="mb-4 font-heading text-lg font-bold">Search GlobalCareerHub</h3>
        <form onSubmit={submitSearch} className="relative">
          <input
            autoFocus
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Type keywords (e.g. Cybersecurity, Scholarship)..."
            className="w-full rounded-xl border px-5 py-3.5 pr-28 text-sm outline-none"
            style={{
              background: "var(--bg)",
              borderColor: "var(--border)",
              color: "var(--fg)",
            }}
          />
          <button
            type="submit"
            className="absolute right-2 top-2 rounded-lg bg-rose-600 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-rose-700"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
}
