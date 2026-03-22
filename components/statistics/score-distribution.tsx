"use client";

import { useState } from "react";

type Props = {
  data: { score: number; count: number; bands: string[] }[];
};

export function ScoreDistributionChart({ data }: Props) {
  const [selected, setSelected] = useState<{ score: number; bands: string[] } | null>(null);
  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const total = data.reduce((sum, d) => sum + d.count, 0);

  if (total === 0) {
    return <p className="text-sm text-coven-text-muted">Ingen data</p>;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-end gap-2">
        {data.map((d) => (
          <button
            key={d.score}
            type="button"
            className="flex flex-1 flex-col items-center gap-1"
            onClick={() =>
              d.count > 0
                ? setSelected(selected?.score === d.score ? null : { score: d.score, bands: d.bands })
                : undefined
            }
            disabled={d.count === 0}
          >
            <span className="text-xs tabular-nums text-coven-text-muted">
              {d.count}
            </span>
            <div
              className={`relative w-full overflow-hidden rounded-t transition-all ${
                selected?.score === d.score ? "bg-coven-primary/30" : "bg-coven-active"
              }`}
              style={{ height: "80px" }}
            >
              <div
                className={`absolute bottom-0 w-full rounded-t transition-all ${
                  selected?.score === d.score ? "bg-coven-primary brightness-125" : "bg-coven-primary"
                }`}
                style={{ height: `${(d.count / maxCount) * 100}%` }}
              />
            </div>
            <span className="text-xs font-medium text-coven-text">{d.score}</span>
          </button>
        ))}
      </div>

      {selected && selected.bands.length > 0 && (
        <div className="rounded-md border border-coven-border bg-coven-card p-3">
          <p className="mb-2 text-xs font-medium text-coven-text-muted">
            Score {selected.score} ({selected.bands.length})
          </p>
          <ul className="space-y-1">
            {selected.bands.map((band, i) => (
              <li key={i} className="text-sm text-coven-text">{band}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
