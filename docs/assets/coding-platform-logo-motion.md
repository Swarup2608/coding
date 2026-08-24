# Coding Platform Logo — Motion Specification

- **Canonical SVG**: `docs/assets/coding-platform-logo.svg`
- **Named layers**: `#bracket-left`, `#bracket-right` (static), `#checkmark` (scale-pulses), `#cursor` (opacity-blinks)
- **Canvas / viewBox**: `0 0 240 240`, intended display size 96–160px square in the README header
- **Total duration**: 2.0s, seamless loop (frame 0 state == wrap-around state)
- **Frame rate**: 15 fps, **frame count**: 30 (`t = frameIndex / fps`, `phase = t / 2.0`)
- **Transparency**: required; no background rectangle
- **Reduced-motion state**: identical to the canonical SVG (`#checkmark` at `scale(1)`, `#cursor` at `fill-opacity: 1`) — this is frame 0 exactly, so any static rendering of the canonical file is already the correct reduced-motion fallback.
- **Export formats**: static PNG (frame 0, i.e. the canonical SVG rasterized) and animated GIF (all 30 frames). Capability status: raster export tooling (`rsvg-convert`, `ffmpeg`) is not installed in this environment and the user declined installation, so PNG/GIF are **not yet produced**. The SVG, this specification, and the checked recipe are the delivered artifacts.
- **Animation recipe**: `docs/assets/coding-platform-logo-animation.mjs` implements both keyframe tracks below inside `renderFrame`, by recomputing `#checkmark`'s `transform` attribute and `#cursor`'s `fill-opacity` attribute per frame from the formulas in this document; `#bracket-left` and `#bracket-right` are copied through unchanged (no motion).

## Keyframe tracks

### `#checkmark` — transform (scale pulse about its own center `(121, 135)`)

```
scale(phase) = 1 + 0.05 * (0.5 - 0.5 * cos(2*pi*phase))
transform = translate(121,135) scale(scale(phase)) translate(-121,-135)
```

| phase | time  | scale | easing                              |
|-------|-------|-------|--------------------------------------|
| 0.00  | 0.00s | 1.000 | start (== canonical SVG, no scale)   |
| 0.25  | 0.50s | 1.025 | cosine ease (smooth, no linear snap) |
| 0.50  | 1.00s | 1.050 | peak pulse                           |
| 0.75  | 1.50s | 1.025 | cosine ease back down                |
| 1.00  | 2.00s | 1.000 | returns to start — exact loop point  |

### `#cursor` — fill-opacity (blink)

```
opacity(phase) = 0.12 + 0.88 * (0.5 + 0.5 * cos(2*pi*phase))
```

| phase | time  | opacity | note                                    |
|-------|-------|---------|-------------------------------------------|
| 0.00  | 0.00s | 1.00    | start (== canonical SVG, fully visible)   |
| 0.25  | 0.50s | 0.56    | dimming                                   |
| 0.50  | 1.00s | 0.12    | dimmest point, coincides with checkmark peak pulse |
| 0.75  | 1.50s | 0.56    | brightening                                |
| 1.00  | 2.00s | 1.00    | returns to start — exact loop point       |

Both tracks share the same `2*pi*phase` cosine so the "judged" pulse (checkmark growing) and the "typing" cursor (dimming) read as one coordinated beat rather than two independent motions, and both mathematically return to their frame-0 value at `phase = 1`, giving a seamless GIF loop with no visible seam.

## Validation checklist

- [x] `#bracket-left`, `#bracket-right`, `#checkmark`, `#cursor` all exist in the validated canonical SVG.
- [x] Last rendered frame's implied state (`phase → 1`) equals the first frame's state (`phase = 0`) exactly, by construction of the cosine formulas above.
- [x] Reduced-motion state is the canonical SVG itself — same identity, same information, zero motion.
- [ ] Visual loop check on light/dark/checkerboard backgrounds — pending raster export (blocked on missing local tooling, see recipe/export status).
- [x] Recipe passes `export-readme-logo-animation.mjs --check` (structural + frame validation, no raster tools required).
