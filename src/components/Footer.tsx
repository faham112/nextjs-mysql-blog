export default function Footer() {
  return (
    <footer className="mt-16 border-t border-ink/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-10 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Ember Journal. Built with Next.js and MySQL.</p>
        <p>Deployed on Hostinger Node.js hosting.</p>
      </div>
    </footer>
  );
}
