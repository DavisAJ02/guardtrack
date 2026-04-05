"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Company = {
  id: string | number;
  name: string | null;
  [key: string]: unknown;
};

type Guard = {
  id: string | number;
  name: string | null;
  company_id: string | number | null;
  companies?:
    | {
        name: string | null;
      }
    | Array<{
        name: string | null;
      }>
    | null;
  [key: string]: unknown;
};

type Site = {
  id: string | number;
  name: string | null;
  company_id: string | number | null;
  companies?:
    | {
        name: string | null;
      }
    | Array<{
        name: string | null;
      }>
    | null;
  [key: string]: unknown;
};

type Shift = {
  id: string | number;
  guard_id: string | number | null;
  site_id: string | number | null;
  users?:
    | {
        name: string | null;
      }
    | Array<{
        name: string | null;
      }>
    | null;
  sites?:
    | {
        name: string | null;
      }
    | Array<{
        name: string | null;
      }>
    | null;
  [key: string]: unknown;
};

type CheckIn = {
  id: string | number;
  guard_id: string | number | null;
  site_id: string | number | null;
  created_at: string;
  users?:
    | {
        name: string | null;
      }
    | Array<{
        name: string | null;
      }>
    | null;
  sites?:
    | {
        name: string | null;
      }
    | Array<{
        name: string | null;
      }>
    | null;
  [key: string]: unknown;
};

type Incident = {
  id: string | number;
  guard_id: string | number | null;
  site_id: string | number | null;
  description: string | null;
  created_at: string;
  users?:
    | {
        name: string | null;
      }
    | Array<{
        name: string | null;
      }>
    | null;
  sites?:
    | {
        name: string | null;
      }
    | Array<{
        name: string | null;
      }>
    | null;
  [key: string]: unknown;
};

