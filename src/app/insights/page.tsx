"use client";

import { useMemo, useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
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
          {checkInTrend.length === 0 ? <StateText>No check-in trend data in this range.</StateText> : null}
          <ul className="space-y-2">
            {checkInTrend.map((entry) => (
              <li key={entry.label} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <span className="text-sm text-slate-700">{entry.label}</span>
                <span className="text-sm font-semibold">{entry.value}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Incident Trend (7 days)" description="Daily incident totals and risk signal">
          {incidentTrend.length === 0 ? <StateText>No incident trend data in this range.</StateText> : null}
          <ul className="space-y-2">
            {incidentTrend.map((entry) => (
              <li key={entry.label} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <span className="text-sm text-slate-700">{entry.label}</span>
                <span className="text-sm font-semibold">{entry.value}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-slate-600">Incident-to-check-in ratio: {incidentRate(filteredIncidents, filteredCheckIns)}%</p>
        </Panel>
      </div>
    </DashboardShell>
  );
}
