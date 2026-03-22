import Image from "next/image";
import { t } from "@/lib/i18n";

const BUD = [
  {
    numeral: "I",
    title: "Neste rituale fastsettes før natten dør.",
    summary: "Ingen forlater alteret uten at neste konsertdato er besluttet.",
  },
  {
    numeral: "II",
    title: "Møt når portene åpnes.",
    summary: "Frafall er et tegn på svak vilje.",
  },
  {
    numeral: "III",
    title: "Ingen vanhellig spoiling.",
    summary:
      "Ingen avsløring av konserten skal finne sted i forkant. Kun den som har påkalt ritualet kjenner hva som venter.",
  },
  {
    numeral: "IV",
    title: "Etterritualet er obligatorisk.",
    summary: "Konserten skal dissekeres over minst én pils.",
  },
  {
    numeral: "V",
    title: "Den som påkaller, bærer ansvaret.",
    summary:
      "Forslagsstiller følger opp med detaljer, billetter og gjennomføring.",
  },
  {
    numeral: "VI",
    title: "Alteret skal ikke vokse for stort.",
    summary: "Ingen scener større enn Sentrum Scene skal tilbes.",
  },
  {
    numeral: "VII",
    title: "Pilsen er hellig.",
    summary: "Den som nekter en pils, nekter fellesskapet.",
  },
  {
    numeral: "VIII",
    title: "Det ukjente skal dyrkes.",
    summary:
      "Nye sjangre og band skal oppsøkes – stagnasjon er for de døde.",
  },
  {
    numeral: "IX",
    title: "Supportbandet skal æres.",
    summary: "Ingen ignorerer de som varmer opp flammen.",
  },
  {
    numeral: "X",
    title: "Ingen forsvinning i skyggene.",
    summary: "Den som trekker seg bort, skal gi tegn.",
  },
  {
    numeral: "XI",
    title: "Ingen splid ved alteret.",
    summary: "Uenigheter tas i mørket, ikke i flokken.",
  },
];

export default function AlteretsBudPage() {
  return (
    <div className="flex flex-col items-center space-y-4">
      <Image
        src="/branding/satans_alter_N2.png"
        alt=""
        width={180}
        height={180}
      />

      <ol className="w-full space-y-4">
        {BUD.map((bud, i) => (
          <li key={i} className="border-b border-coven-border pb-4 last:border-0">
            <p className="text-center font-[Georgia,_'Times_New_Roman',_Times,_serif] text-sm tracking-[0.3em] text-coven-text-muted">
              {bud.numeral}
            </p>
            <p className="mt-2 text-center font-bold text-coven-text">
              {bud.title}
            </p>
            <p className="mt-1 text-center text-sm text-coven-text-muted">
              {bud.summary}
            </p>
          </li>
        ))}
      </ol>

    </div>
  );
}
