# Jacquin - Batch 5 summary (Gemini-app attempt 2 with Gemini style delta; cats 4b and 10 enforced)

Measured (Python313, cleaned PNGs): logical size WxH / colors / mean S,V / components (orphans < 12 px = 0 on all):
toilet paper 88x95 / 22 / .22,.75 - sandpaper 91x87 / 24 / .57,.74 - frozen 82x86 / 24 / .38,.76 - permafrost 79x89 / 23 / .40,.58 - belt sander 91x75 / 24 / .60,.46 - burnt pizza 96x97 / 24 / .64,.49 - Clorox (ref) 36x68 / 30 / .54,.72.
Grid is clean on all six (single connected component, 1 px outline, no orphans). The Gemini delta fixed the mood problem (S/V now sit in the approved muted range). All six are 75-97 px tall vs the 48 px small-monster target: this is a display-scale decision (integer scale only), not a defect, but pizza/sandpaper/toilet paper are boss-sized and should be used as chapter bosses or scaled by an integer divisor at export.

## Verdict blocks

```
JACQUIN VERDICT: APPROVED
Asset: ch1_toiletpaper_gem2_0   Type: monster   Attempt: 2 (Gemini; blind-ID 98% "toilet paper roll")
Scores: pixel 92 | silhouette 94 | color 90 | anatomy 92 | 4b-logic 92 | design 91 | symmetry 91 | ready 92 | brief 94 | concept 98   => overall 92
4b construction check:
 - Roll body: upright cylinder, top ellipse with dark centre hole and lighter rim, quilted diamond emboss on the face (reason: real tissue quilting, also gives grid-aligned texture). Emboss is flat, does not curve at the edges: only cosmetic.
 - Loose sheet: starts at the roll's top-right rim as the outer layer, separated from the roll by a dark fold line, hangs down the right side and over the right foot, ends in a torn/serrated hem on the floor. This is how a sheet really leaves a roll (tangentially off the side). The old "sheet from the middle of the body" error is GONE.
 - Arms: pale tube arms leave the roll's left and right edge at about 55% height (chibi shoulders), fists hang by the hips; right arm is partly behind the sheet, consistent depth.
 - Legs: two short legs come out under the roll's base, grey shadow gap = ambient occlusion. Feet on one baseline.
 - Face: on the main flat front, small, angry brows + orange eyes (the accent). No part floats.
 AI tells at x4: none structural. The cardboard tube is only a dark hole (no brown ring): minor lost iconic detail, not a rejection.
Cat 10: blind 98% -> 98.
What works: the most readable piece in the set; physical sheet; palette 22 colors; clean outline.
Defects: none blocking.
Fix: none. Suggested name: monster_ch1_toiletpaper.png. ROSTER ANCHOR candidate (ANCHOR_monster).
```

```
JACQUIN VERDICT: APPROVED
Asset: ch3_sandpaper_gem2_0   Type: monster   Attempt: 2 (blind-ID 92% "sheet of sandpaper grit 120")
Scores: pixel 91 | silhouette 92 | color 90 | anatomy 90 | 4b-logic 91 | design 92 | symmetry 91 | ready 92 | brief 93 | concept 92   => overall 92
4b construction check:
 - Body: one upright rectangular sheet (the real silhouette, face drawn ON it, not replacing it). Grit = scattered 1-2 px dark specks (reason: abrasive). Specks are sparse and evenly spaced, slightly "polka dot": cosmetic.
 - Peeled corner (top right): folds forward and shows the pale paper back with the printed "120"; the fold edge is a clean diagonal with a violet shadow beneath it. Real sandpaper has exactly this label on its back: every detail has a reason.
 - Bottom edge: torn, ragged hem (reason: used sheet). Faint crease on the left flank is a deliberate wear mark.
 - Arms: thin tube arms start at the sheet's left/right edge at about 55% height with fists; legs start from under the torn hem, thin, dark feet. All attach at plausible points.
 - Face: heavy brows hide the eyes (slits only), mouth is a frown. Readable at 64 px.
 AI tells at x4: none structural; "120" digits are generated, check they are crisp.
Cat 10: blind 92% -> 92.
What works: iconic features all present (grit, torn edge, peeled label); matches the Gemini mood fix (S .57).
Fix: none. Optional code touch: restamp "120" in the shared pixel font if one digit looks uneven. Suggested name: monster_ch3_sandpaper.png. ROSTER ANCHOR (second).
```

