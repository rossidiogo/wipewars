import math
def star(cx,cy,R,r,n=5,rot=-90):
    return ' '.join('%.1f,%.1f'%(cx+(R if i%2==0 else r)*math.cos(math.radians(rot+i*180/n)),cy+(R if i%2==0 else r)*math.sin(math.radians(rot+i*180/n))) for i in range(n*2))
D='#2a1a24'  # warm dark stroke (not black)
def sh(d,fill,sw=3,st=D,extra=''):
    return '<path d="%s" fill="%s" stroke="%s" stroke-width="%s" stroke-linejoin="round" %s/>'%(d,fill,st,sw,extra)
def limb(pts,w,fill,st=D):
    d=' '.join(('M' if i==0 else 'L')+'%d %d'%p for i,p in enumerate(pts))
    return '<path d="%s" stroke="%s" stroke-width="%d" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="%s" stroke="%s" stroke-width="%d" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'%(d,st,w+6,d,fill,w)
DEFS='''<defs>
<linearGradient id="skin" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stop-color="#f4be92"/><stop offset=".5" stop-color="#dc9a70"/><stop offset="1" stop-color="#b0705c"/></linearGradient>
<linearGradient id="coat" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5f93ab"/><stop offset=".5" stop-color="#3f6f8a"/><stop offset="1" stop-color="#26405c"/></linearGradient>
<linearGradient id="coat2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2f526c"/><stop offset="1" stop-color="#1c2e48"/></linearGradient>
<linearGradient id="vest" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b87a48"/><stop offset="1" stop-color="#623a28"/></linearGradient>
<linearGradient id="shirt" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbf0d4"/><stop offset="1" stop-color="#c8b898"/></linearGradient>
<linearGradient id="hat" x1="0" y1="0" x2=".4" y2="1"><stop offset="0" stop-color="#e2b070"/><stop offset=".55" stop-color="#b98048"/><stop offset="1" stop-color="#84583a"/></linearGradient>
<linearGradient id="boot" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#cf8648"/><stop offset=".55" stop-color="#9c5c34"/><stop offset="1" stop-color="#623448"/></linearGradient>
<linearGradient id="jeans" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5a70b0"/><stop offset="1" stop-color="#28386e"/></linearGradient>
<linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff0a0"/><stop offset=".5" stop-color="#f0bc3a"/><stop offset="1" stop-color="#b87a14"/></linearGradient>
<linearGradient id="glove" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9a6040"/><stop offset="1" stop-color="#5a3030"/></linearGradient>
<radialGradient id="shade" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#2a1030" stop-opacity=".6"/><stop offset="1" stop-color="#2a1030" stop-opacity="0"/></radialGradient>
</defs>'''
def boot(dx,lift=0):
    s='<g transform="translate(%d,0)">'%dx
    s+='<g transform="rotate(%s 4 390)">'%(-lift)
    s+=sh('M-2 372 H34 Q48 372 58 382 L72 392 L70 397 H-2 Z','url(#boot)')
    s+='<path d="M4 380 Q30 374 52 384" stroke="#f4b884" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/>'
    s+='</g>'
    s+=sh('M-2 389 h15 v8 h-15 z','#4a2a30',2.5)
    s+=sh('M-1 330 H33 L36 374 H-3 Z','url(#boot)')
    s+=sh('M-2 330 H34 V341 Q29 347 24 341 Q18 347 12 341 Q6 347 1 341 L-2 341 Z','#e8c078',2.5)
    s+='<path d="M16 350 V368" stroke="#f4d49c" stroke-width="2.2" stroke-dasharray="4 4"/><path d="M3 346 V370" stroke="#f4b884" stroke-width="3" opacity=".6" stroke-linecap="round"/>'
    s+='<circle cx="-6" cy="374" r="5" fill="url(#gold)" stroke="%s" stroke-width="2.5"/>'%D
    return s+'</g>'
