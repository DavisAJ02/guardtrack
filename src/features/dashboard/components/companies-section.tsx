import { useState } from "react";
import type { Company } from "@/features/dashboard/types";
import { Modal, Panel, StateText } from "@/features/dashboard/components/ui";

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
  canManage: boolean;
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
  canManage,
}: CompaniesSectionProps) {
  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null);
  const [editingCompanyName, setEditingCompanyName] = useState("");

  const openEditModal = (company: Company) => {
    setEditingCompanyId(String(company.id));
    setEditingCompanyName(company.name ? String(company.name) : "");
  };

  const closeEditModal = () => {
    setEditingCompanyId(null);
    setEditingCompanyName("");
  };

  return (
    <Panel title="Companies" description="Manage clients and business entities">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={newCompanyName}
          onChange={(event) => setNewCompanyName(event.target.value)}
          placeholder="Enter company name"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
          disabled={adding || !canManage}
          aria-label="Company name"
        />
        <button
          type="button"
          onClick={() => void onAddCompany()}
          disabled={adding || !newCompanyName.trim() || !canManage}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {adding ? "Adding..." : "Add Company"}
        </button>
      </div>
      {!canManage ? <StateText>Read-only for your role.</StateText> : null}

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
                {canManage ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(company)}
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
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <Modal open={Boolean(editingCompanyId)} title="Edit Company" onClose={closeEditModal}>
        <div className="space-y-3">
          <label className="block text-sm">
            <span className="mb-1 block text-slate-600">Company name</span>
            <input
              type="text"
              value={editingCompanyName}
              onChange={(event) => setEditingCompanyName(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
            />
          </label>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={closeEditModal}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                if (!editingCompanyId || !editingCompanyName.trim()) return;
                void onUpdateCompany(editingCompanyId, editingCompanyName);
                closeEditModal();
              }}
              className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
            >
              Save
            </button>
          </div>
        </div>
      </Modal>
    </Panel>
  );
}