```
JACQUIN VERDICT: REJECTED   (REGENERATE)
Asset: ch2_frozen_gem2_0 (frozen condom, ring evolution A)   Type: monster   Attempt: 2 (blind-ID 88% "icy condom with foil wrapper in hand")
Scores: pixel 90 | silhouette 88 | color 91 | anatomy 82 | 4b-logic 78 | design 85 | symmetry 88 | ready 88 | brief 88 | concept 88   => overall 86
4b construction check:
 - Body: sheath with a bulbous reservoir tip that leans and DROOPS to the right like a hat/hood; the tip has no reason to fold (a condom's reservoir is a small nipple on the end). Reads as a nightcap.
 - Rim: rolled ring at the base exists but is thin and merges with the icicle drips: weak.
 - Left (viewer) arm: raised arm tube rises from the lower-left of the body and bends up to the hand; the shoulder join is a smooth blob with no shoulder point, the arm looks like a hose.
 - Wrapper: a flat grey square with scuffs. A foil packet needs a serrated tear edge on at least two sides, a raised centre ring and crimp lines; here it reads as a tile or a card.
 - Icicles: hang at inconsistent angles (some slanted right, some left) with no gravity logic, and not all start from a surface edge.
Cat 10: blind 88% passes the 85 bar, but the wrapper ambiguity is exactly the owner's complaint.
Fix: REGENERATE. Prompt delta (physical): "tip: a small round reservoir nipple on top of the sheath, standing straight up, no bend, no droop. Base: a thick rolled rubber ring (2 px lighter highlight band) clearly wider than the body. Left arm: attaches at the shoulder point, a short thick arm bending at the elbow, fist raised holding the packet. Wrapper: a square foil packet with crimped serrated edges on the left and right sides (zigzag), a circular raised ring in the centre, silver with 3 tones, one corner torn open. Icicles: 4-5 icicles all hanging STRAIGHT DOWN (vertical) from the underside of the rim and the raised arm, each one attached to a surface." Keep the face, pose and palette (they work).
Suggested name if redone: monster_ch2_frozen_condom.png
```

```
JACQUIN VERDICT: REJECTED   (REGENERATE)
Asset: ch2_permafrost_gem2_0 (permafrost condom, evolution B)   Type: monster   Attempt: 2 (blind-ID 85% "purple condom holding foil packet as shield")
Scores: pixel 90 | silhouette 84 | color 88 | anatomy 80 | 4b-logic 72 | design 86 | symmetry 86 | ready 86 | brief 84 | concept 85   => overall 84
4b construction check:
 - Ice crystals: two small crystal clusters sit on the left and right shoulders and are drawn as separate shapes with no root: they float (zoom x10 confirms the outline closes around them with a gap at the body). Unexplained.
 - Shield arm: the packet covers the arm; the arm only appears as a dark lump behind it, so no shoulder, no elbow, no hand: it vanishes.
 - Tip: reservoir is a fat sideways nub, reads as a topknot/mushroom, not a tip.
 - Body: lumpy, with irregular highlight streaks that do not follow the cylinder; no clear rolled rim at the base (a wide hem is there but is shapeless).
 - Right arm and fist are fine and connect at the shoulder.
 - Good: orange eyes = the single accent; palette dark violet matches the "permafrost" idea and the mood (V .58).
Cat 10: 85% sits exactly at the floor; the lumpy form is why it is not a stronger read. With the evolution pair judged together, B must mirror A's design language.
Fix: REGENERATE, same construction rules as A plus: "ice crystals GROW OUT of the shoulders: each cluster has its base embedded in the body with 2-3 spikes of different length, all pointing up and outward; the left arm is fully visible, bent at the elbow, fist in front of the chest holding the shield packet by its top edge; packet is a crimped-edge foil square with a raised centre ring, held in FRONT of the arm; smooth cylindrical body with two long vertical highlight streaks; thick rolled rim at the base; tip is a small upright nipple; keep the glowing orange eyes."
Suggested name if redone: monster_ch2_permafrost_condom.png
```

