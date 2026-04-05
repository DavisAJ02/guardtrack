"use client";

import { DashboardShell } from "@/components/dashboard-shell";
import { CheckInsSection } from "@/features/dashboard/components/checkins-section";
import { CompaniesSection } from "@/features/dashboard/components/companies-section";
import { GuardsSection } from "@/features/dashboard/components/guards-section";
import { IncidentsSection } from "@/features/dashboard/components/incidents-section";
import { ShiftsSection } from "@/features/dashboard/components/shifts-section";
import { SitesSection } from "@/features/dashboard/components/sites-section";
import { StatsCards } from "@/features/dashboard/components/stats-cards";
import { useDashboardData } from "@/features/dashboard/useDashboardData";

export default function Home() {
  const data = useDashboardData();

  return (
    <DashboardShell
      title="Executive Dashboard"
      subtitle="Operational control for guards, sites, shifts, and live safety events."
    >
      <StatsCards stats={data.stats} loading={data.statsLoading} error={data.statsError} />

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
        shiftActionId={data.shiftActionId}
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
    </DashboardShell>
  );
}