export default function Home() {
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalCompanies: 0,
    totalGuards: 0,
    totalSites: 0,
    totalShifts: 0,
    totalIncidentsToday: 0,
  });

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

  const fetchCompanies = useCallback(async () => {
    setCompaniesLoading(true);

    const { data, error: fetchError } = await supabase.from("companies").select("*");

    if (fetchError) {
      console.error("Failed to fetch companies:", fetchError);
      setCompaniesError(fetchError.message);
      setCompanies([]);
    } else {
      setCompaniesError(null);
      setCompanies((data as Company[]) ?? []);
    }

    setCompaniesLoading(false);
  }, []);

  const fetchGuards = useCallback(async () => {
    setGuardsLoading(true);

    const { data, error: fetchError } = await supabase
      .from("users")
      .select("id, name, company_id, companies(name)");

    if (fetchError) {
      console.error("Failed to fetch guards:", fetchError);
      setGuardsError(fetchError.message);
      setGuards([]);
    } else {
      setGuardsError(null);
      setGuards((data as Guard[]) ?? []);
    }

    setGuardsLoading(false);
  }, []);

  const fetchSites = useCallback(async () => {
    setSitesLoading(true);

    const { data, error: fetchError } = await supabase
      .from("sites")
      .select("id, name, company_id, companies(name)");

    if (fetchError) {
      console.error("Failed to fetch sites:", fetchError);
      setSitesError(fetchError.message);
      setSites([]);
    } else {
      setSitesError(null);
      setSites((data as Site[]) ?? []);
    }

    setSitesLoading(false);
  }, []);

  const fetchShifts = useCallback(async () => {
    setShiftsLoading(true);

    const { data, error: fetchError } = await supabase
      .from("shifts")
      .select(`
        id,
        users(name),
        sites(name)
      `);

    if (fetchError) {
      console.error("Failed to fetch shifts:", fetchError);
      setShiftsError(fetchError.message);
      setShifts([]);
    } else {
      setShiftsError(null);
      setShifts((data as Shift[]) ?? []);
    }

    setShiftsLoading(false);
  }, []);

  const fetchCheckIns = useCallback(async () => {
    setCheckInsLoading(true);

    const { data, error: fetchError } = await supabase
      .from("checkins")
      .select("id, guard_id, site_id, created_at, users(name), sites(name)")
      .order("created_at", { ascending: false });

    if (fetchError) {
      console.error("Failed to fetch check-ins:", {
        message: fetchError.message,
        code: fetchError.code,
        details: fetchError.details,
        hint: fetchError.hint,
      });
      setCheckInsError(fetchError.message);
      setCheckIns([]);
    } else {
      setCheckInsError(null);
      setCheckIns((data as CheckIn[]) ?? []);
    }

    setCheckInsLoading(false);
  }, []);

  const fetchIncidents = useCallback(async () => {
    setIncidentsLoading(true);

    const { data, error: fetchError } = await supabase
      .from("incidents")
      .select("id, guard_id, site_id, description, created_at, users(name), sites(name)")
      .order("created_at", { ascending: false });

    if (fetchError) {
      console.error("Failed to fetch incidents:", {
        message: fetchError.message,
        code: fetchError.code,
        details: fetchError.details,
        hint: fetchError.hint,
      });
      setIncidentsError(fetchError.message);
      setIncidents([]);
    } else {
      setIncidentsError(null);
      setIncidents((data as Incident[]) ?? []);
    }

    setIncidentsLoading(false);
  }, []);

  const fetchDashboardStats = useCallback(async () => {
    setStatsLoading(true);

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [companiesRes, guardsRes, sitesRes, shiftsRes, incidentsTodayRes] =
      await Promise.all([
        supabase.from("companies").select("*", { count: "exact", head: true }),
        supabase.from("users").select("*", { count: "exact", head: true }),
        supabase.from("sites").select("*", { count: "exact", head: true }),
        supabase.from("shifts").select("*", { count: "exact", head: true }),
        supabase
          .from("incidents")
          .select("*", { count: "exact", head: true })
          .gte("created_at", startOfToday.toISOString()),
      ]);

    const hasError =
      companiesRes.error ||
      guardsRes.error ||
      sitesRes.error ||
      shiftsRes.error ||
      incidentsTodayRes.error;

    if (hasError) {
      console.error("Failed to fetch dashboard stats:", {
        companiesError: companiesRes.error?.message,
        guardsError: guardsRes.error?.message,
        sitesError: sitesRes.error?.message,
        shiftsError: shiftsRes.error?.message,
        incidentsTodayError: incidentsTodayRes.error?.message,
      });
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

  const getGuardCompanyName = (guard: Guard) => {
    if (Array.isArray(guard.companies)) {
      return guard.companies[0]?.name ?? "Unknown Company";
    }

    return guard.companies?.name ?? "Unknown Company";
  };

  const getSiteCompanyName = (site: Site) => {
    if (Array.isArray(site.companies)) {
      return site.companies[0]?.name ?? "Unknown Company";
    }

    return site.companies?.name ?? "Unknown Company";
  };

  const getShiftGuardName = (shift: Shift) => {
    if (Array.isArray(shift.users)) {
      return shift.users[0]?.name ?? "Unknown Guard";
    }

    return shift.users?.name ?? "Unknown Guard";
  };

  const getShiftSiteName = (shift: Shift) => {
    if (Array.isArray(shift.sites)) {
      return shift.sites[0]?.name ?? "Unknown Site";
    }

    return shift.sites?.name ?? "Unknown Site";
  };

  const getCheckInGuardName = (checkIn: CheckIn) => {
    if (Array.isArray(checkIn.users)) {
      return checkIn.users[0]?.name ?? "Unknown Guard";
    }

    return checkIn.users?.name ?? "Unknown Guard";
  };

  const getCheckInSiteName = (checkIn: CheckIn) => {
    if (Array.isArray(checkIn.sites)) {
      return checkIn.sites[0]?.name ?? "Unknown Site";
    }

    return checkIn.sites?.name ?? "Unknown Site";
  };

  const getIncidentGuardName = (incident: Incident) => {
    if (Array.isArray(incident.users)) {
      return incident.users[0]?.name ?? "Unknown Guard";
    }

    return incident.users?.name ?? "Unknown Guard";
  };

  const getIncidentSiteName = (incident: Incident) => {
    if (Array.isArray(incident.sites)) {
      return incident.sites[0]?.name ?? "Unknown Site";
    }

    return incident.sites?.name ?? "Unknown Site";
  };

  const handleAddCompany = async () => {
    const name = newCompanyName.trim();
    if (!name) {
      return;
    }

    setAddingCompany(true);

    const { error: insertError } = await supabase
      .from("companies")
      .insert([{ name }]);

    if (insertError) {
      console.error("Failed to add company:", insertError);
      setAddingCompany(false);
      return;
    }

    setNewCompanyName("");
    await fetchCompanies();
    setAddingCompany(false);
  };

  const handleAddGuard = async () => {
    const name = newGuardName.trim();
    if (!name || !selectedCompanyId) {
      return;
    }

    setAddingGuard(true);

    const parsedCompanyId = Number(selectedCompanyId);
    const companyId: string | number = Number.isNaN(parsedCompanyId)
      ? selectedCompanyId
      : parsedCompanyId;

    const { error: insertError } = await supabase
      .from("users")
      .insert([{ name, company_id: companyId }]);

    if (insertError) {
      console.error("Failed to add guard:", insertError);
      setAddingGuard(false);
      return;
    }

    setNewGuardName("");
    await fetchGuards();
    setAddingGuard(false);
  };

  const handleAddSite = async () => {
    const name = newSiteName.trim();
    if (!name || !selectedSiteCompanyId) {
      return;
    }

    setAddingSite(true);

    const parsedCompanyId = Number(selectedSiteCompanyId);
    const companyId: string | number = Number.isNaN(parsedCompanyId)
      ? selectedSiteCompanyId
      : parsedCompanyId;

    const { error: insertError } = await supabase
      .from("sites")
      .insert([{ name, company_id: companyId }]);

    if (insertError) {
      console.error("Failed to add site:", insertError);
      setAddingSite(false);
      return;
    }

    setNewSiteName("");
    await fetchSites();
    setAddingSite(false);
  };

  const handleAssignGuard = async () => {
    if (!selectedGuardId || !selectedShiftSiteId) {
      return;
    }

    setAssigningShift(true);

    const parsedGuardId = Number(selectedGuardId);
    const guardId: string | number = Number.isNaN(parsedGuardId)
      ? selectedGuardId
      : parsedGuardId;

    const parsedSiteId = Number(selectedShiftSiteId);
    const siteId: string | number = Number.isNaN(parsedSiteId)
      ? selectedShiftSiteId
      : parsedSiteId;

    const { error: insertError } = await supabase
      .from("shifts")
      .insert([{ guard_id: guardId, site_id: siteId }]);

    if (insertError) {
      console.error("Failed to assign guard:", {
        message: insertError.message,
        code: insertError.code,
        details: insertError.details,
        hint: insertError.hint,
      });
      setAssigningShift(false);
      return;
    }

    await fetchShifts();
    setAssigningShift(false);
  };

  const handleCheckIn = async () => {
    if (!selectedGuardId || !selectedShiftSiteId) {
      return;
    }

    setCheckingIn(true);

    const parsedGuardId = Number(selectedGuardId);
    const guardId: string | number = Number.isNaN(parsedGuardId)
      ? selectedGuardId
      : parsedGuardId;

    const parsedSiteId = Number(selectedShiftSiteId);
    const siteId: string | number = Number.isNaN(parsedSiteId)
      ? selectedShiftSiteId
      : parsedSiteId;

    const { error: insertError } = await supabase
      .from("checkins")
      .insert([{ guard_id: guardId, site_id: siteId }]);

    if (insertError) {
      console.error("Failed to check in:", {
        message: insertError.message,
        code: insertError.code,
        details: insertError.details,
        hint: insertError.hint,
      });
      setCheckingIn(false);
      return;
    }

    await fetchCheckIns();
    setCheckingIn(false);
  };

  const handleReportIncident = async () => {
    const description = incidentDescription.trim();
    if (!selectedIncidentGuardId || !selectedIncidentSiteId || !description) {
      return;
    }

    setReportingIncident(true);

    const parsedGuardId = Number(selectedIncidentGuardId);
    const guardId: string | number = Number.isNaN(parsedGuardId)
      ? selectedIncidentGuardId
      : parsedGuardId;

    const parsedSiteId = Number(selectedIncidentSiteId);
    const siteId: string | number = Number.isNaN(parsedSiteId)
      ? selectedIncidentSiteId
      : parsedSiteId;

    const { error: insertError } = await supabase
      .from("incidents")
      .insert([{ guard_id: guardId, site_id: siteId, description }]);

    if (insertError) {
      console.error("Failed to report incident:", {
        message: insertError.message,
        code: insertError.code,
        details: insertError.details,
        hint: insertError.hint,
      });
      setReportingIncident(false);
      return;
    }

    setIncidentDescription("");
    await fetchIncidents();
    setReportingIncident(false);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        setIsAuthenticated(false);
        setUserEmail("");
        setAuthLoading(false);
        router.replace("/login");
        return;
      }

      setIsAuthenticated(true);
      setUserEmail(data.session.user.email ?? "");
      setAuthLoading(false);
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setIsAuthenticated(false);
        setUserEmail("");
        router.replace("/login");
        return;
      }

      setIsAuthenticated(true);
      setUserEmail(session.user.email ?? "");
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    fetchDashboardStats();
    fetchCompanies();
    fetchGuards();
    fetchSites();
    fetchShifts();
    fetchCheckIns();
    fetchIncidents();
  }, [
    fetchCompanies,
    fetchGuards,
    fetchSites,
    fetchShifts,
    fetchCheckIns,
    fetchIncidents,
    fetchDashboardStats,
    isAuthenticated,
  ]);

  useEffect(() => {
    if (companies.length > 0 && !selectedCompanyId) {
      setSelectedCompanyId(String(companies[0].id));
    }
    if (companies.length > 0 && !selectedSiteCompanyId) {
      setSelectedSiteCompanyId(String(companies[0].id));
    }
    if (guards.length > 0 && !selectedGuardId) {
      setSelectedGuardId(String(guards[0].id));
    }
    if (sites.length > 0 && !selectedShiftSiteId) {
      setSelectedShiftSiteId(String(sites[0].id));
    }
    if (guards.length > 0 && !selectedIncidentGuardId) {
      setSelectedIncidentGuardId(String(guards[0].id));
    }
    if (sites.length > 0 && !selectedIncidentSiteId) {
      setSelectedIncidentSiteId(String(sites[0].id));
    }
  }, [
    companies,
    guards,
    sites,
    selectedCompanyId,
    selectedSiteCompanyId,
    selectedGuardId,
    selectedShiftSiteId,
    selectedIncidentGuardId,
    selectedIncidentSiteId,
  ]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  if (authLoading) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-10 text-gray-900">
        <div className="mx-auto w-full max-w-3xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10 text-gray-900">
      <div className="mx-auto w-full max-w-3xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold">GuardTrack Dashboard</h1>
          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-600">{userEmail}</p>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
            >
              Logout
            </button>
          </div>
        </div>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Dashboard Statistics</h2>

          {statsError && <p className="mt-4 text-red-600">{statsError}</p>}

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="text-sm text-gray-600">Total companies</p>
              <p className="mt-1 text-2xl font-bold">
                {statsLoading ? "..." : stats.totalCompanies}
              </p>
            </div>

            <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="text-sm text-gray-600">Total guards</p>
              <p className="mt-1 text-2xl font-bold">
                {statsLoading ? "..." : stats.totalGuards}
              </p>
            </div>

            <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="text-sm text-gray-600">Total sites</p>
              <p className="mt-1 text-2xl font-bold">
                {statsLoading ? "..." : stats.totalSites}
              </p>
            </div>

            <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="text-sm text-gray-600">Total shifts</p>
              <p className="mt-1 text-2xl font-bold">
                {statsLoading ? "..." : stats.totalShifts}
              </p>
            </div>

            <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="text-sm text-gray-600">Total incidents today</p>
              <p className="mt-1 text-2xl font-bold">
                {statsLoading ? "..." : stats.totalIncidentsToday}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Add Company</h2>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={newCompanyName}
              onChange={(event) => setNewCompanyName(event.target.value)}
              placeholder="Enter company name"
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
              disabled={addingCompany}
            />
            <button
              type="button"
              onClick={handleAddCompany}
              disabled={addingCompany || !newCompanyName.trim()}
              className="rounded-md bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {addingCompany ? "Adding..." : "Add Company"}
            </button>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Companies</h2>

          {companiesLoading && (
            <p className="mt-4 text-gray-600">Loading companies...</p>
          )}

          {!companiesLoading && companiesError && (
            <p className="mt-4 text-red-600">
              Failed to load companies: {companiesError}
            </p>
          )}

          {!companiesLoading && !companiesError && companies.length === 0 && (
            <p className="mt-4 text-gray-600">No companies found</p>
          )}

          {!companiesLoading && !companiesError && companies.length > 0 && (
            <ul className="mt-4 space-y-2">
              {companies.map((company) => (
                <li
                  key={String(company.id)}
                  className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3"
                >
                  {company.name ? String(company.name) : `Company #${company.id}`}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Guard Management</h2>

          <div className="mt-4 flex flex-col gap-3">
            <input
              type="text"
              value={newGuardName}
              onChange={(event) => setNewGuardName(event.target.value)}
              placeholder="Enter guard name"
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
              disabled={addingGuard}
            />

            <select
              value={selectedCompanyId}
              onChange={(event) => setSelectedCompanyId(event.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
              disabled={addingGuard || companies.length === 0}
            >
              {companies.length === 0 && <option value="">No companies available</option>}
              {companies.map((company) => (
                <option key={String(company.id)} value={String(company.id)}>
                  {company.name ? String(company.name) : `Company #${company.id}`}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleAddGuard}
              disabled={
                addingGuard ||
                !newGuardName.trim() ||
                !selectedCompanyId ||
                companies.length === 0
              }
              className="w-fit rounded-md bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {addingGuard ? "Adding..." : "Add Guard"}
            </button>
          </div>

          {guardsLoading && <p className="mt-4 text-gray-600">Loading guards...</p>}

          {!guardsLoading && guardsError && (
            <p className="mt-4 text-red-600">Failed to load guards: {guardsError}</p>
          )}

          {!guardsLoading && !guardsError && guards.length === 0 && (
            <p className="mt-4 text-gray-600">No guards found</p>
          )}

          {!guardsLoading && !guardsError && guards.length > 0 && (
            <ul className="mt-4 space-y-2">
              {guards.map((guard) => (
                <li
                  key={String(guard.id)}
                  className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3"
                >
                  <p className="font-medium">
                    {guard.name ? String(guard.name) : `Guard #${guard.id}`}
                  </p>
                  <p className="text-sm text-gray-600">{getGuardCompanyName(guard)}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Site Management</h2>

          <div className="mt-4 flex flex-col gap-3">
            <input
              type="text"
              value={newSiteName}
              onChange={(event) => setNewSiteName(event.target.value)}
              placeholder="Enter site name"
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
              disabled={addingSite}
            />

            <select
              value={selectedSiteCompanyId}
              onChange={(event) => setSelectedSiteCompanyId(event.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
              disabled={addingSite || companies.length === 0}
            >
              {companies.length === 0 && <option value="">No companies available</option>}
              {companies.map((company) => (
                <option key={String(company.id)} value={String(company.id)}>
                  {company.name ? String(company.name) : `Company #${company.id}`}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleAddSite}
              disabled={
                addingSite ||
                !newSiteName.trim() ||
                !selectedSiteCompanyId ||
                companies.length === 0
              }
              className="w-fit rounded-md bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {addingSite ? "Adding..." : "Add Site"}
            </button>
          </div>

          {sitesLoading && <p className="mt-4 text-gray-600">Loading sites...</p>}

          {!sitesLoading && sitesError && (
            <p className="mt-4 text-red-600">Failed to load sites: {sitesError}</p>
          )}

          {!sitesLoading && !sitesError && sites.length === 0 && (
            <p className="mt-4 text-gray-600">No sites found</p>
          )}

          {!sitesLoading && !sitesError && sites.length > 0 && (
            <ul className="mt-4 space-y-2">
              {sites.map((site) => (
                <li
                  key={String(site.id)}
                  className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3"
                >
                  <p className="font-medium">
                    {site.name ? String(site.name) : `Site #${site.id}`}
                  </p>
                  <p className="text-sm text-gray-600">{getSiteCompanyName(site)}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Shift Assignment</h2>

          <div className="mt-4 flex flex-col gap-3">
            <select
              value={selectedGuardId}
              onChange={(event) => setSelectedGuardId(event.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
              disabled={assigningShift || guards.length === 0}
            >
              {guards.length === 0 && <option value="">No guards available</option>}
              {guards.map((guard) => (
                <option key={String(guard.id)} value={String(guard.id)}>
                  {guard.name ? String(guard.name) : `Guard #${guard.id}`}
                </option>
              ))}
            </select>

            <select
              value={selectedShiftSiteId}
              onChange={(event) => setSelectedShiftSiteId(event.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
              disabled={assigningShift || sites.length === 0}
            >
              {sites.length === 0 && <option value="">No sites available</option>}
              {sites.map((site) => (
                <option key={String(site.id)} value={String(site.id)}>
                  {site.name ? String(site.name) : `Site #${site.id}`}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleAssignGuard}
              disabled={
                assigningShift ||
                !selectedGuardId ||
                !selectedShiftSiteId ||
                guards.length === 0 ||
                sites.length === 0
              }
              className="w-fit rounded-md bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {assigningShift ? "Assigning..." : "Assign Guard"}
            </button>
          </div>

          {shiftsLoading && <p className="mt-4 text-gray-600">Loading shifts...</p>}

          {!shiftsLoading && shiftsError && (
            <p className="mt-4 text-red-600">Failed to load shifts: {shiftsError}</p>
          )}

          {!shiftsLoading && !shiftsError && shifts.length === 0 && (
            <p className="mt-4 text-gray-600">No shifts found</p>
          )}

          {!shiftsLoading && !shiftsError && shifts.length > 0 && (
            <ul className="mt-4 space-y-2">
              {shifts.map((shift) => (
                <li
                  key={String(shift.id)}
                  className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3"
                >
                  <p className="font-medium">{getShiftGuardName(shift)}</p>
                  <p className="text-sm text-gray-600">{getShiftSiteName(shift)}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Check-In</h2>

          <div className="mt-4">
            <button
              type="button"
              onClick={handleCheckIn}
              disabled={
                checkingIn ||
                !selectedGuardId ||
                !selectedShiftSiteId ||
                guards.length === 0 ||
                sites.length === 0
              }
              className="w-fit rounded-md bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {checkingIn ? "Checking In..." : "Check In"}
            </button>
          </div>

          {checkInsLoading && <p className="mt-4 text-gray-600">Loading check-ins...</p>}

          {!checkInsLoading && checkInsError && (
            <p className="mt-4 text-red-600">Failed to load check-ins: {checkInsError}</p>
          )}

          {!checkInsLoading && !checkInsError && checkIns.length === 0 && (
            <p className="mt-4 text-gray-600">No check-ins found</p>
          )}

          {!checkInsLoading && !checkInsError && checkIns.length > 0 && (
            <ul className="mt-4 space-y-2">
              {checkIns.map((checkIn) => (
                <li
                  key={String(checkIn.id)}
                  className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3"
                >
                  <p className="font-medium">{getCheckInGuardName(checkIn)}</p>
                  <p className="text-sm text-gray-600">{getCheckInSiteName(checkIn)}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(checkIn.created_at).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Incident Reporting</h2>

          <div className="mt-4 flex flex-col gap-3">
            <select
              value={selectedIncidentGuardId}
              onChange={(event) => setSelectedIncidentGuardId(event.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
              disabled={reportingIncident || guards.length === 0}
            >
              {guards.length === 0 && <option value="">No guards available</option>}
              {guards.map((guard) => (
                <option key={String(guard.id)} value={String(guard.id)}>
                  {guard.name ? String(guard.name) : `Guard #${guard.id}`}
                </option>
              ))}
            </select>

            <select
              value={selectedIncidentSiteId}
              onChange={(event) => setSelectedIncidentSiteId(event.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
              disabled={reportingIncident || sites.length === 0}
            >
              {sites.length === 0 && <option value="">No sites available</option>}
              {sites.map((site) => (
                <option key={String(site.id)} value={String(site.id)}>
                  {site.name ? String(site.name) : `Site #${site.id}`}
                </option>
              ))}
            </select>

            <textarea
              value={incidentDescription}
              onChange={(event) => setIncidentDescription(event.target.value)}
              placeholder="Describe the incident"
              className="min-h-24 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
              disabled={reportingIncident}
            />

            <button
              type="button"
              onClick={handleReportIncident}
              disabled={
                reportingIncident ||
                !selectedIncidentGuardId ||
                !selectedIncidentSiteId ||
                !incidentDescription.trim() ||
                guards.length === 0 ||
                sites.length === 0
              }
              className="w-fit rounded-md bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {reportingIncident ? "Reporting..." : "Report Incident"}
            </button>
          </div>

          {incidentsLoading && <p className="mt-4 text-gray-600">Loading incidents...</p>}

          {!incidentsLoading && incidentsError && (
            <p className="mt-4 text-red-600">Failed to load incidents: {incidentsError}</p>
          )}

          {!incidentsLoading && !incidentsError && incidents.length === 0 && (
            <p className="mt-4 text-gray-600">No incidents found</p>
          )}

          {!incidentsLoading && !incidentsError && incidents.length > 0 && (
            <ul className="mt-4 space-y-2">
              {incidents.map((incident) => (
                <li
                  key={String(incident.id)}
                  className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3"
                >
                  <p className="font-medium">{getIncidentGuardName(incident)}</p>
                  <p className="text-sm text-gray-600">{getIncidentSiteName(incident)}</p>
                  <p className="mt-1 text-sm text-gray-700">
                    {incident.description ?? "No description"}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {new Date(incident.created_at).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
