"use client";

type Props = {
  data: { year: number; count: number }[];
};

export function ConcertsPerYearChart({ data }: Props) {
  if (data.length === 0) {
    return <p className="text-sm text-coven-text-muted">Ingen data</p>;
  }

  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="flex items-end gap-3">
      {data.map((d) => (
        <div key={d.year} className="flex flex-1 flex-col items-center gap-1.5">
          <span className="text-xs font-semibold tabular-nums text-coven-text">
            {d.count}
          </span>
          <div
            className="relative w-full overflow-hidden rounded-t bg-coven-active"
            style={{ height: "80px" }}
          >
            <div
              className="absolute bottom-0 w-full rounded-t bg-coven-primary transition-all"
              style={{ height: `${(d.count / maxCount) * 100}%` }}
            />
          </div>
          <span className="text-xs font-medium text-coven-text-muted">{d.year}</span>
        </div>
      ))}
    </div>
  );
}
