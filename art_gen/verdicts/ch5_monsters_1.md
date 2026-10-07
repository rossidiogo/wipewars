# Jacquin verdicts - chapter 5 monsters, attempt 1

Files viewed this session: out/clean/ch5_clone_gem1_0_x4.png, ch5_deluxe_gem1_0_x4.png, ch5_set_preview.png, approved/monsters (ch2_frozen_condom, ch2_permafrost_condom, ch3_sandpaper), blind report verdicts/blind_ch5_monsters.md.
Measured with Pillow (1x PNGs): logical grid period 10.25 px in source for both, 24 colors each, 1 connected component each.

Brief note: chapter 5 = cartoon, funny, NON-explicit silicone novelty-toy creatures. Blind testers' "condom / phallic novelty / bullet" at 30-40% counts as a correct read of the joke for this chapter. Standard for the rest: reads as a deliberate monster, every attachment physically explained (4b).

Size / pixel-scale check (bounding boxes at 1x, same convention as approved: 1 px = 1 logical px, feet on the bottom row, horizontally centred):
| sprite | w x h | colors |
| ch5_clone | 82 x 85 | 24 |
| ch5_deluxe | 93 x 91 | 24 |
| approved ch2_frozen_condom | 82 x 84 | 24 |
| approved ch2_permafrost_condom (elite) | 88 x 92 | 26 |
| approved ch3_sandpaper / belt_sander | 91x87 / 91x90 | 24 / 34 |
| approved ch4_pizza_slice / burnt_pizza | 88x89 / 96x97 | 23 / ? |
Both new sprites sit inside the approved range and the normal-small / elite-bigger step (clone 82x85 vs deluxe 93x91 is the same step as frozen 82x84 vs permafrost 88x92). Pixel scale: MATCH. Outline 1 px tinted dark, light top-left, cool rim on the right: MATCH on both.

---

## 1. ch5_clone_gem1_0 (flesh-toned glossy silicone creature)

```
JACQUIN VERDICT: REJECTED   (FIXABLE_IN_CODE)
Asset: ch5_clone_gem1_0   Type: monster (normal)   Attempt: 1
Scores: pixel 78 | silhouette 88 | color 87 | anatomy 82 | design 80 | symmetry 90 | ready 84 | brief 88 | likeness N/A   => overall 84 (concept/blind: counts as correct for ch5 at 40% condom, 25% bullet)
What works: reads as a deliberate, chunky, angry gym-bro capsule; glossy silicone is sold by the big top-left specular streak and the cool purple shadow side; same size, outline, lighting and 3-4 tone shading as the approved ch2 condom; family-friendly in rendering (smooth rounded dome, no glans/seam/vein/anatomy detail; the humour comes only from the silhouette).
Defects (most severe first):
 1. Stray ticks hanging under the base ring between the legs: vertical dark 1-px pixels at x=38 (y=75,76,77), x=43 (y=75,76,77) and x=42 (y=75). They hang from the ring with no purpose (the blind tester called them "drips / stray pixels"). Unexplained detail = 4b/pixel failure.
 2. Orphan "spark" pixels at the left and right of the ring edge: (17,74), (18,73) on the left and (63,72), (64,73) on the right (diagonal 1-px fragments outside the outline, only touching by corner). They are AI debris.
 3. Feet: legs are fully in purple shadow under the ring while the feet are pink, so the legs read as two dark stumps and the toe highlight is lost. Acceptable at 82 px, not an automatic reject on its own.
 4b construction log: dome body = silicone mould; base ring = rolled rim of the sleeve (explained, matches the chapter-2 condom); arms = rounded upper arm sphere at the shoulder where dome meets body, forearm and fist hanging to the hips (attached at the shoulder, overlapping outline, armpit gap is real background: OK); legs = two short stumps under the ring (OK); ticks under the ring = NOT explained (defect 1); sparks = NOT explained (defect 2). Arms are slightly balloon-like (two lobes) but do attach.
Fix (code, tools/ cleanup step 6 "delete orphans" did not catch them because they touch diagonally / sit inside the skirt silhouette):
 a. Set alpha=0 on the 1x PNG at (17,74), (18,73), (63,72), (64,73).
 b. Set alpha=0 on (38,75),(38,76),(38,77),(42,75),(43,75),(43,76),(43,77). Then the ring bottom edge between the legs must be a clean line: recolor the row y=75 between x=36..45 only if it now shows a gap in the outline (use the outline color already used on that ring edge).
 c. Optional (not a blocker): lighten the leg tone one step so the legs separate from the ring shadow.
 After the patch, re-run the blind test only if the owner wants; Jacquin expects APPROVED (pixel ~90, anatomy ~88) on a re-check of the patched 1x file.
```

