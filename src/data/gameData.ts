// Faction images served as static assets from /public/images/factions/
// Node-safe check for Vite's import.meta.env
const baseUrl =
  typeof import.meta.env !== "undefined"
    ? import.meta.env.BASE_URL.replace(/\/$/, "")
    : "";

const FACTION_IMG = {
  green: `${baseUrl}/images/factions/green.jpg`,
  business: `${baseUrl}/images/factions/business.jpg`,
  citizens: `${baseUrl}/images/factions/citizens.jpg`,
  workers: `${baseUrl}/images/factions/workers.jpg`,
  conservatives: `${baseUrl}/images/factions/conservatives.jpg`,
} as const;

export interface Metric {
  key: string;
  label: string;
  icon: string;
  value: number;
  color: string;
}

export type FactionRole = "coalition" | "neutral" | "opposition";

export interface Faction {
  short: string;
  icon: string;
  image: string;
  trust: number;
  seats: number;
  /** Political relationship to the mayor (§3.2). Determines the structural vote modifier. */
  role: FactionRole;
  description?: string;
}

export interface PendingPetition {
  title: string;
  text: string;
  image?: string;
  imageAlt?: string;
  options: { label: string; variant: "accept" | "reject" | "negotiate" }[];
}

export interface GamePromise {
  id: string;
  text: string;
  /** Short name of the target faction */
  faction: string;
  /** Petition tag that triggers auto-fulfillment when a matching petition passes (§4.2) */
  tagCondition?: string;
  /** Inclusive deadline turn. If the promise is not fulfilled by then, it is broken. */
  deadline?: { year: number; quarter: number };
  fulfilled: boolean;
  broken: boolean;
}

/**
 * A runtime modifier produced by a player action (e.g. press conference).
 * Applied independently to each faction's base yes-votes (§3.3).
 */
export interface ActionModifier {
  id: string;
  label: string;
  /**
   * Signed fraction applied to each faction's baseYes independently.
   * +0.25 = press conference (+25 %), -0.25 = scandal (-25 %)
   */
  fraction: number;
  /** Inclusive expiry turn — the modifier is removed when this turn is passed. */
  expires: { year: number; quarter: number };
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
    key: "reputation",
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
    image: FACTION_IMG.green,
    trust: 62,
    seats: 13,
    role: "coalition" as FactionRole,
    description:
      "Terra setzt sich leidenschaftlich für Nachhaltigkeit und Umweltschutz ein und vertraut darauf, dass grüne Stadtentwicklung der Schlüssel zu langfristigem Wohlstand ist. Die Fraktion repräsentiert Umweltschützer, Öko-Unternehmer und Bürger, denen die Zukunft des Planeten am Herzen liegt. Sie fordern eine Reduktion von CO2-Emissionen, den Ausbau von Grünflächen und eine nachhaltige Energiewende in der Stadt. Terra glaubt, dass Wirtschaftswachstum und Umweltschutz keine Gegensätze sind, sondern sich gegenseitig verstärken können. Ihre Werte sind Verantwortung gegenüber kommenden Generationen und die Harmonie zwischen Stadt und Natur.",
  },
  {
    short: "Syndikat",
    icon: "💼",
    image: FACTION_IMG.business,
    trust: 45,
    seats: 8,
    role: "neutral" as FactionRole,
    description:
      "Das Syndikat vertritt die Interessen der lokalen Wirtschaft, großer Konzerne und innovativen Unternehmern, die die Stadt als Zentrum des Handels und der Industrie sehen. Sie repräsentieren Geschäftsleute, Investoren und jene, die Arbeitsplätze und wirtschaftliches Wachstum als Priorität einstufen. Das Syndikat fordert weniger Bürokratie, Steuererleichterungen für Unternehmen und massive Investitionen in Infrastruktur und Gewerbegebiete. Sie sehen die Stadt als wirtschaftliches Kraftwerk, das die Region antreibt und Wohlstand für alle schafft. Ihre Werte sind Leistung, Effizienz und wirtschaftliche Stärke durch offene Märkte.",
  },
  {
    short: "Bürger",
    icon: "🏘️",
    image: FACTION_IMG.citizens,
    trust: 71,
    seats: 10,
    role: "coalition" as FactionRole,
    description:
      "Die Bürger-Fraktion ist die Stimme des normalen Volkes und konzentriert sich auf das Wohl der breiten Bevölkerung in ihrem täglichen Leben. Sie vertreten Arbeiter, Familien, Rentner und alle, die auf gute öffentliche Dienste, bezahlbaren Wohnraum und Sicherheit angewiesen sind. Die Fraktion fordert bessere Schulen, Krankenhäuser, öffentliche Verkehrsmittel und lebenswerte Wohnviertel für alle Einkommensschichten. Sie setzen sich für soziale Gerechtigkeit ein und wollen sicherstellen, dass wirtschaftliche Entwicklung allen Menschen zugute kommt, nicht nur den Wohlhabenden. Ihre Werte sind Gemeinwohl, Sicherheit und eine lebenswerte Stadt für alle Bürger.",
  },
  {
    short: "Union der Gilden",
    icon: "🔧",
    image: FACTION_IMG.workers,
    trust: 38,
    seats: 11,
    role: "neutral" as FactionRole,
    description:
      "Die Union der Gilden vertritt das Handwerk, die Arbeiterschaft und mittelständischen Betriebe, die das Rückgrat der lokalen Wirtschaft bilden. Sie setzen sich für faire Löhne, sichere Arbeitsbedingungen und angemessene Sozialleistungen ein und stehen für die Handwerkskunst und Expertise ihrer Mitglieder. Die Fraktion fordert Investitionen in Berufsausbildung, Schutz von lokalen Handwerksbetrieben vor großen Konzernen und starke Arbeitnehmerrechte. Sie sehen sich als Vermittler zwischen kapitalistischen Großkonzernen und idealistischen Umweltbewegungen. Ihre Werte sind Handwerkskunst, Arbeiterrechte und die Wahrung des Mittelstands als wirtschaftliches Fundament.",
  },
  {
    short: "Der Bund",
    icon: "🏛️",
    image: FACTION_IMG.conservatives,
    trust: 29,
    seats: 18,
    role: "opposition" as FactionRole,
    description:
      "Der Bund vertritt traditionelle Werte, Stabilität und bewährte Institutionen und möchte die Stadt vor zu schnellen, potenziell destabilisierenden Veränderungen bewahren. Sie repräsentieren ältere Generationen, konservative Geschäftsleute und jene, die in etablierten Strukturen Sicherheit finden. Der Bund fordert Vorsicht bei Reformen, Bewahrung historischer Stadtteile und Respekt vor etablierten Machtstrukturen und Traditionen. Sie sehen radikale Veränderungen mit Skepsis und bevorzugen graduelle, sichere Entwicklungen über Jahrzehnte. Ihre Werte sind Kontinuität, Tradition, Verlässlichkeit und der Erhalt bewährter Ordnung.",
  },
];

export const OPEN_PROMISES: GamePromise[] = [];