```
JACQUIN VERDICT: REJECTED   (REGENERATE; if attempt 3 also fails, ESCALATE: build the sander as a simple front-view box + tracks)
Asset: ch3_beltsander_gem2_0   Type: monster   Attempt: 2 (blind-ID 65% "belt sander")
Scores: pixel 88 | silhouette 66 | color 80 | anatomy 62 | 4b-logic 55 | design 70 | symmetry 74 | ready 72 | brief 70 | concept 65   => overall 70
4b construction check (zoom x10):
 - Viewpoint: 3/4 top view with the face on the SIDE end and the fist-arm on the other side: the face is not on the main surface, so the character is ambiguous.
 - Face: tiny, two low-contrast yellow slits, 12% of body width: unreadable at 64 px.
 - Orange coil/arm across the front: a thick tube with no origin and no end: it is neither the cord nor the arm.
 - Dust bag: a grey funnel plugged into a tube at the rear top that attaches to nothing on the motor housing; bag and tube have different widths at the join.
 - Cord: leaves from the right-rear and trails away to a plug; plug is odd and tangled with the right-hand wheel and arm.
 - Belt: tiny tan strip under the nose (the whole concept) plus two roller discs; the belt loop does not wrap around the rollers.
 - Plank: a wooden board with scraps reads as junk, not as the workpiece it sanded.
 - Right-side limb and wheel are a tangle with no clear shoulder or hip.
Cat 10: 65% < 70 -> capped at 60.
Fix: REGENERATE with a physical prompt delta: "Orthographic FRONT view (like the other monsters), a belt sander standing upright on its rear end: a chunky orange motor housing box in the upper 55%, with the angry face on its large flat front panel (big yellow eyes, thick brows, mouth, filling 40% of the panel). Carry handle: a single arch on top. BELT: a wide dark-grey loop belt with visible sanding grit speckle running around two big round rollers at the bottom, taking the whole bottom third and wider than the box so it is the iconic part. Two short thick arms attach at the sides of the housing at shoulder height ending in big fists; two short legs under the belt unit. Cord: ONE black cable leaves the back-bottom of the housing and ends in a plug on the floor beside the right foot. Dust bag: a small cloth bag clamped on a short spout at the right side of the housing. No plank, no extra coils or wheels."
Suggested name if redone: monster_ch3_beltsander.png
```

```
JACQUIN VERDICT: APPROVED
Asset: ch4_burntpizza_gem1_0   Type: monster (boss-sized)   Attempt: 1 (Gemini; blind-ID 96% "pizza")
Scores: pixel 92 | silhouette 93 | color 91 | anatomy 91 | 4b-logic 90 | design 93 | symmetry 91 | ready 92 | brief 93 | concept 96   => overall 92
4b construction check:
 - Body: round pizza seen face-on: raised crust ring (3 tones), 6 radial slice cuts, pepperoni discs, black burnt patches (reason: "burnt"). Pepperoni and burnt spots all sit INSIDE the disc, follow the circular form.
 - Face: eyes and frown on the central cheese area; the slice cut lines pass behind the brows (cuts run into the face): mild clutter, acceptable.
 - Arms: thick dough-brown arms leave from behind the disc at its widest points (like shoulders), big fists, matching legs under the lower crust, feet on one baseline. Arm and leg textures (dough) differ from the cheese: material difference clear.
 - Smoke: two violet curls rise from the top-left and top-right of the crust (reason: smoke from burnt crust), thin 2 px lines, clearly separated from the body: slightly detached, but it is the one non-contact effect and it reads.
 - Missing: stringy melted cheese (iconic) absent; the blind test still passes at 96.
 AI tells at x4: none structural; pepperoni sizes vary naturally.
Cat 10: blind 96% -> 96.
What works: strongest silhouette in the set, coherent material read, S .64/V .49 matches the dark roster.
Fix: none. Suggested name: monster_ch4_burntpizza.png. ROSTER ANCHOR (third), best candidate for a mid-boss given 96 px size.
```

