import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await getSession();
  return (
    <div className="max-w-xl">
      <h1 className="font-serif text-4xl">Settings</h1>
      <p className="mt-2 text-slate-600">Account and site identity.</p>
      <div className="card mt-6 space-y-3 p-5 text-sm">
        <p><span className="text-slate-500">Name:</span> {user?.name}</p>
        <p><span className="text-slate-500">Email:</span> {user?.email}</p>
        <p><span className="text-slate-500">Role:</span> {user?.role}</p>
        <p><span className="text-slate-500">Site:</span> Global Career Hub</p>
        <p><span className="text-slate-500">Founder:</span> Abdul Faheem</p>
      </div>
      <form action="/api/auth/logout" method="post" className="mt-6">
        <button className="btn-outline" type="submit">Log out</button>
      </form>
    </div>
  );
}
