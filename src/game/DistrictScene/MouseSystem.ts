/**
 * MouseSystem — camera pan + zoom, plus a drag-guard so clicks still fire.
 *
 * Usage:
 *   const mouse = new MouseSystem(this.cameras.main, this.input);
 *   mouse.register();
 *   // In pointerdown/pointerup handlers: guard with mouse.isDragging
 */
export class MouseSystem {
  private dragging = false;
  private panStartX = 0;
  private panStartY = 0;
  private panStartScrollX = 0;
  private panStartScrollY = 0;

  private static readonly DRAG_THRESHOLD = 4; // px — below this = click, not pan
  private static readonly MIN_ZOOM = 0.5;
  private static readonly MAX_ZOOM = 4.0;
  private static readonly ZOOM_STEP = 0.12;

  constructor(
    private readonly camera: Phaser.Cameras.Scene2D.Camera,
    private readonly input: Phaser.Input.InputPlugin,
  ) {}

  /** Attach all input listeners. Call once in Scene.create(). */
  register(): void {
    this.input.on("wheel", this.onWheel, this);
    this.input.on("pointerdown", this.onPointerDown, this);
    this.input.on("pointermove", this.onPointerMove, this);
    this.input.on("pointerup", this.onPointerUp, this);
  }

  /** Remove all listeners. Call in Scene.shutdown() / destroy() if needed. */
  unregister(): void {
    this.input.off("wheel", this.onWheel, this);
    this.input.off("pointerdown", this.onPointerDown, this);
    this.input.off("pointermove", this.onPointerMove, this);
    this.input.off("pointerup", this.onPointerUp, this);
  }

  /**
   * Returns true while the pointer has moved beyond the drag threshold.
   * Use this guard in pointerup/pointerdown handlers to suppress click-actions
   * during a pan gesture.
   */
  get isDragging(): boolean {
    return this.dragging;
  }

  // -------------------------------------------------------------------------
  // Private handlers
  // -------------------------------------------------------------------------

  private onWheel(
    _p: unknown,
    _objs: unknown,
    _dx: number,
    deltaY: number,
  ): void {
    const cam = this.camera;
    const factor =
      deltaY < 0
        ? 1 + MouseSystem.ZOOM_STEP
        : 1 - MouseSystem.ZOOM_STEP;

    const newZoom = Math.max(
      MouseSystem.MIN_ZOOM,
      Math.min(MouseSystem.MAX_ZOOM, cam.zoom * factor),
    );

    // Keep the world point under the cursor stationary while zooming
    const ptr = this.input.activePointer;
    const worldX = cam.scrollX + ptr.x / cam.zoom;
    const worldY = cam.scrollY + ptr.y / cam.zoom;
    cam.setZoom(newZoom);
    cam.scrollX = worldX - ptr.x / newZoom;
    cam.scrollY = worldY - ptr.y / newZoom;
  }

  private onPointerDown(p: Phaser.Input.Pointer): void {
    if (!p.leftButtonDown()) return;
    this.dragging = false;
    this.panStartX = p.x;
    this.panStartY = p.y;
    this.panStartScrollX = this.camera.scrollX;
    this.panStartScrollY = this.camera.scrollY;
  }

  private onPointerMove(p: Phaser.Input.Pointer): void {
    if (!p.leftButtonDown()) return;
    const dx = p.x - this.panStartX;
    const dy = p.y - this.panStartY;

    if (!this.dragging) {
      if (Math.sqrt(dx * dx + dy * dy) < MouseSystem.DRAG_THRESHOLD) return;
      this.dragging = true;
      this.input.setDefaultCursor("grabbing");
    }

    this.camera.scrollX = this.panStartScrollX - dx / this.camera.zoom;
    this.camera.scrollY = this.panStartScrollY - dy / this.camera.zoom;
  }

  private onPointerUp(p: Phaser.Input.Pointer): void {
    void p;
    if (this.dragging) {
      this.dragging = false;
      this.input.setDefaultCursor("default");
    }
  }
}
