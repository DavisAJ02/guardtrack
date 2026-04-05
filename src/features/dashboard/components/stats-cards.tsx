import type { DashboardStats } from "@/features/dashboard/types";
import { Panel, StateText } from "@/features/dashboard/components/ui";

export function StatsCards({
  stats,
  loading,
  error,
}: {
  stats: DashboardStats;
  loading: boolean;
  error: string | null;
}) {
  const cards = [
    { label: "Total companies", value: stats.totalCompanies },
    { label: "Total guards", value: stats.totalGuards },
    { label: "Total sites", value: stats.totalSites },
    { label: "Active shifts", value: stats.totalShifts },
    { label: "Incidents today", value: stats.totalIncidentsToday },
  ];

  return (
    <Panel title="Executive Snapshot" description="Live operational KPI overview">
      {error ? <StateText tone="error">{error}</StateText> : null}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => (
          <article key={card.label} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">{card.label}</p>
            <p className="mt-1 text-2xl font-semibold">{loading ? "..." : card.value}</p>
          </article>
        ))}
      </div>
    </Panel>
  );
}
