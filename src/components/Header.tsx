import Link from "next/link";
import { listCategories } from "@/lib/categories";
import { getSession } from "@/lib/auth";

export default async function Header() {
  const [categories, user] = await Promise.all([
    listCategories().catch(() => []),
    getSession().catch(() => null),
  ]);

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <div>
          <Link href="/" className="font-serif text-2xl tracking-tight">
            Global<span className="text-accent">CareerHub</span>
          </Link>
          <p className="text-xs text-slate-500">by Abdul Faheem</p>
        </div>
        <nav className="hidden flex-wrap items-center gap-5 text-sm md:flex">
          <Link href="/" className="hover:text-accent">Home</Link>
          {categories.slice(0, 4).map((c) => (
            <Link key={c.id} href={`/category/${c.slug}`} className="hover:text-accent">{c.name}</Link>
          ))}
          <Link href="/search" className="hover:text-accent">Search</Link>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-moss/10 px-3 py-1 text-xs text-moss">
                Logged in · {user.name}
              </span>
              <Link href="/admin" className="btn !px-4 !py-1.5">Dashboard</Link>
              <form action="/api/auth/logout" method="post">
                <button className="btn-outline !px-4 !py-1.5" type="submit">Log out</button>
              </form>
            </div>
          ) : (
            <Link href="/login" className="btn-outline !px-4 !py-1.5">Admin login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
