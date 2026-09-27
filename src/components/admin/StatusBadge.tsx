import type { AdminPostStatus } from "./rows";

const MAP: Record<AdminPostStatus, { label: string; cls: string }> = {
  published: { label: "Live", cls: "a-badge-live" },
  draft: { label: "Draft", cls: "a-badge-draft" },
  scheduled: { label: "Scheduled", cls: "a-badge-scheduled" },
};

export default function StatusBadge({ status, when }: { status: AdminPostStatus; when?: string | null }) {
  const m = MAP[status];
  return (
    <span className={`a-badge ${m.cls}`} title={when ? `Goes live ${when} PKT` : undefined}>
      {m.label}
    </span>
  );
}
