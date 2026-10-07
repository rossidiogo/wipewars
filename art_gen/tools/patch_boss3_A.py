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
