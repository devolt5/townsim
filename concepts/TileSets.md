# TileSets – Konzept

## Tile-Typen

### Boden-Tiles (Ground Layer)

Boden, Wege, Wiesen, Wasser – jedes Tile hat ein eigenes Sprite, das exakt in die Rautenform passt.
Nebeneinander ergeben sie optisch eine zusammenhängende Fläche.

```
[wiese][wiese][wiese]  →  drei eigenständige Sprites, optisch eine Wiese
```

Nahtlose Übergänge (Autotiling mit `park_edge_left`, `park_corner` etc.) sind **nicht** geplant.

Boden-Tiles und Gebäude-Tiles sind **zwei getrennte Layer**:

- `groundMap` — enthält Boden-Texturen (Straßen, Wasser etc.)
- `map` — enthält Gebäude-Instanzen

Ein Tile kann gleichzeitig einen Bodeneintrag und einen Gebäudeeintrag haben.

### Gebäude-Tiles (Building Layer)

Gebäude belegen einen rechteckigen Bereich von N×M Tiles, werden aber als **ein einziges Sprite** gerendert.

- **Anker-Tile**: obere-linke Ecke des Footprints – hier wird das Sprite platziert (`origin: 0.5, 1.0`, versetzt auf den unteren Rauten-Mittelpunkt des Footprints).
- **Besetzte Tiles**: alle anderen Tiles der Footprint-Fläche – kein Sprite, nur Sperrvermerk in der tileMap.

### Matrix-Kodierung

```ts
// map (Building Layer):
//   0      = leer
//  "occ"   = belegt durch ein benachbartes Gebäude (kein Sprite)
//  string  = Instanz-ID des Anker-Tiles (z.B. "building1_D3")

// groundMap (Ground Layer):
//   null        = Standard-Gras (wird mit Graphics gezeichnet)
//   "street"    = Straßentextur, keine Spiegelung
//   "street:h"  = horizontal gespiegelt (links ↔ rechts)
//   "street:v"  = vertikal gespiegelt (oben ↔ unten)
//   "street:hv" = beide Achsen gespiegelt
```

### Instanz-IDs

Jede Gebäude-Instanz hat eine eindeutige ID aus `<defKey>_<ExcelAdresse>`, z.B. `building1_D3`.
Damit kann später im Spiel eine ganz konkrete Zelle angesprochen werden, um das Gebäude zu ersetzen.

### Typ-Definitionen

```ts
interface BuildingDef {
  id: string;
  textureKey: string;
  footprint?: [number, number];   // Breite × Höhe in Tiles (default: 1×1)
  assetUrl?: string;
}

interface GroundTileDef {
  textureKey: string;
  assetUrl?: string;
}
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

---

## Workflow: Neuen Distrikt erstellen

### 1. Assets ablegen

Gebäude-Sprites kommen in den passenden Unterordner:

```
src/images/buildings/
  1x1/   ← z.B. street1.png
  4x4/   ← z.B. building1.png
```

### 2. Config-Datei anlegen

Für jeden Distrikt gibt es eine JSON-Config unter `scripts/<name>.config.json`:

```json
{
  "id": "north",
  "name": "Nördlicher Distrikt",
  "citySceneName": "Wohngebiet Nord",
  "buildings": {
    "building1": {
      "footprint": [4, 4],
      "assetPath": "src/images/buildings/4x4/building1.png"
    }
  },
  "grounds": {
    "street": {
      "assetPath": "src/images/buildings/1x1/street1.png"
    }
  }
}
```

- `buildings`: alle Gebäudetypen, die im Distrikt vorkommen können, mit Footprint und Asset-Pfad.
- `grounds`: alle Boden-Texturtypen (Straßen, Wasser etc.) mit Asset-Pfad.

### 3. CSV erstellen

Die CSV-Datei liegt unter `src/data/disctricts/<name>.csv`.

**Format:**

- Zeile 1: Header `,A,B,C,...,AV` (48 Spalten, Excel-Stil)
- Zeilen 2–49: Zeilennummer + 48 Zellwerte

**Mögliche Zellwerte:**

| Wert | Bedeutung |
|---|---|
| *(leer)* | Standard-Gras, kein Gebäude |
| `occ` | Vom Footprint eines benachbarten Gebäudes belegt |
| `building1` | Anker-Tile eines 4×4-Gebäudes (Typ `building1`) |
| `building1:h` | Anker-Tile, horizontal gespiegelt |
| `building1:v` | Anker-Tile, vertikal gespiegelt |
| `building1:hv` | Anker-Tile, beide Achsen gespiegelt |
| `street` | Straßen-Bodentextur |
| `street:h` | Straße, horizontal gespiegelt |
| `street:v` | Straße, vertikal gespiegelt |

**Beispiel (Ausschnitt):**

```
,A,B,C,D,E,F,G,H,I,...
1,,,,,,,,, ,...
2,,building1,occ,occ,occ,,,,street,...
3,,occ,occ,occ,occ,,,,street,...
4,,occ,occ,occ,occ,,,,street,...
5,,occ,occ,occ,occ,,,,street,...
```

> **Wichtig bei Gebäuden:** Für ein 4×4-Gebäude mit Anker in `B2` müssen die restlichen 15 Zellen (`C2–E2`, `B3–E5`) manuell mit `occ` gefüllt werden. Das Skript prüft nicht auf Konsistenz.

### 4. TypeScript generieren

```bash
pnpm district:gen north
```

Das Skript liest `scripts/north.config.json` und `src/data/disctricts/north.csv` und schreibt `src/data/disctricts/north.ts`. Diese Datei **nicht manuell bearbeiten** – sie wird beim nächsten Aufruf überschrieben.

---

## Laufzeit: Gebäude im Spiel ersetzen

Wenn ein Ratsbeschluss ein Gebäude verwandeln soll (z.B. Acker → Schwimmbad):

### Schritt 1 – Store aktualisieren

```ts
import { useGameStore } from "@/store/gameStore";

useGameStore.getState().replaceDistrictBuilding(
  "north",        // Distrikt-ID
  "building1_D3", // Instanz-ID (defKey + Anker-Zelladresse)
  "swimming_pool" // neuer BuildingDef-Key
);
```

Die Änderung wird in `districtOverrides` persistiert und überlebt Reloads.

### Schritt 2 – Scene aktualisieren (optional, sofort sichtbar)

Wenn die `DistrictScene` gerade aktiv ist, kann das Sprite direkt getauscht werden:

```ts
// Zugriff auf die laufende Scene
const scene = game.scene.getScene("DistrictScene") as DistrictScene;
scene.replaceBuilding("building1_D3", "swimming_pool");
```

> **Hinweis:** Der neue BuildingDef-Key muss in `buildingDefs` des Distrikts vorhanden sein (d.h. in der Config und im generierten TypeScript definiert), damit das Asset beim `preload()` geladen wird.

### Instanz-IDs nachschlagen

Die Instanz-ID setzt sich zusammen aus `<defKey>_<Anker-Zelladresse>` (Excel-Stil).  
Beispiele:

| Anker im CSV | defKey | Instanz-ID |
|---|---|---|
| Spalte D, Zeile 3 | `building1` | `building1_D3` |
| Spalte AV, Zeile 48 | `factory` | `factory_AV48` |
