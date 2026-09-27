import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function PageHeader({
  title,
  description,
  actions,
  back,
}: {
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {back ? (
          <Link
            href={back.href}
            className="a-muted mb-2 inline-flex min-h-[32px] items-center gap-1 text-[13px] font-medium hover:underline"
          >
            <ChevronLeft size={16} /> {back.label}
          </Link>
        ) : null}
        <h2 className="a-title">{title}</h2>
        {description ? <p className="a-muted mt-1 text-sm">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
