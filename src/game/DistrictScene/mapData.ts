import testBuildingUrl from "@/images/test_building.png";
import { GRID_COLS, GRID_ROWS, TILE_IDS } from "./constants";
import type { BuildingDef, MapCell } from "./types";

// ---------------------------------------------------------------------------
// Test map (48 × 48)
// ---------------------------------------------------------------------------
// Legend:
//   0   = empty, not buildable
//  -1   = empty, placeable by mayor
//  > 0  = building anchor tile (see BUILDING_DEFS)
//  'occ'= occupied by a multi-tile building (no sprite, filled by anchor loop)

function buildTestMap(): MapCell[][] {
  const map: MapCell[][] = [];
  for (let r = 0; r < GRID_ROWS; r++) {
    const row: MapCell[] = [];
    for (let c = 0; c < GRID_COLS; c++) {
      if (r >= 20 && r <= 27 && c >= 20 && c <= 27) {
        row.push(TILE_IDS.PLACEABLE);
      } else {
        row.push(TILE_IDS.EMPTY);
      }
    }
    map.push(row);
  }

  // Test building (4×4 footprint) at col=22, row=22
  map[22][22] = 1;
  for (let dr = 0; dr < 4; dr++) {
    for (let dc = 0; dc < 4; dc++) {
      if (dr === 0 && dc === 0) continue;
      map[22 + dr][22 + dc] = "occ";
    }
  }

  return map;
}

export const CITY_MAP: MapCell[][] = buildTestMap();

// ---------------------------------------------------------------------------
// Building definitions (keyed by map-ID)
// ---------------------------------------------------------------------------

export const BUILDING_DEFS: Record<number, BuildingDef> = {
  1: {
    id: "test_building",
    textureKey: "test_building",
    footprint: [4, 4],
    placeable: false,
    assetUrl: testBuildingUrl,
  },
};
