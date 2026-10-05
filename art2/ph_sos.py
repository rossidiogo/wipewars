import sys
sys.path.insert(0,'/mnt/user-data/working/src20/art2')
from jack_sos import sh,limb,D
from daniel_sos import sneaker
from flavio_sos import plus
def G(i,a,b,c=None):
    c=c or b
    return '<linearGradient id="%s" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="%s"/><stop offset=".55" stop-color="%s"/><stop offset="1" stop-color="%s"/></linearGradient>'%(i,a,b,c)
SK={'light':('#fcd0a0','#e8a47a','#c88070'),'tan':('#f0b888','#d89468','#b07058'),'brown':('#c88a60','#a86c48','#80503c'),'green':('#a0e078','#5ab048','#2c7a40'),'pale':('#f4dcc8','#dcb8a0','#b08c88')}
def defs(P):
    s='<defs>'+'<radialGradient id="shade" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#2a1030" stop-opacity=".6"/><stop offset="1" stop-color="#2a1030" stop-opacity="0"/></radialGradient>'
    s+=G('sk',*SK[P['skin']])+G('tee',*P['tee'])+G('pt',*P['pants'])+G('hr',*P['hair'])+G('ac',*P.get('acc',('#c0cadc','#8a96b8','#5a6488')))
    return s+'</defs>'
def drop(x,y,r=6,c='#6a3a24'): return '<circle cx="%s" cy="%s" r="%s" fill="%s" stroke="#2a1410" stroke-width="2"/>'%(x,y,r,c)
def puff(x,y,r,c='#e8e8e0'): return '<circle cx="%s" cy="%s" r="%s" fill="%s" stroke="#8a8a90" stroke-width="2" opacity=".92"/>'%(x,y,r,c)
def note(x,y,c='#ffe08a'): return '<g transform="translate(%d,%d)"><ellipse cx="0" cy="0" rx="7" ry="5" fill="%s" stroke="#7a5a14" stroke-width="2"/><path d="M6 0 V-22 L16 -18" stroke="#7a5a14" stroke-width="3" fill="none"/></g>'%(x,y,c)
def code(x,y): return '<text x="%d" y="%d" font-family="monospace" font-weight="700" font-size="22" fill="#6aff8a" stroke="#0c3a1c" stroke-width="1">01</text>'%(x,y)
def prop(kind,x,y,t,k):
    g='<g transform="translate(%d,%d) rotate(%d)">'%(x,y,t)
    if kind=='can':
        g+=sh('M-13 -26 H13 V24 Q13 30 7 30 H-7 Q-13 30 -13 24 Z','#1c1c24',3)+sh('M-13 -26 H13 V-20 H-13 Z','#aab4cc',2.5)
        g+='<path d="M-6 -12 L-2 8 M0 -14 L4 10 M6 -10 L9 6" stroke="#6aff3a" stroke-width="4.5" stroke-linecap="round"/>'
    elif kind=='shield':
        g+=sh('M-24 -22 Q0 -34 24 -22 Q26 12 0 34 Q-26 12 -24 -22 Z','url(#ac)',3.5)+sh('M-15 -14 Q0 -22 15 -14 Q16 8 0 24 Q-16 8 -15 -14 Z','#b87a48',2.5)+'<circle cx="0" cy="-2" r="5" fill="#ffe08a" stroke="#7a5a14" stroke-width="2"/>'
    elif kind=='mango':
        g+='<ellipse cx="0" cy="0" rx="16" ry="19" fill="#f0a020" stroke="#7a3a10" stroke-width="3" transform="rotate(20)"/><ellipse cx="-4" cy="-6" rx="7" ry="9" fill="#ffd84a" transform="rotate(20)"/><path d="M-4 -19 q10 -8 18 -2 q-8 8 -18 2z" fill="#3a9a40" stroke="#1c4a2c" stroke-width="2"/>'
    elif kind=='bow':
        g+='<path d="M-6 -48 Q38 0 -6 48" stroke="%s" stroke-width="11" fill="none" stroke-linecap="round"/><path d="M-6 -48 Q38 0 -6 48" stroke="#8a5a3c" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M-6 -48 L-6 48" stroke="#e8e8d0" stroke-width="2.5"/>'%D
        if k in (1,2): g+='<path d="M-6 0 H46" stroke="#e8e8d0" stroke-width="3"/><path d="M40 -5 L52 0 L40 5 Z" fill="#c0cadc" stroke="#2a1a24" stroke-width="2"/>'
    elif kind=='staff':
        g+='<path d="M0 -50 V46" stroke="%s" stroke-width="12" stroke-linecap="round"/><path d="M0 -50 V46" stroke="#8a5a3c" stroke-width="6" stroke-linecap="round"/>'%D
        g+=sh('M0 -50 Q-20 -64 -26 -46 Q-8 -40 0 -50 Z','#5ab048',2.5)+sh('M0 -50 Q20 -66 28 -48 Q8 -40 0 -50 Z','#3a8a40',2.5)+sh('M0 -50 Q-4 -76 8 -80 Q16 -64 0 -50 Z','#8ae070',2.5)
    elif kind=='laptop':
        g+=sh('M-26 6 L26 6 L30 14 L-30 14 Z','#8a96b8',3)+sh('M-24 -26 H24 L26 6 H-26 Z','#1c2438',3)+'<rect x="-19" y="-21" width="38" height="22" fill="#103a24"/>'
        g+='<path d="M-14 -16 h14 M-14 -10 h22 M-14 -4 h10" stroke="#6aff8a" stroke-width="3"/>'
    elif kind=='pipe':
        g+='<path d="M-20 4 L16 -6" stroke="%s" stroke-width="11" stroke-linecap="round"/><path d="M-20 4 L16 -6" stroke="#8a5a3c" stroke-width="5" stroke-linecap="round"/>'%D
        g+=sh('M10 -8 L26 -20 L32 -8 L20 2 Z','#5a3a28',2.5)+'<path d="M26 -14 l4 -2" stroke="#ff7a2a" stroke-width="3"/>'
    elif kind=='stick':
        g+='<path d="M0 -34 V20" stroke="%s" stroke-width="9" stroke-linecap="round"/><path d="M0 -34 V20" stroke="#e8d8b8" stroke-width="4" stroke-linecap="round"/><circle cx="0" cy="-36" r="7" fill="#e0b078" stroke="#2a1a24" stroke-width="2.5"/>'%D
    elif kind=='grim':
        g+=sh('M-18 -22 H18 V22 H-18 Z','#2a1c3a',3)+sh('M-18 -22 H-12 V22 H-18 Z','#4a2a6a',2)+'<path d="M-4 -8 q4 -8 8 0 q0 8 -4 10 q-4 -2 -4 -10z" fill="#d8c8f0" stroke="#2a1a24" stroke-width="2"/>'
        g+='<path d="M0 -26 q-8 -12 2 -20 q4 8 8 -2 q6 10 -4 22z" fill="#b050ff" stroke="#4a1a8a" stroke-width="2.5" opacity=".95"/>'
    return g+'</g>'
