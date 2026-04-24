// Shared game data types and static demo data
import citizen02 from "@/images/citizen_02.jpg";
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
}

export interface PendingDecision {
  title: string;
  text: string;
  image?: string;
  imageAlt?: string;
  options: { label: string; variant: 'accept' | 'reject' | 'negotiate' }[];
}

export interface Promise {
  id: string;
  text: string;
  faction: string;
  fulfilled: boolean;
}

export const METRICS: Metric[] = [
  { key: 'budget',       label: 'Stadthaushalt',      icon: '💰', value: 65, color: 'bg-amber-500' },
  { key: 'satisfaction', label: 'Bürgerzufriedenheit', icon: '😊', value: 55, color: 'bg-sky-500' },
  { key: 'sustainability',label: 'Nachhaltigkeit',     icon: '🌱', value: 40, color: 'bg-emerald-500' },
  { key: 'economy',      label: 'Wirtschaftskraft',    icon: '📊', value: 60, color: 'bg-violet-500' },
];

export const FACTIONS: Faction[] = [
  { short: 'GRÜNE',       icon: '🌿', image: factionGreen,         trust: 62, seats: 8  },
  { short: 'HANDEL A.G.', icon: '💼', image: factionBusiness,      trust: 45, seats: 9  },
  { short: 'BÜRGER',      icon: '🏘️', image: factionCitizens,      trust: 71, seats: 10 },
  { short: 'UWP',         icon: '🔧', image: factionWorkers,        trust: 38, seats: 7  },
  { short: 'Die Nation',  icon: '🏛️', image: factionConservatives,  trust: 29, seats: 6  },
];

export const PENDING_DECISION: PendingDecision = {
  title: 'Ausbau des Radwegenetzes',
  text: 'Die Grüne Liste beantragt den Bau von 15 km neuer Radwege. Kosten: 2,4 Mio €. Betroffen sind Innenstadt und beide Wohngebiete.',
  image: citizen02,
  imageAlt: 'Bürger',
  options: [
    { label: '✓ Zustimmen',  variant: 'accept' },
    { label: '✗ Ablehnen',   variant: 'reject' },
    { label: '⚖ Verhandeln', variant: 'negotiate' },
  ],
};

export const OPEN_PROMISES: Promise[] = [];
