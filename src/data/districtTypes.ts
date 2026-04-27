import type { BuildingDef, MapCell } from "@/game/DistrictScene/types";

export type { MapCell };

/**
 * All data needed to render and simulate one district.
 *
 * Map convention (same as CITY_MAP):
 *   0    = empty, not buildable
 *  -1    = empty, placeable by mayor
 *  > 0   = building anchor (key into buildingDefs)
 * "occ"  = occupied by a multi-tile building (anchor's footprint loop fills these)
 */
export interface DistrictData {
  id: string;
  name: string;
  /** The matching district name in CityScene's DISTRICTS array. */
  citySceneName: string;
  /** Building types that appear in (or can be placed in) this district. */
  buildingDefs: Record<number, BuildingDef>;
  /** 48 × 48 tile matrix. */
  map: MapCell[][];
}
