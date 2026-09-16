import { getSession } from "@/lib/auth";
import { envReport } from "@/lib/migrate";
export const dynamic = "force-dynamic";
export default async function SettingsPage() {
  const user = await getSession();
  const env = envReport();
  const rows = [["Writer name", user?.name || "Faham"], ["Login email", user?.email || ""], ["Role", user?.role || "admin"]];
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
      <h3 className="font-heading text-xl font-bold">Hostinger variables</h3>
      <div className="card divide-y p-0">
        {env.map((row) => (
          <div key={row.key} className="flex flex-col gap-1 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="font-mono text-xs">{row.key}</span>
            <span className="text-sm">{row.set ? row.value : "missing"}</span>
          </div>
        ))}
      </div>
      <p className="text-xs" style={{ color: "var(--muted)" }}>Passwords change in Hostinger env. SQL tables on Tools.</p>
    </div>
  );
}
