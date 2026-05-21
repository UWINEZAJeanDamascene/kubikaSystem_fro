import { Badge } from "@/app/components/ui/badge";

type EBMStatus = "not_submitted" | "pending" | "submitted" | "failed" | string | undefined | null;

export function EBMStatusBadge({ status }: { status: EBMStatus }) {
  const normalized = status || "not_submitted";
  const config: Record<string, { label: string; className: string }> = {
    not_submitted: {
      label: "Not submitted",
      className: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700",
    },
    pending: {
      label: "Pending",
      className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900",
    },
    submitted: {
      label: "Submitted",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900",
    },
    failed: {
      label: "Failed",
      className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900",
    },
  };
  const item = config[normalized] || config.not_submitted;
  return <Badge variant="outline" className={item.className}>{item.label}</Badge>;
}
