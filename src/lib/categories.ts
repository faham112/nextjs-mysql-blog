import { query } from "./db";

export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  post_count?: number;
};

export async function listCategories() {
  return query<Category>(
    `SELECT c.*, COUNT(p.id) AS post_count
     FROM categories c
     LEFT JOIN posts p ON p.category_id = c.id AND p.status = 'published'
     GROUP BY c.id
     ORDER BY c.name ASC`
  );
}

export async function getCategoryBySlug(slug: string) {
  const rows = await query<Category>("SELECT * FROM categories WHERE slug = :slug LIMIT 1", {
    slug,
  });
  return rows[0] ?? null;
}
