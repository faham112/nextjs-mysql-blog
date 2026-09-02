"use client";
import Link from "next/link";
export default function AdminBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 grid grid-cols-4 border-t border-white/10 bg-dark-900/95 text-center text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur lg:hidden">
      <Link href="/admin" className="py-3">Home</Link>
      <Link href="/admin/posts" className="py-3">Posts</Link>
      <Link href="/admin/posts/new" className="py-3">Write</Link>
      <form action="/api/auth/logout" method="post">
        <button className="w-full py-3 text-brand-200" type="submit">Logout</button>
      </form>
    </nav>
  );
}
