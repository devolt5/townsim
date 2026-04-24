import { Scene, GameObjects } from 'phaser';
import { type District, DISTRICTS } from '@/data/gameData';

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
      const zone = this.add
        .zone(d.x + d.w / 2, d.y + d.h / 2, d.w, d.h)
        .setInteractive({ useHandCursor: true });

      this.add
        .text(d.x + d.w / 2, d.y + d.h / 2, d.name, {
          fontSize: '11px',
          color: '#1a1a1a',
          fontStyle: 'bold',
          wordWrap: { width: d.w - 12 },
          align: 'center',
          stroke: '#ffffff',
          strokeThickness: 3,
        })
        .setOrigin(0.5);

      zone.on('pointerover', () => {
        if (this.selectedName !== d.name) {
          this.highlightGraphics.clear();
          this.highlightGraphics.lineStyle(3, 0xffffff, 0.8);
          this.highlightGraphics.strokeRect(d.x + 2, d.y + 2, d.w - 4, d.h - 4);
          // Redraw selected highlight on top if one is already selected
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

    // Roads
    g.fillStyle(0xb0a898, 1);
    g.fillRect(140, 0, 15, 340);   // vertical road west
    g.fillRect(295, 0, 15, 340);   // vertical road east
    g.fillRect(0, 165, 460, 15);   // horizontal road

    // Road lines (dashed center)
    g.lineStyle(1, 0xd0c8be, 0.6);
    g.lineBetween(147, 0, 147, 165);
    g.lineBetween(147, 180, 147, 340);
    g.lineBetween(302, 0, 302, 165);
    g.lineBetween(302, 180, 302, 340);
    g.lineBetween(0, 172, 140, 172);
    g.lineBetween(155, 172, 295, 172);
    g.lineBetween(310, 172, 460, 172);

    // Districts
    DISTRICTS.forEach(d => {
      g.fillStyle(d.color, 1);
      g.fillRect(d.x, d.y, d.w, d.h);
      g.lineStyle(1, 0x4a4035, 0.5);
      g.strokeRect(d.x, d.y, d.w, d.h);
    });
  }

  private drawSelectedHighlight(d: District) {
    const g = this.highlightGraphics;
    g.lineStyle(3, 0x000000, 0.5);
    g.strokeRect(d.x + 3, d.y + 3, d.w - 6, d.h - 6);
    g.lineStyle(3, 0xffffff, 1);
    g.strokeRect(d.x + 1, d.y + 1, d.w - 2, d.h - 2);
  }
}
