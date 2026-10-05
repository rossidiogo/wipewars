import sys;sys.path.insert(0,'/mnt/user-data/working/src20/art2')
import pxlib,flavio_sos
s=flavio_sos.flavio(flavio_sos.idle(0)).replace('viewBox="0 -70 480 480"','viewBox="72 8 168 168"')
px=pxlib.make([s],96,96)
px[0].save('/mnt/user-data/working/src20/assets/ava_sup.png')
pxlib.sheet(px,'/tmp/favav.png',5,1)
