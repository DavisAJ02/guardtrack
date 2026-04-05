"use client";

import { DashboardShell } from "@/components/dashboard-shell";
import { ActionToast } from "@/features/dashboard/components/action-toast";
import { IncidentsSection } from "@/features/dashboard/components/incidents-section";
import { useDashboardData } from "@/features/dashboard/useDashboardData";

export default function IncidentsPage() {
  const data = useDashboardData();

  return (
    <DashboardShell
      title="Incident Center"
      subtitle="Capture, review, and monitor operational incidents in one place."
    >
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
      <ActionToast actionMessage={data.actionMessage} onClose={data.clearActionMessage} />
    </DashboardShell>
  );
}
