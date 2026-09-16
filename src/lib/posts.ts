import { query } from "./db";
export type PostRow = {
  id: number; title: string; slug: string; excerpt: string | null; content: string;
  featured_image: string | null; category_id: number | null; author_id: number;
  status: "draft" | "published"; published_at: Date | string | null;
  created_at: Date | string; updated_at: Date | string;
  category_name?: string | null; category_slug?: string | null; author_name?: string | null; comment_count?: number;
};
const SELECT = `
  SELECT p.*, c.name AS category_name, c.slug AS category_slug, u.name AS author_name,
    (SELECT COUNT(*) FROM comments cm WHERE cm.post_id = p.id AND cm.approved = 1) AS comment_count
  FROM posts p
  LEFT JOIN categories c ON c.id = p.category_id
  LEFT JOIN users u ON u.id = p.author_id
`;
export async function listPublishedPosts(page = 1, perPage = 8, categorySlug?: string) {
  const offset = (page - 1) * perPage;
  const safeLimit = Math.max(1, Number(perPage) || 8);
  const safeOffset = Math.max(0, Number(offset) || 0);
  const where = categorySlug ? "WHERE p.status = 'published' AND c.slug = ?" : "WHERE p.status = 'published'";
  const params = categorySlug ? [categorySlug] : [];
  const rows = await query<PostRow>(`${SELECT} ${where} ORDER BY p.published_at DESC LIMIT ${safeLimit} OFFSET ${safeOffset}`, params);
  const countRows = await query<{ total: number }>(`SELECT COUNT(*) AS total FROM posts p LEFT JOIN categories c ON c.id = p.category_id ${where}`, params);
  return { posts: rows, total: countRows[0]?.total ?? 0, page, perPage };
}
export async function getPublishedPostBySlug(slug: string) {
  const rows = await query<PostRow>(`${SELECT} WHERE p.slug = ? AND p.status = 'published' LIMIT 1`, [slug]);
  return rows[0] ?? null;
}
export async function getPostById(id: number) {
  const rows = await query<PostRow>(`${SELECT} WHERE p.id = ? LIMIT 1`, [id]);
  return rows[0] ?? null;
}
export async function listAllPosts() {
  return query<PostRow>(`${SELECT} ORDER BY p.updated_at DESC`);
}
export async function searchPosts(q: string) {
  const like = `%${q}%`;
  return query<PostRow>(`${SELECT} WHERE p.status = 'published' AND (p.title LIKE ? OR p.excerpt LIKE ? OR p.content LIKE ?) ORDER BY p.published_at DESC LIMIT 24`, [like, like, like]);
}
export function toSlug(input: string) {
  return input.toLowerCase().trim().replace(/['"]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 260);
}
