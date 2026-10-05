import sys
sys.path.insert(0,'/mnt/user-data/working/src20/art2')
from jack_sos import sh,limb,D,star
from daniel_sos import DEFS as DD,sneaker
DEFS=DD.replace('</defs>','''<linearGradient id="tee" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4a3a44"/><stop offset=".5" stop-color="#2a1c18"/><stop offset="1" stop-color="#14100e"/></linearGradient>
<linearGradient id="apr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c08850"/><stop offset=".5" stop-color="#8a5a3c"/><stop offset="1" stop-color="#5c3a38"/></linearGradient>
<linearGradient id="jn" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4a62a8"/><stop offset="1" stop-color="#1a2050"/></linearGradient>
<linearGradient id="fh" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6a3c34"/><stop offset=".6" stop-color="#3c2024"/><stop offset="1" stop-color="#1c0e18"/></linearGradient>
<linearGradient id="mug" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#e8d8b8"/><stop offset="1" stop-color="#b8a898"/></linearGradient>
<linearGradient id="fsk" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stop-color="#fcd0a0"/><stop offset=".6" stop-color="#e8a47a"/><stop offset="1" stop-color="#c88070"/></linearGradient>
</defs>''')
def plus(x,y,r,c='#9ae070'):
    t=r*.38
    return '<path d="M%s %s h%s v%s h%s v%s h%s v%s h%s v%s h%s v%s h%s z" fill="%s" stroke="#1c4a2c" stroke-width="2" stroke-linejoin="round"/>'%(x-t,y-r,2*t,r-t,r-t,2*t,-(r-t),r-t,-2*t,-(r-t),-(r-t),-2*t,r-t,c)
def drop(x,y,r=6): return '<circle cx="%s" cy="%s" r="%s" fill="#6a3a24" stroke="#2a1410" stroke-width="2"/>'%(x,y,r)
def mugsvg(x,y,tilt=0,steam=0,pour=0):
    g='<g transform="translate(%d,%d) rotate(%d)">'%(x,y,tilt)
    if steam:
        for dx,ph in ((-9,0),(3,1.5),(14,3)):
            o=steam%4
            g+='<path d="M%d -22 q-6 -8 0 -16 q6 -8 0 -16" stroke="#f0ecff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".85" transform="translate(%d,%d)"/>'%(dx,(o%2)*3,-(o)*2)
    g+=sh('M-18 -18 H18 V14 Q18 26 4 26 H-4 Q-18 26 -18 14 Z','url(#mug)',3)
    g+='<ellipse cx="0" cy="-18" rx="18" ry="5" fill="#4a2a1c" stroke="%s" stroke-width="2.5"/><ellipse cx="-4" cy="-19" rx="8" ry="2" fill="#a0683c"/>'%D
    g+='<path d="M18 -8 Q34 -8 32 6 Q30 18 17 16" stroke="%s" stroke-width="9" fill="none"/><path d="M18 -8 Q34 -8 32 6 Q30 18 17 16" stroke="#f0e4cc" stroke-width="4.5" fill="none"/>'%D
    g+='<path d="M-8 -4 Q0 -10 8 -4 Q8 6 0 12 Q-8 6 -8 -4 Z" fill="#8a5a3c" opacity=".8"/>'  # bean mark
    return g+'</g>'
