import { listConcerts } from "@/lib/db/concerts";
import {
  getAverageMainScore,
  getAverageSupportScore,
  getTotals,
  getTopBandsByScore,
  getTopSupportBandsByScore,
  getAverageScorePerVenue,
  getScoreOverTime,
} from "@/lib/stats/concerts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExpandableList } from "@/components/statistics/expandable-list";
import { ScoreChart } from "@/components/statistics/score-chart";
import { t } from "@/lib/i18n";

export default async function StatisticsPage() {
  const concerts = await listConcerts();
  const totals = getTotals(concerts);
  const avgMain = getAverageMainScore(concerts);
  const avgSupport = getAverageSupportScore(concerts);
  const topBands = getTopBandsByScore(concerts);
  const topSupport = getTopSupportBandsByScore(concerts);
  const venueScores = getAverageScorePerVenue(concerts);
  const scoreTimeline = getScoreOverTime(concerts);

  return (
    <div className="space-y-4">
      <h2 className="font-heading text-lg font-semibold tracking-tight">
        {t("stats.title")}
      </h2>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            <CardTitle>{t("stats.avg_main_score")}</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {avgMain != null ? avgMain.toFixed(1) : "–"}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("stats.avg_support_score")}</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {avgSupport != null ? avgSupport.toFixed(1) : "–"}
          </CardContent>
        </Card>
      </div>

      {/* Top bands */}
      <Card>
        <CardHeader>
          <CardTitle>{t("stats.top_bands")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ExpandableList
            items={topBands.map((b) => ({
              label: b.band,
              value: b.average.toFixed(1),
              sub: `${b.count} ${t("stats.concerts_count")}`,
            }))}
            emptyMessage={t("stats.no_scored")}
          />
        </CardContent>
      </Card>

      {/* Top support bands */}
      <Card>
        <CardHeader>
          <CardTitle>{t("stats.top_support")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ExpandableList
            items={topSupport.map((b) => ({
              label: b.band,
              value: b.average.toFixed(1),
              sub: `${b.count} ${t("stats.concerts_count")}`,
            }))}
            emptyMessage={t("stats.no_scored")}
          />
        </CardContent>
      </Card>

      {/* Average score per venue */}
      <Card>
        <CardHeader>
          <CardTitle>{t("stats.avg_per_venue")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ExpandableList
            items={venueScores.map((v) => ({
              label: v.venue,
              value: v.average.toFixed(1),
              sub: `${v.count} ${t("stats.concerts_count")}`,
            }))}
            emptyMessage={t("stats.no_scored")}
          />
        </CardContent>
      </Card>

      {/* Score over time chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t("stats.score_over_time")}</CardTitle>
        </CardHeader>
        <CardContent>
          {scoreTimeline.length === 0 ? (
            <p className="text-sm text-coven-text-muted">{t("stats.no_scored")}</p>
          ) : (
            <ScoreChart data={scoreTimeline} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
