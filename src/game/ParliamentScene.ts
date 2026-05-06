import { Scene, GameObjects, Geom } from "phaser";
import { DELEGATES } from "@/data/delegates";
import type { Delegate } from "@/data/types/delegate";
import parliamentUrl from "@/images/parliament.jpg";
import delegate01Url from "@/images/delegate_01_female.jpg";
import delegate02Url from "@/images/delegate_02_male.jpg";
import delegate03Url from "@/images/delegate_03_male.jpg";
import delegate04Url from "@/images/delegate_04_female.jpg";
import delegate05Url from "@/images/delegate_05_male.jpg";

// ── Geometry ─────────────────────────────────────────────────────────────────

/**
 * Builds a closed polygon approximating an annular sector (ring slice).
 *
 * Angles are in radians, measured clockwise from the positive X-axis
 * (Phaser's Y-down convention). If endAngle <= startAngle the arc is assumed
 * to wrap around past 2π.
 *
 * @param cx          World X of the circle centre
 * @param cy          World Y of the circle centre
 * @param innerR      Inner radius (px)
 * @param outerR      Outer radius (px)
 * @param startAngle  Start angle (rad)
 * @param endAngle    End angle (rad), may be > 2π when wrapping
 * @param steps       Arc resolution (points per quarter circle arc segment)
 */
function annularSectorPolygon(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  startAngle: number,
  endAngle: number,
  steps = 6,
): { x: number; y: number }[] {
  // Normalise so endAngle > startAngle
  if (endAngle <= startAngle) endAngle += 2 * Math.PI;

  const span = endAngle - startAngle;
  const pts: { x: number; y: number }[] = [];

  // Outer arc – forward (startAngle → endAngle)
  for (let i = 0; i <= steps; i++) {
    const a = startAngle + (i / steps) * span;
    pts.push({ x: cx + Math.cos(a) * outerR, y: cy + Math.sin(a) * outerR });
  }

  // Inner arc – reverse (endAngle → startAngle)
  for (let i = steps; i >= 0; i--) {
    const a = startAngle + (i / steps) * span;
    pts.push({ x: cx + Math.cos(a) * innerR, y: cy + Math.sin(a) * innerR });
  }

  return pts;
}

// ── Seat layout ───────────────────────────────────────────────────────────────

/**
 * parliament.jpg is 1365 × 768 px.
 * Phaser places it with origin (0.5, 0.5) at world (0, 0).
 * The circular chamber centre appears at roughly image pixel (620, 380),
 * which translates to world coordinates:
 *   worldX = 620 − 1365/2 = −62.5 → −63
 *   worldY = 380 − 768/2  = −4
 *
 * Calibrate PARLIAMENT_CENTER and row radii using DEBUG_ZONES = true.
 */
const PARLIAMENT_CENTER = { x: 10, y: 50 };

/**
 * Each row describes one concentric ring of seats.
 * innerR / outerR are in world pixels (same scale as the image).
 * seatCount must match the corresponding entry in delegates.ts.
 */
const ROWS: {
  innerR: number;
  outerR: number;
  segmentCount: number;
}[] = [
  { innerR: 150, outerR: 230, segmentCount: 30 },
  { innerR: 230, outerR: 300, segmentCount: 30 },
  { innerR: 300, outerR: 380, segmentCount: 40 },
  { innerR: 380, outerR: 450, segmentCount: 40 },
  { innerR: 450, outerR: 530, segmentCount: 40 },
  { innerR: 530, outerR: 580, segmentCount: 40 },
];

/**
 * The seated arc spans 310°, leaving a ~50° gap at the bottom-left
 * (roughly 7 o'clock position) where the press gallery / entrance sits.
 *
 * Phaser degrees: 0° = right, 90° = down, increasing clockwise.
 */
const ARC_START_DEG = 20;
const ARC_SPAN_DEG = 360;
const ARC_END_DEG = ARC_START_DEG + ARC_SPAN_DEG; // may exceed 360 – normalised in the polygon builder

