import citizen01 from "@/images/citizen_01.jpg";
import citizen02 from "@/images/citizen_02.jpg";
import citizen03 from "@/images/citizen_03.jpg";
import citizen04 from "@/images/citizen_04.jpg";
import citizen05 from "@/images/citizen_05.jpg";
import delegate01 from "@/images/delegate_01.jpg";
import delegate02 from "@/images/delegate_02.jpg";
import delegate03 from "@/images/delegate_03.jpg";
import delegate04 from "@/images/delegate_04.jpg";
import delegate05 from "@/images/delegate_05.jpg";
import type { Decision } from "./decisionType";

export const DECISIONS: Decision[] = [
  {
    id: "radwegenetz",
    title: "Ausbau des Radwegenetzes",
    text: "Die Grüne Liste beantragt den Bau von 15 km neuer Radwege. Kosten: 2,4 Mio €. Betroffen sind Innenstadt und beide Wohngebiete.",
    image: citizen02,
    imageAlt: "Bürger",
    factionReactions: [
      { factionShort: "GRÜNE", delta: +18 },
      { factionShort: "HANDEL A.G.", delta: -12 },
      { factionShort: "BÜRGER", delta: +8 },
      { factionShort: "UWP", delta: 0 },
      { factionShort: "Die Nation", delta: -5 },
    ],
  },
  {
    id: "industrie_ansiedlung",
    title: "Erweiterung Industriegebiet Ost",
    text: "Ein Logistikkonzern will eine neue Halle bauen. Verspricht 200 Arbeitsplätze, erfordert aber Rodung von Wald.",
    image: delegate01,
    imageAlt: "Manager",
    factionReactions: [
      { factionShort: "GRÜNE", delta: -20 },
      { factionShort: "HANDEL A.G.", delta: +25 },
      { factionShort: "BÜRGER", delta: -5 },
      { factionShort: "UWP", delta: +15 },
      { factionShort: "Die Nation", delta: +10 },
    ],
  },
  {
    id: "kita_gebuehren",
    title: "Abschaffung der Kita-Gebühren",
    text: "Elternbeiräte fordern die komplette Kostenübernahme durch die Stadt. Haushaltsloch: 1,2 Mio € jährlich.",
    image: citizen01,
    imageAlt: "Mutter",
    factionReactions: [
      { factionShort: "GRÜNE", delta: +10 },
      { factionShort: "HANDEL A.G.", delta: -5 },
      { factionShort: "BÜRGER", delta: +22 },
      { factionShort: "UWP", delta: +18 },
      { factionShort: "Die Nation", delta: 0 },
    ],
  },
  {
    id: "stadion_neubau",
    title: "Sanierung des Sportstadions",
    text: "Der lokale Sportverein fordert eine Modernisierung der Tribünen. Die Kosten sind hoch, aber der Verein ist wichtig für die Jugend.",
    image: citizen03,
    imageAlt: "Trainer",
    factionReactions: [
      { factionShort: "GRÜNE", delta: +2 },
      { factionShort: "HANDEL A.G.", delta: +5 },
      { factionShort: "BÜRGER", delta: +15 },
      { factionShort: "UWP", delta: +8 },
      { factionShort: "Die Nation", delta: +12 },
    ],
  },
  {
    id: "ueberwachungskameras",
    title: "Kameras am Marktplatz",
    text: "Nach Sachbeschädigungen fordert 'Die Nation' eine Videoüberwachung. Datenschützer wehren sich.",
    image: citizen05,
    imageAlt: "Sicherheitsbeauftragter",
    factionReactions: [
      { factionShort: "GRÜNE", delta: -15 },
      { factionShort: "HANDEL A.G.", delta: +8 },
      { factionShort: "BÜRGER", delta: -5 },
      { factionShort: "UWP", delta: 0 },
      { factionShort: "Die Nation", delta: +25 },
    ],
  },
  {
    id: "nachtfahrverbot",
    title: "Nachtfahrverbot für LKW",
    text: "Anwohner in der Hauptstraße leiden unter Lärm. Die Logistikgilde befürchtet massive Lieferverzögerungen.",
    image: citizen02,
    imageAlt: "Anwohner",
    factionReactions: [
      { factionShort: "GRÜNE", delta: +12 },
      { factionShort: "HANDEL A.G.", delta: -18 },
      { factionShort: "BÜRGER", delta: +15 },
      { factionShort: "UWP", delta: -5 },
      { factionShort: "Die Nation", delta: -2 },
    ],
  },
  {
    id: "mietpreisbremse",
    title: "Verschärfte Mietpreisbremse",
    text: "Wohnen wird unbezahlbar. Das Bürgerforum will neue Kappungsgrenzen für Bestandsmieten.",
    image: citizen01,
    imageAlt: "Studentin",
    factionReactions: [
      { factionShort: "GRÜNE", delta: +15 },
      { factionShort: "HANDEL A.G.", delta: -22 },
      { factionShort: "BÜRGER", delta: +20 },
      { factionShort: "UWP", delta: +15 },
      { factionShort: "Die Nation", delta: -10 },
    ],
  },
  {
    id: "parkhaus_abriss",
    title: "Abriss Parkhaus Mitte",
    text: "Anstelle des Betonklotzes soll ein urbaner Garten entstehen. Die lokalen Händler laufen Sturm.",
    image: citizen02,
    imageAlt: "Umweltaktivist",
    factionReactions: [
      { factionShort: "GRÜNE", delta: +25 },
      { factionShort: "HANDEL A.G.", delta: -28 },
      { factionShort: "BÜRGER", delta: +2 },
      { factionShort: "UWP", delta: -10 },
      { factionShort: "Die Nation", delta: -15 },
    ],
  },
  {
    id: "kulturerbe_fest",
    title: "Förderung des Heimatfests",
    text: "Ein Brauchtumsverein bittet um Zuschüsse für das 500-jährige Jubiläum. 'Überflüssig' sagen die Sparer, 'Wichtig' die Konservativen.",
    image: citizen03,
    imageAlt: "Vereinsvorsitzender",
    factionReactions: [
      { factionShort: "GRÜNE", delta: -5 },
      { factionShort: "HANDEL A.G.", delta: +10 },
      { factionShort: "BÜRGER", delta: +18 },
      { factionShort: "UWP", delta: +5 },
      { factionShort: "Die Nation", delta: +22 },
    ],
  },
  {
    id: "solarpflicht",
    title: "Solar-Pflicht für Gewerbe",
    text: "Alle Neubauten im Gewerbegebiet müssen künftig PV-Anlagen installieren. Investoren warnen vor Kostentreiber.",
    image: delegate02,
    imageAlt: "Solar-Ingenieur",
    factionReactions: [
      { factionShort: "GRÜNE", delta: +22 },
      { factionShort: "HANDEL A.G.", delta: -15 },
      { factionShort: "BÜRGER", delta: +5 },
      { factionShort: "UWP", delta: +2 },
      { factionShort: "Die Nation", delta: -8 },
    ],
  },
];
