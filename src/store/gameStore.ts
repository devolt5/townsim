import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {} from "@redux-devtools/extension";
import { METRICS, FACTIONS, OPEN_PROMISES } from "@/data/gameData";
import type { Metric, Faction } from "@/data/gameData";
import type { Promise as GamePromise } from "@/data/gameData";
import { DECISIONS } from "@/data/decisions";
import type { Decision } from "@/data/decisionType";
import { messages as INITIAL_MESSAGES, type Message } from "@/data/messages";
import { TIMED_TRIGGERS } from "@/data/timedMessages";
import { TUTORIAL_TRIGGERS } from "@/data/tutorialMessages";

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
  pendingDecision: Decision | null;
  usedDecisionIds: string[];
  decisionHistory: CompletedDecision[];
  messages: Message[];
  /** Keys of triggers that have already been delivered — prevents duplicates after reloads. */
  deliveredTriggerKeys: string[];
  /** Counts all significant player interactions for tutorial triggers. */
  globalClickCount: number;

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
  setPendingDecision: (decision: Decision | null) => void;

  /** Draw a random decision from DECISIONS that hasn't been used yet this cycle. */
  drawDecision: () => void;

  /**
   * Record that the pending decision was resolved with the given option label,
   * push it to decisionHistory, and clear pendingDecision.
   */
  resolveDecision: (chosenOption: string) => void;

  /** Dynamically add a new message to the inbox. */
  addMessage: (msg: Omit<Message, "id" | "timestamp" | "read">) => void;

  /** Increment the global interaction counter and fire any matching tutorial triggers. */
  incrementGlobalClicks: () => void;

  /** Mark a message as read. */
  markMessageRead: (messageId: number) => void;

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

function pickRandomDecision(usedIds: string[]): {
  decision: Decision;
  newUsedIds: string[];
} {
  let pool = DECISIONS.filter((d) => !usedIds.includes(d.id));
  const wasReset = pool.length === 0;
  if (wasReset) pool = [...DECISIONS];
  const picked = pool[Math.floor(Math.random() * pool.length)];
  return {
    decision: picked,
    newUsedIds: wasReset ? [picked.id] : [...usedIds, picked.id],
  };
}

