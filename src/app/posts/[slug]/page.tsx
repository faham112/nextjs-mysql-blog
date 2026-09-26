import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedPostBySlug } from "@/lib/posts";
import { listApprovedComments } from "@/lib/comments";
import CommentForm from "@/components/CommentForm";
import { readingTimeLabel } from "@/lib/readingTime";
import { articleJsonLd } from "@/lib/schema";
import { resolveCover } from "@/lib/covers";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug).catch(() => null);
  if (!post) return { title: "Article" };
  const description = (post.excerpt || post.title).slice(0, 160);
  const cover = resolveCover(post.featured_image, post.category_slug);
  return {
    title: post.title,
    description,
    alternates: { canonical: `/posts/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description,
      images: [{ url: cover }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [cover],
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  const comments = await listApprovedComments(post.id);
  const cover = resolveCover(post.featured_image, post.category_slug);

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(post)) }}
      />
      <nav className="mb-4 text-xs" style={{ color: "var(--muted)" }}>
        <Link href="/">Home</Link> · <Link href="/articles">Articles</Link> ·{" "}
        <span style={{ color: "var(--fg)" }}>{post.title}</span>
      </nav>
      <p className="text-sm uppercase tracking-widest text-brand-600">
        {post.category_name ? (
          <Link href={`/category/${post.category_slug}`}>{post.category_name}</Link>
        ) : (
          "Journal"
        )}
      </p>
      <h1 className="mt-2 font-heading text-4xl font-extrabold leading-tight sm:text-5xl">
        {post.title}
      </h1>
      <p className="mt-4 text-sm" style={{ color: "var(--muted)" }}>
        {post.author_name ? `By ${post.author_name}` : ""}
        {post.published_at
          ? ` · ${new Date(post.published_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}`
          : ""}
        {" · "}
        {readingTimeLabel(`${post.excerpt || ""} ${post.content}`)}
      </p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={cover}
        alt={post.title}
        className="mt-8 max-h-[420px] w-full rounded-2xl object-cover"
        width={1200}
        height={675}
      />
      <div
        className="prose-blog mt-8"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <section className="mt-14 border-t pt-8" style={{ borderColor: "var(--border)" }}>
        <h2 className="font-heading text-2xl font-bold">Comments ({comments.length})</h2>
        <div className="mt-5 space-y-4">
          {comments.map((c) => (
            <div key={c.id} className="card p-4">
              <p className="text-sm font-medium">
                {c.author_name}{" "}
                <span className="font-normal" style={{ color: "var(--muted)" }}>
                  · {new Date(c.created_at).toLocaleDateString()}
                </span>
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm" style={{ color: "var(--fg)" }}>
                {c.content}
              </p>
            </div>
          ))}
        </div>
        <CommentForm postId={post.id} />
      </section>
    </article>
  );
}
