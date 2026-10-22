# Contribute a change

Change the kit, a script or the skill text without breaking an example. This page condenses `anatomy-main/CONTRIBUTING.md` and adds what was measured on this machine.

## Prerequisites

- Node.js 20.10 or later; Chrome or Chromium (or `CHROME_PATH`).
- A git clone, not this ZIP copy: CI's main check is `git diff --exit-code` after rebuilding, which needs git. `anatomy-main/` here is not a git repository.

```bash
git clone https://github.com/wheresryan22/anatomy.git
```

## Steps

1. **Open an issue first** for anything larger than a fix.

2. **Make one change.** Follow the house rules:

   | Rule | What it means in practice |
   |---|---|
   | No comments in code | Not a header, not a JSDoc. `"use client"` stays |
   | Kit changes are opt-in | New option or function; default = old behaviour; every example rebuilds byte-identical |
   | Both themes work, light ships | Colours are tokens with a dark override; build `--light` and check both |
   | No overlaps | Proved by the audit; fix interlocks in geometry, never a key bias |
   | Lines resolve, textures fade | `line ends: 0`; no tone staircase |
   | Shaders never pop | Envelopes with attack and decay; crossfades |
   | Every number is true | Applies to docs too |
   | Read every PNG | 4× close-ups of every joint, both themes |

3. **Rebuild every example** exactly as CI does.

   ```bash
   node examples/dial-indicator/build.mjs && node examples/dial-indicator/build.mjs --light
   node examples/desk-computer/build.mjs && node examples/desk-computer/build.mjs --light
   node examples/arcade-cabinet/build.mjs && node examples/arcade-cabinet/build.mjs --light
   node examples/ripple-tank/build.mjs && node examples/ripple-tank/build.mjs --light
   node examples/turning-dial/build.mjs && node examples/turning-dial/build.mjs --light
   node examples/turning-dial/build.mjs --light --verify && node examples/turning-dial/stress.mjs --light
   node examples/raptor-engine/build.mjs && node examples/raptor-engine/build.mjs --light
   node examples/push-button/build.mjs && node examples/push-button/build.mjs --light
   ```

4. **Run the regression tests.** CI installs four packages into a temporary folder for the React tests:

   ```bash
   test_deps="$(mktemp -d)"
   npm install --prefix "$test_deps" --no-audit --no-fund --ignore-scripts react@19.3.0 react-dom@19.3.0 typescript@5.9.3 esbuild@0.28.2
   NODE_PATH="$test_deps/node_modules" node --test scripts/*.test.mjs
   ```

5. **Run the checks that match what you touched**: `--audit` for geometry, `scripts/lines.mjs` for line markup, `capture.mjs` / `drive.mjs` for visuals, `turn-check.mjs` for 3D. Commands: [Verification](../concepts/verification.md).

6. **Record it.** Add a line under `Unreleased` in `CHANGELOG.md`. If you changed a kit API, update `references/kit.md` in the same pull request. A new example needs a folder with `build.mjs`, an entry in `SKILL.md`, the README table and the CI build list.

## Verify

- `git status --short` shows only what you meant to change.
- All tests pass. CI runs on `macos-latest`, Node 22.

## Results on this machine (2026-10-21)

Windows 11, Node v22.22.0, **without** the four CI packages: `node --test scripts/*.test.mjs` ran 270 tests in 4 min 13 s, **243 passed, 27 failed** (27 counts nested subtests). A second run listed these 15 top-level failing entries:

| Group | Failing entries | Cause |
|---|---|---|
| React tests | `react-dots-opacity`, `react-readout-first-write`, `react-readout-target`, `react-solid-seamless`, `react-visibility-target` | `Cannot find module 'esbuild'` / `'typescript'`. Fix: step 4's install |
| Chrome startup | 112–114: capture / drive / turn-check "removes its profile when Chrome exits before startup" | `ENOENT … anatomy-chrome-startup-*\profile.txt`. Cause not isolated |
| drive `until` | 131–133: rejected async condition; truthiness of `true`; truthiness of `({ready:true})` | Not isolated |
| drive 3D | 141–142: `turn` poses; `orbit` visits poses | Not isolated |
| Line check | 187 "the actual middle of an arc roots a line"; 200 "rounded curve accepts its native attachment" | Not isolated |

The 10 non-React failures were not investigated. They may be Windows-specific; CI runs on macOS.

Byte-identical rebuilds: 6 of 7 buildable examples matched; `raptor-engine` showed last-digit float drift (dark page only; the Raptor `--light` page was not rebuilt). Detail: [Examples reference](../reference/examples.md).

## Troubleshooting this task

| Symptom | Fix |
|---|---|
| `Chrome exited before startup: 0` on Windows | You are in an elevated terminal; current scripts pass `--do-not-de-elevate` (CHANGELOG). Update, or use a normal terminal |
| A build changes a committed page you did not touch | Your kit change is not opt-in; restore the old default |
| Raptor page differs only in float digits | See the drift note above; compare on Node 22.11 / macOS before treating it as your change |

---
Tracks: `anatomy-main/CONTRIBUTING.md`, `anatomy-main/.github/workflows/ci.yml`, `anatomy-main/scripts/*.test.mjs`.
