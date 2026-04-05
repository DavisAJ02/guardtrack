import type { CheckIn, Incident, Shift } from "@/features/dashboard/types";

export const isInRange = (value: string, from?: string, to?: string) => {
  const ts = new Date(value).getTime();
  if (Number.isNaN(ts)) return false;
  if (from) {
    const fromTs = new Date(`${from}T00:00:00`).getTime();
    if (ts < fromTs) return false;
  }
  if (to) {
    const toTs = new Date(`${to}T23:59:59.999`).getTime();
    if (ts > toTs) return false;
  }
  return true;
};

export const byDateLabel = (value: string) => new Date(value).toLocaleDateString();

export function aggregateCountByDay(items: Array<{ created_at: string }>) {
  const bucket = new Map<string, number>();
  for (const item of items) {
    const key = byDateLabel(item.created_at);
    bucket.set(key, (bucket.get(key) ?? 0) + 1);
  }
  return [...bucket.entries()].map(([label, value]) => ({ label, value }));
}

export const activeShifts = (shifts: Shift[]) => shifts.length;
export const todayCount = (items: Array<{ created_at: string }>) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return items.filter((item) => new Date(item.created_at) >= today).length;
};

export const siteCoverage = (checkIns: CheckIn[], shifts: Shift[]) => {
  const covered = new Set(
    checkIns
      .map((checkIn) => checkIn.site_id)
      .filter((siteId): siteId is string | number => siteId !== null && siteId !== undefined)
  );
  const totalPossible = new Set(
    shifts
      .map((shift) => shift.site_id)
      .filter((siteId): siteId is string | number => siteId !== null && siteId !== undefined)
  ).size;
  if (!totalPossible) return 0;
  return Math.round((covered.size / totalPossible) * 100);
};

export const incidentRate = (incidents: Incident[], checkIns: CheckIn[]) => {
  if (!checkIns.length) return 0;
  return Number(((incidents.length / checkIns.length) * 100).toFixed(1));
};
