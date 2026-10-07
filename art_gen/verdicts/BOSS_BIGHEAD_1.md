# JACQUIN - BOSS BIG HEAD, 5 stages, attempt 1

Assets: `art_gen/out/clean/boss_bh{1..5}_gem1_0.png` (+ `_x4`, `boss_set_preview.png`). Type: boss (friend-based, key piece: needs average >= 94).
Compared against: `approved/heroes/jack.png`, `daniel.png`, `approved/monsters/ch5_clone.png`, STYLE_BIBLE, LORE.md chapter boss lines.
Measured with Pillow/numpy (sizes, palettes, outline colour, orphans, contrast vs UI #1a1612). I looked at every x4 and at 9-10x crops of the head/body of each stage.

## Set summary (read this first)

| stage | verdict | one-line fix |
|---|---|---|
| bh1 ch1 | REJECTED - FIXABLE_IN_CODE | paint the missing iris (12 px) + 3 px hoop; then re-submit |
| bh2 ch2 | REJECTED - FIXABLE_IN_CODE | same iris patch (icy grey-blue); thin out scarf noise |
| bh3 ch3 | REJECTED - FIXABLE_IN_CODE | iris patch, un-red the nose tip, delete stray orange speckles off the crack |
| bh4 ch4 | REJECTED - REGENERATE | skull flaps read as devil horns, fringe gone, near-black hoodie vanishes on the UI, pure-black outline, 4 orphan px |
| bh5 ch5 | REJECTED - REGENERATE | brain is NOT giant (same ~45x23 px as stage 4), face drifted off-model, head is smaller than stage 1 |
| SET | growth NOT readable | head is already maxed at stage 1 and the multiplier list in battle.js currently shrinks the boss (see section C) |

Blind-ID (category 10): there is no `blind_boss_*.md` on file for any bh stage. I could not produce one (I only have Read/Write on this task), so concept recognizability is unproven. Stages 4 and 5 (horns vs skull flaps, "what is the pink thing") must get a blind-ID before the next Jacquin round; stages 1-3 are a recognizable person-with-a-hoodie so the risk is low, but the file is still missing.

## A. Likeness (references 01, 02/03, 10, 20, 25 viewed)

Signature features taken from the photos: dark messy side-swept fringe over the forehead; heavy-lidded light grey-green eyes with dark bags; brow piercing on the viewer's right end of the right eyebrow; small hoop in the right ear; thin mustache + chin/jaw stubble; round pale wide face; stocky build.

Measured pixel facts (stage 1, 1x): the eyes have sclera `#eed3c1` (cream, nearly the skin colour) and a 2 px pupil `#00021b` under the lid. There is NO iris colour at all. So the "light grey-green eyes" signature is missing in stages 1-4. Stage 5 has grey-violet irises (good) but lost the heavy lids.

| feature (at in-game size) | bh1 | bh2 | bh3 | bh4 | bh5 |
|---|---|---|---|---|---|
| fringe / hair silhouette | present | present (+frost tufts) | half: left fringe present, right half bald dome | missing (only scribble tufts at the sides) | missing (cap removed, purple side hair only) |
| heavy lids + bags | present | present | present, angry | bags present, lids gone (wide googly eyes = ref 20) | missing (round open eyes, V brows) |
| grey-green iris | missing | weak (grey ring) | missing | missing (black dots) | present (grey-violet) |
| brow piercing | present (2x2 cross, right brow) | present | present | weak | weak/missing |
| ear hoop | weak (1-2 px) | weak | weak | weak | weak |
| mustache + chin stubble | present | present | present | present | weak (faint) |
| round pale face | present | present (icy tint) | present | present | present but smaller/narrower |

Blind-ID in my head, "would the friends name him in 2 seconds": bh1 yes, bh2 yes, bh3 yes, bh4 probably (smile + mustache + bags; the fringe is gone), bh5 probably only because of the context (cape + brain); the face alone looks like a generic angry muscle-man smirk.
Distinct from the other heroes: yes (no hero has this fringe, brow ring and round face).

Identity consistency across stages: stages 1-3 are one person (same face, same fringe, same piercing; the face construction is consistent). Stage 4 is the same face but loses the fringe. Stage 5 is a different face: eyes, brow shape and mouth were redrawn. The identity chain breaks at 5.

## B. Growth readability and the scale multiplier

Measured at 1x (all five sprites were normalised to the same ~91-95 px height):

| stage | sprite w x h | head width at 1x | head height share | m now (battle.js) | head on screen = head x m | sprite on screen = h x m |
|---|---|---|---|---|---|---|
| bh1 | 73 x 92 | ~70 | ~67% | .90 | ~63 | ~83 |
| bh2 | 67 x 93 | ~64 | ~67% | .80 | ~51 | ~74 |
| bh3 | 65 x 94 | ~64 | ~66% | .72 | ~46 | ~68 |
| bh4 | 72 x 91 | ~69 (with skull flaps) | ~69% (with brain) | .62 | ~43 | ~56 |
| bh5 | 90 x 95 | ~44 (skull ring; the 90 px width is the arms) | ~57% with brain | .60 | ~26 | ~57 |

Findings:
1. The head is already the maximum size at stage 1 (about two thirds of the body height, 1.5 heads tall; STYLE_BIBLE says bosses are 2.5-3 heads tall, and LORE chapter 1 says "cabeca normal"). There is no headroom left to grow.
2. Head growth is NOT readable between stage 1, 2 and 3: the head silhouette is nearly the same blob (70 / 64 / 64 px). What changes is costume (scarf, apron) and a crack. Stage 4 adds a brain; stage 5 adds the body. A player sees "same big head, new clothes, then a brain, then muscles", not "the head keeps growing".
3. The brain does not grow from 4 to 5: both are about 45 x 23 px. Stage 5 is "giant brain" only in name.
4. The current multiplier list `m:[.9,.8,.72,.62,.6]` (battle.js lines 8 and 15-18) goes DOWN, so on screen the boss gets smaller every chapter (83 -> 57 px) and the final boss ends up 30 px shorter than heroes (about 87). It is the opposite of the lore. These values look tuned for the old placeholder sprites. Note: I did not find the new bh sprites registered in `SP`/`SPD` (art.js), so the real on-screen size also depends on the `s` field you give them there.
5. Can the multiplier supply growth? Partly. It can make the whole boss bigger each chapter (bigger head on screen, same proportions), which reads as "he is swelling". It cannot change head-to-body ratio, and it cannot rescue stage 5 because the stage 5 head is only about 44 px wide at 1x; to make that head as big on screen as stage 1's (70 x .9 = 63) it would need m ~1.4 for the head alone, which makes the muscle body about 133 px tall (bible allows up to 140 for bosses, so it is just inside). Also game FS = fieldWidth/320 is already fractional (e.g. 1.125), so non-integer m does not add a new grid problem that does not already exist for every sprite.
6. Suggested code step (FIXABLE_IN_CODE for the set, after the art fixes): in `CHAPMON` set boss `m` to rising values, for example `m:[.9, 1.0, 1.1, 1.2, 1.35]` and `KINDS.boss.m=.9`, and re-check lane overlap (LANE_Y 66/77/88) on a 360 px field. This is a suggestion; I did not test it in the running game.
7. Recommended art route for a real "head grows" read (my preference, needs the owner's decision): keep stage 1 as the reference but regenerate it with a smaller head (head about 45% of height, 3 heads tall like the bible), then 2 = 52%, 3 = 58%, 4 = 64% + brain, 5 = 70% + giant brain. Alternative if the owner likes the current huge-head look: keep stages 1-3, accept that growth is carried by the brain (4, 5) + multiplier, and make stage 5's brain a clear 1.5x of stage 4's.

## C. Per-stage verdicts

```
JACQUIN VERDICT: REJECTED   (FIXABLE_IN_CODE)
Asset: boss_bh1_gem1_0   Type: boss (Big Head, ch1)   Attempt: 1
Scores: pixel 92 | silhouette 90 | color 90 | anatomy 90 | design 90 | symmetry 87 | ready 92 | brief 84 | likeness 90   => overall 89 (needs 94)
Likeness check: fringe present, heavy lids+bags present, brow piercing present, mustache+stubble present, round face present, grey-green iris MISSING, ear hoop weak; blind-ID: person yes (blind file missing); distinct from other heroes: yes
What works: cleanest of the five. One component, 24 colours, 0 partial alpha, outline is navy-tinted `#03021c`-ish and unbroken (only 6 non-dark edge px), no orphans, hoodie/hood/drawstrings/pocket all attach logically, calm half-lidded face is a very good match for reference 01.
Defects:
 1. Eyes have no iris: sclera `#eed3c1` is almost skin colour and the pupil is a 2 px slit, so the eyes read as sleepy slits instead of the light grey-green eyes of the photos (signature feature missing).
 2. Ear hoop is 1-2 px, lost at game size.
 3. Symmetry/brief: head is ~1.5 heads tall (bible: bosses 2.5-3), and LORE ch1 says "cabeca normal" (see section B). No headroom for growth.
 4. Legs/pants: 57% of the lower-body pixels have contrast < 1.6:1 against #1a1612 (dark pants + shoes), the feet nearly vanish on the panel.
 5. Hands are two skin blocks with a notch (acceptable chibi, no fix needed).
Fix (code):
 a) Iris, exact pixels (x,y on the 1x image). Left eye: (19..22, 40) = `#8fa58f`, (19..21, 41) = `#6f8672`, and keep pupil pixels (20,40),(21,40) = `#00021b`. Right eye: (43..46, 40) = `#8fa58f`, (44..46, 41) = `#6f8672`, pupil (44,40),(45,40) = `#00021b`. Only recolour pixels that are currently `#eed3c1`.
 b) Hoop: under the right earlobe make a 3 px light-steel ring `#c8ccd8` with one `#ffffff` pixel.
 c) Raise the pants by one step: map the 2 darkest pants tones to about +18 lightness in OKLab, same hue (keep outline untouched), so the legs reach 2:1 against #1a1612.
 d) Apply the set decision on head size from section B before final approval; if the owner accepts the big-head baseline, mark symmetry exception in the style bible.
