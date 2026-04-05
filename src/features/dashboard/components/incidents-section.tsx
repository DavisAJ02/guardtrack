import type { Guard, Incident, Site } from "@/features/dashboard/types";
import { getIncidentGuardName, getIncidentSiteName } from "@/features/dashboard/utils";
import { Panel, StateText } from "@/features/dashboard/components/ui";

type IncidentsSectionProps = {
  incidents: Incident[];
  guards: Guard[];
  sites: Site[];
  loading: boolean;
  error: string | null;
  reporting: boolean;
  selectedIncidentGuardId: string;
  selectedIncidentSiteId: string;
  incidentDescription: string;
  setSelectedIncidentGuardId: (value: string) => void;
  setSelectedIncidentSiteId: (value: string) => void;
  setIncidentDescription: (value: string) => void;
  onReportIncident: () => Promise<void>;
};

export function IncidentsSection({
  incidents,
  guards,
  sites,
  loading,
  error,
  reporting,
  selectedIncidentGuardId,
  selectedIncidentSiteId,
  incidentDescription,
  setSelectedIncidentGuardId,
  setSelectedIncidentSiteId,
  setIncidentDescription,
  onReportIncident,
}: IncidentsSectionProps) {
  return (
    <Panel title="Incident Reporting" description="Create and review security incident logs">
      <div className="flex flex-col gap-3">
        <select
          value={selectedIncidentGuardId}
          onChange={(event) => setSelectedIncidentGuardId(event.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
          disabled={reporting || guards.length === 0}
          aria-label="Incident guard"
        >
          {guards.length === 0 ? <option value="">No guards available</option> : null}
          {guards.map((guard) => (
            <option key={String(guard.id)} value={String(guard.id)}>
              {guard.name ? String(guard.name) : `Guard #${guard.id}`}
            </option>
          ))}
        </select>
        <select
          value={selectedIncidentSiteId}
          onChange={(event) => setSelectedIncidentSiteId(event.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
          disabled={reporting || sites.length === 0}
          aria-label="Incident site"
        >
          {sites.length === 0 ? <option value="">No sites available</option> : null}
          {sites.map((site) => (
            <option key={String(site.id)} value={String(site.id)}>
              {site.name ? String(site.name) : `Site #${site.id}`}
            </option>
          ))}
        </select>
        <textarea
          value={incidentDescription}
          onChange={(event) => setIncidentDescription(event.target.value)}
          placeholder="Describe the incident"
          className="min-h-24 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
          disabled={reporting}
        />
        <button
          type="button"
          onClick={() => void onReportIncident()}
          disabled={
            reporting ||
            !selectedIncidentGuardId ||
            !selectedIncidentSiteId ||
            !incidentDescription.trim() ||
            guards.length === 0 ||
            sites.length === 0
          }
          className="w-fit rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {reporting ? "Reporting..." : "Report Incident"}
        </button>
      </div>

      <div className="mt-4">
        {loading ? <StateText>Loading incidents...</StateText> : null}
        {!loading && error ? <StateText tone="error">Failed to load incidents: {error}</StateText> : null}
        {!loading && !error && incidents.length === 0 ? <StateText>No incidents found</StateText> : null}
        {!loading && !error && incidents.length > 0 ? (
          <ul className="space-y-2">
            {incidents.map((incident) => (
              <li key={String(incident.id)} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-sm font-medium">{getIncidentGuardName(incident)}</p>
                <p className="text-xs text-slate-600">{getIncidentSiteName(incident)}</p>
                <p className="mt-1 text-sm text-slate-700">{incident.description ?? "No description"}</p>
                <p className="mt-1 text-xs text-slate-500">{new Date(incident.created_at).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </Panel>
  );
}
