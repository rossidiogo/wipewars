import sys,random
sys.path.insert(0,'/mnt/user-data/working/src20/art2')
from jack_sos import sh,D,star
def speck(seed,box,n,cols):
    r=random.Random(seed);x0,y0,x1,y1=box;o=''
    for i in range(n):
        x=r.uniform(x0,x1);y=r.uniform(y0,y1);c=r.choice(cols);w=r.choice((2,2,3))
        o+='<rect x="%.1f" y="%.1f" width="%d" height="%d" fill="%s"/>'%(x,y,w,w,c)
    return o
GR=['#8a5a30','#f0d090','#c89860','#e0b068']
def belt(P):
    lean=P.get('lean',0);bob=P.get('bob',0);arm=P.get('arm',0);sq=P.get('sq',1);fx=P.get('fx','');sd=P.get('seed',1)
    s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 192"><defs><clipPath id="bc"><path fill-rule="evenodd" d="M24 80 A40 40 0 0 1 104 80 L104 130 A40 40 0 0 1 24 130 Z M48 76 A16 16 0 0 1 80 76 L80 106 A16 16 0 0 1 48 106 Z"/></clipPath></defs>'
    s+='<ellipse cx="64" cy="186" rx="34" ry="5" fill="#101830" opacity=".5"/>'
    s+='<g transform="translate(%s,%s) rotate(%s 64 184) translate(64 184) scale(%s,%s) translate(-64 -184)">'%(P.get('dx',0),bob,lean,1/sq,sq)
    s+=sh('M46 168 h14 v18 h-16 z','#8a5a3c',2.5)+sh('M68 168 h14 v18 h-16 z','#8a5a3c',2.5)
    s+=sh('M26 104 Q12 %d 14 %d Q24 %d 30 %d Z'%(116-arm*20,128-arm*40,124-arm*34,116),'#c89860',2.5)
    s+=sh('M102 104 Q116 %d 114 %d Q104 %d 98 %d Z'%(116-arm*20,128-arm*40,124-arm*34,116),'#c89860',2.5)
    s+=sh('M24 80 A40 40 0 0 1 104 80 L104 130 A40 40 0 0 1 24 130 Z M48 76 A16 16 0 0 1 80 76 L80 106 A16 16 0 0 1 48 106 Z','#c89860',3,extra='fill-rule="evenodd"')
    s+='<g clip-path="url(#bc)">'+speck(sd,(22,38,106,172),150,GR)
    s+='<path d="M20 60 L108 92 M20 120 L108 150" stroke="#8a5a30" stroke-width="3" opacity=".55"/><path d="M96 40 L96 170" stroke="#f0d090" stroke-width="3" opacity=".4"/></g>'
    # hole = mouth
    s+='<path d="M48 76 A16 16 0 0 1 80 76 L80 106 A16 16 0 0 1 48 106 Z" fill="#2a1420" stroke="%s" stroke-width="2.5"/>'%D
    for x in (52,60,68):
        s+='<path d="M%d 66 l5 11 l5 -11 z" fill="#fff" stroke="%s" stroke-width="1.6" stroke-linejoin="round"/>'%(x-1,D)
    for x in (52,60,68):
        s+='<path d="M%d 118 l5 -11 l5 11 z" fill="#fff" stroke="%s" stroke-width="1.6" stroke-linejoin="round"/>'%(x-1,D)
    s+='<path d="M54 100 Q64 94 74 100" stroke="#d4707c" stroke-width="4" fill="none" stroke-linecap="round"/>'
    # eyes on top band
    s+='<ellipse cx="46" cy="58" rx="8" ry="9" fill="#fff" stroke="%s" stroke-width="2.2"/><ellipse cx="82" cy="58" rx="8" ry="9" fill="#fff" stroke="%s" stroke-width="2.2"/>'%(D,D)
    s+='<circle cx="48" cy="60" r="3.6" fill="#1a1020"/><circle cx="80" cy="60" r="3.6" fill="#1a1020"/>'
    s+='<path d="M36 46 L54 52 M92 46 L74 52" stroke="%s" stroke-width="3.6" stroke-linecap="round"/>'%D
    s+='</g>'+fx+'</svg>'
    return s
