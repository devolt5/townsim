import type { Delegate, DelegateFaction } from "@/data/types/delegate";

const base = import.meta.env.BASE_URL.replace(/\/$/, "");
const AVATAR_POOL = [
  { image: `${base}/images/delegate_01_female.jpg`, gender: "female" as const },
  { image: `${base}/images/delegate_02_male.jpg`, gender: "male" as const },
  { image: `${base}/images/delegate_03_male.jpg`, gender: "male" as const },
  { image: `${base}/images/delegate_04_female.jpg`, gender: "female" as const },
  { image: `${base}/images/delegate_05_male.jpg`, gender: "male" as const },
];

// ── Segment layout configuration (mirrors ParliamentScene ROWS) ─────────────
// Each entry describes one concentric ring. segmentCount must match ROWS in ParliamentScene.ts.
const ROWS: { segmentCount: number; row: number }[] = [
  { row: 0, segmentCount: 30 },
  { row: 1, segmentCount: 30 },
  { row: 2, segmentCount: 40 },
  { row: 3, segmentCount: 40 },
  { row: 4, segmentCount: 40 },
  { row: 5, segmentCount: 40 },
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

  // ── Der Bund ──────────────────────────────────────────────────────
  r0_s1: "Der Bund",
  r0_s0: "Der Bund",
  r0_s29: "Der Bund",
  r1_s2: "Der Bund",
  r1_s0: "Der Bund",
  r1_s29: "Der Bund",
  r2_s3: "Der Bund",
  r2_s2: "Der Bund",
  r2_s0: "Der Bund",
  r2_s39: "Der Bund",
  r2_s38: "Der Bund",
  r3_s2: "Der Bund",
  r3_s1: "Der Bund",
  r3_s0: "Der Bund",
  r3_s39: "Der Bund",
  r3_s38: "Der Bund",
  r5_s0: "Der Bund",
  r5_s39: "Der Bund",

  // ── Union der Gilden ──────────────────────────────────────────────
  r0_s21: "Union der Gilden",
  r0_s22: "Union der Gilden",
  r0_s23: "Union der Gilden",
  r1_s21: "Union der Gilden",
  r1_s22: "Union der Gilden",
  r1_s23: "Union der Gilden",
  r2_s28: "Union der Gilden",
  r2_s29: "Union der Gilden",
  r2_s30: "Union der Gilden",
  r2_s31: "Union der Gilden",
  r2_s33: "Union der Gilden",

  // ── Terra ─────────────────────────────────────────────────────────
  r0_s15: "Terra",
  r0_s16: "Terra",
  r1_s15: "Terra",
  r1_s16: "Terra",
  r2_s19: "Terra",
  r2_s20: "Terra",
  r2_s21: "Terra",
  r3_s19: "Terra",
  r3_s20: "Terra",
  r3_s21: "Terra",
  r4_s19: "Terra",
  r4_s20: "Terra",
  r4_s21: "Terra",

  // ── Bürger ────────────────────────────────────────────────────────
  r0_s17: "Bürger",
  r1_s17: "Bürger",
  r2_s22: "Bürger",
  r2_s23: "Bürger",
  r2_s24: "Bürger",
  r3_s22: "Bürger",
  r3_s23: "Bürger",
  r3_s24: "Bürger",
  r4_s22: "Bürger",
  r4_s23: "Bürger",
};

const MALE_FIRST_NAMES = [
  "Klaus",
  "Thomas",
  "Peter",
  "Michael",
  "Markus",
  "Stefan",
  "Lukas",
  "Werner",
  "Dieter",
  "Jakob",
];
const FEMALE_FIRST_NAMES = [
  "Anna",
  "Maria",
  "Julia",
  "Laura",
  "Clara",
  "Emilia",
  "Lena",
  "Lea",
  "Emma",
  "Claudia",
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

// Deterministic name generation per segment key based on delegate gender
function nameForKey(
  key: string,
  gender: "male" | "female",
): { firstName: string; lastName: string } {
  // Use a simple hash of the key so names are stable across re-renders
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  const firstNamePool =
    gender === "male" ? MALE_FIRST_NAMES : FEMALE_FIRST_NAMES;
  const firstName = firstNamePool[hash % firstNamePool.length];
  const lastName = LAST_NAMES[(hash * 7) % LAST_NAMES.length];
  return { firstName, lastName };
}

export const DELEGATES: Record<string, Delegate | null> = {};

for (const { row, segmentCount } of ROWS) {
  for (let segIndex = 0; segIndex < segmentCount; segIndex++) {
    const key = `r${row}_s${segIndex}`;
    const faction = SEGMENT_ASSIGNMENTS[key] ?? null;

    if (faction === null) {
      DELEGATES[key] = null;
      continue;
    }

    const avatarIndex =
      (key.charCodeAt(1) * 13 + key.charCodeAt(4)) % AVATAR_POOL.length;
    const avatar = AVATAR_POOL[avatarIndex];
    const { firstName, lastName } = nameForKey(key, avatar.gender);

    DELEGATES[key] = {
      id: key,
      name: `${firstName} ${lastName}`,
      faction,
      title: "Stadtratsmitglied",
      bio: `${firstName} ${lastName} ist seit mehreren Jahren Mitglied des Stadtrats und vertritt die Interessen der ${faction}-Fraktion.`,
      imageUrl: avatar.image,
      row,
      seatIndex: segIndex,
    };
  }
}
