"use client";

import { DashboardShell, useDashboardAuth } from "@/components/dashboard-shell";
import { canManageCore } from "@/features/auth/roles";
import { ActionToast } from "@/features/dashboard/components/action-toast";
import { ShiftsSection } from "@/features/dashboard/components/shifts-section";
import { useDashboardData } from "@/features/dashboard/useDashboardData";

function ShiftsContent({ data }: { data: ReturnType<typeof useDashboardData> }) {
  const { role } = useDashboardAuth();
  const canManage = canManageCore(role);

  return (
    <>
      <ShiftsSection
        shifts={data.shifts}
        guards={data.guards}
        sites={data.sites}
        loading={data.shiftsLoading}
        error={data.shiftsError}
        assigning={data.assigningShift}
        selectedGuardId={data.selectedGuardId}
        selectedShiftSiteId={data.selectedShiftSiteId}
        setSelectedGuardId={data.setSelectedGuardId}
        setSelectedShiftSiteId={data.setSelectedShiftSiteId}
        onAssignGuard={data.handleAssignGuard}
        onDeleteShift={data.handleDeleteShift}
        onReassignShift={data.handleReassignShift}
        shiftActionId={data.shiftActionId}
        canManage={canManage}
      />
      <ActionToast actionMessage={data.actionMessage} onClose={data.clearActionMessage} />
    </>
  );
}

export default function ShiftsPage() {
  const data = useDashboardData();

  return (
    <DashboardShell title="Shift Operations" subtitle="Assign, reassign, and supervise active shifts.">
      <ShiftsContent data={data} />
    </DashboardShell>
  );
}
