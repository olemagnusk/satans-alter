import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConcertForm } from "@/components/concerts/concert-form";
import { t } from "@/lib/i18n";

export default function NewConcertPage() {
  return (
    <div className="max-w-3xl space-y-4">
      <h2 className="font-heading text-lg font-semibold tracking-tight">{t("concerts.new_title")}</h2>
      <Card>
        <CardHeader>
          <CardTitle>{t("concerts.new_entry")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ConcertForm />
        </CardContent>
      </Card>
    </div>
  );
}

