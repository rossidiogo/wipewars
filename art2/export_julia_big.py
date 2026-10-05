import sys;sys.path.insert(0,'/mnt/user-data/working/src20/art2')
import pxlib,julia_big
px=pxlib.make(julia_big.frames(),160,208)
pxlib.sheet(px,'/tmp/jb.png',4)
for i,p in enumerate(px):p.save('/mnt/user-data/working/src20/assets/jul_%d.png'%i)
