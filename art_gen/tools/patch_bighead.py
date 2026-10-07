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
