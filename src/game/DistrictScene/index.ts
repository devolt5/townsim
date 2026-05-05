import { Scene } from "phaser";
import type { DistrictData } from "@/data/types/district";
import { GRID_COLS, GRID_ROWS, TILE_H, TILE_W } from "./constants";
import {
  diamondPoints,
  tileKey,
  tileToWorld,
  worldToTile,
} from "./coordHelpers";
import { HoverSystem } from "./HoverSystem";
import { MouseSystem } from "./MouseSystem";
import type { DistrictSceneCallbacks, TileState } from "./types";

export class DistrictScene extends Scene {
  // -------------------------------------------------------------------------
  // State
  // -------------------------------------------------------------------------

  private tileMap = new Map<string, TileState>();
  /** key = instanceId */
  private buildingSprites = new Map<string, Phaser.GameObjects.Sprite>();
  /** key = instanceId, value = anchor tile position */
  private buildingAnchors = new Map<string, { col: number; row: number }>();
  /** key = tileKey(col, row), value = ground sprite */
  private groundSprites = new Map<string, Phaser.GameObjects.Sprite>();

  private groundLayer!: Phaser.GameObjects.Graphics;
  private highlightLayer!: Phaser.GameObjects.Graphics;

  private hover!: HoverSystem;
  private mouse!: MouseSystem;
  private hoveredTile: { col: number; row: number } | undefined;

  private districtData!: DistrictData;
  private callbacks: DistrictSceneCallbacks = {};

  constructor() {
    super({ key: "DistrictScene" });
  }

  // -------------------------------------------------------------------------
  // Public API (called from React / game logic)
  // -------------------------------------------------------------------------

  setCallbacks(callbacks: DistrictSceneCallbacks): void {
    this.callbacks = callbacks;
  }

  /** Receives district data from game.scene.start(key, data). */
  init(data: { districtData: DistrictData }): void {
    this.districtData = data.districtData;
    this.tileMap.clear();
    this.buildingSprites.clear();
    this.buildingAnchors.clear();
    this.groundSprites.clear();
  }

  /**
   * Replace a building instance at runtime.
   * The existing sprite is destroyed; a new one is created from newDefKey.
   * All footprint tiles in tileMap are updated accordingly.
   *
   * @param instanceId  Excel-address-based instance id, e.g. "building1_D3"
   * @param newDefKey   Key in districtData.buildingDefs, e.g. "building1"
   */
  replaceBuilding(instanceId: string, newDefKey: string): void {
    const anchor = this.buildingAnchors.get(instanceId);
    const oldTile = this.tileMap.get(
      tileKey(anchor?.col ?? -1, anchor?.row ?? -1),
    );
    const newDef = this.districtData.buildingDefs[newDefKey];
    if (!anchor || oldTile?.type !== "building" || !newDef) return;

    const oldDef = this.districtData.buildingDefs[oldTile.defKey];
    const [oldFw, oldFh] = oldDef?.footprint ?? [1, 1];

    // Clear old footprint tiles
    for (let dr = 0; dr < oldFh; dr++) {
      for (let dc = 0; dc < oldFw; dc++) {
        this.tileMap.set(tileKey(anchor.col + dc, anchor.row + dr), {
          type: "empty",
        });
      }
    }

    // Remove old sprite
    this.hover.clear();
    this.buildingSprites.get(instanceId)?.destroy();
    this.buildingSprites.delete(instanceId);
    this.buildingAnchors.delete(instanceId);

    // Stamp new footprint
    this.stampBuildingTiles(
      anchor.col,
      anchor.row,
      instanceId,
      newDefKey,
      oldTile.flipX,
      oldTile.flipY,
    );

    // Draw new sprite (preload may not have the texture yet — guard with exists check)
    if (this.textures.exists(newDefKey)) {
      this.drawBuildingSprite(
        anchor.col,
        anchor.row,
        instanceId,
        newDefKey,
        oldTile.flipX,
        oldTile.flipY,
      );
    } else {
      this.load.image(newDefKey, newDef.assetUrl ?? "");
      this.load.once("complete", () => {
        this.drawBuildingSprite(
          anchor.col,
          anchor.row,
          instanceId,
          newDefKey,
          oldTile.flipX,
          oldTile.flipY,
        );
      });
      this.load.start();
    }
  }

  // -------------------------------------------------------------------------
  // Phaser lifecycle
  // -------------------------------------------------------------------------

  preload(): void {
    this.generatePlaceholderTexture("ground_empty", 0x8fbc8f);

    for (const def of Object.values(this.districtData.buildingDefs)) {
      if (def.assetUrl && !this.textures.exists(def.textureKey)) {
        this.load.image(def.textureKey, def.assetUrl);
      }
    }

    for (const def of Object.values(this.districtData.groundDefs)) {
      if (def.assetUrl && !this.textures.exists(def.textureKey)) {
        this.load.image(def.textureKey, def.assetUrl);
      }
    }
  }

  create(): void {
    this.groundLayer = this.add.graphics();
    this.groundLayer.setDepth(-1); // below all sprites
    this.highlightLayer = this.add.graphics();

    this.hover = new HoverSystem(
      this.highlightLayer,
      this.tileMap,
      this.buildingSprites,
      this.buildingAnchors,
      this.districtData.buildingDefs,
    );

    this.mouse = new MouseSystem(this.cameras.main, this.input);
    this.mouse.register();

    this.initTileMap();
    this.drawGround();
    this.drawInitialBuildings();

    this.input.on("pointermove", this.onPointerMove, this);
    this.input.on("pointerdown", this.onPointerDown, this);

    this.centerCamera();
  }