def headgear(P,blink):
    h=P['hairs'];s=''
    if h=='long': s+='<path d="M100 112 C94 150 96 190 112 208 L122 200 L112 120 Z M212 112 C218 150 216 190 200 208 L190 200 L200 120 Z" fill="url(#hr)" stroke="%s" stroke-width="3"/>'%D
    return s
def hairtop(P):
    h=P['hairs']
    if h=='buzz': return '<path d="M106 108 C100 64 126 46 156 46 C186 46 212 64 206 108 C204 92 198 80 188 76 C182 84 176 84 170 76 C164 72 148 72 142 76 C136 84 130 84 124 76 C114 82 108 94 106 108 Z" fill="url(#hr)" stroke="%s" stroke-width="3" stroke-linejoin="round"/>'%D
    if h=='long': return '<path d="M104 116 C96 66 124 44 156 44 C190 44 216 66 208 116 C204 94 192 78 156 74 C122 78 108 94 104 116 Z" fill="url(#hr)" stroke="%s" stroke-width="3" stroke-linejoin="round"/>'%D
    if h=='spiky': return '<path d="M104 106 L98 70 L116 84 L116 50 L136 70 L150 38 L162 66 L182 42 L190 72 L212 56 L206 106 C202 90 196 80 186 78 C170 74 142 74 126 80 C114 84 108 94 104 106 Z" fill="url(#hr)" stroke="%s" stroke-width="3" stroke-linejoin="round"/>'%D
    if h=='cap': return '<path d="M104 100 C100 56 124 42 156 42 C188 42 212 56 208 100 Z" fill="url(#ac)" stroke="%s" stroke-width="3"/><path d="M110 94 C140 84 190 86 226 100 L226 108 C190 98 140 98 110 104 Z" fill="url(#ac)" stroke="%s" stroke-width="3" stroke-linejoin="round"/>'%(D,D)
    if h=='hood': return '<path d="M96 126 C84 60 116 34 156 34 C196 34 228 60 216 126 C212 150 204 164 200 168 L196 118 C190 92 176 82 156 82 C136 82 122 92 116 118 L112 168 C108 164 100 150 96 126 Z" fill="url(#ac)" stroke="%s" stroke-width="3.5" stroke-linejoin="round"/>'%D
    if h=='horns': return '<path d="M106 108 C100 64 126 46 156 46 C186 46 212 64 206 108 C204 92 198 80 188 76 C170 72 142 72 124 76 C114 82 108 94 106 108 Z" fill="url(#hr)" stroke="%s" stroke-width="3"/>'%D+sh('M110 70 Q96 50 104 30 Q120 44 124 64 Z','#e8e0c0',2.5)+sh('M202 70 Q216 50 208 30 Q192 44 188 64 Z','#e8e0c0',2.5)
    return ''