```

```
JACQUIN VERDICT: REJECTED   (FIXABLE_IN_CODE)
Asset: boss_bh2_gem1_0   Type: boss (Big Head, ch2 icy scarf)   Attempt: 1
Scores: pixel 91 | silhouette 90 | color 90 | anatomy 90 | design 91 | symmetry 87 | ready 92 | brief 88 | likeness 88   => overall 89 (needs 94)
Likeness check: fringe present (with frost tufts), lids+bags present, piercing present, mustache+stubble present, iris weak (grey ring), hoop weak; blind-ID: person yes (file missing); distinct: yes
What works: the scarf is built correctly: a thick wrap around the neck under the chin, one tail that leaves the front of the wrap and hangs down the viewer's right side to the hip with a fringed end; hood bundle behind the right ear. Frost shards on the fringe tell the chapter story without extra parts. 24 colours, 1 component, edge clean (3 non-dark edge px). Lower body contrast good (4.1:1 mean).
Defects:
 1. Same missing/weak iris as stage 1 (the eye is a grey outline ring with cream fill and a slit pupil).
 2. Scarf wrap uses 4-5 near-identical blues in a dither, which reads as noise at 1x, not as knitted folds; the tail has no visible knot where it leaves the wrap.
 3. Face tint is a flat pale blue/pink; skin lost warmth so likeness to the warm photos drops a little (acceptable as "cold", but keep the lightest tone off pure white).
 4. Hoop weak (as stage 1).