---

## 2. ch5_deluxe_gem1_0 (deluxe green/teal silicone creature with gold band)

```
JACQUIN VERDICT: REJECTED   (REGENERATE)
Asset: ch5_deluxe_gem1_0   Type: monster (rare/elite)   Attempt: 1
Scores: pixel 78 | silhouette 84 | color 78 | anatomy 60 | design 74 | symmetry 76 | ready 82 | brief 70 | likeness N/A   => overall 75 (concept/blind: 30% condom/phallic, 25% bell/dome, 20% bullet-vibrator/golem = joke borderline, material fails)
What works: strong angry face with orange eyes (best accent in the set), clear raised-fist silhouette, gold band is a good rarity cue, size/outline/lighting match the roster.
Defects (most severe first):
 1. 4b ATTACHMENT FAILURE - viewer's-right arm: a separate glossy sphere sits at the shoulder (around x=64-78, y=26-40 at 1x), joined to the forearm lump by two thin dark struts with a see-through hole of background between them (x~71-73, y~46-52). There is no upper arm. The ball reads as a floating sphere (exactly what the blind tester said), and the forearm/fist looks glued to the brim. Physically unexplained.
 2. 4b - viewer's-left raised arm: fist, forearm and a small separate elbow lump are drawn with their own full outlines; the elbow lump does not clearly connect to the body side. It reads as three stacked blobs rather than one arm.
 3. MATERIAL CONTRADICTS BRIEF: cracked "stone" texture, gold speckle dots and flat matte dark teal make it read as a jade golem / bell, not a glossy silicone toy. Cracks and speckles also break the style rule (no fine texture noise, chunky 2x2 details only) and carry no meaning. Silicone should be a clean smooth surface with a long specular streak and, ideally, a hint of translucent lighter edge.
 4. The base is a wide flared UFO/saucer brim (about 93 px wide vs ~58 px body) instead of the rolled ring of the clone. The pair does not read as the same object: normal = capsule + rolled ring; deluxe = golem dome + saucer. Players will not see them as one set.
 5. Inside the right arm and brim there are many dark inner lines/cracks ~1 px dark inside the shapes (violates "separate parts with colour shifts, not extra outlines") and the dark-teal vs dark UI panel contrast is weak (11.5% of pixels flagged low-contrast vs 3.7% for the clone).
 6. Pose/arm construction differs from the clone (clone: both fists at hips, pill arms; deluxe: one raised fist, sphere shoulders). Acceptable for an elite pose, but the arm construction must be the same system.
4b construction log: body dome = silicone mould (ok); brim = does not match the clone's rolled rim (defect 4); gold band = a stripe printed round the brim, wraps behind the right arm (ok); shoulder sphere right = unexplained; left elbow lump = weak; cracks/speckles = unexplained; feet = two dark stumps under brim (ok).
Fix (regenerate; keep the clone as the template so the pair is one set): prompt delta below.
```

### Prompt for REGENERATE (self-contained, style lock unchanged)

