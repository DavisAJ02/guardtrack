import type { CheckIn, Guard, Site } from "@/features/dashboard/types";
import { getCheckInGuardName, getCheckInSiteName } from "@/features/dashboard/utils";
import { Panel, StateText } from "@/features/dashboard/components/ui";

type CheckInsSectionProps = {
  checkIns: CheckIn[];
  guards: Guard[];
  sites: Site[];
  loading: boolean;
  error: string | null;
  checkingIn: boolean;
  selectedGuardId: string;
  selectedShiftSiteId: string;
  onCheckIn: () => Promise<void>;
};

export function CheckInsSection({
  checkIns,
  guards,
  sites,
  loading,
  error,
  checkingIn,
  selectedGuardId,
  selectedShiftSiteId,
  onCheckIn,
}: CheckInsSectionProps) {
  return (
    <Panel title="Check-Ins" description="Track the most recent guard activity">
      <button
        type="button"
        onClick={() => void onCheckIn()}
        disabled={checkingIn || !selectedGuardId || !selectedShiftSiteId || guards.length === 0 || sites.length === 0}
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {checkingIn ? "Checking In..." : "Check In"}
      </button>

      <div className="mt-4">
        {loading ? <StateText>Loading check-ins...</StateText> : null}
        {!loading && error ? <StateText tone="error">Failed to load check-ins: {error}</StateText> : null}
        {!loading && !error && checkIns.length === 0 ? <StateText>No check-ins found</StateText> : null}
        {!loading && !error && checkIns.length > 0 ? (
          <ul className="space-y-2">
            {checkIns.map((checkIn) => (
              <li key={String(checkIn.id)} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-sm font-medium">{getCheckInGuardName(checkIn)}</p>
                <p className="text-xs text-slate-600">{getCheckInSiteName(checkIn)}</p>
                <p className="text-xs text-slate-600">GPS: {checkIn.gps_location ?? "Not available"}</p>
                <p className="text-xs text-slate-500">{new Date(checkIn.created_at).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </Panel>
  );
}
