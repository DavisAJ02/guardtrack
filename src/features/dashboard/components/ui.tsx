import type { ReactNode } from "react";

export function Panel({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          {description ? <p className="mt-1 text-sm text-slate-600">{description}</p> : null}
        </div>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function StateText({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "error" }) {
  return (
    <p className={`text-sm ${tone === "error" ? "text-red-600" : "text-slate-600"}`}>{children}</p>
  );
}
