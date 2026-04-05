import type { Company, Site } from "@/features/dashboard/types";
import { getSiteCompanyName } from "@/features/dashboard/utils";
import { Panel, StateText } from "@/features/dashboard/components/ui";

type SitesSectionProps = {
  sites: Site[];
  companies: Company[];
  loading: boolean;
  error: string | null;
  adding: boolean;
  newSiteName: string;
  selectedSiteCompanyId: string;
  setNewSiteName: (value: string) => void;
  setSelectedSiteCompanyId: (value: string) => void;
  onAddSite: () => Promise<void>;
};

export function SitesSection({
  sites,
  companies,
  loading,
  error,
  adding,
  newSiteName,
  selectedSiteCompanyId,
  setNewSiteName,
  setSelectedSiteCompanyId,
  onAddSite,
}: SitesSectionProps) {
  return (
    <Panel title="Site Management" description="Create and organize guard locations">
      <div className="flex flex-col gap-3">
        <input
          type="text"
          value={newSiteName}
          onChange={(event) => setNewSiteName(event.target.value)}
          placeholder="Enter site name"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
          disabled={adding}
          aria-label="Site name"
        />
        <select
          value={selectedSiteCompanyId}
          onChange={(event) => setSelectedSiteCompanyId(event.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
          disabled={adding || companies.length === 0}
          aria-label="Site company"
        >
          {companies.length === 0 ? <option value="">No companies available</option> : null}
          {companies.map((company) => (
            <option key={String(company.id)} value={String(company.id)}>
              {company.name ? String(company.name) : `Company #${company.id}`}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => void onAddSite()}
          disabled={adding || !newSiteName.trim() || !selectedSiteCompanyId || companies.length === 0}
          className="w-fit rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {adding ? "Adding..." : "Add Site"}
        </button>
      </div>

      <div className="mt-4">
        {loading ? <StateText>Loading sites...</StateText> : null}
        {!loading && error ? <StateText tone="error">Failed to load sites: {error}</StateText> : null}
        {!loading && !error && sites.length === 0 ? <StateText>No sites found</StateText> : null}
        {!loading && !error && sites.length > 0 ? (
          <ul className="space-y-2">
            {sites.map((site) => (
              <li key={String(site.id)} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-sm font-medium">{site.name ? String(site.name) : `Site #${site.id}`}</p>
                <p className="text-xs text-slate-600">{getSiteCompanyName(site)}</p>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </Panel>
  );
}
