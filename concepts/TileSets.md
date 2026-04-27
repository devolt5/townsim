# TileSets – Konzept

## Tile-Typen

### Boden-Tiles (1 Tile = 1 Sprite)

Boden, Wege, Wiesen, Wasser – jedes Tile hat ein eigenes Sprite, das exakt in die Rautenform passt.
Nebeneinander ergeben sie optisch eine zusammenhängende Fläche.

```
[wiese][wiese][wiese]  →  drei eigenständige Sprites, optisch eine Wiese
```

Nahtlose Übergänge (Autotiling mit `park_edge_left`, `park_corner` etc.) sind **nicht** geplant.

### Gebäude-Tiles (N Tiles, 1 Sprite)

Gebäude belegen einen rechteckigen Bereich von N×M Tiles, werden aber als **ein einziges Sprite** gerendert.

- **Anker-Tile**: das Tile mit dem niedrigsten `col`-Index der untersten Reihe – hier wird das Sprite platziert (`origin: 0.5, 1.0`).
- **Besetzte Tiles**: alle anderen Tiles der Footprint-Fläche – kein Sprite, nur Sperrvermerk in der tileMap.

### Matrix-Kodierung

```ts
// Positive ID   = Anker-Tile (Sprite wird hier gerendert)
// 'occ'         = belegt durch ein benachbartes Gebäude (kein Sprite)
// 0             = leer
// Negative ID   = bebaubare Fläche (Bürgermeister kann hier bauen)

const CITY_MAP: (number | 'occ')[][] = [
  [0,    0,    1,    1,    2  ],
  [0,  101,  'occ', 1,    2  ],
  [0, 'occ','occ',  1,    2  ],
];
```

### TileDef-Struktur

```ts
type TileDef = {
  textureKey: string;             // Sprite-Asset-Key
  buildingId?: string;            // Verknüpfung zu Spiellogik (für Dialoge)
  placeable: boolean;             // Kann der Bürgermeister hier bauen?
  footprint?: [number, number];   // Breite × Höhe in Tiles (default: 1×1)
};
```

## Depth Sorting

Sprites werden nach `depth = anchorCol + anchorRow` sortiert, damit weiter hinten liegende
Gebäude korrekt von vorderen überdeckt werden.

## Sprite-Ankerpunkt

Alle Gebäude-Sprites haben `origin(0.5, 1.0)` – Mitte-unten – damit der Fuß des Sprites
exakt auf dem Anker-Tile sitzt.

## Grid-Konfiguration

- Tile-Breite: 64 px (Raute)
- Tile-Höhe:  32 px (Raute, 2:1-Verhältnis)
- Grid-Größe: 48 × 48 Tiles
