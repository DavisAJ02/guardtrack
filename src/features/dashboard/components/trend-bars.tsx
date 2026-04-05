type TrendPoint = {
  label: string;
  value: number;
};

export function TrendBars({
  points,
  emptyText,
}: {
  points: TrendPoint[];
  emptyText: string;
}) {
  if (points.length === 0) {
    return <p className="text-sm text-slate-600">{emptyText}</p>;
  }

  const peak = Math.max(...points.map((point) => point.value), 1);

  return (
    <ul className="space-y-2">
      {points.map((point) => {
        const width = Math.max(6, Math.round((point.value / peak) * 100));
        return (
          <li key={point.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>{point.label}</span>
              <span className="font-semibold text-slate-700">{point.value}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-200">
              <div className="h-2 rounded-full bg-slate-900" style={{ width: `${width}%` }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
