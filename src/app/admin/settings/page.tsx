import { getSession } from "@/lib/auth";
import { envReport } from "@/lib/migrate";
import { getTrackers } from "@/lib/settings";
import TrackingForm from "@/components/TrackingForm";
export const dynamic = "force-dynamic";
export default async function SettingsPage() {
  const user = await getSession();
  const env = envReport();
  const trackers = await getTrackers();
  const rows = [["Writer name", user?.name || "Faham"], ["Login email", user?.email || ""], ["Role", user?.role || "admin"]];
  return (
    <div className="space-y-5">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-200">Account</p>
        <h2 className="font-heading text-3xl font-extrabold">Settings</h2>
      </div>
      <h3 className="font-heading text-xl font-bold">Tracking codes</h3>
      <div className="card p-5"><TrackingForm initial={trackers} /></div>
      <h3 className="font-heading text-xl font-bold">Hostinger variables</h3>
      <div className="card divide-y p-0">
        {env.map((row) => (
          <div key={row.key} className="flex justify-between gap-3 px-5 py-3">
            <span className="font-mono text-xs">{row.key}</span>
            <span className="text-sm">{row.set ? row.value : "missing"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