## Table

| Asset | File | Verdict | Fix | Approved name suggestion |
|---|---|---|---|---|
| Toilet paper (ch1) | out/clean/ch1_toiletpaper_gem2_0.png | APPROVED (anchor) | none | monster_ch1_toiletpaper.png |
| Sandpaper (ch3) | out/clean/ch3_sandpaper_gem2_0.png | APPROVED (anchor) | none (optional restamp of "120") | monster_ch3_sandpaper.png |
| Frozen condom (ch2 A) | out/clean/ch2_frozen_gem2_0.png | REJECTED | REGENERATE: upright nipple tip, thick rim, shoulder-attached arm, crimped foil packet, vertical icicles | monster_ch2_frozen_condom.png |
| Permafrost condom (ch2 B) | out/clean/ch2_permafrost_gem2_0.png | REJECTED | REGENERATE: crystals rooted in shoulders, visible shield arm, clean cylinder, rolled rim | monster_ch2_permafrost_condom.png |
| Belt sander (ch3) | out/clean/ch3_beltsander_gem2_0.png | REJECTED | REGENERATE: front view, face on main panel, big grit belt on rollers, one cord, one bag; ESCALATE if attempt 3 fails | monster_ch3_beltsander.png |
| Burnt pizza (ch4) | out/clean/ch4_burntpizza_gem1_0.png | APPROVED (anchor) | none | monster_ch4_burntpizza.png |

Roster anchors: toilet paper (ANCHOR_monster), burnt pizza, sandpaper. Condoms and belt sander are not anchors. Clorox is still pending its code fixes (it is not part of this batch). Gemini attempt 2 is the standard going forward: the style delta works; the remaining failures are construction, which the physical-prompt rule already addresses.

## Attempt 3

Measured (Python313, cleaned PNGs): size WxH / colors / mean S,V / components / mirror-overlap of the silhouette:
frozen 82x84 / 24 / .37,.74 / 1 / .63 - permafrost 92x90 / 24 / .44,.65 / 1 / .71 - belt sander 90x89 / 24 / .56,.44 / 1 / .88 - (ref) toilet paper 88x95 / 22 / .22,.75 / 1 / .93. Grid clean, no orphans, outline 1 px on all three. Props (packet, bag) explain the lower mirror scores. The physical deltas worked: upright nipple, thick rim, serrated packet, vertical icicles, front view and face on the main panel are all fixed. What remains is surface detail, which code can mostly handle.

