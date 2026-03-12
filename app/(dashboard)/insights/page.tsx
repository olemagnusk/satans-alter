import { listConcerts } from "@/lib/db/concerts";
import {
  getMostFrequentVenue,
  getTopBandsByScore
} from "@/lib/stats/concerts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function InsightsPage() {
  const concerts = await listConcerts();
  const topBands = getTopBandsByScore(concerts, 3);
  const topVenue = getMostFrequentVenue(concerts);

  return (
    <div className="space-y-4">
      <h2 className="font-heading text-lg font-semibold tracking-tight">Insights</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Highlights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-coven-text-soft">
            {concerts.length === 0 ? (
              <p>
                Once you have concerts, this page will surface interesting
                patterns automatically.
              </p>
            ) : (
              <>
                {topVenue && (
                  <p>
                    Venue <span className="font-semibold">{topVenue}</span> has
                    hosted the most shows.
                  </p>
                )}
                {topBands.length > 0 && (
                  <p>
                    Band{" "}
                    <span className="font-semibold">
                      {topBands[0].band}
                    </span>{" "}
                    currently leads with an average score of{" "}
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
            <CardTitle>Top 3 bands</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-coven-text-soft">
            {topBands.length === 0 ? (
              <p>No scored concerts yet.</p>
            ) : (
              <ol className="list-decimal space-y-1 pl-4">
                {topBands.map((band) => (
                  <li key={band.band}>
                    <span className="font-semibold">{band.band}</span> —{" "}
                    {band.average.toFixed(2)} over {band.count} show
                    {band.count === 1 ? "" : "s"}
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

