import { useState } from "react";
import type { Company, Guard } from "@/features/dashboard/types";
import { getGuardCompanyName } from "@/features/dashboard/utils";
import { Modal, Panel, StateText } from "@/features/dashboard/components/ui";

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
  onUpdateGuard: (guardId: string, name: string) => Promise<void>;
  onDeleteGuard: (guardId: string) => Promise<void>;
  guardActionId: string | null;
  canManage: boolean;
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
  onUpdateGuard,
  onDeleteGuard,
  guardActionId,
  canManage,
}: GuardsSectionProps) {
  const [editingGuardId, setEditingGuardId] = useState<string | null>(null);
  const [editingGuardName, setEditingGuardName] = useState("");

  const openEditModal = (guard: Guard) => {
    setEditingGuardId(String(guard.id));
    setEditingGuardName(guard.name ? String(guard.name) : "");
  };

  const closeEditModal = () => {
    setEditingGuardId(null);
    setEditingGuardName("");
  };

  return (
    <Panel title="Guard Management" description="Add and review security personnel">
      <div className="flex flex-col gap-3">
        <input
          type="text"
          value={newGuardName}
          onChange={(event) => setNewGuardName(event.target.value)}
          placeholder="Enter guard name"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
          disabled={adding || !canManage}
          aria-label="Guard name"
        />
        <select
          value={selectedCompanyId}
          onChange={(event) => setSelectedCompanyId(event.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
          disabled={adding || companies.length === 0 || !canManage}
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
          disabled={
            adding || !newGuardName.trim() || !selectedCompanyId || companies.length === 0 || !canManage
          }
          className="w-fit rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {adding ? "Adding..." : "Add Guard"}
        </button>
      </div>
      {!canManage ? <StateText>Read-only for your role.</StateText> : null}

      <div className="mt-4">
        {loading ? <StateText>Loading guards...</StateText> : null}
        {!loading && error ? <StateText tone="error">Failed to load guards: {error}</StateText> : null}
        {!loading && !error && guards.length === 0 ? <StateText>No guards found</StateText> : null}
        {!loading && !error && guards.length > 0 ? (
          <ul className="space-y-2">
            {guards.map((guard) => (
              <li
                key={String(guard.id)}
                className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium">
                    {guard.name ? String(guard.name) : `Guard #${guard.id}`}
                  </p>
                  <p className="text-xs text-slate-600">{getGuardCompanyName(guard)}</p>
                </div>
                {canManage ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(guard)}
                      disabled={guardActionId === String(guard.id)}
                      className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const confirmed = window.confirm(
                          "Delete this guard? This can fail if related shifts/check-ins/incidents exist."
                        );
                        if (confirmed) {
                          void onDeleteGuard(String(guard.id));
                        }
                      }}
                      disabled={guardActionId === String(guard.id)}
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

      <Modal open={Boolean(editingGuardId)} title="Edit Guard" onClose={closeEditModal}>
        <div className="space-y-3">
          <label className="block text-sm">
            <span className="mb-1 block text-slate-600">Guard name</span>
            <input
              type="text"
              value={editingGuardName}
              onChange={(event) => setEditingGuardName(event.target.value)}
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
                if (!editingGuardId || !editingGuardName.trim()) return;
                void onUpdateGuard(editingGuardId, editingGuardName);
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
