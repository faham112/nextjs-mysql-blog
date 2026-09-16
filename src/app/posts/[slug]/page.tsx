import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedPostBySlug } from "@/lib/posts";
import { query } from "@/lib/db";
import CommentForm from "@/components/CommentForm";
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug).catch(() => null);
  if (!post) return { title: "Article" };
  const description = (post.excerpt || post.title).slice(0, 160);
  return {
    title: post.title,
    description,
    alternates: { canonical: `/posts/${post.slug}` },
    openGraph: { type: "article", title: post.title, description, images: post.featured_image ? [{ url: post.featured_image }] : undefined },
  };
}
export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();
  const comments = await query<{ id: number; author_name: string; content: string; created_at: Date | string }>("SELECT id, author_name, content, created_at FROM comments WHERE post_id = ? AND approved = 1 ORDER BY created_at ASC", [post.id]);
  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <nav className="mb-4 text-xs text-slate-500"><Link href="/">Home</Link> · <Link href="/articles">Articles</Link> · <span className="text-slate-800">{post.title}</span></nav>
      <p className="text-sm uppercase tracking-widest text-accent">{post.category_name ? <Link href={`/category/${post.category_slug}`}>{post.category_name}</Link> : "Journal"}</p>
      <h1 className="mt-2 font-heading text-4xl leading-tight sm:text-5xl">{post.title}</h1>
      <p className="mt-4 text-sm text-slate-500">{post.author_name} · {post.published_at ? new Date(post.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : ""}</p>
      {post.featured_image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.featured_image} alt={post.title} className="mt-8 max-h-[420px] w-full rounded-2xl object-cover" />
      )}
      <div className="prose-blog mt-8" dangerouslySetInnerHTML={{ __html: post.content }} />
      <section className="mt-14 border-t border-slate-200 pt-8">
        <h2 className="font-heading text-2xl">Comments ({comments.length})</h2>
        <div className="mt-5 space-y-4">
          {comments.map((c) => (
            <div key={c.id} className="card p-4">
              <p className="text-sm font-medium">{c.author_name} <span className="font-normal text-slate-400">· {new Date(c.created_at).toLocaleDateString()}</span></p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{c.content}</p>
            </div>
          ))}
        </div>
        <CommentForm postId={post.id} />
      </section>
    </article>
  );
}
