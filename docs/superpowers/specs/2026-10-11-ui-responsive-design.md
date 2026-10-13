# Responsive layout: tablet and desktop

Date: 2026-10-11
Branch: `ui/responsive` (on top of `main` at `396a220`)
Status: implemented on `ui/responsive`, uncommitted; result not yet reviewed by the user

## Intent

The game is a fixed phone column: `#app` is capped at 480px and centred, so tablets and
desktops show a phone-sized strip with empty space either side. The user asked for the site
to be responsive and chose, from the options offered:

- real tablet and desktop layouts, not a scaled-up phone column;
- a left side rail with wide content, and battle split into field and controls.

Assumptions stated to the user and not corrected:

- Phones look exactly as today.
- No visible text changes, so no translation work.
- The build still emits one self-contained `index.html`.

## Breakpoints

| Width | Layout |
|---|---|
| under 700px | Today's phone layout, untouched. |
| 700-899px | Column widens to fill the window, bottom nav stays, grids gain columns. |
| 900px and up | Left rail replaces the bottom nav; content up to about 1100px wide, centred; full window height (the 900px height cap goes). |

## Per screen, at 900px and up

- **Nav**: `#nav` becomes a vertical rail about 88px wide. The raised round Battle button
  becomes a normal rail item.
- **Menu screens**: hero and bag tile grids already auto-fill. Shop deals, calendar days,
  campaign nodes, tasks and mail go to more columns. The hero detail card puts portrait and
  stats beside equipment.
- **Battle**: the field sits on the left, sized by height so it never needs scrolling;
  ultimates and the enemy list go in a right column.
- **Prep**: formation grid on the left; team, enemies and rewards on the right.
- **Home**: the scene already re-measures on resize and covers the area. The top bar,
  currency pills and the Battle/idle panel get a max width so they do not stretch.
- **Overlays**: title, tutorial tip (Julia), recruit reveal, modal and toast are sized with
  `vw` or pinned to the window. They are anchored to the content area instead.

## How

- **CSS**: one "wide layouts" block of media queries at the end of `css/style.css`, using the
  existing classes and tokens. No markup changes are expected.
- **JS**: `js/battle.js` measures the field width only when a battle starts (`FS`), so a
  resize or rotation mid-battle leaves sprites the wrong size. A resize handler rescales them.

## Out of scope

- Landscape phones and phones narrower than 360px.
- Any redesign of the pixel-art scenes (battle field, cutscenes, pull reveal).

## Verification

- Two new Playwright screenshot projects: 820x1180 (tablet) and 1280x800 (desktop); home and
  battle are added to the shots.
- The three phone baselines (360x640, 390x844, 480x900) must pass unchanged.
- The smoke test (every screen, EN and PT, one played stage) also runs at 1280x800.
- The new screenshots are inspected by eye.

## What was built differently from the design

- **The rail follows the existing nav rule.** It shows on the five screens that had the bottom
  nav (home, heroes, bag, shop, tasks). Battle, prep and the screens with a Back button have no
  rail and use the full width, as on phones. The design sketch showed a rail beside the battle;
  leaving a battle through the nav would skip the Flee cleanup, so it was not added.
- **Home and title show the scene as a centred band.** The backdrop is portrait pixel art;
  stretched to cover a landscape window it cropped to the floor and pushed the heroes off the
  top. `layoutHome` (`js/ui.js`) now stops growing the scene once 450 of its 693 rows are
  visible and centres it over a blurred copy of the same art. Phones never reach that limit.
- **Calendar, recruit, guild, friends and settings** are a centred 720px column rather than
  multi-column: their rows read worse stretched to 1100px.
- **Campaign chapters wrap as flex rows**, not a grid: grid rows mis-measured the round stage
  nodes (height from `aspect-ratio`) and the chapters overlapped.
- **Mid-battle resize** scales the units with a `--fz` variable on `.field`. Effects already in
  flight when the window changes size keep their old size until they end.
