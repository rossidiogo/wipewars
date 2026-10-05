import sys,math
sys.path.insert(0,'/mnt/user-data/working/src20/art2')
from jack_sos import sh,D,star
def defs(rare):
    a,b,c=('#e8f8ff','#86c8ec','#2c5a9a') if not rare else ('#e0d8ff','#9a86d8','#3c2a7a')
    return '<defs><linearGradient id="ice" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="%s"/><stop offset=".45" stop-color="%s"/><stop offset="1" stop-color="%s"/></linearGradient></defs>'%(a,b,c)
def cond(P,rare=False):
    lean=P.get('lean',0);sq=P.get('sq',1);bob=P.get('bob',0);arm=P.get('arm',0);fx=P.get('fx','');sw=P.get('sw',0)
    s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 192">'+defs(rare)
    s+='<ellipse cx="64" cy="186" rx="34" ry="5" fill="#101830" opacity=".5"/>'
    s+='<g transform="translate(%s,%s) rotate(%s 64 184) translate(64 184) scale(%s,%s) translate(-64 -184)">'%(P.get('dx',0),bob,lean,1/sq if sq else 1,sq)
    # feet
    s+=sh('M44 176 h16 v10 h-18 z','#3c78b8',2.5)+sh('M68 176 h16 v10 h-18 z','#3c78b8',2.5)
    # arms (stubs)
    s+=sh('M34 96 Q22 %d 24 %d Q32 %d 38 %d Z'%(110-arm*18,122-arm*34,118-arm*30,108),'#86c8ec',2.5)
    s+=sh('M94 96 Q106 %d 104 %d Q96 %d 90 %d Z'%(110-arm*18,122-arm*34,118-arm*30,108),'#86c8ec',2.5)
    # body sleeve
    s+=sh('M64 22 C78 22 80 32 80 44 C%d 84 90 122 92 156 L36 156 C38 122 %d 84 48 44 C48 32 50 22 64 22 Z'%(84+sw,44+sw),'url(#ice)',3)
    # reservoir nub + frost cap
    s+=sh('M58 24 Q64 8 70 24 Q64 28 58 24 Z','#e8f8ff',2.2)
    s+='<path d="M54 40 Q58 70 56 130" stroke="#ffffff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".8"/>'
    # frost crystals
    fc='#ffffff'
    for pts in ('M40 120 l8 -10 l4 12 l-8 6 z','M78 70 l10 -6 l2 12 l-9 4 z','M70 128 l8 -8 l8 10 l-10 4 z','M52 54 l6 -8 l5 9 l-7 3 z'):
        s+='<path d="%s" fill="%s" stroke="#86c8ec" stroke-width="1.2" stroke-linejoin="round"/>'%(pts,fc)
    # rolled rim
    s+=sh('M28 154 Q64 166 100 154 L100 168 Q64 182 28 168 Z','#c8e8ff' if not rare else '#c0b0f0',3)
    # icicles
    for x,l in ((38,14),(52,20),(68,16),(84,22),(94,12)):
        s+='<path d="M%d 172 l5 0 l-2.5 %d z" fill="#e8f8ff" stroke="#3c78b8" stroke-width="1.6" stroke-linejoin="round"/>'%(x-2,l)
    if rare:
        for x,y,h in ((50,40,22),(64,26,26),(78,40,22),(36,84,20),(92,84,20)):
            s+='<path d="M%d %d l7 %d l-14 0 z" fill="#e0d8ff" stroke="#3c2a7a" stroke-width="2" stroke-linejoin="round" transform="translate(0,%d)"/>'%(x,y-h,h,0)
        s+='<path d="M50 30 L58 52 L50 64 M80 90 L70 106 L78 124" stroke="#2c1c5a" stroke-width="2" fill="none"/>'
    # face
    ec='#5ad0e8' if rare else '#fff'
    s+='<ellipse cx="54" cy="82" rx="7" ry="8" fill="%s" stroke="%s" stroke-width="2.2"/><ellipse cx="76" cy="82" rx="7" ry="8" fill="%s" stroke="%s" stroke-width="2.2"/>'%(ec,D,ec,D)
    s+='<circle cx="56" cy="84" r="3.4" fill="#1a1020"/><circle cx="74" cy="84" r="3.4" fill="#1a1020"/>'
    s+='<path d="M45 70 L61 76 M85 70 L69 76" stroke="%s" stroke-width="3.4" stroke-linecap="round"/>'%D
    s+='<path d="M52 104 L56 110 L60 103 L64 111 L68 103 L72 110 L76 104 Q64 98 52 104 Z" fill="#fff" stroke="%s" stroke-width="2" stroke-linejoin="round"/>'%D
    s+='</g>'+fx+'</svg>'
    return s
def burst(x,y,r=14):
    return '<polygon points="%s" fill="#e8f8ff" stroke="#3c78b8" stroke-width="1.6" stroke-linejoin="round"/>'%star(x,y,r,r*.4,8,-90)
def frames(rare):
    idle=[dict(sw=0,bob=0,lean=0,arm=0),dict(sw=2,bob=-3,lean=2,arm=.3),dict(sw=0,bob=-4,lean=0,arm=0),dict(sw=-2,bob=-2,lean=-2,arm=.3)]
    atk=[dict(lean=8,sq=.95,arm=0,dx=4),dict(lean=-10,sq=1.04,dx=-4,arm=1,bob=-4),dict(lean=-14,sq=.93,dx=-8,arm=1,fx=burst(22,128,14)+burst(16,104,7)),dict(lean=-4,dx=-3,arm=.4)]
    return [cond(p,rare) for p in idle],[cond(p,rare) for p in atk]
if __name__=='__main__':
    import pxlib
    for rare in (False,True):
        i,a=frames(rare);px=pxlib.make(i+a,64,96)
        pxlib.sheet(px,'/mnt/user-data/working/src20/shots/cond_%d.png'%rare,S=4)
