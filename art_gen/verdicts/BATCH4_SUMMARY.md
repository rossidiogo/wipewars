# Jacquin - Batch 4 summary (ch2, ch3, ch4 monsters, redo icons) - attempt 1 each

Measured (Python313): sizes WxH Clorox idle 36x68 / ch2 41x32 + 45x42 / ch3 45x48 + 44x46 / ch4 45x54 + 44x52; colors 22-24 (Clorox 30); grid period 10.25 uniform on all three raws; no magenta, no semi-alpha. Icons are 40x40 cells, 21-22 colors.

## Verdict blocks

```
JACQUIN VERDICT: REJECTED   (REGENERATE)
Asset: ch2_frozen_ring (ch2_monsters_1_0)   Type: monster   Attempt: 1
Scores: pixel 88 | silhouette 80 | color 90 | anatomy 78 | design 78 | symmetry 78 | ready 88 | brief 70 | likeness N/A   => overall 81
What works: cold pale-blue ramp is hue-shifted and clean, angry face reads, strong contrast on the panel (1% low-contrast).
Defects (most severe first):
 1. No ring: it is a solid blue ball with a face; the rubber-ring hole (the whole concept) is missing.
 2. No legs or feet: body sits on the ground with two floating fists, no shared baseline like every other monster.
 3. 41x32 px: 10 px shorter than its evolution (42) and 14-22 px shorter than ch3/ch4 monsters (46-54); reads as a blob, not 2.5-3 heads.
 4. "Frozen" is only a colour; no icicles/frost crystals.
Fix: REGENERATE. Prompt delta: "a thick donut-shaped inflatable swim ring seen from the front with a clearly visible round hole through the middle (background shows through), face on the lower thick arc of the tube, two short stubby legs with big feet on one baseline, large round fists, 3 icicles hanging from the tube, frost-white highlight stripe on the tube; creature 2.5 heads tall, taller than wide".
```
```
JACQUIN VERDICT: REJECTED   (FIXABLE_IN_CODE; re-judge after the left one is regenerated)
Asset: ch2_permafrost_ring (ch2_monsters_1_1)   Type: monster   Attempt: 1
Scores: pixel 90 | silhouette 86 | color 82 | anatomy 86 | design 88 | symmetry 84 | ready 84 | brief 78 | likeness N/A   => overall 85
What works: spiked crystal crown, glowing orange eyes (the one saturated accent), chunky legs and fists, clean 22-colour grid.
Defects:
 1. Mean lightness 92 vs 153 for its sibling; 12% of pixels are near the #1a1612 panel (left arm and legs sink).
 2. No ring hole either; the lighter disc reads as a face plate, so it is not recognisably "the permafrost ring". Pair link is lost.
 3. Left arm is a huge undefined blob compared with the right.
Fix: code: lift body ramp +0.10 L, add 1px cool rim (pale blue) on right and top-left edges, lift spike tips to ice-blue. The ring hole must match the regenerated left monster; if it does not, regenerate with the same delta as the left one plus "dark violet-blue ice, spiked crystal crown, glowing orange eyes, ring hole visible".
```
```
JACQUIN VERDICT: REJECTED   (REGENERATE)
Asset: ch3_sandpaper_belt_ring (ch3_monsters_1_0)   Type: monster   Attempt: 1
Scores: pixel 90 | silhouette 91 | color 88 | anatomy 82 | design 84 | symmetry 88 | ready 90 | brief 86 | likeness N/A   => overall 87
What works: best silhouette of the batch, a real ring with a clear hole and thick inner wall, warm orange/brown reads well, grit speckle suits sandpaper, legs and fists chunky and at roster scale.
Defects:
 1. Face is crammed on the left edge of the ring: one eye plus a small open mouth, reads as a profile scream and is unreadable at 64 px.
 2. Arms are the same hue as the ring with weak separation from the body.
 3. No belt-sander cue (no buckle/seam/grit band), so it could be any orange ring.
Fix: REGENERATE. Delta: "face on the front of the thick band: two angry slanted eyes and a wide toothy mouth, centered on the band; a visible overlap seam with a rusty metal buckle; slightly paler tan grit speckle; arms a darker brown than the ring; hole stays".
```
```
JACQUIN VERDICT: REJECTED   (FIXABLE_IN_CODE)
Asset: ch3_belt_sander (ch3_monsters_1_1)   Type: monster   Attempt: 1
Scores: pixel 90 | silhouette 88 | color 82 | anatomy 88 | design 86 | symmetry 88 | ready 88 | brief 86 | likeness N/A   => overall 87
What works: grumpy yellow-eyed face is the clearest in the batch, handle and brown belt wedge give a power-tool read, limbs and stance match the roster.
Defects:
 1. Slate green-grey body, arms and legs are one dull value; 16% of pixels near the panel; arms and legs merge.
 2. Handle ring is thin (2 px).
 3. Sander belt is a small flat brown wedge; could read as a toaster/iron.
Fix: code: lift body +0.08 L, limbs +0.10 L, thicken handle to 3 px, add 1px pale rim right and top-left. Optional: widen the belt wedge.
```
```
JACQUIN VERDICT: REJECTED   (REGENERATE)
Asset: ch4_burnt_pizza (ch4_monsters_1_0)   Type: monster   Attempt: 1
Scores: pixel 86 | silhouette 84 | color 80 | anatomy 84 | design 84 | symmetry 84 | ready 80 | brief 84 | likeness N/A   => overall 83
What works: round pizza body with charred rim and screaming face is funny; purple steam is a nice accent.
Defects:
 1. Face drowned in pepperoni/char speckle: eyes and mouth are not separated from the topping noise at 64 px.
 2. 29.5% of pixels near the panel colour: fists and legs are dark violet-grey on a dark panel.
 3. Steam wisps are 1 px, detached (38 px orphan component) and thin; the burnt cue is only colour.
Fix: REGENERATE. Delta: "large plain orange cheese centre with a bold simple angry face (two light eyes, wide mouth) and NO topping speckle near the face; thick charcoal-black burnt rim; arms and legs mid blue-grey, lighter than a dark panel; steam as 2-3 px thick grey wisps attached to the top; every part at least 3 px thick".
```
```
JACQUIN VERDICT: REJECTED   (FIXABLE_IN_CODE)
Asset: ch4_pizza_slice (ch4_monsters_1_1)   Type: monster   Attempt: 1
Scores: pixel 90 | silhouette 92 | color 90 | anatomy 90 | design 93 | symmetry 90 | ready 90 | brief 88 | likeness N/A   => overall 91
What works: strongest monster of the batch: angry brows, dripping cheese, pepperoni with bright rim, red crust, clear triangular silhouette, fists and legs at roster scale.
Defects:
 1. Legs and forearms are dark grey with ~11% near-panel pixels; they sink on #1a1612.
 2. "Dropped" is not shown (no splat/cheese puddle or tilt); brief only half met.
 3. Outline halo left of the crust is slightly fuzzy.
Fix: code: lift legs and arms +0.08 L, 1px pale rim on right and top-left, clean the crust halo. No regeneration needed; re-judge as attempt 2 (expected approve).
```
```
JACQUIN VERDICT: APPROVED
Asset: items_redo_1_0 light leather jerkin   Type: icon   Attempt: 1
Scores: pixel 92 | silhouette 91 | color 92 | anatomy 92 | design 90 | symmetry 92 | ready 92 | brief 94 | likeness N/A   => overall 92
What works: finally light (tan vs panel), crossed straps and sleeves read at 32 px, leather material clear, 22 colours.
Defects (not blocking): collar a little thin; fills the full 40 cell width (same as approved boots/axe).
Fix: none. Name: body_leather_dex.
```
```
JACQUIN VERDICT: REJECTED   (FIXABLE_IN_CODE)
Asset: items_redo_1_1 olive hood   Type: icon   Attempt: 1
Scores: pixel 90 | silhouette 88 | color 86 | anatomy 84 | design 82 | symmetry 88 | ready 90 | brief 80 | likeness N/A   => overall 86
What works: value lifted (no longer a murky blob), clean thick outline, hood shape clear.
Defects: 1. Face opening is a flat beige oval with no shading: reads as a blank mask / egg head, not a hood opening. 2. Hood interior has no inner shadow band. 3. Seam line at the top is 1 px.
Fix: code: recolour the oval interior to a 3-tone dark olive-brown ramp (shadow top-left, darker bottom-right) plus a 2 px lighter inner lip around it; keep the exterior as is.
```
```
JACQUIN VERDICT: APPROVED
Asset: items_redo_1_2 thick winged circlet   Type: icon   Attempt: 1
Scores: pixel 92 | silhouette 94 | color 92 | anatomy 92 | design 92 | symmetry 92 | ready 92 | brief 94 | likeness N/A   => overall 93
What works: band is now 3-4 px gold with a gem, wings are large and chunky in pale silver with a clear value step, reads at 32 px, matches the crowned helm family.
Fix: none. Name: helm_circlet_int.
```
```
JACQUIN VERDICT: APPROVED
Asset: items_redo_1_3 silver gauntlet   Type: icon   Attempt: 1
Scores: pixel 92 | silhouette 92 | color 93 | anatomy 91 | design 92 | symmetry 92 | ready 93 | brief 94 | likeness N/A   => overall 92
What works: light silver value, four separated fingers and a thumb, gold rivets as the single accent, upright palm-out like gloves_blue_int.
Defects (not blocking): near-duplicate of approved gloves_steel_str in concept; fingers 3 px wide.
Fix: none. Name: gloves_silver_str (replaces the rejected steel gauntlet; keep only one if you prefer).
```

