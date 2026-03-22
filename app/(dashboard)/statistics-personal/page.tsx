import { listConcerts } from "@/lib/db/concerts";
import { getAllPersonalStats } from "@/lib/stats/personal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PersonalTabs } from "@/components/statistics/personal-tabs";
import { t } from "@/lib/i18n";

export default async function PersonalStatsPage() {
  const concerts = await listConcerts();
  const stats = getAllPersonalStats(concerts);

  return (
    <div className="space-y-4">
      <h2 className="font-heading text-lg font-semibold tracking-tight">
        {t("stats_personal.title")}
      </h2>

      {/* Per-member average score cards — always visible */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((member) => (
          <Card key={member.nickname}>
            <CardHeader>
              <CardTitle>{member.nickname}: {t("stats_personal.avg_score")}</CardTitle>
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
      </div>

      {/* Tabbed per-person detail cards */}
      <PersonalTabs stats={stats} />
    </div>
  );
}