Fix (code):
 a) Iris: find the visible sclera pixels in the two rows under the upper-lid shadow, paint the central 4 x 2 block (3 px on the lower row) `#8fb0b0` / `#6f8e9a`, pupil stays. Same recipe as stage 1 but icy.
 b) Scarf: merge the two lightest and the two mid blues of the wrap into 3 tones (highlight, base, shadow) with diagonal bands following the wrap; add a 2x2 darker blue knot at the front-left where the tail starts (the tail's top pixels should sit directly under it).
 c) Hoop: 3 px silver ring as in stage 1.
```

```
JACQUIN VERDICT: REJECTED   (FIXABLE_IN_CODE)
Asset: boss_bh3_gem1_0   Type: boss (Big Head, ch3 cracked skull + orange workshop apron)   Attempt: 1
Scores: pixel 90 | silhouette 90 | color 90 | anatomy 88 | design 92 | symmetry 87 | ready 92 | brief 88 | likeness 88   => overall 89 (needs 94)
Likeness check: left fringe present, right half bald dome (planned by the brief), lids+bags present (angry), piercing present, mustache+stubble present, iris missing, hoop weak; blind-ID: person yes (file missing); distinct: yes
What works: strongest costume story. Apron construction is logical: bib with strap rivets going up behind the neck, waist tie line, pocket with a wrench/pliers handle sticking out, brown work gloves. Orange accent is the single saturated accent (good vs the roster rule). The crack is dark with a few orange accents, no blood, no gore, family-friendly.
Defects:
 1. Iris missing as in stages 1-2.
 2. Nose tip uses `#ee986e` (saturated orange, 3-4 px): reads as a red clown nose, not as skin.
 3. Orange/grey speckles on the forehead that are not touching the crack (around x 37-40,y 17-19 and x 50-54,y 26-31 in the 1x grid) read as random squiggles/noise (4b).
 4. Bald half of the skull has no hair/skin boundary; the left hair mass ends on a straight diagonal. Minor but visible at x4.
 5. Hoop weak.
