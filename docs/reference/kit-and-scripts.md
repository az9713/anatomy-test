# Kit and scripts reference

A map of every module and script, plus all script flags in one place. Full function signatures live upstream in `anatomy-main/references/kit.md` (939 lines, 15 sections); this page does not repeat them.

All paths are relative to `anatomy-main/`.

## Kit modules

| File | What it exports | Upstream reference |
|---|---|---|
| `kit/iso-kit.mjs` (674 lines) | The core as plain ESM for Node builds: camera (`fitProjection`, `iso`, `depthOf`, `towardViewer`), solids (`slabOf`, `cylinder`, `extrude`, `haloOf`…), lines on faces (`onTop`, `lineOnTop`, `planOutline`, `ring`…), parts (`knurl`, `sideArc`, `sideSeam`, `coil`, `topTicks`, `radialTicks`), motion (`translateAlong`, `holdStill`, `axisVector`), SVG strings (`solidSvg`, `lineSvg`, `dotsSvg`, `fadedSvg`, `fadeLineSvg`, `wireSvg`, `faceTextSvg`, `figureSvg`), card and page (`plateHtml`, `pageHtml`), `ISO_CSS` | `kit.md` §1–8 |
| `kit/iso-kit.ts` (842 lines) | The same core in TypeScript, to copy into a TS project | `kit.md` §1–8 |
| `kit/iso.css` | `ISO_CSS` as a file; put `class="iso"` (and `data-theme="light"`) on a wrapper | `kit.md` §8 |
| `kit/react/draw.tsx` | Server-safe components: `Solid`, `Line`, `Wire`, `Dots`, `FaceText`, `IsoFigure`, `Plate` | `kit.md` §9, `react.md` |
| `kit/react/live.tsx` | `"use client"` hooks: `useReadout`, `useLoop`, `useEased`, `useInView`, `useStillness`, plus `spring`, `follow` | `kit.md` §9, `motion.md` |
| `kit/lathe.mjs` (1,184 lines) | Round parts on any axis: frames (`frameAlong`, `frameOf`), `lathe`, `solidOf`, `bandsOf`, `disc`, `ringBand`, `sphereOf`, `saddleOf`, `prismOf`, `rodOut`; lines on round surfaces (`arcOf`, `ribsOf`, `dotsOf`); 3D paths (`fillet`, `resample`, `pointAlong`) | `kit.md` §10 |
| `kit/tube.mjs` (306 lines) | Pipes and cables: `tubePieces`, `tubeSvg`, `runsOf`, `crossingsOf`, `ringsSvg` | `kit.md` §11 |
| `kit/audit.mjs` (1,913 lines) | The geometry audit: `recorder`, `settle`, `audit`, `auditOrExit`, shape constructors, each check | `kit.md` §12, `verify.md` |
| `kit/gl.mjs` | WebGL layer: `GLSL_ISO`, `glCamera`, `glLayer`, `smooth`, `burst`, `settle`, `GLSL_TURN`, `glslPose` | `kit.md` §13, `webgl.md` |
| `kit/turn-build.mjs`, `kit/turn.mjs`, `kit/turn-audit.mjs` | 3D mode (beta): builder `turning(P, …)`, runtime `TURN`, orbit audit `orbitOrExit` | `kit.md` §15, `3d.md` |
| `kit/pdf-button.mjs` | `pdfButton(href)`: a "PDF" link on the card | `print.md` |
| `kit/turn-fixed.mjs`, `kit/canvas-painter.mjs`, `kit/gl-shared.mjs` | Experimental variants, "not yet documented or used by the examples" (README) | none |

Import style in a build script:

```js
import * as k from "../../kit/iso-kit.mjs";
import * as G from "../../kit/lathe.mjs";
import * as A from "../../kit/audit.mjs";
import { tubePieces, tubeSvg } from "../../kit/tube.mjs";
import { kitScript, glScript, turnScript } from "../../scripts/inline-kit.mjs";
```

## Scripts

All scripts run with `node scripts/<name>.mjs`. Browser scripts start their own headless Chrome with a throwaway profile and WebGL on (`--enable-unsafe-swiftshader --ignore-gpu-blocklist`).

### `capture.mjs` — one-shot screenshots

