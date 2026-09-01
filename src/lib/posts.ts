import { query } from "./db";

const SELECT = `
  SELECT p.*, c.name AS category_name, c.slug AS category_slug, u.name AS author_name,
    (SELECT COUNT(*) FROM comments cm WHERE cm.post_id = p.id AND cm.approved = 1) AS comment_count
  FROM posts p
  LEFT JOIN categories c ON c.id = p.category_id
  LEFT JOIN users u ON u.id = p.author_id
`;

export async function listPublishedPosts(page = 1, perPage = 8, categorySlug) {
  const offset = (page - 1) * perPage;
  const where = categorySlug
    ? "WHERE p.status = 'published' AND c.slug = :categorySlug"
    : "WHERE p.status = 'published'";
  const rows = await query(`${SELECT} ${where} ORDER BY p.published_at DESC LIMIT :limit OFFSET :offset`, {
    categorySlug, limit: perPage, offset,
  });
  const countRows = await query(`SELECT COUNT(*) AS total FROM posts p LEFT JOIN categories c ON c.id = p.category_id ${where}`, { categorySlug });
  return { posts: rows, total: countRows[0]?.total ?? 0, page, perPage };
}

export async function getPublishedPostBySlug(slug) {
  const rows = await query(`${SELECT} WHERE p.slug = :slug AND p.status = 'published' LIMIT 1`, { slug });
  return rows[0] ?? null;
}

export async function getPostById(id) {
  const rows = await query(`${SELECT} WHERE p.id = :id LIMIT 1`, { id });
  return rows[0] ?? null;
}

export async function listAllPosts() {
  return query(`${SELECT} ORDER BY p.updated_at DESC`);
}

export async function searchPosts(q) {
  return query(
    `${SELECT} WHERE p.status = 'published' AND (p.title LIKE :like OR p.excerpt LIKE :like OR MATCH(p.title, p.excerpt, p.content) AGAINST (:q IN NATURAL LANGUAGE MODE)) ORDER BY p.published_at DESC LIMIT 20`,
    { q, like: `%${q}%` }
  );
}

export function toSlug(input) {
  return input.toLowerCase().trim().replace(/['"]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 260);
}