STYLE LOCK: Hand-placed 16-bit pixel art for a dark-fantasy idle RPG. One uniform pixel grid: every pixel is a clean square block, all the same size, aligned to the grid, no anti-aliasing, no blur, no smooth gradients, no glow, no soft shadows, no sparkle effects, no film grain, no JPEG look. Outline: exactly 1 pixel thick, dark near-black tinted with the local color (never pure black), unbroken around the whole silhouette; inside the shapes separate parts with color shifts, not extra outlines. Shading: 3 tones per material (shadow, base, highlight) plus a single bright specular pixel cluster on metal and gems; shadows shift cooler toward blue-violet, highlights shift warmer toward yellow. Light comes from the top-left, shadow falls bottom-right, plus a thin cool rim light on the right edge so the shape separates from a near-black background. Palette: at most 24 colors per asset, muted dark-fantasy base colors with ONE saturated accent color; big shapes have clear value contrast (head and torso lighter than limbs). Bold simplified shapes, chunky details at least 2x2 pixels, no fine texture noise, no text or letters. Background: one perfectly flat solid #FF00FF magenta, no gradient, no vignette, no floor, no cast shadow, nothing else in the image. Full figure visible with at least 10% empty margin on all sides.

Monster: creature 2.5 to 3 heads tall, chunky, silhouette readable at 64 px, same lighting and outline rules.

SUBJECT: a cartoon "deluxe edition" silicone casting-kit creation, the elite version of a salmon-pink glossy silicone bullet-shaped monster: a smooth upright capsule with a rounded dome top (plain smooth surface, no seam, no veins, no anatomy detail), made of glossy emerald-teal silicone in 3 tones (dark teal shadow with a cool blue-violet cast, mid teal, light mint highlight), one long bright specular streak on the top-left of the dome. The face is drawn on the front of the capsule: angry squinting eyes with orange glow as the single saturated accent, heavy brows, small frown. At the bottom of the capsule is a thick rolled rim, a rounded torus ring that hugs the body (not a wide saucer, only slightly wider than the body, about 1.25x), and a thin gold stripe painted around the middle of that rim, wrapping round its front. Two short chunky legs with rounded feet come out from under the rim. Two thick muscular arms: each upper arm is one sausage shape that starts at the body side just below the dome shoulder (the shoulder is part of the body, NOT a separate ball), bends at an elbow and ends in a big rounded fist. Pose: both arms identical in construction to the pink version; viewer's-left arm bent upward with the fist raised beside the head, but the forearm must visibly connect to the upper arm and the upper arm to the body with one continuous outline, no gaps or holes between them; viewer's-right arm hangs down with the fist at the hip. No cracks, no speckles, no extra spheres, no floating parts, no tick marks or drips under the rim; the only gold is the one stripe. Front view, body turned 15 degrees to the right, feet on one baseline. Keep proportions and size identical to the pink bullet monster (about 82 x 85 pixels at 1x, deluxe about 8 to 10 percent larger).

Negative: stone, rock, jade, golem texture, metal bell, UFO brim, floating sphere shoulder, background showing through arm, dripping lines.

---

## Pair review (normal + rare/elite of one chapter set)

- Concept: YES in principle (the same bullet-capsule + rolled ring + scowl + big fists, elite = recolored, gold band, bigger, one raised fist). Right now the pair does NOT work as one set because the deluxe changed the base (saucer brim), the material (matte cracked stone) and the arm construction. After the clone code-patch and the deluxe regeneration above the pair mirrors the approved ch2 pair (frozen_condom -> permafrost_condom).
- Sizes / pixel scale: match the approved monsters (see table). Do not change canvas sizes.
- Family-friendly: clone is the borderline one (flesh tone + upright tube). It is rendered as a plain smooth capsule with a character face, no explicit features, which is within the owner's brief and consistent with the already approved ch2 condom monsters. Green elite is safer.
- Next gate: Jacquin must see the patched clone 1x PNG and the regenerated deluxe (with a new blind-ID report) before ch5 monsters are accepted.
