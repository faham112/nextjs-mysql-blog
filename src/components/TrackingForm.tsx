"use client";
import { FormEvent, useState } from "react";
type Item = { id: string; name: string; placement: "header" | "body" | "footer"; code: string };
export default function TrackingForm({ initial }: { initial: Item[] }) {
  const [items, setItems] = useState<Item[]>(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [placement, setPlacement] = useState<Item["placement"]>("body");
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");
  function startEdit(item: Item) {
    setEditing(item.id); setName(item.name); setPlacement(item.placement); setCode(item.code);
  }
  function resetForm() { setEditing(null); setName(""); setPlacement("body"); setCode(""); }
  async function persist(next: Item[]) {
    const res = await fetch("/api/admin/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ trackers: next }) });
    const data = await res.json().catch(() => ({}));
    if (res.ok && Array.isArray(data.trackers)) setItems(data.trackers);
    setMsg(res.ok ? "Saved." : "Save failed.");
    return res.ok;
  }
  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    const row: Item = { id: editing || crypto.randomUUID(), name: name.trim() || "Script", placement, code };
    const next = editing ? items.map((i) => (i.id === editing ? row : i)) : [...items, row];
    if (await persist(next)) resetForm();
  }
  async function remove(id: string) {
    if (!confirm("Delete this script?")) return;
    await persist(items.filter((i) => i.id !== id));
    if (editing === id) resetForm();
  }
  return (
    <div className="space-y-5">
      <form onSubmit={onSubmit} className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-xs font-bold uppercase">Name<input className="input mt-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="Femantic" /></label>
          <label className="block text-xs font-bold uppercase">Placement<select className="input mt-2" value={placement} onChange={(e) => setPlacement(e.target.value as Item["placement"])}><option value="body">Body (after body tag)</option><option value="header">Header</option><option value="footer">Footer</option></select></label>
        </div>
        <label className="block text-xs font-bold uppercase">Script<textarea className="input mt-2 font-mono text-xs" rows={5} value={code} onChange={(e) => setCode(e.target.value)} /></label>
        <div className="flex gap-2">
          <button className="btn" type="submit">{editing ? "Update script" : "Add script"}</button>
          {editing ? <button className="btn-outline" type="button" onClick={resetForm}>Cancel</button> : null}
        </div>
        {msg ? <p className="text-sm text-brand-600">{msg}</p> : null}
      </form>
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider">Added scripts ({items.length})</p>
        {items.length === 0 ? <p className="text-sm" style={{ color: "var(--muted)" }}>Koi tracker nahi.</p> : items.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border px-3 py-3" style={{ borderColor: "var(--border)" }}>
            <div className="min-w-0"><p className="truncate font-semibold">{item.name}</p><p className="text-xs" style={{ color: "var(--muted)" }}>{item.placement}</p></div>
            <div className="flex shrink-0 gap-2">
              <button className="btn-outline px-3 py-1 text-xs" type="button" onClick={() => startEdit(item)}>Edit</button>
              <button className="btn px-3 py-1 text-xs" type="button" onClick={() => remove(item.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