def figure(P,A):
    bob=A.get('bob',0);arm=A['arm'];far=A['far'];ex=A.get('extra','');mg=A['prop'];blink=A.get('blink',0)
    s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -70 480 480">'+defs(P)
    s+='<ellipse cx="158" cy="392" rx="70" ry="9" fill="url(#shade)"/>'
    # legs
    if P.get('shorts'):
        s+=sh('M116 340 L110 376 L148 378 L152 340 Z','url(#sk)',3.5)+sh('M164 340 L166 378 L204 376 L198 340 Z','url(#sk)',3.5)
        s+=sh('M110 290 L106 340 L152 342 L158 300 Z','url(#pt)',3.5)+sh('M162 300 L166 342 L210 340 L206 290 Z','url(#pt)',3.5)
        for fx in (128,190): s+=sh('M%d 378 H%d V388 H%d Z'%(fx-14,fx+24,fx-14),'#d84a3c',3)+'<path d="M%d 378 L%d 366 L%d 378" stroke="#a02a3c" stroke-width="4" fill="none"/>'%(fx-2,fx+8,fx+16)
    else:
        s+=sh('M112 290 L104 380 L150 384 L158 300 Z','url(#pt)',3.5)+sh('M162 300 L168 384 L214 380 L208 290 Z','url(#pt)',3.5)
        s+=sneaker(128,A.get('foot',0))+sneaker(190,0)
    if P.get('cast'):
        s+=sh('M104 312 Q128 302 152 312 L148 382 Q126 390 106 382 Z','#f4f0e8',3.5)+'<path d="M112 330 q10 -6 22 0 M110 350 q14 -6 28 0 M112 368 q10 -4 22 0" stroke="#b8b0a0" stroke-width="3" fill="none"/><path d="M118 322 l10 14 l-8 8" stroke="#d84a3c" stroke-width="3" fill="none"/>'
    s+='<g transform="translate(0,%s) rotate(%s 156 392)">'%(bob,A.get('lean',0))
    fs,fe,fh=far
    s+=limb([fs,fe],32,'url(#tee)' if not P.get('sleeveless') else 'url(#sk)')+limb([fe,fh],20,'url(#sk)')
    if P.get('gloves'): s+='<circle cx="%d" cy="%d" r="17" fill="#d84a3c" stroke="%s" stroke-width="3.5"/><circle cx="%d" cy="%d" r="7" fill="#ff8a6a"/>'%(fh[0],fh[1],D,fh[0]-3,fh[1]-4)
    else: s+='<circle cx="%d" cy="%d" r="12" fill="url(#sk)" stroke="%s" stroke-width="3"/>'%(fh[0],fh[1],D)
    wd=P.get('wide',0)
    s+=sh('M%d 214 Q%d 192 134 188 L180 188 Q%d 192 %d 214 L%d 304 Q158 322 %d 304 Z'%(98-wd,102-wd,212+wd,216+wd,222+wd,94-wd),'url(#tee)',3.5)
    pat=P.get('pat')
    if pat=='floral':
        for (x,y,c) in ((120,226,'#ffd84a'),(150,240,'#ff8aa8'),(184,226,'#ffffff'),(130,266,'#ff8aa8'),(168,278,'#ffd84a'),(198,258,'#7ad8ff'),(112,292,'#ffffff'),(150,300,'#7ad8ff'),(190,296,'#ff8aa8')):
            s+='<circle cx="%d" cy="%d" r="8" fill="%s" stroke="#2a1a24" stroke-width="2"/><circle cx="%d" cy="%d" r="3" fill="#ffd84a"/>'%(x,y,c,x,y)
        s+='<path d="M156 190 L156 306" stroke="#2a1a24" stroke-width="3"/>'
    elif pat=='claw': s+='<path d="M132 214 L142 290 M156 210 L162 296 M180 214 L184 288" stroke="#6aff3a" stroke-width="9" stroke-linecap="round"/>'
    elif pat=='hoodie': s+=sh('M126 280 H190 V304 Q158 312 126 304 Z','url(#tee)',3)+'<path d="M140 190 Q158 214 176 190" stroke="#2a1a24" stroke-width="3" fill="none"/><path d="M148 206 V230 M168 206 V230" stroke="#e8e8e8" stroke-width="3"/>'
    elif pat=='vest': s+=sh('M112 206 L148 206 L142 306 L112 300 Z','url(#ac)',3)+sh('M204 206 L168 206 L174 306 L204 300 Z','url(#ac)',3)
    elif pat=='robe': s+='<path d="M156 200 L156 316" stroke="#2a1a24" stroke-width="3"/>'+'<path d="M112 230 Q156 250 200 230" stroke="#b050ff" stroke-width="3" fill="none"/>'
    elif pat=='shield': s+=sh('M126 206 H190 V240 Q158 252 126 240 Z','url(#ac)',3)
    elif pat=='cast': pass
    if P.get('drum'):
        s+=sh('M108 262 Q158 252 208 262 L204 322 Q158 336 112 322 Z','#c83a3a',3.5)+'<ellipse cx="158" cy="262" rx="50" ry="10" fill="#f0e4cc" stroke="%s" stroke-width="3"/>'%D+'<path d="M120 270 L132 328 M144 272 L148 334 M170 272 L168 334 M196 270 L184 328" stroke="#ffd84a" stroke-width="3"/>'
    if P.get('tats'): s+='<path d="M%d 250 q8 -10 14 0 q-8 10 -14 0 M%d 276 l14 -6 M%d 288 l14 -6" stroke="#2a3a5a" stroke-width="3.5" fill="none"/>'%(A['arm'][1][0]-8,A['arm'][1][0]-12,A['arm'][1][0]-12) if False else ''
    ns,ne,nh=arm
    s+=limb([ns,ne],32,'url(#tee)' if not P.get('sleeveless') else 'url(#sk)')
    if P.get('tats'): s+=limb([ne,nh],20,'url(#sk)')+'<path d="M%d %d l6 -6 M%d %d l8 -4 M%d %d l6 8" stroke="#2a3a5a" stroke-width="4" fill="none" stroke-linecap="round"/>'%(ne[0]-4,ne[1]+8,ne[0]-2,ne[1]+16,ne[0]-4,ne[1]+24)
    if mg[2]!='none': s+=prop(P['prop'],mg[0],mg[1],mg[2],mg[3])
    if not P.get('tats'): s+=limb([ne,nh],20,'url(#sk)')
    if P.get('gloves'): s+='<circle cx="%d" cy="%d" r="17" fill="#d84a3c" stroke="%s" stroke-width="3.5"/><circle cx="%d" cy="%d" r="7" fill="#ff8a6a"/>'%(nh[0],nh[1],D,nh[0]-3,nh[1]-4)
    else: s+='<circle cx="%d" cy="%d" r="12" fill="url(#sk)" stroke="%s" stroke-width="3"/>'%(nh[0],nh[1],D)
    # head
    s+='<g transform="translate(156,190) scale(1.2) translate(-156,-190)">'
    s+=headgear(P,blink)
    s+=sh('M106 114 C106 74 128 58 156 58 C184 58 206 74 206 114 C206 154 186 182 156 182 C126 182 106 154 106 114 Z','url(#sk)',3.2)
    s+=sh('M104 112 C98 106 100 126 108 130 Z','url(#sk)',2.4)+sh('M208 112 C214 106 212 126 204 130 Z','url(#sk)',2.4)
    s+=hairtop(P)
    if P.get('hairs')=='hood': s+='<path d="M116 96 Q156 70 196 96 L196 112 L116 112 Z" fill="#14201a" opacity=".35"/>'
    s+='<ellipse cx="124" cy="140" rx="11" ry="7" fill="#f07070" opacity=".3"/><ellipse cx="188" cy="140" rx="11" ry="7" fill="#f07070" opacity=".3"/>'
    for ex_ in (134,178):
        if blink: s+='<path d="M%d 116 Q%d 122 %d 116" stroke="%s" stroke-width="3.4" fill="none" stroke-linecap="round"/>'%(ex_-9,ex_,ex_+9,D)
        else: s+='<ellipse cx="%d" cy="116" rx="9" ry="8.5" fill="#fff8f0" stroke="#2a1a24" stroke-width="2"/><circle cx="%d" cy="117" r="6" fill="#4a2c20"/><circle cx="%d" cy="117" r="3" fill="#120808"/><circle cx="%d" cy="114.5" r="1.8" fill="#fff"/>'%(ex_,ex_+.5,ex_+.5,ex_+2)
    s+='<path d="M120 100 Q134 94 148 100 M164 100 Q178 94 192 100" stroke="#2a1218" stroke-width="5" fill="none" stroke-linecap="round"/>'
    if P.get('glasses'): s+='<rect x="119" y="104" width="30" height="24" rx="8" fill="#c8e8ff" fill-opacity=".15" stroke="#120a0e" stroke-width="4.5"/><rect x="163" y="104" width="30" height="24" rx="8" fill="#c8e8ff" fill-opacity=".15" stroke="#120a0e" stroke-width="4.5"/><path d="M149 114 H163" stroke="#120a0e" stroke-width="4"/>'
    s+='<path d="M153 122 Q148 142 156 146 Q164 142 159 122" fill="#e49a74" stroke="#a4603f" stroke-width="2.2" stroke-linejoin="round" opacity=".85"/>'
    if P.get('beard'): s+='<path d="M112 140 Q116 182 156 188 Q196 182 200 140 Q184 168 156 168 Q128 168 112 140 Z" fill="url(#hr)" stroke="%s" stroke-width="2.5" stroke-linejoin="round"/>'%D
    elif P.get('stache'): s+='<path d="M130 152 Q142 144 156 150 Q170 144 182 152 Q172 160 156 156 Q140 160 130 152 Z" fill="url(#hr)" stroke="%s" stroke-width="2" stroke-linejoin="round"/>'%D
    if P.get('tusks'): s+=sh('M138 164 L134 180 L146 166 Z','#f4ecd0',2)+sh('M174 164 L178 180 L166 166 Z','#f4ecd0',2)
    s+='<path d="M142 162 Q156 174 170 162 Q156 166 142 162 Z" fill="#fff8f0" stroke="#2a1a24" stroke-width="2" stroke-linejoin="round"/>'
    s+='</g></g>'+ex
    return s+'</svg>'
def idle(k,pk):
    bob=[0,-2,-3,-1][k]
    return dict(bob=bob,lean=[0,-1,-1,0][k],arm=((208,222),(238,258),(232,244)),far=((104,222),(92,264),(98,300)),prop=(238,226+bob,0,k))
def atk(k,pk,ex):
    if k==0: return dict(lean=-5,bob=2,arm=((208,222),(238,244),(222,226)),far=((104,222),(88,256),(94,290)),prop=(222,210,-12,0))
    if k==1: return dict(lean=5,bob=-2,arm=((208,222),(246,236),(268,222)),far=((104,222),(86,248),(74,214)),prop=(274,208,18,1),extra=ex[0])
    if k==2: return dict(lean=9,bob=-3,arm=((208,222),(254,230),(288,210)),far=((104,222),(84,244),(70,206)),prop=(296,198,34,2),extra=ex[1])
    return dict(lean=3,bob=0,arm=((208,222),(238,252),(234,246)),far=((104,222),(92,264),(98,300)),prop=(238,226,0,3),extra=ex[2])
def frames(P):
    ex=P['fx']
    return [figure(P,idle(k,P['prop'])) for k in range(4)],[figure(P,atk(k,P['prop'],ex)) for k in range(4)]
