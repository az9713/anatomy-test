# System design

Anatomy has no server and no runtime of its own. It is three layers: instructions the agent reads, a zero-dependency drawing kit the agent's code imports, and local check scripts the agent runs.

## Components

```
┌─────────────────────────── the agent session (only cost) ───────────────────────────┐
│                                                                                      │
│  SKILL.md (185 lines) ──► references/*.md (10 guides, ~2,500 lines, opened on need)   │
│        │                                                                             │
│        ▼  agent writes, in YOUR project:                                             │
│  model.mjs ─► build.mjs ──imports──► kit/iso-kit.mjs, lathe.mjs, tube.mjs, gl.mjs…   │
│                  │                                                                   │
│                  ├──► page.html  (kitScript() + glScript() + live code inlined)       │
│                  └──► --audit ──► kit/audit.mjs  (Node, recorded shapes)              │
│                                                                                      │
│  page.html ──► scripts/capture.mjs, drive.mjs, lines.mjs  (headless Chrome)           │
│        └────► PNGs ──► the agent reads them ──► fixes ──► rebuild                     │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

| Layer | Files | Runs in |
|---|---|---|
| Instructions | `SKILL.md`, `references/` (`craft`, `kit`, `motion`, `react`, `verify`, `webgl`, `walkthrough`, `3d`, `print`, `publish`) | The agent's context |
| Kit | `kit/*.mjs`, `kit/iso-kit.ts`, `kit/iso.css`, `kit/react/*.tsx` | Node at build time; the browser at run time (inlined) |
| Checks | `kit/audit.mjs`, `kit/turn-audit.mjs`, `scripts/*.mjs` | Node; headless Chrome over a local debugging port |
| Samples | `examples/` (9) | Node build, then any browser |
| Tests | `scripts/*.test.mjs` (45 files, 270 tests), `tests/fixtures/*.png`, `evals/evals.json` | `node --test`; evals are prompts for a human or harness |

## Data flow for a standalone figure

1. `build.mjs` computes a projection `P` with `fitProjection`.
2. It builds every static part once as SVG path strings (`slabOf`, `lathe`, `tubePieces`…).
3. With pipes or round parts, every item goes into `A.recorder`; `A.settle` ray-casts overlaps and sets painter's keys.
4. It wraps the parts with `figureSvg` and `plateHtml` and writes the page with `pageHtml({ script: kitScript() + live })`.
5. In the browser, the live code reads the same model, moves pre-built groups with `translate`, rebuilds only shape-changing parts, and writes the readout.

For React, step 4 changes: geometry stays in `.ts` modules, static art is a server component (`draw.tsx`), and one `"use client"` component moves things (`references/react.md`).

## Design decisions and where they come from

Each decision below is stated in the repo. The source is named; no rationale is added beyond it.

| Decision | Source | Consequence |
|---|---|---|
| **The object is the explanation**: no boxes, arrows or floating labels | `SKILL.md` "The one idea that matters" | The agent must invent a mechanism; ideas without one "come out weaker" (README Limits) |
| **Truth first**: one pure model drives motion, readout and caption | `SKILL.md` step 2; CONTRIBUTING "Every number is true" | Numbers in the figure are only as true as the numbers you give |
| **Zero dependencies**: Node built-ins only; React only for React output | README Requirements; `kit/` | Nothing to `npm install`; the gallery can rebuild figures in a locked sandbox |
| **Kit changes are opt-in** and every existing example must rebuild byte-identical | CONTRIBUTING "House rules"; CI `git diff --exit-code` | A new option defaults to the old behaviour |
| **No comments in code** (tool directives like `"use client"` excepted) | CONTRIBUTING "House rules" | Explanation lives in names, structure and `references/` |
| **Light ships first**; every colour is a token with a dark override | CONTRIBUTING; `SKILL.md` | Light shaders are designed as ink on paper, never `screen` blending |
| **Depth order is measured, not tuned** | `SKILL.md` step 7; `kit.md` §12 | Interlocks are fixed in geometry, never with a key bias |
| **Every check is backed by a planted fault** (3D checks run their control first) | `verify.md` "Orbit"; `3d.md` §14 | A check whose control does not fail is treated as broken |
| **Size tiers with an Epic gate** | `SKILL.md` step 1 | The agent stops before a 6 h+ build and asks |
| **Figure time no longer quoted** | CHANGELOG `[Unreleased]`, issue #41 | You get no time estimate for the smallest tier |
| **Name the supported agents** rather than claim "any compatible agent" | Better Stack video (`../../transcript.txt`, 5:13), describing a declined pull request | Support list: Claude Code, Antigravity, OpenCode, Codex, MiniMax Code |

## Security surface

From `SECURITY.md`: the Chrome scripts run headless with a throwaway profile and `--allow-file-access-from-files`, and `drive.mjs` runs any JavaScript you pass it in the page. Point them only at pages you trust. Only the latest commit on `main` is supported.

---
Tracks: `anatomy-main/SKILL.md`, `anatomy-main/CONTRIBUTING.md`, `anatomy-main/SECURITY.md`, `anatomy-main/references/react.md`.
