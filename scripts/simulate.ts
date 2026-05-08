/**
 * simulate.ts — TownSim Headless Balancing-Simulation
 *
 * Simuliert den aktuellen Spielstand headless: Pro Quartal wird ein zufälliger
 * Antrag aus drei Kandidaten angenommen, die Abstimmungs-Engine läuft durch
 * und die Metriken werden angepasst. Kein UI, kein React, kein Zustand-Store.
 *
 * Ausführen:
 *   pnpm simulate
 *   pnpm simulate --runs 200
 *   pnpm simulate --runs 50 --reputation 70
 *
 * ─── Was hier noch FEHLT (zukünftige Erweiterungen) ──────────────────────────
 *
 * TODO [Versprechen §4.2]: SimState um openPromises erweitern. Beim Verhandeln
 *   ein Versprechen mit tagCondition und Deadline erstellen. In resolveVote()
 *   den openPromises-Parameter befüllen. Nach jedem Quartal Deadlines prüfen
 *   und gebrochene Versprechen mit reputation -5 bestrafen.
 *
 * TODO [Aktionen §3.3]: SimState um activeActionModifiers erweitern.
 *   CONFIG um `pressConferencesPerQuarter: 1` ergänzen. Pro Quartal vor der
 *   Abstimmung N Modifikatoren mit fraction +0.25 (Pressekonferenz), +0.15
 *   (Interview) oder -0.25 (Skandal/externes Ereignis) einfügen.
 *   In resolveVote() den activeActionModifiers-Parameter befüllen.
 *   Ablauf: Modifikatoren am Quartalswechsel entfernen (expires prüfen).
 *
 * TODO [Verhandeln §4.2]: CONFIG um `negotiateRate` ergänzen. Beim Verhandeln
 *   kann der Spieler der Fraktion mit dem niedrigsten modifiedYes ein Versprechen
 *   anbieten. Erst dann ist die Versprechen-Logik sinnvoll auswertbar.
 *
 * TODO [Metrik-Effekte von Anträgen]: SimPetition um
 *   `metricEffects?: { key: string; delta: number }[]` ergänzen (in sim-data.ts).
 *   Dann hier nach jeder bestandenen Abstimmung die Deltas auf Budget,
 *   Nachhaltigkeit und Wirtschaftskraft anwenden.
 *
 * TODO [Fraktionsvertrauen]: Fraktionsvertrauen nach Abstimmungsergebnissen
 *   anpassen (z.B. +2 wenn Fraktion zugestimmt hat und Antrag passt, -1 bei
 *   Vertrauensbruch). Dann trust als dynamischen Wert in SimState führen.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { writeFileSync } from "node:fs";
import { resolveVote, computeVoteMetricDeltas } from "../src/game/votingEngine";
import { SIM_FACTIONS, SIM_METRICS, SIM_PETITIONS } from "./sim-data";
import type { SimPetition } from "./sim-data";
import type { Faction } from "../src/data/gameData";

// ─── Konfiguration ────────────────────────────────────────────────────────────

const CONFIG = {
  /** Anzahl der Simulationsläufe */
  runs: 50,
  /** Spieljahre (1–5) */
  years: 5,
  /** Quartale pro Jahr */
  quartersPerYear: 4,
  /** Startwert Bürgerzufriedenheit (0–100) */
  reputationStart: 55,
  /** Anträge pro Quartal zur Auswahl */
  petitionsPerDraw: 3,
  /** CSV-Ausgabedatei (leer = kein CSV) */
  csvOutput: "scripts/sim-output.csv",
};

// CLI-Argumente überschreiben CONFIG
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i += 2) {
  if (args[i] === "--runs") CONFIG.runs = parseInt(args[i + 1]);
  if (args[i] === "--reputation")
    CONFIG.reputationStart = parseInt(args[i + 1]);
}

// ─── Typen ────────────────────────────────────────────────────────────────────

interface SimState {
  metrics: Record<string, number>;
  /** Jahr → Quartal → Reputation (für Jahresend-Snapshot) */
  reputationByQuarter: number[][];
  votesWon: number;
  votesLost: number;
  petitionPool: string[]; // IDs noch nicht gezogener Anträge
  usedPetitionIds: string[];
}

