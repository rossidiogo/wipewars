# JACQUIN - BOSS BIG HEAD, 5 stages, attempt 2

Assets judged: `art_gen/out/clean/boss_bh1_gem2_0`, `boss_bh2_gem2_0`, `boss_bh3_gem2_0`, `boss_bh4_gem3_0`, `boss_bh5_gem2_0` (+ `_x4`, `boss_set2_preview.png`). Type: boss, friend-based key piece, bar = average 94.
Compared against: `approved/heroes/jack.png, daniel.png, ze.png`, `approved/monsters/ch5_clone.png`, STYLE_BIBLE, LORE (boss lines), my report `BOSS_BIGHEAD_1.md`, blind report `blind_boss_bh45.md`, refs 01, 20, 25.
Measured with Python 3.13 + Pillow/numpy/scipy (sizes, palettes, outline colours, components, contrast vs UI #1a1612, head/brain extents). I viewed every _x4 and 12x crops of heads, ears, bodies, the 2x strip on #1a1612 next to Jack/Daniel/Ze/clone.

## Summary table

| stage | verdict | one-line fix |
|---|---|---|
| bh1 ch1 | REJECTED - FIXABLE_IN_CODE (close) | apply patch script (grey-green irises, ear stud, brow barbell, palette merge) + rising `m` in battle.js; then still needs a design accent (see below) |
| bh2 ch2 | REJECTED - FIXABLE_IN_CODE (close) | same patch (icy iris, ear stud, palette merge) + rising `m` |
| bh3 ch3 | REJECTED - FIXABLE_IN_CODE (close) | patch: delete 9 px floating chip at (46..48,6..9), nose orange -> skin, 4 orange specks, irises, studs |
| bh4 ch4 | REJECTED - REGENERATE | brain reads only 65% (rim looks like a crown/bowl, maroon fissure runs across the bone rim like a drip); redraw the skull edge as flush forehead bone, not a wider zigzag crown |
| bh5 ch5 | REJECTED - REGENERATE | brain is NOT giant (579 px vs 608 px in stage 4, i.e. smaller), bone rim has 4 horn points, pink clasps/buckle, trousers/cape vanish on the UI |
| SET | growth NOT readable | head height share 52/53/54/61/61%; in game `m` still shrinks the boss (.9 to .6): head on screen 46 px to 32 px |

Nothing reaches 94. Stages 1-3 are close on pixel quality and can reach about 90-91 with the code patch plus the `m` fix; the last 3 points need design work listed in "What would make it APPROVED".

## A. What the producer fixed since round 1 (verified)

- Navy outline: all five now use a navy-tinted outline (`#020625` / `#000425` / `#010528` / `#030828` / `#090d2c`); bh4 no longer pure black. Good.
- 1 px outline, no partial alpha, no mixed pixel sizes (each x4 is exact 4x). 24 colours each, but see palette note (many are near-duplicates).
- bh4: horn-like skull flaps are gone, hair wisps/orphans gone, hoodie and trousers lightened (hoodie `#4e4d5b`, trousers `#7f7b82`, lower-body mean contrast 2.9:1 vs UI), fringe replaced by charcoal temples. bh4 is the stage that improved most.
- bh5: eyes redrawn heavy-lidded with bags and mustache, face is much closer to bh1-4 than in round 1. Cape now clasped at the neck. Good.
- Irises: present on all five (a 1 px ring around the pupil), but the hue is grey-mauve (`#867d8c`/`#695664`, bh2 `#838dab`, bh3 `#706a78`), not the grey-green of refs 01/20. Weak signature.

## B. What was claimed but I could not find (measured)

1. Ear hoop: NOT present in any stage. There is no steel-coloured pixel in the palette of bh1, bh3, bh4, bh5; bh2 has only icy blues. I viewed 16x crops of every ear (viewer's right on bh1, bh2, bh3, bh5; both on bh4): plain ear, no ring. (bh1 has one stray light pixel at (46,38).)
2. Brow piercing: bh1 and bh3 only have dark outline-coloured scribbles at the brow end, no silver. bh1's `#020524` pixel at (37,22) is an isolated dark pixel in the forehead skin (reads as a stray dot). bh4's piercing mark (a plus at about x19-22, y35-38) sits on the VIEWER'S LEFT brow, mirrored compared with bh1 and with refs 01/20 (viewer's right end of the brow). bh2 has one icy pixel (41,24). bh5: none.
3. "Head growth graduated 45/55/63/68/biggest": measured, hair-top to chin, as share of total sprite height:

| stage | head height / sprite | hair-to-hair max width | face+ears width | brain px | sprite px |
|---|---|---|---|---|---|
| bh1 | 49/94 = 52% | 51 | 43 | - | 54x94 |
| bh2 | 51/95 = 54% (scarf shadow included; face to row 47) | 58 | 47 | - | 60x95 |
| bh3 | 51/95 = 54% | 58 | 50 | - | 59x95 |
| bh4 | 58/95 = 61% (brain+face) | 54 | 45 | 608 (40x25) | 54x95 |
| bh5 | 57/95 = 60% (brain+face) | 54 (bone ring) | 43 | 579 (41x24) | 94x95 |

   - Stages 1-3 have the SAME head height (49/51/51). Only the hair volume widens a little (51 to 58). On the 2x strip the three heads look like one head with different clothes.
   - bh4 head grows by the brain only (+7 points).
   - bh5 head is not bigger than bh4: same share (60-61%), same width (54), and its brain has FEWER pixels than stage 4 (579 vs 608). The face (43 wide) is as small as stage 1's. So "giant brain / biggest head" is not delivered; the body and cape carry the finale. The finale head, at 1x, is smaller than stage 2's and 3's.
4. In-game multiplier (read from `js/battle.js` lines 8, 15-18, unchanged): `m` = .9 / .8 / .72 / .62 / .6 for the boss. Head width on screen = 51x.9=46, 58x.8=46, 58x.72=42, 54x.62=33, 54x.6=32. The head SHRINKS 30% over the chapters, the opposite of the lore ("cada capitulo a cabeca e maior"). This alone fails brief fidelity for the set. (I did not run the game; this is arithmetic from the source numbers.)

## C. Fix for the set growth (FIXABLE_IN_CODE, my suggestion, untested in game)

Set boss `m` to rising values: `m:[.9, 1.0, 1.1, 1.2, 1.35]` (stage 1 `KINDS.boss.m=.9` and chapters 2-5 in `CHAPMON`). On-screen head width becomes 46 / 58 / 64 / 65 / 73 and head height (incl. brain) 44 / 51 / 56 / 70 / 77 px: monotonic, readable. Stage 5 sprite = 95x1.35 = 128 px tall, inside the bible limit for bosses (96-140). Re-check lane overlap (LANE_Y) on the 360 px field. Note the cutscene uses `bh1` at m 1.6 (cuts.js), so stage 1 needs no art change for that.
This fixes growth for stages 1-4. It does not make the stage 5 brain giant (579 px x 1.35^2 vs 608 px x 1.2^2 is only +21%): that needs the regeneration below.

## D. Patch script for stages 1, 2, 3 (verified)

Run from `art_gen/` with the Python 3.13 that has Pillow/numpy. It reads `out/clean/<name>.png` and writes `<name>_p.png` into `out/clean/` (set env `PATCH_OUT=some_dir/` to write elsewhere). I ran it into the scratchpad and re-checked: 1 connected component each, 0 partial alpha, colours 17 / 22 / 21 (<= 24, because near-duplicate colours are merged), and I viewed the heads at 6x on #1a1612: irises now read grey-green, the ear studs and brow barbells are visible, the bh3 nose is skin again.

```python
# JACQUIN patch script (BOSS_BIGHEAD_2). Run from art_gen/.
from PIL import Image
import numpy as np
from collections import Counter
import os
OUT=os.environ.get('PATCH_OUT','out/clean/')

def hexrgb(h): h=h.lstrip('#'); return tuple(int(h[i:i+2],16) for i in (0,2,4))
def load(n): return np.array(Image.open(f'out/clean/{n}.png').convert('RGBA'))
def merge(a, groups):
    for tgt,lst in groups.items():
        for h in lst:
            m=(a[...,0]==hexrgb(h)[0])&(a[...,1]==hexrgb(h)[1])&(a[...,2]==hexrgb(h)[2])&(a[...,3]>0)
            a[m,:3]=hexrgb(tgt)
def paint(a, pts, hexc):
    for x,y in pts:
        assert a[y,x,3]==255,(x,y)
        a[y,x,:3]=hexrgb(hexc)
def clear(a, pts):
    for x,y in pts: a[y,x,:]=0
def fill_from_neighbours(a, pts):
    for x,y in pts:
        c=Counter()
        for dx in (-1,0,1):
            for dy in (-1,0,1):
                if (dx or dy) and a[y+dy,x+dx,3]==255:
                    p=tuple(int(v) for v in a[y+dy,x+dx,:3])
                    if sum(p)>120 and not (p[0]>225 and 100<p[1]<150 and p[2]<80): c[p]+=1
        a[y,x,:3]=c.most_common(1)[0][0]
def save(a,n): Image.fromarray(a).save(OUT+f'{n}_p.png')

# ---------------- bh1 ----------------
a=load('boss_bh1_gem2_0')
merge(a,{'#315087':['#315188','#305086','#304e85','#315086','#325087','#315089'],'#020625':['#020622','#030324','#010522','#020524','#120e22']})
paint(a,[(13,31),(16,31),(14,32),(15,32),(33,31),(30,31),(31,32),(32,32)],'#93a895')   # light iris, both eyes
paint(a,[(13,30),(16,30),(16,29),(33,29),(33,30)],'#6e8272')                           # dark iris, both eyes
paint(a,[(47,37),(48,37)],'#c8ccd8'); paint(a,[(48,36)],'#f4f6fb')                     # ear stud, viewer's right ear
paint(a,[(37,22),(39,22)],'#c8ccd8'); paint(a,[(38,22)],'#f4f6fb')                     # brow barbell above right brow end
save(a,'boss_bh1_gem2_0')

# ---------------- bh2 ----------------
a=load('boss_bh2_gem2_0')
merge(a,{'#2a5389':['#2b5489','#2a5287','#295387'],'#000425':['#000324','#010225','#090926']})
paint(a,[(14,30),(14,31),(18,30),(18,31),(15,32),(16,32),(17,32),(32,30),(32,31),(36,30),(36,31),(33,32),(34,32),(35,32)],'#8db5a6')
paint(a,[(17,31),(35,31)],'#6f968a')
paint(a,[(50,37),(51,37)],'#5d6f96'); paint(a,[(51,36)],'#ffffff')                     # ear stud (darker steel on pale ice skin)
save(a,'boss_bh2_gem2_0')

# ---------------- bh3 ----------------
a=load('boss_bh3_gem2_0')
merge(a,{'#010528':['#010524','#010627','#010426','#080326','#060526'],'#f4ceb7':['#f5cdb7'],'#f2751f':['#f27620','#f2751f']})
clear(a,[(x,y) for x in (46,47,48) for y in (6,7,8,9)])                                 # floating 9 px chip (2nd component)
paint(a,[(22,33),(22,34),(23,34),(21,35),(22,35),(23,35),(24,35),(20,36),(21,36),(22,36),(23,36),(24,36)],'#dba08c')  # nose orange -> skin shade
fill_from_neighbours(a,[(35,9),(36,11),(37,21),(48,24)])                                # orange specks not on the crack
paint(a,[(14,30),(14,31),(14,32),(17,30),(17,31),(17,32),(15,33),(16,33),(17,33),(31,30),(31,31),(31,32),(34,30),(34,31),(34,32),(32,33),(33,33),(34,33)],'#8d9a82')
paint(a,[(53,38),(54,38)],'#c8ccd8'); paint(a,[(54,37)],'#f4f6fb')                     # ear stud
paint(a,[(42,23)],'#c8ccd8'); paint(a,[(43,23)],'#f4f6fb')                              # brow piercing
save(a,'boss_bh3_gem2_0')
```

Notes on the patch: an ear hoop that is a real ring does not fit in the 6x10 px ear without redrawing it, so the patch uses a 2-3 px steel stud/glint, which is what survives at game size. If the owner wants a true hoop, regenerate with a bigger ear.

## E. Per-stage verdicts

```
JACQUIN VERDICT: REJECTED   (FIXABLE_IN_CODE)
Asset: boss_bh1_gem2_0   Type: boss (Big Head ch1, blue hoodie)   Attempt: 2
Scores: pixel 91 | silhouette 90 | color 87 | anatomy 90 | design 85 | symmetry 86 | ready 92 | brief 82 | likeness 87   => overall 88 (needs 94)
Likeness check: fringe present, heavy lids+bags present, round pale face present, mustache+stubble present, iris present but grey-mauve (should be grey-green), ear hoop MISSING, brow piercing missing (dark scribble, not silver); blind-ID: person yes by my own test, blind file for bh1 not on file; distinct from other heroes: yes
What works: cleanest construction of the set: hoodie, hood bundle, pocket, cuffs, hands, shoes attach logically; navy outline unbroken (0 non-dark edge px); calm half-lidded face is the best match to ref 01.
Defects:
 1. Iris hue grey-mauve, ear hoop and piercing absent, so 2 of the 6 signature features are not readable.
 2. Head is 52% of the sprite height from stage 1, so there is no head growth room (set problem, section B).
 3. Palette is 24 entries but only about 17 distinct colours: seven near-identical blues (`#315087 #315188 #305086 #304e85 #315086 #325087 #315089`) and five navy variants.
 4. Design/colour: all blue-grey, no saturated accent and no rim light on the right edge (bible says one accent + cool rim); flat compared with bh3.
 5. Isolated dark pixel (37,22) in the forehead reads as a stray dot.
Fix: run patch script section D (bh1 block: palette merge, irises, ear stud, brow barbell; removes defect 5) + rising `m` (section C). Remaining gap after that, about 90 average: design 85, color 87.
What would make it APPROVED: (a) patch + `m` fix; (b) one small saturated accent (e.g. a thin warm-orange drawstring tip pair or cuff stripe on the hoodie, 4-6 px total, keep within 24 colours) and a 1 px cool rim on the right edge of the hoodie and hair; (c) a blind-ID file for bh1; (d) owner note in STYLE_BIBLE that the 52% head is a deliberate roster exception. With these I would expect 92-94.
```

```
JACQUIN VERDICT: REJECTED   (FIXABLE_IN_CODE)
Asset: boss_bh2_gem2_0   Type: boss (Big Head ch2, icy scarf)   Attempt: 2
Scores: pixel 90 | silhouette 90 | color 89 | anatomy 90 | design 89 | symmetry 86 | ready 92 | brief 82 | likeness 85   => overall 88 (needs 94)
Likeness check: fringe present (frost shards), lids+bags present, round face present, mustache+stubble present (pale blob), iris weak (blue-grey), ear hoop MISSING, piercing 1 icy pixel at (41,24); blind-ID: person yes (file missing); distinct: yes
What works: scarf is now clean: 3-tone wrap under the chin, one tail leaving the front-right of the wrap down to the hip; hood bundle behind the neck; frost shards on the fringe carry the chapter story; mean lower-body contrast 4.2:1.
Defects:
 1. Head height is the same as stage 1 (51 vs 49 px of 94-95); only hair is wider (58 vs 51). Growth not readable without the `m` change.
 2. Iris blue-grey `#838dab`, ear hoop absent, piercing 1 icy px.
 3. Seven frost/ice highlight pixels (`#c9e6f9`) sit on the silhouette edge without an outline, and the palette has near-duplicate blues and outline variants (`#000425 #000324 #010225`).
 4. Skin is a flat pale blue; the lightest tone is fine, but the face lost all warmth so likeness drops slightly (acceptable for the ice chapter).
Fix: patch script section D (bh2 block) + rising `m`. Optional: give the 7 edge frost pixels a navy outline or move them 1 px inside.
What would make it APPROVED: patch + `m` + blind-ID file + a clearly visible silver piercing (2 px) on the brow end (current icy pixel is invisible on ice skin; use `#5d6f96` with a white pixel, same as the ear stud) + frost edge pixels outlined. Expected about 91-93 after that; to pass 94 the skin needs one warm tone (e.g. a pink-blue cheek `#d8b4c8`) so he still reads as the same man as stage 1.
```

```
JACQUIN VERDICT: REJECTED   (FIXABLE_IN_CODE)
Asset: boss_bh3_gem2_0   Type: boss (Big Head ch3, cracked head + orange apron)   Attempt: 2
Scores: pixel 88 | silhouette 90 | color 88 | anatomy 86 | design 91 | symmetry 86 | ready 88 | brief 82 | likeness 86   => overall 87 (needs 94)
Likeness check: left fringe present, right half shaved dome (as briefed), lids+bags present (angry), mustache+stubble present, iris weak (grey `#706a78`), ear hoop MISSING, piercing missing; blind-ID: person yes (file missing); distinct: yes
What works: best costume story and the one saturated accent (orange) of the set. Apron has a bib, waist band, pocket with tools, brown work gloves; crack has orange glow only along dark lines; no blood or gore.
Defects (most severe first):
 1. Component 2: a 9 px floating chip at x46-48, y6-9 above the dome (skin pixel with a navy outline, detached by 1 px). Unexplained floating object (4b), and it makes the sprite 2 components (game-readiness).
 2. Nose is 11 px of saturated orange `#ef8742` at (22,33),(22,34),(23,34),(21..24,35),(20..24,36): still reads as a clown/bleeding nose (round 1 defect, not fixed).
 3. Four orange specks with only one dark neighbour, not on the crack: (35,9), (36,11), (37,21), (48,24).
 4. The tool in the pocket (x31-37,y64-77) is a cluster of pink and grey pixels with an X pattern at about (32..35,65..69): reads as a scribble, not as pliers.
 5. Ear hoop and brow piercing missing; irises grey.
 6. Edge: 30 px of the hair silhouette use `#301c2b` (brown) instead of the navy outline (minor).
Fix: patch script section D (bh3 block) fixes 1, 2, 3, 5. For 4: redraw the pocket tool as a single 2 px-wide grey wrench handle `#706a78` with one `#c8ccd8` highlight sticking out of the pocket at (31..33,64..69) and delete the pink pixels there.
What would make it APPROVED: patch + the redrawn tool + `m` fix + blind-ID file. Expected about 91-92; to reach 94 it also needs the apron's two orange bands to share a clear fold/shadow (right now the lower band looks like a separate block) - add a 1 px darker orange `#aa4e2f` line along the bottom of the upper band at y 67, x 13-35.
```

```
JACQUIN VERDICT: REJECTED   (REGENERATE)
Asset: boss_bh4_gem3_0   Type: boss (Big Head ch4, open skull with brain, charcoal hoodie)   Attempt: 2
Scores: pixel 88 | silhouette 86 | color 86 | anatomy 84 | design 86 | symmetry 84 | ready 90 | brief 76 | likeness 82 | concept 60 (blind 65%, capped)   => overall 82 (needs 94)
Likeness check: fringe replaced by charcoal temple hair (weak), heavy lids+bags present, smug grin matches refs 10/20 (strong), mustache+stubble present, iris weak, ear hoop MISSING, piercing present but on the WRONG side (viewer's left); blind-ID: person not tested, object: brain 65% (below 70 = capped); distinct: yes
What works: expression (best Diogo-likeness in the set), brain texture (pink, folds, no blood), navy outline now, readable lighter hoodie/trousers (mean 2.9:1), no horns, no orphans, one component.
Defects (most severe first):
 1. Concept (blind): the cream zig-zag band reads as a crown, bowl, cup rim or foam collar, and the brain looks like a hat resting on it. Cause measured: the bone band spans x2-52 while the brain spans x7-46 (about 5 px wider on each side, so it overhangs like a brim), it is 6-8 rows thick, and its teeth point UP into the brain at y22-25 (a crown silhouette). A real cut skull edge is flush with the forehead and its fracture teeth point down into the bone.
 2. The maroon fissure `#963d60` at x36-37 runs from y20 straight through the bone rim to y26 (21 px column). Where it crosses the cream rim it looks like a fluid drip running down the bone: not family-friendly and not logical.
 3. Skin-coloured notches at the hoodie shoulders (about (8..10,61..62) and (44..46,62..63)) read as holes/stains (blind report).
 4. Mark near the left eye (plus at x19-22, y35-38) is a mirrored brow piercing with no steel colour: reads as a scar/tattoo.
 5. Ear hoop missing; irises grey-mauve.
 6. Growth: head+brain share 61%, width 54: acceptable as stage 4 once the `m` fix is applied.
Fix (REGENERATE, prompt delta; keep this face/grin as the reference if the tool accepts an image):
 - "The top of the skull is sawn off like the top of a boiled egg: the cut bone edge is a thin ring (about 2 px) exactly as wide as the forehead and temples, flush with the head outline, never wider than the face. The fracture line is jagged with small teeth pointing DOWN into the bone, not up. No crown, no spikes, no collar."
 - "A pink brain dome rises out of the open skull, about as tall as half the face, with two hemispheres, a central fissure that stops inside the brain and never crosses the bone, curved fold lines, a darker pink shade where it meets the bone, no drips, no blood."
 - "Dark messy fringe still visible over the forehead on his left side under the bone edge; thin silver ring in the end of his right-hand (viewer's right) eyebrow; small silver hoop in the ear on the viewer's right (draw the ear larger so the ring is 3 px)."
 - "Charcoal hoodie without holes or stains; keep tones `#4e4d5b` and trousers `#7f7b82`; navy outline `#030828`."
 - Remove: bone zigzag teeth pointing up, any collar/brim wider than the head, shoulder holes.
What would make it APPROVED: a new generation where a blind test names "skull cut open with brain" at >= 70% (ideally >= 80%), with the bone ring flush and no drip; likeness items as above; then code cleanup.
```

```
JACQUIN VERDICT: REJECTED   (REGENERATE)
Asset: boss_bh5_gem2_0   Type: boss (final Big Head, giant brain, double biceps, violet cape)   Attempt: 2
Scores: pixel 88 | silhouette 90 | color 84 | anatomy 84 | design 86 | symmetry 84 | ready 88 | brief 70 | likeness 80 | concept 82 (blind 80%)   => overall 84 (needs 94)
Likeness check: heavy lids+bags present (fixed), mustache+stubble present, round face present, fringe hidden by the bone ring (dark temple hair only), iris weak, ear hoop and piercing MISSING; blind-ID: object brain 80% (passes 70), person only by context; distinct: yes
What works: best silhouette (cape triangle + double biceps reads at 1x), face now consistent with the other stages, brain is pink and cartoonish with no blood, pose follows ref 25, one connected component, 24 colours.
Defects (most severe first):
 1. Brief: the brain is not giant. Measured brain = 579 px (41x24) vs 608 px (40x25) in stage 4: it is smaller. The head (57 of 95 rows, 54 px wide) is the same as stage 4 and smaller than stage 2/3 in width; the face (43 px) is as small as stage 1. The owner's "giant brain" is not delivered.
 2. Construction/concept: the bone ring has four horn points (two top tips at about (35,0) and (58,0), two side upsweeps at x20-25,y15-23 and x70-75,y15-22). The blind reader called it a "horned crown"/demon helmet. A cut skull edge has no horns.
 3. Pink accents without logic: two pink round clasps at about (35,57..59) and (59,57..59) under the jaw, and a pink belt buckle at about (43..48,72..75), the same colour as the brain (round 1 asked for gold). They read as nipples/stray accents; the dark band under the chin reads as straps/suspenders (blind report).
 4. Contrast: 48% of the lower-body fill pixels are below 1.6:1 against #1a1612 (trousers `#422c5a`, cape `#301653`, boots): legs and cape bottom nearly vanish on the panel.
 5. Veins: purple/pink speckles on arms and abs (about 30 isolated pixels) still read as bruises; 9.5% of edge pixels (58 of 611) are not the navy outline.
 6. Ear hoop and piercing missing; irises grey.
Fix (REGENERATE, prompt delta, use bh1/bh4 face as reference):
 - "The brain is GIANT: it is the biggest part of the sprite after the body. Brain width about 1.4x the face width and overflowing past both temples, height at least 60% of the face height, pink with deep folds and clear highlights on the top-left lobes. It sits in the open skull whose cut bone edge is a thin 2 px ring flush with the temples: no horns, no points, no crown, no spikes."
 - "Face the same as the earlier stages: heavy-lidded grey-green eyes with bags, thin silver ring on the end of his right-hand eyebrow, small silver hoop in the viewer's-right ear (draw the ear 4 px wider), thin mustache, chin stubble, smug closed grin; face width at least 55% of the shoulder width."
 - "Cape clasp: one small round GOLD clasp at the front of the neck where the cape's top edge meets under the jaw; belt buckle GOLD; no pink except the brain."
 - "Lighter trousers `#6b5a88` and cape `#4d2a7a` with one `#7a4fb0` fold highlight; boots `#4a3f66`; navy outline `#090d2c` also on the arms; veins only as 1 px darker pink lines on the biceps, no speckles."
What would make it APPROVED: brain at least 1.5x the pixel count of stage 4 (about 900+ px) and wider than the face, no horn points, gold clasp/buckle, legs/cape >= 2:1 on the UI, blind test >= 80% brain and the person identified with the label hidden, plus the `m` fix.
```

## F. Set checks

- Identity consistency: stages 1-3 are clearly one man (same fringe mass, brows, round face). Stage 4 shares the face and grin; stage 5 now shares the face construction (heavy lids, mustache). Hair silhouette is the weak link: fringe is lost in 4 and 5 because of the bone ring; keep 2-3 px of dark fringe visible under the ring.
- Head growth: not readable in the art (section B); fixable for 1-4 with `m`, not for 5 (needs regeneration).
- Palette: each file reports 24 colours, but about 17 (bh1), 22 (bh2), 21 (bh3) are truly distinct because of near-duplicate quantisation leftovers; the patch merges them. A real fix for bh4/bh5 is to run the same near-duplicate merge in the cleanup tool after regeneration.
- Contrast vs UI #1a1612 (fill pixels, lower 40% of the sprite, share below 1.6:1): bh1 14%, bh2 22%, bh3 19%, bh4 25%, bh5 48% (fail). Upper half is fine in all (bh4/bh5 brain mean 8:1).
- Family-friendliness: no blood, no gore, no exposed flesh. Brains are cartoon pink. The bh4 fissure crossing the bone is the only drip-like element; remove it.
- Scale vs roster: canvases are 94-95 px tall vs heroes 86-89 px and clone 85 px, consistent with the bible's boss range. Head ratio (52-61%) is far from the bible's 33% hero head; accepted only as a deliberate boss exception, please record it in STYLE_BIBLE.
- Construction 4b summary: bh1 clean; bh2 clean; bh3 chip, tool scribble, speck noise; bh4 rim wider than brain and fissure over bone; bh5 horn points, pink clasps/buckle, vein speckles.
- Blind-ID files: only `blind_boss_bh45.md` exists (brain 65% / 80%). Missing for bh1, bh2, bh3 (concept recognizability cannot be certified for them; person recognition is my own test only).

## G. Not verified

- I did not run the game: the `m` suggestion and head-on-screen numbers are arithmetic from `js/battle.js` and the 1x sizes; lane overlap with `m` 1.35 is untested.
- I did not find where `bh1..bh5` are registered in `art.js`/`SP` in this pass (not re-checked since round 1).
- The patched PNGs exist only in my scratchpad; no project art files were modified.
