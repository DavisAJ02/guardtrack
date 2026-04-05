import type { ActivityLog } from "@/features/dashboard/types";
import { Panel, StateText } from "@/features/dashboard/components/ui";

export function ActivityLogPanel({
  logs,
  loading,
  error,
}: {
  logs: ActivityLog[];
  loading: boolean;
  error: string | null;
}) {
  return (
    <Panel title="Activity Timeline" description="Recent operational changes and administrative actions">
      {loading ? <StateText>Loading activity logs...</StateText> : null}
      {!loading && error ? <StateText tone="error">Failed to load activity logs: {error}</StateText> : null}
      {!loading && !error && logs.length === 0 ? <StateText>No activity entries yet.</StateText> : null}
      {!loading && !error && logs.length > 0 ? (
        <ul className="space-y-2">
          {logs.map((log) => (
            <li
              key={String(log.id)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
            >
              <p className="text-sm font-medium text-slate-900">
                {log.action} {log.entity}
              </p>
              <p className="mt-1 text-xs text-slate-600">{log.details ?? "No details"}</p>
              <p className="mt-1 text-xs text-slate-500">
                Actor: {log.actor_email ?? log.actor_id ?? "system"}
              </p>
              {log.before_json || log.after_json ? (
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs text-slate-600">View payload</summary>
                  <pre className="mt-1 overflow-auto rounded-md bg-slate-900 p-2 text-[11px] text-slate-100">
                    {JSON.stringify(
                      {
                        before: log.before_json ?? null,
                        after: log.after_json ?? null,
                      },
                      null,
                      2
                    )}
                  </pre>
                </details>
              ) : null}
              <p className="mt-1 text-xs text-slate-500">
                {new Date(log.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      ) : null}
    </Panel>
  );
}