const ARC_START = (ARC_START_DEG * Math.PI) / 180;
const ARC_END = (ARC_END_DEG * Math.PI) / 180;

/**
 * Show coloured polygon outlines for every seat zone so you can visually
 * align them with the parliament.jpg background.
 */
const DEBUG_ZONES = false;

// ── Faction colours ───────────────────────────────────────────────────────────

const FACTION_COLORS: Record<string, number> = {
  Terra: 0x4caf50,
  Syndikat: 0x05599d,
  Bürger: 0xeb7800,
  "Union der Gilden": 0xca1819,
  "Der Bund": 0x191919,
};

// ── Phaser pointer minimal type ───────────────────────────────────────────────
type PhaserPointer = { x: number; y: number; leftButtonDown(): boolean };

// ── Scene ─────────────────────────────────────────────────────────────────────

export class ParliamentScene extends Scene {
  private selectCallback: ((delegate: Delegate | null) => void) | null = null;
  private highlightGraphics!: GameObjects.Graphics;
  private debugGraphics!: GameObjects.Graphics;
  private delegateOverlayGraphics!: GameObjects.Graphics;

  // Panning state (mirrors CityScene)
  private isDragging = false;
  private panStartX = 0;
  private panStartY = 0;
  private panStartScrollX = 0;
  private panStartScrollY = 0;
  private static readonly DRAG_THRESHOLD = 4;

  // Zoom limits
  private static readonly MIN_ZOOM = 0.4;
  private static readonly MAX_ZOOM = 4.0;
  private static readonly ZOOM_STEP = 0.12;

  constructor() {
    super({ key: "ParliamentScene" });
  }

  setSelectCallback(cb: (delegate: Delegate | null) => void) {
    this.selectCallback = cb;
  }

  preload() {
    this.load.image("parliament", parliamentUrl);
    // Preload all delegate avatars so they're available in the modal
    this.load.image("delegate_01", delegate01Url);
    this.load.image("delegate_02", delegate02Url);
    this.load.image("delegate_03", delegate03Url);
    this.load.image("delegate_04", delegate04Url);
    this.load.image("delegate_05", delegate05Url);
  }

  create() {
    // ── Background image ─────────────────────────────────────────────
    this.add.image(0, 0, "parliament").setDepth(-1);

    // Centre camera on the image
    this.cameras.main.centerOn(0, 0);

    this.highlightGraphics = this.add.graphics().setDepth(2);
    this.debugGraphics = this.add.graphics().setDepth(3);
    this.delegateOverlayGraphics = this.add.graphics().setDepth(1);

    this.createSeatZones();
    this.setupCameraControls();

    if (DEBUG_ZONES) {
      this.drawDebugOverlay();
    }
  }

  /** Called by React to toggle the faction colour overlay. */
  setFactionOverlay(visible: boolean) {
    if (visible) {
      this.drawDelegateOverlay();
    } else {
      this.delegateOverlayGraphics.clear();
    }
  }

  // ── Seat zone creation ───────────────────────────────────────────────────────

