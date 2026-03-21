"use client";

import { useState, useCallback } from "react";
import { List, Rows3 } from "lucide-react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeadCell,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MEMBERS, displayName } from "@/lib/members";
import { t } from "@/lib/i18n";
import type { Concert } from "@/lib/validation/concert";

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

function ScoreDisplay({
  scores,
  expanded,
}: {
  scores: { initial: string; nickname: string; value: number | null }[];
  expanded: boolean;
}) {
  if (expanded) {
    return (
      <div className="space-y-0.5">
        {scores.map((s) => (
          <div key={s.initial} className="flex items-center gap-1.5 text-xs">
            <span className="w-10 text-coven-text-muted">{s.nickname}</span>
            <span className="tabular-nums text-coven-text">
              {s.value != null ? s.value : "–"}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <span className="tabular-nums text-xs">
      {scores
        .map((s) => `${s.initial}:${s.value != null ? s.value : "–"}`)
        .join("  ")}
    </span>
  );
}

export function RecentConcerts({ concerts, cta }: { concerts: Concert[]; cta?: React.ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setIsScrolled(e.currentTarget.scrollLeft > 0);
  }, []);

  const memberScores = (concert: Concert, type: "main" | "support") => {
    const prefix = type === "main" ? "score_main_" : "score_support_";
    return MEMBERS.map((m) => ({
      initial: m.initial,
      nickname: m.nickname,
      value: concert[`${prefix}${m.dbName.toLowerCase()}` as keyof Concert] as
        | number
        | null,
    }));
  };

  const stickyBandShadow = isScrolled
    ? "after:pointer-events-none after:absolute after:right-0 after:top-0 after:h-full after:w-2 after:translate-x-full after:bg-gradient-to-r after:from-coven-bg/40 after:to-transparent after:content-['']"
    : "";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t("dashboard.recent_concerts")}</CardTitle>
        <div className="flex shrink-0 items-center gap-1 rounded-lg border border-coven-border p-0.5">
          <button
            type="button"
            title={t("table.condensed_view")}
            className={`rounded-md p-1.5 transition ${
              !expanded
                ? "bg-coven-active text-coven-text"
                : "text-coven-text-muted hover:text-coven-text"
            }`}
            onClick={() => setExpanded(false)}
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            title={t("table.expanded_view")}
            className={`rounded-md p-1.5 transition ${
              expanded
                ? "bg-coven-active text-coven-text"
                : "text-coven-text-muted hover:text-coven-text"
            }`}
            onClick={() => setExpanded(true)}
          >
            <Rows3 className="h-4 w-4" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="text-sm text-coven-text-soft">
        <div onScroll={handleScroll} className="-mx-4 overflow-x-auto sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeadCell className="normal-case">{t("col.date")}</TableHeadCell>
                  <TableHeadCell className={`normal-case sticky left-0 z-10 bg-coven-surface ${stickyBandShadow}`}>{t("col.band")}</TableHeadCell>
                  <TableHeadCell className="normal-case">{t("col.support")}</TableHeadCell>
                  <TableHeadCell className="normal-case">{t("col.venue")}</TableHeadCell>
                  <TableHeadCell className="normal-case">{t("col.booker")}</TableHeadCell>
                  <TableHeadCell className="normal-case">{t("col.main")}</TableHeadCell>
                  <TableHeadCell className="normal-case">{t("col.support_score")}</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {concerts.map((concert) => (
                  <TableRow key={concert.id}>
                    <TableCell className="whitespace-nowrap text-xs sm:text-sm">
                      {formatDate(concert.date)}
                    </TableCell>
                    <TableCell className={`sticky left-0 z-10 max-w-[120px] truncate bg-coven-surface group-hover:bg-coven-surface-hover text-xs font-semibold sm:max-w-none sm:text-sm transition-colors ${stickyBandShadow}`}>
                      {concert.band_name}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-xs sm:text-sm">
                      {[concert.support_band_1, concert.support_band_2]
                        .filter(Boolean)
                        .join(", ") || "–"}
                    </TableCell>
                    <TableCell className="max-w-[100px] truncate text-xs sm:max-w-none sm:whitespace-nowrap sm:text-sm">
                      {concert.venue || "–"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {concert.booker ? (
                        <span className="inline-flex rounded-full bg-coven-border px-2 py-0.5 text-xs font-medium text-coven-text-soft">
                          {displayName(concert.booker)}
                        </span>
                      ) : "–"}
                    </TableCell>
                    <TableCell>
                      <ScoreDisplay
                        scores={memberScores(concert, "main")}
                        expanded={expanded}
                      />
                    </TableCell>
                    <TableCell>
                      <ScoreDisplay
                        scores={memberScores(concert, "support")}
                        expanded={expanded}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        {cta && <div className="mt-4">{cta}</div>}
      </CardContent>
    </Card>
  );
}
