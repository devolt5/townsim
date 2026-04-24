// Shared game data types and static demo data
import citizen02 from "@/images/citizen_02.jpg";
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

export interface District {
  name: string;
  description: string;
  image: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color: number;
}

export const DISTRICTS: District[] = [
  {
    name: 'Wohngebiet Nord',
    description: 'Mehrfamilienhäuser, Schulen und Spielplätze. Hohe Bevölkerungsdichte.',
    image: districtNorth,
    x: 0, y: 0, w: 140, h: 165,
    color: 0x8bc48a,
  },
  {
    name: 'Innenstadt',
    description: 'Haupteinkaufszone, Rathaus und öffentliche Plätze. Herzstück der Stadt.',
    image: districtTownCenter,
    x: 155, y: 0, w: 140, h: 165,
    color: 0xd4a853,
  },
  {
    name: 'Gewerbegebiet',
    description: 'Büros, Einzelhandel und Logistik. Größter Arbeitgeber der Stadt.',
    image: districtBusiness,
    x: 310, y: 0, w: 150, h: 165,
    color: 0x7a9cc4,
  },
  {
    name: 'Wohngebiet Süd',
    description: 'Einfamilienhäuser und ruhige Wohnlage. Beliebtes Familienquartier.',
    image: districtSouth,
    x: 0, y: 180, w: 140, h: 160,
    color: 0xa8d4a0,
  },
  {
    name: 'Industriegebiet',
    description: 'Produktion, Handwerksbetriebe und Lagerung. Wirtschaftsmotor der Region.',
    image: districtIndustrial,
    x: 155, y: 180, w: 140, h: 160,
    color: 0xb08060,
  },
  {
    name: 'Grüne Lunge',
    description: 'Parks, Kleingärten und Naturschutzgebiet. Lunge der Stadt.',
    image: districtGreen,
    x: 310, y: 180, w: 150, h: 160,
    color: 0x5a9e5a,
  },
];
