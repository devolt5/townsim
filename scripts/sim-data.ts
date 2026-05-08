/**
 * sim-data.ts
 *
 * Spielrelevante Daten für die Headless-Simulation – ohne Vite/Browser-
 * Abhängigkeiten (kein import.meta.env, keine Bildpfade).
 *
 * Diese Datei spiegelt die Stammdaten aus src/data/gameData.ts und
 * src/data/petitions.ts wider, enthält aber nur die Felder, die die
 * Spiellogik tatsächlich benötigt.
 *
 * TODO: Weitere Anträge hinzufügen, sobald der Pool wächst.
 */

import type { FactionRole } from "../src/data/gameData";

// ─── Typen ────────────────────────────────────────────────────────────────────

export interface SimFaction {
  short: string;
  role: FactionRole;
  seats: number;
  /** Startwert für Vertrauenswert (0–100) */
  trustStart: number;
}

export interface SimFactionReaction {
  factionShort: string;
  /** Inhaltliche Haltung zum Antrag (−10 bis +10) */
  support: number;
}

export interface SimPetition {
  id: string;
  title: string;
  tags: string[];
  factionReactions: SimFactionReaction[];
}

export interface SimMetric {
  key: string;
  label: string;
  startValue: number;
}

// ─── Fraktionen ───────────────────────────────────────────────────────────────
// Entspricht FACTIONS in src/data/gameData.ts (nur spielrelevante Felder).

export const SIM_FACTIONS: SimFaction[] = [
  { short: "Terra", role: "coalition", seats: 13, trustStart: 62 },
  { short: "Syndikat", role: "neutral", seats: 8, trustStart: 45 },
  { short: "Bürger", role: "coalition", seats: 10, trustStart: 71 },
  { short: "Union der Gilden", role: "neutral", seats: 11, trustStart: 38 },
  { short: "Der Bund", role: "opposition", seats: 18, trustStart: 29 },
];

// Gesamtsitze: 60 — Mehrheit: 31
// Koalition (Terra + Bürger): 23 Sitze — knapp unter Mehrheit ohne Neutrale

// ─── Kernmetriken ─────────────────────────────────────────────────────────────
// Entspricht METRICS in src/data/gameData.ts.

export const SIM_METRICS: SimMetric[] = [
  { key: "budget", label: "Stadthaushalt", startValue: 65 },
  { key: "reputation", label: "Bürgerzufriedenheit", startValue: 55 },
  { key: "sustainability", label: "Nachhaltigkeit", startValue: 40 },
  { key: "economy", label: "Wirtschaftskraft", startValue: 60 },
];

// ─── Anträge ──────────────────────────────────────────────────────────────────
// Entspricht PETITIONS in src/data/petitions.ts (ohne Bildpfade).
//
// TODO: Wenn Anträge Direkteffekte auf Metriken bekommen (z.B. "Radwegenetz
//       → sustainability +3"), hier ein `metricEffects`-Feld ergänzen:
//       metricEffects?: { key: string; delta: number }[]

export const SIM_PETITIONS: SimPetition[] = [
  {
    id: "radwegenetz",
    title: "Ausbau des Radwegenetzes",
    tags: ["infrastruktur", "umwelt"],
    factionReactions: [
      { factionShort: "Terra", support: 9 },
      { factionShort: "Syndikat", support: -6 },
      { factionShort: "Bürger", support: 4 },
      { factionShort: "Union der Gilden", support: 0 },
      { factionShort: "Der Bund", support: -3 },
    ],
  },
  {
    id: "industrie_ansiedlung",
    title: "Erweiterung Industriegebiet Ost",
    tags: ["wirtschaft", "umwelt"],
    factionReactions: [
      { factionShort: "Terra", support: -10 },
      { factionShort: "Syndikat", support: 10 },
      { factionShort: "Bürger", support: -2 },
      { factionShort: "Union der Gilden", support: 6 },
      { factionShort: "Der Bund", support: 5 },
    ],
  },
  {
    id: "kita_gebuehren",
    title: "Abschaffung der Kita-Gebühren",
    tags: ["sozial", "finanzen"],
    factionReactions: [
      { factionShort: "Terra", support: 5 },
      { factionShort: "Syndikat", support: -3 },
      { factionShort: "Bürger", support: 10 },
      { factionShort: "Union der Gilden", support: 8 },
      { factionShort: "Der Bund", support: 0 },
    ],
  },
  {
    id: "stadion_neubau",
    title: "Sanierung des Sportstadions",
    tags: ["kultur", "infrastruktur"],
    factionReactions: [
      { factionShort: "Terra", support: 1 },
      { factionShort: "Syndikat", support: 3 },
      { factionShort: "Bürger", support: 7 },
      { factionShort: "Union der Gilden", support: 4 },
      { factionShort: "Der Bund", support: 6 },
    ],
  },
  {
    id: "ueberwachungskameras",
    title: "Kameras am Marktplatz",
    tags: ["sicherheit"],
    factionReactions: [
      { factionShort: "Terra", support: -7 },
      { factionShort: "Syndikat", support: 4 },
      { factionShort: "Bürger", support: -3 },
      { factionShort: "Union der Gilden", support: 0 },
      { factionShort: "Der Bund", support: 10 },
    ],
  },
  {
    id: "nachtfahrverbot",
    title: "Nachtfahrverbot für LKW",
    tags: ["wirtschaft", "umwelt"],
    factionReactions: [
      { factionShort: "Terra", support: 6 },
      { factionShort: "Syndikat", support: -9 },
      { factionShort: "Bürger", support: 8 },
      { factionShort: "Union der Gilden", support: -3 },
      { factionShort: "Der Bund", support: -1 },
    ],
  },
  {
    id: "mietpreisbremse",
    title: "Verschärfte Mietpreisbremse",
    tags: ["sozial", "finanzen"],
    factionReactions: [
      { factionShort: "Terra", support: 7 },
      { factionShort: "Syndikat", support: -10 },
      { factionShort: "Bürger", support: 10 },
      { factionShort: "Union der Gilden", support: 7 },
      { factionShort: "Der Bund", support: -5 },
    ],
  },
  {
    id: "parkhaus_abriss",
    title: "Abriss Parkhaus Mitte",
    tags: ["umwelt", "infrastruktur"],
    factionReactions: [
      { factionShort: "Terra", support: 10 },
      { factionShort: "Syndikat", support: -10 },
      { factionShort: "Bürger", support: 1 },
      { factionShort: "Union der Gilden", support: -5 },
      { factionShort: "Der Bund", support: -8 },
    ],
  },
  {
    id: "kulturerbe_fest",
    title: "Förderung des Heimatfests",
    tags: ["kultur"],
    factionReactions: [
      { factionShort: "Terra", support: -3 },
      { factionShort: "Syndikat", support: 5 },
      { factionShort: "Bürger", support: 8 },
      { factionShort: "Union der Gilden", support: 3 },
      { factionShort: "Der Bund", support: 10 },
    ],
  },
  {
    id: "solarpflicht",
    title: "Solar-Pflicht für Gewerbe",
    tags: ["umwelt", "wirtschaft"],
    factionReactions: [
      { factionShort: "Terra", support: 10 },
      { factionShort: "Syndikat", support: -7 },
      { factionShort: "Bürger", support: 3 },
      { factionShort: "Union der Gilden", support: 1 },
      { factionShort: "Der Bund", support: -4 },
    ],
  },
];
