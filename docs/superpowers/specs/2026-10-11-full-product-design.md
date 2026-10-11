# Full product: rules engine, skill tree, balance

Date: 2026-10-11
Branch: `feat/full-product` (on top of the uncommitted `ui/responsive` work, carried as its first commit)
Status: implemented. This document describes what was built and why.

## Intent

The user (Rubens) asked: "refactor this whole game, continue working until this game is fully
balanced, and playable, cool ui, seamless integration, skill tree … I want a full product".
He asked for it to be carried through without check-ins, so the decisions below were made
without him and are listed for him to overrule.

Decisions taken:

- **"Refactor" means separating rules from drawing**, not finishing the Preact migration. The
  migration (sub-projects 2-4 of the UI foundation spec) is a port with no player-visible
  result; a rules/view split is what balancing and a skill tree both needed.
- **"Balanced" is measured against the target already written down** in
  `ONBOARDING_WIPE_WARS.md` section 9: chapter 1 in about 2 hours, the whole game in 3-4 weeks
  of daily play. The simulator below is the instrument.
- **The skill tree is per hero**, fed by hero levels and stars, with a free reset.
- Saves stay compatible. The build still emits one self-contained `index.html`.

## Layout

```
js/data.js      every number and name. Pure.
js/state.js     the save and every rule that reads or changes it. No DOM.
js/skills.js    skill trees: data and rules. No DOM.
js/engine.js    the battle. Pure and deterministic: no DOM, no save, no timers.
js/dom.js       page helpers (elements, sound, toast, modal, tiles, reward popups)
js/battle.js    draws the fight the engine runs, and the result
js/prep.js      team and formation before a stage
js/ui/*.js      one file per legacy screen (shell, home, campaign, heroes, bag, tasks,
                calendar, friends, shop, settings, start, tutorial)
src/screens/skills/   the skill tree screen (Preact)
tools/sim/      headless simulator: load.mjs, player.js, run.mjs
tests/unit/     engine, skills, state, i18n
```

The first four files have no DOM access at all. That is the property everything else rests on:
`tools/sim/load.mjs` runs those same files in a `node:vm` context, so the simulator and the unit
tests play by the shipped rules, not by a model of them.

`core.js` and `ui.js` were split by moving text, in the same concatenation order. Rules that
lived inside screens (fuse, chest rolls, gacha pulls, idle claim, stage rewards, equip best)
moved to `state.js` as functions the screens now call.

## Battle engine

`createBattle(heroes, monsters, opt)` returns a battle. The caller advances it with
`B.step(seconds)` and reads `B.ev`, a list of events (`atk`, `dmg`, `heal`, `miss`, `mana`, `fx`,
`shield`, `die`, `ult`, `tele`, `slam`, `enrage`, `end`). `battle.js` turns events into
animation; the simulator ignores them.

- Rules advance in fixed 0.05 s steps whatever the caller's speed, so x1, x2 and x4 give the
  same fight. Damage that used to land in a `setTimeout` is scheduled in battle time.
- Randomness comes from a seeded generator: same seed, same fight.
- New rules, all in `ENG`: critical hits; bosses telegraph a slam on the whole team every 9 s;
  rare monsters ignore the tank on every third attack; after 75 s monsters enrage so no fight
  stalls; 150 s is a defeat.
- Mana from being hit is proportional to damage taken (a full health bar is 40 mana). It was a
  flat amount per hit, which let a tank under five monsters cast every 2.5 s.

## Skill tree

- Points: 1 per hero level-up, 2 per star. Reset is free.
- A tree is three branches of three nodes, three ranks each (27 points), shared by the hero's
  class (tank, damage, support). A node opens when the one above has 2 ranks.
- Each hero also has two keystones of their own, which change their ultimate or attacks. One
  can be active; it costs 2 points and needs 12 spent in the tree. 24 keystones in all.
- A full tree is 29 points: level 30, or sooner with stars.
- Nodes are data (`m` = what changes, `v` = amount per rank). Health and attack apply in
  `heroStats`, so Power shows them; the rest are read by the engine. Keystones are looked up by
  id in `engine.js`.
- Screen: `src/screens/skills`, opened from the hero card. The Heroes nav button shows a dot
  while a team hero has unspent points, and a defeat says so when that is the case.

## Balance

Instrument: `npm run sim` (`tools/sim/run.mjs`).

- `pace`: simulated players (three play styles) through whole campaigns, using the real reward,
  cost and battle functions. Reports the day each chapter falls and the longest wait on a stage.
- `heroes`: a strength index per hero at equal investment: how much stronger the monsters can
  be before a team with that hero wins half its fights.
- `curve`: the level a plain team needs per stage.

Before: every style cleared the campaign on day 1 or 2. One Rare drop was worth 20 stages
(gear multiplied by 1.7 per level over 12 levels), and replaying a stage paid 10 times idle.

What changed (all in `ECON`, `KINDS`, `HEROES`, `ENG`):

| Area | Before | After |
|---|---|---|
| Gear | x1.7 per item level | x1.32 per level |
| Chaos | replay pays in full | replay pays 25%; idle income raised |
| Replay XP | 12% of first clear | 1.5% |
| Monsters | compounding growth | linear per stage, one multiplier per chapter (`chapMul`) |
| Monster mix | short burst fights | more health, less attack: fights last 20-30 s |
| Bosses | 3.2x an elite | about 2x an elite, plus the slam |
| Heroes | Lucão unusable, supports dominant | within about 10% at equal investment |

Result: see the table in "Measured result" at the end of this file.

Where to turn the dials: `ECON.chapMul` moves a whole chapter earlier or later; `monHpLin` and
`monAtkLin` set the slope inside a chapter; `xpNeed` and `firstClearXp` set how fast the level
cap rises; `idlePerStage` sets Chaos. Re-run `npm run sim pace` after any change.

## Also changed

- Formation screen: a scouting report. The engine rehearses the fight 20 times with the current
  team and shows the win chance.
- Result screen: damage dealt and healing done per hero; a defeat names the most useful next step.
- The chosen language survives a reload (`lang` was missing from the save template).
- Mail "Claim all" dropped the recruit tickets chapter mails carry. Fixed.
- A save from before this change gets one mail (300 Divine, 5 tickets, a silver key): its gear
  is worth less under the new curve.
- `js/battle_old.js` removed (dead code).

## Testing

- `tests/unit`: the engine (determinism, endings, options, events), skill rules, economy rules,
  and a translation test that walks every player-visible string in the data and fails on any
  without a Portuguese entry.
- `tests/e2e`: the skill tree flow, the scouting report, a new player from the title screen to a
  first victory, and language persistence, on top of the existing smoke and screenshot suites.
- `npm run verify` runs typecheck, unit tests, build and e2e.

## Not done

- The Preact migration of the remaining screens (see the foundation spec).
- Art: skill icons are simple vector glyphs, not pixel art, and have not been through Jacquin.
- The simulator's player is a greedy bot. It does not model a human forgetting to spend points
  or choosing a weak team, so real players will be somewhat slower than the table.
- Tower, PvP and the other roadmap features.
