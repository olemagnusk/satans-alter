"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DisagreementPair } from "@/lib/stats/headtohead";

export function DisagreementList({ disagreements }: { disagreements: DisagreementPair[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <ul className="divide-y divide-coven-border">
      {disagreements.map((d, i) => {
        const isOpen = expanded === d.pair;
        return (
          <li key={d.pair} className="py-2 first:pt-0 last:pb-0">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-2"
              onClick={() => setExpanded(isOpen ? null : d.pair)}
            >
              <div className="flex items-baseline gap-2">
                <span className="shrink-0 text-xs tabular-nums text-coven-text-muted">{i + 1}.</span>
                <span className="text-sm text-coven-text">{d.pair}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="shrink-0 text-sm font-semibold text-coven-primary">
                  {d.avgDiff.toFixed(2)}
                </span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 shrink-0 text-coven-text-muted transition-transform",
                    isOpen && "rotate-180"
                  )}
                />
              </div>
            </button>

            {isOpen && d.topBands.length > 0 && (
              <div className="mt-2 ml-5 rounded-md border border-coven-border bg-coven-card p-3">
                <p className="mb-2 text-xs font-medium text-coven-text-muted">
                  Topp uenighet
                </p>
                <ul className="space-y-2">
                  {d.topBands.map((b) => (
                    <li key={b.band} className="flex items-center justify-between">
                      <span className="text-sm text-coven-text">{b.band}</span>
                      <div className="flex items-center gap-2 text-xs text-coven-text-muted">
                        {b.scores.map((s) => (
                          <span key={s.nickname}>
                            {s.nickname}: <span className="font-semibold text-coven-text">{s.score}</span>
                          </span>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
