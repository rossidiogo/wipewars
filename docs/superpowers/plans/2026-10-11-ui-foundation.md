# UI Foundation (Preact migration, sub-project 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Wipe Wars with Vite + Preact + TypeScript alongside the untouched legacy scripts, prove visual parity with the `build.py` output, and migrate the Mail screen as the first Preact screen.

**Architecture:** A Vite plugin injects the legacy JS and CSS into `index.html` as raw inline text, exactly as `build.py` does, so legacy globals keep working. A Preact module script loads after it and replaces `DRAW[id]` entries for migrated screens through a typed bridge. Playwright screenshots captured from the `build.py` build are the parity gate.

**Tech Stack:** Vite, TypeScript, Preact, @preact/signals, vite-plugin-singlefile, Vitest + jsdom, @playwright/test (Chromium).

**Spec:** `docs/superpowers/specs/2026-10-11-ui-foundation-design.md`

## Global Constraints

- Legacy files in `js/` and `css/style.css` are not transformed, minified or reordered by the build. Build order: `core, lang, art, battle, ui, recruit, cuts, net, account, guild, music, title, lab`.
- Generated constants order: `AVA, LOGO, BGCH, ICO, SPD`. Generated CSS vars: `--cTL --cTR --cBL --cBR --bgimg --bgfield`, prepended to `style.css`.
- Output is one self-contained `dist/index.html`.
- No visual change. No change to `lang.js`, `core.js`, `battle.js`.
- Preact output for a migrated screen has the same elements, classes and order as legacy, and one text node where legacy had one (use template strings for mixed text).
- Save format (`localStorage['wipewars']`) is untouched.
- String replacement of large blobs uses function replacers (legacy code contains `$'` and `$&`).
- No push, no publish.

## Review Focus

1. Legacy script contains `</script>`-like or `$`-pattern text and gets corrupted on injection: built file must contain each legacy file verbatim (Task 2 test).
2. A legacy global is missing or renamed: startup must throw `Legacy global missing: <name>`, not render blank (Task 3 test).
3. Mail with no `keys` or `tiers` in rewards, and claim-all with zero unclaimed: no throw, zeroed totals (Task 4 tests).
4. Player switches language while Mail is open: screen re-renders translated, and back (Task 4 e2e).
5. A migrated screen throws while rendering: error boundary shows message and "Back to home" works (Task 3 test).

---

### Task 1: Test harness and baseline from the current build

**Files:**
- Create: `package.json`, `playwright.config.ts`, `tests/e2e/fixtures.ts`, `tests/e2e/screens.spec.ts`, `tests/e2e/smoke.spec.ts`
- Modify: `.gitignore` (add `node_modules/`, `dist/`, `test-results/`, `playwright-report/`, `.baseline/`)

**Interfaces:**
- Produces: `npm run e2e:baseline` (builds `.baseline/index.html` with `python3 build.py`, serves it, runs screenshots with `--update-snapshots` plus smoke); `npm run e2e` (serves `dist/`, compares). Target chosen by env `WW_TARGET=baseline|vite`. Fixture `test` exporting a `page` already booted via `boot(page, {lang})`.

- [ ] **Step 1:** `npm init`, install `@playwright/test` (version whose Chromium is already in `~/.cache/ms-playwright`; install the browser only if none matches).
- [ ] **Step 2:** `fixtures.ts`: `boot(page, {lang?: 'en'|'pt'})`:
  - abort requests to `fonts.googleapis.com` and `fonts.gstatic.com`;
  - `page.clock.setFixedTime('2026-01-15T12:00:00')`;
  - `addInitScript`: seeded `Math.random` (mulberry32, seed 1), `window.NOCUT=1`;
  - collect `console.error` and `pageerror` into an array exposed as `errors`;
  - first visit `/?skiptitle`, then in page: `save.name='Tester'`, mark every `TIPS` key seen in `save.tut`, `save.cleared=3`, `save.gold=50000`, `save.gems=2000`, set `save.lang`, `persist()`, reload;
  - wait for `document.fonts.ready`.
- [ ] **Step 3:** `screens.spec.ts`: one test per entry, at viewports 360x640, 390x844, 480x900 (Playwright projects), `toHaveScreenshot(name, {animations:'disabled', mask:[page.locator('canvas')]})` of `#app`. Entries: `campaign`, `prep` (via `openPrep(1)`), `recruit`, `heroes`, `bag`, `shop` x tabs `deals|chests|gold|gems` (set `shopTab` then `openScreen('shop')`), `tasks` x `daily|ach`, `cal`, `mail`, `guild`, `friends`, `settings`. Skipped when `process.env.CI` (snapshots are machine-specific).
- [ ] **Step 4:** `smoke.spec.ts`: for `en` and `pt`: open every screen id including `home` and `fight` (`startStage(1)`, wait for `#result.on`, up to 90 s at `speed` x2 set via `#spd` click); expect `errors` empty. Mail flow test: claim first mail, close modal, claim all, expect `0 unclaimed` (EN) and `/para resgatar/` (PT), gold increased by the mail's gold.
- [ ] **Step 5:** Run `npm run e2e:baseline` twice. Expected: second run passes with no snapshot diffs (proves determinism). Fix nondeterminism at its source before continuing.
- [ ] **Step 6:** Commit harness and snapshots.