function buildInitialState() {
  const { decision, newUsedIds } = pickRandomDecision([]);
  return {
    basicData: INITIAL_BASIC_DATA,
    turn: INITIAL_TURN,
    metrics: structuredClone(METRICS),
    factions: structuredClone(FACTIONS),
    politicalCapital: INITIAL_POLITICAL_CAPITAL,
    openPromises: structuredClone(OPEN_PROMISES),
    pendingDecision: decision,
    usedDecisionIds: newUsedIds,
    decisionHistory: [] as CompletedDecision[],
    messages: structuredClone(INITIAL_MESSAGES),
    deliveredTriggerKeys: [],
    globalClickCount: 0,
  };
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useGameStore = create<GameState>()(
  devtools(
    persist(
      (set, get) => ({
        ...buildInitialState(),

        updateBasicData: (patch) =>
          set(
            (s) => ({ basicData: { ...s.basicData, ...patch } }),
            undefined,
            "updateBasicData",
          ),

        setMetricValue: (key, value) =>
          set(
            (s) => ({
              metrics: s.metrics.map((m) =>
                m.key === key
                  ? { ...m, value: Math.max(0, Math.min(100, value)) }
                  : m,
              ),
            }),
            undefined,
            { type: "setMetricValue", key, value },
          ),

        applyMetricDelta: (key, delta) => {
          const { setMetricValue, metrics } = get();
          const metric = metrics.find((m) => m.key === key);
          if (metric) setMetricValue(key, metric.value + delta);
        },

        setFactionTrust: (short, trust) =>
          set(
            (s) => ({
              factions: s.factions.map((f) =>
                f.short === short
                  ? { ...f, trust: Math.max(0, Math.min(100, trust)) }
                  : f,
              ),
            }),
            undefined,
            { type: "setFactionTrust", short, trust },
          ),

        applyFactionTrustDelta: (short, delta) => {
          const { setFactionTrust, factions } = get();
          const faction = factions.find((f) => f.short === short);
          if (faction) setFactionTrust(short, faction.trust + delta);
        },

        applyPoliticalCapitalDelta: (delta) =>
          set(
            (s) => ({
              politicalCapital: Math.max(
                0,
                Math.min(100, s.politicalCapital + delta),
              ),
            }),
            undefined,
            { type: "applyPoliticalCapitalDelta", delta },
          ),

        addPromise: (promise) =>
          set(
            (s) => ({ openPromises: [...s.openPromises, promise] }),
            undefined,
            { type: "addPromise", id: promise.id },
          ),

        fulfillPromise: (id) =>
          set(
            (s) => ({
              openPromises: s.openPromises.map((p) =>
                p.id === id ? { ...p, fulfilled: true } : p,
              ),
            }),
            undefined,
            { type: "fulfillPromise", id },
          ),

        removePromise: (id) =>
          set(
            (s) => ({
              openPromises: s.openPromises.filter((p) => p.id !== id),
            }),
            undefined,
            { type: "removePromise", id },
          ),

        setPendingDecision: (decision) =>
          set({ pendingDecision: decision }, undefined, "setPendingDecision"),

        drawDecision: () =>
          set(
            (s) => {
              const { decision, newUsedIds } = pickRandomDecision(
                s.usedDecisionIds,
              );
              return { pendingDecision: decision, usedDecisionIds: newUsedIds };
            },
            undefined,
            "drawDecision",
          ),

        resolveDecision: (chosenOption) =>
          set(
            (s) => {
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
            },
            undefined,
            { type: "resolveDecision", chosenOption },
          ),

        addMessage: (msg) =>
          set(
            (s) => ({
              messages: [
                ...s.messages,
                { ...msg, id: Date.now(), timestamp: new Date(), read: false },
              ],
            }),
            undefined,
            { type: "addMessage", sender: msg.sender },
          ),

        incrementGlobalClicks: () =>
          set(
            (s) => {
              const newCount = s.globalClickCount + 1;
              const newMsgs: Message[] = [];
              const newKeys = [...s.deliveredTriggerKeys];
              for (const trigger of TUTORIAL_TRIGGERS) {
                if (
                  trigger.afterClickCount === newCount &&
                  !newKeys.includes(trigger.key)
                ) {
                  newKeys.push(trigger.key);
                  newMsgs.push({
                    ...trigger.message,
                    id: Date.now() + newMsgs.length,
                    timestamp: new Date(),
                    read: false,
                  });
                }
              }
              return {
                globalClickCount: newCount,
                deliveredTriggerKeys: newKeys,
                messages:
                  newMsgs.length > 0 ? [...s.messages, ...newMsgs] : s.messages,
              };
            },
            undefined,
            "incrementGlobalClicks",
          ),

        markMessageRead: (messageId) =>
          set(
            (s) => ({
              messages: s.messages.map((m) =>
                m.id === messageId ? { ...m, read: true } : m,
              ),
            }),
            undefined,
            { type: "markMessageRead", messageId },
          ),

        advanceTurn: () =>
          set(
            (s) => {
              const { year, quarter, phase } = s.turn;
              // Only phase advance — no quarter/year boundary, no triggers
              if (phase < 3) {
                return {
                  turn: { year, quarter, phase: (phase + 1) as 1 | 2 | 3 },
                };
              }
              // Quarter boundary — draw a new decision
              const { decision, newUsedIds } = pickRandomDecision(
                s.usedDecisionIds,
              );
              const decisionPatch = {
                pendingDecision: decision,
                usedDecisionIds: newUsedIds,
              };

              let newTurn: Turn;
              if (quarter < 4) {
                newTurn = { year, quarter: quarter + 1, phase: 1 };
              } else if (year < 5) {
                newTurn = { year: year + 1, quarter: 1, phase: 1 };
              } else {
                return {}; // end of game
              }

              // Check timed triggers for the new turn position
              const newMsgs: Message[] = [];
              const newKeys = [...s.deliveredTriggerKeys];
              for (const trigger of TIMED_TRIGGERS) {
                if (
                  trigger.year === newTurn.year &&
                  trigger.quarter === newTurn.quarter &&
                  !newKeys.includes(trigger.key)
                ) {
                  newKeys.push(trigger.key);
                  newMsgs.push({
                    ...trigger.message,
                    id: Date.now() + newMsgs.length,
                    timestamp: new Date(),
                    read: false,
                  });
                }
              }

              return {
                turn: newTurn,
                ...decisionPatch,
                deliveredTriggerKeys: newKeys,
                messages:
                  newMsgs.length > 0 ? [...s.messages, ...newMsgs] : s.messages,
              };
            },
            undefined,
            "advanceTurn",
          ),

        resetGame: () => set(buildInitialState(), undefined, "resetGame"),
      }),
      {
        name: "townsim-save",
        version: 2,
      },
    ),
    {
      name: "TownSim",
    },
  ),
);
