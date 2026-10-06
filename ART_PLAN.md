# Wipe Wars - Master Art Plan (one-week Nano Banana 2 Lite window, ends 2026-10-13)

Goal: ALL art for the game (current + known future) generated once, approved by **Jacquin** (`.claude/agents/jacquin.md`), integrated into the game. No second paid membership.

## How the pipeline works
1. Claude writes a self-contained prompt (the AI makes ONE image per prompt, so every prompt repeats the style-lock text from `art_gen/STYLE_BIBLE.md`).
2. Claude generates it on use.ai (Images, Nano Banana 2 Lite, 1:1), downloads the PNG to `art_gen/out/` (git-ignored).
3. Code step: remove flat background, snap to a true pixel grid, reduce to the shared roster palette, anchor feet, export to the game's sprite format.
4. **Jacquin** scores it. APPROVED -> copied to `art_gen/approved/` and wired into the game. REJECTED -> fix in code or regenerate with his prompt delta (max 4 tries, then change approach).
5. Animation is done in code from the single approved image (idle bob/squash, attack lunge, hit flash, death), so one image per character is enough.
6. Efficiency: icons/UI/cutscene props are generated as sheets (many items in one image) and cut apart by code.

## Inventory (what exists today -> what we need)
### Heroes (12 playable + Julia)
Jack (tank), Rafinha (tank), Lucao (tank), Copello (ranged), Daniel (ranged summoner), Chavoso (ranged deadeye), Malaguti (melee brawler), Glem (melee druid/tiger), Samuel (melee hacker), Rubens (support), Ze Vitor (support buff), Donnie (support curse). + replacement for Flavio (he left; placeholder `sup`).
Per hero: full-body battle sprite, portrait/avatar bust (+ 2 alt expressions), ultimate skill icon, gacha card art (rarity frame art), ultimate VFX props (sheet).
Julia: tutorial character, 4 expressions (idle/talk/blink/wave) + small bust.
### Monsters and bosses (15)
Ch1 Bathroom: Toilet Paper, Clorox Wipes, Big Head v1. Ch2 Deep Freeze: Frozen Condom, Permafrost Prophylactic, Big Head v2. Ch3 Workshop: Sandpaper Belt, Belt Sander, Big Head v3. Ch4 Car Ride: Burnt Mini Pizza, Dropped Pizza, Big Head v4. Ch5 Basement: 2 monsters TBD + Big Head v5 (mega brain).
### Backgrounds / scenes
Home (wide + tall), 5 chapter battle backdrops (bathroom, deep freeze/laundry, workshop, car, basement), title screen, loading screen, gacha portal scene, guild hall, shop front.
### Icons (sheets)
Existing 44 to be redone: currencies (Chaos, Divine), keys x3, chests x3 (closed/open), gear 5 types x 4 tiers, nav icons (heroes, bag, shop, battle, tasks, calendar, mail, guild, friends, settings, hourglass, gift, lock, star, check), ticket.
New: jewelry slots (ring, amulet, belt), set icons (Bulwark/Fury/Mercy), shards, stars, rarity gems, role icons (tank/dps/support), status-effect icons (atk up, stun, curse, grow, tiger, heal, shield), achievement badges, daily-task icons, shop banners, event icons, calendar day cards.
### UI kit
Panel frames, buttons (normal/pressed/disabled), tab bar, HP/mana/XP bars, rarity borders x4, hero cards, popup/tooltip frames, list rows, toggles, sliders, scroll bars, pull-reveal portal frame, damage-number font look, logo, title text.
### Cutscenes
Panels for the 5 chapter intros (4-6 panels each), boss-defeat panels, ending panel.

## Future-proofing (generated now so we never pay again)
Roster slots for 4-6 more heroes (free silhouettes + 2 finished), chapter 6-8 monsters (3 sets), alternate hero skins (1 per hero), seasonal event kit (holiday icons, banner, 2 monsters), boss-rush arena, guild emblem set (16), avatar frames (8), friend stickers/emotes (16), app icon + favicon + social preview card, store/key art + promo banner, tutorial Julia extra poses, equipment visuals on heroes (optional), pet/companion ideas.

## MEASURED LIMIT (2026-10-06) - this replaces the estimate table below
use.ai Trial, "Premium models" daily allowance, resets every 24h. One image costs ~4% of the daily allowance (89% -> 85%), so about **25 images per day, about 170 images before the trial ends (2026-10-12/13)**. The 450-generation table below is therefore too big; use this instead:

| Block | How | Tries | Images |
|---|---|---|---|
| Heroes | sheets of 4 same-role heroes (also gives roster symmetry for free) + single fix-ups | 3 | ~22 |
| Portraits | bust sheets of 6 | 2 | ~6 |
| Monsters | sheets of 3 per chapter + Big Head stages sheet | 3 | ~30 |
| Julia | 1 sheet of 4 expressions | 3 | ~3 |
| Backgrounds | 5 chapters + home wide/tall + title, one per image | 2 | ~16 |
| Icons | 16-per-sheet | 2 | ~16 |
| UI kit | sheets | 2 | ~8 |
| Cutscenes | one 4-panel page per chapter | 2 | ~10 |
| Future (heroes, ch6-8, skins, event, emblems, promo) | sheets | 2 | ~20 |
| **Total** | | | **~131 (+ ~35 buffer)** |
Rules to save quota: never use the site's Background Removal / Enhancer tools (they cost quota, do it in code); fix flaws in code instead of regenerating whenever Jacquin says FIXABLE_IN_CODE; spend each day's allowance fully (it does not roll over), so the run is spread over the week.

## (Old) Budget estimate, superseded
| Block | Pieces | Tries each | Generations |
|---|---|---|---|
| Hero sprites | 13 | ~4 | 52 |
| Portraits (+alts) | 13 x 3 | ~3 | 39-80 |
| Monsters/bosses | 15 | ~4 | 60 |
| Julia | 4 | 3 | 12 |
| Backgrounds/scenes | ~12 | ~3 | 36 |
| Icon sheets | ~22 | ~3 | 66 |
| UI kit sheets | ~10 | ~3 | 30 |
| Cutscene panels | ~30 | ~2 | 60 |
| Future/promo | ~30 | ~3 | 90 |
| **Total** | | | **~450** |
At ~1 min per generation incl. download and check this is about 8 working hours; token cost is dominated by screenshots and Jacquin reviews, so we keep screenshots small and only show Jacquin the downloaded file.
