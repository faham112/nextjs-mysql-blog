import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedPostBySlug } from "@/lib/posts";
import { listApprovedComments } from "@/lib/comments";
import CommentForm from "@/components/CommentForm";
import { readingTimeLabel } from "@/lib/readingTime";

export const revalidate = 60;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://globalcareerhub.org";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug).catch(() => null);
  if (!post) return { title: "Article" };

  const description = (post.excerpt || post.title).slice(0, 160);
  const image = post.featured_image || "/logo.svg";

  return {
    title: post.title,
    description,
    alternates: { canonical: `/posts/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description,
      url: `${siteUrl}/posts/${post.slug}`,
      siteName: "GlobalCareerHub",
      publishedTime: post.published_at
        ? new Date(post.published_at).toISOString()
        : undefined,
      authors: post.author_name ? [post.author_name] : ["Faham Baloch"],
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [image],
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || post.title,
    datePublished: post.published_at
      ? new Date(post.published_at).toISOString()
      : undefined,
    dateModified: post.updated_at
      ? new Date(post.updated_at).toISOString()
      : undefined,
    author: {
      "@type": "Person",
      name: post.author_name || "Faham Baloch",
      url: `${siteUrl}/about`,
    },
    image: post.featured_image || undefined,
    mainEntityOfPage: `${siteUrl}/posts/${post.slug}`,
    publisher: {
      "@type": "Organization",
      name: "GlobalCareerHub",
      url: siteUrl,
    },
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="mb-4 text-xs" style={{ color: "var(--muted)" }}>
        <Link href="/">Home</Link> · <Link href="/articles">Articles</Link> ·{" "}
        <span style={{ color: "var(--fg)" }}>{post.title}</span>
      </nav>
      <p className="text-sm uppercase tracking-widest text-brand-500">
        {post.category_name || "Journal"}
      </p>
      <h1 className="mt-2 font-heading text-4xl leading-tight sm:text-5xl">
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
      {post.featured_image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.featured_image}
          alt=""
          className="mt-8 max-h-[420px] w-full rounded-2xl object-cover"
        />
      ) : null}
      <div
        className="prose-blog mt-8"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      <section className="mt-14 border-t pt-8" style={{ borderColor: "var(--border)" }}>
        <h2 className="font-heading text-2xl">Comments ({comments.length})</h2>
        <div className="mt-5 space-y-4">
          {comments.map((c) => (
            <div key={c.id} className="card p-4">
              <p className="text-sm font-medium">
                {c.author_name}{" "}
                <span className="font-normal" style={{ color: "var(--muted)" }}>
                  · {new Date(c.created_at).toLocaleDateString()}
                </span>
              </p>
              <p
                className="mt-2 whitespace-pre-wrap text-sm"
                style={{ color: "var(--fg)" }}
              >
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
