/**
 * Utility helpers for working with the game's turn / time system.
 *
 * The game runs over 5 years × 4 quarters = 20 turns (flat index 1–20).
 * Every helper here operates on { year: 1–5, quarter: 1–4 } objects, which
 * map to the Turn type used throughout the store.
 */

export interface TurnPosition {
  year: number;
  quarter: number;
}

/** Converts a (year, quarter) position to a flat, 1-based quarter index. */
export function turnToIndex(year: number, quarter: number): number {
  return (year - 1) * 4 + quarter;
}

/**
 * Advances `quartersAhead` quarters from the given position.
 * Clamps the result to the maximum possible turn (year 5, quarter 4).
 *
 * @example
 * addQuarters(1, 4, 4) // → { year: 2, quarter: 4 }
 * addQuarters(3, 2, 2) // → { year: 3, quarter: 4 }
 */
export function addQuarters(
  year: number,
  quarter: number,
  quartersAhead: number,
): TurnPosition {
  const totalIndex = turnToIndex(year, quarter) + quartersAhead;
  const clampedIndex = Math.min(totalIndex, 20); // max 5 years × 4 quarters
  return {
    year: Math.ceil(clampedIndex / 4),
    quarter: ((clampedIndex - 1) % 4) + 1,
  };
}

/**
 * Returns a deadline at quarter 4 of the current year ("this year still").
 *
 * @example
 * endOfYear(3) // → { year: 3, quarter: 4 }
 */
export function endOfYear(year: number): TurnPosition {
  return { year, quarter: 4 };
}

/**
 * Returns a deadline exactly one year (4 quarters) from now.
 *
 * @example
 * inOneYear(1, 4) // → { year: 2, quarter: 4 }
 * inOneYear(4, 3) // → { year: 5, quarter: 3 }
 */
export function inOneYear(year: number, quarter: number): TurnPosition {
  return addQuarters(year, quarter, 4);
}

/**
 * Returns true if `deadline` has already passed (i.e. `now` is strictly
 * later than `deadline`).
 *
 * @example
 * isOverdue({ year: 2, quarter: 1 }, { year: 2, quarter: 2 }) // → true
 * isOverdue({ year: 2, quarter: 2 }, { year: 2, quarter: 2 }) // → false (still on time)
 */
export function isOverdue(deadline: TurnPosition, now: TurnPosition): boolean {
  return (
    turnToIndex(now.year, now.quarter) >
    turnToIndex(deadline.year, deadline.quarter)
  );
}

/**
 * How many quarters remain until the deadline (negative = already overdue).
 *
 * @example
 * quartersRemaining({ year: 3, quarter: 4 }, { year: 3, quarter: 2 }) // → 2
 * quartersRemaining({ year: 2, quarter: 1 }, { year: 2, quarter: 3 }) // → -2
 */
export function quartersRemaining(
  deadline: TurnPosition,
  now: TurnPosition,
): number {
  return (
    turnToIndex(deadline.year, deadline.quarter) -
    turnToIndex(now.year, now.quarter)
  );
}
