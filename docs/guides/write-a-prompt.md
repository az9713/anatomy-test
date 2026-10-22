# Write a prompt

Get the figure you want on the first run. A clear prompt saves the agent decisions, and every decision costs time.

## Prerequisites

- The skill is installed as `anatomy` in a skills folder (see [Quickstart](../getting-started/quickstart.md), last section). In Claude Code, Antigravity, OpenCode and MiniMax Code type `/anatomy`; in Codex type `$anatomy`.
- You do not have to name the skill. Claude also loads it when you ask for an isometric illustration, an explanatory figure for docs or a blog, or an interactive explainer.

## Steps

1. **Name the idea, not the drawing.** Say what the figure must explain and give the real numbers: sizes, counts, rates, thresholds. The agent invents the object; that is most of the work.

   ```text
   /anatomy a token bucket: holds 20 tokens, refills 5 per second, one token per request, reject when empty
   ```

2. **Or name the object.** If you already know the machine, say it and say what moves.

   ```text
   /anatomy a Bunsen burner on a lab bench: opening the air collar turns the yellow flame into a blue cone
   ```

3. **Say where it will live.** The build differs for each.

   | Form | Words to use | What you get |
   |---|---|---|
   | Standalone page | "one standalone HTML file" | A Node `build.mjs` and the page it writes, with the kit inlined |
   | Lone SVG | "just the SVG file" | `figureSvg({ standalone: "dark" \| "light" })` output, styles embedded |
   | React / Next.js | "a React component (TSX)" | Geometry modules, a server component for static art, one `"use client"` live component |

4. **Pick the theme.** "light theme" or "dark theme". Light is the theme the skill designs for first.

5. **Steer the size.** Say "Figure size" for one mechanism. Say nothing and the agent decides. An Epic never starts without your yes.

6. **Add extras only when you need them.**

   | Word | Effect |
   |---|---|
   | "interactive" | Pointer and keyboard control, idle tour |
   | "WebGL" | A shader layer for fire, water, glow, steam, light |
   | "3D" | The beta turning mode |
   | "printable", "A4", "poster", "handout" | A `sheet.mjs` and PDFs via `scripts/print.mjs` (poster, drawing, detailed) |
   | "publish this figure to the Anatomy community gallery" | `scripts/publish.mjs` plan; nothing is sent without your yes |

## Verify

A good result has these, from `references/verify.md`:

- At a glance it is one real object you can name, and its motion maps to the concept in one sentence.
- `Fig n`, title, hint and a live readout in the card corners; every number comes from the model.
- The agent reports `audit passed` (if the figure has pipes, cables or round parts) and `line ends: 0` on both themes.
- It still reads at 390 px wide, and goes still under reduced motion.

## Troubleshooting this task

| Symptom | Fix |
|---|---|
| The figure is abstract slabs or labelled boxes | Name a real object in the prompt (step 2) |
| The agent quoted 6+ hours and stopped | It sized an Epic. Accept its Hero proposal, or narrow the idea to one mechanism |
| The readout numbers are wrong | Give the true numbers in the prompt; the model drives the readout |
| You wanted HTML and got React (or the reverse) | State the form explicitly (step 3) |

More prompts with full expected outputs: `anatomy-main/evals/evals.json` (5 evals). Cheap variants: [Try it cheaply](try-it-cheaply.md).

---
Tracks: `anatomy-main/README.md` (Usage), `anatomy-main/SKILL.md`, `anatomy-main/references/print.md`, `anatomy-main/references/publish.md`.
