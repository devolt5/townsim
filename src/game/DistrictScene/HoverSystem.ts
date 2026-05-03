import { diamondPoints, tileKey, tileToWorld } from "./coordHelpers";
import type { BuildingDef, TileState } from "./types";

/**
 * Encapsulates all hover-related visual logic:
 * - footprint diamond overlay on the highlightLayer
 * - sprite tint on the hovered building
 *
 * Instantiated in DistrictScene.create() after the layers and maps exist.
 */
export class HoverSystem {
  private hoveredInstanceId: string | undefined;

  private readonly highlightLayer: Phaser.GameObjects.Graphics;
  private readonly tileMap: Map<string, TileState>;
  private readonly buildingSprites: Map<string, Phaser.GameObjects.Sprite>;
  private readonly buildingAnchors: Map<string, { col: number; row: number }>;
  private readonly buildingDefs: Record<string, BuildingDef>;

  constructor(
    highlightLayer: Phaser.GameObjects.Graphics,
    tileMap: Map<string, TileState>,
    buildingSprites: Map<string, Phaser.GameObjects.Sprite>,
    buildingAnchors: Map<string, { col: number; row: number }>,
    buildingDefs: Record<string, BuildingDef>,
  ) {
    this.highlightLayer = highlightLayer;
    this.tileMap = tileMap;
    this.buildingSprites = buildingSprites;
    this.buildingAnchors = buildingAnchors;
    this.buildingDefs = buildingDefs;
  }

  // -------------------------------------------------------------------------
  // Public API
  // -------------------------------------------------------------------------

  /** The instance that is currently highlighted (undefined = none). */
  get currentInstanceId(): string | undefined {
    return this.hoveredInstanceId;
  }

  /**
   * Draw a hover highlight for whichever tile/building is at (col, row).
   * Reads tile type from tileMap to decide what to render.
   */
  drawForTile(col: number, row: number): void {
    this.highlightLayer.clear();
    const state = this.tileMap.get(tileKey(col, row));

    if (state?.type === "building" || state?.type === "occupied") {
      this.applyBuildingHighlight(state.instanceId);
    }
  }

  /**
   * Draw a hover highlight directly for a building instance (used by sprite
   * pointerover, where no tile coordinate is needed).
   */
  drawForInstance(instanceId: string): void {
    this.highlightLayer.clear();
    this.applyBuildingHighlight(instanceId);
  }

  /** Remove all hover visuals and clear internal state. */
  clear(): void {
    this.clearBuildingTint();
    this.highlightLayer.clear();
  }

  // -------------------------------------------------------------------------
  // Private helpers
  // -------------------------------------------------------------------------

  private applyBuildingHighlight(instanceId: string): void {
    const anchor = this.buildingAnchors.get(instanceId);
    const state = this.tileMap.get(
      tileKey(anchor?.col ?? -1, anchor?.row ?? -1),
    );
    if (!anchor || state?.type !== "building") return;

    const def = this.buildingDefs[state.defKey];
    if (!def) return;

    const [fw, fh] = def.footprint ?? [1, 1];
    this.highlightLayer.fillStyle(0xffe066, 0.3);
    this.highlightLayer.lineStyle(1, 0xffd700, 0.8);

    for (let dr = 0; dr < fh; dr++) {
      for (let dc = 0; dc < fw; dc++) {
        const { x, y } = tileToWorld(anchor.col + dc, anchor.row + dr);
        const pts = diamondPoints(x, y);
        this.highlightLayer.fillPoints(pts, true);
        this.highlightLayer.strokePoints(pts, true);
      }
    }

    this.buildingSprites.get(instanceId)?.setTint(0xffe8b0);
    this.hoveredInstanceId = instanceId;
  }

  private clearBuildingTint(): void {
    if (this.hoveredInstanceId) {
      this.buildingSprites.get(this.hoveredInstanceId)?.clearTint();
      this.hoveredInstanceId = undefined;
    }
  }
}