Fix (code):
 a) Iris patch, same recipe as stage 1 with `#8fa58f` / `#6f8672`.
 b) Nose: recolour the `#ee986e` pixels on the nose to `#d9a08f` (one shade darker than the cheek `#f2cdb4`).
 c) Recolour every `#ee986e` pixel that is not 4-adjacent to a crack-dark pixel (`#050117`/`#08011c`/`#06011a`) to the neighbouring skin tone `#f2cdb4`; keep the ones touching the crack as the glow.
 d) Add 3 hair-colour pixels `#372830` as a short jagged hairline step where the hair meets the bald dome.
 e) Hoop: 3 px silver ring.
```

```
JACQUIN VERDICT: REJECTED   (REGENERATE)
Asset: boss_bh4_gem1_0   Type: boss (Big Head, ch4 burst skull with brain, black hoodie)   Attempt: 1
Scores: pixel 84 | silhouette 84 | color 78 | anatomy 82 | design 86 | symmetry 80 | ready 84 | brief 84 | likeness 78   => overall 82 (needs 94)
Likeness check: fringe MISSING, bags present, grey-green iris missing, piercing weak, hoop weak, mustache+stubble present, smile close to ref 10/20 (good); blind-ID: probably yes (file missing); distinct: yes
What works: expression and brain texture: the smirk with the googly bagged eyes is the best Diogo-likeness in the set for expression. Brain is pink, wrinkled, no blood: family-friendly. The grin matches the "sinister smile" reference.
Defects (most severe first):
 1. Construction (4b): two cream-and-violet bone shards at the temples curve OUTWARD and upward (left roughly x 10-19,y 3-15; right roughly x 56-65,y 4-19). A skull cap cannot grow outward horns; they read as devil/cat horns. Where do they attach, what are they? Unexplained.
 2. Contrast: hoodie `#1f2028`/`#151320`, pants and shoes are near-black; 81% of the lower-body pixels are below 1.6:1 against #1a1612 (mean 1.70:1). The body vanishes on the UI panel; only the head reads.
 3. Outline: pure black (`#020002`, `#000001`, 1012 px under sum<12) while the bible says never pure black and every other stage uses a navy-tinted outline. Breaks symmetry inside the set and vs heroes.
 4. Orphans: 4 isolated pixels (2,17); (69,21),(70,21); (71,22) from the scribbled hair wisps at the sides. The wisps read as scribbles, not hair.
 5. Several 2-3 px purple streaks under the skull rim on the forehead (vein drips). At 1x they could read as blood/fluid dripping; keep them out for family-friendliness.
 6. Fringe gone: the signature hair silhouette is lost, hair is only black tufts at the temples.
 7. Brain sits in a zig-zag rim with no thickness of the skull wall; the rim is a thin 1 px edge.
Fix (REGENERATE, prompt delta; keep the current face/expression as the reference image if the tool takes one):
 - Add: "the top of the skull is cleanly cracked open like a boiled egg; the skull-cap flaps are two small triangles hinged DOWN and outward at the temples, never pointing up, and they are the same cream bone colour as the rim; the brain is a pink dome sitting inside the bowl of the skull and does not drip; skull wall visible as a 2 px cream rim around the brain."
 - Add: "keep the dark messy fringe falling over the forehead on the left side, plus the thin silver brow ring on his right eyebrow and a small silver hoop in the right ear."
 - Add: "light grey-green irises under heavy lids with dark bags."
 - Change: "charcoal-violet hoodie in three tones with the lightest tone about #5a5670, a thin cool rim light on the right edge so it separates from a near-black background; shoes and trousers lighter than the hoodie; outline dark navy #03021c, never pure black."
 - Remove: black hair wisps/scribbles; vein drips.
 - Code step after regeneration: orphan removal and outline unification (navy lock) from the cleanup pipeline, and verify palette <= 24.
