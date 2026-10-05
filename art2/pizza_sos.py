import sys,math
sys.path.insert(0,'/mnt/user-data/working/src20/art2')
from jack_sos import sh,D,star
def eyes(cx,cy,gap,r,angry=True,odd=0):
    s='<ellipse cx="%d" cy="%d" rx="%d" ry="%d" fill="#fff" stroke="%s" stroke-width="2.2"/><ellipse cx="%d" cy="%d" rx="%d" ry="%d" fill="#fff" stroke="%s" stroke-width="2.2"/>'%(cx-gap,cy,r,r+1,D,cx+gap,cy+odd,r+odd//2,r+1+odd//2,D)
    s+='<circle cx="%d" cy="%d" r="%s" fill="#1a1020"/><circle cx="%d" cy="%d" r="%s" fill="#1a1020"/>'%(cx-gap+1,cy+2,r*.45,cx+gap-1,cy+2+odd,r*.45)
    if angry: s+='<path d="M%d %d L%d %d M%d %d L%d %d" stroke="%s" stroke-width="3.4" stroke-linecap="round"/>'%(cx-gap-r-2,cy-r-4,cx-gap+r,cy-r+1,cx+gap+r+2,cy-r-4,cx+gap-r,cy-r+1,D)
    return s
def teeth(cx,cy,w):
    n=5;pts='M%d %d '%(cx-w,cy)
    for i in range(n): pts+='L%d %d L%d %d '%(cx-w+(2*i+1)*w/n,cy+7,cx-w+(2*i+2)*w/n,cy)
    return '<path d="%sZ" fill="#fff" stroke="%s" stroke-width="2" stroke-linejoin="round"/>'%(pts,D)
def burnt(P):
    lean=P.get('lean',0);bob=P.get('bob',0);arm=P.get('arm',0);sq=P.get('sq',1);fx=P.get('fx','');sm=P.get('sm',0);rot=P.get('rot',0)
    s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 144"><defs><radialGradient id="pz" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#d0a050"/><stop offset=".6" stop-color="#8a5a24"/><stop offset="1" stop-color="#4a2c18"/></radialGradient></defs>'
    s+='<ellipse cx="64" cy="138" rx="32" ry="5" fill="#101830" opacity=".5"/>'
    s+='<g transform="translate(%s,%s) rotate(%s 64 138) translate(64 138) scale(%s,%s) translate(-64 -138)">'%(P.get('dx',0),bob,lean,1/sq,sq)
    s+=sh('M50 112 h12 v22 h-14 z','#4a3028',2.5)+sh('M68 112 h12 v22 h-14 z','#4a3028',2.5)
    s+=sh('M20 84 Q8 %d 10 %d Q20 %d 26 %d Z'%(94-arm*18,106-arm*36,100-arm*30,92),'#4a3028',2.5)
    s+=sh('M108 84 Q120 %d 118 %d Q108 %d 102 %d Z'%(94-arm*18,106-arm*36,100-arm*30,92),'#4a3028',2.5)
    s+='<g transform="rotate(%s 64 70)">'%rot
    s+='<circle cx="64" cy="70" r="46" fill="#2a1c18" stroke="%s" stroke-width="3.2"/><circle cx="64" cy="70" r="40" fill="#4a3028"/>'%D
    s+='<circle cx="64" cy="70" r="36" fill="url(#pz)" stroke="#14100e" stroke-width="2"/>'
    for x,y,r in ((40,52,7),(86,52,7),(36,84,6),(90,86,7),(64,98,6)):
        s+='<circle cx="%d" cy="%d" r="%d" fill="#6a1c1c" stroke="#14100e" stroke-width="2"/><circle cx="%d" cy="%d" r="%d" fill="#14100e"/>'%(x,y,r,x+1,y+1,r*.55)
    for x,y in ((52,40),(76,36),(100,70),(28,68),(76,100)):
        s+='<path d="M%d %d l5 -3 l3 5 l-6 3 z" fill="#14100e"/>'%(x,y)
    s+='<path d="M24 56 Q30 40 46 30 M104 84 Q98 100 82 108" stroke="#14100e" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/>'
    s+='</g>'
    s+=eyes(64,66,16,7)+teeth(64,86,12)
    # smoke
    for i,(x,dy) in enumerate(((46,0),(66,8),(84,2))):
        o=(sm+i*5)%12
        s+='<path d="M%d 26 q-6 -8 0 -14 q6 -6 0 -14" stroke="#aaaabc" stroke-width="4" fill="none" stroke-linecap="round" opacity=".75" transform="translate(%d,%d)"/>'%(x,o-6,dy)
    s+='</g>'+fx+'</svg>'
    return s
def messy(P):
    lean=P.get('lean',0);bob=P.get('bob',0);arm=P.get('arm',0);sq=P.get('sq',1);fx=P.get('fx','');dr=P.get('dr',0)
    s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 144"><defs><linearGradient id="cz" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff4b0"/><stop offset=".6" stop-color="#f0bc3a"/><stop offset="1" stop-color="#b87a14"/></linearGradient><linearGradient id="cr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f0c068"/><stop offset=".6" stop-color="#d08a3c"/><stop offset="1" stop-color="#8a4a24"/></linearGradient></defs>'
    s+='<ellipse cx="80" cy="138" rx="46" ry="5" fill="#101830" opacity=".5"/>'
    s+='<g transform="translate(%s,%s) rotate(%s 80 138) translate(80 138) scale(%s,%s) translate(-80 -138)">'%(P.get('dx',0),bob,lean,1/sq,sq)
    # cheese-string limbs
    s+=sh('M34 96 Q16 %d 18 %d Q26 %d 36 %d Z'%(108-arm*20,128-arm*50,124-arm*40,106),'#f0bc3a',2.5)
    s+=sh('M126 96 Q144 %d 142 %d Q134 %d 124 %d Z'%(108-arm*20,128-arm*50,124-arm*40,106),'#f0bc3a',2.5)
    # red cardboard shard stuck on left, with grey circle
    s+=sh('M10 70 L40 58 L52 108 L22 120 Z','#d82a2a',2.8)+'<circle cx="31" cy="90" r="8" fill="#a8a8b8" stroke="#2a1a24" stroke-width="2"/>'
    # folded pizza half-moon: crust arc top, fold at bottom
    s+=sh('M24 112 C20 64 52 34 82 34 C112 34 142 62 138 112 Z','url(#cr)',3.4)
    s+=sh('M34 112 C32 74 56 46 82 46 C108 46 130 72 128 112 Z','url(#cz)',2.4)
    # sauce smears + pepperoni scraps
    s+='<path d="M44 92 Q60 80 76 90 Q92 78 112 92" stroke="#d84a3c" stroke-width="9" fill="none" stroke-linecap="round" opacity=".85"/>'
    for x,y,r in ((54,70,7),(108,76,6),(96,100,5)):
        s+='<circle cx="%d" cy="%d" r="%d" fill="#a02a3c" stroke="#2a1a24" stroke-width="2"/>'%(x,y,r)
    s+='<path d="M64 58 q8 -6 14 0 l-4 8 z" fill="#4a8a3a" stroke="#2a1a24" stroke-width="1.6"/><path d="M96 62 q6 -4 10 2 l-5 5 z" fill="#4a8a3a" stroke="#2a1a24" stroke-width="1.6"/>'
    # cheese drips sliding off the bottom
    for x,l in ((40,18),(58,26),(78,14),(98,24),(116,16)):
        s+='<path d="M%d 108 q%d %d 6 %d q6 -8 6 -%d z" fill="#ffe070" stroke="#2a1a24" stroke-width="2" stroke-linejoin="round" transform="translate(0,%s)"/>'%(x,0,l//2,l,l,dr if x%2 else -dr)
    # bite mark
    s+='<path d="M124 56 q-6 6 -2 12 q-8 0 -8 8" stroke="#2a1a24" stroke-width="2" fill="none"/>'
    # face (uneven)
    s+=eyes(80,78,15,7,True,3)+teeth(80,98,13)
    s+=sh('M72 128 h10 v10 h-12 z','#f0bc3a',2.5)+sh('M92 128 h10 v10 h-12 z','#f0bc3a',2.5)
    s+='</g>'+fx+'</svg>'
    return s
def embers(x,y):
    o=''
    for dx,dy,r,c in ((0,0,4,'#ff8a2a'),(-12,-8,3,'#ffd84a'),(10,-12,3,'#ff5a1a'),(-4,10,2.4,'#ffd84a'),(14,6,2.4,'#ff8a2a')):
        o+='<circle cx="%d" cy="%d" r="%s" fill="%s" stroke="#4a1a10" stroke-width="1.2"/>'%(x+dx,y+dy,r,c)
    return o
def cheese(x,y):
    o=''
    for dx,dy,r in ((0,0,4.5),(-12,-6,3.4),(10,-10,3.4),(-2,10,3),(14,6,3)):
        o+='<circle cx="%d" cy="%d" r="%s" fill="#ffe070" stroke="#8a5a14" stroke-width="1.4"/>'%(x+dx,y+dy,r)
    return o
def frames(kind):
    f=burnt if kind=='burnt' else messy
    fxf=embers if kind=='burnt' else cheese
    idle=[dict(bob=0,sm=0,dr=0),dict(bob=-3,lean=2,sm=3,dr=3),dict(bob=-4,sm=6,dr=5),dict(bob=-2,lean=-2,sm=9,dr=2)]
    atk=[dict(lean=8,sq=.95,arm=0,dx=4,rot=-10),dict(lean=-12,sq=1.05,dx=-4,arm=1,bob=-4,rot=20),dict(lean=-16,sq=.92,dx=-8,arm=1,rot=60,fx=fxf(20,120)+fxf(12,94)),dict(lean=-4,dx=-3,arm=.4,rot=30)]
    return [f(p) for p in idle],[f(p) for p in atk]
if __name__=='__main__':
    import pxlib
    for kind,W,H in (('burnt',64,72),('messy',80,72)):
        i,a=frames(kind);px=pxlib.make(i+a,W,H)
        pxlib.sheet(px,'/mnt/user-data/working/src20/shots/pz_%s.png'%kind,S=4)
