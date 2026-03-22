"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ExpandableList } from "@/components/statistics/expandable-list";
import { ScoreDistributionChart } from "@/components/statistics/score-distribution";
import { t } from "@/lib/i18n";

type MemberStats = {
  nickname: string;
  dbName: string;
  avgMain: number | null;
  avgSupport: number | null;
  topVenues: { venue: string; average: number; count: number }[];
  topGenres: { genre: string; average: number; count: number }[];
  topBands: { band: string; score: number }[];
  scoreDistribution: { score: number; count: number; bands: string[] }[];
};

function concertCountSuffix(count: number) {
  return count === 1
    ? t("stats_personal.concerts_count_singular")
    : t("stats_personal.concerts_count_plural");
}

export function PersonalTabs({ stats }: { stats: MemberStats[] }) {
  if (stats.length === 0) return null;

  return (
    <Tabs defaultValue={stats[0].nickname}>
      <TabsList>
        {stats.map((member) => (
          <TabsTrigger key={member.nickname} value={member.nickname}>
            {member.nickname}
          </TabsTrigger>
        ))}
      </TabsList>

      {stats.map((member) => (
        <TabsContent key={member.nickname} value={member.nickname}>
          <div className="space-y-4">
            {/* Top band */}
            <Card>
              <CardHeader>
                <CardTitle>{member.nickname}: {t("stats_personal.top_band")}</CardTitle>
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

            {/* Score distribution */}
            <Card>
              <CardHeader>
                <CardTitle>{member.nickname}: {t("stats_personal.score_distribution")}</CardTitle>
              </CardHeader>
              <CardContent>
                <ScoreDistributionChart data={member.scoreDistribution} />
              </CardContent>
            </Card>

            {/* Top venue */}
            <Card>
              <CardHeader>
                <CardTitle>{member.nickname}: {t("stats_personal.top_venue")}</CardTitle>
              </CardHeader>
              <CardContent>
                <ExpandableList
                  items={member.topVenues.map((v) => ({
                    label: v.venue,
                    value: v.average.toFixed(1),
                    sub: `${v.count} ${concertCountSuffix(v.count)}`,
                  }))}
                  emptyMessage={t("stats_personal.no_data")}
                />
              </CardContent>
            </Card>

            {/* Top genre */}
            <Card>
              <CardHeader>
                <CardTitle>{member.nickname}: {t("stats_personal.top_genre")}</CardTitle>
              </CardHeader>
              <CardContent>
                <ExpandableList
                  items={member.topGenres.map((g) => ({
                    label: g.genre,
                    value: g.average.toFixed(1),
                    sub: `${g.count} ${concertCountSuffix(g.count)}`,
                  }))}
                  emptyMessage={t("stats_personal.no_data")}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
