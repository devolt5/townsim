#!/usr/bin/env node
/**
 * csv-to-district.ts
 *
 * Converts a 48×48 district CSV into a ready-to-use TypeScript module.
 *
 * Usage:
 *   pnpm district:gen <districtName>
 *   e.g.  pnpm district:gen north
 *
 * Reads:
 *   scripts/<districtName>.config.json   — metadata, asset URLs, footprints
 *   src/data/disctricts/<districtName>.csv
 *
 * Writes:
 *   src/data/disctricts/<districtName>.ts
 *
 * ── CSV format ──────────────────────────────────────────────────────────────
 *
 * Row 0 (header): ,A,B,C,...,AV          (column letters, 48 columns)
 * Rows 1-48:      <rowNumber>,<cells...>
 *
 * Cell values
 *   (empty)          → empty ground (default grass)
 *   occ              → occupied by adjacent building footprint
 *   street           → ground tile "street", no flip
 *   street:h         → ground tile "street", mirrored horizontally (left ↔ right)
 *   street:v         → ground tile "street", mirrored vertically (top ↔ bottom)
 *   street:hv        → ground tile "street", mirrored on both axes
 *   building1        → building anchor, def "building1", no flip
 *   building1:h      → building anchor, mirrored horizontally
 *
 * ── Config format ───────────────────────────────────────────────────────────
 *
 * {
 *   "id": "north",
 *   "name": "Nördlicher Distrikt",
 *   "citySceneName": "Wohngebiet Nord",
 *   "buildings": {
 *     "building1": { "footprint": [4, 4], "assetPath": "src/images/buildings/4x4/building1.png" }
 *   },
 *   "grounds": {
 *     "street": { "assetPath": "src/images/buildings/1x1/street1.png" }
 *   }
 * }
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve, join } from "path";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface BuildingConfig {
  footprint: [number, number];
  assetPath: string;
}

interface GroundConfig {
  assetPath: string;
}

interface DistrictMeta {
  id: string;
  name: string;
  citySceneName: string;
}

/** Shape of scripts/districts.config.json */
interface SharedConfig {
  districts: Record<string, DistrictMeta>;
  buildings: Record<string, BuildingConfig>;
  grounds: Record<string, GroundConfig>;
}

/** Resolved config for a single district (meta + shared defs merged). */
interface DistrictConfig extends DistrictMeta {
  buildings: Record<string, BuildingConfig>;
  grounds: Record<string, GroundConfig>;
}

// ---------------------------------------------------------------------------
// Column helpers (A–AV = 0–47)
// ---------------------------------------------------------------------------

function colLetterToIndex(letter: string): number {
  letter = letter.trim().toUpperCase();
  if (letter.length === 1) return letter.charCodeAt(0) - 65; // A=0
  return (letter.charCodeAt(0) - 64) * 26 + (letter.charCodeAt(1) - 65); // e.g. AV
}

function colIndexToLetter(idx: number): string {
  if (idx < 26) return String.fromCharCode(65 + idx);
  const hi = Math.floor(idx / 26);
  const lo = idx % 26;
  return String.fromCharCode(64 + hi) + String.fromCharCode(65 + lo);
}

/** Excel-style cell address, e.g. col=3 row=2 → "D3" */
function cellAddress(col: number, row: number): string {
  return `${colIndexToLetter(col)}${row + 1}`;
}

// ---------------------------------------------------------------------------
// Parse CSV
// ---------------------------------------------------------------------------

function parseCell(
  raw: string,
): { defKey: string; flipX: boolean; flipY: boolean } | "occ" | null {
  const v = raw.trim();
  if (v === "" || v === "0") return null;
  if (v.toLowerCase() === "occ") return "occ";

  const colonIdx = v.indexOf(":");
  const defKey = (colonIdx === -1 ? v : v.slice(0, colonIdx)).trim();
  const suffix = colonIdx !== -1 ? v.slice(colonIdx + 1).toLowerCase() : "";
  const flipX = suffix.includes("h");
  const flipY = suffix.includes("v");
  return { defKey, flipX, flipY };
}

interface ParsedMap {
  /** 48×48, each cell: null | "occ" | { defKey, flipX, flipY } */
  cells: (
    | null
    | "occ"
    | { defKey: string; flipX: boolean; flipY: boolean }
  )[][];
}

function parseCSV(csvPath: string): ParsedMap {
  const text = readFileSync(csvPath, "utf-8");
  const lines = text.replace(/\r\n/g, "\n").split("\n").filter(Boolean);

  // Skip header row
  const dataLines = lines.slice(1);

  const cells: ParsedMap["cells"] = [];

  for (const line of dataLines) {
    const parts = line.split(",");
    // parts[0] is the row label (1–48), parts[1..48] are the cells
    const rowCells = parts.slice(1, 49);
    cells.push(rowCells.map(parseCell));
  }

  return { cells };
}

// ---------------------------------------------------------------------------
// Build map matrices
// ---------------------------------------------------------------------------

interface BuildingInstance {
  instanceId: string; // e.g. "building1_D3"
  defKey: string;
  flipX: boolean;
  flipY: boolean;
  anchorCol: number;
  anchorRow: number;
}

