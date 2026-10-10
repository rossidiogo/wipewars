# UI migration to Preact, sub-project 1: Foundation

Date: 2026-10-11
Branch: `ui/refactor`
Status: implemented on `ui/refactor` (2026-10-11). This document describes what was built.

## Intent

The owner of this change (Rubens) asked for a full refactor of the Wipe Wars UI onto a
framework. Chosen in brainstorming:

- Stack: Preact + Vite + TypeScript.
- Strategy: incremental, screen by screen, game playable and shippable after every step.

Assumptions stated to the user and not corrected:

- Same look. Screens are ported, not redesigned.
- The `wipewars` localStorage save and its migrations stay compatible.
- The build still emits one self-contained `index.html`.

## Whole-migration decomposition

| # | Sub-project | Contents |
|---|---|---|
| 1 | Foundation (this spec) | Toolchain, legacy bundling, bridge, tests, CI, Mail screen as proof |
| 2 | Menu screens | Tasks, shop, bag, heroes, campaign, settings, friends, guild, calendar, home shell, nav, header |
| 3 | Game-flow screens | Recruit, formation, battle HUD and result, title, tutorial, lab. Battle field stays imperative |
| 4 | Core and i18n | `core.js` to typed modules, key-based translation, delete bridge and `legacy/` |

Each later sub-project gets its own spec and plan.

## Success criteria for sub-project 1

1. `npm run build` writes a single self-contained `dist/index.html` that plays the game.
2. Every screen renders the same as the `build.py` output: Playwright screenshots of the Vite
   build match baselines captured from the `build.py` build, at three viewport sizes, in EN.
3. Mail is rendered by Preact; its block in `ui.js` is deleted; behaviour is unchanged
   (claim one, claim all, empty state, rewards modal, badge, PT translation).
4. A smoke test opens every screen in EN and PT and plays one stage with zero console errors.
5. The Pages workflow builds with Node, runs the tests, and deploys only from `main`.
6. Project docs and skills that tell agents how to build are updated.

## Layout

```
js/, css/style.css      legacy game, unchanged except the Mail block removed from ui.js
src/
  main.tsx              entry: checks the bridge, registers migrated screens
  bridge/
    legacy.d.ts         ambient types for the legacy globals used by src/
    store.ts            version signal, useSave(), hook into syncCur
    mount.tsx           registerScreen(id, mountId, Component) + error boundary
  components/           Icon, Button, Panel, Chips, EmptyState
  screens/mail/         Mail.tsx, actions.ts and their tests
build/
  legacy-plugin.ts      injects legacy JS, CSS and base64 assets (replaces build.py)
  single-file-plugin.ts inlines the bundled module into index.html
tests/e2e/              Playwright smoke + screenshots
index.html              same markup; <!--LEGACY_CSS--> and <!--LEGACY_JS--> placeholders
```

Legacy files were left in `js/` rather than moved: every doc, skill and art tool refers to
those paths, and moving them buys nothing until they are converted.

## Build

`build/legacy-plugin.ts` reproduces `build.py`:

- Generated constants, in this order: `AVA` (from `assets/ava_*.png`), `LOGO`
  (`assets/logo.png`), `BGCH` (`assets/bg_ch.json` keys 0-4), `ICO` (`assets/icons2.json`),
  `SPD` (`assets/sprites2.json`).
- Legacy files concatenated in the `build.py` order:
  `core, lang, art, battle, ui, recruit, cuts, net, account, guild, music, title, lab`.
- Generated CSS variables `--cTL --cTR --cBL --cBR --bgimg --bgfield`, same SVG and values.
- The result is injected as one inline classic `<script>` at the end of `<body>` (where
  `/*JS*/` is now) and one inline `<style>`. Legacy code is not parsed, transformed or minified,
  so its global lexical bindings (`const save`, `const DRAW`, ...) behave exactly as today.
- The Preact entry is a module script, inlined by `build/single-file-plugin.ts` (own code:
  the third-party single-file plugin pulled in a dependency with an unfixed advisory). Module
  scripts are deferred, so it always runs after the legacy script.
- In `vite dev` the plugin serves the same legacy script and style, rebuilt on file change with
  a full page reload.

`build.py` served as the reference (screenshot baseline and a byte-level parity test of the
generated script and stylesheet), then was deleted: with Mail's legacy block gone it would
have built a game with a blank Mail screen.

## Bridge

