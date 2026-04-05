import { StateText } from "@/features/dashboard/components/ui";

export function ActionToast({
  actionMessage,
  onClose,
}: {
  actionMessage: { type: "success" | "error"; text: string } | null;
  onClose: () => void;
}) {
  if (!actionMessage) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <StateText tone={actionMessage.type === "error" ? "error" : "neutral"}>
          {actionMessage.text}
        </StateText>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-600 hover:bg-slate-100"
        >
          Close
        </button>
      </div>
    </div>
  );
}
