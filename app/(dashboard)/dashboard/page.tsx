import { listConcerts } from "@/lib/db/concerts";
import {
  getAverageMainScore,
  getMostFrequentVenue,
  getTotals
} from "@/lib/stats/concerts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConcertTable } from "@/components/concerts/concert-table";
import { DashboardActions } from "@/components/dashboard/dashboard-actions";
import { NextConcert } from "@/components/dashboard/next-concert";
import { t } from "@/lib/i18n";

export default async function DashboardPage() {
  const concerts = await listConcerts();
  const totals = getTotals(concerts);
  const averageMain = getAverageMainScore(concerts);
  const topVenue = getMostFrequentVenue(concerts);

  const recent = concerts.slice(0, 5);

  return (
    <div className="space-y-5">
      <h2 className="font-heading text-xl font-semibold tracking-tight">
        {t("dashboard.title")}
      </h2>
      <DashboardActions />
      <div className="grid gap-4 md:grid-cols-3">
        <NextConcert />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
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
            <CardTitle>{t("dashboard.avg_main_score")}</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {averageMain != null ? averageMain.toFixed(1) : "–"}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.most_frequent_venue")}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-coven-text-soft">
            {topVenue ?? t("dashboard.no_data")}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.recent_concerts")}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-coven-text-soft">
          {recent.length === 0 ? (
            <p>{t("dashboard.no_concerts_yet")}</p>
          ) : (
            <ConcertTable concerts={recent} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
