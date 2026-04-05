"use client";

import { DashboardShell } from "@/components/dashboard-shell";
import { canManageCore } from "@/features/auth/roles";
import { ActivityLogPanel } from "@/features/dashboard/components/activity-log-panel";
import { ArchivedEntitiesPanel } from "@/features/dashboard/components/archived-entities-panel";
import { ManagementShortcuts } from "@/features/dashboard/components/management-shortcuts";
import { RealtimeHealthPanel } from "@/features/dashboard/components/realtime-health-panel";
import { StatsCards } from "@/features/dashboard/components/stats-cards";
import { useDashboardData } from "@/features/dashboard/useDashboardData";
import { useDashboardAuth } from "@/components/dashboard-shell";
import { ActionToast } from "@/features/dashboard/components/action-toast";

function DashboardContent({ data }: { data: ReturnType<typeof useDashboardData> }) {
  const { role } = useDashboardAuth();
  const canManage = canManageCore(role);

  return (
    <>
      <StatsCards stats={data.stats} loading={data.statsLoading} error={data.statsError} />
      <RealtimeHealthPanel
        status={data.realtimeStatus}
        lastSyncedAt={data.lastRealtimeSyncAt}
      />
      <ManagementShortcuts />

      <ActivityLogPanel
        logs={data.activityLogs}
        loading={data.activityLogsLoading}
        error={data.activityLogsError}
      />

      <ArchivedEntitiesPanel
        supportsSoftDelete={data.supportsSoftDelete}
        loading={data.archivedLoading}
        error={data.archivedError}
        canManage={canManage}
        companies={data.archivedCompanies}
        guards={data.archivedGuards}
        sites={data.archivedSites}
        shifts={data.archivedShifts}
        companyActionId={data.companyActionId}
        guardActionId={data.guardActionId}
        siteActionId={data.siteActionId}
        shiftActionId={data.shiftActionId}
        onRestoreCompany={data.handleRestoreCompany}
        onRestoreGuard={data.handleRestoreGuard}
        onRestoreSite={data.handleRestoreSite}
        onRestoreShift={data.handleRestoreShift}
      />

      <ActionToast actionMessage={data.actionMessage} onClose={data.clearActionMessage} />
    </>
  );
}

export default function Home() {
  const data = useDashboardData();

  return (
    <DashboardShell
      title="Executive Dashboard"
      subtitle="High-level command center with KPIs, system health, and quick navigation."
    >
      <DashboardContent data={data} />
    </DashboardShell>
  );
}
