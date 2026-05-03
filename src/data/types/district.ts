import type {
  BuildingDef,
  GroundTileDef,
  MapCell,
} from "@/game/DistrictScene/types";

export type { MapCell };

/**
 * All data needed to render one district.
 *
 * map cell convention:
 *   0      = empty ground (use default grass texture)
 *  "occ"   = occupied by an adjacent building's footprint
 *  string  = building anchor — key into buildingDefs (e.g. "building1_D3")
 *
 * groundMap cell convention:
 *   null / undefined = default grass
 *   string           = key into groundDefs (e.g. "street")
 *
 * Ground tiles and building tiles are separate layers.
 * Streets go into groundMap; buildings into map.
 */
export interface DistrictData {
  id: string;
  name: string;
  /** The matching district name in CityScene's DISTRICTS array. */
  citySceneName: string;
  /** Building types that appear in this district, keyed by def name (e.g. "building1"). */
  buildingDefs: Record<string, BuildingDef>;
  /** Ground tile types (streets, water, etc.), keyed by def name (e.g. "street"). */
  groundDefs: Record<string, GroundTileDef>;
  /**
   * 48 × 48 building map.
   * Entries are building instance keys (e.g. "building1_D3") or 0/"occ".
   * The instance key encodes both the def and the anchor position.
   */
  map: MapCell[][];
  /**
   * 48 × 48 ground texture map.
   * Each entry is a ground def key (e.g. "street") or null for default grass.
   * Rotation is encoded as "street:90".
   */
  groundMap: (string | null)[][];
}
