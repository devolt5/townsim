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
  private hoveredBuildingId: string | undefined;

  private readonly highlightLayer: Phaser.GameObjects.Graphics;
  private readonly tileMap: Map<string, TileState>;
  private readonly buildingSprites: Map<string, Phaser.GameObjects.Sprite>;
  private readonly buildingAnchors: Map<string, { col: number; row: number }>;
  private readonly buildingDefs: Record<number, BuildingDef>;

  constructor(
    highlightLayer: Phaser.GameObjects.Graphics,
    tileMap: Map<string, TileState>,
    buildingSprites: Map<string, Phaser.GameObjects.Sprite>,
    buildingAnchors: Map<string, { col: number; row: number }>,
    buildingDefs: Record<number, BuildingDef>,
  ) {
    this.highlightLayer   = highlightLayer;
    this.tileMap          = tileMap;
    this.buildingSprites  = buildingSprites;
    this.buildingAnchors  = buildingAnchors;
    this.buildingDefs     = buildingDefs;
  }

  // -------------------------------------------------------------------------
  // Public API
  // -------------------------------------------------------------------------

  /** The building that is currently highlighted (undefined = none). */
  get currentBuildingId(): string | undefined {
    return this.hoveredBuildingId;
  }

  /**
   * Draw a hover highlight for whichever tile/building is at (col, row).
   * Reads tile type from tileMap to decide what to render.
   */
  drawForTile(col: number, row: number): void {
    this.highlightLayer.clear();
    const state = this.tileMap.get(tileKey(col, row));

    if (state?.type === "empty") {
      this.drawEmptyTile(col, row, state.placeable);
    } else if (state?.type === "building" || state?.type === "occupied") {
      this.drawBuilding(state.buildingId);
    }
  }

  /**
   * Draw a hover highlight directly for a building (used by sprite pointerover,
   * where no tile coordinate is needed).
   */
  drawForBuilding(buildingId: string): void {
    this.highlightLayer.clear();
    this.applyBuildingHighlight(buildingId);
  }

  /** Remove all hover visuals and clear internal state. */
  clear(): void {
    this.clearBuildingTint();
    this.highlightLayer.clear();
  }

  // -------------------------------------------------------------------------
  // Private helpers
  // -------------------------------------------------------------------------

  private drawEmptyTile(col: number, row: number, placeable: boolean): void {
    const { x, y } = tileToWorld(col, row);
    const color = placeable ? 0xffe066 : 0xffffff;
    const alpha = placeable ? 0.55 : 0.2;
    this.highlightLayer.fillStyle(color, alpha);
    this.highlightLayer.fillPoints(diamondPoints(x, y), true);
  }

  private drawBuilding(buildingId: string): void {
    this.applyBuildingHighlight(buildingId);
  }

  private applyBuildingHighlight(buildingId: string): void {
    const anchor = this.buildingAnchors.get(buildingId);
    const def = Object.values(this.buildingDefs).find((d) => d.id === buildingId);
    if (!anchor || !def) return;

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

    this.buildingSprites.get(buildingId)?.setTint(0xffe8b0);
    this.hoveredBuildingId = buildingId;
  }

  private clearBuildingTint(): void {
    if (this.hoveredBuildingId) {
      this.buildingSprites.get(this.hoveredBuildingId)?.clearTint();
      this.hoveredBuildingId = undefined;
    }
  }
}
