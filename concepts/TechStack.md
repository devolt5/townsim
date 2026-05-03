
# Tech-Stack & Entwicklungsbereiche

## Bereich 1 — React + TypeScript + Vite

Fokus auf Spielmechanik und Lerneffekt. Keine aufwändige Grafik.

| Technologie | Zweck |
|---|---|
| **React 19** | UI-Komponenten, Dialoge, HUD, Tabellen |
| **TypeScript** | Typsicherheit, wartbarer Spielzustand |
| **Vite** | Build-Tool, Hot-Reloading, optimiertes Client-Bundle |
| **Zustand** | Game-State-Management |
| **TailwindCSS** | Schnelles Styling ohne Design-Overhead |

Spielfläche in Bereich 1: Einfache Kartenvisualisierung (SVG oder statisches Bild) + Tabellen + Entscheidungskarten als UI-Overlays.

### Bereich 2 — Visualisierung (Phaser 4)

Sobald Spielmechanik stabil und getestet ist.

| Technologie | Zweck |
|---|---|
| **Phaser 4** | 2D-Rendering, Animationen, Tilemap-Engine |
| **React (weiterhin)** | HUD, Menüs, Dialoge (außerhalb des Canvas) |
| **WebGL / Canvas-Fallback** | Performance-sichere Darstellung |
| **D3.js oder ähnliches** | Diagramme usw. |

Phaser 4 läuft framework-agnostisch — React und Phaser teilen sich die Seite: Phaser übernimmt die Spielwelt-Canvas, React die UI-Ebene darüber.

---
