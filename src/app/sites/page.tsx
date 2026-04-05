"use client";

import { DashboardShell, useDashboardAuth } from "@/components/dashboard-shell";
import { canManageCore } from "@/features/auth/roles";
import { ActionToast } from "@/features/dashboard/components/action-toast";
import { SitesSection } from "@/features/dashboard/components/sites-section";
import { useDashboardData } from "@/features/dashboard/useDashboardData";

function SitesContent({ data }: { data: ReturnType<typeof useDashboardData> }) {
  const { role } = useDashboardAuth();
  const canManage = canManageCore(role);

  return (
    <>
      <SitesSection
        sites={data.sites}
        companies={data.companies}
        loading={data.sitesLoading}
        error={data.sitesError}
        adding={data.addingSite}
        newSiteName={data.newSiteName}
        selectedSiteCompanyId={data.selectedSiteCompanyId}
        setNewSiteName={data.setNewSiteName}
        setSelectedSiteCompanyId={data.setSelectedSiteCompanyId}
        onAddSite={data.handleAddSite}
        onUpdateSite={data.handleUpdateSite}
        onDeleteSite={data.handleDeleteSite}
        siteActionId={data.siteActionId}
        canManage={canManage}
      />
      <ActionToast actionMessage={data.actionMessage} onClose={data.clearActionMessage} />
    </>
  );
}

export default function SitesPage() {
  const data = useDashboardData();

  return (
    <DashboardShell title="Site Management" subtitle="Manage coverage sites and location hierarchy.">
      <SitesContent data={data} />
    </DashboardShell>
  );
}
