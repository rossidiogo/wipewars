JACQUIN VERDICT: REJECTED   (FIXABLE_IN_CODE)
Asset: rafinha_orc (ULT form of Rafinha)   Type: hero sprite (ult form)   Attempt: 1
Scores: pixel 88 | silhouette 92 | color 86 | anatomy 90 | design 92 | symmetry 90 | ready 92 | brief 82 | likeness 84   => overall 88
(concept blind-ID: report art_gen/verdicts/blind_rafinha_orc.md NOT produced - Jacquin has no subagent tool. Own reading: unmistakably a WoW-style orc. Producer must run the cheap blind agent before final approval.)

Measured (Pillow, 1x file): 75x93 px, 24 colors, 0 semi-transparent pixels, 1px unbroken outline (409 edge px, all dark, navy ~#010626). Roster: jack 78x87, daniel 71x86, ze 62x89, chavoso 65x90, donnie 72x89, normal rafinha 51x79. Orc is 4-6 px taller than the roster and similar in width: right size for "bigger, tankier" without breaking the roster ratios.
Views made: x8 side-by-side with normal form, x4 roster strip, 112 px and 151 px (x1.35) previews on #1a1612, x20 head, x12 torso (scratchpad, not in repo).

Likeness check: signature features at in-game size:
 - full black beard: WEAK-OK (dark chin tuft + dark strip along the left jaw; right cheek is bare green; no mustache. Reads as "orc with a beard", less full than the normal form)
 - thick black brows: PRESENT (heavy, clearly the same brow family; strongest continuity cue)
 - short dark hair: PRESENT but mostly hidden under the topknot mass (dark hair cap above the brow)
 - green skin: PRESENT
 - lower tusks: WEAK/MISSING as drawn (see defect 1)
 - short stature: lost by design (orc is the tallest sprite), accepted by the brief
 blind-ID as "same man as normal form": likely only with the label/context; yes as "orc"; distinct from other heroes: yes (only green hero, only bare-fist heavy build, no prop)

What works: strong silhouette (topknot braid + spiked pauldrons + wide fists + boots) readable at 112 px and at 151 px; brown bracers on both forearms, studded belt with square buckle and loincloth flap, boots: all attach logically; palette (green + steel teal + brown) is disciplined and pops on #1a1612; family-friendly, no weapon, tank stance.

Defects (most severe first):
 1. TUSKS ARE NOT READABLE. Brief item "lower tusks" fails: the tusks (left px (37,27),(37,28),(36..38,29),(36..38,30); right px (50,27),(50,28),(49,29),(50,29),(48..50,30)) are colored #71947a, the same cold grey-green as the iron pauldron highlights, so at 112 px they read as cheek lumps, not tusks. Fix is pure recolor (below). This is also the one orc cue that separates him from "a green man with a beard".
 2. Beard continuity only partial: normal form has a thick black beard wrapping the whole jaw plus mustache; orc has a chin tuft and a left jaw strip only. Not code-fixable cleanly: I tested painting a mustache (rows 28-29, x41-47 in #322733/#514e5c) and it vanishes into the 1px outlines/mouth line at x14 and is mud at game size, so DO NOT apply it. Accept as stylisation OR ask for it in a regeneration if the owner wants more beard.
 3. Skin texture noise: chest, shoulders and fists carry scattered 1px dark-teal/pale-green speckles (muscle "texture") that violate the style bible "no fine texture noise, chunky details at least 2x2". Visible as mottling at x8; at 112 px it reads as skin grain, so minor, but it is the main reason pixel integrity is 88 and not 92.
 4. Outline color navy (~#010626) is bluer than the roster (jack purple-black ~#19012b, rafinha ~#040318). Within the family, not a reject by itself.
 5. Topknot braid is a stiff arc (up from the bun, hooks left and ends in air with a gap under it). Attachment is logical (bound at the crown with a brown tie, pixel ~(31-34,9-10)), shape is a stylised ponytail; acceptable, noted only.
 6. Construction 4b answers: pauldrons = spiked plates sitting on the shoulder caps (left plate big, right plate smaller because of the 15 deg body turn; no visible strap across the chest, acceptable); belt = leather belt with buckle across the waist, loincloth flap hangs from its center; wrist bands = brown bracers on both forearms, from wrist to mid-forearm; topknot = tied at the crown; no floating parts found. PASS.
 7. Game scale (SUPPOSITION, code not checked): if the game scales every hero to the same height (112 px) and then multiplies the orc by 1.35, the orc is drawn at ~1.63 screen px per art pixel while normal Rafinha is ~1.42 and Jack ~1.29, i.e. a visibly coarser pixel size than the roster during the ult (the bible wants one pixel size on screen). Producer: scale the orc by the same px-per-art-pixel as the normal Rafinha x 1.35 only if you want exact grid parity; at least use image-rendering: pixelated. Not an art defect.

Fix: FIXABLE_IN_CODE. Apply this exact recolor to art_gen/approved/heroes/rafinha_orc.png (verified with Pillow: every listed pixel is currently #71947a, result viewed at x6 and at 112/151 px, tusks read clearly as ivory fangs, nothing else changes, color count 24 -> 26):
   ivory = (0xea,0xde,0xb0,255)  shade = (0xb8,0xa8,0x7c,255)
   set ivory on: (37,27),(37,28),(36,29),(37,29),(38,29),(36,30),(37,30),(38,30),(50,27),(50,28),(49,29),(50,29),(48,30),(49,30),(50,30)
   then set shade on: (38,30),(38,29),(36,30),(48,30),(49,30)
   (patched test image: scratchpad orc_patch.png). Palette note: bible cap is 24; 26 is over by 2, so first merge two near-duplicate outline navies (e.g. #010622/#010725/#010626/#010523 into one) to land back at <= 24.
 After the patch: re-run Pillow checks (colors <= 24, 1px outline intact), run the blind-ID agent, then resubmit as attempt 2; I expect likeness ~88 and brief ~92, and I will approve if blind-ID >= 85 and the owner accepts the partial beard. If the owner wants a full-jaw beard, REGENERATE prompt delta: "keep his full thick black beard wrapping the entire jaw from sideburn to sideburn plus a black mustache over the upper lip, drawn as a solid 3-tone dark block at least 3 px wide so it survives at 112 px; tusks are ivory/bone-colored (#eadeb0), NOT grey-green; reduce chest speckle: muscles as 3 flat tones in blocks >= 2x2 px".
