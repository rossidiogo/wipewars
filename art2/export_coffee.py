import sys;sys.path.insert(0,'/mnt/user-data/working/src20/art2')
import pxlib,flavio_sos
from jack_sos import sh,D
def pot(k):
    s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="-68 -102 136 136">'+flavio_sos.DEFS
    for dx in (-14,0,14):
        o=(k+dx//7)%3
        s+='<path d="M%d -40 q-8 -10 0 -20 q8 -10 0 -20" stroke="#f4f0ff" stroke-width="6" fill="none" stroke-linecap="round" opacity=".9" transform="translate(%d,%d)"/>'%(dx,(o-1)*4,-o*3)
    # moka pot: base, waist, top, spout, handle, lid knob
    s+=sh('M-30 36 L-24 6 L24 6 L30 36 Z','#c0cadc',3.5)
    s+=sh('M-22 6 L-14 -8 L14 -8 L22 6 Z','#aab4cc',3.5)
    s+=sh('M-26 -8 L-30 -36 L30 -36 L26 -8 Z','#c0cadc',3.5)
    s+=sh('M-30 -36 L-36 -44 L-26 -42 Z','#aab4cc',2.5)
    s+=sh('M-32 -36 Q0 -50 32 -36 L28 -30 L-28 -30 Z','#5a6488',3)
    s+=sh('M-6 -50 H6 V-44 H-6 Z','#1c0e18',2.5)
    s+='<path d="M28 -30 Q58 -30 56 -4 Q54 14 28 12" stroke="%s" stroke-width="12" fill="none"/><path d="M28 -30 Q58 -30 56 -4 Q54 14 28 12" stroke="#4a3028" stroke-width="6" fill="none"/>'%D
    s+='<path d="M-18 -28 L-22 0 M-8 30 L-10 10" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity=".8"/>'
    return s+'</svg>'
px=pxlib.make([pot(k) for k in range(3)],64,64)
pxlib.sheet(px,'/tmp/coffee.png',6,3)
for i,p in enumerate(px):p.save('/mnt/user-data/working/src20/assets/ava_coffee%d.png'%i)
