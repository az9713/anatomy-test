# Common issues

Symptom → cause → fix. The first group is about running Anatomy; the second about the figures it makes. Figure faults come from `anatomy-main/references/verify.md` "Common faults and fixes", which lists about 40 more.

## Running it

### `/anatomy` does not appear in Claude Code

**Cause:** The skill is not in a skills folder, or the folder is named `anatomy-main`. On 2026-10-21 it was installed in `~/.claude/skills/anatomy`; if `/anatomy` is missing, check that folder first.

**Fix:** Copy it in under the name `anatomy`, then run `/reload-skills` if `~/.claude/skills` did not exist when the session started.

```powershell
Copy-Item -Recurse path\to\anatomy-main ~\.claude\skills\anatomy
```

### `Chrome exited before startup: 0` on Windows

**Cause:** The terminal is elevated (Run as administrator). Chrome relaunches itself without elevation; the process the script started exits with code 0 while the relaunched browser keeps running.

**Fix:** This copy's scripts pass `--do-not-de-elevate` on Windows (CHANGELOG `[Unreleased]`). If you still see it, run from a non-elevated terminal.

### A browser script cannot find Chrome

**Cause:** Chrome is not in the usual macOS, Linux, Windows or Playwright cache locations.

**Fix:** Point `CHROME_PATH` at the binary.

```powershell
$env:CHROME_PATH = "C:\Program Files\Google\Chrome\Application\chrome.exe"
```

### `drive.mjs` fails to parse its actions in PowerShell

**Cause:** PowerShell mangles the double quotes inside the inline JSON array.

**Fix:** Put the actions in a file and pass `--actions`. Anything with `until` or `eval` belongs in a file anyway (`verify.md`). Example `firing.json`:

```json
[["wait", 1500], ["key", "i"], ["wait", 3000], ["shot", "shots/firing.png"]]
```

```bash
node scripts/drive.mjs examples/raptor-engine/raptor-engine-light.html --actions firing.json
```

### In Codex, the figure builds but every check fails

**Cause:** The Codex sandbox stops headless Chrome (temporary profile plus a local port).

**Fix, in order of preference (README):** approve the check outside the sandbox when Codex asks (`approval_policy = "on-request"`); or set `sandbox_mode = "workspace-write"` with `network_access = true` and `writable_roots = ["/tmp"]` in `~/.codex/config.toml`; or run the check yourself in a normal terminal.

### `capture.mjs --theme light` still shows a dark figure

**Cause:** `--theme` only emulates `prefers-color-scheme`. Kit pages choose their theme at build time.

**Fix:** Build with `--light` and capture the `-light.html` page.

### React tests fail with `Cannot find module 'esbuild'`

**Cause:** The React tests need `react`, `react-dom`, `typescript` and `esbuild`, which CI installs into a temporary folder.

**Fix:** Run step 4 of [Contribute a change](../guides/contribute.md).

### The run takes hours or uses far more tokens than expected

**Cause:** The agent sized a Hero, added WebGL or 3D, or is iterating on audit failures.

**Fix:** Ask for "Figure size", one standalone HTML file, one theme, no WebGL, and a checkpoint after the first working page. See [Try it cheaply](../guides/try-it-cheaply.md).

## The figure

### A part shows through something in front of it

**Cause:** It is painted too late.

**Fix:** Move it earlier, or split the front part into back and front halves. In a dense figure, record shapes and let `A.settle` set the order.

### Stepped tone blocks on a bell, dome or cone

**Cause:** Facet shading.

**Fix:** Mark curved knots smooth (`[s, r, 1]`) or pass `smooth: true`; cut long bodies with `G.bandsOf`.

### A row of ribs or bolt dots stops in the middle of a surface

**Cause:** A hard `least` cut-off.

**Fix:** Pass `fade: [lo, hi]` to `ribsOf` or `dotsOf`.

### A pipe looks pasted on, or cuts through a part

**Cause:** Its pieces are in one layer, or it really passes through.

**Fix:** Depth-sort each `tubePieces` chunk by `mid`; reroute if `--audit` lists a `through`.

### A shader colour jumps at a phase change

**Cause:** Colour follows a phase flag.

**Fix:** Give colour its own slow envelope driven by the physical quantity (`webgl.md` section 7).

### In light theme, a glow reads as dark red or brown smoke

**Cause:** The dark-theme colour was darkened with alpha set to brightness.

**Fix:** Solve the ink from a paper ramp with a saturated body, a pale core and an alpha floor (`webgl.md` section 8.1).

### The figure jumps when the tab regains focus

**Cause:** A large `dt` after the pause.

**Fix:** Clamp `dt` to 1/30 s.

---
Tracks: `anatomy-main/references/verify.md`, `anatomy-main/README.md` (Install, Codex), `anatomy-main/CHANGELOG.md`.
