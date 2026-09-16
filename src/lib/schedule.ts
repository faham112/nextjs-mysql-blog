export function parseSchedule(raw: unknown): Date | null {
  const value = String(raw || "").trim();
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}
export function resolvePublishState(statusRaw: unknown, scheduledRaw: unknown) {
  const scheduledAt = parseSchedule(scheduledRaw);
  const now = new Date();
  if (statusRaw === "published") {
    return { status: "published" as const, published_at: scheduledAt && scheduledAt > now ? scheduledAt : now, kind: "published" as const };
  }
  if (statusRaw === "scheduled") {
    if (!scheduledAt) return { status: "draft" as const, published_at: null, kind: "draft" as const };
    if (scheduledAt <= now) return { status: "published" as const, published_at: scheduledAt, kind: "published" as const };
    return { status: "draft" as const, published_at: scheduledAt, kind: "scheduled" as const };
  }
  return { status: "draft" as const, published_at: null, kind: "draft" as const };
}
