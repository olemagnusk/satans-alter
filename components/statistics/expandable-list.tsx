"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type Item = {
  label: string;
  value: string;
  sub?: string;
};

type Props = {
  items: Item[];
  previewCount?: number;
  emptyMessage?: string;
};

export function ExpandableList({ items, previewCount = 5, emptyMessage = "Ingen data." }: Props) {
  const [expanded, setExpanded] = useState(false);

  if (items.length === 0) {
    return <p className="text-sm text-coven-text-muted">{emptyMessage}</p>;
  }

  const visible = expanded ? items : items.slice(0, previewCount);
  const canExpand = items.length > previewCount;

  return (
    <div className="space-y-1">
      <ul className="divide-y divide-coven-border">
        {visible.map((item, i) => (
          <li key={item.label} className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
            <div className="flex min-w-0 items-baseline gap-2">
              <span className="text-xs tabular-nums text-coven-text-muted">{i + 1}.</span>
              <span className="truncate text-sm text-coven-text">{item.label}</span>
              {item.sub && (
                <span className="text-xs text-coven-text-muted">({item.sub})</span>
              )}
            </div>
            <span className="text-sm font-semibold text-coven-primary">{item.value}</span>
          </li>
        ))}
      </ul>
      {canExpand && (
        <button
          type="button"
          className="flex w-full items-center justify-center gap-1 pt-2 text-xs text-coven-text-muted transition hover:text-coven-text"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? (
            <>
              Vis færre <ChevronUp className="h-3.5 w-3.5" />
            </>
          ) : (
            <>
              Vis alle ({items.length}) <ChevronDown className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      )}
    </div>
  );
}
