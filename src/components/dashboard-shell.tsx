"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { hasRoleAccess, normalizeRole, type UserRole } from "@/features/auth/roles";
import { supabase } from "@/lib/supabase";

type DashboardShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  requiredRole?: UserRole;
};

type DashboardAuthContextValue = {
  role: UserRole;
  userEmail: string;
};

const DashboardAuthContext = createContext<DashboardAuthContextValue>({
  role: "admin",
  userEmail: "",
});

export const useDashboardAuth = () => useContext(DashboardAuthContext);

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/companies", label: "Companies" },
  { href: "/guards", label: "Guards" },
  { href: "/sites", label: "Sites" },
  { href: "/shifts", label: "Shifts" },
  { href: "/checkins", label: "Check-Ins" },
  { href: "/incidents", label: "Incidents" },
  { href: "/insights", label: "Insights" },
  { href: "/reports", label: "Reports" },
];

export function DashboardShell({
  title,
  subtitle,
  children,
  requiredRole = "guard",
}: DashboardShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [role, setRole] = useState<UserRole>("admin");
  const [loggingOut, setLoggingOut] = useState(false);

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
      setRole(
        normalizeRole(data.session.user.app_metadata?.role ?? data.session.user.user_metadata?.role)
      );
      setAuthLoading(false);
    };

    void checkAuth();

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
      setRole(normalizeRole(session.user.app_metadata?.role ?? session.user.user_metadata?.role));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.replace("/login");
  };

  if (authLoading) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">Checking authentication...</p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!hasRoleAccess(role, requiredRole)) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold">Access Restricted</h1>
          <p className="mt-2 text-sm text-slate-600">
            Your role does not have permission for this section.
          </p>
          <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
            Current role: {role}
          </p>
        </div>
      </main>
    );
  }

  return (
    <DashboardAuthContext.Provider value={{ role, userEmail }}>
      <main className="min-h-screen bg-slate-100 text-slate-900">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 p-4 sm:p-6 lg:flex-row lg:gap-6 lg:p-8">
          <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:w-64">
            <div>
              <h1 className="text-lg font-bold">GuardTrack Pro</h1>
              <p className="mt-1 text-xs text-slate-500">Operations Command Center</p>
              <span className="mt-3 inline-block rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                {role}
              </span>
            </div>
            <nav className="mt-6 flex flex-wrap gap-2 lg:flex-col">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                      active
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          <section className="flex-1">
            <header className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
                  <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="max-w-[220px] truncate text-sm text-slate-600">{userEmail}</p>
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                  >
                    {loggingOut ? "Signing out..." : "Logout"}
                  </button>
                </div>
              </div>
            </header>

            <div className="mt-4 space-y-4 sm:mt-5 sm:space-y-5">{children}</div>
          </section>
        </div>
      </main>
    </DashboardAuthContext.Provider>
  );
}
