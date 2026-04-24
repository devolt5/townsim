// Shared game data types and static demo data
import citizen02 from "@/images/citizen_02.jpg";

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
  { short: 'GRÜN', icon: '🌿', trust: 62, seats: 8 },
  { short: 'WIRT', icon: '💼', trust: 45, seats: 9 },
  { short: 'BÜRG', icon: '🏘️', trust: 71, seats: 10 },
  { short: 'HAND', icon: '🔧', trust: 38, seats: 7 },
  { short: 'KONS', icon: '🏛️', trust: 29, seats: 6 },
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
