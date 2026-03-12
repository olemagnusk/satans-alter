import { listConcerts } from "@/lib/db/concerts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConcertTable } from "@/components/concerts/concert-table";

export default async function ConcertsPage() {
  const concerts = await listConcerts();

  return (
    <div className="space-y-4">
      <h2 className="font-heading text-lg font-semibold tracking-tight">Concerts</h2>
      <Card>
        <CardHeader>
          <CardTitle>All concerts</CardTitle>
        </CardHeader>
        <CardContent>
          <ConcertTable concerts={concerts} />
        </CardContent>
      </Card>
    </div>
  );
}

