"use client";

import { Suspense, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DashboardShell } from "@/components/dashboard-shell";
import { Panel, StateText } from "@/features/dashboard/components/ui";
import { useDashboardData } from "@/features/dashboard/useDashboardData";
import { getCheckInGuardName, getCheckInSiteName, getIncidentGuardName, getIncidentSiteName } from "@/features/dashboard/utils";
import { isInRange } from "@/features/dashboard/analytics";

const toCsv = (rows: Array<Record<string, string | number>>) => {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
  const body = rows.map((row) => headers.map((header) => escape(row[header] ?? "")).join(",")).join("\n");
  return `${headers.join(",")}\n${body}`;
};

const downloadCsv = (filename: string, content: string) => {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
};

const PRESET_KEY = "guardtrack-reports-preset-v1";

function ReportsPageContent() {
  const data = useDashboardData();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const company = searchParams.get("company") ?? "all";
  const site = searchParams.get("site") ?? "all";
  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";
  const search = searchParams.get("search") ?? "";
  const sort = searchParams.get("sort") ?? "created_at";
  const direction = searchParams.get("direction") ?? "desc";
  const [savedPreset, setSavedPreset] = useState<string | null>(
    typeof window === "undefined" ? null : localStorage.getItem(PRESET_KEY)
  );

  const setParam = (name: string, value: string) => {
    const next = new URLSearchParams(searchParams.toString());
    if (!value) next.delete(name);
    else next.set(name, value);
    router.replace(`${pathname}?${next.toString()}`);
  };

  const setParams = (updates: Record<string, string>) => {
    const next = new URLSearchParams(searchParams.toString());
    for (const [name, value] of Object.entries(updates)) {
      if (!value) next.delete(name);
      else next.set(name, value);
    }
    router.replace(`${pathname}?${next.toString()}`);
  };

  const applyPreset = (preset: "today" | "last7" | "incidents") => {
    const now = new Date();
    const toDate = now.toISOString().slice(0, 10);
    if (preset === "today") {
      setParams({ from: toDate, to: toDate });
      return;
    }
    if (preset === "last7") {
      const fromDate = new Date(now);
      fromDate.setDate(now.getDate() - 6);
      setParams({ from: fromDate.toISOString().slice(0, 10), to: toDate });
      return;
    }
    setParams({ search: "incident", sort: "created_at", direction: "desc" });
  };

  const saveCurrentPreset = () => {
    const payload = searchParams.toString();
    localStorage.setItem(PRESET_KEY, payload);
    setSavedPreset(payload);
  };

  const loadSavedPreset = () => {
    const payload = localStorage.getItem(PRESET_KEY);
    if (!payload) return;
    router.replace(`${pathname}?${payload}`);
  };

  const siteIdsForCompany = useMemo(() => {
    if (company === "all") return new Set<string>();
    return new Set(
      data.sites
        .filter((entry) => String(entry.company_id) === company)
        .map((entry) => String(entry.id))
    );
  }, [company, data.sites]);

  const filteredCheckIns = useMemo(() => {
    const source = [...data.checkIns];
    const text = search.trim().toLowerCase();
    const sorted = source.sort((a, b) => {
      if (sort === "created_at") {
        return direction === "asc"
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return direction === "asc" ? String(a.id).localeCompare(String(b.id)) : String(b.id).localeCompare(String(a.id));
    });
    return sorted.filter((item) => {
      if (!isInRange(item.created_at, from, to)) return false;
      if (site !== "all" && String(item.site_id) !== site) return false;
      if (company !== "all" && !siteIdsForCompany.has(String(item.site_id))) return false;
      if (!text) return true;
      const haystack = `${getCheckInGuardName(item)} ${getCheckInSiteName(item)} ${item.gps_location ?? ""}`.toLowerCase();
      return haystack.includes(text);
    });
  }, [data.checkIns, from, to, site, company, siteIdsForCompany, search, sort, direction]);

  const filteredIncidents = useMemo(() => {
    const source = [...data.incidents];
    const text = search.trim().toLowerCase();
    const sorted = source.sort((a, b) => {
      if (sort === "created_at") {
        return direction === "asc"
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return direction === "asc" ? String(a.id).localeCompare(String(b.id)) : String(b.id).localeCompare(String(a.id));
    });
    return sorted.filter((item) => {
      if (!isInRange(item.created_at, from, to)) return false;
      if (site !== "all" && String(item.site_id) !== site) return false;
      if (company !== "all" && !siteIdsForCompany.has(String(item.site_id))) return false;
      if (!text) return true;
      const haystack = `${getIncidentGuardName(item)} ${getIncidentSiteName(item)} ${item.description ?? ""}`.toLowerCase();
      return haystack.includes(text);
    });
  }, [data.incidents, from, to, site, company, siteIdsForCompany, search, sort, direction]);

  return (
    <DashboardShell
      title="Reports"
      subtitle="Filter, search, sort, and export check-ins and incidents for operations reporting."
    >
      <Panel title="Report Filters" description="Filters persist in URL query parameters">
        <div className="mb-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => applyPreset("today")}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => applyPreset("last7")}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            Last 7 Days
          </button>
          <button
            type="button"
            onClick={() => applyPreset("incidents")}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            Incident Focus
          </button>
          <button
            type="button"
            onClick={saveCurrentPreset}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            Save Current Preset
          </button>
          <button
            type="button"
            onClick={loadSavedPreset}
            disabled={!savedPreset}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Load Saved Preset
          </button>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-6">
          <label className="text-sm">
            <span className="mb-1 block text-slate-600">From</span>
            <input
              type="date"
              value={from}
              onChange={(event) => setParam("from", event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-slate-600">To</span>
            <input
              type="date"
              value={to}
              onChange={(event) => setParam("to", event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-slate-600">Company</span>
            <select
              value={company}
              onChange={(event) => setParam("company", event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
            >
              <option value="all">All companies</option>
              {data.companies.map((entry) => (
                <option key={String(entry.id)} value={String(entry.id)}>
                  {entry.name ?? `Company #${entry.id}`}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-slate-600">Site</span>
            <select
              value={site}
              onChange={(event) => setParam("site", event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
            >
              <option value="all">All sites</option>
              {data.sites.map((entry) => (
                <option key={String(entry.id)} value={String(entry.id)}>
                  {entry.name ?? `Site #${entry.id}`}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-slate-600">Search</span>
            <input
              type="text"
              value={search}
              onChange={(event) => setParam("search", event.target.value)}
              placeholder="Guard, site, or text"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
            />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-sm">
              <span className="mb-1 block text-slate-600">Sort</span>
              <select
                value={sort}
                onChange={(event) => setParam("sort", event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
              >
                <option value="created_at">Date</option>
                <option value="id">ID</option>
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-slate-600">Direction</span>
              <select
                value={direction}
                onChange={(event) => setParam("direction", event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
              >
                <option value="desc">Desc</option>
                <option value="asc">Asc</option>
              </select>
            </label>
          </div>
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Panel
          title="Check-in Report"
          description={`${filteredCheckIns.length} row(s)`}
          action={
            <button
              type="button"
              onClick={() =>
                downloadCsv(
                  "checkins-report.csv",
                  toCsv(
                    filteredCheckIns.map((item) => ({
                      id: String(item.id),
                      guard: getCheckInGuardName(item),
                      site: getCheckInSiteName(item),
                      gps_location: item.gps_location ?? "",
                      created_at: item.created_at,
                    }))
                  )
                )
              }
              disabled={filteredCheckIns.length === 0}
              className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              Export CSV
            </button>
          }
        >
          {data.checkInsLoading ? <StateText>Loading check-ins...</StateText> : null}
          {!data.checkInsLoading && filteredCheckIns.length === 0 ? <StateText>No check-ins match these filters.</StateText> : null}
          <div className="max-h-96 overflow-auto rounded-lg border border-slate-200">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-3 py-2 font-medium">Guard</th>
                  <th className="px-3 py-2 font-medium">Site</th>
                  <th className="px-3 py-2 font-medium">GPS</th>
                  <th className="px-3 py-2 font-medium">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {filteredCheckIns.map((item) => (
                  <tr key={`checkin-${item.id}`} className="border-t border-slate-200">
                    <td className="px-3 py-2">{getCheckInGuardName(item)}</td>
                    <td className="px-3 py-2">{getCheckInSiteName(item)}</td>
                    <td className="px-3 py-2 text-xs text-slate-600">{item.gps_location ?? "N/A"}</td>
                    <td className="px-3 py-2 text-xs text-slate-600">{new Date(item.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel
          title="Incident Report"
          description={`${filteredIncidents.length} row(s)`}
          action={
            <button
              type="button"
              onClick={() =>
                downloadCsv(
                  "incidents-report.csv",
                  toCsv(
                    filteredIncidents.map((item) => ({
                      id: String(item.id),
                      guard: getIncidentGuardName(item),
                      site: getIncidentSiteName(item),
                      description: item.description ?? "",
                      created_at: item.created_at,
                    }))
                  )
                )
              }
              disabled={filteredIncidents.length === 0}
              className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              Export CSV
            </button>
          }
        >
          {data.incidentsLoading ? <StateText>Loading incidents...</StateText> : null}
          {!data.incidentsLoading && filteredIncidents.length === 0 ? <StateText>No incidents match these filters.</StateText> : null}
          <div className="max-h-96 overflow-auto rounded-lg border border-slate-200">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-3 py-2 font-medium">Guard</th>
                  <th className="px-3 py-2 font-medium">Site</th>
                  <th className="px-3 py-2 font-medium">Description</th>
                  <th className="px-3 py-2 font-medium">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {filteredIncidents.map((item) => (
                  <tr key={`incident-${item.id}`} className="border-t border-slate-200">
                    <td className="px-3 py-2">{getIncidentGuardName(item)}</td>
                    <td className="px-3 py-2">{getIncidentSiteName(item)}</td>
                    <td className="px-3 py-2">{item.description ?? "No description"}</td>
                    <td className="px-3 py-2 text-xs text-slate-600">{new Date(item.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </DashboardShell>
  );
}

export default function ReportsPage() {
  return (
    <Suspense
      fallback={
        <DashboardShell title="Reports" subtitle="Loading report filters and datasets...">
          <Panel title="Loading Reports">
            <StateText>Preparing report workspace...</StateText>
          </Panel>
        </DashboardShell>
      }
    >
      <ReportsPageContent />
    </Suspense>
  );
}
