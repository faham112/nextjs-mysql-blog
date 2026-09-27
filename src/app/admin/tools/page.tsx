"use client";
import { useState } from "react";
import { Database, ImageOff, Images, Loader2, Send, Sparkles, Terminal, X, type LucideIcon } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";

type Action = "migrate" | "publish" | "seed" | "covers-check" | "covers-fix";

const TOOLS: { action: Action; title: string; desc: string; label: string; busyLabel: string; icon: LucideIcon; tone: string; primary?: boolean }[] = [
  { action: "migrate", title: "Database updates", desc: "Create any missing SQL tables so the app schema is up to date.", label: "Run SQL updates", busyLabel: "Running...", icon: Database, tone: "rose", primary: true },
  { action: "publish", title: "Scheduled posts", desc: "Publish any scheduled posts whose go-live time has passed.", label: "Publish due posts now", busyLabel: "Publishing...", icon: Send, tone: "blue" },
  { action: "covers-check", title: "Check featured images", desc: "Dry run: list posts with broken or temporary cover URLs.", label: "Check featured images (dry run)", busyLabel: "Checking...", icon: Images, tone: "slate" },
  { action: "covers-fix", title: "Fix featured images", desc: "Replace broken/temporary cover URLs with permanent /covers images.", label: "Fix featured images → permanent covers", busyLabel: "Fixing...", icon: ImageOff, tone: "amber" },
  { action: "seed", title: "SEO drafts", desc: "Add 12 SEO article drafts, pending publish at peak hours.", label: "Add 12 SEO drafts (pending)", busyLabel: "Adding...", icon: Sparkles, tone: "green" },
];

export default function AdminToolsPage() {
  const [log, setLog] = useState<string[]>([]);
  const [busy, setBusy] = useState("");
  const [last, setLast] = useState("");
  async function run(action: Action) {
    if (action === "covers-fix" && !window.confirm("Replace broken/temporary featured image URLs in the database with permanent /covers images?")) return;
    setBusy(action);
    try {
      const res = await fetch("/api/admin/tools", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }) });
      const data = await res.json().catch(() => ({}));
      setLog(data.log || [data.error || "Done"]);
    } catch {
      setLog(["Request failed. Check your connection and try again."]);
    } finally {
      setLast(TOOLS.find((t) => t.action === action)?.title || action);
      setBusy("");
    }
  }
  return (
    <div className="space-y-6">
      <PageHeader title="Tools" description="Maintenance jobs for the database, schedule and images." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {TOOLS.map((t) => {
          const Icon = t.icon;
          const running = busy === t.action;
          return (
            <div key={t.action} className="a-card flex flex-col p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <span className={`a-tile a-tile-${t.tone} shrink-0`}>
                  <Icon size={18} />
                </span>
                <div className="min-w-0">
                  <h3 className="a-h2">{t.title}</h3>
                  <p className="a-muted mt-0.5 text-[13px] leading-5">{t.desc}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-1 items-end">
                <button className={`${t.primary ? "btn" : "btn-outline"} w-full !whitespace-normal !py-2 text-center`} disabled={!!busy} onClick={() => run(t.action)}>
                  {running ? <Loader2 size={16} className="animate-spin" /> : null}
                  {running ? t.busyLabel : t.label}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {log.length > 0 && (
        <section className="a-card overflow-hidden">
          <div className="a-card-head !py-2.5">
            <h3 className="a-h2 inline-flex items-center gap-2">
              <Terminal size={16} className="a-subtle" /> Output{last ? <span className="a-muted font-normal">· {last}</span> : null}
            </h3>
            <button type="button" className="a-icon-btn !h-8 !w-8" aria-label="Clear output" onClick={() => setLog([])}>
              <X size={16} />
            </button>
          </div>
          <pre className="max-h-[420px] overflow-auto bg-zinc-950 p-4 font-mono text-xs leading-6 text-zinc-200">{log.join("\n")}</pre>
        </section>
      )}
    </div>
  );
}
