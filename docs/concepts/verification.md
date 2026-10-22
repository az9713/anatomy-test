# Verification

Anatomy checks its own figures with four independent tools. Each one sees something the others cannot, so a figure must pass all that apply.

| Check | Tool | Sees | Blind to | Pass line |
|---|---|---|---|---|
| Geometry audit | `node build.mjs --audit` (`kit/audit.mjs`) | Recorded 3D shapes: clearances, mounts, supports, depth order, every frame of an explode | Line markup (seams, ticks, ribs) | `audit passed` |
| Line check | `scripts/lines.mjs` | Every texture line's ends on the built page | 3D shapes, depth | `line ends: 0` |
| Captures | `scripts/capture.mjs`, `scripts/drive.mjs` | Pixels: stills, close-ups, contact sheets | Nothing by itself — a reader must look | The agent reads every PNG |
| Orbit audit (3D only) | `build.mjs --audit` on a 3D figure, `scripts/turn-check.mjs` | Every turn angle and motion clip | — | `turn audit passed` (full run only) |

> **Warning:** All four prove the picture, not the facts. A zero audit says nothing about whether the metaphor is right.

## The geometry audit

The build records every shape it draws, in world units. `A.settle(R, P)` ray-casts every overlapping pair to find which is truly in front and sets the painter's keys. `A.auditOrExit(R, P)` runs every check when `--audit` is on the command line and exits non-zero on any failure.

What it measures (from `references/kit.md` section 12):

| Line in the report | Fault it catches |
|---|---|
| `clearance`, `clearance apart`, `through in mid-flight` | A pipe or cable passes through something, at rest, apart, or in any replayed frame |
| `terminals`, `loose ends` | A pipe end floats off its mount, or dangles when apart |
| `support` | A solid touches nothing that leads to the stand, or is sunk into another |
| `depth order`, `cycle` | Two items overlap on screen and the farther one is drawn on top |
| `screen folds`, `self-overlap` | A route doubles back or pinches to a V on screen |
| `crowding` | A bend or end lands on another line's outline and reads as a joint |
| `wobble` | A smoothed profile's slope turns, so its tone bands staircase |
| `stand-in shapes` | A recorded shape covers too little of the drawing, so other checks go blind |

Scale: on the Raptor (478 items, 1,119 depth states, about 4,400 replayed frames) a full `--audit` takes about three minutes per `references/kit.md`. The plain Raptor build (keys only, no `--audit`) took 4 min 37 s on this machine on 2026-10-21.

Rule: fix an interlock in the geometry, never with a key bias. A stand-in shape that silences the audit is a bug.

## The line check

The audit never sees line markup. `scripts/lines.mjs` loads the built page in headless Chrome and tests every open subpath of every `.iso-line` in the card. Each end must land within 1 viewBox px of another stroke, a dot or an outline, or under a later fill. A short mark up to 7 px needs one end rooted within 2 px.

Only three kinds of line may stop on a bare face, marked `free`: rule lines that stand for printed text, a needle's tail, a pointer's tip.

```bash
node scripts/lines.mjs examples/dial-indicator/dial-indicator-light.html --out shots/lines-light.png
```

```text
line ends: 0 of 367 ends on 23 lines float
```

Run it on both themes and in every resting pose (`drive.mjs` action `["lines", out]`).

## Captures and close-ups

`capture.mjs` takes one-shot stills: desktop (1440 wide, scale 2), phone (`--width 390`), hover, keys, timed shots, reduced motion, and 4× zooms (`--zoom x,y,w,h` in card px). It also prints the readout, console errors and whether the page scrolls sideways.

`drive.mjs` runs scripted sessions: move, click, drag, key, wait-until, eval, shots, and contact sheets. `["slow", 0.05]` runs the page at 20× slow motion so a sheet catches a 100 ms pop. `--no-webgl` checks the SVG fallback.

The close-up rule: list every junction (flange, tee, elbow, clamp, valve, band, crossing, curved body, texture end), shoot each at 4× in both themes, assembled and apart, and look for the faults listed in `references/verify.md` "Close-ups" step 4.

## The review checklist

`references/verify.md` ends with a checklist in eight groups: it is an object; parts and volume; lines; tone and colour; card and words; motion and access; shaders; composition. A figure is done when every box applies and is ticked.

---
Tracks: `anatomy-main/references/verify.md`, `anatomy-main/references/kit.md` section 12, `anatomy-main/kit/audit.mjs`, `anatomy-main/scripts/lines.mjs`.
