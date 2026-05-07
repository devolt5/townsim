import { Scene, GameObjects, Geom } from "phaser";
import { type District, DISTRICTS } from "@/data/districtPolygons";

// ── Geometry helpers ──────────────────────────────────────────────────────────
function centroid(pts: { x: number; y: number }[]): { x: number; y: number } {
  const n = pts.length;
  return {
    x: pts.reduce((s, p) => s + p.x, 0) / n,
    y: pts.reduce((s, p) => s + p.y, 0) / n,
  };
}

function bboxOf(pts: { x: number; y: number }[]) {
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  };
}

/** Trace a closed polygon path on a Graphics object. */
function polyPath(
  g: {
    beginPath(): void;
    moveTo(x: number, y: number): void;
    lineTo(x: number, y: number): void;
    closePath(): void;
  },
  pts: { x: number; y: number }[],
) {
  g.beginPath();
  g.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) g.lineTo(pts[i].x, pts[i].y);
  g.closePath();
}

export type { District };
export { DISTRICTS };

export class CityScene extends Scene {
  private selectCallback: ((district: District | null) => void) | null = null;
  private selectedName: string | null = null;
  private baseGraphics!: GameObjects.Graphics;
  private highlightGraphics!: GameObjects.Graphics;

  constructor() {
    super({ key: "CityScene" });
  }

  setSelectCallback(cb: (district: District | null) => void) {
    this.selectCallback = cb;
  }

  preload() {
    const base = import.meta.env.BASE_URL.replace(/\/$/, "");
    this.load.image("background", `${base}/images/background.png`);
  }

  create() {
    // ── Tiled background: 9×9 grid centered on the districts' bounding box ──
    const allPts = DISTRICTS.flatMap((d) => d.points);
    const allBox = bboxOf(allPts);
    const mapCX = (allBox.minX + allBox.maxX) / 2;
    const mapCY = (allBox.minY + allBox.maxY) / 2;

    const src = this.textures
      .get("background")
      .getSourceImage() as HTMLImageElement;
    const tileW = src.naturalWidth || src.width;
    const tileH = src.naturalHeight || src.height;
    const totalW = tileW * 9;
    const totalH = tileH * 9;
    this.add
      .tileSprite(
        mapCX - totalW / 2,
        mapCY - totalH / 2,
        totalW,
        totalH,
        "background",
      )
      .setOrigin(0, 0)
      .setDepth(-1);

    // ── Center camera on world origin ─────────────────────────────────
    this.cameras.main.centerOn(0, 0);
    this.baseGraphics = this.add.graphics();
    this.drawBase();

    this.highlightGraphics = this.add.graphics();

    DISTRICTS.forEach((d) => {
      // Build a bounding box so the zone rectangle covers the polygon
      const box = bboxOf(d.points);
      const cx = (box.minX + box.maxX) / 2;
      const cy = (box.minY + box.maxY) / 2;
      const bw = box.maxX - box.minX;
      const bh = box.maxY - box.minY;

      // Local polygon (coordinates relative to zone top-left, i.e. local origin)
      // Phaser's hit-test converts world→local as: lx = wx - x + displayOriginX
      // where displayOriginX = bw * 0.5 for origin=0.5, so local(0,0) = world(minX,minY).
      const localPoly = new Geom.Polygon(
        d.points.flatMap((p) => [p.x - box.minX, p.y - box.minY]),
      );

      const zone = this.add
        .zone(cx, cy, bw, bh)
        .setInteractive(localPoly, Geom.Polygon.Contains);
      zone.input!.cursor = "pointer";

      // Label at visual centroid
      const c = centroid(d.points);
      this.add
        .text(c.x, c.y, d.name, {
          fontSize: "11px",
          color: "#1a1a1a",
          fontStyle: "bold",
          wordWrap: { width: bw - 12 },
          align: "center",
          stroke: "#ffffff",
          strokeThickness: 3,
        })
        .setOrigin(0.5);

      zone.on("pointerover", () => {
        if (this.selectedName !== d.name) {
          this.highlightGraphics.clear();
          this.highlightGraphics.lineStyle(3, 0xffffff, 0.8);
          polyPath(this.highlightGraphics, d.points);
          this.highlightGraphics.strokePath();
          if (this.selectedName) {
            const sel = DISTRICTS.find((x) => x.name === this.selectedName);
            if (sel) this.drawSelectedHighlight(sel);
          }
        }
      });

      zone.on("pointerout", () => {
        if (this.selectedName !== d.name) {
          this.highlightGraphics.clear();
          if (this.selectedName) {
            const sel = DISTRICTS.find((x) => x.name === this.selectedName);
            if (sel) this.drawSelectedHighlight(sel);
          }
        }
      });

      // Selection fires on pointerup so a drag doesn't accidentally select
      zone.on("pointerup", () => {
        if (this.selectedName === d.name) {
          this.selectedName = null;
          this.highlightGraphics.clear();
          this.selectCallback?.(null);
        } else {
          this.selectedName = d.name;
          this.highlightGraphics.clear();
          this.drawSelectedHighlight(d);
          this.selectCallback?.(d);
        }
      });
    });
  }

  private drawBase() {
    const g = this.baseGraphics;

    DISTRICTS.forEach((d) => {
      g.fillStyle(d.color, 0.5);
      polyPath(g, d.points);
      g.fillPath();
      g.lineStyle(2, 0x3a3028, 0.6);
      polyPath(g, d.points);
      g.strokePath();
    });
  }

  private drawSelectedHighlight(d: District) {
    const g = this.highlightGraphics;
    // Outer dark halo
    g.lineStyle(5, 0x000000, 0.4);
    polyPath(g, d.points);
    g.strokePath();
    // Inner bright ring
    g.lineStyle(3, 0xffffff, 1);
    polyPath(g, d.points);
    g.strokePath();
  }
}
