/**
 * Voting Engine — Phase 3 vote calculation (§3.1–3.4 of the Regelwerk).
 *
 * All calculation is pure and side-effect free so it can be unit-tested
 * independently of the store or UI.
 *
 * Formula summary
 * ───────────────
 * 1. baseYes/baseNo/baseUndecided from petitionMetrics lookup (§3.1)
 * 2. Apply structural multiplier (role-based, §3.2)
 * 3. Apply each action modifier independently on baseYes (§3.3)
 * 4. Dice roll for remaining undecided, weighted by reputation (§3.4)
 *
 * Key rule: every modifier is applied independently to the ORIGINAL baseYes
 * (not to already-modified values). Minimum +1 applies to every POSITIVE
 * contribution when it would otherwise be zero.
 */

import type { Faction, GamePromise, ActionModifier } from "@/data/gameData";
import type { Petition } from "@/data/types/petition";
import { petitionMetrics } from "@/data/petitionMetrics";
import { REPUTATION_DICE_FACTOR } from "@/data/gameData";
import { STRUCTURAL_MULTIPLIER } from "@/data/gameData";
import { TRUST_DELTA_MULTIPLIER } from "@/data/gameData";

// ─── Internal helpers ─────────────────────────────────────────────────────────

/**
 * Structural modifier: applies the role-based multiplier to baseYes.
 * Minimum rule: coalition gets at least +1 even when baseYes === 0.
 * Opposition cannot produce fewer than 0 votes.
 */
function applyStructural(role: string, baseYes: number): number {
  if (role === "neutral") return baseYes;
  const mult = STRUCTURAL_MULTIPLIER[role] ?? 1.0;
  const result = Math.ceil(baseYes * mult);
  if (role === "coalition") return Math.max(1, result);
  return Math.max(0, result); // opposition
}

/**
 * Action modifier delta for a single modifier.
 * Positive: minimum +1 when baseYes > 0 (or exactly +1 when baseYes === 0).
 * Negative: no floor — zero base yields zero delta.
 */
function actionDelta(fraction: number, baseYes: number): number {
  const magnitude = Math.ceil(baseYes * Math.abs(fraction));
  if (fraction > 0) return Math.max(1, magnitude);
  return -magnitude;
}

// ─── Public types ─────────────────────────────────────────────────────────────

export interface FactionVoteBreakdown {
  factionShort: string;
  seats: number;
  /** Raw yes-votes from the petition metric table — before any modifier. */
  baseYes: number;
  baseUndecided: number;
  baseNo: number;
  /**
   * Yes-votes after structural + action modifiers but BEFORE the dice roll.
   * This is the "committed yes" count shown in the pre-vote preview.
   */
  modifiedYes: number;
  modifiedUndecided: number;
  modifiedNo: number;
  /** How many undecided votes were converted to yes by the dice roll. */
  diceYes: number;
  finalYes: number;
  finalNo: number;
  /**
   * True when the faction is bound by an active promise for this petition.
   * In that case all seats voted yes regardless of any other modifier.
   */
  promiseBound: boolean;
}

/** Totals before the dice roll — used for the pre-vote preview in the UI. */
export interface VotePreview {
  totalSeats: number;
  majority: number;
  /** Sum of modifiedYes across all factions. */
  totalYes: number;
  /** Sum of modifiedUndecided across all factions. */
  totalUndecided: number;
  /** Sum of modifiedNo across all factions. */
  totalNo: number;
  factions: Omit<FactionVoteBreakdown, "diceYes" | "finalYes" | "finalNo">[];
}

/** Complete result including the dice roll — stored in the game state. */
export interface VoteResult {
  totalSeats: number;
  majority: number;
  totalYes: number;
  totalNo: number;
  /** Undecided remaining before the dice roll (informational). */
  totalUndecidedBeforeDice: number;
  passed: boolean;
  factions: FactionVoteBreakdown[];
}

// ─── Core computation ─────────────────────────────────────────────────────────

/**
 * Checks whether a faction has an active, unfulfilled, non-broken promise
 * that matches at least one of the petition's tags.
 */
function isPromiseBound(
  factionShort: string,
  petitionTags: string[],
  openPromises: GamePromise[],
): boolean {
  return openPromises.some(
    (p) =>
      p.faction === factionShort &&
      !p.fulfilled &&
      !p.broken &&
      p.tagCondition !== undefined &&
      petitionTags.includes(p.tagCondition),
  );
}

/**
 * Deterministic part of the vote calculation (no randomness).
 * Returns the modified yes/undecided/no per faction, suitable for a preview.
 */
