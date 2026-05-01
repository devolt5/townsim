import districtNorth from "@/images/districts/north.jpg";
import districtTownCenter from "@/images/districts/town_center.jpg";
import districtBusiness from "@/images/districts/business_district.jpg";
import districtSouth from "@/images/districts/south.jpg";
import districtIndustrial from "@/images/districts/industrial.jpg";
import districtGreen from "@/images/districts/green_district.jpg";
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
    seats: 8,
    description:
      "Terra setzt sich leidenschaftlich für Nachhaltigkeit und Umweltschutz ein und vertraut darauf, dass grüne Stadtentwicklung der Schlüssel zu langfristigem Wohlstand ist. Die Fraktion repräsentiert Umweltschützer, Öko-Unternehmer und Bürger, denen die Zukunft des Planeten am Herzen liegt. Sie fordern eine Reduktion von CO2-Emissionen, den Ausbau von Grünflächen und eine nachhaltige Energiewende in der Stadt. Terra glaubt, dass Wirtschaftswachstum und Umweltschutz keine Gegensätze sind, sondern sich gegenseitig verstärken können. Ihre Werte sind Verantwortung gegenüber kommenden Generationen und die Harmonie zwischen Stadt und Natur.",
  },
  {
    short: "Syndikat",
    icon: "💼",
    image: factionBusiness,
    trust: 45,
    seats: 9,
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
    seats: 7,
    description:
      "Die Union der Gilden vertritt das Handwerk, die Arbeiterschaft und mittelständischen Betriebe, die das Rückgrat der lokalen Wirtschaft bilden. Sie setzen sich für faire Löhne, sichere Arbeitsbedingungen und angemessene Sozialleistungen ein und stehen für die Handwerkskunst und Expertise ihrer Mitglieder. Die Fraktion fordert Investitionen in Berufsausbildung, Schutz von lokalen Handwerksbetrieben vor großen Konzernen und starke Arbeitnehmerrechte. Sie sehen sich als Vermittler zwischen kapitalistischen Großkonzernen und idealistischen Umweltbewegungen. Ihre Werte sind Handwerkskunst, Arbeiterrechte und die Wahrung des Mittelstands als wirtschaftliches Fundament.",
  },
  {
    short: "Der Bund",
    icon: "🏛️",
    image: factionConservatives,
    trust: 29,
    seats: 6,
    description:
      "Der Bund vertritt traditionelle Werte, Stabilität und bewährte Institutionen und möchte die Stadt vor zu schnellen, potenziell destabilisierenden Veränderungen bewahren. Sie repräsentieren ältere Generationen, konservative Geschäftsleute und jene, die in etablierten Strukturen Sicherheit finden. Der Bund fordert Vorsicht bei Reformen, Bewahrung historischer Stadtteile und Respekt vor etablierten Machtstrukturen und Traditionen. Sie sehen radikale Veränderungen mit Skepsis und bevorzugen graduelle, sichere Entwicklungen über Jahrzehnte. Ihre Werte sind Kontinuität, Tradition, Verlässlichkeit und der Erhalt bewährter Ordnung.",
  },
];

export const OPEN_PROMISES: Promise[] = [];

export interface District {
  name: string;
  description: string;
  image: string;
  /** Polygon vertices in world space (scaled ×2.5 from the SVG concept layout) */
  points: { x: number; y: number }[];
  color: number;
}

