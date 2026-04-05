"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import type {
  CheckIn,
  Company,
  DashboardStats,
  Guard,
  Incident,
  Shift,
  Site,
} from "@/features/dashboard/types";
import { toDbId } from "@/features/dashboard/utils";

const INITIAL_STATS: DashboardStats = {
  totalCompanies: 0,
  totalGuards: 0,
  totalSites: 0,
  totalShifts: 0,
  totalIncidentsToday: 0,
};

export function useDashboardData() {
  const [actionMessage, setActionMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>(INITIAL_STATS);

  const [companies, setCompanies] = useState<Company[]>([]);
  const [guards, setGuards] = useState<Guard[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);

  const [companiesLoading, setCompaniesLoading] = useState(true);
  const [guardsLoading, setGuardsLoading] = useState(true);
  const [sitesLoading, setSitesLoading] = useState(true);
  const [shiftsLoading, setShiftsLoading] = useState(true);
  const [checkInsLoading, setCheckInsLoading] = useState(true);
  const [incidentsLoading, setIncidentsLoading] = useState(true);
  const [addingCompany, setAddingCompany] = useState(false);
  const [addingGuard, setAddingGuard] = useState(false);
  const [addingSite, setAddingSite] = useState(false);
  const [assigningShift, setAssigningShift] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);
  const [reportingIncident, setReportingIncident] = useState(false);
  const [companyActionId, setCompanyActionId] = useState<string | null>(null);
  const [guardActionId, setGuardActionId] = useState<string | null>(null);
  const [siteActionId, setSiteActionId] = useState<string | null>(null);
  const [shiftActionId, setShiftActionId] = useState<string | null>(null);

  const [newCompanyName, setNewCompanyName] = useState("");
  const [newGuardName, setNewGuardName] = useState("");
  const [newSiteName, setNewSiteName] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [selectedSiteCompanyId, setSelectedSiteCompanyId] = useState("");
  const [selectedGuardId, setSelectedGuardId] = useState("");
  const [selectedShiftSiteId, setSelectedShiftSiteId] = useState("");
  const [selectedIncidentGuardId, setSelectedIncidentGuardId] = useState("");
  const [selectedIncidentSiteId, setSelectedIncidentSiteId] = useState("");
  const [incidentDescription, setIncidentDescription] = useState("");
  const [companiesError, setCompaniesError] = useState<string | null>(null);
  const [guardsError, setGuardsError] = useState<string | null>(null);
  const [sitesError, setSitesError] = useState<string | null>(null);
  const [shiftsError, setShiftsError] = useState<string | null>(null);
  const [checkInsError, setCheckInsError] = useState<string | null>(null);
  const [incidentsError, setIncidentsError] = useState<string | null>(null);

  const companyNameById = useMemo(
    () =>
      new Map(
        companies.map((company) => [String(company.id), company.name ?? `Company #${company.id}`])
      ),
    [companies]
  );

  const guardNameById = useMemo(
    () => new Map(guards.map((guard) => [String(guard.id), guard.name ?? `Guard #${guard.id}`])),
    [guards]
  );

  const siteNameById = useMemo(
    () => new Map(sites.map((site) => [String(site.id), site.name ?? `Site #${site.id}`])),
    [sites]
  );

  const fetchCompanies = useCallback(async () => {
    setCompaniesLoading(true);
    const { data, error } = await supabase.from("companies").select("*");
    if (error) {
      setCompaniesError(error.message);
      setCompanies([]);
    } else {
      setCompaniesError(null);
      setCompanies((data as Company[]) ?? []);
    }
    setCompaniesLoading(false);
  }, []);

  const fetchGuards = useCallback(async () => {
    setGuardsLoading(true);
    const { data, error } = await supabase.from("users").select("id, name, company_id, companies(name)");
    if (error) {
      setGuardsError(error.message);
      setGuards([]);
    } else {
      setGuardsError(null);
      setGuards((data as Guard[]) ?? []);
    }
    setGuardsLoading(false);
  }, []);

  const fetchSites = useCallback(async () => {
    setSitesLoading(true);
    const { data, error } = await supabase.from("sites").select("id, name, company_id, companies(name)");
    if (error) {
      setSitesError(error.message);
      setSites([]);
    } else {
      setSitesError(null);
      setSites((data as Site[]) ?? []);
    }
    setSitesLoading(false);
  }, []);

  const fetchShifts = useCallback(async () => {
    setShiftsLoading(true);
    const { data, error } = await supabase.from("shifts").select(`
        id,
        guard_id,
        site_id,
        users(name),
        sites(name)
      `);
    if (error) {
      setShiftsError(error.message);
      setShifts([]);
    } else {
      setShiftsError(null);
      setShifts((data as Shift[]) ?? []);
    }
    setShiftsLoading(false);
  }, []);

  const fetchCheckIns = useCallback(async () => {
    setCheckInsLoading(true);
    const { data, error } = await supabase
      .from("checkins")
      .select("id, guard_id, site_id, gps_location, created_at, users(name), sites(name)")
      .order("created_at", { ascending: false });
    if (error) {
      setCheckInsError(error.message);
      setCheckIns([]);
    } else {
      setCheckInsError(null);
      setCheckIns((data as CheckIn[]) ?? []);
    }
    setCheckInsLoading(false);
  }, []);

  const fetchIncidents = useCallback(async () => {
    setIncidentsLoading(true);
    const { data, error } = await supabase
      .from("incidents")
      .select("id, guard_id, site_id, description, created_at, users(name), sites(name)")
      .order("created_at", { ascending: false });
    if (error) {
      setIncidentsError(error.message);
      setIncidents([]);
    } else {
      setIncidentsError(null);
      setIncidents((data as Incident[]) ?? []);
    }
    setIncidentsLoading(false);
  }, []);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const [companiesRes, guardsRes, sitesRes, shiftsRes, incidentsTodayRes] = await Promise.all([
      supabase.from("companies").select("*", { count: "exact", head: true }),
      supabase.from("users").select("*", { count: "exact", head: true }),
      supabase.from("sites").select("*", { count: "exact", head: true }),
      supabase.from("shifts").select("*", { count: "exact", head: true }),
      supabase
        .from("incidents")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startOfToday.toISOString()),
    ]);
    if (
      companiesRes.error ||
      guardsRes.error ||
      sitesRes.error ||
      shiftsRes.error ||
      incidentsTodayRes.error
    ) {
      setStatsError("Failed to load statistics");
      setStatsLoading(false);
      return;
    }
    setStatsError(null);
    setStats({
      totalCompanies: companiesRes.count ?? 0,
      totalGuards: guardsRes.count ?? 0,
      totalSites: sitesRes.count ?? 0,
      totalShifts: shiftsRes.count ?? 0,
      totalIncidentsToday: incidentsTodayRes.count ?? 0,
    });
    setStatsLoading(false);
  }, []);

  const refreshAll = useCallback(async () => {
    await Promise.all([
      fetchStats(),
      fetchCompanies(),
      fetchGuards(),
      fetchSites(),
      fetchShifts(),
      fetchCheckIns(),
      fetchIncidents(),
    ]);
  }, [fetchStats, fetchCompanies, fetchGuards, fetchSites, fetchShifts, fetchCheckIns, fetchIncidents]);

  const handleAddCompany = useCallback(async () => {
    const name = newCompanyName.trim();
    if (!name) return;
    setAddingCompany(true);
    const { data, error } = await supabase
      .from("companies")
      .insert([{ name }])
      .select("id, name")
      .single();
    if (!error && data) {
      setCompanies((prev) => [data as Company, ...prev]);
      setCompaniesError(null);
      setNewCompanyName("");
      await fetchStats();
    }
    setAddingCompany(false);
  }, [newCompanyName, fetchStats]);

  const resolvedSelectedCompanyId = selectedCompanyId || (companies[0] ? String(companies[0].id) : "");
  const resolvedSelectedSiteCompanyId =
    selectedSiteCompanyId || (companies[0] ? String(companies[0].id) : "");
  const resolvedSelectedGuardId = selectedGuardId || (guards[0] ? String(guards[0].id) : "");
  const resolvedSelectedShiftSiteId = selectedShiftSiteId || (sites[0] ? String(sites[0].id) : "");
  const resolvedSelectedIncidentGuardId =
    selectedIncidentGuardId || (guards[0] ? String(guards[0].id) : "");
  const resolvedSelectedIncidentSiteId =
    selectedIncidentSiteId || (sites[0] ? String(sites[0].id) : "");

  const handleAddGuard = useCallback(async () => {
    const name = newGuardName.trim();
    const activeCompanyId = selectedCompanyId || (companies[0] ? String(companies[0].id) : "");
    if (!name || !activeCompanyId) return;
    setAddingGuard(true);
    const companyId = toDbId(activeCompanyId);
    const { data, error } = await supabase
      .from("users")
      .insert([{ name, company_id: companyId }])
      .select("id, name, company_id")
      .single();
    if (!error && data) {
      setGuards((prev) => [
        { ...(data as Guard), companies: { name: companyNameById.get(String(companyId)) ?? null } },
        ...prev,
      ]);
      setGuardsError(null);
      setNewGuardName("");
      await fetchStats();
    }
    setAddingGuard(false);
  }, [newGuardName, selectedCompanyId, companies, companyNameById, fetchStats]);

  const handleUpdateCompany = useCallback(
    async (companyId: string, name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      setCompanyActionId(companyId);
      const dbId = toDbId(companyId);
      const { data, error } = await supabase
        .from("companies")
        .update({ name: trimmed })
        .eq("id", dbId)
        .select("id, name")
        .single();
      if (!error && data) {
        setCompanies((prev) =>
          prev.map((company) => (String(company.id) === companyId ? { ...company, name: data.name } : company))
        );
      setActionMessage({ type: "success", text: "Company updated." });
      } else if (error) {
        setCompaniesError(error.message);
      setActionMessage({ type: "error", text: `Company update failed: ${error.message}` });
      }
      setCompanyActionId(null);
    },
    []
  );

  const handleDeleteCompany = useCallback(async (companyId: string) => {
    setCompanyActionId(companyId);
    const dbId = toDbId(companyId);
    const { error } = await supabase.from("companies").delete().eq("id", dbId);
    if (!error) {
      setCompanies((prev) => prev.filter((company) => String(company.id) !== companyId));
      await fetchStats();
      setActionMessage({ type: "success", text: "Company deleted." });
    } else {
      setCompaniesError(error.message);
      setActionMessage({ type: "error", text: `Company delete failed: ${error.message}` });
    }
    setCompanyActionId(null);
  }, [fetchStats]);

  const handleAddSite = useCallback(async () => {
    const name = newSiteName.trim();
    const activeCompanyId =
      selectedSiteCompanyId || (companies[0] ? String(companies[0].id) : "");
    if (!name || !activeCompanyId) return;
    setAddingSite(true);
    const companyId = toDbId(activeCompanyId);
    const { data, error } = await supabase
      .from("sites")
      .insert([{ name, company_id: companyId }])
      .select("id, name, company_id")
      .single();
    if (!error && data) {
      setSites((prev) => [
        { ...(data as Site), companies: { name: companyNameById.get(String(companyId)) ?? null } },
        ...prev,
      ]);
      setSitesError(null);
      setNewSiteName("");
      await fetchStats();
    }
    setAddingSite(false);
  }, [newSiteName, selectedSiteCompanyId, companies, companyNameById, fetchStats]);

  const handleUpdateGuard = useCallback(async (guardId: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setGuardActionId(guardId);
    const dbId = toDbId(guardId);
    const { data, error } = await supabase
      .from("users")
      .update({ name: trimmed })
      .eq("id", dbId)
      .select("id, name")
      .single();
    if (!error && data) {
      setGuards((prev) =>
        prev.map((guard) => (String(guard.id) === guardId ? { ...guard, name: data.name } : guard))
      );
      setActionMessage({ type: "success", text: "Guard updated." });
    } else if (error) {
      setGuardsError(error.message);
      setActionMessage({ type: "error", text: `Guard update failed: ${error.message}` });
    }
    setGuardActionId(null);
  }, []);

  const handleDeleteGuard = useCallback(async (guardId: string) => {
    setGuardActionId(guardId);
    const dbId = toDbId(guardId);
    const { error } = await supabase.from("users").delete().eq("id", dbId);
    if (!error) {
      setGuards((prev) => prev.filter((guard) => String(guard.id) !== guardId));
      await fetchStats();
      setActionMessage({ type: "success", text: "Guard deleted." });
    } else {
      setGuardsError(error.message);
      setActionMessage({ type: "error", text: `Guard delete failed: ${error.message}` });
    }
    setGuardActionId(null);
  }, [fetchStats]);

  const handleUpdateSite = useCallback(async (siteId: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setSiteActionId(siteId);
    const dbId = toDbId(siteId);
    const { data, error } = await supabase
      .from("sites")
      .update({ name: trimmed })
      .eq("id", dbId)
      .select("id, name")
      .single();
    if (!error && data) {
      setSites((prev) => prev.map((site) => (String(site.id) === siteId ? { ...site, name: data.name } : site)));
      setActionMessage({ type: "success", text: "Site updated." });
    } else if (error) {
      setSitesError(error.message);
      setActionMessage({ type: "error", text: `Site update failed: ${error.message}` });
    }
    setSiteActionId(null);
  }, []);

  const handleDeleteSite = useCallback(async (siteId: string) => {
    setSiteActionId(siteId);
    const dbId = toDbId(siteId);
    const { error } = await supabase.from("sites").delete().eq("id", dbId);
    if (!error) {
      setSites((prev) => prev.filter((site) => String(site.id) !== siteId));
      await fetchStats();
      setActionMessage({ type: "success", text: "Site deleted." });
    } else {
      setSitesError(error.message);
      setActionMessage({ type: "error", text: `Site delete failed: ${error.message}` });
    }
    setSiteActionId(null);
  }, [fetchStats]);

  const handleAssignGuard = useCallback(async () => {
    const activeGuardId = selectedGuardId || (guards[0] ? String(guards[0].id) : "");
    const activeSiteId = selectedShiftSiteId || (sites[0] ? String(sites[0].id) : "");
    if (!activeGuardId || !activeSiteId) return;
    setAssigningShift(true);
    const guardId = toDbId(activeGuardId);
    const siteId = toDbId(activeSiteId);
    const { data, error } = await supabase
      .from("shifts")
      .insert([{ guard_id: guardId, site_id: siteId }])
      .select("id, guard_id, site_id")
      .single();
    if (!error && data) {
      setShifts((prev) => [
        {
          ...(data as Shift),
          users: { name: guardNameById.get(String(guardId)) ?? null },
          sites: { name: siteNameById.get(String(siteId)) ?? null },
        },
        ...prev,
      ]);
      setShiftsError(null);
      await fetchStats();
    }
    setAssigningShift(false);
  }, [selectedGuardId, selectedShiftSiteId, guards, sites, guardNameById, siteNameById, fetchStats]);

  const handleDeleteShift = useCallback(async (shiftId: string) => {
    setShiftActionId(shiftId);
    const dbId = toDbId(shiftId);
    const { error } = await supabase.from("shifts").delete().eq("id", dbId);
    if (!error) {
      setShifts((prev) => prev.filter((shift) => String(shift.id) !== shiftId));
      await fetchStats();
      setActionMessage({ type: "success", text: "Shift deleted." });
    } else {
      setShiftsError(error.message);
      setActionMessage({ type: "error", text: `Shift delete failed: ${error.message}` });
    }
    setShiftActionId(null);
  }, [fetchStats]);

  const handleReassignShift = useCallback(
    async (shiftId: string, guardIdValue: string, siteIdValue: string) => {
      if (!guardIdValue || !siteIdValue) return;
      setShiftActionId(shiftId);
      const shiftDbId = toDbId(shiftId);
      const guardDbId = toDbId(guardIdValue);
      const siteDbId = toDbId(siteIdValue);
      const { data, error } = await supabase
        .from("shifts")
        .update({ guard_id: guardDbId, site_id: siteDbId })
        .eq("id", shiftDbId)
        .select("id, guard_id, site_id")
        .single();
      if (!error && data) {
        setShifts((prev) =>
          prev.map((shift) =>
            String(shift.id) === shiftId
              ? {
                  ...shift,
                  guard_id: data.guard_id as string | number | null,
                  site_id: data.site_id as string | number | null,
                  users: { name: guardNameById.get(String(data.guard_id)) ?? null },
                  sites: { name: siteNameById.get(String(data.site_id)) ?? null },
                }
              : shift
          )
        );
        setActionMessage({ type: "success", text: "Shift reassigned." });
      } else if (error) {
        setShiftsError(error.message);
        setActionMessage({ type: "error", text: `Shift reassignment failed: ${error.message}` });
      }
      setShiftActionId(null);
    },
    [guardNameById, siteNameById]
  );

  const handleCheckIn = useCallback(async () => {
    const activeGuardId = selectedGuardId || (guards[0] ? String(guards[0].id) : "");
    const activeSiteId = selectedShiftSiteId || (sites[0] ? String(sites[0].id) : "");
    if (!activeGuardId || !activeSiteId) return;
    setCheckingIn(true);
    const guardId = toDbId(activeGuardId);
    const siteId = toDbId(activeSiteId);
    let gpsLocation: string | null = null;
    const getCurrentPosition = () =>
      new Promise<GeolocationPosition>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error("Geolocation is not supported by this browser."));
          return;
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });
    try {
      const position = await getCurrentPosition();
      gpsLocation = `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`;
    } catch {
      // Location is optional; inserts continue even if permission is denied.
    }
    const { data, error } = await supabase
      .from("checkins")
      .insert([{ guard_id: guardId, site_id: siteId, gps_location: gpsLocation }])
      .select("id, guard_id, site_id, gps_location, created_at")
      .single();
    if (!error && data) {
      setCheckIns((prev) => [
        {
          ...(data as CheckIn),
          users: { name: guardNameById.get(String(guardId)) ?? null },
          sites: { name: siteNameById.get(String(siteId)) ?? null },
        },
        ...prev,
      ]);
      setCheckInsError(null);
      await fetchStats();
    }
    setCheckingIn(false);
  }, [selectedGuardId, selectedShiftSiteId, guards, sites, guardNameById, siteNameById, fetchStats]);

  const handleReportIncident = useCallback(async () => {
    const description = incidentDescription.trim();
    const activeGuardId =
      selectedIncidentGuardId || (guards[0] ? String(guards[0].id) : "");
    const activeSiteId = selectedIncidentSiteId || (sites[0] ? String(sites[0].id) : "");
    if (!activeGuardId || !activeSiteId || !description) return;
    setReportingIncident(true);
    const guardId = toDbId(activeGuardId);
    const siteId = toDbId(activeSiteId);
    const { data, error } = await supabase
      .from("incidents")
      .insert([{ guard_id: guardId, site_id: siteId, description }])
      .select("id, guard_id, site_id, description, created_at")
      .single();
    if (!error && data) {
      setIncidents((prev) => [
        {
          ...(data as Incident),
          users: { name: guardNameById.get(String(guardId)) ?? null },
          sites: { name: siteNameById.get(String(siteId)) ?? null },
        },
        ...prev,
      ]);
      setIncidentsError(null);
      setIncidentDescription("");
      await fetchStats();
    }
    setReportingIncident(false);
  }, [
    incidentDescription,
    selectedIncidentGuardId,
    selectedIncidentSiteId,
    guards,
    sites,
    guardNameById,
    siteNameById,
    fetchStats,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void refreshAll();
    }, 0);
    return () => {
      clearTimeout(timer);
    };
  }, [refreshAll]);

  useEffect(() => {
    let refreshTimeout: ReturnType<typeof setTimeout> | null = null;
    const scheduleRealtimeRefresh = () => {
      if (refreshTimeout) return;
      refreshTimeout = setTimeout(() => {
        refreshTimeout = null;
        void refreshAll();
      }, 150);
    };
    const channel = supabase
      .channel("realtime-dashboard")
      .on("postgres_changes", { event: "*", schema: "public", table: "companies" }, scheduleRealtimeRefresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "users" }, scheduleRealtimeRefresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "sites" }, scheduleRealtimeRefresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "shifts" }, scheduleRealtimeRefresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "checkins" }, scheduleRealtimeRefresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "incidents" }, scheduleRealtimeRefresh)
      .subscribe();
    return () => {
      if (refreshTimeout) clearTimeout(refreshTimeout);
      void supabase.removeChannel(channel);
    };
  }, [refreshAll]);

  return {
    stats,
    statsLoading,
    statsError,
    companies,
    guards,
    sites,
    shifts,
    checkIns,
    incidents,
    companiesLoading,
    guardsLoading,
    sitesLoading,
    shiftsLoading,
    checkInsLoading,
    incidentsLoading,
    companiesError,
    guardsError,
    sitesError,
    shiftsError,
    checkInsError,
    incidentsError,
    newCompanyName,
    newGuardName,
    newSiteName,
    selectedCompanyId: resolvedSelectedCompanyId,
    selectedSiteCompanyId: resolvedSelectedSiteCompanyId,
    selectedGuardId: resolvedSelectedGuardId,
    selectedShiftSiteId: resolvedSelectedShiftSiteId,
    selectedIncidentGuardId: resolvedSelectedIncidentGuardId,
    selectedIncidentSiteId: resolvedSelectedIncidentSiteId,
    incidentDescription,
    addingCompany,
    addingGuard,
    addingSite,
    assigningShift,
    checkingIn,
    reportingIncident,
    actionMessage,
    companyActionId,
    guardActionId,
    siteActionId,
    shiftActionId,
    setNewCompanyName,
    setNewGuardName,
    setNewSiteName,
    setSelectedCompanyId,
    setSelectedSiteCompanyId,
    setSelectedGuardId,
    setSelectedShiftSiteId,
    setSelectedIncidentGuardId,
    setSelectedIncidentSiteId,
    setIncidentDescription,
    handleAddCompany,
    handleAddGuard,
    handleUpdateCompany,
    handleDeleteCompany,
    handleUpdateGuard,
    handleDeleteGuard,
    handleAddSite,
    handleUpdateSite,
    handleDeleteSite,
    handleAssignGuard,
    handleDeleteShift,
    handleReassignShift,
    handleCheckIn,
    handleReportIncident,
    refreshAll,
    clearActionMessage: () => setActionMessage(null),
  };
}
