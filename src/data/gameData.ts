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
  /** Polygon vertices in world space (scaled ×2.5 from the SVG concept layout) */
  points: { x: number; y: number }[];
  color: number;
}

export const DISTRICTS: District[] = [
  {
    name: 'Wohngebiet Nord',
    description: 'Mehrfamilienhäuser, Schulen und Spielplätze. Hohe Bevölkerungsdichte.',
    image: districtNorth,
    color: 0x8bc48a,
    points: [
      { x: 288, y: 200 }, { x: 312, y:  62 }, { x: 238, y:  25 },
      { x: 150, y:  62 }, { x: 188, y: 212 },
    ],
  },
  {
    name: 'Innenstadt',
    description: 'Haupteinkaufszone, Rathaus und öffentliche Plätze. Herzstück der Stadt.',
    image: districtTownCenter,
    color: 0xd4a853,
    points: [
      { x: 188, y: 212 }, { x: 288, y: 200 }, { x: 312, y: 325 },
      { x: 262, y: 400 }, { x: 200, y: 375 }, { x: 162, y: 288 },
    ],
  },
  {
    name: 'Gewerbegebiet',
    description: 'Büros, Einzelhandel und Logistik. Größter Arbeitgeber der Stadt.',
    image: districtBusiness,
    color: 0x7a9cc4,
    points: [
      { x: 312, y: 325 }, { x: 425, y: 350 }, { x: 462, y: 225 },
      { x: 400, y:  88 }, { x: 312, y:  62 }, { x: 288, y: 200 },
    ],
  },
  {
    name: 'Industriegebiet',
    description: 'Produktion, Handwerksbetriebe und Lagerung. Wirtschaftsmotor der Region.',
    image: districtIndustrial,
    color: 0xb08060,
    points: [
      { x: 262, y: 400 }, { x: 312, y: 462 }, { x: 388, y: 500 },
      { x: 462, y: 412 }, { x: 425, y: 350 }, { x: 312, y: 325 },
    ],
  },
  {
    name: 'Wohngebiet Süd',
    description: 'Einfamilienhäuser und ruhige Wohnlage. Beliebtes Familienquartier.',
    image: districtSouth,
    color: 0xa8d4a0,
    points: [
      { x: 200, y: 375 }, { x: 125, y: 450 }, { x: 188, y: 562 },
      { x: 238, y: 612 }, { x: 325, y: 562 }, { x: 388, y: 500 },
      { x: 312, y: 462 }, { x: 262, y: 400 },
    ],
  },
  {
    name: 'Grüne Lunge',
    description: 'Parks, Kleingärten und Naturschutzgebiet. Lunge der Stadt.',
    image: districtGreen,
    color: 0x5a9e5a,
    points: [
      { x: 188, y: 212 }, { x: 150, y:  62 }, { x:  50, y: 200 },
      { x:  38, y: 325 }, { x:  75, y: 412 }, { x: 125, y: 450 },
      { x: 200, y: 375 }, { x: 162, y: 288 },
    ],
  },
];
