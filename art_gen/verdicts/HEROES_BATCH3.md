# JACQUIN VERDICTS - HEROES BATCH 3 (attempt 3 each)

Assets judged (viewed with Read at x4 and at x10 face/body crops, plus my own line-up and 112 px strip next to approved Jack/Daniel/Ze on #1a1612, Pillow measurements):
- Donnie: out\clean\hero_donnie_gem3_0.png
- Chavoso (regenerated): out\clean\hero_chavoso_gem3_1.png
- Rafinha: out\clean\hero_rafinha_gem3_0.png
Blind-ID waived by owner (real friends); likeness judged at in-game size. Refs read: refs\<name>\FEATURES.md.

| hero | verdict | fix |
|---|---|---|
| Donnie | REJECTED - FIXABLE_IN_CODE (2 small patches) | Lift the half-lidded eyes (they are what makes him smug), make the ring read as silver, turn the neck patch into a leaf/ink shape. Everything else is good. |
| Chavoso | REJECTED - FIXABLE_IN_CODE (1 small patch) | Regeneration worked (slim, strands, rectangular glasses, chin strip, clean outline, continuous string). Only the silver chain is missing: paint it. Optional: lighten the viewer-left temple hair for the fade. |
| Rafinha | REJECTED - FIXABLE_IN_CODE (3 small patches) | Height 79 and contrast are right. Veins read only as a green smudge on ONE forearm; add neck + second-hand veins, raise the inner brow ends, add the smile corners. |

## Batch-level symmetry (Jack, Daniel, Ze approved vs the three)
- Heights (alpha bbox, logical px): Jack 87, Daniel 86, Ze 89, Donnie 89, Chavoso 90 (was 95, now OK, +1 over Ze), Rafinha 79 (target ~79, OK; the shortest by 7 px). Widths: Jack 78, Daniel 71, Ze 62, Donnie 72, Chavoso 65 (bow incl.), Rafinha 51.
- Palette: Jack 24, Daniel 27, Ze 24, Donnie 28, Chavoso 24, Rafinha 28. Donnie and Rafinha are at 28 (bible says <= 24, Daniel approved at 27, so tolerated; merge the three skin tones on Donnie if a slot is needed). Partial-alpha pixels: 0 on all six (clean 1x grid).
- Outline: dark, 1 px, unbroken on all three. Chavoso halo: none (outer-edge pixels 87 % dark; Jack 76 %).
- Contrast vs UI panel #1a1612, % of pixels within 25 luma of the panel (lower = better): Jack 30, Ze 33, Rafinha 37 (was 55, fixed by the slate tee), Chavoso 40, Daniel 45 (approved), Donnie 48 (was 52; the black tee, trousers and the black hair are still the weakest, but the violet trim and the skull carry the read). Mean luma: Jack 84, Ze 99, Daniel 73, Donnie 75, Chavoso 74, Rafinha 72.
- Eyes: Ze/Donnie big eyes with whites, Jack/Daniel/Rafinha/Chavoso small dark eyes. Mixed but acceptable (unchanged from batch 2).
- Light/rim: right-edge rim on Donnie and Chavoso, left on Jack/Daniel; consistent enough.
- Distinctness: the six read as six different people at 112 px (hat / bearded wizard / drummer / skull-staff goth / archer with glasses / short bearded tank). No two share a silhouette.

---

## JACQUIN VERDICT: REJECTED (FIXABLE_IN_CODE)
Asset: hero_donnie_gem3_0   Type: hero sprite   Attempt: 3
Scores: pixel 90 | silhouette 92 | color 88 | anatomy 87 | design 92 | symmetry 90 | ready 90 | brief 86 | likeness 85   => overall 89
Likeness check: black mop with side fringe (present, strong); ear gauge plug + silver hoop (present, reads at 112 px); septum ring (now present but only 2-3 light-pink/silver pixels at x~40-42,y~29, reads as a pale nose-tip highlight at game size, weak); neck tattoos (weak: the patch under the chin is a dark grey chevron/band that still reads as a choker or scarf, not ink); silver chain (present, thin line on the tee, reads); all-black outfit with violet trim (present, strong); cow-skull staff with violet flame (present, strongest feature); big friendly grin (partial: teeth row is wide and the grin reads friendly now, right corner still a touch lower, but the eyes are still half-lidded and make it a smug smirk). Blind-ID: yes, "Donnie, the skull staff guy", face alone about 65 %. Distinct from other heroes: yes.
What works: the septum, tee lift and neck work are in; tee is now a readable charcoal against the panel; hair, jacket trim, staff and hand grip are clean; 4b all explained (staff shaft enters the skull jaw, flame sits on the skull top, hand wraps the shaft, hood sits behind the neck).
Defects (most severe first):
 1. Eyes NOT changed (as stated): dark 4-px upper-lid line directly on 2-px whites, tiny pupils = sleepy/smug. This is the single biggest likeness blocker (ref has big open friendly eyes).
 2. Septum ring is a 2-3 px light smudge, not a ring: no dark hole between two silver arcs, so it does not read as piercing at 112 px.
 3. Neck tattoo still a band, no ink motif (leaf/wolf), so feature 3 of 6 stays weak.
 4. Contrast 48 % low-contrast pixels (Daniel 45): black hair mass + trousers + boots. Borderline, acceptable if 1-3 are fixed.
Fix (hand patch on the 1x PNG, origin top-left; coordinates approximate from my x10 crop, verify against the dump before painting):
 - Eyes: move the dark upper-lid line up 1 px on both eyes (viewer-left x~35-40,y~22-23 and viewer-right x~48-52,y~23-24), fill the freed row with skin #fcb68e, make the whites 2x2 and the pupils 2x2 dark; keep the brow line where it is.
 - Septum: paint a 4-px U under the nose tip at x~40-43,y~29-30: outer pixels #b8b8c4, bottom pixels #e4e4ee, one dark pixel #2a2030 in the middle of the U so a hole shows.
 - Neck: inside the grey band replace the chevron by a 3-px-wide leaf/zig-zag in #4a4856 on #6b6878 so it reads as ink; keep it under the chin line, not on the hood.
 - After this I expect likeness about 89-90; with eyes done I would approve at 92 average.

## JACQUIN VERDICT: REJECTED (FIXABLE_IN_CODE, one patch)
Asset: hero_chavoso_gem3_1   Type: hero sprite   Attempt: 3
Scores: pixel 91 | silhouette 91 | color 90 | anatomy 90 | design 91 | symmetry 89 | ready 91 | brief 88 | likeness 88   => overall 90
Likeness check: rectangular black glasses (present, strong: squared lenses now); side-swept brown fringe made of visible strands (present, strong, no more beret dome); faded sides (weak: the viewer-left temple is the same brown as the top, no skin showing above the ear); thin mustache + chin strip (present: mustache 2 dark blocks, chin strip a 2x3 dark patch at x~29-30,y~33-35, reads as goatee); slim build (present: torso now about the width of the head plus mantle, much improved); silver chain (MISSING: the only light pixels at the neck are 3-4 peach pixels at x~30-33,y~39, which read as an undershirt, no grey chain anywhere); forearm tattoo (present, small dark mark on the forearm); ear stud (not visible). Blind-ID: yes, "glasses + messy fringe archer, Chavoso". Distinct from other heroes: yes.
What works: the regeneration fixed what code could not: slim body, strand hair, rectangular glasses. Outline is halo-free (outer-edge pixels 87 % dark). Height 90 px (roster 86-89, bow included), width 65, 24 colours, 0 partial alpha, contrast 40 % (OK). Green coat #4c7a52 clearly lighter than the outline.
4b: quiver strap crosses the chest from shoulder to belt (OK); belt buckle with pouch (OK); mantle on the viewer-left shoulder only (OK); bow hand grips the taped grip; off hand holds an arrow with fingerless glove. Bowstring: verified by pixel scan, a continuous 1-px cream line from the top tip (x~58,y12) to the bottom tip (x~42,y77), no gap longer than 1 px (the 1-row break at y13 is diagonal-adjacent and reads continuous at x4); both ends meet the limb tips. String is straight (the hand does not pull it), acceptable for an idle pose.
Defects (most severe first):
 1. Silver chain missing (signature 5 of 6; asked in batches 2 and 3).
 2. Faded sides weak (cosmetic, optional).
 3. Height 90 is +1 above the tallest approved (Ze 89), tolerated.
Fix (code patch): paint a 1-px #c8c8d0 line on the chest in a U: at x~30-33,y~39 replace the peach pixels with #c8c8d0, add #c8c8d0 at (31,40) and (32,40) and one #e4e4ee highlight pixel at (31,40) so it reads as a short chain with a drop; do not touch the coat outline. Optional: recolour 4-6 px of the viewer-left temple hair (above the ear, x~20-22,y~15-19) to skin #f5c1a3 to show the fade. With the chain done this is APPROVED.

## JACQUIN VERDICT: REJECTED (FIXABLE_IN_CODE)
Asset: hero_rafinha_gem3_0   Type: hero sprite   Attempt: 3
Scores: pixel 90 | silhouette 87 | color 89 | anatomy 88 | design 85 | symmetry 88 | ready 90 | brief 80 | likeness 85   => overall 87
Likeness check: full black beard + mustache (present, strong); thick dark brows (present, still angled down and inward = stern); short dark messy hair with side fringe (present); olive-fair skin (present, warm); SHORT stature (present now: 79 px vs 86-89, 7 px shorter than the rest, stocky 51 px wide, reads as the baixinho); calm slight smile (weak: only a small light patch inside the beard); green veins (weak: 12 green pixels #4a8a48 / #6fae5a in one diagonal squiggle on the viewer-left forearm x5-11,y56-62, reads as a vine or a green wristband smudge at 112 px, not as veins; none on the neck, none on the other arm). Blind-ID: yes, "the bearded short guy". Distinct from other heroes: yes (shortest, slate tee), though beard + dark hair family still close to Jack and Daniel.
What works: height and proportions fixed; slate tee (#4a5568 range) now separates cleanly from the near-black hair/beard; contrast dropped from 55 % to 37 % low-contrast pixels (second best of the roster); forearm blotches are gone; wristbands, belt line, boots all construct logically; 28 colours, 0 partial alpha, outline 1 px unbroken.
Defects (most severe first):
 1. Veins do not read: single forearm squiggle, one tone family, no neck veins (stated as not done). Brief item and foreshadowing of the orc ult.
 2. Face still stern: brows slanted 2 px down toward the nose, eyes narrowed; no smile corners (stated as not done).
 3. Design/depth: still a plain tee with no accent or prop; acceptable only because the veins and height carry the identity. 28 colours, 4 over the bible (tolerated, Daniel 27).
Fix (code patches, coordinates approximate from my x10 crops, verify against the pixel dump):
 - Veins: add 1-px branches #4a8a48 with a #6fae5a highlight on the viewer-right forearm/back of hand (x~43-47,y~56-62, mirror of the left squiggle but shorter), and 3-4 px on the visible neck skin under the beard (x~23-28,y~37-38) as a short Y; also extend the left squiggle with 2 px branches at its ends so it reads as a vein network, not a vine. Keep total green under 30 px.
 - Brows: raise the inner end of each brow by 1 px (inner pixels at x~17-19 and x~27-29, y~15-17), so they slope up toward the nose, not down.
 - Smile: put 1 px of the lighter beard-gap colour at both mouth corners (one pixel up and out from each end of the light mouth patch at x~21-27,y~29-30).
 - After these I expect likeness 88-90 and approval at average 92; if the owner wants a stronger read, add a Monster-can in the left hand (REGENERATE only if code patch fails).

## Recommended order
1. Chavoso: paint the silver chain, then APPROVED (no regeneration).
2. Donnie: eyes + septum + neck patch, then re-judge (likely APPROVED).
3. Rafinha: veins + brows + smile corners, then re-judge (likely APPROVED).
