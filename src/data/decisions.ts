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
      { factionShort: "Terra", delta: +18 },
      { factionShort: "Syndikat", delta: -12 },
      { factionShort: "Bürger", delta: +8 },
      { factionShort: "Union der Gilden", delta: 0 },
      { factionShort: "Der Bund", delta: -5 },
    ],
  },
  {
    id: "industrie_ansiedlung",
    title: "Erweiterung Industriegebiet Ost",
    text: "Ein Logistikkonzern will eine neue Halle bauen. Verspricht 200 Arbeitsplätze, erfordert aber Rodung von Wald.",
    image: delegate01,
    imageAlt: "Manager",
    factionReactions: [
      { factionShort: "Terra", delta: -20 },
      { factionShort: "Syndikat", delta: +25 },
      { factionShort: "Bürger", delta: -5 },
      { factionShort: "Union der Gilden", delta: +15 },
      { factionShort: "Der Bund", delta: +10 },
    ],
  },
  {
    id: "kita_gebuehren",
    title: "Abschaffung der Kita-Gebühren",
    text: "Elternbeiräte fordern die komplette Kostenübernahme durch die Stadt. Haushaltsloch: 1,2 Mio € jährlich.",
    image: citizen01,
    imageAlt: "Mutter",
    factionReactions: [
      { factionShort: "Terra", delta: +10 },
      { factionShort: "Syndikat", delta: -5 },
      { factionShort: "Bürger", delta: +22 },
      { factionShort: "Union der Gilden", delta: +18 },
      { factionShort: "Der Bund", delta: 0 },
    ],
  },
  {
    id: "stadion_neubau",
    title: "Sanierung des Sportstadions",
    text: "Der lokale Sportverein fordert eine Modernisierung der Tribünen. Die Kosten sind hoch, aber der Verein ist wichtig für die Jugend.",
    image: citizen03,
    imageAlt: "Trainer",
    factionReactions: [
      { factionShort: "Terra", delta: +2 },
      { factionShort: "Syndikat", delta: +5 },
      { factionShort: "Bürger", delta: +15 },
      { factionShort: "Union der Gilden", delta: +8 },
      { factionShort: "Der Bund", delta: +12 },
    ],
  },
  {
    id: "ueberwachungskameras",
    title: "Kameras am Marktplatz",
    text: "Nach Sachbeschädigungen fordert 'Die Nation' eine Videoüberwachung. Datenschützer wehren sich.",
    image: citizen05,
    imageAlt: "Sicherheitsbeauftragter",
    factionReactions: [
      { factionShort: "Terra", delta: -15 },
      { factionShort: "Syndikat", delta: +8 },
      { factionShort: "Bürger", delta: -5 },
      { factionShort: "Union der Gilden", delta: 0 },
      { factionShort: "Der Bund", delta: +25 },
    ],
  },
  {
    id: "nachtfahrverbot",
    title: "Nachtfahrverbot für LKW",
    text: "Anwohner in der Hauptstraße leiden unter Lärm. Die Logistikgilde befürchtet massive Lieferverzögerungen.",
    image: citizen02,
    imageAlt: "Anwohner",
    factionReactions: [
      { factionShort: "Terra", delta: +12 },
      { factionShort: "Syndikat", delta: -18 },
      { factionShort: "Bürger", delta: +15 },
      { factionShort: "Union der Gilden", delta: -5 },
      { factionShort: "Der Bund", delta: -2 },
    ],
  },
  {
    id: "mietpreisbremse",
    title: "Verschärfte Mietpreisbremse",
    text: "Wohnen wird unbezahlbar. Das Bürgerforum will neue Kappungsgrenzen für Bestandsmieten.",
    image: citizen01,
    imageAlt: "Studentin",
    factionReactions: [
      { factionShort: "Terra", delta: +15 },
      { factionShort: "Syndikat", delta: -22 },
      { factionShort: "Bürger", delta: +20 },
      { factionShort: "Union der Gilden", delta: +15 },
      { factionShort: "Der Bund", delta: -10 },
    ],
  },
  {
    id: "parkhaus_abriss",
    title: "Abriss Parkhaus Mitte",
    text: "Anstelle des Betonklotzes soll ein urbaner Garten entstehen. Die lokalen Händler laufen Sturm.",
    image: citizen02,
    imageAlt: "Umweltaktivist",
    factionReactions: [
      { factionShort: "Terra", delta: +25 },
      { factionShort: "Syndikat", delta: -28 },
      { factionShort: "Bürger", delta: +2 },
      { factionShort: "Union der Gilden", delta: -10 },
      { factionShort: "Der Bund", delta: -15 },
    ],
  },
  {
    id: "kulturerbe_fest",
    title: "Förderung des Heimatfests",
    text: "Ein Brauchtumsverein bittet um Zuschüsse für das 500-jährige Jubiläum. 'Überflüssig' sagen die Sparer, 'Wichtig' die Konservativen.",
    image: citizen03,
    imageAlt: "Vereinsvorsitzender",
    factionReactions: [
      { factionShort: "Terra", delta: -5 },
      { factionShort: "Syndikat", delta: +10 },
      { factionShort: "Bürger", delta: +18 },
      { factionShort: "Union der Gilden", delta: +5 },
      { factionShort: "Der Bund", delta: +22 },
    ],
  },
  {
    id: "solarpflicht",
    title: "Solar-Pflicht für Gewerbe",
    text: "Alle Neubauten im Gewerbegebiet müssen künftig PV-Anlagen installieren. Investoren warnen vor Kostentreiber.",
    image: delegate02,
    imageAlt: "Solar-Ingenieur",
    factionReactions: [
      { factionShort: "Terra", delta: +22 },
      { factionShort: "Syndikat", delta: -15 },
      { factionShort: "Bürger", delta: +5 },
      { factionShort: "Union der Gilden", delta: +2 },
      { factionShort: "Der Bund", delta: -8 },
    ],
  },
];