  private createSeatZones() {
    const { x: cx, y: cy } = PARLIAMENT_CENTER;

    for (let rowIndex = 0; rowIndex < ROWS.length; rowIndex++) {
      const { innerR, outerR, segmentCount } = ROWS[rowIndex];
      const sectorSpan = (ARC_END - ARC_START) / segmentCount;

      for (let segIndex = 0; segIndex < segmentCount; segIndex++) {
        const segmentId = `r${rowIndex}_s${segIndex}`;
        const delegate = DELEGATES[segmentId] ?? null;

        const sectorStart = ARC_START + segIndex * sectorSpan;
        const sectorEnd = sectorStart + sectorSpan;

        const pts = annularSectorPolygon(
          cx,
          cy,
          innerR,
          outerR,
          sectorStart,
          sectorEnd,
        );

        // Bounding box of this sector
        const xs = pts.map((p) => p.x);
        const ys = pts.map((p) => p.y);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);

        const bw = maxX - minX;
        const bh = maxY - minY;
        const boxCx = (minX + maxX) / 2;
        const boxCy = (minY + maxY) / 2;

        // Polygon in local coordinates (relative to zone origin = top-left of bounding box)
        const localPoly = new Geom.Polygon(
          pts.flatMap((p) => [p.x - minX, p.y - minY]),
        );

        const zone = this.add
          .zone(boxCx, boxCy, bw, bh)
          .setInteractive(localPoly, Geom.Polygon.Contains);
        zone.input!.cursor = "pointer";

        const factionColor =
          delegate != null
            ? (FACTION_COLORS[delegate.faction] ?? 0xffffff)
            : 0x888888;

        zone.on("pointerover", () => {
          if (!delegate) return;
          this.highlightGraphics.clear();
          this.highlightGraphics.fillStyle(factionColor, 0.35);
          this.highlightGraphics.lineStyle(2, 0xffffff, 0.9);
          this.fillPoly(this.highlightGraphics, pts);
          this.highlightGraphics.fillPath();
          this.strokePoly(this.highlightGraphics, pts);
          this.highlightGraphics.strokePath();
          this.input.setDefaultCursor("pointer");
        });

        zone.on("pointerout", () => {
          this.highlightGraphics.clear();
          this.input.setDefaultCursor("default");
        });

        zone.on("pointerup", () => {
          if (this.isDragging) return;
          if (delegate) this.selectCallback?.(delegate);
        });
      }
    }
  }

  // ── Delegate overlay ──────────────────────────────────────────────────────

  private drawDelegateOverlay() {
    const g = this.delegateOverlayGraphics;
    g.clear();
    const { x: cx, y: cy } = PARLIAMENT_CENTER;

    for (let rowIndex = 0; rowIndex < ROWS.length; rowIndex++) {
      const { innerR, outerR, segmentCount } = ROWS[rowIndex];
      const sectorSpan = (ARC_END - ARC_START) / segmentCount;

      for (let segIndex = 0; segIndex < segmentCount; segIndex++) {
        const segmentId = `r${rowIndex}_s${segIndex}`;
        const delegate = DELEGATES[segmentId] ?? null;
        if (!delegate) continue;

        const color = FACTION_COLORS[delegate.faction] ?? 0xcccccc;
        const sectorStart = ARC_START + segIndex * sectorSpan;
        const sectorEnd = sectorStart + sectorSpan;
        const pts = annularSectorPolygon(
          cx,
          cy,
          innerR,
          outerR,
          sectorStart,
          sectorEnd,
        );

        g.fillStyle(color, 0.55);
        g.lineStyle(1, color, 0.9);
        this.fillPoly(g, pts);
        g.fillPath();
        this.strokePoly(g, pts);
        g.strokePath();
      }
    }
  }

  // ── Graphics helpers ──────────────────────────────────────────────────────────

  private fillPoly(g: GameObjects.Graphics, pts: { x: number; y: number }[]) {
    g.beginPath();
    g.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) g.lineTo(pts[i].x, pts[i].y);
    g.closePath();
  }

  private strokePoly(g: GameObjects.Graphics, pts: { x: number; y: number }[]) {
    g.beginPath();
    g.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) g.lineTo(pts[i].x, pts[i].y);
    g.closePath();
  }

  // ── Debug overlay ─────────────────────────────────────────────────────────────

  private drawDebugOverlay() {
    const g = this.debugGraphics;
    const { x: cx, y: cy } = PARLIAMENT_CENTER;

    for (let rowIndex = 0; rowIndex < ROWS.length; rowIndex++) {
      const { innerR, outerR, segmentCount } = ROWS[rowIndex];
      const sectorSpan = (ARC_END - ARC_START) / segmentCount;
      const midR = (innerR + outerR) / 2;

      for (let segIndex = 0; segIndex < segmentCount; segIndex++) {
        const segmentId = `r${rowIndex}_s${segIndex}`;
        const delegate = DELEGATES[segmentId] ?? null;
        const color = delegate
          ? (FACTION_COLORS[delegate.faction] ?? 0xcccccc)
          : 0xaaaaaa;

        const sectorStart = ARC_START + segIndex * sectorSpan;
        const sectorEnd = sectorStart + sectorSpan;
        const pts = annularSectorPolygon(
          cx,
          cy,
          innerR,
          outerR,
          sectorStart,
          sectorEnd,
        );

        g.fillStyle(color, delegate ? 0.18 : 0.08);
        g.lineStyle(1.5, color, delegate ? 0.7 : 0.35);
        this.fillPoly(g, pts);
        g.fillPath();
        this.strokePoly(g, pts);
        g.strokePath();

        // Label: segment ID centred at the arc mid-point of this sector
        const midAngle = (sectorStart + sectorEnd) / 2;
        const labelX = cx + Math.cos(midAngle) * midR;
        const labelY = cy + Math.sin(midAngle) * midR;
        this.add
          .text(labelX, labelY, segmentId, {
            fontSize: "8px",
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 2,
          })
          .setOrigin(0.5)
          .setDepth(4);
      }
    }

    // Centre crosshair
    g.lineStyle(2, 0xff0000, 0.9);
    g.lineBetween(cx - 20, cy, cx + 20, cy);
    g.lineBetween(cx, cy - 20, cx, cy + 20);
  }

  // ── Camera controls (mirrors CityScene) ──────────────────────────────────────

  private setupCameraControls() {
    const cam = this.cameras.main;

    // Restrict panning to the parliament image area (+small padding)
    const imgW = 1365;
    const imgH = 768;
    const pad = 40;
    cam.setBounds(
      -imgW / 2 - pad,
      -imgH / 2 - pad,
      imgW + pad * 2,
      imgH + pad * 2,
    );

    // this.input.on(
    //   "wheel",
    //   (_p: unknown, _objs: unknown, _dx: number, deltaY: number) => {
    //     const factor =
    //       deltaY < 0
    //         ? 1 + ParliamentScene.ZOOM_STEP
    //         : 1 - ParliamentScene.ZOOM_STEP;
    //     const newZoom = Math.max(
    //       ParliamentScene.MIN_ZOOM,
    //       Math.min(ParliamentScene.MAX_ZOOM, cam.zoom * factor),
    //     );
    //     const ptr = this.input.activePointer;
    //     const worldX = cam.scrollX + ptr.x / cam.zoom;
    //     const worldY = cam.scrollY + ptr.y / cam.zoom;
    //     cam.setZoom(newZoom);
    //     cam.scrollX = worldX - ptr.x / newZoom;
    //     cam.scrollY = worldY - ptr.y / newZoom;
    //   },
    // );

    this.input.on("pointerdown", (p: PhaserPointer) => {
      if (!p.leftButtonDown()) return;
      this.isDragging = false;
      this.panStartX = p.x;
      this.panStartY = p.y;
      this.panStartScrollX = cam.scrollX;
      this.panStartScrollY = cam.scrollY;
    });

    this.input.on("pointermove", (p: PhaserPointer) => {
      if (!p.leftButtonDown()) return;
      const dx = p.x - this.panStartX;
      const dy = p.y - this.panStartY;
      if (!this.isDragging) {
        if (Math.sqrt(dx * dx + dy * dy) < ParliamentScene.DRAG_THRESHOLD)
          return;
        this.isDragging = true;
        this.input.setDefaultCursor("grabbing");
      }
      cam.scrollX = this.panStartScrollX - dx / cam.zoom;
      cam.scrollY = this.panStartScrollY - dy / cam.zoom;
    });

    this.input.on("pointerup", (p: PhaserPointer) => {
      if (this.isDragging) {
        this.isDragging = false;
        this.input.setDefaultCursor("default");
      }
      void p;
    });
  }
}
