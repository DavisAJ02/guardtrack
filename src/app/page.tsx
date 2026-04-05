"use client";

import { DashboardShell } from "@/components/dashboard-shell";
import { canManageCore } from "@/features/auth/roles";
import { ActivityLogPanel } from "@/features/dashboard/components/activity-log-panel";
import { ArchivedEntitiesPanel } from "@/features/dashboard/components/archived-entities-panel";
import { CheckInsSection } from "@/features/dashboard/components/checkins-section";
import { CompaniesSection } from "@/features/dashboard/components/companies-section";
import { GuardsSection } from "@/features/dashboard/components/guards-section";
import { IncidentsSection } from "@/features/dashboard/components/incidents-section";
import { RealtimeHealthPanel } from "@/features/dashboard/components/realtime-health-panel";
import { ShiftsSection } from "@/features/dashboard/components/shifts-section";
import { SitesSection } from "@/features/dashboard/components/sites-section";
import { StatsCards } from "@/features/dashboard/components/stats-cards";
import { StateText } from "@/features/dashboard/components/ui";
import { useDashboardData } from "@/features/dashboard/useDashboardData";
import { useDashboardAuth } from "@/components/dashboard-shell";

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

      <IncidentsSection
        incidents={data.incidents}
        guards={data.guards}
        sites={data.sites}
        loading={data.incidentsLoading}
        error={data.incidentsError}
        reporting={data.reportingIncident}
        selectedIncidentGuardId={data.selectedIncidentGuardId}
        selectedIncidentSiteId={data.selectedIncidentSiteId}
        incidentDescription={data.incidentDescription}
        setSelectedIncidentGuardId={data.setSelectedIncidentGuardId}
        setSelectedIncidentSiteId={data.setSelectedIncidentSiteId}
        setIncidentDescription={data.setIncidentDescription}
        onReportIncident={data.handleReportIncident}
      />

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

      {data.actionMessage ? (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-lg">
          <div className="flex items-start justify-between gap-3">
            <StateText tone={data.actionMessage.type === "error" ? "error" : "neutral"}>
              {data.actionMessage.text}
            </StateText>
            <button
              type="button"
              onClick={data.clearActionMessage}
              className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-600 hover:bg-slate-100"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default function Home() {
  const data = useDashboardData();

  return (
    <DashboardShell
      title="Executive Dashboard"
      subtitle="Operational control for guards, sites, shifts, and live safety events."
    >
      <DashboardContent data={data} />
    </DashboardShell>
  );
}