def jack(P):
    lean=P.get('lean',0);bob=P.get('bob',0);tap=P.get('tap',0);tail=P.get('tail',0)
    arm=P['arm'];hand=P['hand'];wp=P['whip'];spark=P.get('spark')
    s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -90 480 480">'+DEFS
    s+=sh('M104 198 L108 270 L%d 336 L150 340 L152 230 Z'%(88+tail),'url(#coat2)')
    s+=sh('M118 256 H150 L148 340 H116 Z','url(#jeans)')
    s+=boot(108,0)
    s+=sh('M150 256 H186 L186 340 H152 Z','url(#jeans)')
    s+=boot(148,tap)
    s+='<g transform="translate(%s,%s)">'%(lean,bob)
    # whip
    s+='<path d="%s" stroke="%s" stroke-width="13" fill="none" stroke-linecap="round"/><path d="%s" stroke="#5a3428" stroke-width="8.5" fill="none" stroke-linecap="round"/><path d="%s" stroke="#c08a5a" stroke-width="2" fill="none" stroke-dasharray="5 4" stroke-linecap="round"/>'%(wp,D,wp,wp)
    if spark:
        sx,sy=spark
        s+='<polygon points="%s" fill="#fff6b0" stroke="#f0b020" stroke-width="3" stroke-linejoin="round"/><polygon points="%s" fill="#fff"/>'%(star(sx,sy,24,7,8),star(sx,sy,14,5,4,0))
    # far arm
    s+=limb([(104,204),(110,248)],24,'url(#coat2)')
    s+='<circle cx="120" cy="258" r="9" fill="url(#glove)" stroke="%s" stroke-width="3"/>'%D
    # torso: shirt, vest
    s+=sh('M140 194 H166 L164 262 H142 Z','url(#shirt)')
    s+=sh('M128 196 H142 L142 262 H125 Z','url(#vest)')+sh('M164 196 H178 L180 262 H164 Z','url(#vest)')
    s+='<path d="M132 206 V256 M174 206 V256" stroke="#f0b87c" stroke-width="2" stroke-dasharray="4 4" opacity=".8"/>'
    s+=sh('M116 254 H190 V268 H116 Z','#4a2a30',3)
    s+='<path d="M122 261 H138 M168 261 H184" stroke="#9a6a4a" stroke-width="2" stroke-dasharray="4 3"/>'
    s+=sh('M140 252 H164 V272 H140 Z','url(#gold)',3)+'<rect x="147" y="258" width="10" height="9" rx="2" fill="#7a4a14"/>'
    s+='<polygon points="%s" fill="url(#gold)" stroke="%s" stroke-width="2.5" stroke-linejoin="round"/>'%(star(171,224,13,5.5),D)
    # coat panels
    s+=sh('M104 190 Q112 186 128 194 L126 258 L122 334 L92 338 L98 262 Z','url(#coat)')
    s+=sh('M178 194 Q194 186 202 190 L208 262 L210 330 L176 334 L176 258 Z','url(#coat)')
    s+='<path d="M114 204 L110 330 M198 206 L200 326" stroke="#9fd0e0" stroke-width="3" opacity=".45" stroke-linecap="round" fill="none"/>'
    s+='<path d="M124 200 L122 330 M180 200 L180 328" stroke="#142238" stroke-width="3" opacity=".5" fill="none"/>'
    s+=sh('M92 196 Q112 176 134 190 L130 210 Q112 200 94 214 Z','url(#coat)')
    s+=sh('M172 190 Q196 176 214 196 L210 214 Q196 200 176 210 Z','url(#coat)')
    # bandana
    s+=sh('M132 176 Q152 170 172 176 L166 196 L152 218 L138 196 Z','#d84a3c')
    s+='<path d="M138 182 Q148 196 152 214" stroke="#a02a2c" stroke-width="2.5" fill="none"/><circle cx="146" cy="188" r="2" fill="#fff" opacity=".8"/><circle cx="158" cy="192" r="2" fill="#fff" opacity=".8"/>'
    # near arm
    s+=limb(arm,26,'url(#coat)')
    hx,hy=hand
    s+='<path d="%s" stroke="#a8dcec" stroke-width="3" fill="none" stroke-linecap="round" opacity=".5" transform="translate(-8,-6)"/>'%(' '.join(('M' if i==0 else 'L')+'%d %d'%p for i,p in enumerate(arm)))
    s+='<rect x="%d" y="%d" width="22" height="11" rx="4" fill="#3a2230" stroke="%s" stroke-width="2.5" transform="rotate(-30 %d %d)"/>'%(hx-6,hy-16,D,hx,hy)
    s+='<circle cx="%d" cy="%d" r="11" fill="url(#glove)" stroke="%s" stroke-width="3"/><path d="M%d %d H%d" stroke="#2a1a24" stroke-width="2" opacity=".6"/>'%(hx,hy,D,hx-6,hy+2,hx+6)
    # head
    s+='<g transform="translate(156,172) scale(1.3) translate(-156,-172)">'
    s+='<g transform="translate(0,14)">'
    s+='<circle cx="116" cy="80" r="10" fill="#2b2030" stroke="%s" stroke-width="3"/><circle cx="112" cy="98" r="9" fill="#2b2030" stroke="%s" stroke-width="3"/><circle cx="114" cy="114" r="7" fill="#2b2030" stroke="%s" stroke-width="3"/>'%(D,D,D)
    s+='<path d="M108 84 Q114 74 122 78 M102 106 Q108 98 116 102" stroke="#6a5a78" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".8"/>'
    s+=sh('M156 54 C186 54 198 78 196 104 C194 134 176 152 156 152 C136 152 118 134 116 104 C114 78 128 54 156 54 Z','url(#skin)',3)
    s+='<path d="M180 62 Q196 100 182 142" stroke="#9a5a48" stroke-width="8" fill="none" opacity=".25" stroke-linecap="round"/>'
    s+='<ellipse cx="118" cy="104" rx="6" ry="10" fill="#c88862" stroke="%s" stroke-width="2.5"/>'%D
    s+='<circle cx="117" cy="122" r="6.5" fill="none" stroke="%s" stroke-width="5"/><circle cx="117" cy="122" r="6.5" fill="none" stroke="#dfe6f2" stroke-width="2.5"/>'%D
    s+=sh('M120 104 Q120 150 150 160 Q174 164 190 144 Q198 126 196 106 Q190 124 176 128 Q158 124 142 126 Q128 124 120 104 Z','#5a3c46',2,'#4a2e3a')
    s+='<path d="M130 134 Q140 148 156 152 M168 148 Q182 144 189 132 M142 140 Q150 146 162 146" stroke="#a07c72" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7" stroke-dasharray="2 3"/>'
    s+=sh('M143 125 Q158 118 176 120 Q190 118 193 124 Q185 130 170 128 Q156 128 143 125 Z','#2e2232',1.5)
    s+='<path d="M158 135 Q171 140 184 134" stroke="#d48480" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M164 136 Q172 138 180 135" stroke="#f4b8a8" stroke-width="1.2" fill="none" opacity=".8"/>'
    s+='<path d="M186 96 Q194 108 184 112" stroke="#a46448" stroke-width="3" fill="none" stroke-linecap="round"/>'
    s+='<ellipse cx="179" cy="93" rx="15" ry="15" fill="#e8f4ff" fill-opacity=".14" stroke="#3a2a3a" stroke-width="2.6"/><ellipse cx="138" cy="95" rx="14" ry="14.5" fill="#e8f4ff" fill-opacity=".14" stroke="#3a2a3a" stroke-width="2.6"/>'
    s+='<path d="M152 90 Q158 85 164 90 M124 92 L117 90" stroke="#3a2a3a" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
    s+='<path d="M170 84 Q176 82 182 84" stroke="#fff" stroke-width="2" fill="none" opacity=".7" stroke-linecap="round"/>'
    s+='<ellipse cx="181" cy="95" rx="4" ry="5" fill="#2a1c22"/><ellipse cx="140" cy="97" rx="3.8" ry="4.8" fill="#2a1c22"/><circle cx="182.4" cy="93" r="1.6" fill="#fff"/><circle cx="141.4" cy="95" r="1.5" fill="#fff"/>'
    s+='<path d="M166 74 Q180 66 195 72 M124 78 Q138 70 152 74" stroke="#2a1c26" stroke-width="6.5" fill="none" stroke-linecap="round"/>'
    s+=''
    s+='</g>'
    # hat
    s+='<g transform="translate(0,-20)">'
    s+=sh('M118 62 Q112 14 134 6 Q148 12 156 28 Q166 12 180 6 Q200 14 194 62 Z','url(#hat)',3.5)
    s+='<path d="M124 38 Q126 20 138 14 M168 24 Q180 14 190 20" stroke="#f8d898" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".8"/><path d="M156 30 V54" stroke="#84583a" stroke-width="2.5" opacity=".55"/>'
    s+=sh('M118 62 Q156 76 194 62 L194 46 Q156 60 118 46 Z','#3a2434',3)+'<path d="M124 56 Q156 68 188 56" stroke="#6a4a58" stroke-width="2" fill="none" stroke-dasharray="5 4"/>'
    s+='<polygon points="%s" fill="url(#gold)" stroke="%s" stroke-width="2.5" stroke-linejoin="round"/>'%(star(184,58,10,4.2),D)
    s+=sh('M72 58 Q88 70 124 68 Q156 72 188 68 Q226 70 240 54 Q252 82 228 94 Q190 102 156 100 Q120 102 84 94 Q60 82 72 60 Z','url(#hat)',3.5)
    s+='<path d="M86 78 Q124 90 156 88 Q190 90 232 74" stroke="#f8d898" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/>'
    s+='</g><ellipse cx="156" cy="116" rx="46" ry="8" fill="url(#shade)" opacity=".55"/>'
    s+='</g></g></svg>'
    return s
