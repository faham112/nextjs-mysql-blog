import { notFound } from "next/navigation";
import Link from "next/link";
import { getPublishedPostBySlug } from "@/lib/posts";
import { query } from "@/lib/db";
import CommentForm from "@/components/CommentForm";

export const dynamic = "force-dynamic";

type CommentRow = {
  id: number;
  author_name: string;
  content: string;
  created_at: Date | string;
};

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  const comments = await query<CommentRow>(
    "SELECT id, author_name, content, created_at FROM comments WHERE post_id = :id AND approved = 1 ORDER BY created_at ASC",
    { id: post.id }
  );

  return (
    <article className="mx-auto max-w-3xl">
      <p className="text-sm uppercase tracking-widest text-accent">
        {post.category_name ? (
          <Link href={`/category/${post.category_slug}`}>{post.category_name}</Link>
        ) : (
          "Journal"
        )}
      </p>
      <h1 className="mt-2 font-serif text-4xl leading-tight sm:text-5xl">{post.title}</h1>
      <p className="mt-4 text-sm text-slate-500">{post.author_name}</p>
      {post.featured_image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.featured_image} alt="" className="mt-8 max-h-[420px] w-full rounded-2xl object-cover" />
      ) : null}
      <div className="prose-blog mt-8" dangerouslySetInnerHTML={{ __html: post.content }} />
      <section className="mt-14 border-t border-ink/10 pt-8">
        <h2 className="font-serif text-2xl">Comments ({comments.length})</h2>
        <div className="mt-5 space-y-4">
          {comments.map((c) => (
            <div key={c.id} className="card p-4">
              <p className="text-sm font-medium">{c.author_name}</p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{c.content}</p>
            </div>
          ))}
        </div>
        <CommentForm postId={post.id} />
      </section>
    </article>
  );
}
