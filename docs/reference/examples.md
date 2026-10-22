# Examples reference

`anatomy-main/examples/` holds **9** finished figures. The README and `SKILL.md` say "eight": `push-button` is in the folder and in CI (`.github/workflows/ci.yml`) but not in the README table or the `SKILL.md` list.

Build any framework-free example with `node examples/<name>/build.mjs`; add `--light` for the light theme. Each build writes `<name>.html` or `<name>-light.html` next to the script. The built pages are committed, so you can open them without building.

## Table

Build times and sizes measured on this machine, 2026-10-21 (Windows 11, Node v22.22.0). "Output line" is what the build printed.

| Example | What it shows | Controls (card hint) | Build | Output line |
|---|---|---|---|---|
| `dial-indicator` | A dial gauge on a stand over a carriage of 3 gauge blocks. Smallest example, about 300 lines (275-line `build.mjs`) | Hover to slide the carriage | ~0.6 s | `wrote dial-indicator.html` |
| `desk-computer` | 1984-style desk computer; type on the keyboard, text appears on the CRT; switch-off collapses to a line and dot. About 85 solids | Type on it · click it to switch | ~0.6 s | `wrote desk-computer.html` |
| `push-button` | A push button on a base plate; has `sheet.mjs` and 3 committed PDFs. Not in the README | Press and hold | ~0.2 s | `wrote push-button.html` |
| `arcade-cabinet` | Upright cabinet, side panel off: a quarter rolls down the chute, trips the coin switch, the CRT warms up. About 240 solids, 15 cables | C or click the quarters · ← → · space | ~6.8 s | `wrote arcade-cabinet.html 985 KB 349 items scale 1.573 15 cables` |
| `ripple-tank` | School ripple tank, 44° camera; two WebGL layers driven by `model.mjs` | Move across for f · up and down for spacing | ~0.3 s | `wrote ripple-tank.html 494 KB 238 layers …` |
| `turning-dial` | 3D mode (beta): combination dial with a robot hand; `stress.mjs` is a 380-part stress hand | Drag the dial · arrow keys · B breaks the pod | 1.6–2.6 s | `… 658 KB · 88 parts …` |
| `raptor-engine` | Raptor 2 in a test stand; comes apart into 11 assemblies; WebGL plume, shock, splash, steam. Reference for pipework and the audit | Hover the engine to take it apart; `i` ignites | 4 min 37 s | `wrote raptor-engine.html 1574 KB 478 items` |
| `test-rig` | Production React/Next figure: glass button on a sprung carriage, finger probe, dial gauge. 53 solids | Press, then pull ← → | no build script | copy into a React app |
| `spot-plate` | Production React/Next figure: six pairs of glass drops that merge as a fan of feeler blades opens | — | no build script | copy into a React app |

## Rebuild results on this machine

- `dial-indicator`, `desk-computer`, `push-button`, `ripple-tank`, `arcade-cabinet`, `turning-dial` (both themes): rebuilt **byte-identical** to the committed pages.
- `raptor-engine` (dark): **not** byte-identical. 1,611,624 bytes against 1,611,623 committed; first difference at character 1,578,991; about 30,457 characters differ. The differences are last-digit float drift, for example `0.45399049973954675` (here) against `0.4539904997395468` (committed). The README says the examples rebuild byte for byte on Node 20.19 and 22.11; CI uses `macos-latest` with Node 22. This machine runs Node 22.22.0 on Windows.

## Which example to copy from

| You need | Open |
|---|---|
| The smallest complete build | `dial-indicator/build.mjs` |
| A screen drawn on a face | `desk-computer`, `arcade-cabinet` |
| Pipes, cables, round parts, the audit | `raptor-engine/build.mjs` |
| A shader driven by a pure model | `ripple-tank` (`model.mjs`) |
| React / Next.js layout | `test-rig` (`rig.ts`, `view.ts`, `geometry.ts`, `pose.ts`, `art.tsx`, `live.tsx`, `figure.tsx`) |
| Shapes that morph into each other | `spot-plate` |
| A printable sheet | `raptor-engine/sheet.mjs` (3 pages), `arcade-cabinet/sheet.mjs`, `push-button/sheet.mjs` |
| 3D turning parts | `turning-dial` |

## Audit commands

```bash
node examples/raptor-engine/build.mjs --audit
node examples/arcade-cabinet/build.mjs --audit
node examples/turning-dial/build.mjs --light --audit --quick
```

The full 3D orbit audit is slow (budget 30–40 s per part per CONTRIBUTING); run it in the background. Only a full run's `turn audit passed` counts.

---
Tracks: `anatomy-main/examples/`, `anatomy-main/README.md` (Examples), `.github/workflows/ci.yml`.
