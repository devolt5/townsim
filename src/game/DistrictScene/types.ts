// ---------------------------------------------------------------------------
// Tile state types
// ---------------------------------------------------------------------------

/**
 * A cell in the 48×48 map matrix.
 *   0     = empty ground
 * "occ"   = occupied by an adjacent building's footprint
 *  string = building def key (anchor tile), e.g. "building1"
 */
export type MapCell = 0 | "occ" | string;

/** A tile that has no building on it. */
export interface EmptyTile {
  type: "empty";
}

/** A tile that is the anchor of a building sprite. */
export interface BuildingTile {
  type: "building";
  /** Unique instance identifier — Excel address of the anchor tile, e.g. "D3". */
  instanceId: string;
  /** Key into DistrictData.buildingDefs. */
  defKey: string;
  /** Mirror the sprite horizontally (left ↔ right). */
  flipX: boolean;
  /** Mirror the sprite vertically (top ↔ bottom). */
  flipY: boolean;
  anchor: true;
}

/** A tile that is blocked because a multi-tile building occupies it. */
export interface OccupiedTile {
  type: "occupied";
  /** Instance ID of the anchor building. */
  instanceId: string;
  defKey: string;
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
  /** Vite asset URL — consumed by preload(). */
  assetUrl?: string;
}

// ---------------------------------------------------------------------------
// Ground tile definition (streets, water, etc.)
// ---------------------------------------------------------------------------

export interface GroundTileDef {
  textureKey: string;
  /** Vite asset URL — consumed by preload(). */
  assetUrl?: string;
}

// ---------------------------------------------------------------------------
// React ↔ Phaser bridge callbacks
// ---------------------------------------------------------------------------

export interface DistrictSceneCallbacks {
  onBuildingClick?: (instanceId: string, defKey: string) => void;
  onTileHover?: (col: number, row: number, state: TileState) => void;
}
