"use client";

import { DashboardShell, useDashboardAuth } from "@/components/dashboard-shell";
import { canManageCore } from "@/features/auth/roles";
import { ActionToast } from "@/features/dashboard/components/action-toast";
import { CompaniesSection } from "@/features/dashboard/components/companies-section";
import { useDashboardData } from "@/features/dashboard/useDashboardData";

function CompaniesContent({ data }: { data: ReturnType<typeof useDashboardData> }) {
  const { role } = useDashboardAuth();
  const canManage = canManageCore(role);

  return (
    <>
      <CompaniesSection
        companies={data.companies}
        loading={data.companiesLoading}
        error={data.companiesError}
        adding={data.addingCompany}
        newCompanyName={data.newCompanyName}
        setNewCompanyName={data.setNewCompanyName}
        onAddCompany={data.handleAddCompany}
        onUpdateCompany={data.handleUpdateCompany}
        onDeleteCompany={data.handleDeleteCompany}
        companyActionId={data.companyActionId}
        canManage={canManage}
      />
      <ActionToast actionMessage={data.actionMessage} onClose={data.clearActionMessage} />
    </>
  );
}

export default function CompaniesPage() {
  const data = useDashboardData();

  return (
    <DashboardShell
      title="Company Management"
      subtitle="Manage client entities in a dedicated workspace."
    >
      <CompaniesContent data={data} />
    </DashboardShell>
  );
}
