# Key concepts

Every term the other docs use without explanation. Upstream names are kept exactly.

## Output and size

**figure** (lower case) — any output of the skill: one framed, interactive drawing. Example: `examples/dial-indicator/dial-indicator.html`.

**Figure / Hero / Epic** (capitalised) — the three size tiers the agent must name in workflow step 1. They set the part count and the time budget.

| Tier | Scope | Parts | Time (SKILL.md) | Agent behaviour |
|---|---|---|---|---|
| Figure | One mechanism, SVG with at most one WebGL layer | 40–80 | Not quoted; budget up to 1 hour for progress checks | Names the size and builds without asking |
| Hero | Dense object, several WebGL layers or one 3D subject | 80–150 | About 2–4 hours | Says so, then builds unless you asked for something quick |
| Epic | Whole vehicle, building or plant, or 3D on more than one subject | More | 6 hours or more | Does not start. Proposes a Hero version and waits for your choice |

**card** (also **plate**) — the frame around the drawing. `Fig n` top left, title top right, hint bottom left, live readout bottom right, legend keys and caption under it. Built by `plateHtml()` or `<Plate>`.

**readout** — the live text in the card's bottom-right corner. The element carries `data-readout`. Its numbers come from the model, never typed by hand. Example: `block 1 · reads 18.0 px`.

**model** — a small pure module with the true numbers and behaviour of the concept (sizes, counts, rates, springs). The readout, the motion and the caption all read from it. Example: `examples/test-rig/rig.ts`, `examples/ripple-tank/model.mjs`.

**theme** — `dark` (default build) or `light` (`--light` build flag, writes `<name>-light.html`). A kit page picks its theme at build time with `data-theme` on `<body>`.

## Drawing

**kit** — the drawing library in `anatomy-main/kit/`. Zero npm dependencies. See [Kit and scripts reference](../reference/kit-and-scripts.md).

**world units** — about 1 px of the real thing. x and y on the floor, z up.

**projection (`P`)** — the isometric camera. Made by `fitProjection(points, width, height, { pad, azimuth, elevation })`. Default azimuth 45°, elevation 30°.

**solid** — a filled, shaded part (`slabOf`, `cylinder`, `extrude`, `lathe`…). Solids hide what is behind them. No wireframes, no dashed hidden lines.

**four-tone shading** — each solid gets four side tones by facing, plus a lighter top. Tone hierarchy: base `lo`, structure `mid`, subject `hi`, exactly one `lit` accent.

**painter's order** — drawing back to front, bottom to top, so nearer parts cover farther ones. In dense figures the order is solved by `A.settle()`, not tuned by eye.

**smooth shading / staircase** — a curved body shaded per facet row shows stepped tone blocks (a "staircase"). Smooth shading removes it.

**tube / route** — a pipe or cable drawn by `kit/tube.mjs` as depth-sortable chunks along a 3D path.

## Checks

**audit** (geometry audit) — `node build.mjs --audit`, from `kit/audit.mjs`. Proves recorded shapes: nothing passes through anything, every end sits on a mount, every overlap is in depth order. Must end `audit passed`. It does **not** see line markup.

**line check** — `scripts/lines.mjs`. Runs on the built page in headless Chrome. Every texture line (seam, tick, rib, pointer) must end on a stroke, dot or outline. Must print `line ends: 0`.

**orbit audit** — the 3D-mode audit (`kit/turn-audit.mjs`, `build.mjs --audit` on a 3D figure). Must end `turn audit passed` (only a full run counts; `--quick` ends `turn audit quick`).

**stand-in shape** — a recorded shape that covers much less than what is drawn, which would hide faults from the audit. The audit fails it (`stand-in shapes:` line).

**close-up** — a 4× zoomed screenshot of one junction (`capture.mjs --zoom x,y,w,h`). The skill requires close-ups of every junction in both themes.

**contact sheet** — a grid of frames from `drive.mjs ["sheet", …]`, often slowed with `["slow", 0.05]` to catch a shader pop.

## Agent words

**skill** — a folder with a `SKILL.md` that the agent loads. Anatomy is one; `anatomy-main/` is that folder.

**reference** — a long guide in `anatomy-main/references/` that the agent opens when it needs it (`craft.md`, `kit.md`, `verify.md`…).

**eval** — a test prompt plus expected output in `anatomy-main/evals/evals.json`. There are 5.

---
Tracks: `anatomy-main/SKILL.md`, `anatomy-main/references/kit.md`, `anatomy-main/references/verify.md`.
