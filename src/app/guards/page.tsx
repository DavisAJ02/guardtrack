"use client";

import { DashboardShell, useDashboardAuth } from "@/components/dashboard-shell";
import { canManageCore } from "@/features/auth/roles";
import { ActionToast } from "@/features/dashboard/components/action-toast";
import { GuardsSection } from "@/features/dashboard/components/guards-section";
import { useDashboardData } from "@/features/dashboard/useDashboardData";

function GuardsContent({ data }: { data: ReturnType<typeof useDashboardData> }) {
  const { role } = useDashboardAuth();
  const canManage = canManageCore(role);

  return (
    <>
      <GuardsSection
        guards={data.guards}
        companies={data.companies}
        loading={data.guardsLoading}
        error={data.guardsError}
        adding={data.addingGuard}
        newGuardName={data.newGuardName}
        selectedCompanyId={data.selectedCompanyId}
        setNewGuardName={data.setNewGuardName}
        setSelectedCompanyId={data.setSelectedCompanyId}
        onAddGuard={data.handleAddGuard}
        onUpdateGuard={data.handleUpdateGuard}
        onDeleteGuard={data.handleDeleteGuard}
        guardActionId={data.guardActionId}
        canManage={canManage}
      />
      <ActionToast actionMessage={data.actionMessage} onClose={data.clearActionMessage} />
    </>
  );
}

export default function GuardsPage() {
  const data = useDashboardData();

  return (
    <DashboardShell title="Guard Management" subtitle="Manage guard roster and assignments.">
      <GuardsContent data={data} />
    </DashboardShell>
  );
}
