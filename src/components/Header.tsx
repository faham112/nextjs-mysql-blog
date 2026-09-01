import Link from "next/link";
import { listCategories } from "@/lib/categories";

export default async function Header() {
  const categories = await listCategories().catch(() => []);
  return (
    <header className="border-b border-ink/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="font-serif text-2xl tracking-tight">Ember<span className="text-accent">Journal</span></Link>
        <nav className="flex flex-wrap items-center gap-5 text-sm">
          <Link href="/" className="hover:text-accent">Home</Link>
          {categories.slice(0, 5).map((c) => (
            <Link key={c.id} href={`/category/${c.slug}`} className="hover:text-accent">{c.name}</Link>
          ))}
          <Link href="/search" className="hover:text-accent">Search</Link>
          <Link href="/login" className="btn-outline !px-4 !py-1.5">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
