import Link from "next/link";

export default function Footer() {
  return (
    <>
      <footer className="mt-16 border-t border-ink/10 pb-20 md:pb-0">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <p className="font-serif text-2xl">
            Global<span className="text-accent">CareerHub</span>
          </p>
          <p className="mt-2 text-sm text-slate-600">Founder: Abdul Faheem</p>
          <nav className="mt-5 flex flex-wrap gap-4 text-sm">
            <Link href="/" className="hover:text-accent">Home</Link>
            <Link href="/search" className="hover:text-accent">Search</Link>
            <Link href="/login" className="hover:text-accent">Admin</Link>
            <Link href="/admin" className="hover:text-accent">Dashboard</Link>
          </nav>
          <p className="mt-6 text-sm text-slate-500">
            © {new Date().getFullYear()} Global Career Hub · Abdul Faheem · globalcareerhub.org
          </p>
        </div>
      </footer>
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-ink/10 bg-white/95 backdrop-blur md:hidden">
        <div className="grid grid-cols-4 text-center text-xs">
          <Link href="/" className="py-3">Home</Link>
          <Link href="/search" className="py-3">Search</Link>
          <Link href="/admin" className="py-3">Dashboard</Link>
          <Link href="/login" className="py-3">Account</Link>
        </div>
      </nav>
    </>
  );
}
