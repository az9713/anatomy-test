# Quickstart: build and check an example with zero tokens

Build, open and check a shipped figure in about 2 minutes. This uses Node and Chrome only. No agent runs, so no tokens are spent.

Verified on this machine on 2026-10-21: Windows 11, Node v22.22.0, Chrome installed.

## Prerequisites

| Need | Version | Verify |
|---|---|---|
| Node.js | 20.10 or later (built-in modules only, no `npm install`) | `node --version` |
| Chrome or Chromium | any recent; set `CHROME_PATH` if it is not in the usual place | `capture.mjs` below fails if it is missing |

```bash
node --version
```

Expected: `v20.10.0` or later. This machine prints `v22.22.0`.

## Steps

1. Go to the skill folder.

   ```bash
   cd path/to/anatomy-main
   ```

2. Build the smallest example, the dial indicator, in the light theme.

   ```bash
   node examples/dial-indicator/build.mjs --light
   ```

   Expected output, in about 0.6 s:

   ```text
   wrote dial-indicator-light.html
   ```

   > **Note:** The build overwrites the committed page. On this machine it came out byte-identical, so nothing changes.

3. Open the page in your browser and hover over it. The carriage slides and the needle reads each gauge block.

   ```powershell
   Start-Process examples\dial-indicator\dial-indicator-light.html
   ```

4. Run the line check. It opens headless Chrome and tests that every drawn line ends on something.

   ```bash
   node scripts/lines.mjs examples/dial-indicator/dial-indicator-light.html --out shots/lines-light.png
   ```

   Expected output, in about 5 s:

   ```text
   line ends: 0 of 367 ends on 23 lines float
   shot shots/lines-light.png
   console: clean
   ```

5. Take a screenshot the way the agent does when it checks its own work.

   ```bash
   node scripts/capture.mjs examples/dial-indicator/dial-indicator-light.html --out shots/desk.png
   ```

   Expected output:

   ```text
   saved …\shots\desk.png
   clip 395,64 650x485 · readout "block 1 · reads 18.0 px" · scrolls sideways: no
   console: clean
   ```

6. Take a 4× close-up of one region of the card (x, y, width, height in card px).

   ```bash
   node scripts/capture.mjs examples/dial-indicator/dial-indicator-light.html --out shots/joint.png --zoom 200,80,220,170
   ```

## Verify

- `shots/desk.png` shows a dial gauge on a stand over a carriage with three gauge blocks, card title "DIAL INDICATOR", readout "block 1 · reads 18.0 px".
- `shots/` is in `anatomy-main/.gitignore`, so screenshots do not pollute the repo.

## Next

- Run every other example: [Examples reference](../reference/examples.md).
- Spend a few tokens on your own figure: [Try it cheaply](../guides/try-it-cheaply.md).
- To make `/anatomy` available in Claude Code, copy the folder into your skills folder. This was done on 2026-10-21 (personal scope, `~/.claude/skills/anatomy`). The skill folder must be named `anatomy`, not `anatomy-main`:

  ```powershell
  Copy-Item -Recurse path\to\anatomy-main ~\.claude\skills\anatomy
  ```

  Claude Code picks up a new skill in a running session. If `~/.claude/skills` did not exist when the session started, run `/reload-skills`.

---
Tracks: `anatomy-main/README.md` (Install, Requirements), `anatomy-main/references/verify.md`.
