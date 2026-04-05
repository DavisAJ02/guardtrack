import type { Company, Guard } from "@/features/dashboard/types";
import { getGuardCompanyName } from "@/features/dashboard/utils";
import { Panel, StateText } from "@/features/dashboard/components/ui";

type GuardsSectionProps = {
  guards: Guard[];
  companies: Company[];
  loading: boolean;
  error: string | null;
  adding: boolean;
  newGuardName: string;
  selectedCompanyId: string;
  setNewGuardName: (value: string) => void;
  setSelectedCompanyId: (value: string) => void;
  onAddGuard: () => Promise<void>;
};

export function GuardsSection({
  guards,
  companies,
  loading,
  error,
  adding,
  newGuardName,
  selectedCompanyId,
  setNewGuardName,
  setSelectedCompanyId,
  onAddGuard,
}: GuardsSectionProps) {
  return (
    <Panel title="Guard Management" description="Add and review security personnel">
      <div className="flex flex-col gap-3">
        <input
          type="text"
          value={newGuardName}
          onChange={(event) => setNewGuardName(event.target.value)}
          placeholder="Enter guard name"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
          disabled={adding}
          aria-label="Guard name"
        />
        <select
          value={selectedCompanyId}
          onChange={(event) => setSelectedCompanyId(event.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
          disabled={adding || companies.length === 0}
          aria-label="Guard company"
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
          onClick={() => void onAddGuard()}
          disabled={adding || !newGuardName.trim() || !selectedCompanyId || companies.length === 0}
          className="w-fit rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {adding ? "Adding..." : "Add Guard"}
        </button>
      </div>

      <div className="mt-4">
        {loading ? <StateText>Loading guards...</StateText> : null}
        {!loading && error ? <StateText tone="error">Failed to load guards: {error}</StateText> : null}
        {!loading && !error && guards.length === 0 ? <StateText>No guards found</StateText> : null}
        {!loading && !error && guards.length > 0 ? (
          <ul className="space-y-2">
            {guards.map((guard) => (
              <li key={String(guard.id)} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-sm font-medium">
                  {guard.name ? String(guard.name) : `Guard #${guard.id}`}
                </p>
                <p className="text-xs text-slate-600">{getGuardCompanyName(guard)}</p>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </Panel>
  );
}
