# UI migration to Preact, sub-project 1: Foundation

Date: 2026-10-11
Branch: `ui/refactor`
Status: design approved in chat ("just go"), spec not separately reviewed

Amended during planning (same day): legacy files stay in `js/` (no `legacy/` move); `css/style.css`
is injected raw by the build plugin and no tokens file is created yet; only `syncCur` is wrapped
for reactivity (`persist` fires constantly in battle); `build.py` is deleted at the end of this
sub-project because it would otherwise build a game with a blank Mail screen; pixel screenshots
are a local gate and CI runs the smoke test only, since snapshots are machine-specific. Where the
sections below disagree with this paragraph, this paragraph wins. The plan is authoritative.

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
legacy/                 js/*.js moved unchanged with git mv (except ui.js mail block removed)
src/
  main.tsx              entry: checks bridge, registers migrated screens
  bridge/
    legacy.d.ts         ambient types for the legacy globals used by src/
    store.ts            version signal, useSave(), hooks into persist/syncCur
    mount.tsx           registerScreen(id, mountPointId, Component) + error boundary
  components/           Icon, Button, Panel, Chips, EmptyState
  screens/mail/         Mail.tsx, actions.ts, actions.test.ts
  styles/tokens.css     the existing :root variables
css/style.css           unchanged, imported globally (tokens moved out)
build/legacy-plugin.ts  Vite plugin replacing build.py
tests/e2e/              Playwright smoke + screenshots
index.html              same markup; /*CSS*/ and /*JS*/ placeholders replaced by plugin tags
```

`js/battle_old.js` is not in the build order today and is left where it is.

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
- The Preact entry is a module script, inlined by `vite-plugin-singlefile`. Module scripts are
  deferred, so it always runs after the legacy script.
- In `vite dev` the plugin serves the same legacy script and style, rebuilt on file change with
  a full page reload.

`build.py` is kept in this sub-project as the reference for the screenshot baseline.

## Bridge

Legacy top-level `const`/`let`/`function` names are visible to module code as bare identifiers.
`legacy.d.ts` declares only the ones `src/` uses: `save`, `DRAW`, `ICO`, `KEYI`, `comma`,
`give`, `persist`, `syncCur`, `showRewards`, `openScreen`, `curScreen`.

`store.ts`:

- `version`: a `@preact/signals` signal.
- `initStore()`: asserts each required global exists and throws `Legacy global missing: <name>`
  otherwise; wraps `syncCur` so each call bumps `version`. `syncCur` is a function declaration,
  so it is reassignable, and legacy calls it after every currency or badge change.
  `persist` is wrapped the same way.
- `useSave()`: reads `version.value` (subscribing the component) and returns `save`.
- `touch()`: bumps `version` for actions that change state without calling either.

`mount.tsx`:

- `registerScreen(id, mountId, Component)` sets `DRAW[id]` to a function that renders
  `<ErrorBoundary><Component/></ErrorBoundary>` into `#mountId` and bumps `version`. Legacy
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

`css/style.css` stays one global stylesheet with unchanged class names. The `:root` block
moves to `src/styles/tokens.css`. No other CSS changes in this sub-project.

## Testing

Order matters: the baseline is captured before any file moves.

- Playwright (`tests/e2e`), Chromium, viewports 360x640, 390x844, 480x900.
  - Determinism: `?skiptitle`, a fixed save written to localStorage by `addInitScript`,
    `page.clock` fixed, `window.NOCUT=1`, animations disabled, fonts awaited.
  - `screens.spec.ts`: for each screen id, `openScreen(id)` then `toHaveScreenshot`. Home and
    fight are excluded from pixel comparison (random idle scene, live battle) and covered by
    the smoke test instead.
  - `smoke.spec.ts`: every screen in EN then PT, `startStage(1)` run to a result, mail claim
    one and claim all; fails on any `console.error` or `pageerror`. In PT, asserts the mail
    screen shows the translated strings.
  - The project has two targets: `baseline` serves the `build.py` output and writes
    snapshots; `vite` serves `dist/index.html` and compares against them.
- Vitest: `store.test.ts` (version bumps on wrapped calls, missing-global error) and
  `actions.test.ts`, written test-first.

## CI

`.github/workflows/pages.yml`: Node 22, `npm ci`, `npm run typecheck`, `npm test`,
`npm run build`, Playwright smoke and screenshots, upload `dist/`. Triggers and the
deploy-on-main behaviour are unchanged. Snapshots are generated on Linux and committed.

## Docs

Update build instructions in `HANDOFF.md`, `ONBOARDING_WIPE_WARS.md`,
`.claude/skills/art-pipeline/SKILL.md`, `.claude/skills/wipewars-i18n/SKILL.md` and
`.claude/launch.json` references to `python build.py` / `js/*.js` paths.

## Out of scope

Other screens, visual changes, `lang.js`/`core.js`/`battle.js` internals, removing
`build.py` or `js/battle_old.js`, pushing or publishing.

## Risks

- A bundler touching legacy code would break global bindings. Mitigation: the plugin injects
  it as raw text after bundling; a test asserts the built file contains the legacy source
  verbatim.
- Font loading and animation can make screenshots flaky. Mitigation: determinism list above;
  a flaky screen is fixed at the source, not given a looser threshold.
- CI font rendering may differ from this machine. Mitigation: if it does, snapshots are
  regenerated in CI from the `build.py` target in the same job, so the comparison is always
  same-machine.
