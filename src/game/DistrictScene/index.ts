import { Scene } from "phaser";
import { GRID_COLS, GRID_ROWS, TILE_H, TILE_IDS, TILE_W } from "./constants";
import { diamondPoints, tileKey, tileToWorld, worldToTile } from "./coordHelpers";
import { HoverSystem } from "./HoverSystem";
import { MouseSystem } from "./MouseSystem";
import { BUILDING_DEFS, CITY_MAP } from "./mapData";
import type { BuildingDef, DistrictSceneCallbacks, TileState } from "./types";

export class DistrictScene extends Scene {
  // -------------------------------------------------------------------------
  // State
  // -------------------------------------------------------------------------

  private tileMap = new Map<string, TileState>();
  private buildingSprites = new Map<string, Phaser.GameObjects.Sprite>();
  private buildingAnchors = new Map<string, { col: number; row: number }>();

  private groundLayer!: Phaser.GameObjects.Graphics;
  private highlightLayer!: Phaser.GameObjects.Graphics;

  private hover!: HoverSystem;
  private mouse!: MouseSystem;
  private hoveredTile: { col: number; row: number } | undefined;

  private callbacks: DistrictSceneCallbacks = {};

  constructor() {
    super({ key: "DistrictScene" });
  }

  // -------------------------------------------------------------------------
  // Public API (called from React)
  // -------------------------------------------------------------------------

  setCallbacks(callbacks: DistrictSceneCallbacks): void {
    this.callbacks = callbacks;
  }

  /** Place a building on the grid at runtime (mayor confirms placement). */
  placeBuilding(col: number, row: number, buildingId: string): void {
    const def = Object.values(BUILDING_DEFS).find((d) => d.id === buildingId);
    if (!def) return;

    const [fw, fh] = def.footprint ?? [1, 1];
    for (let dr = 0; dr < fh; dr++) {
      for (let dc = 0; dc < fw; dc++) {
        this.tileMap.set(tileKey(col + dc, row + dr), {
          type: dr === 0 && dc === 0 ? "building" : "occupied",
          buildingId,
          ...(dr === 0 && dc === 0 ? { anchor: true } : {}),
        } as TileState);
      }
    }
    this.drawBuilding(col, row, def);
  }

  // -------------------------------------------------------------------------
  // Phaser lifecycle
  // -------------------------------------------------------------------------

  preload(): void {
    this.generatePlaceholderTexture("ground_empty",    0x8fbc8f);
    this.generatePlaceholderTexture("ground_placeable", 0xf5c842);

    for (const def of Object.values(BUILDING_DEFS)) {
      if (def.assetUrl) {
        this.load.image(def.textureKey, def.assetUrl);
      }
    }
  }

  create(): void {
    this.groundLayer    = this.add.graphics();
    this.highlightLayer = this.add.graphics();

    this.hover = new HoverSystem(
      this.highlightLayer,
      this.tileMap,
      this.buildingSprites,
      this.buildingAnchors,
    );

    this.mouse = new MouseSystem(this.cameras.main, this.input);
    this.mouse.register();

    this.initTileMap();
    this.drawGround();
    this.drawInitialBuildings();

    this.input.on("pointermove", this.onPointerMove, this);
    this.input.on("pointerdown", this.onPointerDown,  this);

    this.centerCamera();
  }

  // -------------------------------------------------------------------------
  // Map initialisation
  // -------------------------------------------------------------------------

