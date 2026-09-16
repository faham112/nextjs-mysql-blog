import { getPool } from "@/lib/db";
import { publishDuePosts } from "@/lib/posts";
const STEPS = [
  `CREATE TABLE IF NOT EXISTS users (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, name VARCHAR(120) NOT NULL, email VARCHAR(190) NOT NULL UNIQUE, password_hash VARCHAR(255) NOT NULL, role ENUM('admin', 'editor') NOT NULL DEFAULT 'editor', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS categories (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, name VARCHAR(120) NOT NULL, slug VARCHAR(160) NOT NULL UNIQUE, description VARCHAR(255) DEFAULT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS posts (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255) NOT NULL, slug VARCHAR(280) NOT NULL UNIQUE, excerpt TEXT, content LONGTEXT NOT NULL, featured_image VARCHAR(500) DEFAULT NULL, category_id INT UNSIGNED DEFAULT NULL, author_id INT UNSIGNED NOT NULL, status ENUM('draft', 'published') NOT NULL DEFAULT 'draft', published_at DATETIME DEFAULT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS comments (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, post_id INT UNSIGNED NOT NULL, author_name VARCHAR(120) NOT NULL, author_email VARCHAR(190) NOT NULL, content TEXT NOT NULL, approved TINYINT(1) NOT NULL DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
];
export async function runSqlUpdates() {
  const pool = getPool();
  const log: string[] = [];
  for (const sql of STEPS) {
    const label = sql.slice(0, 40).replace(/\s+/g, " ");
    try { await pool.query(sql); log.push(`ok: ${label}`); }
    catch (e) { log.push(`skip: ${label}`); }
  }
  await publishDuePosts();
  log.push("ok: publish due scheduled posts");
  return log;
}
export function envReport() {
  const flag = (key: string) => Boolean(process.env[key] && String(process.env[key]).length > 0);
  return [
    { key: "DB_HOST", set: flag("DB_HOST"), value: process.env.DB_HOST || "" },
    { key: "DB_PORT", set: flag("DB_PORT"), value: process.env.DB_PORT || "3306" },
    { key: "DB_USER", set: flag("DB_USER"), value: process.env.DB_USER || "" },
    { key: "DB_NAME", set: flag("DB_NAME"), value: process.env.DB_NAME || "" },
    { key: "DB_PASSWORD", set: flag("DB_PASSWORD"), value: flag("DB_PASSWORD") ? "set" : "missing" },
    { key: "AUTH_SECRET", set: flag("AUTH_SECRET"), value: flag("AUTH_SECRET") ? "set" : "missing" },
    { key: "ADMIN_EMAIL", set: flag("ADMIN_EMAIL"), value: process.env.ADMIN_EMAIL || "" },
    { key: "ADMIN_PASSWORD", set: flag("ADMIN_PASSWORD"), value: flag("ADMIN_PASSWORD") ? "set" : "missing" },
    { key: "NEXT_PUBLIC_SITE_URL", set: flag("NEXT_PUBLIC_SITE_URL"), value: process.env.NEXT_PUBLIC_SITE_URL || "" },
    { key: "CRON_SECRET", set: flag("CRON_SECRET"), value: flag("CRON_SECRET") ? "set" : "optional" },
  ];
}
