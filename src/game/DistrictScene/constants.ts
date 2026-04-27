/** Width of one isometric tile diamond in pixels. */
export const TILE_W = 64;

/** Height of one isometric tile diamond in pixels (2:1 ratio). */
export const TILE_H = 32;

/** Total columns in the grid. */
export const GRID_COLS = 48;

/** Total rows in the grid. */
export const GRID_ROWS = 48;

/** Numeric tile IDs used in CITY_MAP. */
export const TILE_IDS = {
  EMPTY: 0,
  PLACEABLE: -1,
} as const;
