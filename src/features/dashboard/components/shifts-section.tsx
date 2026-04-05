import type { Guard, Shift, Site } from "@/features/dashboard/types";
import { getShiftGuardName, getShiftSiteName } from "@/features/dashboard/utils";
import { Panel, StateText } from "@/features/dashboard/components/ui";

type ShiftsSectionProps = {
  shifts: Shift[];
  guards: Guard[];
  sites: Site[];
  loading: boolean;
  error: string | null;
  assigning: boolean;
  selectedGuardId: string;
  selectedShiftSiteId: string;
  setSelectedGuardId: (value: string) => void;
  setSelectedShiftSiteId: (value: string) => void;
  onAssignGuard: () => Promise<void>;
  onDeleteShift: (shiftId: string) => Promise<void>;
  onReassignShift: (shiftId: string, guardId: string, siteId: string) => Promise<void>;
  shiftActionId: string | null;
  canManage: boolean;
};

export function ShiftsSection({
  shifts,
  guards,
  sites,
  loading,
  error,
  assigning,
  selectedGuardId,
  selectedShiftSiteId,
  setSelectedGuardId,
  setSelectedShiftSiteId,
  onAssignGuard,
  onDeleteShift,
  onReassignShift,
  shiftActionId,
  canManage,
}: ShiftsSectionProps) {
  return (
    <Panel title="Shift Assignment" description="Assign guards to active site shifts">
      <div className="flex flex-col gap-3">
        <select
          value={selectedGuardId}
          onChange={(event) => setSelectedGuardId(event.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
          disabled={assigning || guards.length === 0 || !canManage}
          aria-label="Select guard for shift"
        >
          {guards.length === 0 ? <option value="">No guards available</option> : null}
          {guards.map((guard) => (
            <option key={String(guard.id)} value={String(guard.id)}>
              {guard.name ? String(guard.name) : `Guard #${guard.id}`}
            </option>
          ))}
        </select>
        <select
          value={selectedShiftSiteId}
          onChange={(event) => setSelectedShiftSiteId(event.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
          disabled={assigning || sites.length === 0 || !canManage}
          aria-label="Select site for shift"
        >
          {sites.length === 0 ? <option value="">No sites available</option> : null}
          {sites.map((site) => (
            <option key={String(site.id)} value={String(site.id)}>
              {site.name ? String(site.name) : `Site #${site.id}`}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => void onAssignGuard()}
          disabled={
            assigning || !selectedGuardId || !selectedShiftSiteId || guards.length === 0 || sites.length === 0 || !canManage
          }
          className="w-fit rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {assigning ? "Assigning..." : "Assign Guard"}
        </button>
      </div>
      {!canManage ? <StateText>Read-only for your role.</StateText> : null}

      <div className="mt-4">
        {loading ? <StateText>Loading shifts...</StateText> : null}
        {!loading && error ? <StateText tone="error">Failed to load shifts: {error}</StateText> : null}
        {!loading && !error && shifts.length === 0 ? <StateText>No shifts found</StateText> : null}
        {!loading && !error && shifts.length > 0 ? (
          <ul className="space-y-2">
            {shifts.map((shift) => (
              <li
                key={String(shift.id)}
                className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium">{getShiftGuardName(shift)}</p>
                  <p className="text-xs text-slate-600">{getShiftSiteName(shift)}</p>
                </div>
                {canManage ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const nextGuardId = window.prompt(
                          "Reassign guard ID",
                          String(shift.guard_id ?? "")
                        );
                        if (!nextGuardId?.trim()) return;
                        const nextSiteId = window.prompt(
                          "Reassign site ID",
                          String(shift.site_id ?? "")
                        );
                        if (!nextSiteId?.trim()) return;
                        void onReassignShift(String(shift.id), nextGuardId, nextSiteId);
                      }}
                      disabled={shiftActionId === String(shift.id)}
                      className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Reassign
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const confirmed = window.confirm("Delete this shift assignment?");
                        if (confirmed) {
                          void onDeleteShift(String(shift.id));
                        }
                      }}
                      disabled={shiftActionId === String(shift.id)}
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
