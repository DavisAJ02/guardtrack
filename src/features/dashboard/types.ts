export type Company = {
  id: string | number;
  name: string | null;
  [key: string]: unknown;
};

export type Guard = {
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

export type Site = {
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

export type Shift = {
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

export type CheckIn = {
  id: string | number;
  guard_id: string | number | null;
  site_id: string | number | null;
  gps_location: string | null;
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

export type Incident = {
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

export type DashboardStats = {
  totalCompanies: number;
  totalGuards: number;
  totalSites: number;
  totalShifts: number;
  totalIncidentsToday: number;
};

export type ActivityLog = {
  id: string | number;
  action: string;
  entity: string;
  entity_id: string | number | null;
  details: string | null;
  created_at: string;
};
