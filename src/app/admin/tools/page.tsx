"use client";
import { useState } from "react";
export default function AdminToolsPage() {
  const [log, setLog] = useState<string[]>([]);
  const [busy, setBusy] = useState("");
  async function run(action: "migrate" | "publish" | "seed") {
    setBusy(action);
    const res = await fetch("/api/admin/tools", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }) });
    const data = await res.json().catch(() => ({}));
    setLog(data.log || [data.error || "Done"]);
    setBusy("");
  }
  return (
    <div className="space-y-5">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-200">Control</p>
        <h2 className="font-heading text-3xl font-extrabold">Tools</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <button className="btn" disabled={!!busy} onClick={() => run("migrate")}>{busy === "migrate" ? "Running..." : "Run SQL updates"}</button>
        <button className="btn-outline" disabled={!!busy} onClick={() => run("publish")}>{busy === "publish" ? "Publishing..." : "Publish due posts now"}</button>
        <button className="btn-outline sm:col-span-2" disabled={!!busy} onClick={() => run("seed")}>{busy === "seed" ? "Adding..." : "Add 12 SEO drafts (pending)"}</button>
      </div>
      {log.length > 0 && <pre className="card overflow-auto p-4 text-xs leading-6">{log.join("\n")}</pre>}
    </div>
  );
}
