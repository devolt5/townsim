import { northDistrict } from "@/data/disctricts/north";
import type { BuildingDef, MapCell } from "./types";

export type { MapCell };

export const CITY_MAP: MapCell[][] = northDistrict.map;
export const BUILDING_DEFS: Record<number, BuildingDef> = northDistrict.buildingDefs;
