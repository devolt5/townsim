import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {} from "@redux-devtools/extension";
import { METRICS, FACTIONS, OPEN_PROMISES } from "@/data/gameData";
import type { Metric, Faction } from "@/data/gameData";
import type { Promise as GamePromise } from "@/data/gameData";
import { PETITIONS } from "@/data/petitions";
import type { Petition } from "@/data/types/petition";
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

/** Minimal record kept when a petition is resolved. */
export interface CompletedPetition {
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
  /** The three petitions offered to the player this quarter. Empty once one has been resolved. */
  pendingPetitions: Petition[];
  usedPetitionIds: string[];
  petitionHistory: CompletedPetition[];
  messages: Message[];
  /** Keys of triggers that have already been delivered — prevents duplicates after reloads. */
  deliveredTriggerKeys: string[];
  /**
   * Runtime building overrides for districts.
   * Format: { [districtId]: { [instanceId]: newDefKey } }
   * e.g. { "north": { "building1_D3": "swimming_pool" } }
   * Applied on top of the static map when a DistrictScene is loaded.
   */
  districtOverrides: Record<string, Record<string, string>>;
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

  /** Replace the current pending petitions array. */
  setPendingPetitions: (petitions: Petition[]) => void;

  /** Draw 3 random petitions from PETITIONS that haven't been used yet this cycle. */
  drawPetitions: () => void;

  /**
   * Record that one of the pending petitions was resolved with the given option label.
   * The other two petitions are returned to the pool (removed from usedPetitionIds).
   */
  resolvePetition: (petitionId: string, chosenOption: string) => void;

  /** Dynamically add a new message to the inbox. */
  addMessage: (msg: Omit<Message, "id" | "timestamp" | "read">) => void;

  /**
   * Replace a building instance in a district.
   * Persisted in districtOverrides so the change survives reloads.
   */
  replaceDistrictBuilding: (
    districtId: string,
    instanceId: string,
    defKey: string,
  ) => void;

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

function pickRandomPetitions(
  usedIds: string[],
  count: number = 3,
): { petitions: Petition[]; newUsedIds: string[] } {
  let pool = PETITIONS.filter((d) => !usedIds.includes(d.id));
  // If the pool is exhausted, reset it
  if (pool.length === 0) {
    pool = [...PETITIONS];
    usedIds = [];
  }
  const picked: Petition[] = [];
  const newUsedIds = [...usedIds];
  const take = Math.min(count, pool.length);
  for (let i = 0; i < take; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    picked.push(pool[idx]);
    newUsedIds.push(pool[idx].id);
    pool = pool.filter((_, j) => j !== idx);
  }
  return { petitions: picked, newUsedIds };
}

function buildInitialState() {
  const { petitions, newUsedIds } = pickRandomPetitions([]);
  return {
    basicData: INITIAL_BASIC_DATA,
    turn: INITIAL_TURN,
    metrics: structuredClone(METRICS),
    factions: structuredClone(FACTIONS),
    politicalCapital: INITIAL_POLITICAL_CAPITAL,
    openPromises: structuredClone(OPEN_PROMISES),
    pendingPetitions: petitions,
    usedPetitionIds: newUsedIds,
    petitionHistory: [] as CompletedPetition[],
    messages: structuredClone(INITIAL_MESSAGES),
    deliveredTriggerKeys: [],
    globalClickCount: 0,
    districtOverrides: {} as Record<string, Record<string, string>>,
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

        setPendingPetitions: (petitions) =>
          set(
            { pendingPetitions: petitions },
            undefined,
            "setPendingPetitions",
          ),

        drawPetitions: () =>
          set(
            (s) => {
              const { petitions, newUsedIds } = pickRandomPetitions(
                s.usedPetitionIds,
              );
              return {
                pendingPetitions: petitions,
                usedPetitionIds: newUsedIds,
              };
            },
            undefined,
            "drawPetitions",
          ),

        resolvePetition: (petitionId, chosenOption) =>
          set(
            (s) => {
              const resolved = s.pendingPetitions.find(
                (d) => d.id === petitionId,
              );
              if (!resolved) return {};
              const entry: CompletedPetition = {
                turn: { year: s.turn.year, quarter: s.turn.quarter },
                title: resolved.title,
                chosenOption,
              };
              // Return the other two petitions to the pool
              const otherIds = s.pendingPetitions
                .filter((d) => d.id !== petitionId)
                .map((d) => d.id);
              const newUsedIds = s.usedPetitionIds.filter(
                (id) => !otherIds.includes(id),
              );
              return {
                pendingPetitions: [],
                petitionHistory: [...s.petitionHistory, entry],
                usedPetitionIds: newUsedIds,
              };
            },
            undefined,
            { type: "resolvePetition", petitionId, chosenOption },
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

        replaceDistrictBuilding: (districtId, instanceId, defKey) =>
          set(
            (s) => ({
              districtOverrides: {
                ...s.districtOverrides,
                [districtId]: {
                  ...s.districtOverrides[districtId],
                  [instanceId]: defKey,
                },
              },
            }),
            undefined,
            { type: "replaceDistrictBuilding", districtId, instanceId, defKey },
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
              // Quarter boundary — draw 3 new petitions
              const { petitions, newUsedIds } = pickRandomPetitions(
                s.usedPetitionIds,
              );
              const petitionPatch = {
                pendingPetitions: petitions,
                usedPetitionIds: newUsedIds,
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
                ...petitionPatch,
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
        version: 4,
      },
    ),
    {
      name: "TownSim",
    },
  ),
);
