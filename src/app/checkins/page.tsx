"use client";

import { DashboardShell } from "@/components/dashboard-shell";
import { ActionToast } from "@/features/dashboard/components/action-toast";
import { CheckInsSection } from "@/features/dashboard/components/checkins-section";
import { useDashboardData } from "@/features/dashboard/useDashboardData";

export default function CheckInsPage() {
  const data = useDashboardData();

  return (
    <DashboardShell
      title="Check-In Monitor"
      subtitle="Track field check-ins, location evidence, and timeline freshness."
    >
      <CheckInsSection
        checkIns={data.checkIns}
        guards={data.guards}
        sites={data.sites}
        loading={data.checkInsLoading}
        error={data.checkInsError}
        checkingIn={data.checkingIn}
        selectedGuardId={data.selectedGuardId}
        selectedShiftSiteId={data.selectedShiftSiteId}
        onCheckIn={data.handleCheckIn}
      />
      <ActionToast actionMessage={data.actionMessage} onClose={data.clearActionMessage} />
    </DashboardShell>
  );
}
