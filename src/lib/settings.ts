import { getPool, query } from "@/lib/db";
export type TrackerItem = { id: string; name: string; placement: "header" | "body" | "footer"; code: string };
async function ensureTable() {
  await getPool().query(`CREATE TABLE IF NOT EXISTS site_settings (k VARCHAR(80) PRIMARY KEY, v MEDIUMTEXT) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
}
export async function getTrackers(): Promise<TrackerItem[]> {
  try {
    await ensureTable();
    const rows = await query<{ k: string; v: string }>("SELECT k, v FROM site_settings WHERE k IN ('trackers','script_header','script_body','script_footer')");
    const map = Object.fromEntries(rows.map((r) => [r.k, r.v || ""]));
    if (map.trackers) {
      try {
        const parsed = JSON.parse(map.trackers) as TrackerItem[];
        if (Array.isArray(parsed)) return parsed.filter((t) => t && t.code);
      } catch {}
    }
    const legacy: TrackerItem[] = [];
    if (map.script_header?.trim()) legacy.push({ id: "legacy-header", name: "Header script", placement: "header", code: map.script_header });
    if (map.script_body?.trim()) legacy.push({ id: "legacy-body", name: "Body script", placement: "body", code: map.script_body });
    if (map.script_footer?.trim()) legacy.push({ id: "legacy-footer", name: "Footer script", placement: "footer", code: map.script_footer });
    return legacy;
  } catch {
    return [];
  }
}
export async function saveTrackers(items: TrackerItem[]) {
  await ensureTable();
  await query("INSERT INTO site_settings (k, v) VALUES (?, ?) ON DUPLICATE KEY UPDATE v = VALUES(v)", ["trackers", JSON.stringify(items)]);
}
export async function getScripts() {
  const items = await getTrackers();
  return {
    header: items.filter((t) => t.placement === "header").map((t) => t.code).join("\n"),
    body: items.filter((t) => t.placement === "body").map((t) => t.code).join("\n"),
    footer: items.filter((t) => t.placement === "footer").map((t) => t.code).join("\n"),
  };
}