### Task 2: Vite build with legacy injection, parity proven

**Files:**
- Create: `vite.config.ts`, `tsconfig.json`, `build/legacy-plugin.ts`, `build/legacy-plugin.test.ts`, `src/main.tsx` (empty entry: a comment only)
- Modify: `index.html` (`<style>/*CSS*/</style>` -> `<!--LEGACY_CSS-->`; `<script>/*JS*/</script>` -> `<!--LEGACY_JS-->`; add `<script type="module" src="/src/main.tsx"></script>` before `</body>`), `package.json` scripts (`dev`, `build`, `typecheck`, `test`, `e2e`)

**Interfaces:**
- Produces: `legacyCss(root: string): string`, `legacyJs(root: string): string`, `legacyPlugin(): Plugin` from `build/legacy-plugin.ts`. `LEGACY_ORDER` exported const.

- [ ] **Step 1: Failing tests** (`legacy-plugin.test.ts`, Vitest, node env):
  - `legacyJs(root)` starts with `const AVA=` and contains, in order, `const LOGO="data:image/png;base64,`, `const BGCH=`, `const ICO=`, `const SPD=`, then every `js/<name>.js` content verbatim in `LEGACY_ORDER`.
  - `legacyCss(root)` starts with `:root{--cTL:url("data:image/svg+xml,` and ends with the verbatim content of `css/style.css`.
  - Parity: run `python3 build.py <tmp>`; the `<style>` body equals `legacyCss(root)` and the `<script>` body equals `legacyJs(root)` byte for byte, except JSON whitespace: compare after `JSON.parse` of each generated constant, and compare the legacy source tail as raw text. (Python `json.dumps` uses `", "`/`": "` separators; emit the same separators so the comparison can be exact where practical.)
- [ ] **Step 2:** Run, expect failure (module missing).
- [ ] **Step 3:** Implement. `corner()` SVG and `quote()` semantics copied from `build.py` (Python `urllib.parse.quote` leaves `/` and unreserved characters unescaped). Plugin: `transformIndexHtml` with `order:'post'` replacing both placeholders using function replacers; `configureServer` watches `js/`, `css/`, `assets/` and sends `full-reload`. `vite.config.ts`: `preact()` preset, `legacyPlugin()`, `viteSingleFile()`.
- [ ] **Step 4:** Unit tests pass; `npm run build` produces only `dist/index.html`; a test asserts `dist/index.html` contains `legacyJs(root)` verbatim.
- [ ] **Step 5:** `npm run e2e` (target vite). Expected: all screenshots match Task 1 baselines, smoke passes.
- [ ] **Step 6:** Commit.

### Task 3: Bridge

**Files:**
- Create: `src/bridge/legacy.d.ts`, `src/bridge/store.ts`, `src/bridge/store.test.ts`, `src/bridge/mount.tsx`, `src/bridge/mount.test.tsx`
- Modify: `src/main.tsx`, `vite.config.ts` (Vitest `environment: 'jsdom'` for `src/`)

**Interfaces:**
- Produces:
  - `legacy.d.ts`: ambient `save: Save` (let), `DRAW: Record<string, () => void>`, `ICO: Record<string,string>`, `KEYI: Record<string,string>`, `comma(n:number):string`, `give(r: Rewards): RewardOut`, `syncCur():void`, `showRewards(title:string,out:RewardOut,sub?:string):void`, `openScreen(id:string):void`. Types `Mail {id:number,title:string,body:string,rewards:Rewards,claimed:boolean,t:number}`, `Rewards {gold?:number,gems?:number,tix?:number,xp?:number,keys?:Record<string,number>,tiers?:number[]}`.
  - `store.ts`: `version: Signal<number>`, `initStore(): void`, `useSave(): Save`, `touch(): void`. `REQUIRED_GLOBALS: string[]`.
  - `mount.tsx`: `registerScreen(id: string, mountId: string, C: ComponentType): void`, `ErrorBoundary`.

- [ ] **Step 1: Failing tests.**
  - `initStore()` throws `Legacy global missing: give` when `give` is not stubbed (others stubbed with `vi.stubGlobal`).
  - After `initStore()`, calling `globalThis.syncCur()` calls the original once and increments `version.value` by 1.
  - Calling `initStore()` twice does not double-wrap (one increment per call).
  - `registerScreen('x','mx',C)` sets `DRAW.x`; calling it renders `C` into `#mx`.
  - A `C` that throws renders text containing the error message and a button; clicking it calls `openScreen('home')`.
