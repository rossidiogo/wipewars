import sys
sys.path.insert(0,'/mnt/user-data/working/src20/art2')
from jack_sos import sh,limb,D,star
from daniel_sos import DEFS as DD,pts,sneaker
DEFS=DD.replace('</defs>','''<linearGradient id="gr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5ad0a0"/><stop offset=".5" stop-color="#2c8a78"/><stop offset="1" stop-color="#1c4a5c"/></linearGradient>
<linearGradient id="gr2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2c7a78"/><stop offset="1" stop-color="#1c3a52"/></linearGradient>
<linearGradient id="blond" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff0a0"/><stop offset=".5" stop-color="#f0bc3a"/><stop offset="1" stop-color="#b87a14"/></linearGradient>
<linearGradient id="cr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff4d8"/><stop offset="1" stop-color="#b8a898"/></linearGradient>
</defs>''')
def plus(x,y,r,c='#9ae070'):
    t=r*.38
    return '<path d="M%s %s h%s v%s h%s v%s h%s v%s h%s v%s h%s v%s h%s z" fill="%s" stroke="#1c4a2c" stroke-width="2" stroke-linejoin="round"/>'%(x-t,y-r,2*t,r-t,r-t,2*t,-(r-t),r-t,-2*t,-(r-t),-(r-t),-2*t,r-t,c)
def sage(P):
    bob=P.get('bob',0);arm=P['arm'];far=P['far'];st=P['staff'];ex=P.get('extra','')
    s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -70 480 480">'+DEFS
    s+='<ellipse cx="158" cy="392" rx="70" ry="9" fill="url(#shade)"/>'
    s+=sh('M100 270 L90 372 Q150 386 222 372 L216 270 Z','url(#gr2)')
    s+=sneaker(136,P.get('foot',0))+sneaker(176,0)
    s+='<g transform="translate(0,%s) rotate(%s 156 392)">'%(bob,P.get('lean',0))
    s+=sh('M112 200 Q112 176 156 174 Q200 176 202 200 Q202 226 160 232 Q114 226 112 200 Z','url(#gr2)')
    fs,fe,fh=far
    s+=limb([fs,fe],34,'url(#gr)')+limb([fe,fh],20,'url(#skin)')
    s+='<circle cx="%d" cy="%d" r="12" fill="url(#skin)" stroke="%s" stroke-width="3"/>'%(fh[0],fh[1],D)
    # robe
    s+=sh('M104 214 Q110 200 134 198 L180 198 Q204 200 210 214 L218 300 Q226 340 232 378 Q160 394 88 378 Q96 340 100 300 Z','url(#gr)',3.5)
    s+='<path d="M180 232 L210 228 L218 300 Q226 340 232 378 L198 386 Q206 330 194 300 Z" fill="#102a44" opacity=".5"/><path d="M106 232 L120 236 L114 300 Q110 340 98 378 L90 376 Q96 340 100 300 Z" fill="#a0ffd0" opacity=".35"/>'
    # cream apron + cross
    s+=sh('M132 226 L180 226 L186 376 Q158 384 128 376 Z','url(#cr)',3)
    s+=plus(156,276,20,'#5ad0a0')
    s+=sh('M102 214 Q124 196 156 202 Q188 196 210 214 Q200 234 182 230 Q156 238 130 230 Q112 234 102 214 Z','url(#gr)',3.5)
    s+='<path d="M108 222 Q130 238 156 238 Q184 238 206 222" stroke="url(#gold)" stroke-width="5" fill="none" stroke-linecap="round"/>'
    s+=sh('M100 296 Q158 314 218 296 L220 314 Q158 332 98 314 Z','#c8a060',3)+sh('M148 298 H168 V318 H148 Z','url(#gold)',3)
    # staff (mop)
    ns,ne,nh=arm
    s+=limb([ns,ne],34,'url(#gr)')
    (bx,by),(tx,ty)=st
    s+='<path d="M%d %d L%d %d" stroke="%s" stroke-width="14" stroke-linecap="round"/><path d="M%d %d L%d %d" stroke="url(#wood)" stroke-width="8" stroke-linecap="round"/>'%(bx,by,tx,ty,D,bx,by,tx,ty)
    s+='<g transform="translate(%d,%d)">'%(tx,ty)
    s+=sh('M-14 -6 H14 V8 H-14 Z','#c0cadc',3)
    s+=sh('M-18 8 Q-22 34 -14 46 Q-8 38 -6 12 Z','url(#cr)',2.5)+sh('M-6 8 Q-6 40 0 52 Q6 40 6 8 Z','url(#cr)',2.5)+sh('M6 8 Q8 38 14 46 Q22 34 18 8 Z','url(#cr)',2.5)
    s+=plus(0,-26,16,'#9ae070')
    s+='</g>'
    s+=limb([ne,nh],20,'url(#skin)')
    s+='<circle cx="%d" cy="%d" r="12" fill="url(#skin)" stroke="%s" stroke-width="3"/>'%(nh[0],nh[1],D)
    # head w/ hood
    s+='<g transform="translate(156,196) scale(1.18) translate(-156,-196)">'
    s+=sh('M100 150 C92 90 112 50 156 46 C200 50 220 90 212 150 C210 172 196 184 156 184 C116 184 102 172 100 150 Z','url(#gr)',3.5)
    s+=sh('M156 76 C184 76 198 100 198 128 C198 156 182 174 156 176 C130 174 114 156 114 128 C114 100 128 76 156 76 Z','url(#skin)',3.2)
    s+=sh('M112 118 C108 84 128 66 156 66 C186 66 206 84 200 118 C196 100 186 90 172 92 C160 96 150 90 140 96 C128 94 116 102 112 118 Z','url(#blond)',3)
    s+='<path d="M126 76 Q146 66 170 72" stroke="#fff0a0" stroke-width="3.5" fill="none" stroke-linecap="round"/>'
    s+='<ellipse cx="128" cy="146" rx="11" ry="7" fill="#f07070" opacity=".4"/><ellipse cx="184" cy="146" rx="11" ry="7" fill="#f07070" opacity=".4"/>'
    s+='<path d="M153 126 Q150 142 156 144 Q162 142 160 126" fill="#e49a74" stroke="#a4603f" stroke-width="2" stroke-linejoin="round"/>'
    for ex_,fl in ((136,1),(176,-1)):
        s+='<ellipse cx="%d" cy="122" rx="11" ry="9" fill="#fff8f0" stroke="#2a1a24" stroke-width="2.2"/><circle cx="%d" cy="123" r="6.5" fill="#2c8a78"/><circle cx="%d" cy="123" r="3" fill="#1a0e12"/><circle cx="%d" cy="120.5" r="1.8" fill="#fff"/>'%(ex_,ex_+fl*.5,ex_+fl*.5,ex_+fl*.5+2)
        s+='<path d="M%d 116 Q%d 110 %d 116" stroke="#1a0e12" stroke-width="3" fill="none" stroke-linecap="round"/>'%(ex_-11,ex_,ex_+11)
    s+='<path d="M124 106 Q136 100 148 106 M164 106 Q176 100 188 106" stroke="#8a5a28" stroke-width="4.5" fill="none" stroke-linecap="round"/>'
    s+='<path d="M144 158 Q156 168 168 158" stroke="#2a1a24" stroke-width="2" fill="#d4707c" stroke-linejoin="round"/>'
    s+='<path d="M190 92 Q204 118 200 150 Q196 124 184 104 Z" fill="#c07868" opacity=".6"/>'
    s+='</g></g>'+ex
    return s+'</svg>'
