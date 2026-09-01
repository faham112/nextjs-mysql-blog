import { query } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const user = await getSession();
  const [posts] = await query("SELECT COUNT(*) AS n FROM posts");
  const [published] = await query("SELECT COUNT(*) AS n FROM posts WHERE status = 'published'");
  const [pending] = await query("SELECT COUNT(*) AS n FROM comments WHERE approved = 0");

  return (
    <div>
      <h1 className="font-serif text-4xl">Dashboard</h1>
      <p className="mt-2 text-slate-600">Welcome back, {user?.name}.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="All posts" value={posts?.n ?? 0} />
        <Stat label="Published" value={published?.n ?? 0} />
        <Stat label="Pending comments" value={pending?.n ?? 0} />
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="card p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 font-serif text-4xl">{value}</p>
    </div>
  );
}
