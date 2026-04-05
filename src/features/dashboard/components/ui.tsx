import type { ReactNode } from "react";
import { useState } from "react";

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

export function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-base font-semibold text-slate-900">{title}</h4>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-600 hover:bg-slate-100"
          >
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ConfirmActionButton({
  label,
  title,
  message,
  confirmLabel = "Confirm",
  disabled = false,
  onConfirm,
  tone = "danger",
}: {
  label: string;
  title: string;
  message: string;
  confirmLabel?: string;
  disabled?: boolean;
  onConfirm: () => Promise<void> | void;
  tone?: "danger" | "neutral";
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={disabled}
        className={
          tone === "danger"
            ? "rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
            : "rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        }
      >
        {label}
      </button>

      <Modal open={open} title={title} onClose={() => setOpen(false)}>
        <p className="text-sm text-slate-700">{message}</p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={async () => {
              await onConfirm();
              setOpen(false);
            }}
            className={
              tone === "danger"
                ? "rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-500"
                : "rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
            }
          >
            {confirmLabel}
          </button>
        </div>
      </Modal>
    </>
  );
}
