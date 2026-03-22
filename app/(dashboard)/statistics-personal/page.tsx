import { listConcerts } from "@/lib/db/concerts";
import { getAllPersonalStats } from "@/lib/stats/personal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExpandableList } from "@/components/statistics/expandable-list";
import { ScoreDistributionChart } from "@/components/statistics/score-distribution";
import { t } from "@/lib/i18n";

export default async function PersonalStatsPage() {
  const concerts = await listConcerts();
  const stats = getAllPersonalStats(concerts);

  return (
    <div className="space-y-4">
      <h2 className="font-heading text-lg font-semibold tracking-tight">
        {t("stats_personal.title")}
      </h2>

      {/* Per-member average score cards */}
      {stats.map((member) => (
        <Card key={member.nickname}>
          <CardHeader>
            <CardTitle>{member.nickname} – {t("stats_personal.avg_score")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-coven-text-muted">{t("stats_personal.band")}</p>
                <p className="text-2xl font-semibold">
                  {member.avgMain != null ? member.avgMain.toFixed(1) : "–"}
                </p>
              </div>
              <div>
                <p className="text-xs text-coven-text-muted">{t("stats_personal.support")}</p>
                <p className="text-2xl font-semibold">
                  {member.avgSupport != null ? member.avgSupport.toFixed(1) : "–"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Top band per person */}
      {stats.map((member) => (
        <Card key={`band-${member.nickname}`}>
          <CardHeader>
            <CardTitle>{t("stats_personal.top_band")} - {member.nickname}</CardTitle>
          </CardHeader>
          <CardContent>
            <ExpandableList
              items={member.topBands.map((b) => ({
                label: b.band,
                value: String(b.score),
              }))}
              emptyMessage={t("stats_personal.no_data")}
            />
          </CardContent>
        </Card>
      ))}

      {/* Score distribution per person */}
      {stats.map((member) => (
        <Card key={`dist-${member.nickname}`}>
          <CardHeader>
            <CardTitle>{t("stats_personal.score_distribution")} - {member.nickname}</CardTitle>
          </CardHeader>
          <CardContent>
            <ScoreDistributionChart data={member.scoreDistribution} />
          </CardContent>
        </Card>
      ))}

      {/* Top venue per person */}
      {stats.map((member) => (
        <Card key={`venue-${member.nickname}`}>
          <CardHeader>
            <CardTitle>{t("stats_personal.top_venue")} - {member.nickname}</CardTitle>
          </CardHeader>
          <CardContent>
            <ExpandableList
              items={member.topVenues.map((v) => ({
                label: v.venue,
                value: v.average.toFixed(1),
                sub: `${v.count} ${v.count === 1 ? t("stats_personal.concerts_count_singular") : t("stats_personal.concerts_count_plural")}`,
              }))}
              emptyMessage={t("stats_personal.no_data")}
            />
          </CardContent>
        </Card>
      ))}

      {/* Top genre per person */}
      {stats.map((member) => (
        <Card key={`genre-${member.nickname}`}>
          <CardHeader>
            <CardTitle>{t("stats_personal.top_genre")} - {member.nickname}</CardTitle>
          </CardHeader>
          <CardContent>
            <ExpandableList
              items={member.topGenres.map((g) => ({
                label: g.genre,
                value: g.average.toFixed(1),
                sub: `${g.count} ${g.count === 1 ? t("stats_personal.concerts_count_singular") : t("stats_personal.concerts_count_plural")}`,
              }))}
              emptyMessage={t("stats_personal.no_data")}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