def flavio(P):
    bob=P.get('bob',0);arm=P['arm'];far=P['far'];ex=P.get('extra','');mg=P['mug'];blink=P.get('blink',0)
    s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -70 480 480">'+DEFS
    s+='<ellipse cx="158" cy="392" rx="70" ry="9" fill="url(#shade)"/>'
    # legs (jeans)
    s+=sh('M112 290 L104 380 L150 384 L158 300 Z','url(#jn)',3.5)+sh('M162 300 L168 384 L214 380 L208 290 Z','url(#jn)',3.5)
    s+=sneaker(128,P.get('foot',0))+sneaker(190,0)
    s+='<g transform="translate(0,%s) rotate(%s 156 392)">'%(bob,P.get('lean',0))
    # far arm (sleeve + hand)
    fs,fe,fh=far
    s+=limb([fs,fe],32,'url(#tee)')+limb([fe,fh],20,'url(#fsk)')
    s+='<circle cx="%d" cy="%d" r="12" fill="url(#fsk)" stroke="%s" stroke-width="3"/>'%(fh[0],fh[1],D)
    # torso: tee
    s+=sh('M98 214 Q102 192 134 188 L180 188 Q212 192 216 214 L222 304 Q158 322 94 304 Z','url(#tee)',3.5)
    # apron
    s+=sh('M122 206 L190 206 L200 340 Q158 352 114 340 Z','url(#apr)',3.5)
    s+='<path d="M122 206 L138 190 M190 206 L174 190" stroke="%s" stroke-width="9" stroke-linecap="round"/><path d="M122 206 L138 190 M190 206 L174 190" stroke="#5c3a38" stroke-width="4.5" stroke-linecap="round"/>'%D
    s+=sh('M132 268 H180 V302 Q156 310 132 302 Z','#7a4a30',3)
    s+='<path d="M146 280 Q156 270 166 280 Q166 292 156 298 Q146 292 146 280 Z" fill="#e0b078" stroke="%s" stroke-width="2.4"/><path d="M156 273 Q152 286 156 296" stroke="#5c3a38" stroke-width="2.4" fill="none"/>'%D
    s+='<path d="M104 214 Q110 250 108 296 M212 214 Q206 250 208 296" stroke="#4a3a44" stroke-width="4" fill="none" opacity=".7"/>'
    # near arm (holds mug)
    ns,ne,nh=arm
    s+=limb([ns,ne],32,'url(#tee)')
    s+=mugsvg(mg[0],mg[1],mg[2],mg[3])
    s+=limb([ne,nh],20,'url(#fsk)')
    s+='<circle cx="%d" cy="%d" r="12" fill="url(#fsk)" stroke="%s" stroke-width="3"/>'%(nh[0],nh[1],D)
    # head
    s+='<g transform="translate(156,190) scale(1.2) translate(-156,-190)">'
    s+=sh('M106 114 C106 74 128 58 156 58 C184 58 206 74 206 114 C206 154 186 182 156 182 C126 182 106 154 106 114 Z','url(#fsk)',3.2)
    s+=sh('M104 112 C98 106 100 126 108 130 Z','url(#fsk)',2.4)+sh('M208 112 C214 106 212 126 204 130 Z','url(#fsk)',2.4)
    # buzzed hair, receding temples
    s+='<path d="M106 108 C100 64 126 46 156 46 C186 46 212 64 206 108 C204 92 198 80 188 76 C182 84 176 84 170 76 C164 72 148 72 142 76 C136 84 130 84 124 76 C114 82 108 94 106 108 Z" fill="url(#fh)" stroke="%s" stroke-width="3" stroke-linejoin="round"/>'%D
    s+='<path d="M128 56 Q150 48 176 56" stroke="#9a6448" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".8"/>'
    s+='<ellipse cx="124" cy="140" rx="11" ry="7" fill="#f07070" opacity=".35"/><ellipse cx="188" cy="140" rx="11" ry="7" fill="#f07070" opacity=".35"/>'
    for ex_ in (134,178):
        if blink: s+='<path d="M%d 116 Q%d 122 %d 116" stroke="%s" stroke-width="3.4" fill="none" stroke-linecap="round"/>'%(ex_-9,ex_,ex_+9,D)
        else: s+='<ellipse cx="%d" cy="116" rx="9" ry="8.5" fill="#fff8f0" stroke="#2a1a24" stroke-width="2"/><circle cx="%d" cy="117" r="6" fill="#4a2c20"/><circle cx="%d" cy="117" r="3" fill="#120808"/><circle cx="%d" cy="114.5" r="1.8" fill="#fff"/>'%(ex_,ex_+.5,ex_+.5,ex_+2)
    s+='<path d="M120 100 Q134 94 148 100 M164 100 Q178 94 192 100" stroke="#2a1218" stroke-width="5" fill="none" stroke-linecap="round"/>'
    s+='<path d="M153 122 Q148 142 156 146 Q164 142 159 122" fill="#e49a74" stroke="#a4603f" stroke-width="2.2" stroke-linejoin="round"/>'
    # stubble + mustache + smile
    s+='<path d="M124 150 Q128 176 156 180 Q184 176 188 150 Q172 166 156 166 Q140 166 124 150 Z" fill="#7a5058" opacity=".45"/>'
    s+='<path d="M130 152 Q142 144 156 150 Q170 144 182 152 Q172 160 156 156 Q140 160 130 152 Z" fill="#4a2c28" stroke="#1c0e18" stroke-width="2" stroke-linejoin="round"/>'
    s+='<path d="M142 162 Q156 174 170 162 Q156 166 142 162 Z" fill="#fff8f0" stroke="#2a1a24" stroke-width="2" stroke-linejoin="round"/>'
    s+='</g></g>'+ex
    return s+'</svg>'
def idle(k):
    bob=[0,-2,-3,-1][k]
    return dict(bob=bob,lean=[0,-1,-1,0][k],arm=((208,222),(238,258),(232,244)),far=((104,222),(92,264),(98,300)),mug=(238,224+bob,0,k+1))
def atk(k):
    if k==0: return dict(lean=-5,bob=2,arm=((208,222),(238,244),(222,226)),far=((104,222),(88,256),(94,290)),mug=(222,208,-12,0))
    if k==1: return dict(lean=5,bob=-2,arm=((208,222),(246,236),(268,222)),far=((104,222),(86,248),(74,214)),mug=(274,206,28,0),extra=drop(310,214)+drop(322,226,4))
    if k==2: return dict(lean=9,bob=-3,arm=((208,222),(254,230),(288,210)),far=((104,222),(84,244),(70,206)),mug=(296,194,62,0),extra=drop(336,206)+drop(356,222,5)+drop(372,246,4)+plus(350,170,13)+plus(380,200,9,'#d8ffd0'))
    return dict(lean=3,bob=0,arm=((208,222),(238,252),(234,246)),far=((104,222),(92,264),(98,300)),mug=(238,226,0,2),extra=plus(300,200,8,'#9ae070'))
def frames(): return [flavio(idle(k)) for k in range(4)],[flavio(atk(k)) for k in range(4)]
