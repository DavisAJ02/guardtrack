import { Panel, StateText } from "@/features/dashboard/components/ui";

type RealtimeStatus = "connecting" | "connected" | "error";

export function RealtimeHealthPanel({
  status,
  lastSyncedAt,
}: {
  status: RealtimeStatus;
  lastSyncedAt: string | null;
}) {
  const statusLabel =
    status === "connected" ? "Connected" : status === "error" ? "Disconnected" : "Connecting";
  const statusTone =
    status === "connected" ? "text-emerald-700 bg-emerald-50 border-emerald-200" : status === "error"
      ? "text-red-700 bg-red-50 border-red-200"
      : "text-amber-700 bg-amber-50 border-amber-200";

  return (
    <Panel title="Realtime Health" description="Live subscription and synchronization status">
      <div className="flex flex-wrap items-center gap-3">
        <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusTone}`}>
          {statusLabel}
        </span>
        <StateText>
          Last sync: {lastSyncedAt ? new Date(lastSyncedAt).toLocaleString() : "Not synced yet"}
        </StateText>
      </div>
    </Panel>
  );
}
