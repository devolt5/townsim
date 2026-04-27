// ---------------------------------------------------------------------------
// Tile state types
// ---------------------------------------------------------------------------

export type MapCell = number | "occ";

/** A tile that is empty and may or may not be buildable by the mayor. */
export interface EmptyTile {
  type: "empty";
  placeable: boolean;
}

/** A tile that is occupied by a building (the anchor sprite is drawn here). */
export interface BuildingTile {
  type: "building";
  buildingId: string;
  /** Only the anchor tile owns the sprite; other tiles in the footprint reference the anchor. */
  anchor: boolean;
}

/** A tile that is blocked because a multi-tile building occupies it. */
export interface OccupiedTile {
  type: "occupied";
  buildingId: string;
}

export type TileState = EmptyTile | BuildingTile | OccupiedTile;

// ---------------------------------------------------------------------------
// Building definition
// ---------------------------------------------------------------------------

export interface BuildingDef {
  id: string;
  textureKey: string;
  /** Footprint in tiles [cols, rows]. Defaults to [1, 1]. */
  footprint?: [number, number];
  /** Whether the mayor can place this building. */
  placeable: boolean;
  /** Vite asset URL — set in mapData.ts, consumed by preload(). */
  assetUrl?: string;
}

// ---------------------------------------------------------------------------
// React ↔ Phaser bridge callbacks
// ---------------------------------------------------------------------------

export interface DistrictSceneCallbacks {
  onBuildingClick?: (buildingId: string) => void;
  onPlaceBuilding?: (col: number, row: number) => void;
  onTileHover?: (col: number, row: number, state: TileState) => void;
}