```

```
JACQUIN VERDICT: REJECTED   (REGENERATE)
Asset: boss_bh5_gem1_0   Type: boss (final Big Head: giant brain, double-biceps, violet cape)   Attempt: 1
Scores: pixel 86 | silhouette 90 | color 86 | anatomy 86 | design 88 | symmetry 82 | ready 88 | brief 78 | likeness 66   => overall 83 (needs 94)
Likeness check: fringe missing (cap removed), lids+bags missing (round eyes, V brows), iris present (grey-violet), piercing weak/missing, hoop weak, mustache faint; blind-ID: only by context (cape+brain); distinct from other heroes: yes
What works: silhouette is the best of the set (double biceps with cape triangle reads at 1x), violet cape + pink brain are the single saturated accents, abs/arms construction is believable, brain is pink with no blood. Reference 25 pose (arms up, fists beside the head) is respected. 24 colours, only 1 orphan px at (68,27) `#331d40`.
Defects (most severe first):
 1. Brief: LORE says "cerebro mega malhado" and the owner asked for a giant brain. The brain is the same ~45 x 23 px as stage 4 and smaller than the face width plus arms; it sits in a plain bowl. It is not giant.
 2. Likeness: the face was redrawn: round open eyes with sharp V brows, a one-sided smirk, almost no mustache, no heavy lids/bags, no fringe. It no longer looks like the stages 1-3 person; it looks like a generic villain bodybuilder.
 3. Head scale: the face is only ~44 px wide at 1x versus ~70 px in stage 1, so the "big head" is gone in the finale (the body grew instead).
 4. Construction (4b): the cape collar is a dark U-shaped band that crosses the upper chest well below the chin, so it reads as a necklace/choker rather than a cape neckline; no clasp. The cape itself comes out from behind the armpits (acceptable with raised arms). The belt buckle is a pink square the same colour as the brain, reads as a stray accent.
 5. Texture: purple speckles over the forearms/biceps (veins) read as bruises/noise, not as veins following the muscle; about 14% of the silhouette edge pixels (81 of 592) are mid-purple instead of the near-black outline, so the outline is not unbroken on the arms.
 6. Family-friendliness: acceptable (no blood, brain is cartoon pink, no gore). I flag the exposed brain as the maximum I would allow; do not add veins in red or fluid.
Fix (REGENERATE, prompt delta; use bh1's face as the likeness reference image):
 - Add: "the brain is GIANT: it rises out of the cut-open skull bowl and overflows wider than the head on both sides, as tall as the whole face (at least 50% of the head height and wider than the shoulders-to-ears), pink with deep folds, smooth shiny highlights on the top-left lobes, no blood, no drips."
 - Add: "same face as the earlier stages: dark side-swept fringe visible on the temples under the skull rim, heavy-lidded half-open light grey-green eyes with dark bags, a thin silver ring on his right eyebrow, a small hoop in his right ear, a thin mustache and chin stubble, a smug closed-mouth or small grin; do not make the eyes round."
 - Add: "head stays large: face width at least 60% of the shoulder width; muscular torso with big deltoids but short neck."
 - Add: "the violet cape is clasped at the front of the neck with one small gold round clasp; the cape's top edge sits right under the jaw and hangs behind the shoulders."
 - Change: "veins as single 1 px darker-pink lines that follow the muscle direction on biceps only; belt buckle gold, not pink; outline dark navy #03021c on arms too."
 - Code step afterwards: delete orphan (68,27); verify outline lock.
```

## D. Cross-set checks (all five)

- Pixel grid: each x4 is an exact 4x nearest-neighbour of the 1x (verified). 23-24 colours each, no partial alpha, one connected component each except bh4 (4) and bh5 (2). Pixel integrity is the strongest point of the set.
- Palette symmetry: stages 1, 2, 3, 5 use a navy-tinted outline (`~#03021c`), the same as the approved heroes (jack `#19012b`, daniel `#090118`); stage 4 uses pure black. Fix by regeneration (bh4).
- Light direction: top-left highlights on hair, hoodies and the brain in all stages; consistent.
- Roster symmetry: the 1x canvases are 91-95 px tall versus heroes at 86-87 and the approved monsters at 85-95 px, so they match the roster's canvas convention. The head-to-body ratio is the deliberate exception (see section B).
- Contrast on UI #1a1612: heads and costumes read in all stages at 2x preview; the lower bodies of bh1, bh4, bh5 are the weak spot (bh4 worst, 1.70:1 mean).
- Family-friendliness: no red blood, no gore, no exposed flesh in any stage; stage 3's crack and stage 4/5's brain are cartoon-level. Keep it that way in the regenerations.
- Game-readiness: transparent backgrounds, tight bounding boxes at (0,0); feet row is the bottom row in every stage; bh1 feet centre is 2.6 px right of the bbox centre (body turned slightly), bh5 is centred. Set the anchor (`ax`,`ay`) of each in SPD from the feet midpoint, not the bbox centre, when registering them.
- Procedural animation: heads, torso and arms are one bitmap. Fine for idle bob/lunge, but a separate head layer would be needed for any head-growth animation in code (not available today).

## E. What I did not verify

- The new bh sprites in the running game: I did not run the game; the multiplier analysis is read from `js/battle.js` and `js/art.js` only, and the suggested m values are untested.
- Blind-ID files for any bh stage (missing).
- Whether the owner wants the huge-head baseline kept (design decision, see B.7).
