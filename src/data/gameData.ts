import factionGreen from "@/images/factions/green.jpg";
import factionBusiness from "@/images/factions/business.jpg";
import factionCitizens from "@/images/factions/citizens.jpg";
import factionWorkers from "@/images/factions/workers.jpg";
import factionConservatives from "@/images/factions/conservatives.jpg";

export interface Metric {
  key: string;
  label: string;
  icon: string;
  value: number;
  color: string;
}

export interface Faction {
  short: string;
  icon: string;
  image: string;
  trust: number;
  seats: number;
  description?: string;
}

export interface PendingDecision {
  title: string;
  text: string;
  image?: string;
  imageAlt?: string;
  options: { label: string; variant: "accept" | "reject" | "negotiate" }[];
}

export interface Promise {
  id: string;
  text: string;
  faction: string;
  fulfilled: boolean;
}

export const METRICS: Metric[] = [
  {
    key: "budget",
    label: "Stadthaushalt",
    icon: "💰",
    value: 65,
    color: "bg-amber-500",
  },
  {
    key: "satisfaction",
    label: "Bürgerzufriedenheit",
    icon: "😊",
    value: 55,
    color: "bg-sky-500",
  },
  {
    key: "sustainability",
    label: "Nachhaltigkeit",
    icon: "🌱",
    value: 40,
    color: "bg-emerald-500",
  },
  {
    key: "economy",
    label: "Wirtschaftskraft",
    icon: "📊",
    value: 60,
    color: "bg-violet-500",
  },
];

export const FACTIONS: Faction[] = [
  {
    short: "Terra",
    icon: "🌿",
    image: factionGreen,
    trust: 62,
    seats: 13,
    description:
      "Terra setzt sich leidenschaftlich für Nachhaltigkeit und Umweltschutz ein und vertraut darauf, dass grüne Stadtentwicklung der Schlüssel zu langfristigem Wohlstand ist. Die Fraktion repräsentiert Umweltschützer, Öko-Unternehmer und Bürger, denen die Zukunft des Planeten am Herzen liegt. Sie fordern eine Reduktion von CO2-Emissionen, den Ausbau von Grünflächen und eine nachhaltige Energiewende in der Stadt. Terra glaubt, dass Wirtschaftswachstum und Umweltschutz keine Gegensätze sind, sondern sich gegenseitig verstärken können. Ihre Werte sind Verantwortung gegenüber kommenden Generationen und die Harmonie zwischen Stadt und Natur.",
  },
  {
    short: "Syndikat",
    icon: "💼",
    image: factionBusiness,
    trust: 45,
    seats: 8,
    description:
      "Das Syndikat vertritt die Interessen der lokalen Wirtschaft, großer Konzerne und innovativen Unternehmern, die die Stadt als Zentrum des Handels und der Industrie sehen. Sie repräsentieren Geschäftsleute, Investoren und jene, die Arbeitsplätze und wirtschaftliches Wachstum als Priorität einstufen. Das Syndikat fordert weniger Bürokratie, Steuererleichterungen für Unternehmen und massive Investitionen in Infrastruktur und Gewerbegebiete. Sie sehen die Stadt als wirtschaftliches Kraftwerk, das die Region antreibt und Wohlstand für alle schafft. Ihre Werte sind Leistung, Effizienz und wirtschaftliche Stärke durch offene Märkte.",
  },
  {
    short: "Bürger",
    icon: "🏘️",
    image: factionCitizens,
    trust: 71,
    seats: 10,
    description:
      "Die Bürger-Fraktion ist die Stimme des normalen Volkes und konzentriert sich auf das Wohl der breiten Bevölkerung in ihrem täglichen Leben. Sie vertreten Arbeiter, Familien, Rentner und alle, die auf gute öffentliche Dienste, bezahlbaren Wohnraum und Sicherheit angewiesen sind. Die Fraktion fordert bessere Schulen, Krankenhäuser, öffentliche Verkehrsmittel und lebenswerte Wohnviertel für alle Einkommensschichten. Sie setzen sich für soziale Gerechtigkeit ein und wollen sicherstellen, dass wirtschaftliche Entwicklung allen Menschen zugute kommt, nicht nur den Wohlhabenden. Ihre Werte sind Gemeinwohl, Sicherheit und eine lebenswerte Stadt für alle Bürger.",
  },
  {
    short: "Union der Gilden",
    icon: "🔧",
    image: factionWorkers,
    trust: 38,
    seats: 11,
    description:
      "Die Union der Gilden vertritt das Handwerk, die Arbeiterschaft und mittelständischen Betriebe, die das Rückgrat der lokalen Wirtschaft bilden. Sie setzen sich für faire Löhne, sichere Arbeitsbedingungen und angemessene Sozialleistungen ein und stehen für die Handwerkskunst und Expertise ihrer Mitglieder. Die Fraktion fordert Investitionen in Berufsausbildung, Schutz von lokalen Handwerksbetrieben vor großen Konzernen und starke Arbeitnehmerrechte. Sie sehen sich als Vermittler zwischen kapitalistischen Großkonzernen und idealistischen Umweltbewegungen. Ihre Werte sind Handwerkskunst, Arbeiterrechte und die Wahrung des Mittelstands als wirtschaftliches Fundament.",
  },
  {
    short: "Der Bund",
    icon: "🏛️",
    image: factionConservatives,
    trust: 29,
    seats: 18,
    description:
      "Der Bund vertritt traditionelle Werte, Stabilität und bewährte Institutionen und möchte die Stadt vor zu schnellen, potenziell destabilisierenden Veränderungen bewahren. Sie repräsentieren ältere Generationen, konservative Geschäftsleute und jene, die in etablierten Strukturen Sicherheit finden. Der Bund fordert Vorsicht bei Reformen, Bewahrung historischer Stadtteile und Respekt vor etablierten Machtstrukturen und Traditionen. Sie sehen radikale Veränderungen mit Skepsis und bevorzugen graduelle, sichere Entwicklungen über Jahrzehnte. Ihre Werte sind Kontinuität, Tradition, Verlässlichkeit und der Erhalt bewährter Ordnung.",
  },
];

