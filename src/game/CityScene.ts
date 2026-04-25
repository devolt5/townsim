import { Scene, GameObjects, Geom } from 'phaser';
import { type District, DISTRICTS } from '@/data/gameData';

// ── Geometry helpers ──────────────────────────────────────────────────────────
function centroid(pts: { x: number; y: number }[]): { x: number; y: number } {
  const n = pts.length;
  return {
    x: pts.reduce((s, p) => s + p.x, 0) / n,
    y: pts.reduce((s, p) => s + p.y, 0) / n,
  };
}

function bboxOf(pts: { x: number; y: number }[]) {
  const xs = pts.map(p => p.x);
  const ys = pts.map(p => p.y);
  return {
    minX: Math.min(...xs), maxX: Math.max(...xs),
    minY: Math.min(...ys), maxY: Math.max(...ys),
  };
}

/** Trace a closed polygon path on a Graphics object. */
function polyPath(
  g: { beginPath(): void; moveTo(x: number, y: number): void; lineTo(x: number, y: number): void; closePath(): void },
  pts: { x: number; y: number }[],
) {
  g.beginPath();
  g.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) g.lineTo(pts[i].x, pts[i].y);
  g.closePath();
}

export type { District };
export { DISTRICTS };

// Minimal structural type for the Phaser pointer — avoids a namespace import
type PhaserPointer = { x: number; y: number; leftButtonDown(): boolean };

export class CityScene extends Scene {
  private selectCallback: ((district: District | null) => void) | null = null;
  private selectedName: string | null = null;
  private baseGraphics!: GameObjects.Graphics;
  private highlightGraphics!: GameObjects.Graphics;

  // ── Panning state ─────────────────────────────────────────────────
  private isDragging = false;          // true once drag threshold exceeded
  private panStartX = 0;
  private panStartY = 0;
  private panStartScrollX = 0;
  private panStartScrollY = 0;
  private static readonly DRAG_THRESHOLD = 4; // px

  // ── Zoom limits ───────────────────────────────────────────────────
  private static readonly MIN_ZOOM = 0.5;
  private static readonly MAX_ZOOM = 4.0;
  private static readonly ZOOM_STEP = 0.12; // per wheel tick

  constructor() {
    super({ key: 'CityScene' });
  }

  setSelectCallback(cb: (district: District | null) => void) {
    this.selectCallback = cb;
  }

  create() {
    this.baseGraphics = this.add.graphics();
    this.drawBase();

    this.highlightGraphics = this.add.graphics();

    this.setupCameraControls();

    DISTRICTS.forEach(d => {
      // Build a bounding box so the zone rectangle covers the polygon
      const box  = bboxOf(d.points);
      const cx   = (box.minX + box.maxX) / 2;
      const cy   = (box.minY + box.maxY) / 2;
      const bw   = box.maxX - box.minX;
      const bh   = box.maxY - box.minY;

      // Local polygon (coordinates relative to zone center)
      const localPoly = new Geom.Polygon(
        d.points.flatMap(p => [p.x - cx, p.y - cy]),
      );

      const zone = this.add
        .zone(cx, cy, bw, bh)
        .setInteractive(localPoly, Geom.Polygon.Contains);
      zone.input!.cursor = 'pointer';

      // Label at visual centroid
      const c = centroid(d.points);
      this.add
        .text(c.x, c.y, d.name, {
          fontSize: '11px',
          color: '#1a1a1a',
          fontStyle: 'bold',
          wordWrap: { width: bw - 12 },
          align: 'center',
          stroke: '#ffffff',
          strokeThickness: 3,
        })
        .setOrigin(0.5);

      zone.on('pointerover', () => {
        if (this.selectedName !== d.name) {
          this.highlightGraphics.clear();
          this.highlightGraphics.lineStyle(3, 0xffffff, 0.8);
          polyPath(this.highlightGraphics, d.points);
          this.highlightGraphics.strokePath();
          if (this.selectedName) {
            const sel = DISTRICTS.find(x => x.name === this.selectedName);
            if (sel) this.drawSelectedHighlight(sel);
          }
        }
      });

      zone.on('pointerout', () => {
        if (this.selectedName !== d.name) {
          this.highlightGraphics.clear();
          if (this.selectedName) {
            const sel = DISTRICTS.find(x => x.name === this.selectedName);
            if (sel) this.drawSelectedHighlight(sel);
          }
        }
      });

      // Selection fires on pointerup so a drag doesn't accidentally select
      zone.on('pointerup', () => {
        if (this.isDragging) return;
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

  private setupCameraControls() {
    const cam = this.cameras.main;

    // ── Zoom toward cursor on mouse wheel ────────────────────────────
    this.input.on(
      'wheel',
      (_p: unknown, _objs: unknown, _dx: number, deltaY: number) => {
        const factor = deltaY < 0
          ? 1 + CityScene.ZOOM_STEP
          : 1 - CityScene.ZOOM_STEP;
        const newZoom = Math.max(
          CityScene.MIN_ZOOM,
          Math.min(CityScene.MAX_ZOOM, cam.zoom * factor),
        );

        // Keep the world point under the cursor stationary
        const ptr = this.input.activePointer;
        const worldX = cam.scrollX + ptr.x / cam.zoom;
        const worldY = cam.scrollY + ptr.y / cam.zoom;
        cam.setZoom(newZoom);
        cam.scrollX = worldX - ptr.x / newZoom;
        cam.scrollY = worldY - ptr.y / newZoom;
      },
    );

    // ── Pan on left-mouse drag (with threshold to preserve click-to-select) ──
    this.input.on('pointerdown', (p: PhaserPointer) => {
      if (!p.leftButtonDown()) return;
      this.isDragging = false;
      this.panStartX = p.x;
      this.panStartY = p.y;
      this.panStartScrollX = cam.scrollX;
      this.panStartScrollY = cam.scrollY;
    });

    this.input.on('pointermove', (p: PhaserPointer) => {
      if (!p.leftButtonDown()) return;
      const dx = p.x - this.panStartX;
      const dy = p.y - this.panStartY;
      if (!this.isDragging) {
        if (Math.sqrt(dx * dx + dy * dy) < CityScene.DRAG_THRESHOLD) return;
        this.isDragging = true;
        this.input.setDefaultCursor('grabbing');
      }
      cam.scrollX = this.panStartScrollX - dx / cam.zoom;
      cam.scrollY = this.panStartScrollY - dy / cam.zoom;
    });

    this.input.on('pointerup', (p: PhaserPointer) => {
      if (this.isDragging) {
        this.isDragging = false;
        this.input.setDefaultCursor('default');
      }
      // suppress unused-param warning
      void p;
    });
  }

  private drawBase() {
    const g = this.baseGraphics;

    DISTRICTS.forEach(d => {
      g.fillStyle(d.color, 1);
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
