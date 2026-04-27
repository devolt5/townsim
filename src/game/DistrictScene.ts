import { Scene, Math as PhaserMath } from "phaser";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Width of one isometric tile diamond in pixels. */
export const TILE_W = 64;

/** Height of one isometric tile diamond in pixels (2:1 ratio). */
export const TILE_H = 32;

/** Total columns in the grid. */
export const GRID_COLS = 48;

/** Total rows in the grid. */
export const GRID_ROWS = 48;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A tile that is empty and may or may not be buildable by the mayor. */
export interface EmptyTile {
  type: "empty";
  placeable: boolean; // true = mayor may build here
}

/** A tile that is occupied by a building (the anchor sprite is drawn here). */
export interface BuildingTile {
  type: "building";
  buildingId: string;
  /** Only the anchor tile owns the sprite; other tiles in the footprint point here. */
  anchor: boolean;
}

/** A tile that is blocked because a multi-tile building occupies it. */
export interface OccupiedTile {
  type: "occupied";
  buildingId: string; // which building owns this space
}

export type TileState = EmptyTile | BuildingTile | OccupiedTile;

/** Definition of a single building type. */
export interface BuildingDef {
  id: string;
  textureKey: string;
  /** Footprint in tiles [cols, rows]. Defaults to [1, 1]. */
  footprint?: [number, number];
  /** Whether the mayor can place this building. */
  placeable: boolean;
}

/** Numeric tile IDs used in CITY_MAP. */
export const TILE_IDS = {
  EMPTY: 0,
  PLACEABLE: -1,
} as const;

/**
 * Callback signatures for bridging Phaser events back to React.
 */
export interface DistrictSceneCallbacks {
  onBuildingClick?: (buildingId: string) => void;
  onPlaceBuilding?: (col: number, row: number) => void;
  onTileHover?: (col: number, row: number, state: TileState) => void;
}

// ---------------------------------------------------------------------------
// Static map data  (48 × 48)
// ---------------------------------------------------------------------------
// Legend:
//   0   = empty, not buildable
//  -1   = empty, placeable by mayor
//  > 0  = building anchor tile (see BUILDING_DEFS)
//  'occ'= occupied by a multi-tile building (no sprite)
//
// For now we generate a simple test map programmatically.

type MapCell = number | "occ";

function buildTestMap(): MapCell[][] {
  const map: MapCell[][] = [];
  for (let r = 0; r < GRID_ROWS; r++) {
    const row: MapCell[] = [];
    for (let c = 0; c < GRID_COLS; c++) {
      // A band of placeable tiles in the middle
      if (r >= 20 && r <= 27 && c >= 20 && c <= 27) {
        row.push(TILE_IDS.PLACEABLE);
      } else {
        row.push(TILE_IDS.EMPTY);
      }
    }
    map.push(row);
  }

  // Place a single test building (4×4 footprint) at col=22, row=22
  map[22][22] = 1;     // anchor
  for (let dr = 0; dr < 4; dr++) {
    for (let dc = 0; dc < 4; dc++) {
      if (dr === 0 && dc === 0) continue; // anchor already set
      map[22 + dr][22 + dc] = "occ";
    }
  }

  return map;
}

export const CITY_MAP: MapCell[][] = buildTestMap();

import testBuildingUrl from "@/images/test_building.png";

/** Building definitions keyed by map-ID. */
export const BUILDING_DEFS: Record<number, BuildingDef> = {
  1: {
    id: "test_building",
    textureKey: "test_building",
    footprint: [4, 4],
    placeable: false,
  },
};

// ---------------------------------------------------------------------------
// DistrictScene
// ---------------------------------------------------------------------------

export class DistrictScene extends Scene {
  // Internal tile state map: "col,row" → TileState
  private tileMap = new Map<string, TileState>();

  // Graphics layer for ground diamonds and hover highlight
  private groundLayer!: Phaser.GameObjects.Graphics;
  private highlightLayer!: Phaser.GameObjects.Graphics;

  // Currently hovered tile (undefined = none)
  private hoveredTile: { col: number; row: number } | undefined;

  // Callbacks to React
  private callbacks: DistrictSceneCallbacks = {};

  constructor() {
    super({ key: "DistrictScene" });
  }

  // -------------------------------------------------------------------------
  // Public API (called from React before or after create)
  // -------------------------------------------------------------------------

  setCallbacks(callbacks: DistrictSceneCallbacks): void {
    this.callbacks = callbacks;
  }

