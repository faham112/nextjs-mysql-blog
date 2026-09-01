import { getSession } from "@/lib/auth";
export const dynamic = "force-dynamic";
export default async function SettingsPage() {
  const user = await getSession();
  return (
    <div className="max-w-2xl">
      <p className="text-xs uppercase tracking-[0.2em] text-accent">Account</p>
      <h1 className="mt-2 font-serif text-4xl">Settings</h1>
      <p className="mt-2 text-slate-600">Identity is set. Change passwords later in Hostinger env vars.</p>
      <div className="card mt-8 divide-y divide-ink/10">
        <div className="flex justify-between gap-4 px-5 py-4 text-sm"><span className="text-slate-500">Writer name</span><span className="font-medium">{user?.name || "Abdul Faheem"}</span></div>
        <div className="flex justify-between gap-4 px-5 py-4 text-sm"><span className="text-slate-500">Login email</span><span className="font-medium">{user?.email || "admin@globalcareerhub.org"}</span></div>
        <div className="flex justify-between gap-4 px-5 py-4 text-sm"><span className="text-slate-500">Role</span><span className="font-medium">{user?.role || "admin"}</span></div>
        <div className="flex justify-between gap-4 px-5 py-4 text-sm"><span className="text-slate-500">Site name</span><span className="font-medium">Global Career Hub</span></div>
        <div className="flex justify-between gap-4 px-5 py-4 text-sm"><span className="text-slate-500">Public URL</span><span className="font-medium">https://globalcareerhub.org</span></div>
        <div className="flex justify-between gap-4 px-5 py-4 text-sm"><span className="text-slate-500">Founder</span><span className="font-medium">Abdul Faheem</span></div>
      </div>
      <div className="card mt-6 p-5 text-sm leading-6 text-slate-600">
        <p className="font-medium text-ink">Writer login is required to publish.</p>
        <p className="mt-2">Readers never need an account. Only /login opens this desk.</p>
      </div>
      <form action="/api/auth/logout" method="post" className="mt-6">
        <button className="btn-outline" type="submit">Log out</button>
      </form>
    </div>
  );
}
