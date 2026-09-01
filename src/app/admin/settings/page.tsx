import { getSession } from "@/lib/auth";
export const dynamic = "force-dynamic";
export default async function SettingsPage() {
  const user = await getSession();
  const rows = [
    ["Writer name", user?.name || "Abdul Faheem"],
    ["Login email", user?.email || "admin@globalcareerhub.org"],
    ["Role", user?.role || "admin"],
    ["Site name", "Global Career Hub"],
    ["Public URL", "https://globalcareerhub.org"],
    ["Founder", "Abdul Faheem"],
  ];
  return (
    <div className="space-y-5">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-200">Account</p>
        <h2 className="font-heading text-3xl font-extrabold">Settings</h2>
      </div>
      <div className="morph-card-red divide-y divide-white/15 p-0">
        {rows.map(([label, value]) => (
          <div key={label} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-white/70">{label}</span>
            <span className="font-semibold">{value}</span>
          </div>
        ))}
      </div>
      <div className="morph-card text-sm text-white/75">Writer login is required to publish. Readers never need an account.</div>
    </div>
  );
}
