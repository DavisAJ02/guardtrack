export type UserRole = "guard" | "supervisor" | "admin";

const ROLE_RANK: Record<UserRole, number> = {
  guard: 1,
  supervisor: 2,
  admin: 3,
};

export const normalizeRole = (value: unknown): UserRole => {
  if (value === "admin" || value === "supervisor" || value === "guard") {
    return value;
  }
  return "admin";
};

export const hasRoleAccess = (role: UserRole, requiredRole: UserRole) =>
  ROLE_RANK[role] >= ROLE_RANK[requiredRole];

export const canManageCore = (role: UserRole) => role === "admin" || role === "supervisor";
