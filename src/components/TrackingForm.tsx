"use client";

import { FormEvent, useState } from "react";

type Item = { id: string; name: string; placement: "header" | "body" | "footer"; code: string };

const PRESETS: { name: string; placement: Item["placement"]; hint: string; code: string }[] = [
  {
    name: "Femantic / own tracker",
    placement: "body",
    hint: "Paste your full script tag. Body = after opening body tag.",
    code: "<script defer data-site=\"YOUR_SITE_ID\" src=\"https://analytics.globalcareerhub.org/tracker/femantic.js\"></script>",
  },
  {
    name: "Google Analytics 4",
    placement: "header",
    hint: "Replace G-XXXXXXXX with your Measurement ID.",
    code: "<script async src=\"https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX\"></script>\n<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-XXXXXXXX');</script>",
  },
  {
    name: "Google Search Console",
    placement: "header",
    hint: "HTML tag verification meta from GSC.",
    code: "<meta name=\"google-site-verification\" content=\"YOUR_TOKEN\" />",
  },
  {
    name: "Microsoft Clarity",
    placement: "header",
    hint: "Replace YOUR_CLARITY_ID.",
    code: "<script type=\"text/javascript\">(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src=\"https://www.clarity.ms/tag/\"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,\"clarity\",\"script\",\"YOUR_CLARITY_ID\");</script>",
  },
];

export default function TrackingForm({ initial }: { initial: Item[] }) {
  const [items, setItems] = useState<Item[]>(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [placement, setPlacement] = useState<Item["placement"]>("body");
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");

  function startEdit(item: Item) {
    setEditing(item.id);
    setName(item.name);
    setPlacement(item.placement);
    setCode(item.code);
  }

  function resetForm() {
    setEditing(null);
    setName("");
    setPlacement("body");
    setCode("");
  }

  function applyPreset(p: (typeof PRESETS)[number]) {
    setEditing(null);
    setName(p.name);
    setPlacement(p.placement);
    setCode(p.code);
    setMsg("Template loaded — replace the ID, then Add script.");
  }

  async function persist(next: Item[]) {
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackers: next }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && Array.isArray(data.trackers)) setItems(data.trackers);
    setMsg(res.ok ? "Saved. Live pages pick this up after a refresh." : "Save failed.");
    return res.ok;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    const row: Item = {
      id: editing || crypto.randomUUID(),
      name: name.trim() || "Script",
      placement,
      code,
    };
    const next = editing ? items.map((i) => (i.id === editing ? row : i)) : [...items, row];
    if (await persist(next)) resetForm();
  }

  async function remove(id: string) {
    if (!confirm("Delete this script?")) return;
    await persist(items.filter((i) => i.id !== id));
    if (editing === id) resetForm();
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-200">Analytics</p>
        <h3 className="font-heading text-xl font-extrabold">Connect analytics</h3>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
          Body scripts run right after the body tag — that is where Femantic belongs.
          Header is for GA4, Clarity, and verification tags. Multiple tools can be on at once.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {PRESETS.map((p) => (
          <button
            key={p.name}
            type="button"
            onClick={() => applyPreset(p)}
            className="rounded-xl border p-4 text-left transition hover:border-brand-500"
            style={{ borderColor: "var(--border)", background: "var(--bg2)" }}
          >
            <p className="font-semibold">{p.name}</p>
            <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
              {p.placement} · {p.hint}
            </p>
          </button>
        ))}
      </div>
      <form onSubmit={onSubmit} className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-xs font-bold uppercase">
            Name
            <input className="input mt-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="Femantic" />
          </label>
          <label className="block text-xs font-bold uppercase">
            Placement
            <select className="input mt-2" value={placement} onChange={(e) => setPlacement(e.target.value as Item["placement"])}>
              <option value="body">Body (after body tag)</option>
              <option value="header">Header</option>
              <option value="footer">Footer</option>
            </select>
          </label>
        </div>
        <label className="block text-xs font-bold uppercase">
          Script
          <textarea className="input mt-2 font-mono text-xs" rows={6} value={code} onChange={(e) => setCode(e.target.value)} placeholder="<script src=...></script>" />
        </label>
        <div className="flex gap-2">
          <button className="btn" type="submit">{editing ? "Update script" : "Add script"}</button>
          {editing ? <button className="btn-outline" type="button" onClick={resetForm}>Cancel</button> : null}
        </div>
        {msg ? <p className="text-sm text-brand-600">{msg}</p> : null}
      </form>
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider">Connected ({items.length})</p>
        {items.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--muted)" }}>No analytics connected yet. Pick a template above.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border px-3 py-3" style={{ borderColor: "var(--border)" }}>
              <div className="min-w-0">
                <p className="truncate font-semibold">{item.name}</p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>{item.placement}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button className="btn-outline px-3 py-1 text-xs" type="button" onClick={() => startEdit(item)}>Edit</button>
                <button className="btn px-3 py-1 text-xs" type="button" onClick={() => remove(item.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
