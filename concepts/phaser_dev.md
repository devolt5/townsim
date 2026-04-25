# Notes for Phaser development

## Hit test of an interactive objet

Looking at the zone setup in `CityScene.ts`.

When Phaser hit-tests an interactive object, it converts world coordinates to **local** space using the object's transform matrix. For a zone with default origin `(0.5, 0.5)`, local `(0, 0)` is at the **top-left corner** of the zone, not the center. The formula Phaser uses is:

$$\text{localX} = w_x - x + \frac{bw}{2}, \quad \text{localY} = w_y - y + \frac{bh}{2}$$

But the current `localPoly` is built relative to the **bounding-box center** `(cx, cy)`:

```ts
d.points.flatMap(p => [p.x - cx, p.y - cy])  // centered at (0,0) — wrong
```

This causes the hit-area to be shifted by `(bw/2, bh/2)` relative to the drawn polygon. The polygon must be relative to the bounding-box **top-left** (`minX`, `minY`) instea.

The hit-area was consistently offset by half the bounding-box size `(bw/2, bh/2)` in both axes. Using `p.x - box.minX` / `p.y - box.minY` aligns the interactive polygon exactly with the drawn district shapes.
