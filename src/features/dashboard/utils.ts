import type { CheckIn, Guard, Incident, Shift, Site } from "@/features/dashboard/types";

export const toDbId = (value: string): string | number => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? value : parsed;
};

type NameLink = { name: string | null } | Array<{ name: string | null }> | null | undefined;

const linkedName = (linked: NameLink, fallback: string) => {
  if (Array.isArray(linked)) {
    return linked[0]?.name ?? fallback;
  }

  return linked?.name ?? fallback;
};

export const getGuardCompanyName = (guard: Guard) => linkedName(guard.companies, "Unknown Company");

export const getSiteCompanyName = (site: Site) => linkedName(site.companies, "Unknown Company");

export const getShiftGuardName = (shift: Shift) => linkedName(shift.users, "Unknown Guard");

export const getShiftSiteName = (shift: Shift) => linkedName(shift.sites, "Unknown Site");

export const getCheckInGuardName = (checkIn: CheckIn) => linkedName(checkIn.users, "Unknown Guard");

export const getCheckInSiteName = (checkIn: CheckIn) => linkedName(checkIn.sites, "Unknown Site");

export const getIncidentGuardName = (incident: Incident) =>
  linkedName(incident.users, "Unknown Guard");

export const getIncidentSiteName = (incident: Incident) => linkedName(incident.sites, "Unknown Site");