export function calculateVotePreview(
  petition: Petition,
  factions: Faction[],
  activeActionModifiers: ActionModifier[],
  openPromises: GamePromise[],
): VotePreview {
  const totalSeats = factions.reduce((s, f) => s + f.seats, 0);
  const majority = Math.floor(totalSeats / 2) + 1;
  const petitionTags = petition.tags ?? [];

  let totalYes = 0;
  let totalUndecided = 0;
  let totalNo = 0;

  const factionPreviews = factions.map((faction) => {
    const reaction = petition.factionReactions.find(
      (r) => r.factionShort === faction.short,
    );
    const support = reaction?.support ?? 0;
    const metrics = petitionMetrics[String(support)] ?? petitionMetrics["0"];

    // 1. Base votes from the lookup table
    const baseYes = Math.floor((faction.seats * metrics.dafür) / 100);
    const baseNo = Math.floor((faction.seats * metrics.dagegen) / 100);
    const baseUndecided = faction.seats - baseYes - baseNo;

    // 2. Promise override — entire faction votes yes
    const promiseBound = isPromiseBound(
      faction.short,
      petitionTags,
      openPromises,
    );
    if (promiseBound) {
      totalYes += faction.seats;
      return {
        factionShort: faction.short,
        seats: faction.seats,
        baseYes,
        baseUndecided,
        baseNo,
        modifiedYes: faction.seats,
        modifiedUndecided: 0,
        modifiedNo: 0,
        promiseBound: true,
      };
    }

    // 3. Structural modifier
    const structuralYes = applyStructural(faction.role, baseYes);

    // 4. Action modifier deltas (each independently on baseYes)
    const actionTotal = activeActionModifiers.reduce(
      (sum, mod) => sum + actionDelta(mod.fraction, baseYes),
      0,
    );

    // 5. Combine and clamp
    const maxYes = faction.seats - baseNo;
    const modifiedYes = Math.max(
      0,
      Math.min(maxYes, structuralYes + actionTotal),
    );
    const modifiedUndecided = faction.seats - modifiedYes - baseNo;
    const modifiedNo = baseNo;

    totalYes += modifiedYes;
    totalUndecided += modifiedUndecided;
    totalNo += modifiedNo;

    return {
      factionShort: faction.short,
      seats: faction.seats,
      baseYes,
      baseUndecided,
      baseNo,
      modifiedYes,
      modifiedUndecided,
      modifiedNo,
      promiseBound: false,
    };
  });

  return {
    totalSeats,
    majority,
    totalYes,
    totalUndecided,
    totalNo,
    factions: factionPreviews,
  };
}

/**
 * Runs the complete vote including the dice roll for undecided voters.
 * This is called exactly once when the player confirms the vote in Phase 3.
 *
 * @param petition      The petition being voted on.
 * @param factions      Current faction state (with role).
 * @param activeActionModifiers  Active action modifiers this quarter.
 * @param openPromises  All open (unfulfilled, unbroken) promises.
 * @param reputation    Current reputation metric value (0–100).
 */
export function resolveVote(
  petition: Petition,
  factions: Faction[],
  activeActionModifiers: ActionModifier[],
  openPromises: GamePromise[],
  reputation: number,
): VoteResult {
  const preview = calculateVotePreview(
    petition,
    factions,
    activeActionModifiers,
    openPromises,
  );

  let totalYes = 0;
  let totalNo = 0;

  const factionResults: FactionVoteBreakdown[] = preview.factions.map((fp) => {
    if (fp.promiseBound) {
      totalYes += fp.seats;
      return { ...fp, diceYes: 0, finalYes: fp.seats, finalNo: 0 };
    }

    // Dice roll weighted by reputation (§3.4)
    const rawRoll = Math.random() * 100;
    const adjustedRoll = Math.min(
      100,
      rawRoll + reputation * REPUTATION_DICE_FACTOR,
    );
    const diceYes = Math.round(fp.modifiedUndecided * (adjustedRoll / 100));

    const finalYes = Math.min(fp.seats, fp.modifiedYes + diceYes);
    const finalNo = fp.seats - finalYes;

    totalYes += finalYes;
    totalNo += finalNo;

    return { ...fp, diceYes, finalYes, finalNo };
  });

  const majority = preview.majority;

  return {
    totalSeats: preview.totalSeats,
    majority,
    totalYes,
    totalNo,
    totalUndecidedBeforeDice: preview.totalUndecided,
    passed: totalYes >= majority,
    factions: factionResults,
  };
}

// ─── Metric effects ───────────────────────────────────────────────────────────

/**
 * Maps a vote result to reputation metric deltas per §5 of the Regelwerk.
 * Positive = reputation gained, negative = reputation lost.
 *
 * "Knapp" (close loss): yes-votes were within 4 seats of the majority threshold.
 */
export function computeVoteMetricDeltas(
  result: VoteResult,
): Record<string, number> {
  if (result.passed) {
    return { reputation: 2 };
  }
  const margin = result.majority - result.totalYes;
  return { reputation: margin <= 4 ? -1 : -3 };
}

/**
 * Computes per-faction trust deltas after a council vote.
 *
 * Formula: delta = support × direction × TRUST_DELTA_MULTIPLIER
 *   direction = +1 when the outcome matches the faction's preference
 *             = -1 when the outcome goes against the faction's preference
 *
 * Matching means: support ≥ 0 and petition passed, OR support ≤ 0 and petition rejected.
 * This simplifies to: direction = passed ? +1 : -1 applied to the signed support value.
 *
 * Examples:
 *   support +5, passed  → delta = +5  (faction wanted it, got it)
 *   support +5, failed  → delta = -5  (faction wanted it, lost)
 *   support -5, failed  → delta = +5  (faction opposed it, succeeded)
 *   support -5, passed  → delta = -5  (faction opposed it, was overruled)
 *
 * @returns Map of factionShort → trust delta (unrounded, caller should clamp to 0–100)
 */
export function computeTrustDeltas(
  result: VoteResult,
  petition: Petition,
): Record<string, number> {
  const direction = result.passed ? 1 : -1;
  const deltas: Record<string, number> = {};
  for (const reaction of petition.factionReactions) {
    deltas[reaction.factionShort] = Math.round(
      reaction.support * direction * TRUST_DELTA_MULTIPLIER,
    );
  }
  return deltas;
}