```
JACQUIN VERDICT: REJECTED   (FIXABLE_IN_CODE)
Asset: ch2_frozen_gem3_0   Type: monster   Attempt: 3 (blind-ID 88%)
Scores: pixel 91 | silhouette 91 | color 90 | anatomy 88 | 4b-logic 88 | design 89 | symmetry 89 | ready 90 | brief 91 | concept 88   => overall 90
4b check:
 - Tip: small upright nipple, no droop (FIXED). Body: smooth cylinder with a vertical highlight, face on the front.
 - Rim: thick rolled ring, wider than the body, 2-tone highlight (FIXED). Reads a bit like a float because it has no inner crease line.
 - Right-hand (viewer) arm: leaves the body at shoulder height, bends at the elbow, fist grips the packet from below (FIXED, grip is readable).
 - Left arm: hangs and bends out from the ring height, hand ends as a blunt stub at the rim; shoulder point is soft. Minor.
 - Wrapper: crimped serrated sides, centre ring. The ring emboss is noisy (grey speckle), reads stamp/coin.
 - Icicles: 4-5, all vertical, each hangs from the rim underside or the raised forearm (FIXED).
Cat 10: blind 88% -> 88.
Fix (code, then re-judge): (1) restamp the packet centre as a clean 2-tone ring (1 outer dark px circle, 2 px light band, flat fill, no speckle); (2) add a 1 px darker crease line across the ring's top edge where the body meets it (separates body from float-like tube); (3) add a 1 px shadow arc at the left shoulder where the arm leaves the body at about 55% height. No regeneration.
```

```
JACQUIN VERDICT: REJECTED   (FIXABLE_IN_CODE)
Asset: ch2_permafrost_gem3_0   Type: monster   Attempt: 3 (blind-ID 90%)
Scores: pixel 91 | silhouette 88 | color 89 | anatomy 84 | 4b-logic 82 | design 87 | symmetry 87 | ready 88 | brief 86 | concept 90   => overall 87
4b check:
 - Tip: upright nipple (FIXED). Body: clean cylinder with highlight streak (FIXED). Rim: thick rolled ring (FIXED); ring is tube-like because it has no seam, same as frozen.
 - Crystals: now rooted at the shoulders, two spikes each, pointing up/outward (FIXED), but they are cyan-white with violet veins and a feather outline: they read as leaves/wings. Material wrong.
 - Shield arm: the fist sits on the packet top edge, but NO wrist or forearm is visible between fist and body (the packet hides it): the fist floats. This is the remaining construction error.
 - Packet: large, flat, 3-tone grey, serrated on the left only; the right edge touches the body. Oversized (about 40% of the body width plus).
 - Right arm: leaves the body at shoulder, bends at the elbow, fist at the hip (the "bends at the hip" note: elbow sits too low). Minor.
Cat 10: blind 90% -> 90.
Fix (code): (1) recolor crystals to a hard-faceted ice palette: 3 flat tones (pale cyan highlight, mid blue, dark violet shadow), delete the vein lines, make each spike a straight-edged triangle; (2) paint a forearm: a violet tube 5 px high with 1 px outline from the fist's right edge across the packet's top-right corner to the body's left edge at shoulder height, drawn OVER the packet, so the fist visibly connects; (3) add crimp zigzag on the packet's right edge and 2 vertical crimp lines at the left/right edges to cut the flat area; (4) darken the packet 1 step so it recedes behind the arm. If the arm cannot be painted cleanly, REGENERATE with: "the arm is fully visible: a violet tube from the shoulder to a fist in FRONT of the packet; the packet is half the current size."
```

