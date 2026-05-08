import type { Petition } from "./types/petition";

// Plain URL paths served from /public/images — no build processing, no binary blobs.
// Node-safe check for Vite's import.meta.env
const baseUrl =
  typeof import.meta.env !== "undefined"
    ? import.meta.env.BASE_URL.replace(/\/$/, "")
    : "";

const IMG = {
  citizen01: `${baseUrl}/images/citizen_01.jpg`,
  citizen02: `${baseUrl}/images/citizen_02.jpg`,
  citizen03: `${baseUrl}/images/citizen_03.jpg`,
  citizen05: `${baseUrl}/images/citizen_05.jpg`,
  delegate01: `${baseUrl}/images/delegate_01_female.jpg`,
  delegate02: `${baseUrl}/images/delegate_02_male.jpg`,
} as const;

export const PETITIONS: Petition[] = [
  {
    id: "radwegenetz",
    title: "Ausbau des Radwegenetzes",
    text: "Die Grüne Liste beantragt den Bau von 15 km neuer Radwege. Kosten: 2,4 Mio €. Betroffen sind Innenstadt und beide Wohngebiete.",
    image: IMG.citizen02,
    imageAlt: "Bürger",
    tags: ["infrastruktur", "umwelt"],
    factionReactions: [
      { factionShort: "Terra", support: 4 },
      { factionShort: "Syndikat", support: -4 },
      { factionShort: "Bürger", support: 2 },
      { factionShort: "Union der Gilden", support: 0 },
      { factionShort: "Der Bund", support: -2 },
    ],
  },
  {
    id: "industrie_ansiedlung",
    title: "Erweiterung Industriegebiet Ost",
    text: "Ein Logistikkonzern will eine neue Halle bauen. Verspricht 200 Arbeitsplätze, erfordert aber Rodung von Wald.",
    image: IMG.delegate01,
    imageAlt: "Manager",
    tags: ["wirtschaft", "umwelt"],
    factionReactions: [
      { factionShort: "Terra", support: -5 },
      { factionShort: "Syndikat", support: 5 },
      { factionShort: "Bürger", support: -1 },
      { factionShort: "Union der Gilden", support: 3 },
      { factionShort: "Der Bund", support: 2 },
    ],
  },
  {
    id: "kita_gebuehren",
    title: "Abschaffung der Kita-Gebühren",
    text: "Elternbeiräte fordern die komplette Kostenübernahme durch die Stadt. Haushaltsloch: 1,2 Mio € jährlich.",
    image: IMG.citizen01,
    imageAlt: "Mutter",
    tags: ["sozial", "finanzen"],
    factionReactions: [
      { factionShort: "Terra", support: 2 },
      { factionShort: "Syndikat", support: -2 },
      { factionShort: "Bürger", support: 4 },
      { factionShort: "Union der Gilden", support: 3 },
      { factionShort: "Der Bund", support: 0 },
    ],
  },
  {
    id: "stadion_neubau",
    title: "Sanierung des Sportstadions",
    text: "Der lokale Sportverein fordert eine Modernisierung der Tribünen. Die Kosten sind hoch, aber der Verein ist wichtig für die Jugend.",
    image: IMG.citizen03,
    imageAlt: "Trainer",
    tags: ["kultur", "infrastruktur"],
    factionReactions: [
      { factionShort: "Terra", support: 0 },
      { factionShort: "Syndikat", support: 1 },
      { factionShort: "Bürger", support: 3 },
      { factionShort: "Union der Gilden", support: 2 },
      { factionShort: "Der Bund", support: 3 },
    ],
  },
  {
    id: "ueberwachungskameras",
    title: "Kameras am Marktplatz",
    text: "Nach Sachbeschädigungen fordert 'Die Nation' eine Videoüberwachung. Datenschützer wehren sich.",
    image: IMG.citizen05,
    imageAlt: "Sicherheitsbeauftragter",
    tags: ["sicherheit"],
    factionReactions: [
      { factionShort: "Terra", support: -4 },
      { factionShort: "Syndikat", support: 2 },
      { factionShort: "Bürger", support: -2 },
      { factionShort: "Union der Gilden", support: 0 },
      { factionShort: "Der Bund", support: 5 },
    ],
  },
  {
    id: "nachtfahrverbot",
    title: "Nachtfahrverbot für LKW",
    text: "Anwohner in der Hauptstraße leiden unter Lärm. Die Logistikgilde befürchtet massive Lieferverzögerungen.",
    image: IMG.citizen02,
    imageAlt: "Anwohner",
    tags: ["wirtschaft", "umwelt"],
    factionReactions: [
      { factionShort: "Terra", support: 3 },
      { factionShort: "Syndikat", support: -5 },
      { factionShort: "Bürger", support: 4 },
      { factionShort: "Union der Gilden", support: -2 },
      { factionShort: "Der Bund", support: -1 },
    ],
  },
  {
    id: "mietpreisbremse",
    title: "Verschärfte Mietpreisbremse",
    text: "Wohnen wird unbezahlbar. Das Bürgerforum will neue Kappungsgrenzen für Bestandsmieten.",
    image: IMG.citizen01,
    imageAlt: "Studentin",
    tags: ["sozial", "finanzen"],
    factionReactions: [
      { factionShort: "Terra", support: 3 },
      { factionShort: "Syndikat", support: -5 },
      { factionShort: "Bürger", support: 4 },
      { factionShort: "Union der Gilden", support: 3 },
      { factionShort: "Der Bund", support: -3 },
    ],
  },
  {
    id: "parkhaus_abriss",
    title: "Abriss Parkhaus Mitte",
    text: "Anstelle des Betonklotzes soll ein urbaner Garten entstehen. Die lokalen Händler laufen Sturm.",
    image: IMG.citizen02,
    imageAlt: "Umweltaktivist",
    tags: ["umwelt", "infrastruktur"],
    factionReactions: [
      { factionShort: "Terra", support: 5 },
      { factionShort: "Syndikat", support: -5 },
      { factionShort: "Bürger", support: 0 },
      { factionShort: "Union der Gilden", support: -2 },
      { factionShort: "Der Bund", support: -4 },
    ],
  },
  {
    id: "kulturerbe_fest",
    title: "Förderung des Heimatfests",
    text: "Ein Brauchtumsverein bittet um Zuschüsse für das 500-jährige Jubiläum. 'Überflüssig' sagen die Sparer, 'Wichtig' die Konservativen.",
    image: IMG.citizen03,
    imageAlt: "Vereinsvorsitzender",
    tags: ["kultur"],
    factionReactions: [
      { factionShort: "Terra", support: -2 },
      { factionShort: "Syndikat", support: 2 },
      { factionShort: "Bürger", support: 3 },
      { factionShort: "Union der Gilden", support: 1 },
      { factionShort: "Der Bund", support: 5 },
    ],
  },
  {
    id: "solarpflicht",
    title: "Solar-Pflicht für Gewerbe",
    text: "Alle Neubauten im Gewerbegebiet müssen künftig PV-Anlagen installieren. Investoren warnen vor Kostentreiber.",
    image: IMG.delegate02,
    imageAlt: "Solar-Ingenieur",
    tags: ["umwelt", "wirtschaft"],
    factionReactions: [
      { factionShort: "Terra", support: 5 },
      { factionShort: "Syndikat", support: -4 },
      { factionShort: "Bürger", support: 1 },
      { factionShort: "Union der Gilden", support: 0 },
      { factionShort: "Der Bund", support: -2 },
    ],
  },
];
