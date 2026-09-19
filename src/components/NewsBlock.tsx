import Link from "next/link";
import type { PostRow } from "@/lib/posts";
import PostFeatured from "@/components/PostFeatured";
import PostRowCompact from "@/components/PostRowCompact";

type Props = {
  title: string;
  href?: string;
  posts: PostRow[];
};

/** 1 main featured post + up to 3 compact rows underneath (news-style). */
export default function NewsBlock({ title, href, posts }: Props) {
  if (!posts.length) return null;

  const [main, ...rest] = posts;
  const side = rest.slice(0, 3);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div
        className="mb-6 flex items-center justify-between border-b pb-3"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-3">
          <span className="h-0.5 w-8 bg-brand-600" />
          <h2 className="font-heading text-xl font-extrabold sm:text-2xl">
            {title}
          </h2>
          <span className="h-0.5 w-8 bg-brand-600" />
        </div>
        {href ? (
          <Link
            href={href}
            className="text-xs font-bold uppercase tracking-wider text-brand-600 hover:underline"
          >
            View all
          </Link>
        ) : null}
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <PostFeatured post={main} />
        </div>
        <div className="lg:col-span-2">
          {side.length > 0 ? (
            <div className="flex flex-col">
              {side.map((p) => (
                <PostRowCompact key={p.id} post={p} />
              ))}
            </div>
          ) : (
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              More guides coming soon.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
