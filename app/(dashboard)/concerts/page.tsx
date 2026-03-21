import { listConcerts } from "@/lib/db/concerts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConcertTable } from "@/components/concerts/concert-table";
import { t } from "@/lib/i18n";

export default async function ConcertsPage() {
  const concerts = await listConcerts();

  return (
    <div className="space-y-4">
      <h2 className="font-heading text-lg font-semibold tracking-tight">{t("concerts.title")}</h2>
      <Card>
        <CardHeader>
          <CardTitle>{t("concerts.all")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ConcertTable concerts={concerts} />
        </CardContent>
      </Card>
    </div>
  );
}