  // -------------------------------------------------------------------------
  // Map initialisation
  // -------------------------------------------------------------------------

  private initTileMap(): void {
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const cell = this.districtData.map[row][col];

        if (cell === "occ") continue; // anchor loop already filled these

        if (cell === 0) {
          this.tileMap.set(tileKey(col, row), { type: "empty" });
        } else if (typeof cell === "string") {
          // cell is an instanceId like "building1_D3"
          // derive defKey: everything before the last underscore-separated address
          const defKey = this.instanceIdToDefKey(cell);
          const def = this.districtData.buildingDefs[defKey];
          if (!def) continue;
          this.stampBuildingTiles(col, row, cell, defKey, false, false);
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
        const groundEntry = this.districtData.groundMap[row][col];
        const { x, y } = tileToWorld(col, row);

        if (!groundEntry) {
          // Default grass tile drawn with Graphics
          this.groundLayer.fillStyle(0x8fbc8f, 1);
          this.groundLayer.lineStyle(1, 0x5a7a5a, 0.6);
          this.groundLayer.fillPoints(diamondPoints(x, y), true);
          this.groundLayer.strokePoints(diamondPoints(x, y), true);
        } else {
          // Textured ground tile (street etc.) — drawn with a Sprite
          const colonIdx = groundEntry.indexOf(":");
          const defKey =
            colonIdx === -1 ? groundEntry : groundEntry.slice(0, colonIdx);
          const suffix = colonIdx !== -1 ? groundEntry.slice(colonIdx + 1) : "";
          const flipX = suffix.includes("h");
          const flipY = suffix.includes("v");
          const groundDef = this.districtData.groundDefs[defKey];

          if (groundDef && this.textures.exists(groundDef.textureKey)) {
            const sprite = this.add.sprite(x, y, groundDef.textureKey);
            sprite.setOrigin(0.5, 0.5);
            // Isometric depth: same formula as buildings but offset below them
            sprite.setDepth(col + row - 0.5);
            sprite.setFlipX(flipX);
            sprite.setFlipY(flipY);
            this.groundSprites.set(tileKey(col, row), sprite);
          } else {
            // Fallback: coloured tile
            this.groundLayer.fillStyle(0xa0a0a0, 1);
            this.groundLayer.fillPoints(diamondPoints(x, y), true);
          }
        }
      }
    }
  }

  private drawInitialBuildings(): void {
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const state = this.tileMap.get(tileKey(col, row));
        if (state?.type === "building") {
          this.drawBuildingSprite(
            col,
            row,
            state.instanceId,
            state.defKey,
            state.flipX,
            state.flipY,
          );
        }
      }
    }
  }

  private drawBuildingSprite(
    col: number,
    row: number,
    instanceId: string,
    defKey: string,
    flipX: boolean,
    flipY: boolean,
  ): void {
    const def = this.districtData.buildingDefs[defKey];
    if (!def) return;

    const [fw, fh] = def.footprint ?? [1, 1];
    const anchorCol = col + fw - 1;
    const anchorRow = row + fh - 1;
    const { x, y } = tileToWorld(anchorCol, anchorRow);

    const sprite = this.add.sprite(x, y + TILE_H / 2, def.textureKey);
    sprite.setOrigin(0.5, 1);
    sprite.setDepth(anchorCol + anchorRow);
    sprite.setFlipX(flipX);
    sprite.setFlipY(flipY);
    sprite.setInteractive();

    sprite.on("pointerdown", () => {
      if (this.mouse.isDragging) return;
      this.callbacks.onBuildingClick?.(instanceId, defKey);
    });
    sprite.on("pointerover", () => {
      this.hover.drawForInstance(instanceId);
      this.hoveredTile = { col, row };
    });
    sprite.on("pointerout", () => {
      this.hover.clear();
      this.hoveredTile = undefined;
    });

    this.buildingSprites.set(instanceId, sprite);
    this.buildingAnchors.set(instanceId, { col, row });
  }

  // -------------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------------

  /**
   * Write building + occupied entries into tileMap for a full footprint.
   */
  private stampBuildingTiles(
    col: number,
    row: number,
    instanceId: string,
    defKey: string,
    flipX: boolean,
    flipY: boolean,
  ): void {
    const def = this.districtData.buildingDefs[defKey];
    const [fw, fh] = def?.footprint ?? [1, 1];
    for (let dr = 0; dr < fh; dr++) {
      for (let dc = 0; dc < fw; dc++) {
        if (dr === 0 && dc === 0) {
          this.tileMap.set(tileKey(col, row), {
            type: "building",
            instanceId,
            defKey,
            flipX,
            flipY,
            anchor: true,
          });
        } else {
          this.tileMap.set(tileKey(col + dc, row + dr), {
            type: "occupied",
            instanceId,
            defKey,
          });
        }
      }
    }
  }

  /**
   * Derives the BuildingDef key from an instanceId.
   * Strips the trailing "_<ExcelAddress>" suffix (e.g. "building1_D3" → "building1").
   */
  private instanceIdToDefKey(instanceId: string): string {
    // instanceId format: "<defKey>_<ExcelAddress>" where ExcelAddress = letters + digits
    // We strip everything from the last underscore-followed-by-uppercase-letter
    const match = instanceId.match(/^(.+?)_[A-Z]{1,2}\d+(?:_\d+)?$/);
    return match ? match[1] : instanceId;
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

    if (
      tile?.col === this.hoveredTile?.col &&
      tile?.row === this.hoveredTile?.row
    )
      return;

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
      this.callbacks.onBuildingClick?.(state.instanceId, state.defKey);
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
