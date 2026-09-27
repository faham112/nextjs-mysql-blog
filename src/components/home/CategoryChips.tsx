import Link from "next/link";

type Chip = { name: string; slug: string; post_count?: number | string | null };

/** All categories as a chip row: horizontally scrollable on mobile, wrapped on desktop. */
export default function CategoryChips({ categories }: { categories: Chip[] }) {
  if (categories.length === 0) return null;
  return (
    <nav aria-label="Browse by topic" className="border-b" style={{ borderColor: "var(--border)" }}>
      <div className="mx-auto max-w-[1440px] px-5 py-3 sm:px-8">
        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
          <span className="hidden shrink-0 self-center pr-2 text-[9px] font-bold uppercase tracking-[0.17em] sm:inline" style={{ color: "var(--muted)" }}>
            Topics
          </span>
          {categories.map((c) => {
            const n = Number(c.post_count) || 0;
            return (
              <Link
                key={c.slug}
                href={n > 0 ? `#topic-${c.slug}` : `/category/${c.slug}`}
                className="shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-[11px] font-bold uppercase tracking-[0.1em] transition hover:opacity-80"
                style={{ borderColor: "var(--border)", color: "var(--fg)", background: "var(--bg2)" }}
              >
                {c.name}
                {n > 0 && <span className="ml-1.5 font-semibold" style={{ color: "var(--accent)" }}>{n}</span>}
              </Link>
            );
          })}
          <Link
            href="/articles"
            className="shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.1em] transition hover:opacity-90"
            style={{ background: "var(--fg)", color: "var(--bg)" }}
          >
            All guides →
          </Link>
        </div>
      </div>
    </nav>
  );
}