export const DISTRICTS: District[] = [
  {
    name: "Wohngebiet Nord",
    description:
      "Mehrfamilienhäuser, Schulen und Spielplätze. Hohe Bevölkerungsdichte.",
    image: districtNorth,
    color: 0x8bc48a,
    // 10 points (doubled from 5). Shared intermediates:
    //   {38,-119}→{62,-257}: {68,-185}  (with Gewerbegebiet)
    //   {-100,-257}→{-62,-107}: {-95,-175}  (with Grünviertel)
    //   {-62,-107}→{38,-119}: {-15,-100}  (with Innenstadt)
    points: [
      { x: 38, y: -119 },
      { x: 68, y: -185 }, // → Gewerbegebiet border
      { x: 62, y: -257 },
      { x: 28, y: -280 }, // outer top-right
      { x: -12, y: -294 },
      { x: -55, y: -288 }, // outer top-left
      { x: -100, y: -257 },
      { x: -95, y: -175 }, // → Grünviertel border
      { x: -62, y: -107 },
      { x: -15, y: -100 }, // → Innenstadt border
    ],
  },
  {
    name: "Innenstadt",
    description:
      "Haupteinkaufszone, Rathaus und öffentliche Plätze. Herzstück der Stadt.",
    image: districtTownCenter,
    color: 0xd4a853,
    // 12 points (doubled from 6). All edges are shared borders.
    points: [
      { x: -62, y: -107 },
      { x: -15, y: -100 }, // → Nord border
      { x: 38, y: -119 },
      { x: 62, y: -50 }, // → Gewerbegebiet border
      { x: 62, y: 6 },
      { x: 50, y: 35 }, // → Industriegebiet border
      { x: 12, y: 81 },
      { x: -15, y: 80 }, // → Süd border
      { x: -50, y: 56 },
      { x: -80, y: 15 }, // → Grünviertel border
      { x: -88, y: -31 },
      { x: -90, y: -65 }, // → Grünviertel border
    ],
  },
  {
    name: "Gewerbegebiet",
    description:
      "Büros, Einzelhandel und Logistik. Größter Arbeitgeber der Stadt.",
    image: districtBusiness,
    color: 0x7a9cc4,
    // 12 points (doubled from 6). Shared intermediates:
    //   {62,6}→{175,31}: {120,35}  (with Industriegebiet)
    //   {62,-257}→{38,-119}: {68,-185}  (with Nord)
    //   {38,-119}→{62,6}: {62,-50}  (with Innenstadt)
    points: [
      { x: 62, y: 6 },
      { x: 120, y: 35 }, // → Industriegebiet border
      { x: 175, y: 31 },
      { x: 210, y: -25 }, // outer right
      { x: 212, y: -94 },
      { x: 200, y: -165 }, // outer top-right
      { x: 150, y: -231 },
      { x: 105, y: -255 }, // outer top
      { x: 62, y: -257 },
      { x: 68, y: -185 }, // → Nord border
      { x: 38, y: -119 },
      { x: 62, y: -50 }, // → Innenstadt border
    ],
  },
  {
    name: "Industriegebiet",
    description:
      "Produktion, Handwerksbetriebe und Lagerung. Wirtschaftsmotor der Region.",
    image: districtIndustrial,
    color: 0xb08060,
    // 12 points (doubled from 6). Shared intermediates:
    //   {12,81}→{62,143}: {25,120}  (with Süd)
    //   {62,143}→{138,181}: {92,168}  (with Süd)
    //   {175,31}→{62,6}: {120,35}  (with Gewerbegebiet)
    //   {62,6}→{12,81}: {50,35}  (with Innenstadt)
    points: [
      { x: 12, y: 81 },
      { x: 25, y: 120 }, // → Süd border
      { x: 62, y: 143 },
      { x: 92, y: 168 }, // → Süd border
      { x: 138, y: 181 },
      { x: 195, y: 155 }, // outer right
      { x: 212, y: 93 },
      { x: 210, y: 60 }, // outer right
      { x: 175, y: 31 },
      { x: 120, y: 35 }, // → Gewerbegebiet border
      { x: 62, y: 6 },
      { x: 50, y: 35 }, // → Innenstadt border
    ],
  },
  {
    name: "Wohngebiet Süd",
    description:
      "Einfamilienhäuser und ruhige Wohnlage. Beliebtes Familienquartier.",
    image: districtSouth,
    color: 0xa8d4a0,
    // 16 points (doubled from 8). Shared intermediates:
    //   {-50,56}→{-125,131}: {-82,100}  (with Grünviertel)
    //   {138,181}→{62,143}: {92,168}  (with Industriegebiet)
    //   {62,143}→{12,81}: {25,120}  (with Industriegebiet)
    //   {12,81}→{-50,56}: {-15,80}  (with Innenstadt)
    points: [
      { x: -50, y: 56 },
      { x: -82, y: 100 }, // → Grünviertel border
      { x: -125, y: 131 },
      { x: -115, y: 190 }, // outer south-west
      { x: -62, y: 243 },
      { x: -38, y: 278 }, // outer south
      { x: -12, y: 293 },
      { x: 35, y: 285 }, // outer south
      { x: 75, y: 243 },
      { x: 118, y: 220 }, // outer south-east
      { x: 138, y: 181 },
      { x: 92, y: 168 }, // → Industriegebiet border
      { x: 62, y: 143 },
      { x: 25, y: 120 }, // → Industriegebiet border
      { x: 12, y: 81 },
      { x: -15, y: 80 }, // → Innenstadt border
    ],
  },
  {
    name: "Grünviertel",
    description: "Parks, Kleingärten und Naturschutzgebiet. Lunge der Stadt.",
    image: districtGreen,
    color: 0x5a9e5a,
    // 16 points (doubled from 8). Shared intermediates:
    //   {-62,-107}→{-100,-257}: {-95,-175}  (with Nord)
    //   {-125,131}→{-50,56}: {-82,100}  (with Süd)
    //   {-50,56}→{-88,-31}: {-80,15}  (with Innenstadt)
    //   {-88,-31}→{-62,-107}: {-90,-65}  (with Innenstadt)
    points: [
      { x: -62, y: -107 },
      { x: -95, y: -175 }, // → Nord border
      { x: -100, y: -257 },
      { x: -210, y: -205 }, // outer west
      { x: -235, y: -119 },
      { x: -240, y: -20 },
      { x: -250, y: 20 }, // outer west
      { x: -260, y: 20 },
      { x: -280, y: 25 },
      { x: -250, y: 80 }, // outer west
      { x: -175, y: 93 },
      { x: -155, y: 120 }, // outer south-west
      { x: -125, y: 131 },
      { x: -82, y: 100 }, // → Süd border
      { x: -50, y: 56 },
      { x: -80, y: 15 }, // → Innenstadt border
      { x: -88, y: -31 },
      { x: -90, y: -65 }, // → Innenstadt border
    ],
  },
];
