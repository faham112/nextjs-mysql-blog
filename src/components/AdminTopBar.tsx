"use client";
import Link from "next/link";
import { useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import AdminNav from "@/components/AdminNav";
export default function AdminTopBar({ name, email }: { name: string; email: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <header className="sticky top-0 z-40 mb-5 flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 backdrop-blur" style={{ borderColor: "var(--border)", background: "var(--bg2)" }}>
        <div className="flex min-w-0 items-center gap-3">
          <button className="rounded-lg p-2 lg:hidden" type="button" aria-label="Open admin menu" onClick={() => setOpen(true)}><Menu size={20} /></button>
          <img src="/logo.svg" alt="" className="h-9 w-9 shrink-0 rounded-lg" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{name}</p>
            <p className="truncate text-[11px]" style={{ color: "var(--muted)" }}>{email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/" className="hidden text-xs font-semibold sm:inline" style={{ color: "var(--muted)" }}>Site</Link>
          <form action="/api/auth/logout" method="post">
            <button className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2 text-xs font-bold text-white" type="submit"><LogOut size={14} /> Logout</button>
          </form>
        </div>
      </header>
      <div className={`fixed inset-0 z-[90] lg:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
        <button className={`absolute inset-0 bg-black/50 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} type="button" aria-label="Close" onClick={() => setOpen(false)} />
        <aside className={`absolute left-0 top-0 flex h-full w-[min(82vw,300px)] flex-col border-r p-4 shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`} style={{ background: "var(--bg2)", borderColor: "var(--border)" }}>
          <div className="mb-4 flex items-center justify-between">
            <p className="font-heading text-sm font-extrabold">Admin</p>
            <button type="button" className="p-2" aria-label="Close" onClick={() => setOpen(false)}><X size={18} /></button>
          </div>
          <div onClick={() => setOpen(false)}><AdminNav /></div>
        </aside>
      </div>
    </>
  );
}
