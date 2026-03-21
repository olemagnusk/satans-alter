import { listConcerts } from "@/lib/db/concerts";
import {
  getMostFrequentVenue,
  getTopBandsByScore
} from "@/lib/stats/concerts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { t } from "@/lib/i18n";

export default async function InsightsPage() {
  const concerts = await listConcerts();
  const topBands = getTopBandsByScore(concerts, 3);
  const topVenue = getMostFrequentVenue(concerts);

  return (
    <div className="space-y-4">
      <h2 className="font-heading text-lg font-semibold tracking-tight">{t("insights.title")}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("insights.highlights")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-coven-text-soft">
            {concerts.length === 0 ? (
              <p>
                {t("insights.empty")}
              </p>
            ) : (
              <>
                {topVenue && (
                  <p>
                    {t("insights.venue_label")} <span className="font-semibold">{topVenue}</span>{" "}
                    {t("insights.venue_hosted")}
                  </p>
                )}
                {topBands.length > 0 && (
                  <p>
                    {t("insights.band_label")}{" "}
                    <span className="font-semibold">
                      {topBands[0].band}
                    </span>{" "}
                    {t("insights.band_leads")}{" "}
                    <span className="font-semibold">
                      {topBands[0].average.toFixed(2)}
                    </span>
                    .
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("insights.top_3")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-coven-text-soft">
            {topBands.length === 0 ? (
              <p>{t("insights.no_scored")}</p>
            ) : (
              <ol className="list-decimal space-y-1 pl-4">
                {topBands.map((band) => (
                  <li key={band.band}>
                    <span className="font-semibold">{band.band}</span> —{" "}
                    {band.average.toFixed(2)} {t("insights.over")} {band.count}{" "}
                    {band.count === 1 ? t("insights.show") : t("insights.shows")}
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