| Flag | Default | Meaning |
|---|---|---|
| `--out file.png` | — | Output path; directories are created |
| `--width` / `--height` | 1440 / 1000 | Viewport |
| `--scale` | 2 | Device pixel ratio |
| `--wait` | 2500 ms | Delay before the first shot |
| `--hover fx,fy` | — | Pointer at fractions across the card |
| `--times a,b,c` | — | Extra shots, ms after the first, saved as `name-<ms>.png` |
| `--key K1,K2` | — | Key presses; write a comma as `Comma` |
| `--zoom x,y,w,h` | — | Close-up region in card px |
| `--zoom-scale` | 4 | Close-up magnification |
| `--reduced` | off | Emulate reduced motion |
| `--theme dark\|light` | — | Emulates `prefers-color-scheme` only; kit pages ignore it — build `--light` instead |
| `--select css` | first `.iso-plate` | Element to clip to |

### `drive.mjs` — scripted sessions

Flags: `--width` (1440), `--height` (1100), `--scale` (1), `--reduced`, `--theme`, `--no-webgl`, `--preload file.js`, `--actions file.json`. Actions are a JSON array passed inline or by file.

| Action | Effect |
|---|---|
| `["wait", ms]`, `["scroll", sel]` | Wait; scroll an element to mid-viewport |
| `["move", sel, fx, fy]`, `["click", sel, fx?, fy?]`, `["drag", sel, fx0, fy0, fx1, fy1, steps?]` | Real pointer input |
| `["key", key, sel?, code?]` | Focus and press a key |
| `["slow", factor]` | Scale page time; `0.05` = 20× slow motion; timers stay real-time |
| `["until", js, timeoutMs?]` | Poll until truthy (default 10 s); timeout exits 1 |
| `["eval", js]` | Run JS in the page, print the result |
| `["shot", out, sel?, scale?, [x,y,w,h]?]` | Screenshot |
| `["sheet", out, every, count, sel?, scale?, [x,y,w,h]?, columns?]` | Contact sheet of `count` frames |
| `["lines", out?, sel?, {tolerance}?]` | Line check in the current pose |
| `["turn", value, group?]`, `["orbit", out, from, to, step, …]` | 3D figures only |

### `lines.mjs` — line-end check

Flags in source: `--out` (ringed PNG of failures), `--select`, `--tolerance`, `--wait`. Exits 1 on any floating end.

### `print.mjs` — printable sheets

```bash
node scripts/print.mjs examples/raptor-engine/sheet.mjs --format all --png
```

Flags: `--format poster|drawing|detailed|all` (default `poster`), `--letter` (US Letter instead of A4), `--png` (preview images), `--out`, `--reduced`, `--width`, `--height`, `--actions`. Writes `<out>-<format>-a4.pdf` next to the spec. Exits 1 when a format runs past its page count.

### `publish.mjs` — community gallery

Sends a framework-free figure to `wheresryan22/anatomy-community` as a pull request. Run with `--dry-run` first; `--yes` only after you agree.

Main flags: `--into <clone>`, `--id`, `--title`, `--author`, `--prompt`, `--agent`, `--model`, `--minutes`, `--tokens`, `--no-session`, `--license MIT|CC-BY-4.0`, `--tags`, `--audit`, `--pages`, `--submit`, `--force`.

### 3D tools

- `turn-check.mjs`: `build.mjs --fidelity`; `page.html --order` (needs a `--verify` build), `--pops`, `--lines`, `--perf`, `--states file.json`, `--part`, `--step`, `--throttle`, `--width`, `--no-webgl`, `--out`.
- `turn-bench.mjs`: CPU time per part kind in Node; flags `--rounds`, `--unit`.

### Helpers used by other scripts

`inline-kit.mjs` (`kitScript`, `glScript`, `turnScript`), `chrome-port.mjs`, `line-ends.mjs`, `print-sheet.mjs`, `turn-fidelity.mjs`, `fingerprint.mjs` (kit version for the gallery), `session.mjs` (minutes and tokens from the Claude Code session log).

---
Tracks: `anatomy-main/kit/`, `anatomy-main/scripts/`, `anatomy-main/references/kit.md`, `anatomy-main/references/verify.md`. Flags taken from script source on 2026-10-21.
