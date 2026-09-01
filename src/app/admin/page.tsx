import { query } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

type CountRow = { n: number };

export default async function AdminHome() {
  const user = await getSession();
  const postRows = await query<CountRow>("SELECT COUNT(*) AS n FROM posts");
  const publishedRows = await query<CountRow>(
    "SELECT COUNT(*) AS n FROM posts WHERE status = 'published'"
  );
  const pendingRows = await query<CountRow>(
    "SELECT COUNT(*) AS n FROM comments WHERE approved = 0"
  );

  const posts = postRows[0]?.n ?? 0;
  const published = publishedRows[0]?.n ?? 0;
  const pending = pendingRows[0]?.n ?? 0;

  return (
    <div>
      <h1 className="font-serif text-4xl">Dashboard</h1>
      <p className="mt-2 text-slate-600">Welcome back, {user?.name}.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="All posts" value={posts} />
        <Stat label="Published" value={published} />
        <Stat label="Pending comments" value={pending} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="card p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 font-serif text-4xl">{value}</p>
    </div>
  );
}