- [ ] **Step 2:** Run, expect failures.
- [ ] **Step 3:** Implement. Globals are read as bare identifiers via `globalThis` lookup helper `g(name)` only for the existence check; `syncCur` is wrapped by assigning `globalThis.syncCur`. `main.tsx` calls `initStore()`.
- [ ] **Step 4:** Unit tests and `npm run typecheck` pass; `npm run build && npm run e2e` still green.
- [ ] **Step 5:** Commit.

### Task 4: Mail screen

**Files:**
- Create: `src/components/Icon.tsx`, `Button.tsx`, `Panel.tsx`, `Chips.tsx`, `EmptyState.tsx`, `src/screens/mail/actions.ts`, `actions.test.ts`, `Mail.tsx`, `Mail.test.tsx`
- Modify: `src/main.tsx` (`registerScreen('mail','mailBody',Mail)`), `js/ui.js` (delete the `/* ---------- mail ---------- */` block, lines 421-441)

**Interfaces:**
- Consumes: Task 3 exports.
- Produces: `unclaimed(s: Save): Mail[]`, `mergeRewards(ms: Mail[]): Required<Pick<Rewards,'gold'|'gems'|'keys'|'tiers'>>`, `claimMail(m: Mail): Rewards`, `claimAll(s: Save): Rewards`.
  Components: `Icon({name, size?})` -> `<img class="ic {size}" src={ICO[name==='gems'?'gem':name]} alt="">`; `Button({variant?: 'primary'|'danger', small?, wide?, disabled?, onClick, children})` -> `.btn`; `Panel({class?, children})` -> `.panel`; `Chips({rewards})` -> the `.chip` spans of legacy `chips()` in the same order (gold, gems, tix, keys, xp, tiers); `EmptyState({children})` -> `.empty-msg`.

- [ ] **Step 1: Failing tests.**
  - `mergeRewards` of `[{gold:100,keys:{b:3}},{gems:300,gold:50,keys:{s:1,b:1}}, {}]` -> `{gold:150,gems:300,keys:{b:4,s:1},tiers:[]}`.
  - `claimAll` on a save with none unclaimed -> `{gold:0,gems:0,keys:{},tiers:[]}` and nothing mutated.
  - `claimMail` sets `claimed` and returns that mail's rewards object.
  - `Mail` rendered with two unclaimed mails: `.bagbar span` has exactly one child text node `2 unclaimed`; two `.panel.mailr`; each has `.mh b`, `.mh small`, `.sub`, `.chips`, and a `button.btn.sm.primary` with text `Claim`.
  - Clicking a mail's Claim calls `give` with its rewards, then `syncCur`, then `showRewards(title, out)`, in that order; the row gets class `done`, button text `Claimed`, disabled, no `primary`.
  - Empty `save.mail` renders `.empty-msg` with `No mail.` and a disabled `Claim all`.
- [ ] **Step 2:** Run, expect failures.
- [ ] **Step 3:** Implement to match the legacy block being deleted (date via `new Date(m.t).toLocaleDateString()`, title and body as HTML).
- [ ] **Step 4:** Delete the legacy mail block from `js/ui.js`. Unit tests pass.
- [ ] **Step 5:** `npm run build && npm run e2e`. Expected: every screenshot including `mail` matches the Task 1 baseline with no snapshot update; smoke mail flow passes in EN and PT; add a smoke step that toggles language with Mail open and checks the bar text changes both ways.
- [ ] **Step 6:** Commit.

### Task 5: CI, docs, retire build.py

**Files:**
- Modify: `.github/workflows/pages.yml`, `HANDOFF.md`, `ONBOARDING_WIPE_WARS.md`, `.claude/skills/art-pipeline/SKILL.md`, `.claude/skills/wipewars-i18n/SKILL.md`, `.claude/launch.json`, `FEATURES_ROADMAP.md` (only lines that give build instructions), `package.json` (drop `e2e:baseline`), `build/legacy-plugin.test.ts` (drop the `build.py` parity case)
- Delete: `build.py`

- [ ] **Step 1:** Workflow: `actions/setup-node@v4` Node 22 with npm cache; `npm ci`; `npm run typecheck`; `npm test`; `npm run build`; `npx playwright install --with-deps chromium`; `npm run e2e -- smoke`; upload `dist`. Triggers, permissions and deploy job unchanged.
- [ ] **Step 2:** Docs: replace `python build.py test.html` instructions with `npm install`, `npm run dev`, `npm run build`, `npm test`, `npm run e2e`; add a short "UI migration" note pointing at the spec and stating that new screens go in `src/screens/` and legacy screens stay in `js/ui.js` until migrated. Grep for `build.py` afterwards: only historical changelog lines may remain.
- [ ] **Step 3:** Delete `build.py`; full run: `npm run typecheck && npm test && npm run build && npm run e2e`. Expected: all green.
- [ ] **Step 4:** Commit.
