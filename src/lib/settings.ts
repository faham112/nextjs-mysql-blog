import { getPool, query } from "@/lib/db";
export type SiteScripts = { header: string; body: string; footer: string };
async function ensureTable() {
  await getPool().query(`CREATE TABLE IF NOT EXISTS site_settings (k VARCHAR(80) PRIMARY KEY, v MEDIUMTEXT) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
}
export async function getScripts(): Promise<SiteScripts> {
  try {
    await ensureTable();
    const rows = await query<{ k: string; v: string }>("SELECT k, v FROM site_settings WHERE k IN ('script_header','script_body','script_footer')");
    const map = Object.fromEntries(rows.map((r) => [r.k, r.v || ""]));
    return { header: map.script_header || "", body: map.script_body || "", footer: map.script_footer || "" };
  } catch {
    return { header: "", body: "", footer: "" };
  }
}
export async function saveScripts(scripts: SiteScripts) {
  await ensureTable();
  for (const [k, v] of [["script_header", scripts.header], ["script_body", scripts.body], ["script_footer", scripts.footer]] as const) {
    await query("INSERT INTO site_settings (k, v) VALUES (?, ?) ON DUPLICATE KEY UPDATE v = VALUES(v)", [k, v]);
  }
}
