import type { Company } from "@/features/dashboard/types";
import { Panel, StateText } from "@/features/dashboard/components/ui";

type CompaniesSectionProps = {
  companies: Company[];
  loading: boolean;
  error: string | null;
  adding: boolean;
  newCompanyName: string;
  setNewCompanyName: (value: string) => void;
  onAddCompany: () => Promise<void>;
};

export function CompaniesSection({
  companies,
  loading,
  error,
  adding,
  newCompanyName,
  setNewCompanyName,
  onAddCompany,
}: CompaniesSectionProps) {
  return (
    <Panel title="Companies" description="Manage clients and business entities">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={newCompanyName}
          onChange={(event) => setNewCompanyName(event.target.value)}
          placeholder="Enter company name"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
          disabled={adding}
          aria-label="Company name"
        />
        <button
          type="button"
          onClick={() => void onAddCompany()}
          disabled={adding || !newCompanyName.trim()}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {adding ? "Adding..." : "Add Company"}
        </button>
      </div>

      <div className="mt-4">
        {loading ? <StateText>Loading companies...</StateText> : null}
        {!loading && error ? <StateText tone="error">Failed to load companies: {error}</StateText> : null}
        {!loading && !error && companies.length === 0 ? <StateText>No companies found</StateText> : null}
        {!loading && !error && companies.length > 0 ? (
          <ul className="space-y-2">
            {companies.map((company) => (
              <li
                key={String(company.id)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
              >
                {company.name ? String(company.name) : `Company #${company.id}`}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </Panel>
  );
}
