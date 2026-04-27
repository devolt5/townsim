import { Math as PhaserMath } from "phaser";
import { GRID_COLS, GRID_ROWS, TILE_H, TILE_W } from "./constants";

// ---------------------------------------------------------------------------
// Coordinate conversion
// ---------------------------------------------------------------------------

/** Convert tile (col, row) to isometric world position (centre of diamond). */
export function tileToWorld(col: number, row: number): { x: number; y: number } {
  return {
    x: (col - row) * (TILE_W / 2),
    y: (col + row) * (TILE_H / 2),
  };
}

/** Convert world position to tile (col, row). Returns undefined if outside grid or between tiles. */
export function worldToTile(wx: number, wy: number): { col: number; row: number } | undefined {
  const col = Math.round((wx / (TILE_W / 2) + wy / (TILE_H / 2)) / 2);
  const row = Math.round((wy / (TILE_H / 2) - wx / (TILE_W / 2)) / 2);

  if (col < 0 || col >= GRID_COLS || row < 0 || row >= GRID_ROWS) {
    return undefined;
  }

  // Diamond boundary check — reject the bounding-rect corners
  const centre = tileToWorld(col, row);
  const dx = Math.abs(wx - centre.x) / (TILE_W / 2);
  const dy = Math.abs(wy - centre.y) / (TILE_H / 2);
  if (dx + dy > 1) return undefined;

  return { col, row };
}

// ---------------------------------------------------------------------------
// Geometry helpers
// ---------------------------------------------------------------------------

/** Returns the 4 corner points of an isometric diamond centred at (cx, cy). */
export function diamondPoints(cx: number, cy: number): PhaserMath.Vector2[] {
  const hw = TILE_W / 2;
  const hh = TILE_H / 2;
  return [
    new PhaserMath.Vector2(cx,      cy - hh), // top
    new PhaserMath.Vector2(cx + hw, cy      ), // right
    new PhaserMath.Vector2(cx,      cy + hh), // bottom
    new PhaserMath.Vector2(cx - hw, cy      ), // left
  ];
}

// ---------------------------------------------------------------------------
// Misc
// ---------------------------------------------------------------------------

/** Canonical string key for a tile position. */
export function tileKey(col: number, row: number): string {
  return `${col},${row}`;
}
