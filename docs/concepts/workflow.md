# The workflow

The agent follows 10 steps in a fixed order, set in `anatomy-main/SKILL.md`. The concept and the parts list come before any geometry, because "most of the quality is decided there."

The step names below are the ones in your `README.txt`; they match `SKILL.md`.

## 1. Size it

The agent names the tier before any other work: **Figure**, **Hero** or **Epic** (table in [Key concepts](../overview/key-concepts.md)). A Figure is built without asking and without a time quote. A Hero gets an "about 2–4 hours" notice. An Epic is not started: the agent proposes a Hero version and lists what the full version would add.

Whatever the size, a working page must open in the browser within the first hour. The agent runs `date` at the start and at each step, and reports when a step runs past twice its share of the estimate.

## 2. Truth first

Collect the real numbers and behaviour: sizes, counts, thresholds, curves. Write them as a small pure module (like `examples/test-rig/rig.ts`) and drive everything from it. The readout, motion and caption must all be true.

## 3. Invent the object

Pick a machine, tool, instrument or piece of furniture whose mechanism maps one-to-one onto the concept. State in one sentence what moves and what that motion means. Take a reference image's finish, never its object.

Two named failure modes: **too abstract** (stacked plates, floating slabs, labelled boxes) and **too flat** (one big slab with a few lines). The fix for both is a recognisable machine made of many small, precise, purposeful parts.

## 4. List the parts

At least 40 parts (40–80 Figure, 80–150 Hero, more for Epic), grouped: base, structure, mechanism, controls, and the subject, which is the one lit part. Each part sits on another part. `references/craft.md` section 3 has recipes for base plates, ruler strips, rails and carriages, knurled knobs, coil springs, dial gauges, drawers, turntables and more.

## 5. Plan the world

World units of about 1 px of the real thing; x and y on the floor, z up. Plans are rounded rectangles `{x, y, w, d, r}` and circles. Camera azimuth 45° by default (35–60° to show a long side), elevation 30° (higher, like the ripple tank's 44°, to look into something open). Fit with `fitProjection(points, width, height, { pad, azimuth })`.

## 6. Build the geometry once

Precompute every static path in a geometry module: `slabOf`, `cylinder`, `extrude`, `planOutline`, `topTicks`, `knurl`, `coil`, `radialTicks`. Round parts on any axis come from `kit/lathe.mjs`; pipes and cables from `kit/tube.mjs`. Moving parts are built once at rest and moved with `translateAlong`. Only parts whose shape changes are rebuilt per frame.

## 7. Paint back to front

Sort repeated parts with `depthOf`. Split anything that wraps another part into back and front halves (springs around a rod, a frame around a carriage). Once a figure has pipes, cables and round parts, stop tuning by eye: record each shape with `A.recorder(P, { order, spring })`, let `A.settle(R, P)` measure true depth and set the keys, and end the build with `A.auditOrExit(R, P)`.

## 8. Frame it

A card: `Fig n` top left, short title top right, hint bottom left, live readout bottom right. Legend keys and a true caption go under the card. No words inside the drawing except at most one tiny engraved label.

## 9. Make it live

Calm, time-based motion: exponential follow or real springs. An idle tour loops when nobody touches it. Pointer and keyboard control. Stops offscreen, still under reduced motion. Write attributes on refs; never re-render per frame. Details: `references/motion.md`.

## 10. Verify like a critic

Captures at desktop, 390 px and hover; audit to zero; line check to zero; 4× close-ups of every junction in both themes; shader contact sheets slowed 20×. Read every PNG. Full detail: [Verification](verification.md).

## Data flow inside one figure

```
model (true numbers) ──┬──► geometry (static paths, built once)
                       │            │
                       │            ▼
                       │     build.mjs ──► page.html (kit + live code inlined)
                       │                        │
                       └──► live code (loop) ───┘──► readout, aria-valuetext, moving parts
```

---
Tracks: `anatomy-main/SKILL.md` (Workflow), `anatomy-main/references/craft.md`, `anatomy-main/references/motion.md`.
