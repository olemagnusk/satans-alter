import Link from "next/link";
import { listConcerts } from "@/lib/db/concerts";
import { getNextConcertDate, getNextConcertBooker } from "@/lib/db/settings";
import {
  getAverageMainScore,
  getAverageSupportScore,
  getTopVenues,
  getTotals,
  getConcertsPerYear,
} from "@/lib/stats/concerts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardActions } from "@/components/dashboard/dashboard-actions";
import { NextConcert } from "@/components/dashboard/next-concert";
import { RecentConcerts } from "@/components/dashboard/recent-concerts";
import { ConcertsPerYearChart } from "@/components/statistics/concerts-per-year-chart";
import { t } from "@/lib/i18n";

export default async function DashboardPage() {
  const [concerts, nextDate, nextBooker] = await Promise.all([
    listConcerts(),
    getNextConcertDate(),
    getNextConcertBooker(),
  ]);
  const totals = getTotals(concerts);
  const averageMain = getAverageMainScore(concerts);
  const averageSupport = getAverageSupportScore(concerts);
  const topVenues = getTopVenues(concerts, 3);
  const concertsPerYear = getConcertsPerYear(concerts);

  const recent = concerts.slice(0, 5);

  return (
    <div className="space-y-5">
      <h2 className="font-heading text-xl font-semibold tracking-tight">
        {t("dashboard.title")}
      </h2>
      <DashboardActions />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <NextConcert initialDate={nextDate} initialBooker={nextBooker} />
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.total_concerts")}</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {totals.totalConcerts}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.avg_score")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-coven-text-muted">{t("stats_personal.band")}</p>
                <p className="text-2xl font-semibold">
                  {averageMain != null ? averageMain.toFixed(1) : "–"}
                </p>
              </div>
              <div>
                <p className="text-xs text-coven-text-muted">{t("stats_personal.support")}</p>
                <p className="text-2xl font-semibold">
                  {averageSupport != null ? averageSupport.toFixed(1) : "–"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.top_venues")}</CardTitle>
        </CardHeader>
        <CardContent>
          {topVenues.length === 0 ? (
            <p className="text-sm text-coven-text-muted">{t("dashboard.no_data")}</p>
          ) : (
            <div className="divide-y divide-coven-border">
              {topVenues.map((v, i) => (
                <div
                  key={v.venue}
                  className="flex items-center justify-between py-2 first:pt-0 last:pb-0"
                >
                  <span className="text-sm text-coven-text">
                    {i + 1}. {v.venue}
                  </span>
                  <span className="text-xs text-coven-text-muted">
                    {v.count} {t("dashboard.visits")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.concerts_per_year")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ConcertsPerYearChart data={concertsPerYear} />
        </CardContent>
      </Card>
      <RecentConcerts
        concerts={recent}
        cta={
          <Link
            href="/concerts"
            className="inline-flex rounded-xl bg-coven-primary px-4 py-2.5 text-xs font-medium text-coven-bg transition hover:bg-coven-primary-hover active:text-coven-bg"
          >
            {t("dashboard.see_all_concerts")}
          </Link>
        }
      />
    </div>
  );
}