def machine(P):
    lean=P.get('lean',0);bob=P.get('bob',0);arm=P.get('arm',0);fx=P.get('fx','');sd=P.get('seed',1);sh_=P.get('shake',0)
    s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 208">'
    s+='<ellipse cx="80" cy="203" rx="52" ry="6" fill="#101830" opacity=".5"/>'
    s+='<g transform="translate(%s,%s) rotate(%s 80 200)">'%(P.get('dx',0)+sh_,bob,lean)
    # base + feet
    s+=sh('M22 184 h116 v14 h-116 z','#5a6488',3)+sh('M30 196 h22 v6 h-22 z','#3a2230',2.5)+sh('M108 196 h22 v6 h-22 z','#3a2230',2.5)
    # arms
    s+=sh('M40 140 Q22 %d 20 %d L30 %d Q34 %d 46 150 Z'%(150-arm*30,168-arm*60,172-arm*60,160-arm*40),'#8a96b8',2.5)
    s+=sh('M120 140 Q138 %d 140 %d L130 %d Q126 %d 114 150 Z'%(150-arm*30,168-arm*60,172-arm*60,160-arm*40),'#8a96b8',2.5)
    s+='<circle cx="25" cy="%d" r="8" fill="#c0cadc" stroke="%s" stroke-width="2.5"/><circle cx="135" cy="%d" r="8" fill="#c0cadc" stroke="%s" stroke-width="2.5"/>'%(172-arm*60,D,172-arm*60,D)
    # belt loop above (two rollers)
    cx=80
    loop='M%d 40 A22 22 0 0 1 %d 40 L%d 96 A22 22 0 0 1 %d 96 Z'%(cx-22,cx+22,cx+22,cx-22)
    s+='<path d="%s" fill="#2a1420" stroke="%s" stroke-width="3" stroke-linejoin="round"/>'%(loop,D)
    s+='<path d="M%d 40 A16 16 0 0 1 %d 40 L%d 96 A16 16 0 0 1 %d 96 Z" fill="none" stroke="%s" stroke-width="16" stroke-linejoin="round"/>'%(cx-16,cx+16,cx+16,cx-16,D)
    s+='<path d="M%d 40 A16 16 0 0 1 %d 40 L%d 96 A16 16 0 0 1 %d 96 Z" fill="none" stroke="#c89860" stroke-width="11" stroke-linejoin="round"/>'%(cx-16,cx+16,cx+16,cx-16)
    off=P.get('off',0)
    s+='<path d="M%d 40 A16 16 0 0 1 %d 40 L%d 96 A16 16 0 0 1 %d 96 Z" fill="none" stroke="#f0d090" stroke-width="5" stroke-dasharray="2 6" stroke-dashoffset="%s" stroke-linejoin="round"/>'%(cx-16,cx+16,cx+16,cx-16,off)
    s+='<path d="M%d 40 A16 16 0 0 1 %d 40 L%d 96 A16 16 0 0 1 %d 96 Z" fill="none" stroke="#8a5a30" stroke-width="3" stroke-dasharray="3 9" stroke-dashoffset="%s" stroke-linejoin="round"/>'%(cx-16,cx+16,cx+16,cx-16,off+4)
    # rollers
    s+='<circle cx="80" cy="40" r="9" fill="#c0cadc" stroke="%s" stroke-width="2.5"/><circle cx="80" cy="96" r="9" fill="#c0cadc" stroke="%s" stroke-width="2.5"/><circle cx="80" cy="40" r="3" fill="#5a6488"/><circle cx="80" cy="96" r="3" fill="#5a6488"/>'%(D,D)
    # column + housing
    s+=sh('M66 104 h28 v22 h-28 z','#8a96b8',2.5)
    s+=sh('M38 120 h84 v66 h-84 z','#d84a3c',3.2)
    s+='<path d="M42 124 h76" stroke="#ff8a6a" stroke-width="3"/><path d="M40 182 h80" stroke="#6a1c34" stroke-width="4"/>'
    # face
    s+='<ellipse cx="62" cy="144" rx="9" ry="10" fill="#fff8d0" stroke="%s" stroke-width="2.4"/><ellipse cx="98" cy="144" rx="9" ry="10" fill="#fff8d0" stroke="%s" stroke-width="2.4"/>'%(D,D)
    s+='<circle cx="64" cy="146" r="4.4" fill="#d82a2a"/><circle cx="96" cy="146" r="4.4" fill="#d82a2a"/>'
    s+='<path d="M50 130 L72 138 M110 130 L88 138" stroke="%s" stroke-width="4" stroke-linecap="round"/>'%D
    s+='<rect x="54" y="162" width="52" height="16" rx="3" fill="#2a1420" stroke="%s" stroke-width="2.4"/>'%D
    for x in range(58,104,8): s+='<rect x="%d" y="164" width="5" height="12" fill="#c0cadc"/>'%x
    s+='<circle cx="46" cy="176" r="2.6" fill="#ffd84a"/><circle cx="114" cy="176" r="2.6" fill="#ffd84a"/>'
    s+='</g>'+fx+'</svg>'
    return s
def dust(x,y):
    o=''
    for i,(dx,dy,r) in enumerate(((0,0,3),(-10,-8,2.4),(8,-12,2.4),(-4,10,2),(12,6,2))):
        o+='<circle cx="%d" cy="%d" r="%s" fill="#f0d090" stroke="#8a5a30" stroke-width="1.2"/>'%(x+dx,y+dy,r)
    return o
def frames(kind):
    f=belt if kind=='belt' else machine
    idle=[dict(bob=0,seed=1,off=0,shake=0),dict(bob=-3,lean=2,seed=2,off=4,shake=1),dict(bob=-4,seed=3,off=8,shake=0),dict(bob=-2,lean=-2,seed=4,off=12,shake=-1)]
    if kind=='belt': idle=[dict(i,seed=1) for i in idle]  # keep grit still on the small belt
    atk=[dict(lean=8,sq=.95,arm=0,dx=4,off=4),dict(lean=-10,sq=1.04,dx=-4,arm=1,bob=-4,off=8),dict(lean=-14,sq=.93,dx=-8,arm=1,off=12,fx=dust(14,150)+dust(8,128)),dict(lean=-4,dx=-3,arm=.4,off=16)]
    return [f(p) for p in idle],[f(p) for p in atk]
if __name__=='__main__':
    import pxlib
    for kind,W,H in (('belt',64,96),('machine',80,104)):
        i,a=frames(kind);px=pxlib.make(i+a,W,H)
        pxlib.sheet(px,'/mnt/user-data/working/src20/shots/sand_%s.png'%kind,S=4)