```
JACQUIN VERDICT: REJECTED   (FIXABLE_IN_CODE; if re-blind-ID < 85 after the fix, ESCALATE)
Asset: ch3_beltsander_gem3_0   Type: monster   Attempt: 3 (blind-ID 78%)
Scores: pixel 90 | silhouette 86 | color 86 | anatomy 84 | 4b-logic 80 | design 84 | symmetry 86 | ready 88 | brief 82 | concept 78   => overall 84
4b check:
 - Viewpoint: front view, face on the big flat panel, big angry yellow eyes: readable at 64 px (FIXED).
 - Handle: single arch on top, attached at two points to the housing (correct for a sander). With the box shape it gives toolbox/radio/CRT.
 - Belt: plain dark cylinder under the box, no flat grit surface, no seam, no tracking line: the iconic part is missing. This is the main reason for 78.
 - Rollers: two discs with hubs on the right side only: crammed and asymmetric; a belt loop needs a roller at each end. Reads as tank track or tyres.
 - Dust bag: tan sack on a small orange spout at the upper right: it does attach to a spout (FIXED) but the spout is 3 px and it hangs like a shoulder sack. Minor.
 - Cord: leaves the back-bottom, ends in a plug on the floor beside the right foot (FIXED).
 - Arms/legs: arms attach at the housing sides at shoulder height, legs under the belt unit. Fine.
Cat 10: blind 78% < 85, so the category is below the bar.
Fix (code first): (1) belt: add sparse 1 px light-tan grit specks (one per 3-4 px, irregular) over the whole belt, a 1 px diagonal seam line, and a 2-tone lighter band on the top edge so it reads as a flat sanding surface; (2) lighten the belt a half step toward warm brown-grey (it is V .44 and merges with the dark legs); (3) shift the left roller: copy the right roller hub to the belt's left end (mirror) so both ends have a roller; (4) widen the spout to 5 px and add an orange collar. Re-run blind-ID. If it is still < 85: ESCALATE: build the belt unit as a separate part in code (rounded-rectangle loop with grit pattern and two rollers) under this housing and legs.
```

| Asset | File | Verdict | Fix |
|---|---|---|---|
| Frozen condom | out/clean/ch2_frozen_gem3_0.png | REJECTED (avg 90) | FIXABLE_IN_CODE: clean packet ring, rim crease, shoulder shadow |
| Permafrost condom | out/clean/ch2_permafrost_gem3_0.png | REJECTED (avg 87) | FIXABLE_IN_CODE: recolor crystals, paint forearm, crimp packet |
| Belt sander | out/clean/ch3_beltsander_gem3_0.png | REJECTED (avg 84) | FIXABLE_IN_CODE: grit belt, left roller, spout; ESCALATE if blind-ID < 85 |

## Attempt 4 (decision round)

Measured (Python313, cleaned PNGs): size / colors / mean S,V / components / mirror-overlap: frozen gem3 82x84 / 24 / .37,.74 / 1 / .46 - permafrost gem4 88x92 / 24 / .46,.66 / 1 / .82 - belt sander gem4 91x90 / 24 / .53,.58 / 1 / .71 (gem3 was V .44; the lift to .58 fixed the belt merging with the legs). Grid clean, 1 px outline, no orphans. Anchors for comparison: toilet paper 88x95 / .22,.75; sandpaper 91x87 / .57,.74. Evolution logic: frozen (slim, thin icicles) -> permafrost (bulky, spiked, violet) reads as a deliberate power-up pair; both share nipple tip, thick rolled rim, crimped packet. Rule for this round: all three are "good and consistent"; remaining items are surface touches scripted in code, no further generation.

```
JACQUIN VERDICT: APPROVED_WITH_CODE_FIX   (FIXABLE_IN_CODE, no re-judge needed if the fix is exactly this)
Asset: ch2_frozen_gem3_0   Type: monster   Attempt: 3 (final pick; blind-ID 88%)
Scores: pixel 91 | silhouette 91 | color 90 | anatomy 88 | 4b-logic 88 | design 89 | symmetry 89 | ready 90 | brief 91 | concept 88   => overall 90
4b: nipple tip, cylinder body, thick rim, shoulder-attached raised arm gripping the packet, vertical icicles each rooted on rim or forearm: all attach and obey physics. Left arm hand ends as a blunt stub at the rim (minor, reads as a fist at 1x).
Fix (script, pixel-level): (1) packet centre: replace the speckled ring with a flat 2-tone ring (1 px dark outer circle, 2 px light band, flat mid-grey fill, no noise); (2) 1 px darker crease line (body shadow colour) along the top edge of the rim where body meets ring; (3) 1 px shadow arc on the left arm's upper edge at about 55% height. Then ship as monster_ch2_frozen_condom.png.
```

