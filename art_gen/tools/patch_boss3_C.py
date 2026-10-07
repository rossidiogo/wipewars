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
