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
  onUpdateCompany: (companyId: string, name: string) => Promise<void>;
  onDeleteCompany: (companyId: string) => Promise<void>;
  companyActionId: string | null;
};

export function CompaniesSection({
  companies,
  loading,
  error,
  adding,
  newCompanyName,
  setNewCompanyName,
  onAddCompany,
  onUpdateCompany,
  onDeleteCompany,
  companyActionId,
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
                className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
              >
                <span>{company.name ? String(company.name) : `Company #${company.id}`}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const nextName = window.prompt(
                        "Update company name",
                        company.name ? String(company.name) : ""
                      );
                      if (nextName && nextName.trim()) {
                        void onUpdateCompany(String(company.id), nextName);
                      }
                    }}
                    disabled={companyActionId === String(company.id)}
                    className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const confirmed = window.confirm(
                        "Delete this company? This can fail if related guards/sites exist."
                      );
                      if (confirmed) {
                        void onDeleteCompany(String(company.id));
                      }
                    }}
                    disabled={companyActionId === String(company.id)}
                    className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </Panel>
  );
}
