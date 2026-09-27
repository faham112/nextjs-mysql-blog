import { query } from "@/lib/db";
import { resolveCover } from "@/lib/covers";

type Row = { id: number; slug: string; featured_image: string | null; category_slug: string | null };

/**
 * Featured-image clean-up for the admin Tools page.
 * Pages already resolve covers at render time (resolveCover), so this is optional:
 * it just makes posts.featured_image match what the site shows, replacing
 * /uploads/* (wiped on every deploy), /api/media/* and raw.githubusercontent
 * links with the permanent /covers/*.svg path. dryRun=true only reports.
 */
export async function fixFeaturedImages(dryRun: boolean): Promise<string[]> {
  const rows = await query<Row>(
    `SELECT p.id, p.slug, p.featured_image, c.slug AS category_slug
       FROM posts p LEFT JOIN categories c ON c.id = p.category_id
      ORDER BY p.id ASC`
  );
  const log: string[] = [];
  let changes = 0;
  for (const r of rows) {
    const current = (r.featured_image || "").trim();
    const target = resolveCover(current, r.category_slug);
    if (current === target) continue;
    changes++;
    log.push(`${dryRun ? "would set" : "set"} #${r.id} ${r.slug}: ${current || "(empty)"} -> ${target}`);
    if (!dryRun) {
      await query("UPDATE posts SET featured_image = ? WHERE id = ?", [target, r.id]);
    }
  }
  log.unshift(
    `${rows.length} posts checked, ${changes} ${dryRun ? "would change (dry run, nothing saved)" : "updated"}`
  );
  return log;
}
