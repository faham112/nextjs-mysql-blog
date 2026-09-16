"use client";
import Link from "next/link";
import { LogOut } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
export default function AdminTopBar({ name, email }: { name: string; email: string }) {
  return (
    <header className="sticky top-0 z-40 mb-5 flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-dark-900/90 px-3 py-2.5 backdrop-blur">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-white">{name}</p>
        <p className="truncate text-[11px] text-white/45">{email}</p>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Link href="/" className="hidden text-xs font-semibold text-white/60 hover:text-white sm:inline">Site</Link>
        <form action="/api/auth/logout" method="post">
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2 text-xs font-bold text-white" type="submit">
            <LogOut size={14} /> Logout
          </button>
        </form>
      </div>
    </header>
  );
}