  /**
   * Place a building on the grid at runtime (called from React when the mayor
   * confirms a placement).
   */
  placeBuilding(col: number, row: number, buildingId: string): void {
    const def = Object.values(BUILDING_DEFS).find((d) => d.id === buildingId);
    if (!def) return;

    const [fw, fh] = def.footprint ?? [1, 1];

    // Mark all footprint tiles as occupied
    for (let dr = 0; dr < fh; dr++) {
      for (let dc = 0; dc < fw; dc++) {
        const key = this.key(col + dc, row + dr);
        this.tileMap.set(key, {
          type: dr === 0 && dc === 0 ? "building" : "occupied",
          buildingId,
          ...(dr === 0 && dc === 0 ? { anchor: true } : {}),
        } as TileState);
      }
    }

    // Draw the sprite
    this.drawBuilding(col, row, def);
  }

  // -------------------------------------------------------------------------
  // Phaser lifecycle
  // -------------------------------------------------------------------------

  preload(): void {
    // Generate placeholder textures for ground tile types
    this.generatePlaceholderTexture("ground_empty", 0x8fbc8f);
    this.generatePlaceholderTexture("ground_placeable", 0xf5c842);
    // Real building sprite
    this.load.image("test_building", testBuildingUrl);
  }

  create(): void {
    // Layers (drawn bottom to top)
    this.groundLayer = this.add.graphics();
    this.highlightLayer = this.add.graphics();

    // Build tileMap from CITY_MAP
    this.initTileMap();

    // Draw static ground
    this.drawGround();

    // Draw all initial buildings
    this.drawInitialBuildings();

    // Input
    this.input.on("pointermove", this.onPointerMove, this);
    this.input.on("pointerdown", this.onPointerDown, this);

    // Center camera on the grid
    this.centerCamera();
  }

  // -------------------------------------------------------------------------
  // Coordinate helpers
  // -------------------------------------------------------------------------

  /** Convert tile (col, row) to isometric world position (centre of diamond). */
  tileToWorld(col: number, row: number): { x: number; y: number } {
    return {
      x: (col - row) * (TILE_W / 2),
      y: (col + row) * (TILE_H / 2),
    };
  }

  /** Convert world position to tile (col, row). Returns undefined if outside grid. */
  worldToTile(wx: number, wy: number): { col: number; row: number } | undefined {
    // Inverse of the isometric projection
    const col = Math.round((wx / (TILE_W / 2) + wy / (TILE_H / 2)) / 2);
    const row = Math.round((wy / (TILE_H / 2) - wx / (TILE_W / 2)) / 2);

    if (col < 0 || col >= GRID_COLS || row < 0 || row >= GRID_ROWS) {
      return undefined;
    }

    // Verify the point is inside the diamond (not just the bounding rectangle)
    const centre = this.tileToWorld(col, row);
    const dx = Math.abs(wx - centre.x) / (TILE_W / 2);
    const dy = Math.abs(wy - centre.y) / (TILE_H / 2);
    if (dx + dy > 1) return undefined;

    return { col, row };
  }

  // -------------------------------------------------------------------------
  // Private helpers
  // -------------------------------------------------------------------------

  private key(col: number, row: number): string {
    return `${col},${row}`;
  }