interface RunResult {
  /** Reputation am Ende jedes Jahres (Index 0 = Jahr 1) */
  reputationEndOfYear: number[];
  /** Endwerte aller Metriken */
  finalMetrics: Record<string, number>;
  votesWon: number;
  votesLost: number;
  totalVotes: number;
}

// ─── Hilfsfunktionen ─────────────────────────────────────────────────────────

/** Zieht `count` zufällige Anträge aus dem Pool. Erschöpfter Pool wird zurückgesetzt. */
function drawPetitions(state: SimState, count: number): SimPetition[] {
  if (state.petitionPool.length < count) {
    // Pool erschöpft: alle bisher nicht aktiven Anträge wieder einfügen
    state.petitionPool = SIM_PETITIONS.map((p) => p.id).filter(
      (id) => !state.usedPetitionIds.includes(id),
    );
    // Falls immer noch zu wenig (weniger Anträge als count), Pool komplett öffnen
    if (state.petitionPool.length < count) {
      state.petitionPool = SIM_PETITIONS.map((p) => p.id);
      state.usedPetitionIds = [];
    }
  }

  const drawn: SimPetition[] = [];
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * state.petitionPool.length);
    const id = state.petitionPool.splice(idx, 1)[0];
    state.usedPetitionIds.push(id);
    const petition = SIM_PETITIONS.find((p) => p.id === id)!;
    drawn.push(petition);
  }
  return drawn;
}

/** Clamp-Helfer für Metrikwerte (0–100) */
function clamp(value: number): number {
  return Math.max(0, Math.min(100, value));
}

/** Konvertiert SimPetition in das Format, das resolveVote() erwartet */
function toVotePetition(p: SimPetition) {
  return {
    id: p.id,
    title: p.title,
    tags: p.tags,
    factionReactions: p.factionReactions,
    text: "",
  };
}

/** Konvertiert SimFaction in das Format, das resolveVote() erwartet */
function toVoteFaction(f: (typeof SIM_FACTIONS)[0]): Faction {
  return {
    short: f.short,
    role: f.role,
    seats: f.seats,
    trust: f.trustStart,
    icon: "",
    image: "",
  };
}

// ─── Ein Simulationslauf ──────────────────────────────────────────────────────

function runSimulation(): RunResult {
  const state: SimState = {
    metrics: Object.fromEntries(SIM_METRICS.map((m) => [m.key, m.startValue])),
    reputationByQuarter: [],
    votesWon: 0,
    votesLost: 0,
    petitionPool: SIM_PETITIONS.map((p) => p.id),
    usedPetitionIds: [],
  };

  const reputationEndOfYear: number[] = [];
  const factions = SIM_FACTIONS.map(toVoteFaction);

  for (let year = 1; year <= CONFIG.years; year++) {
    state.reputationByQuarter.push([]);

    for (let quarter = 1; quarter <= CONFIG.quartersPerYear; quarter++) {
      // ── Phase 2 übersprungen (keine Aktionen, keine Verhandlungen) ──

      // 3 Anträge ziehen, einen zufällig auswählen (entspricht "immer annehmen")
      const candidates = drawPetitions(state, CONFIG.petitionsPerDraw);
      const chosen = candidates[Math.floor(Math.random() * candidates.length)];

      // ── Phase 3: Abstimmung ──
      const reputation = state.metrics["reputation"] ?? CONFIG.reputationStart;
      const result = resolveVote(
        toVotePetition(chosen),
        factions,
        [], // TODO [Aktionen §3.3]: activeActionModifiers hier befüllen
        [], // TODO [Versprechen §4.2]: openPromises hier befüllen
        reputation,
      );

      // Metriken anpassen
      const deltas = computeVoteMetricDeltas(result);
      for (const [key, delta] of Object.entries(deltas)) {
        state.metrics[key] = clamp((state.metrics[key] ?? 0) + delta);
      }
      // TODO [Metrik-Effekte §future]: chosen.metricEffects?.forEach(e => ...)

      if (result.passed) state.votesWon++;
      else state.votesLost++;

      state.reputationByQuarter[year - 1].push(state.metrics["reputation"]!);
    }

    // Jahresend-Snapshot
    const endReputation = state.metrics["reputation"] ?? 0;
    reputationEndOfYear.push(Math.round(endReputation));
  }

  return {
    reputationEndOfYear,
    finalMetrics: { ...state.metrics },
    votesWon: state.votesWon,
    votesLost: state.votesLost,
    totalVotes: CONFIG.years * CONFIG.quartersPerYear,
  };
}

