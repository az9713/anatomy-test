# Try it cheaply

Use these examples in order, from zero tokens to one small figure. Stop at the tier that answers your question.

> **Note:** Written 2026-10-21. Time and cost facts here rot fastest. No token counts were measured for this doc; every time figure below names its source.

## What drives the cost

The agent session is the only cost. The kit and scripts are local Node and never call a paid service. Inside the session, three things decide the bill:

| Driver | Why it costs | Source |
|---|---|---|
| Size tier | Figure 40–80 parts, Hero 80–150, Epic more. More parts = more geometry, more checks | `SKILL.md` step 1 |
| The verify loop | Audit to zero, line check to zero, 4× close-ups of every junction in both themes, every PNG read. Each failure means fix and re-check | `SKILL.md` step 10 |
| Extras | WebGL adds contact sheets and ink-per-frame checks; 3D adds an orbit audit of 15–20 min per 30 parts; React + HTML is two outputs; print adds PDFs | `references/webgl.md`, `references/3d.md` |

Reported times (not measured here):

- `SKILL.md`: Hero about 2–4 hours, Epic 6 hours or more. A Figure has no quoted time; the old 30–90 minute estimate was dropped because it "was often far longer than the build itself" (CHANGELOG, issue #41).
- Better Stack video (`../../transcript.txt`, 4:10–4:40): a normal figure 30–90 minutes, a hero piece 2–4 hours, and "some renders take over 48 hours" per a maintainer comment in a GitHub issue. The video says times vary by model in both directions.

## Tier 0 — zero tokens

No agent. Node and Chrome only. See [Quickstart](../getting-started/quickstart.md) for the first one.

| Try | Command (run in `anatomy-main/`) | Time on this machine |
|---|---|---|
| Open a finished figure | `Start-Process examples\raptor-engine\raptor-engine-light.html` | instant (page is committed) |
| Rebuild the smallest example | `node examples/dial-indicator/build.mjs --light` | ~0.6 s |
| Type on a 1984 desk computer | `node examples/desk-computer/build.mjs --light`, then open `desk-computer-light.html` | ~0.6 s |
| Drop a quarter in the arcade cabinet (key `C`) | open `examples/arcade-cabinet/arcade-cabinet-light.html` | instant |
| Drag the 3D dial, press `B` to break the pod | open `examples/turning-dial/turning-dial-light.html` | instant |
| Read the printed PDFs | `examples/{raptor-engine,arcade-cabinet,push-button}/*-a4.pdf` (poster, drawing, detailed) | instant |
| Line-check a page | `node scripts/lines.mjs examples/dial-indicator/dial-indicator.html --out shots/lines.png` | ~5 s |
| Film the Raptor firing (key `i`) | see the `drive.mjs` command below | ~11 s (readout at the shot: `Pc 253 bar · 192 tf`) |
| Run the geometry audit | `node examples/raptor-engine/build.mjs --audit` | several minutes (plain build took 4 min 37 s here) |

```bash
node scripts/drive.mjs examples/raptor-engine/raptor-engine-light.html '[["wait",1500],["key","i"],["wait",3000],["shot","shots/firing.png"]]'
```

> **Tip:** In PowerShell the inline JSON quoting breaks. Run that line in Git Bash, or put the array in a file and pass `--actions firing.json`.

## Tier 1 — a few tokens: use the skill's thinking, not its build

These run the expensive part of the skill (inventing the object) without the expensive loop (geometry and checks). They need the skill installed (see the end of [Quickstart](../getting-started/quickstart.md)), or a Claude Code session opened in `anatomy-main/` with "read SKILL.md first". Without the install, drop the `/anatomy` prefix.

1. **Vet the metaphor only.** You can judge the analogy before paying for a drawing.

   ```text
   /anatomy explain how an LRU cache with capacity 4 evicts. Do steps 1–4 only (size, truth, object, parts list). Write no code. Stop and show me.
   ```

2. **Change a shipped example.** A small diff against working code, no new geometry from scratch.

   ```text
   In anatomy-main/examples/dial-indicator, add a fourth gauge block 6 px tall after the 10 px block. Keep the needle reading true. Rebuild both themes and run scripts/lines.mjs on both pages.
   ```

3. **Get an example explained.** Read-only.

   ```text
   Walk me through anatomy-main/examples/dial-indicator/build.mjs: which kit call draws which part, and where the readout number comes from.
   ```

## Tier 2 — one small figure

Every prompt below is built to stay a **Figure**: one mechanism, real numbers given, SVG only, one theme, one standalone HTML file, no WebGL, no 3D, no React.

```text
/anatomy explain how a token bucket rate limiter works: bucket holds 20 tokens, refills 5 per second, each request takes one, requests are rejected when it is empty. Figure size, interactive, one standalone HTML file, light theme, no WebGL.
```

```text
/anatomy database connection pooling: a pool of 10 connections, requests borrow one and give it back, when all 10 are busy new requests wait in a FIFO queue. Figure size, interactive, one standalone HTML file, light theme, no WebGL, no React.
```

```text
/anatomy binary search over 16 sorted keys, showing the halving on each step until the key is found or the range is empty. Figure size, interactive, standalone HTML, light theme, no WebGL.
```

```text
/anatomy a debounce with a 300 ms quiet window: events that arrive within 300 ms reset the timer; only the last one fires. Figure size, interactive, standalone HTML, light theme, no WebGL.
```

```text
/anatomy a Bloom filter of 16 bits with 3 hash functions: inserting sets 3 bits, a lookup says "maybe" only when all 3 are set. Figure size, interactive, standalone HTML, light theme, no WebGL.
```

The token-bucket prompt is the README quickstart subject with the numbers of eval 1 in `evals/evals.json` (20 tokens, 5 per second), so you can compare your result with the expected output written there.

### The biggest single lever: a checkpoint

`SKILL.md` requires "a working page that opens in the browser within the first hour", then deepening from there. Ask the agent to stop at that point:

```text
…Stop after the first working page opens. Show me one capture.mjs screenshot and wait before the close-up sweep.
```

> **Warning:** This cuts the skill's verify loop short. What you get is a draft: the audit, line check and 4× close-ups have not run. The video recommends treating the first figure as a draft anyway (`transcript.txt`, 4:40–4:48).

### What the word "quick" does and does not do

- It steers away from a Hero: `SKILL.md` builds a Hero "unless the user asked for something quick".
- It does **not** reduce detail: "a quick explainer is still a dense, real machine, never a few slabs" (`SKILL.md`).

## Avoid until you know the bill

| Request | Why it costs more |
|---|---|
| "React component plus an HTML preview" (eval 2, the form of your `README.txt` idea in the upstream evals) | Two outputs and the React server/client split |
| WebGL flame, water, glow (eval 4, Bunsen burner) | Shader contact sheets, ink-per-frame checks, both themes |
| Dense pipework (eval 5, espresso machine) | Every pipe routed, recorded and audited to zero |
| 3D mode (turning-dial) | Orbit audit 15–20 min per 30 parts, plus browser checks |
| Whole vehicle, building or plant | Epic: 6 h or more; the agent stops and asks first |
| "Also print it" / "publish it" | `print.mjs` PDFs in three formats; `publish.mjs` opens a pull request |

## Measure what one figure cost

After a run, check the session's usage in your agent (in Claude Code, your plan's usage view or `/cost` on API billing). `scripts/publish.mjs` can also read minutes and tokens for a figure from the Claude Code session log (`scripts/session.mjs`, idle gaps over 10 minutes and cache reads excluded); it only does this as part of a gallery publish plan.

---
Tracks: `anatomy-main/SKILL.md` (step 1, step 10), `anatomy-main/evals/evals.json`, `anatomy-main/CHANGELOG.md`, `../../transcript.txt`. Re-check on every new ZIP.