## Roster symmetry (monsters)
- Height ladder: Clorox 68 > ch4 54/52 > ch3 48/46 > ch2 42 > ch2 frozen 32 (outlier). Pick one scale rule (small monsters ~48, evolutions +-6 px). Clorox is the odd one: taller, armless, 30 colours, creamy palette. Chapters 2-4 (big fists, short thick legs, angry brows) form a consistent family among themselves.
- Pairs: ch3 and ch4 pairs match in size and style; the ch2 pair does not (size, silhouette, value). Right-hand creatures are darker (mean L 90-105) than the left; lift +0.08 L for panel contrast. Accents are good (orange eyes, yellow eyes, red pepperoni).
- Light direction top-left holds everywhere; the cool right rim is missing on ch2_1, ch3_1, ch4_0.

## Table

| asset | file | APPROVED/REJECTED | fix | approved name |
|---|---|---|---|---|
| Frozen rubber ring | ch2_monsters_1_0.png | REJECTED | REGENERATE (ring hole, legs, icicles) | - |
| Permafrost ring | ch2_monsters_1_1.png | REJECTED | code lift +0.10 L, rim; match ring hole | - |
| Sandpaper belt ring | ch3_monsters_1_0.png | REJECTED | REGENERATE (face on front, seam/buckle) | - |
| Belt sander | ch3_monsters_1_1.png | REJECTED | code lift, thicker handle, rim | - |
| Burnt mini pizza | ch4_monsters_1_0.png | REJECTED | REGENERATE (clean face, lighter limbs, thick steam) | - |
| Dropped pizza slice | ch4_monsters_1_1.png | REJECTED | code lift limbs +0.08 L, rim (near approval) | ch4_pizza_slice (after fix) |
| Leather jerkin | items_redo_1_0_c40.png | APPROVED | none | body_leather_dex |
| Olive hood | items_redo_1_1_c40.png | REJECTED | code: dark 3-tone face opening | - |
| Winged circlet | items_redo_1_2_c40.png | APPROVED | none | helm_circlet_int |
| Silver gauntlet | items_redo_1_3_c40.png | APPROVED | none | gloves_silver_str |

Copy to art_gen\approved\items\: items_redo_1_0_c40.png -> body_leather_dex.png; items_redo_1_2_c40.png -> helm_circlet_int.png; items_redo_1_3_c40.png -> gloves_silver_str.png. No monsters approved this round.
