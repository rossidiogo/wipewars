# Wipe Wars — Game Bible

## Pitch
Idle auto-battler (AFK Arena / Archero feel, Path of Exile style UI) starring a group of real friends fighting
household cleaning-supply monsters. Inside jokes everywhere.

## Core loop
Battle stages -> gold (Chaos Orbs) + gear drops -> level heroes / fuse gear -> push chapters. Idle rewards cap at 8h.
Currencies: Chaos Orb (gold), Divine Orb (gems), bronze/silver/gold keys for chests.

## Heroes (3-slot team, 2x3 formation; monsters hit tank first, then closest row)
| Role | Hero | Status | Kit |
|---|---|---|---|
| Tank | **Jack** (cowboy, whip) | placeholder art, real portrait avatar | Ult "Hold the Line": shield = 40% max HP |
| Damage dealer | ??? | generic placeholder | Ult "Power Strike": 5x attack on one enemy |
| Support | ??? | generic placeholder | Ult "Team Heal" |
Jack look reference: round thin wire glasses, short stubble beard + mustache, thick straight brows, short dark hair,
small silver hoop earring, cowboy hat, whip, old-west boots (idle: taps a foot).
TODO per friend: name, photos (front-facing, no hand over face), costume theme, weapon, idle animation, ultimate name.

## Monsters (inside-joke rarities: Normal / Magic / Rare / Legendary)
| Chapter | Normal | Rare | Boss |
|---|---|---|---|
| 1 Bathroom | Toilet Paper | Clorox Wipes | Chapter Boss (placeholder) |
| 2 Laundry | Lint Ghost | Fabric Softener | Dryer Doom |
| 3 Kitchen | Greasy Sponge | Dish Soap | Oven Overlord |
| 4 Garage | Oil Rag | Paint Can | Garage Gremlin |
| 5 Basement | Cobweb Roll | Mold Spray | Lord of the Basement |
Chapters 2-5 currently reuse recolored Toilet Paper / Clorox / boss art (Dish Soap, etc. still show a "CLOROX" label). Replace with real designs + real inside jokes.
Clorox design rule (approved): front-facing canister, toothy lid, wipe-colored tongue arching from the bottom of the mouth, spits burning wipes.

## Systems
Gear: helm/armor/gloves/boots + 2 weapons; tiers Common/Magic/Rare/Legendary with 0-2 stars; fuse 2 equal; 3 sets (Bulwark/Fury/Mercy).
Accounts: claude.ai sign-in via db capability; username in-game; cloud save; friends (requests, daily gifts, ranking); guilds (create/join, shared weekly boss, 3 attacks/day, damage ranking, reward claim).
Needs the artifact shared at Contributor level for friends/guild writes.

## Art direction
Pixel art, Sea of Stars / Celeste quality target. See ART_STYLE_GUIDE.md. Character art is ON HOLD until a workable method is found
(candidate: image-generator or pixel artist creates portrait + sprite sheets; Claude integrates and animates).

## Open questions for the owner
1. Names, photos, themes for the other two heroes.
2. Real inside-joke names for monsters and bosses per chapter.
3. Preferred route for character art (see above).

## Hero roster (placeholder art, to be redone)
- Jack: Cowboy Tank (Hold the Line)
- Blade: Striker (Wipe Slash)
- Sage: Mop Medic (Clean Slate)
Names/themes for Blade and Sage are placeholders until real friends are chosen.

- Daniel (replaced Blade): Bird Summoner, ranged DPS, cockatiel on shoulder. Ult: Summon Cockatiel. Art made via art2/daniel_sos.py + dan_view.py (crisp 112px render, 5 refinement passes).

## Chapter 2 — The Deep Freeze (placeholder art)
- Monsters: Frozen Condom (normal), Permafrost Prophylactic (rare, spiky purple ice), boss "Big Head" (the creator, generic placeholder face until a reference photo arrives).
- Running joke: the boss's head grows every chapter. Plan: ch2 big -> ch3 cracked -> ch4 skull bursts, brain showing -> ch5 brain forms muscles/biceps on the sides ("mega brain"). Generator with all head stages: art2/bighead_sos.py (frames(hs,stage); stages 0-4 already drawn, only ch2 wired into the game).
- Chapter cutscenes: placeholder system (js/cuts.js); plays the first time a chapter is entered each session; panels are text + optional sprite, easy to swap for real animations.

## Chapter 3 — The Workshop (placeholder art)
- Monsters: Sandpaper Belt (normal: just the belt, screaming loop), Belt Sander (rare: the whole machine with its belt). Boss: Big Head (cracked skull, orange apron).
- Boss rule: the creator is the boss of EVERY chapter, and looks different each time. Head sizes/outfits: ch1 normal head + blue hoodie; ch2 bigger + ice-blue hoodie & scarf; ch3 bigger, cracked + grey hoodie & orange apron; ch4 skull burst, brain showing + black hoodie; ch5 bigger still, brain flexing two biceps + purple cape. All still a generic face until a reference photo is provided.
- Digas mode (Settings): god mode for testing. Unlocks every stage, huge currency, high hero levels, legendary gear; toggles for invincible heroes / one-hit kills / instant ultimates; cutscene viewer. Turning it off restores real progress.

## Chapter 4 — The Car Ride (placeholder art)
- Setting: the pizza that fell off the box in the car. Monsters: Burnt Mini Pizza (normal, charred, smoking), Dropped Pizza (rare: folded, cheese sliding off, a shard of red cardboard stuck to it). Boss: Big Head (skull burst, brain showing).
