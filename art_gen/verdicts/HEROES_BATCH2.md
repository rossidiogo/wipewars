# JACQUIN VERDICTS - HEROES BATCH 2 (attempt 2 each)

Assets judged (viewed with Read at x4, plus my own 3x line-up and 112 px game-size strip next to approved Jack/Daniel on #1a1612, pixel dumps with Pillow):
- Ze Vitor: out\clean\hero_ze_gem1_1.png (byte-identical to approved\heroes\ze_PENDING_REJUDGE.png, verified)
- Donnie: out\clean\hero_donnie_gem2_0.png and hero_donnie_gem2f_0.png (the two differ in only 479 px, the floor lift is nearly invisible; I judged gem2f)
- Chavoso: out\clean\hero_chavoso_gem2_0.png
- Rafinha: out\clean\hero_rafinha_gem2f_0.png (gem2_0 differs in 973 px, only the darkest tones; same verdict)
Blind-ID waived by owner (real friends); likeness judged at in-game size (112 px).

| hero | verdict | fix |
|---|---|---|
| Ze Vitor | REJECTED - FIXABLE_IN_CODE (tiny, then APPROVED) | Skin fix is good. Finish the sole outline (row y=88 is still transparent under x19-21 and x31-37), delete the floating 6 px dark bar at y=87 x24-29, delete the orphan twig squiggle under the drum (x38-44, y70-76). |
| Donnie | REJECTED - FIXABLE_IN_CODE (hand pixel patch; borderline, see block) | Add the missing septum ring, make the neck tattoo read as ink not a scarf, lift the half-lidded eyes, make the grin symmetric. Skull staff, violet trim and mop are good. |
| Chavoso | REJECTED - FIXABLE_IN_CODE (small patches; hair/bulk/height stay weak) | Halo and bowstring now fixed. Recolour the yellow pendant to a silver chain, widen chin strip to 2x2, square the glasses corners, remove the red temple stripe; if owner wants a slim archer, regenerate. |
| Rafinha | REJECTED - FIXABLE_IN_CODE (4 patches) | He is NOT the shortest (87 px = same as everyone) and has NO green veins (zero green in the palette). Delete 8 uniform rows (4 torso + 4 legs), add 3-4 thin green vein lines, recolour the near-black tee to a readable mid-tone, soften the brows. |

## Batch-level symmetry (Jack, Daniel approved vs the four)
- Heights (alpha bbox, logical px): Jack 87, Daniel 86, Ze 89, Donnie 89, Chavoso 95, Rafinha 87. Chavoso is +8-10 % taller than the roster (bow and hair dome), Rafinha should be about 78-80 and is 87.
- Palette sizes: Jack 24, Daniel 27, Ze 24, Donnie 24, Chavoso 22, Rafinha 23. OK. No partial-alpha pixels on any of them (clean 1x grid). OK.
- Outline: dark, 1 px, unbroken on Donnie, Chavoso, Rafinha. Ze's soles are still open (see below). Chavoso halo is GONE (outer-edge pixels 85 % dark, same ballpark as Jack 76 %).
- Contrast vs UI panel #1a1612, % of pixels within 25 luma of the panel (my metric, higher = worse): Jack 30, Daniel 45 (approved), Ze 33, Chavoso 41, Donnie 52, Rafinha 55 (mean luma 61, the black tee and hair are one dark slab). Donnie and Rafinha are the two to watch.
- Eyes: Ze/Donnie big eyes with whites, Jack/Daniel/Rafinha/Chavoso small dark eyes. Mixed but acceptable.
- Head ratio: all about 37-42 % of height, consistent with Jack/Daniel (still not the bible's 3 heads; decision from batch 1 stands).
- Light/rim: Ze and Donnie rim on the right (bible), Jack/Daniel on the left. Consistent enough.

---

## JACQUIN VERDICT: REJECTED (FIXABLE_IN_CODE)
Asset: hero_ze_gem1_1 (= approved\heroes\ze_PENDING_REJUDGE.png)   Type: hero sprite   Attempt: 2
Scores: pixel 88 | silhouette 92 | color 91 | anatomy 88 | design 92 | symmetry 90 | ready 88 | brief 94 | likeness 92   => overall 91
Likeness check: big toothy smile (present, strong, readable at 112 px); dark quiff with faded sides (present, strong); blue-green shirt with cartoon print (present, strong); drum + mallet (present); silver chain (weak, reads as a dark sling, not silver); light goatee (weak, 1-2 px at the chin); ear stud (missing, minor). Skin now warm: base (222,170,125) #deaa7d, shade (176,120,92) #b0785c = exactly the requested fix. Blind-ID: yes, he is the most recognizable of the four. Distinct from the other heroes: yes.
What works: skin remap is correct, no sickly khaki on the face or arms; face shading is clean; the strongest likeness of the batch.
4b: drum hangs from a diagonal brown sling from his shoulder to the drum rim (physical, OK); right arm goes behind the drum (OK); mallet is held horizontal in the fist with the green head over the thigh (readable). One unexplained part: a brown squiggle of about 25 px hangs from the drum's lower-right rim (x38-44, y70-76); it is not a stick, not a strap end, it reads as a stray twig.
Defects (most severe first):
 1. Sole outline only half done. Row y=88 (1x PNG) has dark #110122 only at x12-18 and x38-43. Still transparent under x19-21 (left shoe, light-grey shade pixels at y=87) and under x31-37 (right shoe). The unbroken-outline rule is broken on roughly half the sole length.
 2. Floating dark bar at y=87, x24-29: nothing above it (legs are separated by a transparent gap x25-28 down to y=86); it reads as a ground-line stub joining the shoes.
 3. Orphan twig squiggle under the drum, x38-44 / y70-76 (4b: starts and ends for no reason).
 4. Right-cheek rim column of beige-khaki (183,174,154) along x=40, y24-31: it is the old khaki again, reads as a pale stripe. Optional: recolour to (236,192,150) warm highlight.
Fix: (a) set pixel (x,88) = #110122 for every x in 10..21 and 31..44 where (x,87) is opaque; (b) set (24..29, 87) to alpha 0; (c) set alpha 0 on the twig pixels x38-44,y70-76 (or redraw as two clean 1-px drumsticks emerging from the sling at the drum's left edge); (d) optional rim recolour. With a-c done this is APPROVED; no regeneration needed.

## JACQUIN VERDICT: REJECTED (FIXABLE_IN_CODE, borderline)
Asset: hero_donnie_gem2f_0 (gem2_0 equivalent)   Type: hero sprite   Attempt: 2
Scores: pixel 88 | silhouette 92 | color 86 | anatomy 86 | design 92 | symmetry 88 | ready 88 | brief 84 | likeness 82   => overall 87
Likeness check: black short mop with side fringe (present, strong, matches ref); ear gauge plug with silver hoop (present, 2-3 px, reads); neck tattoos (weak: a grey-brown stippled patch at x35-42,y37-41, reads as a scarf or dirt, not ink); septum ring (MISSING: nose is a pink block, #ca758f at x40-42,y28; no silver anywhere); silver chain (weak, thin 1-px line on the tee); black+charcoal outfit with violet trim (present, strong); cow-skull staff with violet flame (present, strongest feature); big open grin (partial: teeth row is 8 blocks wide, but one side sits 1 row lower and the eyes are half-lidded, so it reads as a smug smirk, not a friendly grin); stubble (present as 3-4 dots, weak). Blind-ID: a friend would probably say "Donnie, the skull staff guy" mostly from props, the face alone is only about 60 % there (ref has a wide soft face, pointed chin, big open eyes). Distinct from other heroes: yes.
What works: huge improvement over batch 1. Hair is now a believable mop, no feminine curtain; charcoal jacket (#3a3a4a range) is clearly lighter than the outline, violet trim pops; skull staff is the best prop of the roster (shaft enters the jaw, flame rows y6-19 are attached to the skull top y=20, no floating); hand grips the staff; boots grey-soled.
Defects (most severe first):
 1. Septum ring missing (signature feature 2 of 6).
 2. Eyes half-lidded: the 4-px dark upper-lid line at y22 sits directly on the 2-px whites at y23, pupils tiny. Expression = sleepy smirk.
 3. Mouth: teeth x40-47 at y32, x40-46 at y33 vs a dark lip line x41-49 at y31; the grin is lopsided (right corner drops).
 4. Neck tattoo is mush; no ornament shape, just a stipple.
 5. 52 % low-contrast pixels vs the panel (Daniel 45): the dark trousers/boots and the black tee are close to the panel. The floor variant changed almost nothing (479 px).
 6. Palette waste: skin is three near-identical colours (#fcb68e, #fdb990, #fdbb92); merge to two so the freed slots go to a silver and a mid-grey tone.
Fix (hand pixel patch on the 1x PNG, logical coords origin top-left, then re-judge):
 - Septum: paint (40,29) and (43,29) #b8b8c4, (41,30) and (42,30) #e4e4ee: a 4-px U right under the nose tip; keep the dark mouth line at y31.
 - Eyes: add one row of skin (#fcb68e) above each eye by moving the upper-lid line up 1 px (y22 -> y21 for x35-38 and x47-50) and whites 2x2 instead of 2x1; pupils stay dark 2x2.
 - Grin: make teeth rows y32 and y33 symmetric, x41-48 (8 wide) at y32 and x42-47 at y33, with the corners at y31 one pixel higher than the centre.
 - Neck: replace the stipple with a 3-px-wide dark-grey (#4a4856) zig-zag/leaf pattern x36-41,y37-41 on a lighter grey (#6b6878) base so it reads as ink.
 - Contrast: lift tee to (#46465a) and boots to (#3a3a4c).
 - If the owner will not accept a hand patch: REGENERATE with the batch-1 delta plus "eyes WIDE open with 2x2 white highlights, grin symmetric, silver septum ring as a visible 2x2 arc below the nose, leaf-shaped ink pattern on the neck".
Note: even after the patch I expect likeness around 88-90, borderline; the staff and outfit carry it.

## JACQUIN VERDICT: REJECTED (FIXABLE_IN_CODE for the small items; REGENERATE only if the owner insists on slim)
Asset: hero_chavoso_gem2_0   Type: hero sprite   Attempt: 2
Scores: pixel 88 | silhouette 90 | color 90 | anatomy 88 | design 90 | symmetry 84 | ready 88 | brief 82 | likeness 86   => overall 87
Likeness check: thin black glasses (present, strong; but lenses are rounded ovals, read as round like Jack's, ref is rectangular); dark-brown fringe (present, a wedge over the forehead at x33-40,y17-19); thin mustache (present, 2 dark blocks at x36-42,y29-30, reads); chin strip (weak: 1 px at x42,y34); slim build (weak: the coat/mantle/quiver straps make him broad); silver chain (WRONG: the only chain pixels are yellow, #f6d25b at x37-38,y41, reads as a gold pendant); forearm wind tattoo (present, dark swirl on the glove-side forearm); ear stud (present, 1 green px). Blind-ID: "glasses + mustache archer", probably named by friends, but the head reads as a brown beret; the faded sides of the ref are not visible. Distinct from other heroes: yes (green coat, bow).
What works: the batch-1 killers are fixed: no pale halo (outer-edge pixels 85 % dark, no lilac ring), bowstring is now a continuous solid 1-px line #d4b8b4 from the top tip (x~64,y10) to the bottom tip (x~59,y88) with no gaps, bow grip taped yellow and held by the glove, green coat (#4e7b53) clearly lighter than the outline, readable on the panel (41 % low-contrast). Colour discipline good (22 colours).
4b: quiver on the back with a visible strap crossing the chest; belt buckle; mantle sits on both shoulders; off hand holds an arrow with a fingerless glove; bow hand wraps the grip. All attachments explained. One stray: a 4-px reddish vertical stripe at x44, y23-26 beside the right lens (#a65e58), reads as a scar/orphan.
Defects (most severe first):
 1. Hair is a smooth brown dome with a lighter highlight patch (x47-53,y4-10); it reads as a beret/cap, no strands, no faded side. The fade is the single biggest recognizability cue in the refs.
 2. Body is bulky, not "slim" (brief item): coat + mantle + straps make the torso as wide as Rafinha's.
 3. Height 95 px vs 86-89 for the roster (+8-10 %), width 78 because of the bow: breaks the shared baseline/scale feel.
 4. No silver chain (yellow pendant instead); chin strip 1 px.
 5. Glasses oval, not rectangular.
 6. Red stripe at x44,y23-26.
Fix: code patches: recolour (37..38,41) and one more px to #c8c8d0; chin strip: dark #312936 2x2 at x41-42,y33-34; square the 4 lens corners (frame colour on the corner pixels, skin inside); remove the red stripe (set to skin #fad0b5 after checking it is not the temple arm). Not fixable in code: hair dome and bulk. If the owner wants the true Deadeye look, REGENERATE with: "Hair: short messy side-swept fringe made of 3-4 visible dark-brown strands falling over the forehead to the right eyebrow, sides faded short and clearly lighter (skin showing) above the ears, NO round cap shape. Slim narrow torso, shoulders no wider than the head, fitted green coat, mantle only on the left shoulder. Rectangular thin black glasses with square corners. Silver chain as a light-grey 1-px line on the chest, no yellow. Total figure height about 88 px with the bow tips inside that height." Recommendation: patch the small items, accept the hair for now only if the owner is happy; otherwise regenerate.

## JACQUIN VERDICT: REJECTED (FIXABLE_IN_CODE)
Asset: hero_rafinha_gem2f_0 (gem2_0 equivalent)   Type: hero sprite   Attempt: 2
Scores: pixel 90 | silhouette 84 | color 76 | anatomy 88 | design 82 | symmetry 80 | ready 86 | brief 64 | likeness 80   => overall 81
Likeness check: full black beard + mustache (present, strong, good shape); thick dark brows (present, but angled down, reads stern); short dark messy hair with a side fringe (present); olive-fair skin (present now: #d9a06f / #bb7857, warm, no khaki; matches the batch-1 request); SHORT stature (MISSING: 87 px tall, same as Jack 87 and Daniel 86); calm slight smile (weak: a small light patch in the beard reads as a neutral mouth, the face is serious); subtle green veins (MISSING: the whole palette has no green, hues are only 0-30 and 230-330; the grey/brown blotches on both forearms read as dirt or camo, not veins). Blind-ID: "bearded tough guy", likely named by friends from the beard + black tee only; shares the beard/dark-hair family with Jack and Daniel. Distinct from other heroes: only just (no prop, no accent colour).
What works: skin tone and proportions are finally sane; thick but not bodybuilder arms; clean 1-px outline; 23 colours; face shading is neat; wristbands and boots construct logically (4b OK: wristbands wrap the forearm, belt line under the tee, boots at baseline).
Defects (most severe first):
 1. Not the shortest: same 87 px as the taller heroes; the brief and the orc-ult growth need a visibly small base form (target 78-80 px).
 2. No green veins at all (brief item and the foreshadowing of the orc ult).
 3. Readability: tee is #28283a / #313341 (luma about 40), hair and beard the same family, trousers #2b2b34: 55 % low-contrast pixels, torso is a dark slab on the panel (the floor variant raised the darkest tone from #181823 to #28283a, not enough). Only the skin reads.
 4. Face is stern (brows low and angled inward, eyes narrowed).
 5. No accent colour or prop: the weakest "design/depth" of the roster; costume is a plain black tee + grey trousers.
Fix (all code): 
 - Height: delete 4 one-pixel rows from the tee between belly and hem (e.g. y48-51, check they contain no belt/bracer detail; arms shrink with them) and 4 rows from the trouser legs between knee and boot (e.g. y66-69). Target height 79 +/- 1. Integer rows only, grid preserved.
 - Veins: paint 3-4 thin 1-px #6fae5a (shade #4a8a48) lines, 3-5 px long, branching, on the back of the viewer-left hand (x~5-10, y~64-70) and on the side of the neck below the beard (x~34-38, y~39-42); nothing else.
 - Replace the blotches on the forearms (#6e4847, #645d5d) with the skin shade #bb7857 so they stop reading as dirt.
 - Tee recolour: slate or dark teal, base #4a5568, shade #3a4254, highlight #5e6a80 (not green, Chavoso owns green); trousers #4c4c58. Leave hair and beard near-black so they separate from the lighter tee.
 - Face: raise the inner ends of the brows 1 px and add a 1-px lighter highlight at both beard-side mouth corners (x~22 and x~27 of the mouth row) to suggest the slight smile.
 - After these the verdict may flip; the likeness stays about 85 (beard + height + veins). If the owner wants more, REGENERATE with the batch-1 delta plus "wears a slate-grey tee and carries a Monster Energy can in the left hand".

## Recommended order
1. Ze: three tiny patches then approve.
2. Rafinha and Chavoso: patch list above, re-judge.
3. Donnie: patch or one more regeneration (attempt 3), decide with the owner.
