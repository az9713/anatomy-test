# Onboarding: Anatomy from zero

This page builds the mental model first, then walks one realistic run end to end. No prior knowledge assumed.

## What problem does it solve?

A docs page says "the pool has 10 connections; when all are busy, new requests queue." A reader nods and forgets. A boxes-and-arrows diagram shows ten boxes and a queue box. The reader still does not *feel* what "all busy" means.

Anatomy makes the agent build a small machine instead: for example a rack of 10 hooks, each hook holding a token that a worker borrows and hangs back, with a turnstile that holds the next worker when no hook is free. You watch the hooks empty and the turnstile lock. That is the whole idea: **the object is the explanation.**

## What is actually in the folder?

Think of it as a workshop with four benches:

| Bench | Folder | Analogy |
|---|---|---|
| The instructions | `SKILL.md`, `references/` | The foreman's rulebook the agent reads |
| The tools | `kit/` | Lathe, saw and paint: functions that turn numbers into shaded SVG parts |
| The inspectors | `kit/audit.mjs`, `scripts/` | Gauges that measure the finished part and reject faults |
| The sample shelf | `examples/` | 9 finished machines to copy from |

The agent does the building. You only write the request.

## Why is it slow?

Because the rulebook demands a lot before it calls a figure finished:

1. A parts list of at least 40 parts before any geometry.
2. A model with true numbers driving every motion and readout.
3. A geometry audit that must end `audit passed` when the figure has pipes, cables or round parts.
4. A line check that must print `line ends: 0`, on both themes and every resting pose.
5. 4× close-ups of every junction in both themes, each PNG read by the agent.

Each check that fails sends the agent back to fix and re-check. That loop is where the time and tokens go. See [The workflow](../concepts/workflow.md) and [Verification](../concepts/verification.md).

## Why does "truth first" matter?

Every number on the card comes from one model module. The Raptor engine's readout says `Pc 300 bar, 230 tf` because the model says so, not because someone typed it. If you give real numbers in your prompt (counts, rates, thresholds), the figure is correct. If you do not, the agent has to collect or invent them.

## Walkthrough: one realistic run

Your own prompt from `../../README.txt`:

```text
/anatomy a figure for database connection pooling:
a pool of 10 connections,
requests borrowing one and give it back,
when all are busy new requests waiting in a queue, interactive
```

What happens, step by step (step names from `SKILL.md`):

1. **Size it.** One mechanism → the agent names a **Figure**. It does not quote a time.
2. **Truth first.** It writes a model: 10 slots, a borrow/return cycle, a FIFO queue, arrival and hold times.
3. **Invent the object.** It picks a machine and states in one sentence what moves and what the motion means.
4. **List the parts.** 40–80 parts grouped as base, structure, mechanism, controls, subject.
5. **Plan the world.** Floor plans in world units; camera azimuth 45° by default, elevation 30°.
6. **Build the geometry once.** All static paths precomputed with the kit; moving parts built at rest and moved with `translateAlong`.
7. **Paint back to front.** Sort by depth; split anything that wraps another part.
8. **Frame it.** `Fig 1`, title, hint, readout, legend, caption.
9. **Make it live.** Calm eased motion, an idle tour, pointer and keyboard control, still under reduced motion.
10. **Verify like a critic.** Captures at desktop and 390 px wide, line check to zero, audit to zero, close-ups.

What you get back: a `build.mjs`, the page it writes, and the kit, in your project. You own the source (MIT).

> **Tip:** That prompt has no output form and no theme. The agent will choose. Add "standalone HTML, light theme" to save it a decision. The same idea in `evals/evals.json` (eval 2) asks for a React component *and* an HTML preview, which is two outputs. See [Try it cheaply](../guides/try-it-cheaply.md).

## What to read next

| Goal | Doc |
|---|---|
| Spend few tokens | [Try it cheaply](../guides/try-it-cheaply.md) |
| Write better requests | [Write a prompt](../guides/write-a-prompt.md) |
| Read the kit | [Kit and scripts reference](../reference/kit-and-scripts.md) |
| Change the skill | [Contribute a change](../guides/contribute.md) |

---
Tracks: `anatomy-main/SKILL.md` (Workflow), `anatomy-main/references/walkthrough.md`.