  private initTileMap(): void {
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const cell = CITY_MAP[row][col];
        const k = this.key(col, row);

        if (cell === "occ") {
          // Will be overwritten when the anchor tile is processed
          this.tileMap.set(k, {
            type: "occupied",
            buildingId: "", // placeholder, resolved below
          });
        } else if (cell === TILE_IDS.EMPTY) {
          this.tileMap.set(k, { type: "empty", placeable: false });
        } else if (cell === TILE_IDS.PLACEABLE) {
          this.tileMap.set(k, { type: "empty", placeable: true });
        } else if (cell > 0) {
          const def = BUILDING_DEFS[cell];
          if (!def) continue;
          const [fw, fh] = def.footprint ?? [1, 1];
          // Mark entire footprint
          for (let dr = 0; dr < fh; dr++) {
            for (let dc = 0; dc < fw; dc++) {
              const fk = this.key(col + dc, row + dr);
              this.tileMap.set(fk, {
                type: dr === 0 && dc === 0 ? "building" : "occupied",
                buildingId: def.id,
                ...(dr === 0 && dc === 0 ? { anchor: true } : {}),
              } as TileState);
            }
          }
        }
      }
    }
  }

  private drawGround(): void {
    this.groundLayer.clear();

    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const state = this.tileMap.get(this.key(col, row));
        const { x, y } = this.tileToWorld(col, row);

        const fillColor =
          state?.type === "empty" && state.placeable ? 0xf5c842 : 0x8fbc8f;
        const lineColor = 0x5a7a5a;

        this.groundLayer.fillStyle(fillColor, 1);
        this.groundLayer.lineStyle(1, lineColor, 0.6);
        this.groundLayer.fillPoints(this.diamondPoints(x, y), true);
        this.groundLayer.strokePoints(this.diamondPoints(x, y), true);
      }
    }
  }

  private drawInitialBuildings(): void {
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const state = this.tileMap.get(this.key(col, row));
        if (state?.type === "building" && state.anchor) {
          const def = Object.values(BUILDING_DEFS).find(
            (d) => d.id === state.buildingId
          );
          if (def) this.drawBuilding(col, row, def);
        }
      }
    }
  }

  private drawBuilding(col: number, row: number, def: BuildingDef): void {
    const [fw, fh] = def.footprint ?? [1, 1];
    // Anchor point: bottom-centre of the footprint's front corner
    const anchorCol = col + fw - 1;
    const anchorRow = row + fh - 1;
    const { x, y } = this.tileToWorld(anchorCol, anchorRow);

    const sprite = this.add.sprite(x, y + TILE_H / 2, def.textureKey);
    sprite.setOrigin(0.5, 1);
    sprite.setDepth(anchorCol + anchorRow);
    sprite.setInteractive();

    sprite.on("pointerdown", () => {
      this.callbacks.onBuildingClick?.(def.id);
    });
  }

  private drawHoverHighlight(col: number, row: number): void {
    this.highlightLayer.clear();
    const { x, y } = this.tileToWorld(col, row);
    const state = this.tileMap.get(this.key(col, row));

    // Yellow for placeable, white for occupied/building, grey for non-interactable
    let color = 0xffffff;
    let alpha = 0.35;

    if (state?.type === "empty") {
      color = state.placeable ? 0xffe066 : 0xffffff;
      alpha = state.placeable ? 0.55 : 0.2;
    }

    this.highlightLayer.fillStyle(color, alpha);
    this.highlightLayer.fillPoints(this.diamondPoints(x, y), true);
  }

  /** Returns the 4 corner points of a diamond centred at (cx, cy). */
  private diamondPoints(cx: number, cy: number): PhaserMath.Vector2[] {
    const hw = TILE_W / 2;
    const hh = TILE_H / 2;
    return [
      new PhaserMath.Vector2(cx,      cy - hh), // top
      new PhaserMath.Vector2(cx + hw, cy      ), // right
      new PhaserMath.Vector2(cx,      cy + hh), // bottom
      new PhaserMath.Vector2(cx - hw, cy      ), // left
    ];
  }

  private centerCamera(): void {
    // The grid spans from the top corner to the bottom corner:
    // worldX range: [-(GRID_ROWS-1)*(TILE_W/2), (GRID_COLS-1)*(TILE_W/2)]
    // worldY range: [0, (GRID_COLS+GRID_ROWS-2)*(TILE_H/2)]
    const centreX = 0;
    const centreY = ((GRID_COLS + GRID_ROWS - 2) * TILE_H) / 4;

    this.cameras.main.centerOn(centreX, centreY);
  }

  // -------------------------------------------------------------------------
  // Input handlers
  // -------------------------------------------------------------------------

  private onPointerMove(pointer: Phaser.Input.Pointer): void {
    const wx = pointer.worldX;
    const wy = pointer.worldY;
    const tile = this.worldToTile(wx, wy);

    // Nothing changed
    if (
      tile?.col === this.hoveredTile?.col &&
      tile?.row === this.hoveredTile?.row
    ) {
      return;
    }

    this.hoveredTile = tile;

    if (!tile) {
      this.highlightLayer.clear();
      return;
    }

    this.drawHoverHighlight(tile.col, tile.row);

    const state = this.tileMap.get(this.key(tile.col, tile.row));
    if (state) {
      this.callbacks.onTileHover?.(tile.col, tile.row, state);
    }
  }

  private onPointerDown(pointer: Phaser.Input.Pointer): void {
    const tile = this.worldToTile(pointer.worldX, pointer.worldY);
    if (!tile) return;

    const state = this.tileMap.get(this.key(tile.col, tile.row));
    if (!state) return;

    if (state.type === "building") {
      this.callbacks.onBuildingClick?.(state.buildingId);
    } else if (state.type === "empty" && state.placeable) {
      this.callbacks.onPlaceBuilding?.(tile.col, tile.row);
    }
  }

  // -------------------------------------------------------------------------
  // Placeholder texture generator
  // -------------------------------------------------------------------------

  /**
   * Generates a simple coloured rectangle as a stand-in texture until real
   * sprite assets are available.
   */
  private generatePlaceholderTexture(key: string, color: number): void {
    if (this.textures.exists(key)) return;

    const g = this.make.graphics({ x: 0, y: 0 });
    g.fillStyle(color, 1);
    g.fillRect(0, 0, TILE_W, TILE_W); // square sprite
    g.generateTexture(key, TILE_W, TILE_W);
    g.destroy();
  }
}