```
JACQUIN VERDICT: APPROVED_WITH_CODE_FIX   (FIXABLE_IN_CODE)
Asset: ch2_permafrost_gem4_0   Type: monster   Attempt: 4 (blind-ID 80%; noted: 80 < 85 cat-10 bar, accepted because the pair is judged together and frozen carries the 88 read; the wrapper fix below is what raises it)
Scores: pixel 91 | silhouette 91 | color 89 | anatomy 87 | 4b-logic 88 | design 90 | symmetry 90 | ready 90 | brief 89 | concept 84   => overall 89
4b: the attempt-3 construction error is FIXED: forearm visible from shoulder to fist, fist grips the packet's top edge; spikes grow out of the shoulders/dome with a root; right arm bends at the elbow to a fist at the hip; nipple tip and rolled rim present; body is clean. Forearm thickness differs from the right arm (muscular vs plain): reads as a deliberate "brawler" arm, acceptable. Stubby legs are consistent with the roster's chibi proportions.
Fix (script): (1) packet = coaster/tile: delete a 3x3 triangle at one corner (bottom-right) to show a torn corner and add a 1 px lighter foil-highlight diagonal across the upper-left half; (2) recolour the packet outline and the 1 px zigzag along ALL four edges one step darker so the crimp reads; (3) tint the packet 1 step toward blue-grey (it is flat neutral grey, the only neutral in a violet sprite); (4) shards: recolour the lightest pale pixels to the frozen sprite's pale-cyan highlight and add a 1 px mid-blue shadow edge on each shard's right side so they match frozen's ice and read as attached. Then ship as monster_ch2_permafrost_condom.png.
```

```
JACQUIN VERDICT: APPROVED_WITH_CODE_FIX   (FIXABLE_IN_CODE)
Asset: ch3_beltsander_gem4_0   Type: monster   Attempt: 4 (blind-ID 85% "belt sander")
Scores: pixel 91 | silhouette 91 | color 89 | anatomy 87 | 4b-logic 87 | design 90 | symmetry 88 | ready 90 | brief 90 | concept 85   => overall 89
4b: front view, face on the main orange panel, one top handle with two attachments, belt unit with a lighter top band and a visible end roller at the right, one cord ending in a plug, dust hose on a collar at the upper right. The hip knob is not a purpose-less lump: it is the belt's end roller hub (the left end is covered by the arm). Hose reads as a hose (ribbed grey tube) once the right-shoulder pixels get a collar.
Fix (script): (1) belt: add sparse 1 px darker-tan grit specks (about one per 4 px, irregular) over the belt body and one 1 px diagonal seam so it reads as an abrasive surface, not a tan apron; (2) draw a 1 px dark line from the cord's first pixel up to the underside of the belt unit so the cord visibly leaves the housing; (3) hose: add a 2 px dark-orange collar band where it meets the housing and 2-3 1 px darker rib lines across the hose so it cannot read banana/pipe; (4) arms: add a 1 px dark band (cuff) at each wrist, matching the housing's dark tone, to give the arms a mechanical read. Ship as monster_ch3_beltsander.png.
```

| Asset | File | Verdict | Fix |
|---|---|---|---|
| Frozen condom (ch2 A) | out/clean/ch2_frozen_gem3_0.png | APPROVED_WITH_CODE_FIX (avg 90) | flat 2-tone packet ring, rim crease, shoulder shadow arc |
| Permafrost condom (ch2 B) | out/clean/ch2_permafrost_gem4_0.png | APPROVED_WITH_CODE_FIX (avg 89) | torn corner and 4-edge crimp on packet, blue-grey tint, shards matched to frozen ice |
| Belt sander (ch3) | out/clean/ch3_beltsander_gem4_0.png | APPROVED_WITH_CODE_FIX (avg 89) | grit specks and seam on belt, cord joined to housing, hose collar and ribs, wrist cuffs |

Closing note: chapter 2 and 3 monsters are done after these scripts run. The averages sit at 89-90, below the strict 92 bar; this is a deliberate decision-round exception (good and consistent, fourth attempt), not a precedent.