IDLE=[dict(bob=0,tap=0,sw=0,tail=0),dict(bob=-3,tap=16,sw=8,tail=-3),dict(bob=-3,tap=6,sw=-4,tail=0),dict(bob=0,tap=0,sw=-8,tail=3)]
def idle(k):
    d=IDLE[k]
    return dict(bob=d['bob'],tap=d['tap'],tail=d['tail'],arm=[(198,206),(210,246),(207,276)],hand=(207,280),
        whip='M207 284 C214 310 %d 344 %d %d'%(232+d['sw'],262+d['sw']*2,338-abs(d['sw'])//2))
ATK=[
 dict(lean=-10,bob=3,tail=10,arm=[(198,206),(214,160),(186,98)],hand=(184,92),whip='M184 92 C170 20 80 10 36 80'),
 dict(lean=6,bob=-3,tail=-8,arm=[(198,206),(222,150),(238,92)],hand=(240,86),whip='M240 86 C280 10 370 24 410 96'),
 dict(lean=20,bob=2,tail=-16,arm=[(198,206),(238,216),(284,208)],hand=(286,206),whip='M294 204 C334 184 372 228 408 204 S434 196 444 202',spark=(446,202)),
 dict(lean=8,bob=0,tail=-4,arm=[(198,206),(226,246),(244,270)],hand=(246,274),whip='M246 274 C290 262 326 296 310 340')]
def frames(): return [jack(idle(k)) for k in range(4)],[jack(a) for a in ATK]
