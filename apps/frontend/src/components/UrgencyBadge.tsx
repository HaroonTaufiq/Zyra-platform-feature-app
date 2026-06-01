import type { Urgency } from "../types";

const STYLES: Record<Urgency, string> = {
  high: "bg-red-100 text-red-800 ring-red-600/20",
  medium: "bg-amber-100 text-amber-800 ring-amber-600/20",
  low: "bg-slate-100 text-slate-700 ring-slate-500/20",
};

const LABELS: Record<Urgency, string> = {
  high: "High urgency",
  medium: "Medium urgency",
  low: "Low urgency",
};

export function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  return (
    <span
      data-testid="urgency-badge"
      data-urgency={urgency}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ring-1 ring-inset ${STYLES[urgency]}`}
    >
      <span
        aria-hidden
        className={`h-2 w-2 rounded-full ${
          urgency === "high"
            ? "bg-red-500"
            : urgency === "medium"
              ? "bg-amber-500"
              : "bg-slate-400"
        }`}
      />
      {LABELS[urgency]}
    </span>
  );
}
