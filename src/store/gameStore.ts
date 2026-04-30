import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  METRICS,
  FACTIONS,
  PENDING_DECISION,
  OPEN_PROMISES,
} from "@/data/gameData";
import type { Metric, Faction, PendingDecision } from "@/data/gameData";
import type { Promise as GamePromise } from "@/data/gameData";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BasicGameData {
  cityName: string;
  playerName: string;
}

/** Current position in the game timeline (GDD §4). */
export interface Turn {
  /** 1–5 */
  year: number;
  /** 1–4 */
  quarter: number;
  /**
   * 1 = Lagebericht
   * 2 = Vorbereitung
   * 3 = Abstimmung
   */
  phase: 1 | 2 | 3;
}

/** Minimal record kept when a decision is resolved. */
export interface CompletedDecision {
  turn: Omit<Turn, "phase">;
  title: string;
  chosenOption: string;
}

// ---------------------------------------------------------------------------
// State + Actions
// ---------------------------------------------------------------------------

interface GameState {
  // ── Data ──────────────────────────────────────────────────────────────────
  basicData: BasicGameData;
  turn: Turn;
  metrics: Metric[];
  factions: Faction[];
  /** 0–100 (GDD §6). Starts at 50. */
  politicalCapital: number;
  openPromises: GamePromise[];
  pendingDecision: PendingDecision | null;
  decisionHistory: CompletedDecision[];

  // ── Actions ───────────────────────────────────────────────────────────────

  /** Update city name or player name. */
  updateBasicData: (patch: Partial<BasicGameData>) => void;

  /** Set the value (0–100) of a metric identified by its key. */
  setMetricValue: (key: string, value: number) => void;

  /** Apply a delta to a metric value, clamped to [0, 100]. */
  applyMetricDelta: (key: string, delta: number) => void;

  /** Set the trust level (0–100) of a faction identified by its short name. */
  setFactionTrust: (short: string, trust: number) => void;

  /** Apply a delta to a faction's trust, clamped to [0, 100]. */
  applyFactionTrustDelta: (short: string, delta: number) => void;

  /** Add or subtract political capital, clamped to [0, 100]. */
  applyPoliticalCapitalDelta: (delta: number) => void;

  /** Register a new open promise. */
  addPromise: (promise: GamePromise) => void;

  /** Mark a promise as fulfilled. */
  fulfillPromise: (id: string) => void;

  /** Remove a promise (e.g. after it was broken or resolved). */
  removePromise: (id: string) => void;

  /** Replace the current pending decision (or clear it). */
  setPendingDecision: (decision: PendingDecision | null) => void;

  /**
   * Record that the pending decision was resolved with the given option label,
   * push it to decisionHistory, and clear pendingDecision.
   */
  resolveDecision: (chosenOption: string) => void;

  /**
   * Advance the game clock by one phase.
   * phase 3 → next quarter's phase 1; quarter 4 + phase 3 → next year.
   */
  advanceTurn: () => void;

  /** Reset all state to initial values (new game). */
  resetGame: () => void;
}

// ---------------------------------------------------------------------------
// Initial state (derived from existing gameData constants)
// ---------------------------------------------------------------------------

const INITIAL_BASIC_DATA: BasicGameData = {
  cityName: "Neustadt",
  playerName: "Bürgermeisterin",
};

const INITIAL_TURN: Turn = { year: 1, quarter: 1, phase: 1 };

const INITIAL_POLITICAL_CAPITAL = 50;

function buildInitialState() {
  return {
    basicData: INITIAL_BASIC_DATA,
    turn: INITIAL_TURN,
    metrics: structuredClone(METRICS),
    factions: structuredClone(FACTIONS),
    politicalCapital: INITIAL_POLITICAL_CAPITAL,
    openPromises: structuredClone(OPEN_PROMISES),
    pendingDecision: structuredClone(PENDING_DECISION) as PendingDecision,
    decisionHistory: [] as CompletedDecision[],
  };
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...buildInitialState(),

      updateBasicData: (patch) =>
        set((s) => ({ basicData: { ...s.basicData, ...patch } })),

      setMetricValue: (key, value) =>
        set((s) => ({
          metrics: s.metrics.map((m) =>
            m.key === key
              ? { ...m, value: Math.max(0, Math.min(100, value)) }
              : m,
          ),
        })),

      applyMetricDelta: (key, delta) => {
        const { setMetricValue, metrics } = get();
        const metric = metrics.find((m) => m.key === key);
        if (metric) setMetricValue(key, metric.value + delta);
      },

      setFactionTrust: (short, trust) =>
        set((s) => ({
          factions: s.factions.map((f) =>
            f.short === short
              ? { ...f, trust: Math.max(0, Math.min(100, trust)) }
              : f,
          ),
        })),

      applyFactionTrustDelta: (short, delta) => {
        const { setFactionTrust, factions } = get();
        const faction = factions.find((f) => f.short === short);
        if (faction) setFactionTrust(short, faction.trust + delta);
      },

      applyPoliticalCapitalDelta: (delta) =>
        set((s) => ({
          politicalCapital: Math.max(
            0,
            Math.min(100, s.politicalCapital + delta),
          ),
        })),

      addPromise: (promise) =>
        set((s) => ({ openPromises: [...s.openPromises, promise] })),

      fulfillPromise: (id) =>
        set((s) => ({
          openPromises: s.openPromises.map((p) =>
            p.id === id ? { ...p, fulfilled: true } : p,
          ),
        })),

      removePromise: (id) =>
        set((s) => ({
          openPromises: s.openPromises.filter((p) => p.id !== id),
        })),

      setPendingDecision: (decision) => set({ pendingDecision: decision }),

      resolveDecision: (chosenOption) =>
        set((s) => {
          if (!s.pendingDecision) return {};
          const entry: CompletedDecision = {
            turn: { year: s.turn.year, quarter: s.turn.quarter },
            title: s.pendingDecision.title,
            chosenOption,
          };
          return {
            pendingDecision: null,
            decisionHistory: [...s.decisionHistory, entry],
          };
        }),

      advanceTurn: () =>
        set((s) => {
          const { year, quarter, phase } = s.turn;
          if (phase < 3)
            return { turn: { year, quarter, phase: (phase + 1) as 1 | 2 | 3 } };
          if (quarter < 4)
            return { turn: { year, quarter: quarter + 1, phase: 1 } };
          if (year < 5)
            return { turn: { year: year + 1, quarter: 1, phase: 1 } };
          // Year 5 Q4 Phase 3 — game over (Wahlnacht); stay at final state
          return {};
        }),

      resetGame: () => set(buildInitialState()),
    }),
    {
      name: "townsim-save",
    },
  ),
);
