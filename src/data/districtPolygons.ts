const base = import.meta.env.BASE_URL.replace(/\/$/, "");

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
    image: `${base}/images/districts/north.jpg`,
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
    image: `${base}/images/districts/town_center.jpg`,
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
    image: `${base}/images/districts/business_district.jpg`,
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
    image: `${base}/images/districts/industrial.jpg`,
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
    image: `${base}/images/districts/south.jpg`,
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
    image: `${base}/images/districts/green_district.jpg`,
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
