import { northDistrict } from "@/data/disctricts/north";
import type { BuildingDef, GroundTileDef, MapCell } from "./types";

export type { MapCell };

export const CITY_MAP: MapCell[][] = northDistrict.map;
export const BUILDING_DEFS: Record<string, BuildingDef> =
  northDistrict.buildingDefs;
export const GROUND_DEFS: Record<string, GroundTileDef> =
  northDistrict.groundDefs;
