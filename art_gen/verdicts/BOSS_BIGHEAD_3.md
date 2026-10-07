# JACQUIN - BOSS BIG HEAD round 3 (bh5 redone, bh4, rafinha_orc)

Assets judged (1x PNGs in `art_gen/approved/`): `bosses/bh5.png` (84x94), `bosses/bh4.png` (54x95), `heroes/rafinha_orc.png` (75x93), compared with `bosses/bh1..bh3.png` (patched by my earlier script), `heroes/jack.png`, STYLE_BIBLE, my reports `BOSS_BIGHEAD_2.md` and `rafinha_orc_1.md`.
Likeness refs viewed: `refs/bighead/01_frente_neutra.jpg`, `25_flexao_biceps_frente.jpg` (private photos, judged only for likeness; signature features: dark messy fringe, heavy brows with a silver barbell at the end of the viewer's-right brow, grey-green eyes with bags, round face, thin mustache + short beard, small silver hoop in the viewer's-right ear, big arms).
Measured with Python 3.13 + Pillow/numpy/scipy (palette, outline colour, connected components, contrast vs UI #1a1612, brain/head extents). I made x3/x4/x8/x12/x16 views and a 112 px view on #1a1612 and looked at them. Patched test images and scripts are in my scratchpad only; no project file was touched.

## Summary table

| asset | verdict | one-line fix |
|---|---|---|
| A. bh5 (giant brain, redone) | REJECTED - FIXABLE_IN_CODE (close, about 90 after patch) | run patch A: gold clasps/buckle were NOT gold (still pink), cape shade 1.3:1, arm bruise blotches, no piercings, mauve irises; then blind-ID file |
| B. bh4 (ch4, earlier version) | REJECTED - FIXABLE_IN_CODE (about 89 after patch) | run patch B: flat sawn bone ring 2 px, no maroon drip, orphans, one navy outline, brow barbell on the right side |
| C. rafinha_orc (tusk patch + outline merge) | REJECTED - FIXABLE_IN_CODE (about 91, blind-ID file still missing) | run patch C (merge 6 near-identical greens, de-speckle 44 px) and run the blind-ID agent; owner must accept the partial beard |
| SET growth bh1..bh5 | READABLE with m=[.9,1.0,1.1,1.2,1.35] | head height on screen 44/51/56/70/78 px (see section D) |

Nothing reaches the bar (key pieces 94). I count these three as attempt 3 (bh4, bh5) and attempt 2 (orc).

## A. bh5 - Big Head ch5 (giant brain)

```
JACQUIN VERDICT: REJECTED   (FIXABLE_IN_CODE)
Asset: bh5.png   Type: boss (final Big Head, giant brain, double biceps, cape)   Attempt: 3
Scores (file as is): pixel 87 | silhouette 93 | color 84 | anatomy 87 | design 88 | symmetry 86 | ready 88 | brief 86 | likeness 82   => overall 87
Scores (expected after patch A, viewed): pixel 91 | silhouette 93 | color 90 | anatomy 88 | design 90 | symmetry 88 | ready 92 | brief 91 | likeness 87   => about 90
Likeness check: heavy lids+bags present, round face present, mustache + goatee present, biceps pose (ref 25) present, fringe only 3-4 dark px at the ring ends (weak), iris grey-mauve (weak), brow barbell MISSING, ear hoop MISSING; blind-ID as the man: only with context; brain: own reading "giant brain", blind file NOT produced; distinct from other heroes: yes
What works: the brain is now genuinely giant (about 1200 px vs 608 px of the old bh4, width 56 px = 1.5x the 36 px face, 30 rows tall vs 23-row face), no horns, no points, flat ring, one component (8-connected), no blood. Silhouette (brain + double biceps + cape) reads at 1x and at 112 px.
Defects (most severe first):
 1. Brief: "gold clasps/buckle" is not in the file. Palette has no gold pixel. The two clasps at (30..32,56..57) and (51..53,56..57) and the buckle at (40..43,72..73) are still #e68f9c (pink, same as the brain), exactly the round-1 defect. They read as pink studs/nipples.
 2. Contrast: cape shade #391f64 (376 px, 1.33:1 vs #1a1612) and #36234f (77 px, 1.29:1). 27% of the fill pixels in the lower 40% are below 1.6:1 (was 48% in round 2: improved, trousers #704c65/#5b3152 and cape mid #6f438c now fine at 2.5/1.7/2.4:1, but the dark cape shade still sinks).
 3. Arms: about 60 px of purple/brown blotches (#704c65, #6f438c, #7e386b, #aa6684 inside skin) on both biceps and forearms; they read as bruises, not veins.
 4. Likeness: no silver brow barbell, no ear hoop; irises #a87885 mauve (refs are grey-green).
 5. Skull ring: only the centre bead reads as a skull at x12; the other six beads read as daisies/cream buttons with two dots. It is a flat ring with no horns (round-2 defect 2 is fixed), but the "skull fragments" idea is carried by one bead. Not code-fixable cleanly; it is the reason concept/design stay below 94 after the patch. Blind test decides.
 6. Palette: 24 entries but only about 18 distinct colours (4 navy variants, 4 skin variants, 3 pink variants); patch merges them (21 with the new gold/steel).
Construction 4b: brain = open dome wider than the ring (x14-69 vs ring about x22-61), tucks onto the ring at rows 30-33: logical as "brain overflowing the open skull" (my own round-2 delta asked for it); ring = flat band at the temples, flush under the brain; cape = triangle from the shoulders, pinned by two clasps at the collar ends (they exist, just not gold); belt buckle on belt; arms attach at shoulders; no floating parts found. PASS except colour of clasps.
Fix: apply patch A (below). Verified: result has 21 colours, 1 component, 0 partial alpha, edge outline all `#060a2c` (420 px), lower-40% share below 1.6:1 = 0.0 (below 2:1 = 33%, those are outline-adjacent browns/purples), clasps and buckle read as gold at x4 and x8, brow barbell and ear stud visible at x12, irises read grey-green.
What would make it APPROVED: patch A + a blind-ID report (brain >= 80%, ring read as skulls/bone >= 70%) + owner OK. If the blind reader calls the ring "flowers/daisies", redraw only the six side beads as 5x4 skulls (cream `#efd4c6`, 2 px dark eye sockets, 1 px dark nose) like the centre bead at about (42..46,31..34).
```

### Patch A (run from `art_gen/`, writes `bh5_p.png`; set env `PATCH_OUT=dir/` to choose the folder)

```python
# JACQUIN patch for bh5 (BOSS_BIGHEAD_3).
from PIL import Image
import numpy as np, os
OUT=os.environ.get('PATCH_OUT','')
def hx(h): h=h.lstrip('#'); return np.array([int(h[i:i+2],16) for i in (0,2,4)],dtype=np.uint8)
a=np.array(Image.open('approved/bosses/bh5.png').convert('RGBA'))
def put(x,y,c): assert a[y,x,3]==255,(x,y); a[y,x,:3]=hx(c)
def merge(t,l):
    for h in l:
        m=(a[...,3]>0)&(a[...,:3]==hx(h)).all(-1); a[m,:3]=hx(t)
# palette hygiene
merge('#060a2c',['#04092a','#020b2b','#020829'])
merge('#f4c1ae',['#f4bfac','#f4c2af','#f1bfac'])
merge('#e689a4',['#e688a3','#e589a3'])
# cape/boot shadow too dark on the UI panel (1.3:1): lift to about 2:1
merge('#5a3490',['#391f64'])      # cape shade
merge('#4a3f66',['#36234f'])      # boot / deep fold
# bruise blotches inside skin -> skin shade: a purple pixel with >=2 skin 4-neighbours, rows < 62, repeated 3x
SK={'#f4c1ae','#b4717f','#efd4c6','#a87885','#c0a2a4'}
PU={'#6f438c','#5a3490','#4a3f66','#704c65','#7e386b','#aa6684','#5b3152'}
def hexa(x,y): return '#%02x%02x%02x'%tuple(a[y,x,:3])
for _ in range(3):
    for y in range(30,62):
        for x in range(1,a.shape[1]-1):
            if a[y,x,3]==255 and hexa(x,y) in PU and not (36<=y<=58 and 22<=x<=62):
                n=sum(1 for dx,dy in((1,0),(-1,0),(0,1),(0,-1)) if hexa(x+dx,y+dy) in SK)
                if n>=2: a[y,x,:3]=hx('#b4717f')
# GOLD clasps (cape pins at both ends of the collar) and belt buckle (were pink #e68f9c)
G,Hi,S='#d9a441','#f6dc82','#a8742a'
for x0 in (30,51):
    for dx,c in zip(range(3),(G,Hi,G)): put(x0+dx,56,c)
    for dx,c in zip(range(3),(S,G,S)): put(x0+dx,57,c)
for dx,c in zip(range(4),(G,Hi,Hi,G)): put(40+dx,72,c)
for dx,c in zip(range(4),(S,G,G,S)): put(40+dx,73,c)
# signature piercings (viewer's right): brow barbell just outside the brow end, ear stud on the lobe
put(56,36,'#f4f6fb'); put(56,37,'#c8ccd8'); put(56,38,'#f4f6fb')
put(60,45,'#c8ccd8'); put(60,46,'#f4f6fb')
# irises: grey-mauve -> grey-green (ref 01)
for x,y in [(33,41),(33,42),(34,42),(35,41),(35,42),(48,41),(48,42),(49,42),(50,41),(50,42)]: put(x,y,'#8fa690')
Image.fromarray(a).save(OUT+'bh5_p.png')
```

## B. bh4 - Big Head ch4 (earlier version)

```
JACQUIN VERDICT: REJECTED   (FIXABLE_IN_CODE)
Asset: bh4.png   Type: boss (Big Head ch4, open skull with brain, charcoal hoodie)   Attempt: 3 (same art as round 2, no new generation)
Scores (file as is): pixel 87 | silhouette 88 | color 87 | anatomy 86 | design 87 | symmetry 85 | ready 90 | brief 82 | likeness 82   => overall 86 (concept: own reading "brain in sawn skull" 78, no blind file for this version)
Scores (expected after patch B, viewed): pixel 91 | silhouette 90 | color 89 | anatomy 88 | design 89 | symmetry 88 | ready 92 | brief 86 | likeness 84   => about 89
Likeness check: charcoal temple hair present (fringe weak), heavy lids+bags present, smug grin present (best match in the set to refs 10/20), mustache + stubble present, iris grey (weak), brow piercing present but navy diamond on the WRONG side, no steel; ear hoop MISSING on the viewer's right; blind-ID: not tested; distinct: yes
What works: expression, hoodie/trousers readable (2.9:1), one component, no horns, brain is cartoon pink, no blood.
Defects (most severe first, all measured on the 1x file):
 1. Crown read: the cream band spans x2-52 and its teeth point UP into the brain at rows 22-26 (navy wedges between white peaks), a right-hand cream spike at x49-52, rows 20-26 sticks out beyond the brain outline (x47-48) like a horn. Brain is x7-46, bone is up to 6 px wider on the right.
 2. Maroon fissure `#963d60` at x35-38 runs from row 2 down through rows 23-26 across the bone (drip look).
 3. Four navy variants as outline/dark colours (`#030828` 134 edge px, `#020727` 80, `#030527` 61, `#010827` 8) plus `#0c102c`; edge not one colour.
 4. Orphans: (30,7) skin pixel inside the brain; (23,28) grey pixel and (38,27) pink-grey pixel inside the bone band; (44,21) navy pixel inside the brain edge; (44,29) `#0c102c` in the band bottom; grey sliver `#7f7b82` at (4..5,23..26) at the left end of the bone; skin-coloured holes in the shoulders at (8,62),(8,63),(9,63),(9,64),(10,64) and (45,64),(45,65).
 5. Brow marker: a 10 px navy diamond at x19-21,y33-37 with no steel (reads as a scar/tattoo) and on the opposite side of the reference (ref 01: barbell at the viewer's right end of the brow).
 6. Not patched, still open: no ear hoop on the viewer's right ear, irises grey not grey-green.
Fix: patch B (below). Verified on the patched image: 14 colours, 1 component, 0 partial alpha, edge outline all `#030828` (282 px), maroon only in rows 2..24 (none in the bone rows 26+), bone ring is now rows 27-28 (2 px, flush with the face/hair) with pink teeth pointing DOWN into it, right overhang gone; at x8 and x10 it reads as "top of the skull sawn off, brain on top".
What would make it APPROVED: patch B + blind-ID >= 70% (ideally 80%) for "skull cut open with brain" + the viewer's-right ear hoop (redraw the ear 2 px wider) + owner OK. I expect 92 at best from this art; if the blind test fails, REGENERATE with my round-2 prompt delta.
```

### Patch B (run from `art_gen/`, writes `bh4_p.png`)

```python
# JACQUIN patch for bh4 (BOSS_BIGHEAD_3).
from PIL import Image
import numpy as np, os
OUT=os.environ.get('PATCH_OUT','')
def hx(h): h=h.lstrip('#'); return np.array([int(h[i:i+2],16) for i in (0,2,4)],dtype=np.uint8)
a=np.array(Image.open('approved/bosses/bh4.png').convert('RGBA'))
def col(x,y): return '#%02x%02x%02x'%tuple(a[y,x,:3])
def put(x,y,c): a[y,x,:3]=hx(c); a[y,x,3]=255
def clear(x,y): a[y,x,:]=0
# 1) palette hygiene: one outline colour, merge near-duplicates
merge={'#030828':['#020727','#030527','#010827','#0c102c'],
       '#e58ca2':['#e58aa2','#e68da3','#e58fa4','#e48ca2','#dd819a'],
       '#f4cab2':['#f5c8b1','#f3cdb7'],'#4e4d5b':['#4e4b5b']}
for t,l in merge.items():
    for h in l:
        m=(a[...,3]>0)&(a[...,:3]==hx(h)).all(-1); a[m,:3]=hx(t)
PINK={'#e58ca2','#b67c84','#963d60'}
# 2) orphan pixels
put(30,7,'#e58ca2')                        # stray skin pixel inside brain
put(23,28,'#f1efe1'); put(38,27,'#f1efe1')  # grey / pinkish dots inside the bone band
put(44,21,'#b67c84')                        # stray navy pixel inside brain edge
for y in range(23,27):
    for x in (4,5):
        if col(x,y)=='#7f7b82': put(x,y,'#dab4ad')   # grey sliver at left end of bone -> bone shade
for (x,y) in [(8,62),(8,63),(9,63),(9,64),(10,64)]: put(x,y,'#2e2d3f')   # skin-coloured holes, left shoulder -> hoodie
for (x,y) in [(45,64),(45,65)]: put(x,y,'#4e4d5b')                      # same, right shoulder
# 3) right overhang: remove the bone spike outside the brain (x>=50, rows 19-26), outline the brain at x=49
for y in range(19,27):
    for x in range(50,54): clear(x,y)
for y in range(19,27): put(49,y,'#030828')
# 4) flatten the crown: brain fills rows 22-25 (was zig-zag), shade row 25 darker, fissure ends at row 24
for y in range(22,26):
    for x in range(8,49):
        c=col(x,y) if a[y,x,3] else None
        if c=='#963d60' and y<=24 and 35<=x<=38: continue      # keep fissure inside brain
        if c in PINK and y<25: continue                         # keep existing folds
        put(x,y,'#b67c84' if (x<=14 or y==25) else '#e58ca2')
# 5) sawn edge: 1 px navy line, pink teeth pointing DOWN into the bone (period 4); bone ring = rows 27-28
for x in range(15,49):
    if (x%4)==0 or (x%4)==3: put(x,26,'#030828')
    else: put(x,26,'#e58ca2')
    if (x%4) in (1,2): put(x,27,'#030828')
for x in range(15,49):
    for y in (27,28):
        if col(x,y)=='#963d60': put(x,y,'#f1efe1')             # no maroon across the bone
# 6) brow marker: erase the navy diamond on the viewer's left, add the barbell on the viewer's right brow end (as bh1/bh3)
for x,y in [(20,33),(19,34),(21,34),(20,36),(19,37),(21,37),(20,34),(20,35),(21,35),(20,37),(20,38)]: put(x,y,'#f4cab2')
put(45,32,'#c8ccd8'); put(46,32,'#f4f6fb'); put(47,32,'#c8ccd8')
Image.fromarray(a).save(OUT+'bh4_p.png')
```

## C. rafinha_orc - ULT form of Rafinha

```
JACQUIN VERDICT: REJECTED   (FIXABLE_IN_CODE)
Asset: rafinha_orc.png   Type: hero sprite (ult form)   Attempt: 2
Scores (file as is): pixel 89 | silhouette 93 | color 90 | anatomy 91 | design 92 | symmetry 91 | ready 93 | brief 90 | likeness 86   => overall 91 (hero key piece needs 94; concept/blind-ID file still missing)
Scores (expected after patch C): pixel 91 | silhouette 93 | color 91 | anatomy 91 | design 92 | symmetry 91 | ready 93 | brief 90 | likeness 86   => about 91
Likeness check: black beard partial (chin tuft + left jaw strip, no mustache: weak-ok, unchanged), thick brows present, green skin present, short dark hair under topknot present, tusks NOW PRESENT (ivory #eadeb0 / shade #b8a87c, 15 px, readable at 112 px), stature lost by design; blind-ID as orc: yes by my reading, as the same man: only with label; distinct from other heroes: yes
What works (verified): the tusk patch is in the file (all 15 listed pixels are ivory/shade, the tusks read as fangs at 112 px). Outline merge is done: 409 edge px all `#010626`, 1 component, 0 partial alpha, 22 colours (<= 24). Silhouette, pauldrons, bracers, belt/buckle/loincloth, boots attach logically (no change since round 1).
Defects (most severe first):
 1. Pixel integrity: round-1 defect 3 (skin speckle, bible "no texture noise") is untouched. 299 non-outline pixels have no 4-neighbour of a similar colour (hair strands in the topknot are intentional, about 60 of them; about 240 are speckles on skin, chest, fists, boots). Six greens differ by 2-4 levels (`#78a64b #75a24a #76a54a #719f4b #73a34a #73a14a`), i.e. the 22 colours are really about 17.
 2. Beard continuity only partial (round-1 defect 2). I still do not recommend painting a mustache. This is an owner decision, not a code fix.
 3. Concept/blind-ID report `blind_rafinha_orc.md` still not produced (I have no subagent). Required before approval; the producer must run the cheap blind agent.
 4. Not an art defect (supposition, code not read this round): the orc is scaled with the roster's px-per-art-pixel rule times 1.35; keep `image-rendering: pixelated`.
Fix: patch C (below) = merge the six near-identical greens, then de-speckle 44 lone cool-green pixels on the body (face, pauldrons and hair are excluded so eyes, brows, tusks, spikes and topknot stay). Verified: 17 colours, 1 component, 0 partial alpha, outline unchanged, viewed at x8: chest/fists calmer, nothing lost; the remaining mottling on the chest is made of 2-pixel clusters that the rule keeps on purpose (re-draw only if the owner still dislikes it).
What would make it APPROVED: patch C + blind-ID >= 85% "orc" (and a note whether the blind reader links him to the normal Rafinha) + owner accepts the partial beard (or REGENERATE with my round-1 prompt delta for a full jaw beard). I would then score about 92-93, still below 94 for a key piece, so the owner should decide whether the orc is a key piece.
```

### Patch C (run from `art_gen/`, writes `rafinha_orc_p.png`)

```python
# JACQUIN patch for rafinha_orc (BOSS_BIGHEAD_3).
from PIL import Image
import numpy as np, os
from collections import Counter
OUT=os.environ.get('PATCH_OUT','')
def hx(h): h=h.lstrip('#'); return np.array([int(h[i:i+2],16) for i in (0,2,4)],dtype=np.uint8)
a=np.array(Image.open('approved/heroes/rafinha_orc.png').convert('RGBA'))
H,W=a.shape[:2]
def hexa(x,y): return '#%02x%02x%02x'%tuple(a[y,x,:3])
# 1) merge the five near-identical skin greens into #78a64b
for h in ['#75a24a','#76a54a','#719f4b','#73a34a','#73a14a']:
    m=(a[...,3]>0)&(a[...,:3]==hx(h)).all(-1); a[m,:3]=hx('#78a64b')
# 2) de-speckle: lone cool-green pixels on the body (no 4-neighbour of ~same colour) take the majority colour of their 8 neighbours
SPECK={'#467555','#71947a','#335c52','#2c414f','#95b952'}
def close(p,q): return int(np.abs(p.astype(int)-q.astype(int)).max())<=10
for y in range(14,80):
    for x in range(1,W-1):
        if a[y,x,3]==0 or hexa(x,y) not in SPECK: continue
        if 34<=x<=50 and 14<=y<=31: continue                          # face (eyes, brows, tusks) untouched
        if (x<=30 and 17<=y<=46) or (x>=52 and 20<=y<=46): continue   # pauldrons untouched
        if any(a[y+dy,x+dx,3]>0 and close(a[y,x,:3],a[y+dy,x+dx,:3]) for dx,dy in((1,0),(-1,0),(0,1),(0,-1))): continue
        c=Counter()
        for dx in(-1,0,1):
            for dy in(-1,0,1):
                if (dx or dy) and a[y+dy,x+dx,3]>0:
                    h=hexa(x+dx,y+dy)
                    if h!='#010626': c[h]+=1
        if c and c.most_common(1)[0][1]>=3: a[y,x,:3]=hx(c.most_common(1)[0][0])
Image.fromarray(a).save(OUT+'rafinha_orc_p.png')
```
Note: my first run had `#719f4b` also in SPECK (it is already merged by step 1); I re-ran the exact listing above and the output is pixel-identical to the first run (0 differing px, 17 colours, 1 component, 328 px changed vs the original, including the green merge).

## D. Head growth bh1..bh5 with m = [.9, 1.0, 1.1, 1.2, 1.35]

`js/battle.js` read this round: `KINDS.boss.m=.9` (line 8) and `CHAPMON` m arrays `[1,1,1.0]`, `[1,1,1.1]`, `[1,1,1.2]`, `[1,1,1.35]` (lines 15-18): the rising multipliers are in the code. Sprite is drawn with `spriteArt(sp,key,u.m*FS,...)` (lines 49, 87-88); I assume the scale is linear (not verified, I did not run the game).

Head height = hair/brain top to chin outline (1x, measured: skin ends at row 48 / ~50 / ~49 / 56 / ~57; chin outline one row below; bh2 has pale ice skin so I used its scarf line):

| stage | head h / sprite h (1x) | head h on screen (x m) | head max width 1x | width on screen | brain px (1x) | sprite h on screen |
|---|---|---|---|---|---|---|
| bh1 m .9 | 49/94 = 52% | 44 px (100%) | 51 | 46 | - | 85 |
| bh2 m 1.0 | 51/95 = 54% | 51 px (116%) | 58 | 58 | - | 95 |
| bh3 m 1.1 | 51/95 = 54% | 56 px (127%) | 58 | 64 | - | 105 |
| bh4 m 1.2 | 58/95 = 61% | 70 px (159%) | 54 | 65 | about 800 (patched; 608 as is) | 114 |
| bh5 m 1.35 | 58/94 = 62% | 78 px (177%) | 56 (brain; biceps make the sprite 84) | 76 | about 1200 | 127 |

Reading: growth IS readable now. On-screen head height rises monotonically 44 > 51 > 56 > 70 > 78 px (+16%, +10%, +25%, +11%); the brain area rises about 1.9x from stage 4 to 5 on screen (about 1150 to about 2180 px). The head share inside the 1x art is flat 52/54/54/61/62%, so the growth comes from the multiplier plus the brain; steps 2>3 and 4>5 are the small ones (about +10%) and still visible on the 3x strip. Caveats (Suponho, not tested in the game): lane overlap at 127 px tall (LANE_Y 66/77/88 on the 100-unit field) and stage 1 at 85 px is below the bible's 96-140 boss range (existing choice, owner's call).

## E. Other notes

- bh1-bh3 (patched with my script) verified in the files: 17 / 22 / 21 colours, 1 component each, outline one colour on bh1 (`#020625`), bh2 has 11 non-navy frost edge px, bh3 has 29 brown hair edge px and the pocket-tool scribble is still unpatched. Not re-verdicted here.
- No blind-ID report exists for bh5 (new), bh4 (this version) or rafinha_orc. I have no subagent; the producer must run the cheap blind agent on `bh5_p.png`, `bh4_p.png` and `rafinha_orc_p.png` after applying the patches and save `blind_<asset>.md`. Concept recognizability cannot be certified without it.
- Contrast vs UI #1a1612: bh5 lower 40% share below 1.6:1 is 27% as is, 0% after patch A. bh4 as is: about 25% (round 2), not re-measured after patch B.

## F. Not verified

- I did not run the game (m behaviour, lane overlap, scale linearity are arithmetic from source numbers).
- Blind-ID not done (see E). Concept scores above are my own reading.
- Likeness judged from refs 01 and 25 plus the earlier-round reading of refs 10/20; I did not re-open the other reference photos this round.
- Patched PNGs exist only in my scratchpad; the project art files are unchanged.
