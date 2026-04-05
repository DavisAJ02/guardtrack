"use client";

import { useMemo, useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { TrendBars } from "@/features/dashboard/components/trend-bars";
import { Panel, StateText } from "@/features/dashboard/components/ui";
import { useDashboardData } from "@/features/dashboard/useDashboardData";
import {
  activeShifts,
  aggregateCountByDay,
  incidentRate,
  isInRange,
  siteCoverage,
  todayCount,
} from "@/features/dashboard/analytics";

export default function InsightsPage() {
  const data = useDashboardData();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [siteFilter, setSiteFilter] = useState("all");

  const filteredCheckIns = useMemo(
    () =>
      data.checkIns.filter((item) => {
        if (!isInRange(item.created_at, from, to)) return false;
        if (siteFilter !== "all" && String(item.site_id) !== siteFilter) return false;
        if (companyFilter !== "all") {
          const site = data.sites.find((entry) => String(entry.id) === String(item.site_id));
          if (!site || String(site.company_id) !== companyFilter) return false;
        }
        return true;
      }),
    [data.checkIns, data.sites, from, to, siteFilter, companyFilter]
  );

  const filteredIncidents = useMemo(
    () =>
      data.incidents.filter((item) => {
        if (!isInRange(item.created_at, from, to)) return false;
        if (siteFilter !== "all" && String(item.site_id) !== siteFilter) return false;
        if (companyFilter !== "all") {
          const site = data.sites.find((entry) => String(entry.id) === String(item.site_id));
          if (!site || String(site.company_id) !== companyFilter) return false;
        }
        return true;
      }),
    [data.incidents, data.sites, from, to, siteFilter, companyFilter]
  );

  const kpis = [
    { label: "Today Check-ins", value: todayCount(filteredCheckIns) },
    { label: "Incidents Today", value: todayCount(filteredIncidents) },
    { label: "Active Shifts", value: activeShifts(data.shifts) },
    { label: "Site Coverage", value: `${siteCoverage(filteredCheckIns, data.shifts)}%` },
  ];

  const checkInTrend = aggregateCountByDay(filteredCheckIns).slice(-7);
  const incidentTrend = aggregateCountByDay(filteredIncidents).slice(-7);
  const incidentsBySite = useMemo(() => {
    const bySite = new Map<string, number>();
    for (const incident of filteredIncidents) {
      const key = String(incident.site_id ?? "unknown");
      bySite.set(key, (bySite.get(key) ?? 0) + 1);
    }
    return [...bySite.entries()]
      .map(([siteId, value]) => ({
        label:
          data.sites.find((site) => String(site.id) === siteId)?.name ?? `Site #${siteId}`,
        value,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [filteredIncidents, data.sites]);

  return (
    <DashboardShell
      title="Operational Insights"
      subtitle="Track short-term trends and key metrics across check-ins, incidents, and coverage."
    >
      <Panel title="Filters" description="Scope analytics by date, company, and site">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <label className="text-sm">
            <span className="mb-1 block text-slate-600">From</span>
            <input
              type="date"
              value={from}
              onChange={(event) => setFrom(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-slate-600">To</span>
            <input
              type="date"
              value={to}
              onChange={(event) => setTo(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-slate-600">Company</span>
            <select
              value={companyFilter}
              onChange={(event) => setCompanyFilter(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
            >
              <option value="all">All companies</option>
              {data.companies.map((company) => (
                <option key={String(company.id)} value={String(company.id)}>
                  {company.name ?? `Company #${company.id}`}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-slate-600">Site</span>
            <select
              value={siteFilter}
              onChange={(event) => setSiteFilter(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
            >
              <option value="all">All sites</option>
              {data.sites.map((site) => (
                <option key={String(site.id)} value={String(site.id)}>
                  {site.name ?? `Site #${site.id}`}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Panel>

      <Panel title="KPI Strip" description="Current values based on active filters">
        {(data.checkInsLoading || data.incidentsLoading) && <StateText>Loading metrics...</StateText>}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((kpi) => (
            <article key={kpi.label} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">{kpi.label}</p>
              <p className="mt-1 text-2xl font-semibold">{kpi.value}</p>
            </article>
          ))}
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Panel title="Check-in Trend (7 days)" description="Daily check-in totals">
          <TrendBars points={checkInTrend} emptyText="No check-in trend data in this range." />
        </Panel>

        <Panel title="Incident Trend (7 days)" description="Daily incident totals and risk signal">
          <TrendBars points={incidentTrend} emptyText="No incident trend data in this range." />
          <p className="mt-3 text-xs text-slate-600">Incident-to-check-in ratio: {incidentRate(filteredIncidents, filteredCheckIns)}%</p>
        </Panel>
      </div>

      <Panel title="Incidents by Site" description="Top incident-heavy locations in active filter set">
        <TrendBars points={incidentsBySite} emptyText="No incidents found for site distribution." />
      </Panel>
    </DashboardShell>
  );
}
