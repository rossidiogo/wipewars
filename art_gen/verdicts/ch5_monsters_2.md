# Jacquin verdict - chapter 5 deluxe (elite) monster, attempt 2

Files viewed this session: out/clean/ch5_deluxe_gem2_0_x4.png, out/clean/ch5_deluxe_gem2_0.png (1x), approved/monsters/ch5_clone.png, side-by-side x4 preview on #1a1612 (scratchpad), x10 crop of the rim/legs.
Measured with Pillow/numpy/scipy on the 1x PNG.

Measurements:
| sprite | w x h | colors (raw) | components | semi-alpha px | pixels with <=2 neighbours |
| ch5_deluxe_gem2_0 | 94 x 90 | 23 (many near-duplicates, e.g. 59/57/58,174,146 = ~13 effective) | 1 | 0 | none |
| ch5_clone (approved) | 82 x 85 | 24 | 1 | 0 | n/a |
Size step: +14.6% width / +5.9% height (rim about 54 vs 46 px, +17%). Slightly above the 8-10% target, but inside the approved roster range (permafrost 88x92, belt_sander 91x90, burnt_pizza 96x97). Not a blocker on its own.
Gold check: 0 gold-hued pixels in the whole sprite (HSV hue 30-55, high saturation: none). The stripe on the rim is olive-green (96,181,138) / (67,138,126), y 59-66, x 27-70, hue 150 = same hue as the body.
Eye accent check: the eyes are the same (96,181,138) / (67,138,126) green-grey, y 29-34, x 32-59. No orange glow, so the sprite has NO saturated accent colour (STYLE LOCK asks for one).
Contrast vs #1a1612: 16.4% of the sprite's pixels have contrast ratio < 1.5 against the panel (clone: 12.6%). These are the near-black navy outline pixels (0,9,37), invisible against the panel, but the body fill (teal 59,174,146 and mid 39,96,124) separates cleanly, so the silhouette reads. Acceptable.

```
JACQUIN VERDICT: REJECTED   (FIXABLE_IN_CODE)
Asset: ch5_deluxe_gem2_0   Type: monster (rare/elite)   Attempt: 2
Scores: pixel 88 | silhouette 91 | color 82 | anatomy 91 | design 83 | symmetry 86 | ready 91 | brief 72 | likeness N/A   => overall 85
What works: all attempt-1 structural failures are fixed. Both arms are one continuous outline each: the raised arm is fist -> forearm -> bicep -> shoulder merged into the dome side, the lowered arm is shoulder -> long forearm -> fist at the hip, no holes, no floating sphere. Silhouette family now matches the clone (capsule dome + thick rolled rim + two short legs + scowl). Material reads as glossy silicone (long mint specular streak top-left, cool blue shadow on the right, no cracks, no speckle). One connected component, no stray or orphan pixels, no semi-transparent pixels, 1 px dark outline, light top-left like the roster. Family-friendly: plain smooth capsule with a face, no anatomy detail, green is the safer colour.
Defects (most severe first):
 1. GOLD STRIPE MISSING (brief, rarity cue). The band round the rim is olive-green, same hue as the body (hue 150), 0 gold pixels. The elite loses its only "deluxe" marker and the pair no longer reads as normal + gold-banded elite.
 2. NO SATURATED ACCENT. The brief asked for orange glowing eyes as the single saturated accent; the eyes are pale green-grey on teal, so the sprite is monochrome and the face (the readability anchor of the clone) is weaker than the clone's orange eyes.
 3. Palette hygiene: raw count 23 but ~10 colours are +-1 RGB duplicates (59/57/58,174,146; 176/173/169,24x,2xx). Cosmetic, but quantise it.
 4. Roster symmetry (minor): arms are far heavier than the clone's pill arms (lowered forearm about 24 px long, bicep sphere about 18 px) and the pose is asymmetric (one raised fist). Acceptable for an elite, the construction system is the same (sausage arm attached at the shoulder), so not a blocker.
 5. Size step slightly high (+15% w), see measurements. Not a blocker.
4b construction log: dome = silicone mould (OK). Rim = rolled torus hugging the body, same system as the clone (OK). Stripe = a band printed round the rim, wraps behind the lowered arm (OK in principle, wrong colour). Raised arm: bicep is the shoulder, merges into the dome, forearm and fist continue with one outline (OK). Lowered arm: shoulder merged into dome side, forearm hangs outside the rim, fist at hip (OK). Legs = two short stumps with rounded feet under the rim (OK). Highlights on rim and fist = explained specular marks.
Fix (code only, no regeneration; apply to the 1x PNG, then re-export the x4 and re-check):
 a. Gold stripe: for pixels y in 59..66 (rim band) with colour (96,181,138) -> (240,196,72) gold light, and with colour (67,138,126) -> (176,124,40) gold dark. That is 63 + 20 pixels, x 27..70. Optionally add one 1x2 specular (255,236,150) at the leftmost lit pixels of the stripe (x~27-32).
 b. Orange eyes: for pixels y in 29..34, x in 32..59 with colour (96,181,138) -> (255,150,48) and with colour (67,138,126) -> (200,84,24). That is 34 + 28 pixels. Do NOT touch the same two colours at y < 29 (dome highlight pixels at (46,6),(41,7),(45,9),(43,10),(34,14),(39,14),(38,16),(37,18),(54,3),(69,17),(70,20)) or at y 40-42 / 71 / 81.
 c. Quantise near-duplicate colours: map any colour within +-3 per channel of the three dominant fills (59,174,146), (39,96,124), (176,243,211) to the dominant one.
 d. Optional, not required: leave size as is.
 Jacquin expects APPROVED on a re-check of the patched 1x (pixel ~90, color ~90, brief ~92, overall ~91; hero/elite pieces in the ch5 set only need 92). If after (a)+(b) the gold band still reads thin at 1x (it is only 2-3 px tall), thicken it by recolouring the rim row directly below it (y=67) on x 30..66 to the dark gold.
```

## Pair review (clone + deluxe)
Same family now: capsule + rolled rim + short legs + scowl + big fists, teal elite vs salmon normal, elite bigger with a raised fist. Only the two colour accents (gold band, orange eyes) are missing, which makes the elite look like a plain recolour. After the patch above, the pair mirrors the approved ch2 pair (frozen_condom -> permafrost_condom). Blind-ID for the deluxe was not repeated this attempt (shape unchanged from the clone family, already accepted as correct for the ch5 joke); re-run only if the owner wants.
