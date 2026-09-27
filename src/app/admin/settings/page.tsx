import { CircleCheck, CircleAlert, Server, UserRound } from "lucide-react";
import { getSession } from "@/lib/auth";
import { envReport } from "@/lib/migrate";
import { getTrackers } from "@/lib/settings";
import TrackingForm from "@/components/TrackingForm";
import PageHeader from "@/components/admin/PageHeader";
import { initials } from "@/components/admin/nav";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await getSession();
  const env = envReport();
  const trackers = await getTrackers();
  const rows = [
    ["Writer name", user?.name || "Faham"],
    ["Login email", user?.email || ""],
    ["Role", user?.role || "admin"],
  ];
  const missing = env.filter((r) => !r.set && r.value !== "optional").length;
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Account, analytics scripts and server configuration." />

      <section className="a-card overflow-hidden">
        <div className="a-card-head">
          <h3 className="a-h2 inline-flex items-center gap-2">
            <UserRound size={17} className="a-subtle" /> Account
          </h3>
        </div>
        <div className="flex flex-col gap-5 p-4 sm:flex-row sm:items-center sm:p-5">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-rose-700 text-lg font-bold text-[#fff]">
            {initials(String(rows[0][1]))}
          </span>
          <dl className="grid flex-1 gap-4 sm:grid-cols-3">
            {rows.map(([label, value]) => (
              <div key={label} className="min-w-0">
                <dt className="a-muted text-xs">{label}</dt>
                <dd className="a-fg mt-0.5 truncate text-sm font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="a-card p-4 sm:p-5">
        <TrackingForm initial={trackers} />
      </section>

      <section className="a-card overflow-hidden">
        <div className="a-card-head">
          <h3 className="a-h2 inline-flex items-center gap-2">
            <Server size={17} className="a-subtle" /> Hostinger variables
          </h3>
          <span className={`a-badge ${missing ? "a-badge-warn" : "a-badge-live"}`}>
            {missing ? `${missing} missing` : "All set"}
          </span>
        </div>
        <ul className="a-divide">
          {env.map((row) => (
            <li key={row.key} className="flex min-h-[52px] items-center justify-between gap-3 px-4 py-3 sm:px-5">
              <span className="a-mono a-fg min-w-0 truncate text-xs">{row.key}</span>
              <span className="flex min-w-0 items-center gap-2 text-sm">
                <span className="a-muted truncate">{row.set ? row.value : "missing"}</span>
                {row.set ? (
                  <CircleCheck size={16} className="shrink-0 text-emerald-600 dark:text-emerald-400" aria-label="set" />
                ) : (
                  <CircleAlert
                    size={16}
                    className={`shrink-0 ${row.value === "optional" ? "a-subtle" : "text-amber-600 dark:text-amber-400"}`}
                    aria-label="missing"
                  />
                )}
              </span>
            </li>
          ))}
        </ul>
        <p className="a-muted a-border a-surface-2 border-t px-4 py-3 text-xs sm:px-5">
          Passwords yahan edit nahi hote — Hostinger Node env panel se. SQL tables Tools page se.
        </p>
      </section>
    </div>
  );
}
