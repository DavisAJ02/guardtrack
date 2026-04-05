import Link from "next/link";
import { Panel } from "@/features/dashboard/components/ui";

const shortcuts = [
  { href: "/companies", title: "Companies", subtitle: "Client entities and structure" },
  { href: "/guards", title: "Guards", subtitle: "Personnel roster and assignment readiness" },
  { href: "/sites", title: "Sites", subtitle: "Protected locations and coverage" },
  { href: "/shifts", title: "Shifts", subtitle: "Assignments and shift operations" },
  { href: "/checkins", title: "Check-Ins", subtitle: "Field attendance and GPS logs" },
  { href: "/incidents", title: "Incidents", subtitle: "Security events and responses" },
  { href: "/insights", title: "Insights", subtitle: "Trends, KPIs, and operational signals" },
  { href: "/reports", title: "Reports", subtitle: "Filterable exports and compliance output" },
];

export function ManagementShortcuts() {
  return (
    <Panel
      title="Operational Workspaces"
      description="Jump into dedicated pages for deep management tasks."
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {shortcuts.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:bg-slate-100"
          >
            <p className="text-sm font-semibold text-slate-900">{item.title}</p>
            <p className="mt-1 text-xs text-slate-600">{item.subtitle}</p>
          </Link>
        ))}
      </div>
    </Panel>
  );
}