Legacy top-level `const`/`let`/`function` names are visible to module code as bare identifiers.
`legacy.d.ts` declares only the ones `src/` uses: `save`, `DRAW`, `ICO`, `KEYI`, `comma`,
`give`, `persist`, `syncCur`, `showRewards`, `openScreen`, `curScreen`.

`store.ts`:

- `version`: a `@preact/signals` signal.
- `initStore()`: asserts each required global exists and throws `Legacy global missing: <name>`
  otherwise; wraps `syncCur` so each call bumps `version`. `syncCur` is a function declaration,
  so it is reassignable, and legacy calls it after every currency or badge change.
  `persist` is not wrapped: it fires many times a second during battles.
- `useSave()`: reads `version.value` (subscribing the component) and returns `save`.
- `touch()`: bumps `version` for actions that change state without calling either.

`mount.tsx`:

- `registerScreen(id, mountId, Component)` sets `DRAW[id]` to a function that renders
  `<ErrorBoundary><Component/></ErrorBoundary>` into `#mountId`. Legacy
  `openScreen(id)` already calls `DRAW[id]()`, and other legacy code calling `DRAW.mail()`
  keeps working.
- The error boundary shows the error message and a "Back to home" button calling
  `openScreen('home')`.

## Mail screen

Mounts into `#mailBody`. The header (back, title, currency pills) stays legacy in this
sub-project; it moves with nav in sub-project 2. This narrows the chat design, which listed a
`ScreenHeader` component here.

DOM emitted must equal the legacy DOM: same elements, classes and order, and one text node
where legacy had one (`` {`${n} unclaimed`} ``, not `{n} unclaimed`), because `lang.js`
translates per text node by exact match.

`actions.ts`, pure with respect to the DOM:

- `unclaimed(save)`: mails with `claimed` false.
- `mergeRewards(mails)`: sums `gold`, `gems`, `keys`, concatenates `tiers`, as legacy does.
- `claimMail(save, mail)`: sets `claimed`, returns `mail.rewards`.
- `claimAll(save)`: marks all unclaimed, returns merged rewards.

The component calls the action, then legacy `give(rewards)`, `syncCur()`, and
`showRewards(title, out)`, in the legacy order. `give` persists.

Mail `title` and `body` are rendered as HTML, as legacy does, since they come from game code
via `sendMail`, never from another player.

## Styling

`css/style.css` stays one global stylesheet with unchanged class names, injected raw by the
legacy plugin. A tokens file and per-screen CSS are deferred to sub-project 2.

## Testing

- Playwright (`tests/e2e`), Chromium, against the production build in `dist/`.
  - Determinism: `?skiptitle`, a known save, fixed `Date`, seeded `Math.random`,
    `window.NOCUT=1`, web fonts stubbed, CSS animations disabled, sprite canvases pinned to
    idle frame 0 (`freezeSprites`).
  - `screens.spec.ts`: a full-viewport screenshot per screen and tab at 360x640, 390x844 and
    480x900. Home and fight are excluded (random idle scene, live battle). The snapshots were
    captured from the `build.py` output before any code moved, and the Vite build with Preact
    Mail matches them without an update. Snapshots are machine-specific, so this spec is
    skipped in CI.
  - `smoke.spec.ts`: every screen in EN and PT, a stage played to its result, mail claim one
    and claim all, and a language switch with Mail open; fails on any console error.
- Vitest: build plugins, bridge store and mounting, mail actions and the Mail component.
- `npm run verify` runs typecheck, unit tests, build and e2e.

## CI

`.github/workflows/pages.yml`: Node 22, `npm ci`, typecheck, unit tests, build, Playwright
smoke, upload `dist/`. Triggers and deploy-on-main are unchanged. Not yet exercised: the
workflow only runs on `main`.

## Docs

Update build instructions in `HANDOFF.md`, `ONBOARDING_WIPE_WARS.md`,
`.claude/skills/art-pipeline/SKILL.md`, `.claude/skills/wipewars-i18n/SKILL.md` and
`.claude/launch.json` references to `python build.py` / `js/*.js` paths.

## Out of scope

Other screens, visual changes, `lang.js`/`core.js`/`battle.js` internals, removing
`js/battle_old.js`, pushing or publishing.

## Known issues found, not fixed here

- The chosen language does not survive a reload: `core.js` only restores save keys present in
  `DEF()`, and `lang` is not one of them. Pre-existing; a `core.js` change.
- A mounted Preact screen re-renders on every `syncCur`, including the once-a-second call from
  the home screen while it is hidden. Negligible for Mail; gate on the active screen in
  sub-project 2 before many screens are mounted.