def idle(k):
    bob=[0,-2,-3,-1][k]
    px=lambda q:[(30+k*10+i*9,300-i*40-(k%2)*6) for i in range(0)]
    ex=''.join('<circle cx="%d" cy="%d" r="%d" fill="#d8f8ff" stroke="#5ad0e8" stroke-width="2.4" opacity=".9"/>'%(x,y-[0,10,20,10][k]*(1 if j%2 else -1)*-1,r) for j,(x,y,r) in enumerate([(60,250,7),(272,200,5),(284,280,8)]))
    return dict(bob=bob,lean=[0,-1,-1,0][k],arm=((208,222),(228,258),(226,290)),far=((104,222),(92,264),(98,300)),staff=((230,392),(228,112-bob)),extra=ex)
def atk(k):
    if k==0: P=dict(lean=-5,bob=2,arm=((208,222),(240,246),(244,214)),far=((104,222),(88,256),(94,290)),staff=((248,330),(262,140)),extra='')
    elif k==1: P=dict(lean=5,bob=-2,arm=((208,222),(246,236),(272,226)),far=((104,222),(86,248),(74,214)),staff=((250,296),(338,176)),extra=plus(300,150,12,'#9ae070'))
    elif k==2: P=dict(lean=9,bob=-3,arm=((208,222),(254,230),(288,214)),far=((104,222),(84,244),(70,206)),staff=((258,250),(374,156)),extra=plus(330,140,14)+plus(372,176,10,'#d8ffd0')+plus(304,120,8,'#fff'))
    else: P=dict(lean=3,bob=0,arm=((208,222),(236,252),(242,278)),far=((104,222),(92,264),(98,300)),staff=((244,392),(242,110)),extra=plus(300,200,8,'#9ae070'))
    return P
def frames(): return [sage(idle(k)) for k in range(4)],[sage(atk(k)) for k in range(4)]
