import type { Delegate, DelegateFaction } from "@/data/types/delegate";
import delegate01 from "@/images/delegate_01.jpg";
import delegate02 from "@/images/delegate_02.jpg";
import delegate03 from "@/images/delegate_03.jpg";
import delegate04 from "@/images/delegate_04.jpg";
import delegate05 from "@/images/delegate_05.jpg";

const AVATAR_POOL = [
  delegate01,
  delegate02,
  delegate03,
  delegate04,
  delegate05,
];

// ── Segment layout configuration (mirrors ParliamentScene ROWS) ─────────────
// Each entry describes one concentric ring. segmentCount must match ROWS in ParliamentScene.ts.
const ROWS: { segmentCount: number; row: number }[] = [
  { row: 0, segmentCount: 8 },
  { row: 1, segmentCount: 14 },
  { row: 2, segmentCount: 20 },
  { row: 3, segmentCount: 40 },
  { row: 4, segmentCount: 40 },
];

// ── Explicit seat assignments ─────────────────────────────────────────────────
// Keys use the pattern `r{row}_s{segmentIndex}`. Every segment NOT listed here
// will automatically become null (empty / no delegate).
// Add further factions below as they are defined.
const SEGMENT_ASSIGNMENTS: Record<string, DelegateFaction> = {
  // ── Syndikat ──────────────────────────────────────────────────────
  r0_s10: "Syndikat",
  r0_s7: "Syndikat",
  r0_s6: "Syndikat",
  r1_s9: "Syndikat",
  r1_s8: "Syndikat",
  r1_s7: "Syndikat",
  r1_s6: "Syndikat",
  r2_s10: "Syndikat",
  r4_s13: "Syndikat",
};

const FIRST_NAMES = [
  "Anna",
  "Klaus",
  "Maria",
  "Thomas",
  "Julia",
  "Peter",
  "Sandra",
  "Michael",
  "Sabine",
  "Hans",
  "Laura",
  "Stefan",
  "Monika",
  "Georg",
  "Petra",
  "Werner",
  "Inge",
  "Dieter",
  "Claudia",
  "Ernst",
];
const LAST_NAMES = [
  "Müller",
  "Schmidt",
  "Schneider",
  "Fischer",
  "Weber",
  "Meyer",
  "Wagner",
  "Becker",
  "Schulz",
  "Hoffmann",
  "Schäfer",
  "Koch",
  "Bauer",
  "Richter",
  "Klein",
  "Wolf",
  "Schröder",
  "Neumann",
  "Schwarz",
  "Zimmermann",
];

// Deterministic-ish name generation per segment key (no global counter needed)
function nameForKey(key: string): { firstName: string; lastName: string } {
  // Use a simple hash of the key so names are stable across re-renders
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  const firstName = FIRST_NAMES[hash % FIRST_NAMES.length];
  const lastName = LAST_NAMES[(hash * 7) % LAST_NAMES.length];
  return { firstName, lastName };
}

/**
 * Segment-keyed delegate map.
 *
 * Keys follow the pattern `r{row}_s{segmentIndex}` (e.g. "r0_s3").
 * Segments not listed in SEGMENT_ASSIGNMENTS are set to null (empty).
 * To override a generated entry, assign directly after this block:
 *   DELEGATES["r2_s5"] = null;
 */
export const DELEGATES: Record<string, Delegate | null> = {};

for (const { row, segmentCount } of ROWS) {
  for (let segIndex = 0; segIndex < segmentCount; segIndex++) {
    const key = `r${row}_s${segIndex}`;
    const faction = SEGMENT_ASSIGNMENTS[key] ?? null;

    if (faction === null) {
      DELEGATES[key] = null;
      continue;
    }

    const { firstName, lastName } = nameForKey(key);
    const avatarIndex =
      (key.charCodeAt(1) * 13 + key.charCodeAt(4)) % AVATAR_POOL.length;

    DELEGATES[key] = {
      id: key,
      name: `${firstName} ${lastName}`,
      faction,
      title: "Stadtratsmitglied",
      bio: `${firstName} ${lastName} ist seit mehreren Jahren Mitglied des Stadtrats und vertritt die Interessen der ${faction}-Fraktion.`,
      imageUrl: AVATAR_POOL[avatarIndex],
      row,
      seatIndex: segIndex,
    };
  }
}
