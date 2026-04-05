import type { Company, Guard, Shift, Site } from "@/features/dashboard/types";
import { Panel, StateText } from "@/features/dashboard/components/ui";

type ArchivedEntitiesPanelProps = {
  supportsSoftDelete: boolean;
  loading: boolean;
  error: string | null;
  canManage: boolean;
  companies: Company[];
  guards: Guard[];
  sites: Site[];
  shifts: Shift[];
  companyActionId: string | null;
  guardActionId: string | null;
  siteActionId: string | null;
  shiftActionId: string | null;
  onRestoreCompany: (id: string) => Promise<void>;
  onRestoreGuard: (id: string) => Promise<void>;
  onRestoreSite: (id: string) => Promise<void>;
  onRestoreShift: (id: string) => Promise<void>;
};

const renderList = (
  title: string,
  items: Array<{ id: string | number; name: string }>,
  actionId: string | null,
  onRestore: (id: string) => Promise<void>,
  canManage: boolean
) => (
  <section className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
    <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
    {items.length === 0 ? (
      <StateText>None archived.</StateText>
    ) : (
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={String(item.id)} className="flex items-center justify-between gap-3 rounded-md bg-white px-3 py-2">
            <span className="text-sm text-slate-700">{item.name}</span>
            {canManage ? (
              <button
                type="button"
                onClick={() => void onRestore(String(item.id))}
                disabled={actionId === String(item.id)}
                className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Restore
              </button>
            ) : null}
          </li>
        ))}
      </ul>
    )}
  </section>
);

export function ArchivedEntitiesPanel({
  supportsSoftDelete,
  loading,
  error,
  canManage,
  companies,
  guards,
  sites,
  shifts,
  companyActionId,
  guardActionId,
  siteActionId,
  shiftActionId,
  onRestoreCompany,
  onRestoreGuard,
  onRestoreSite,
  onRestoreShift,
}: ArchivedEntitiesPanelProps) {
  return (
    <Panel title="Archive Vault" description="Restore soft-deleted entities when needed">
      {!supportsSoftDelete ? (
        <StateText>Soft-delete columns are not available yet. Run the latest migration.</StateText>
      ) : null}
      {loading ? <StateText>Loading archived entities...</StateText> : null}
      {!loading && error ? <StateText tone="error">Failed to load archive: {error}</StateText> : null}

      {!loading && !error && supportsSoftDelete ? (
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          {renderList(
            "Archived Companies",
            companies.map((company) => ({
              id: company.id,
              name: company.name ?? `Company #${company.id}`,
            })),
            companyActionId,
            onRestoreCompany,
            canManage
          )}
          {renderList(
            "Archived Guards",
            guards.map((guard) => ({
              id: guard.id,
              name: guard.name ?? `Guard #${guard.id}`,
            })),
            guardActionId,
            onRestoreGuard,
            canManage
          )}
          {renderList(
            "Archived Sites",
            sites.map((site) => ({
              id: site.id,
              name: site.name ?? `Site #${site.id}`,
            })),
            siteActionId,
            onRestoreSite,
            canManage
          )}
          {renderList(
            "Archived Shifts",
            shifts.map((shift) => ({
              id: shift.id,
              name: `Shift #${shift.id}`,
            })),
            shiftActionId,
            onRestoreShift,
            canManage
          )}
        </div>
      ) : null}
    </Panel>
  );
}