function buildMaps(
  parsed: ParsedMap,
  config: DistrictConfig,
): {
  buildingMap: string[][];
  groundMap: string[][];
  instances: BuildingInstance[];
  usedBuildingKeys: Set<string>;
  usedGroundKeys: Set<string>;
} {
  const ROWS = 48;
  const COLS = 48;

  const buildingMap: string[][] = Array.from({ length: ROWS }, () =>
    Array<string>(COLS).fill("0"),
  );
  const groundMap: string[][] = Array.from({ length: ROWS }, () =>
    Array<string>(COLS).fill("null"),
  );

  const instances: BuildingInstance[] = [];
  const usedInstanceIds = new Set<string>();
  const usedBuildingKeys = new Set<string>();
  const usedGroundKeys = new Set<string>();

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cell = parsed.cells[row]?.[col] ?? null;
      if (cell === null) continue;

      if (cell === "occ") {
        buildingMap[row][col] = '"occ"';
        continue;
      }

      const { defKey, flipX, flipY } = cell;

      // Ground tile?
      if (config.grounds[defKey]) {
        const suffix =
          flipX && flipY ? ":hv" : flipX ? ":h" : flipY ? ":v" : "";
        groundMap[row][col] = `"${defKey}${suffix}"`;
        usedGroundKeys.add(defKey);
        continue;
      }

      // Building anchor?
      if (config.buildings[defKey]) {
        // Generate a unique instance ID
        let instanceId = `${defKey}_${cellAddress(col, row)}`;
        let suffix = 2;
        while (usedInstanceIds.has(instanceId)) {
          instanceId = `${defKey}_${cellAddress(col, row)}_${suffix++}`;
        }
        usedInstanceIds.add(instanceId);
        usedBuildingKeys.add(defKey);

        buildingMap[row][col] = `"${instanceId}"`;
        instances.push({
          instanceId,
          defKey,
          flipX,
          flipY,
          anchorCol: col,
          anchorRow: row,
        });
        continue;
      }

      console.warn(
        `  ⚠  Unknown defKey "${defKey}" at ${cellAddress(col, row)} — skipped`,
      );
    }
  }

  return {
    buildingMap,
    groundMap,
    instances,
    usedBuildingKeys,
    usedGroundKeys,
  };
}

// ---------------------------------------------------------------------------
// Code generation
// ---------------------------------------------------------------------------

function assetImportVar(defKey: string): string {
  return `${defKey}Url`;
}

function generateTS(
  config: DistrictConfig,
  buildingMap: string[][],
  groundMap: string[][],
  usedBuildingKeys: Set<string>,
  usedGroundKeys: Set<string>,
): string {
  const buildingImports = [...usedBuildingKeys]
    .map(
      (key) =>
        `import ${assetImportVar(key)} from "@/${config.buildings[key].assetPath.replace(/^src\//, "")}";`,
    )
    .join("\n");

  const groundImports = [...usedGroundKeys]
    .map(
      (key) =>
        `import ${assetImportVar(key)} from "@/${config.grounds[key].assetPath.replace(/^src\//, "")}";`,
    )
    .join("\n");

  const buildingDefs = [...usedBuildingKeys]
    .map((key) => {
      const cfg = config.buildings[key];
      const [fw, fh] = cfg.footprint;
      return `  ${key}: { id: "${key}", textureKey: "${key}", footprint: [${fw}, ${fh}] as [number, number], assetUrl: ${assetImportVar(key)} },`;
    })
    .join("\n");

  const groundDefs = [...usedGroundKeys]
    .map(
      (key) =>
        `  ${key}: { textureKey: "${key}", assetUrl: ${assetImportVar(key)} },`,
    )
    .join("\n");

  // Render map as compact rows
  const mapRows = buildingMap.map((row) => `  [${row.join(", ")}]`).join(",\n");

  const groundRows = groundMap
    .map((row) => `  [${row.join(", ")}]`)
    .join(",\n");

  return `// AUTO-GENERATED — do not edit manually.
// Re-generate via: pnpm district:gen ${config.id}

import type { DistrictData } from "@/data/types/district";
${buildingImports}
${groundImports}

export const ${config.id}District: DistrictData = {
  id: "${config.id}",
  name: "${config.name}",
  citySceneName: "${config.citySceneName}",

  buildingDefs: {
${buildingDefs}
  },

  groundDefs: {
${groundDefs}
  },

  map: [
${mapRows}
  ],

  groundMap: [
${groundRows}
  ],
};
`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const districtName = process.argv[2];
if (!districtName) {
  console.error("Usage: pnpm district:gen <districtName>");
  process.exit(1);
}

const root = resolve(import.meta.dirname, "..");
const sharedConfigPath = join(root, "scripts", "districts.config.json");
const csvPath = join(root, "src", "data", "disctricts", `${districtName}.csv`);
const outPath = join(root, "src", "data", "disctricts", `${districtName}.ts`);

console.log(`Generating district: ${districtName}`);
console.log(`  Config:  ${sharedConfigPath}`);
console.log(`  CSV:     ${csvPath}`);
console.log(`  Output:  ${outPath}`);

const shared: SharedConfig = JSON.parse(
  readFileSync(sharedConfigPath, "utf-8"),
);
const meta = shared.districts[districtName];
if (!meta) {
  console.error(
    `District "${districtName}" not found in districts.config.json.`,
  );
  process.exit(1);
}
const config: DistrictConfig = {
  ...meta,
  buildings: shared.buildings,
  grounds: shared.grounds,
};

const parsed = parseCSV(csvPath);
const { buildingMap, groundMap, usedBuildingKeys, usedGroundKeys } = buildMaps(
  parsed,
  config,
);
const tsSource = generateTS(
  config,
  buildingMap,
  groundMap,
  usedBuildingKeys,
  usedGroundKeys,
);

writeFileSync(outPath, tsSource, "utf-8");
console.log("Done.");
