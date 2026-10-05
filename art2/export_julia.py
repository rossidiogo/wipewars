import sys,io,base64,json;sys.path.insert(0,'/mnt/user-data/working/src20/art2')
import pxlib,julia_sos
px=pxlib.make(julia_sos.frames(),96,96)
pxlib.sheet(px,'/tmp/julia_sheet.png',6)
for i,p in enumerate(px):p.save('/mnt/user-data/working/src20/assets/julia_%d.png'%i)
print('ok')
