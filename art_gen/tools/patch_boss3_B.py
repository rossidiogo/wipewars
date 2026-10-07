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
