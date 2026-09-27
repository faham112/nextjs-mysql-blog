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
        <h3 className="a-h2">Connect analytics</h3>
        <p className="a-muted mt-1 text-sm">
          Body scripts run right after the body tag — that is where Femantic belongs.
          Header is for GA4, Clarity, and verification tags. Multiple tools can be on at once.
        </p>
      </div>
      <div>
        <p className="a-eyebrow mb-2">Templates</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => applyPreset(p)}
              className="a-focus a-border a-surface-2 group rounded-lg border p-3.5 text-left transition hover:border-rose-400/70"
            >
              <p className="a-fg flex items-center justify-between gap-2 text-sm font-semibold">
                {p.name}
                <span className="a-badge a-badge-draft before:!hidden">{p.placement}</span>
              </p>
              <p className="a-muted mt-1 text-xs leading-5">{p.hint}</p>
            </button>
          ))}
        </div>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="tf-name" className="a-label">Name</label>
            <input id="tf-name" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Femantic" />
          </div>
          <div>
            <label htmlFor="tf-placement" className="a-label">Placement</label>
            <select id="tf-placement" className="input" value={placement} onChange={(e) => setPlacement(e.target.value as Item["placement"])}>
              <option value="body">Body (after body tag)</option>
              <option value="header">Header</option>
              <option value="footer">Footer</option>
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="tf-code" className="a-label">Script</label>
          <textarea id="tf-code" className="input font-mono text-xs leading-5" rows={6} value={code} onChange={(e) => setCode(e.target.value)} placeholder="<script src=...></script>" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button className="btn" type="submit">{editing ? "Update script" : "Add script"}</button>
          {editing ? <button className="btn-outline" type="button" onClick={resetForm}>Cancel</button> : null}
          {msg ? <p className="a-accent-text text-sm" role="status">{msg}</p> : null}
        </div>
      </form>
      <div>
        <p className="a-eyebrow mb-2">Connected ({items.length})</p>
        {items.length === 0 ? (
          <p className="a-muted a-border rounded-lg border border-dashed px-4 py-6 text-center text-sm">No analytics connected yet. Pick a template above.</p>
        ) : (
          <ul className="a-border a-divide overflow-hidden rounded-lg border">
            {items.map((item) => (
              <li key={item.id} className="a-hoverable flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="a-fg truncate text-sm font-semibold">{item.name}</p>
                  <p className="a-muted text-xs capitalize">{item.placement}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button className="btn-outline btn-sm" type="button" onClick={() => startEdit(item)}>Edit</button>
                  <button className="btn-danger btn-sm" type="button" onClick={() => remove(item.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
