"use client";
import { FormEvent, useState } from "react";
export default function TrackingForm({ header, body, footer }: { header: string; body: string; footer: string }) {
  const [msg, setMsg] = useState("");
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ header: form.get("header"), body: form.get("body"), footer: form.get("footer") }),
    });
    setMsg(res.ok ? "Saved." : "Save failed.");
  }
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <p className="text-sm" style={{ color: "var(--muted)" }}>Paste full script tags. Body runs right after &lt;body&gt; so the tracker fires.</p>
      <label className="block text-xs font-bold uppercase">Header<textarea name="header" rows={4} defaultValue={header} className="input mt-2 font-mono text-xs" /></label>
      <label className="block text-xs font-bold uppercase">Body (after opening body tag)<textarea name="body" rows={5} defaultValue={body} className="input mt-2 font-mono text-xs" placeholder='&lt;script src="..."&gt;&lt;/script&gt;' /></label>
      <label className="block text-xs font-bold uppercase">Footer<textarea name="footer" rows={4} defaultValue={footer} className="input mt-2 font-mono text-xs" /></label>
      <button className="btn" type="submit">Save tracking codes</button>
      {msg ? <p className="text-sm text-brand-600">{msg}</p> : null}
    </form>
  );
}
