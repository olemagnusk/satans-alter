"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

type Genre = {
  genre: string;
  average: number;
  count: number;
  bands: { band: string; score: number }[];
};

type Props = {
  genres: Genre[];
  previewCount?: number;
  emptyMessage?: string;
};

function concertCountSuffix(count: number) {
  return count === 1 ? "konsert" : "konserter";
}

export function GenreExpandableList({ genres, previewCount = 5, emptyMessage = "Ingen data." }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  if (genres.length === 0) {
    return <p className="text-sm text-coven-text-muted">{emptyMessage}</p>;
  }

  const visible = showAll ? genres : genres.slice(0, previewCount);
  const canExpand = genres.length > previewCount;

  return (
    <div className="space-y-1">
      <ul className="divide-y divide-coven-border">
        {visible.map((g, i) => {
          const isOpen = expanded === g.genre;
          return (
            <li key={g.genre} className="py-2 first:pt-0 last:pb-0">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-2"
                onClick={() => setExpanded(isOpen ? null : g.genre)}
              >
                <div className="flex items-baseline gap-2">
                  <span className="shrink-0 text-xs tabular-nums text-coven-text-muted">{i + 1}.</span>
                  <span className="text-sm text-coven-text">{g.genre}</span>
                  <span className="shrink-0 text-xs text-coven-text-muted">
                    ({g.count} {concertCountSuffix(g.count)})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="shrink-0 text-sm font-semibold text-coven-primary">
                    {g.average.toFixed(1)}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 shrink-0 text-coven-text-muted transition-transform",
                      isOpen && "rotate-180"
                    )}
                  />
                </div>
              </button>

              {isOpen && g.bands.length > 0 && (
                <div className="mt-2 ml-5 rounded-md border border-coven-border bg-coven-card p-3">
                  <ul className="space-y-2">
                    {g.bands.map((b) => (
                      <li key={b.band} className="flex items-center justify-between">
                        <span className="text-sm text-coven-text">{b.band}</span>
                        <span className="text-sm font-semibold text-coven-primary">{b.score}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {canExpand && (
        <button
          type="button"
          className="flex w-full items-center justify-center gap-1 pt-2 text-xs text-coven-text-muted transition hover:text-coven-text"
          onClick={() => setShowAll((prev) => !prev)}
        >
          {showAll ? (
            <>
              Vis færre <ChevronUp className="h-3.5 w-3.5" />
            </>
          ) : (
            <>
              Vis alle ({genres.length}) <ChevronDown className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      )}
    </div>
  );
}
