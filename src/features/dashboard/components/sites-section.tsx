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
  onUpdateSite: (siteId: string, name: string) => Promise<void>;
  onDeleteSite: (siteId: string) => Promise<void>;
  siteActionId: string | null;
  canManage: boolean;
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
  onUpdateSite,
  onDeleteSite,
  siteActionId,
  canManage,
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
          disabled={adding || !canManage}
          aria-label="Site name"
        />
        <select
          value={selectedSiteCompanyId}
          onChange={(event) => setSelectedSiteCompanyId(event.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
          disabled={adding || companies.length === 0 || !canManage}
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
          disabled={
            adding || !newSiteName.trim() || !selectedSiteCompanyId || companies.length === 0 || !canManage
          }
          className="w-fit rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {adding ? "Adding..." : "Add Site"}
        </button>
      </div>
      {!canManage ? <StateText>Read-only for your role.</StateText> : null}

      <div className="mt-4">
        {loading ? <StateText>Loading sites...</StateText> : null}
        {!loading && error ? <StateText tone="error">Failed to load sites: {error}</StateText> : null}
        {!loading && !error && sites.length === 0 ? <StateText>No sites found</StateText> : null}
        {!loading && !error && sites.length > 0 ? (
          <ul className="space-y-2">
            {sites.map((site) => (
              <li
                key={String(site.id)}
                className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium">{site.name ? String(site.name) : `Site #${site.id}`}</p>
                  <p className="text-xs text-slate-600">{getSiteCompanyName(site)}</p>
                </div>
                {canManage ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const nextName = window.prompt(
                          "Update site name",
                          site.name ? String(site.name) : ""
                        );
                        if (nextName && nextName.trim()) {
                          void onUpdateSite(String(site.id), nextName);
                        }
                      }}
                      disabled={siteActionId === String(site.id)}
                      className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const confirmed = window.confirm(
                          "Delete this site? This can fail if related shifts/check-ins/incidents exist."
                        );
                        if (confirmed) {
                          void onDeleteSite(String(site.id));
                        }
                      }}
                      disabled={siteActionId === String(site.id)}
                      className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </Panel>
  );
}
