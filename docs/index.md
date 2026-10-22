# Anatomy — local docs

Anatomy is an agent skill that explains a technical idea by building it as a working isometric machine (SVG, optional WebGL, optional 3D). These docs cover how to use it without a large token bill, how its drawing kit and checks work, and how to change it safely.

The skill source is in `../anatomy-main/` (an unzipped copy of `github.com/wheresryan22/anatomy`, `main` branch, CHANGELOG top entry `[Unreleased]` after `1.1.0`, 2026-10-12). These docs live outside that folder, so a fresh ZIP that replaces `anatomy-main/` does not delete them. Docs written 2026-10-21.

---

## Start here

| If you want to… | Read |
|---|---|
| Try it without spending tokens, or spend as few as possible | [Try it cheaply](guides/try-it-cheaply.md) |
| See it work in 2 minutes, zero tokens | [Quickstart](getting-started/quickstart.md) |
| Understand it from zero | [Onboarding](getting-started/onboarding.md) |

## Documentation

| Section | What's inside |
|---|---|
| [What is Anatomy](overview/what-is-this.md) | The one idea, what it makes, what it does not make |
| [Key concepts](overview/key-concepts.md) | Every term the other docs use: Figure vs figure, kit, card, audit, line check |
| [Quickstart](getting-started/quickstart.md) | Build, open and check an example with Node only |
| [Onboarding](getting-started/onboarding.md) | Mental model, then one realistic run end to end |
| [Try it cheaply](guides/try-it-cheaply.md) | Example prompts in cost tiers, and what to avoid |
| [Write a prompt](guides/write-a-prompt.md) | Steering words, size tiers, output forms, print and publish |
| [Contribute a change](guides/contribute.md) | Tests, house rules, CI, what fails on this Windows machine |
| [The workflow](concepts/workflow.md) | The 10 steps the agent follows, from "Size it" to "Verify like a critic" |
| [Verification](concepts/verification.md) | Geometry audit, line check, captures, close-ups, orbit audit |
| [Kit and scripts reference](reference/kit-and-scripts.md) | Module map and every script flag in one place |
| [Examples reference](reference/examples.md) | The 9 shipped examples: controls, size, build time |
| [System design](architecture/system-design.md) | How the parts fit, and the design decisions with their sources |
| [Common issues](troubleshooting/common-issues.md) | Symptom → cause → fix |

A dark-mode HTML entry page with the cheap-example table is at [index.html](index.html).

## Keep these docs true

- **Same-change rule.** When you update `anatomy-main/` from a new ZIP, re-check the facts marked with a date in each doc. The fastest-rotting doc is [Try it cheaply](guides/try-it-cheaply.md).
- **Ownership.** Each doc names the upstream files it tracks in its last line.
- **Re-validate.** After any doc edit, check that relative links resolve and that no doc says "TBD".