export const OPEN_PROMISES: Promise[] = [];

// ---------------------------------------------------------------------------
// Building info — keyed by defKey (matches districts.config.json)
// ---------------------------------------------------------------------------

export interface BuildingInfo {
  label: string;
  description: string;
}

export const BUILDING_INFO: Record<string, BuildingInfo> = {
  building1: {
    label: "Wohnblock",
    description:
      "Ein mehrstöckiges Wohngebäude aus der Nachkriegszeit. Bietet Platz für rund 120 Familien und prägt das Erscheinungsbild des nördlichen Distrikts.",
  },
  house1: {
    label: "Einfamilienhaus",
    description:
      "Ein klassisches Einfamilienhaus mit kleinem Garten. Beliebt bei Familien, die ruhigeres Wohnen der Großstadthektik vorziehen.",
  },
  house2: {
    label: "Doppelhaus",
    description:
      "Ein modernes Doppelhaus mit energieeffizienter Bauweise. Zwei Wohneinheiten teilen sich eine Wand und einen gemeinsamen Innenhof.",
  },
  swimming_bath: {
    label: "Schwimmbad",
    description:
      "Das öffentliche Schwimmbad des Distrikts. Es bietet Freibecken, Umkleidekabinen und einen kleinen Kiosk — und ist an Sommertagen stark frequentiert.",
  },
  grass4: {
    label: "Grünfläche",
    description:
      "Eine gepflegte Grünfläche, die als Naherholungsgebiet für die Anwohner dient. Kein Zugang für Fahrzeuge.",
  },
  townhall: {
    label: "Rathaus",
    description:
      "Das Rathaus ist das administrative Herzstück des Distrikts. Hier werden Baugenehmigungen erteilt, Stadtratssitzungen abgehalten und Bürgeranliegen bearbeitet.",
  },
  park1: {
    label: "Stadtpark",
    description:
      "Ein weitläufiger Park mit Bäumen, Wegen und einer kleinen Bühne für Sommerveranstaltungen. Beliebter Treffpunkt aller Altersgruppen.",
  },
};
