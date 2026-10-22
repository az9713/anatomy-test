# What is Anatomy

Anatomy is a skill (a folder with a `SKILL.md`) that makes an AI coding agent draw an explanatory figure as a real physical machine whose motion *is* the concept, instead of boxes and arrows.

## The one idea

A boxes-and-arrows diagram tells you that a part exists. It does not tell you what the part does. Anatomy makes the agent invent an object whose mechanism maps one-to-one onto the idea, then build that object from many small shaded parts.

Mappings from `anatomy-main/SKILL.md`:

| Concept | Object |
|---|---|
| A cache key that skips work when nothing changed | A pin-tumbler lock: when every pin matches, the plug turns |
| One shared GPU context serving many canvases | A gantry plotter: one print head visiting 16 wells |
| Seven render targets with different bytes per texel | A chest of seven drawers, each as deep as its bytes |
| A separable blur (49 × 49 taps vs 49 + 49) | A bed-of-nails stamp beside two combs on rails |
| A spring that presses and leans | A test rig with springs, a probe and a dial gauge |

> **Warning:** The checks prove the *drawing*, not the *analogy*. The audit proves that no pipe passes through a part. It cannot prove that a pin-tumbler lock is a correct way to think about a cache key. Read the metaphor before you trust the figure. (Point made in the Better Stack video, `../../transcript.txt`, 4:56–5:04.)

## What it makes

Three kinds of figure. All three use one kit, one camera and one set of craft rules.

| Kind | What it is | Shipped example |
|---|---|---|
| SVG | Solid isometric parts with four-tone shading, painted back to front, in a card with a live readout and eased motion | `dial-indicator`, `desk-computer`, `arcade-cabinet`, `push-button`, `test-rig`, `spot-plate` |
| SVG + WebGL | A shader layer between a back SVG and a front SVG, for fire, exhaust, water, caustics, lamp light, glow, steam | `raptor-engine`, `ripple-tank` |
| 3D (beta) | Parts re-projected and re-shaded every frame while they turn | `turning-dial` |

Output forms: a standalone HTML page, a lone `.svg` file with styles embedded, or React/Next.js components. Each figure is light or dark; light is the theme the skill designs for first.

## What it does not make

From the README "Limits" section:

- **Not a chart library.** No axes, series or data plots. Numbers appear only as a live readout from a model and as true part sizes.
- **Machines, instruments, tools, furniture.** Not people, not exact maps. An idea with no mechanism comes out weaker.
- **Slow on purpose.** A figure is a long agent session: parts list, geometry, audit, close-ups of every joint in both themes.
- **Shaders need WebGL.** Without WebGL the SVG still reads. Under reduced motion every figure goes still.

## How it all fits together

```
You: "/anatomy explain X, interactive"
        │
        ▼
Agent reads anatomy-main/SKILL.md ──► opens references/*.md as needed
        │
        ▼
Agent writes a figure folder in YOUR project:
   model (true numbers) ─► geometry (kit/*.mjs) ─► build.mjs ─► page.html
        │
        ▼
Agent checks its own work with Node + headless Chrome:
   build.mjs --audit   scripts/lines.mjs   scripts/capture.mjs   scripts/drive.mjs
        │
        ▼
You get source you own: build script + page (or React components) + kit
```

The agent is the author. The kit and scripts are plain Node with zero npm dependencies (React only for React output). Nothing calls a paid API except the agent session itself, so the agent session is the only cost. See [Try it cheaply](../guides/try-it-cheaply.md).

Supported agents (README, 2026-10-21): Claude Code, Antigravity, OpenCode, Codex, MiniMax Code. In Codex the command is `$anatomy`; elsewhere `/anatomy`.

---
Tracks: `anatomy-main/README.md`, `anatomy-main/SKILL.md`.