  private initTileMap(): void {
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const cell = CITY_MAP[row][col];
        if (cell === "occ") continue; // filled by anchor tile's footprint loop

        if (cell === TILE_IDS.EMPTY) {
          this.tileMap.set(tileKey(col, row), { type: "empty", placeable: false });
        } else if (cell === TILE_IDS.PLACEABLE) {
          this.tileMap.set(tileKey(col, row), { type: "empty", placeable: true });
        } else if (cell > 0) {
          const def = BUILDING_DEFS[cell];
          if (!def) continue;
          const [fw, fh] = def.footprint ?? [1, 1];
          for (let dr = 0; dr < fh; dr++) {
            for (let dc = 0; dc < fw; dc++) {
              this.tileMap.set(tileKey(col + dc, row + dr), {
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

  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------

  private drawGround(): void {
    this.groundLayer.clear();
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const state = this.tileMap.get(tileKey(col, row));
        const { x, y } = tileToWorld(col, row);

        const fillColor = state?.type === "empty" && state.placeable ? 0xf5c842 : 0x8fbc8f;
        this.groundLayer.fillStyle(fillColor, 1);
        this.groundLayer.lineStyle(1, 0x5a7a5a, 0.6);
        this.groundLayer.fillPoints(diamondPoints(x, y), true);
        this.groundLayer.strokePoints(diamondPoints(x, y), true);
      }
    }
  }

  private drawInitialBuildings(): void {
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const state = this.tileMap.get(tileKey(col, row));
        if (state?.type === "building" && state.anchor) {
          const def = Object.values(BUILDING_DEFS).find((d) => d.id === state.buildingId);
          if (def) this.drawBuilding(col, row, def);
        }
      }
    }
  }

  private drawBuilding(col: number, row: number, def: BuildingDef): void {
    const [fw, fh] = def.footprint ?? [1, 1];
    const anchorCol = col + fw - 1;
    const anchorRow = row + fh - 1;
    const { x, y } = tileToWorld(anchorCol, anchorRow);

    const sprite = this.add.sprite(x, y + TILE_H / 2, def.textureKey);
    sprite.setOrigin(0.5, 1);
    sprite.setDepth(anchorCol + anchorRow);
    sprite.setInteractive();

    sprite.on("pointerdown", () => {
      if (this.mouse.isDragging) return;
      this.callbacks.onBuildingClick?.(def.id);
    });
    sprite.on("pointerover", () => {
      this.hover.drawForBuilding(def.id);
      const anchor = this.buildingAnchors.get(def.id);
      if (anchor) this.hoveredTile = { col: anchor.col, row: anchor.row };
    });
    sprite.on("pointerout", () => {
      this.hover.clear();
      this.hoveredTile = undefined;
    });

    this.buildingSprites.set(def.id, sprite);
    this.buildingAnchors.set(def.id, { col, row });
  }

  // -------------------------------------------------------------------------
  // Camera
  // -------------------------------------------------------------------------

  private centerCamera(): void {
    this.cameras.main.centerOn(0, ((GRID_COLS + GRID_ROWS - 2) * TILE_H) / 4);
  }

  // -------------------------------------------------------------------------
  // Input handlers
  // -------------------------------------------------------------------------

  private onPointerMove(pointer: Phaser.Input.Pointer): void {
    const tile = worldToTile(pointer.worldX, pointer.worldY);

    if (tile?.col === this.hoveredTile?.col && tile?.row === this.hoveredTile?.row) return;

    this.hover.clear();
    this.hoveredTile = tile;

    if (!tile) return;

    this.hover.drawForTile(tile.col, tile.row);

    const state = this.tileMap.get(tileKey(tile.col, tile.row));
    if (state) this.callbacks.onTileHover?.(tile.col, tile.row, state);
  }

  private onPointerDown(pointer: Phaser.Input.Pointer): void {
    const tile = worldToTile(pointer.worldX, pointer.worldY);
    if (!tile) return;
    if (this.mouse.isDragging) return;

    const state = this.tileMap.get(tileKey(tile.col, tile.row));
    if (!state) return;

    if (state.type === "building") {
      this.callbacks.onBuildingClick?.(state.buildingId);
    } else if (state.type === "empty" && state.placeable) {
      this.callbacks.onPlaceBuilding?.(tile.col, tile.row);
    }
  }

  // -------------------------------------------------------------------------
  // Utilities
  // -------------------------------------------------------------------------

  private generatePlaceholderTexture(key: string, color: number): void {
    if (this.textures.exists(key)) return;
    const g = this.make.graphics({ x: 0, y: 0 });
    g.fillStyle(color, 1);
    g.fillRect(0, 0, TILE_W, TILE_W);
    g.generateTexture(key, TILE_W, TILE_W);
    g.destroy();
  }
}
