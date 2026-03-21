import { listConcerts } from "@/lib/db/concerts";
import {
  getAverageMainScore,
  getTotals,
  getTopBandsByScore
} from "@/lib/stats/concerts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { t } from "@/lib/i18n";

export default async function StatisticsPage() {
  const concerts = await listConcerts();
  const totals = getTotals(concerts);
  const avgMain = getAverageMainScore(concerts);
  const topBands = getTopBandsByScore(concerts);

  return (
    <div className="space-y-4">
      <h2 className="font-heading text-lg font-semibold tracking-tight">{t("stats.title")}</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{t("stats.total_concerts")}</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {totals.totalConcerts}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("stats.total_attendees")}</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {totals.totalAttendees}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("stats.avg_main_score")}</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {avgMain != null ? avgMain.toFixed(1) : "–"}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t("stats.top_bands")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-coven-text-soft">
          {topBands.length === 0 ? (
            <p>{t("stats.no_scored")}</p>
          ) : (
            <ul className="space-y-1">
              {topBands.map((band) => (
                <li key={band.band} className="flex justify-between">
                  <span>{band.band}</span>
                  <span className="text-coven-text-muted">
                    {band.average.toFixed(2)} ({band.count})
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

