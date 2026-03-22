import { t } from "@/lib/i18n";

const BUD = [
  {
    title: "Neste rituale skal fastsettes f\u00F8r natten d\u00F8r.",
    summary: "Ingen forlater alteret uten at neste konsert og dato er besluttet.",
  },
  {
    title: "Ingen vanhellig spoiling.",
    summary: "Setlister, overraskelser og h\u00F8ydepunkter skal ikke avsl\u00F8res f\u00F8r alle har vitnet.",
  },
  {
    title: "Alteret skal ikke vokse for stort.",
    summary: "Ingen scener st\u00F8rre enn Sentrum Scene skal tilbes.",
  },
  {
    title: "Pilsen er hellig.",
    summary: "Den som nekter en pils, nekter fellesskapet.",
  },
  {
    title: "M\u00F8t n\u00E5r portene \u00E5pnes.",
    summary: "Frafall er et tegn p\u00E5 svak vilje.",
  },
  {
    title: "Ingen forsvinning i skyggene.",
    summary: "Den som trekker seg bort, skal gi tegn.",
  },
  {
    title: "Supportbandet skal \u00E6res.",
    summary: "Ingen ignorerer de som varmer opp flammen.",
  },
  {
    title: "Flokken beveger seg samlet.",
    summary: "Avvik skal erkl\u00E6res \u2013 ikke oppdages.",
  },
  {
    title: "Ingen splid ved alteret.",
    summary: "Uenigheter tas i m\u00F8rket, ikke i flokken.",
  },
  {
    title: "Det ukjente skal dyrkes.",
    summary: "Nye sjangre og band skal opps\u00F8kes \u2013 stagnasjon er for de d\u00F8de.",
  },
  {
    title: "Merch er relikvier.",
    summary: "Det som finnes ved bordet, skal vurderes med respekt.",
  },
  {
    title: "Etterritualet er obligatorisk.",
    summary: "Konserten skal dissekeres over minst \u00E9n pils.",
  },
  {
    title: "Ingen rop skal d\u00F8 i stillhet.",
    summary: "Alle konserter skal bevares.",
  },
  {
    title: "Den som p\u00E5kaller, b\u00E6rer ansvaret.",
    summary: "Forslagsstiller f\u00F8lger opp med detaljer, billetter og gjennomf\u00F8ring.",
  },
];

const ROMAN = [
  "I", "II", "III", "IV", "V", "VI", "VII", "VIII",
  "IX", "X", "XI", "XII", "XIII", "XIV", "XV",
];

export default function AlteretsBudPage() {
  return (
    <div className="space-y-4">
      <h2 className="font-heading text-lg font-semibold tracking-tight">
        {t("nav.alterets_bud")}
      </h2>

      <ol className="space-y-4">
        {BUD.map((bud, i) => (
          <li key={i} className="border-b border-coven-border pb-4 last:border-0">
            <p className="font-bold text-coven-text">
              {ROMAN[i]}. {bud.title}
            </p>
            <p className="mt-1 text-sm text-coven-text-muted">
              {bud.summary}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
