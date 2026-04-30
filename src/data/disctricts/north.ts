import testBuildingUrl from "@/images/buildings/4x4/building1.png";
import type { DistrictData, MapCell } from "@/data/districtTypes";

// ---------------------------------------------------------------------------
// Building definitions
// ---------------------------------------------------------------------------

const DEFS = {
  TEST_BUILDING: 1,
} as const;

// ---------------------------------------------------------------------------
// Map builder helpers
// ---------------------------------------------------------------------------

const COLS = 48;
const ROWS = 48;

function emptyMap(): MapCell[][] {
  return Array.from({ length: ROWS }, () => Array<MapCell>(COLS).fill(0));
}

/**
 * Stamps a building onto the map.
 * Sets the anchor cell to `defId` and marks remaining footprint cells as "occ".
 */
function placeBuilding(
  map: MapCell[][],
  anchorCol: number,
  anchorRow: number,
  defId: number,
  footprint: [number, number],
): void {
  const [fw, fh] = footprint;
  for (let dr = 0; dr < fh; dr++) {
    for (let dc = 0; dc < fw; dc++) {
      map[anchorRow + dr][anchorCol + dc] =
        dr === 0 && dc === 0 ? defId : "occ";
    }
  }
}

/**
 * Marks a rectangular area as placeable by the mayor (-1).
 */
function markPlaceable(
  map: MapCell[][],
  colStart: number,
  rowStart: number,
  colEnd: number,
  rowEnd: number,
): void {
  for (let r = rowStart; r <= rowEnd; r++) {
    for (let c = colStart; c <= colEnd; c++) {
      if (map[r][c] === 0) map[r][c] = -1;
    }
  }
}

// ---------------------------------------------------------------------------
// North district map
// ---------------------------------------------------------------------------

function buildNorthMap(): MapCell[][] {
  const map = emptyMap();

  // Placeable construction zones
  markPlaceable(map, 4, 4, 18, 18); // western quarter
  markPlaceable(map, 28, 6, 43, 20); // eastern quarter

  // Pre-placed buildings
  placeBuilding(map, 6, 6, DEFS.TEST_BUILDING, [4, 4]); // building A
  placeBuilding(map, 11, 11, DEFS.TEST_BUILDING, [4, 4]); // building B

  return map;
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const northDistrict: DistrictData = {
  id: "north",
  name: "Nördlicher Distrikt",
  citySceneName: "Wohngebiet Nord",
  buildingDefs: {
    [DEFS.TEST_BUILDING]: {
      id: "test_building",
      textureKey: "test_building",
      footprint: [4, 4],
      placeable: false,
      assetUrl: testBuildingUrl,
    },
  },
  map: buildNorthMap(),
};