// ─── Statistik-Auswertung ─────────────────────────────────────────────────────

interface Stats {
  avg: number;
  min: number;
  max: number;
}

function stats(values: number[]): Stats {
  const avg = values.reduce((s, v) => s + v, 0) / values.length;
  return {
    avg: Math.round(avg * 10) / 10,
    min: Math.min(...values),
    max: Math.max(...values),
  };
}

function fmtStats(s: Stats): string {
  return `Ø ${String(s.avg).padStart(5)}  [${String(s.min).padStart(3)} – ${String(s.max).padEnd(3)}]`;
}

// ─── Hauptprogramm ────────────────────────────────────────────────────────────

console.log(`\n╔═══════════════════════════════════════════════════════╗`);
console.log(`║   TownSim Balancing-Simulation                        ║`);
console.log(
  `║   ${CONFIG.runs} Läufe · ${CONFIG.years} Jahre · ${CONFIG.years * CONFIG.quartersPerYear} Abstimmungen je Lauf`.padEnd(
    56,
  ) + "║",
);
console.log(`╚═══════════════════════════════════════════════════════╝\n`);

const results: RunResult[] = [];
for (let i = 0; i < CONFIG.runs; i++) {
  results.push(runSimulation());
}

// ── Bürgerzufriedenheit nach Jahr ────────────────────────────────────────────
console.log("── Bürgerzufriedenheit (Jahresende) ──────────────────────");
for (let y = 0; y < CONFIG.years; y++) {
  const values = results.map((r) => r.reputationEndOfYear[y]);
  console.log(`  Jahr ${y + 1}: ${fmtStats(stats(values))}`);
}

// ── Endwerte aller Metriken ──────────────────────────────────────────────────
console.log("\n── Metriken am Spielende (nach Jahr 5) ───────────────────");
for (const metric of SIM_METRICS) {
  const values = results.map((r) => r.finalMetrics[metric.key] ?? 0);
  console.log(`  ${metric.label.padEnd(24)}: ${fmtStats(stats(values))}`);
}

// ── Abstimmungsstatistik ─────────────────────────────────────────────────────
console.log("\n── Abstimmungen ──────────────────────────────────────────");
const wonValues = results.map((r) => r.votesWon);
const lostValues = results.map((r) => r.votesLost);
const total = results[0]!.totalVotes;
console.log(`  Gewonnen (von ${total}): ${fmtStats(stats(wonValues))}`);
console.log(`  Verloren (von ${total}): ${fmtStats(stats(lostValues))}`);

const winRates = results.map((r) =>
  Math.round((r.votesWon / r.totalVotes) * 100),
);
console.log(`  Gewinnrate %:           ${fmtStats(stats(winRates))} %`);

console.log("");

// ── CSV-Export ───────────────────────────────────────────────────────────────
if (CONFIG.csvOutput) {
  const yearHeaders = Array.from(
    { length: CONFIG.years },
    (_, i) => `rep_y${i + 1}`,
  );
  const metricHeaders = SIM_METRICS.map((m) => `final_${m.key}`);
  const headers = [
    "run",
    ...yearHeaders,
    ...metricHeaders,
    "votes_won",
    "votes_lost",
  ];

  const rows = results.map((r, i) => [
    i + 1,
    ...r.reputationEndOfYear,
    ...SIM_METRICS.map((m) => Math.round(r.finalMetrics[m.key] ?? 0)),
    r.votesWon,
    r.votesLost,
  ]);

  const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join(
    "\n",
  );
  writeFileSync(CONFIG.csvOutput, csv, "utf-8");
  console.log(`CSV gespeichert: ${CONFIG.csvOutput}\n`);
}
