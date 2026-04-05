"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

function BrandPanel() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-6 text-white sm:p-8 lg:rounded-l-2xl lg:rounded-r-none">
      <div className="relative z-10">
        <p className="text-xs uppercase tracking-[0.2em] text-blue-100/90">Welcome to</p>
        <div className="mt-8 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/20 text-xl font-semibold">
            GT
          </span>
          <div>
            <p className="text-2xl font-semibold">GuardTrack</p>
            <p className="text-sm text-blue-100/90">Operations Platform</p>
          </div>
        </div>
        <p className="mt-6 max-w-sm text-sm leading-6 text-blue-100/95">
          Run security operations with confidence. Monitor field activity, incidents, and
          organizational readiness from one intentional command layer.
        </p>
      </div>

      <div className="pointer-events-none absolute -bottom-14 -left-10 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
      <div className="pointer-events-none absolute -right-12 top-8 h-28 w-28 rounded-full bg-white/20 blur-xl" />

      <div className="pointer-events-none absolute right-0 top-0 hidden h-full w-16 translate-x-1/2 flex-col justify-between py-6 lg:flex">
        {[...Array(8)].map((_, index) => (
          <span
            key={index}
            className="h-10 w-10 rounded-full bg-white/90 shadow-sm"
          />
        ))}
      </div>
    </section>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        router.replace("/");
        return;
      }

      setCheckingSession(false);
    };

    checkSession();
  }, [router]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.replace("/");
  };

  if (checkingSession) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-6 text-slate-900 sm:px-6 sm:py-10">
        <div className="mx-auto w-full max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm text-slate-600">Checking session...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 text-slate-900 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
        <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
          <BrandPanel />

          <section className="p-6 sm:p-8 lg:p-10">
            <div className="mx-auto w-full max-w-md">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Sign in</h1>
              <p className="mt-1 text-sm text-slate-600">
                Access your operations workspace with your assigned credentials.
              </p>

              <form onSubmit={handleLogin} className="mt-6 flex flex-col gap-4">
                <div>
                  <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
                    E-mail Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="you@example.com"
                    required
                    disabled={loading}
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                    autoComplete="current-password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-1 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </form>

              {error ? (
                <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              ) : null}

              <p className="mt-6 text-xs text-slate-500">
                Need access or role changes? Contact your platform administrator.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
