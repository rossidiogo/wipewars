import math
def star(cx,cy,R,r,n=5,rot=-90):
    pts=[]
    for i in range(n*2):
        a=math.radians(rot+i*180/n);rr=R if i%2==0 else r
        pts.append('%.1f,%.1f'%(cx+rr*math.cos(a),cy+rr*math.sin(a)))
    return ' '.join(pts)
OL='#2a1810'
def boot(dx,lift=0):
    # origin: heel at dx, ground y=396
    s='<g transform="translate(%d,0)">'%dx
    # foot (rotates for toe tap around heel)
    s+='<g transform="rotate(%s 6 388)">'%(-lift)
    s+='<path d="M-3 368 H50 Q66 370 80 384 Q92 390 88 397 H-3 Z" fill="url(#boot)" stroke="%s" stroke-width="4" stroke-linejoin="round"/>'%OL
    s+='<path d="M4 376 Q40 372 66 382" stroke="#f0b27a" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/>'
    s+='<path d="M-3 390 H90" stroke="#3a2010" stroke-width="3"/>'
    s+='</g>'
    s+='<path d="M-3 392 h26 v6 h-26 z" fill="#4a2a18" stroke="%s" stroke-width="3" stroke-linejoin="round"/>'%OL
    # shaft
    s+='<path d="M-2 322 H48 L50 372 H-3 Z" fill="url(#boot)" stroke="%s" stroke-width="4" stroke-linejoin="round"/>'%OL
    s+='<path d="M-2 322 H48 V338 Q42 348 36 338 Q30 348 24 338 Q18 348 12 338 Q6 348 -2 338 Z" fill="#e8c080" stroke="%s" stroke-width="3" stroke-linejoin="round"/>'%OL
    s+='<path d="M24 348 V366" stroke="#f4d49c" stroke-width="2.5" stroke-dasharray="4 4"/>'
    s+='<path d="M4 342 V368" stroke="#f0b27a" stroke-width="3" opacity=".6" stroke-linecap="round"/>'
    s+='<circle cx="-7" cy="372" r="6" fill="#f0c040" stroke="%s" stroke-width="3"/><circle cx="-7" cy="372" r="2" fill="#a07010"/>'%OL
    return s+'</g>'
def jack(pose='idle',tap=0,P=None):
    crack=pose=='crack'
    P=P or {}
    lean=P.get('lean',0);bob=P.get('bob',0)
    s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -24 480 444">'
    s+='''<defs>
<linearGradient id="skin" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="#eab083"/><stop offset="1" stop-color="#c0805a"/></linearGradient>
<linearGradient id="shirt" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#86b0e0"/><stop offset="1" stop-color="#4a74aa"/></linearGradient>
<linearGradient id="vest" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a0623a"/><stop offset="1" stop-color="#623820"/></linearGradient>
<linearGradient id="hat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9aa68"/><stop offset="1" stop-color="#97663a"/></linearGradient>
<linearGradient id="boot" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#c47a40"/><stop offset=".6" stop-color="#9a5a2c"/><stop offset="1" stop-color="#6e3c1c"/></linearGradient>
<linearGradient id="jeans" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6486c6"/><stop offset="1" stop-color="#30488a"/></linearGradient>
<linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe27a"/><stop offset="1" stop-color="#c88a1c"/></linearGradient>
<radialGradient id="shade" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
</defs>'''
    s+='<ellipse cx="160" cy="398" rx="110" ry="15" fill="#000" opacity=".28"/>'
    # legs + boots
    s+='<path d="M104 300 H150 L148 330 H104 Z" fill="url(#jeans)" stroke="%s" stroke-width="4" stroke-linejoin="round"/>'%OL
    s+=boot(100,0)
    s+='<path d="M150 300 H198 L196 330 H152 Z" fill="url(#jeans)" stroke="%s" stroke-width="4" stroke-linejoin="round"/>'%OL
    s+=boot(150,tap)
    # far arm
    s+='<path d="M98 240 L106 288" stroke="%s" stroke-width="40" stroke-linecap="round"/><path d="M98 240 L106 288" stroke="url(#shirt)" stroke-width="32" stroke-linecap="round"/>'%OL
    # whip behind near arm
    if crack:
        wp='M300 262 C340 232 380 292 420 262 S450 250 468 258'
    else:
        wp='M246 326 C262 352 276 384 316 376'
    s+='<path d="%s" stroke="%s" stroke-width="10" fill="none" stroke-linecap="round"/><path d="%s" stroke="#5a3420" stroke-width="6" fill="none" stroke-linecap="round"/><path d="%s" stroke="#b07a44" stroke-width="2" fill="none" stroke-linecap="round" transform="translate(-1,-1)"/>'%(wp,OL,wp,wp)
    if crack:
        s+='<polygon points="%s" fill="#fff6b0" stroke="#f0b020" stroke-width="3" stroke-linejoin="round"/><circle cx="468" cy="258" r="6" fill="#fff"/>'%star(466,258,20,7,8,-90)
    # torso
    s+='<path d="M94 222 Q150 206 206 222 L202 306 Q150 316 98 306 Z" fill="url(#shirt)" stroke="%s" stroke-width="4" stroke-linejoin="round"/>'%OL
    s+='<path d="M98 224 L140 222 L134 304 L102 304 Z" fill="url(#vest)" stroke="%s" stroke-width="4" stroke-linejoin="round"/>'%OL
    s+='<path d="M162 222 L202 224 L198 304 L168 304 Z" fill="url(#vest)" stroke="%s" stroke-width="4" stroke-linejoin="round"/>'%OL
    s+='<path d="M106 232 L108 296 M194 232 L192 296" stroke="#e0a870" stroke-width="2" stroke-dasharray="4 4" opacity=".8"/>'
    s+='<path d="M110 214 Q152 206 192 214 L172 250 Q152 276 152 276 Q130 262 128 250 Z" fill="#dc4a3a" stroke="%s" stroke-width="4" stroke-linejoin="round"/>'%OL
    s+='<path d="M124 224 Q140 236 152 270" stroke="#a82e24" stroke-width="3" fill="none"/>'
    s+='<polygon points="%s" fill="url(#gold)" stroke="%s" stroke-width="3.5" stroke-linejoin="round"/>'%(star(182,268,16,7),OL)
    s+='<rect x="96" y="296" width="108" height="20" rx="5" fill="#4a2a1a" stroke="%s" stroke-width="4"/>'%OL
    s+='<rect x="138" y="292" width="28" height="28" rx="6" fill="url(#gold)" stroke="%s" stroke-width="4"/><rect x="146" y="300" width="12" height="12" rx="2" fill="#7a4a10"/>'%OL
    # far hand on belt
    s+='<circle cx="112" cy="298" r="13" fill="url(#skin)" stroke="%s" stroke-width="4"/>'%OL
    # near arm + hand
    if crack:
        pts='M204 244 L248 266 L290 262'
    else:
        pts='M204 244 L226 290 L240 322'
    s+='<path d="%s" stroke="%s" stroke-width="42" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="%s" stroke="url(#shirt)" stroke-width="34" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'%(pts,OL,pts)
    hx,hy=(292,262) if crack else (244,326)
    s+='<rect x="%d" y="%d" width="24" height="12" rx="5" fill="#3a2214" stroke="%s" stroke-width="3" transform="rotate(-30 %d %d)"/>'%(hx-6,hy-18,OL,hx,hy)
    s+='<circle cx="%d" cy="%d" r="15" fill="url(#skin)" stroke="%s" stroke-width="4"/>'%(hx,hy,OL)
    # head group
    s+='<g transform="translate(0,24)">'
    s+='<circle cx="98" cy="118" r="17" fill="#2b2024" stroke="%s" stroke-width="4"/><circle cx="92" cy="144" r="16" fill="#2b2024" stroke="%s" stroke-width="4"/><circle cx="98" cy="168" r="13" fill="#2b2024" stroke="%s" stroke-width="4"/>'%(OL,OL,OL)
    s+='<ellipse cx="156" cy="148" rx="60" ry="64" fill="url(#skin)" stroke="%s" stroke-width="4"/>'%OL
    s+='<ellipse cx="102" cy="156" rx="9" ry="14" fill="#c98860" stroke="%s" stroke-width="3.5"/><circle cx="102" cy="180" r="9" fill="none" stroke="%s" stroke-width="6"/><circle cx="102" cy="180" r="9" fill="none" stroke="#dfe6f2" stroke-width="3.5"/>'%(OL,OL)
    # beard
    s+='<path d="M106 172 Q104 214 140 232 Q172 242 196 222 Q214 204 214 168 Q200 186 176 186 Q150 184 130 184 Q116 184 106 172 Z" fill="#2c1f1b" stroke="%s" stroke-width="4" stroke-linejoin="round"/>'%OL
    s+='<path d="M116 196 Q128 216 150 224 M150 214 Q170 224 190 208" stroke="#5a463e" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>'
    s+='<path d="M140 180 Q166 168 208 176 Q192 196 166 194 Q150 192 140 180 Z" fill="#2c1f1b" stroke="%s" stroke-width="3" stroke-linejoin="round"/>'%OL
    s+='<path d="M168 206 Q180 214 194 204" stroke="#b86a60" stroke-width="5" fill="none" stroke-linecap="round"/>'
    s+='<path d="M190 146 Q202 164 188 170" stroke="#a06440" stroke-width="3.5" fill="none" stroke-linecap="round"/>'
    # glasses
    s+='<ellipse cx="180" cy="140" rx="19" ry="19" fill="#cfe8f6" fill-opacity=".45" stroke="#1c1c28" stroke-width="5"/><ellipse cx="128" cy="142" rx="16" ry="18" fill="#cfe8f6" fill-opacity=".45" stroke="#1c1c28" stroke-width="5"/>'
    s+='<path d="M146 139 Q154 131 162 138 M112 138 L100 136" stroke="#1c1c28" stroke-width="4.5" fill="none" stroke-linecap="round"/>'
    s+='<ellipse cx="183" cy="143" rx="6" ry="7" fill="#20161a"/><ellipse cx="131" cy="145" rx="5.5" ry="6.5" fill="#20161a"/><circle cx="185" cy="140" r="2.2" fill="#fff"/><circle cx="133" cy="142" r="2" fill="#fff"/>'
    s+='<path d="M163 112 Q180 100 198 110 M110 116 Q128 104 144 112" stroke="#241a1c" stroke-width="7" fill="none" stroke-linecap="round"/>'
    s+='<ellipse cx="204" cy="170" rx="9" ry="5" fill="#e07a6a" opacity=".35"/>'
    s+='</g>'
    # hat
    s+='<g transform="translate(0,-20)">'
    s+='<path d="M90 104 Q84 36 112 24 Q134 30 150 50 Q166 30 190 24 Q218 36 214 104 Z" fill="url(#hat)" stroke="%s" stroke-width="4.5" stroke-linejoin="round"/>'%OL
    s+='<path d="M104 60 Q106 40 118 34 M170 44 Q182 34 194 36" stroke="#f2cc8a" stroke-width="5" fill="none" stroke-linecap="round" opacity=".75"/>'
    s+='<path d="M90 104 Q152 122 214 104 L214 82 Q152 98 90 82 Z" fill="#3a2418" stroke="%s" stroke-width="4" stroke-linejoin="round"/>'%OL
    s+='<polygon points="%s" fill="url(#gold)" stroke="%s" stroke-width="3" stroke-linejoin="round"/>'%(star(190,98,13,5.5),OL)
    s+='<path d="M24 98 Q40 128 96 126 Q152 138 208 126 Q264 128 286 90 Q300 124 268 142 Q212 154 152 152 Q92 154 38 140 Q8 124 24 98 Z" fill="url(#hat)" stroke="%s" stroke-width="4.5" stroke-linejoin="round"/>'%OL
    s+='<path d="M44 124 Q96 140 150 140 Q208 140 262 126" stroke="#f2cc8a" stroke-width="4" fill="none" stroke-linecap="round" opacity=".6"/>'
    s+='</g><ellipse cx="156" cy="150" rx="62" ry="10" fill="url(#shade)" opacity=".5"/>'
    return s+'</svg>'
if __name__=='__main__':
    for n,(p,t) in {'idle':('idle',0),'crack':('crack',0)}.items():
        open('/mnt/user-data/working/src20/art2/jack_%s.svg'%n,'w').write(jack(p,t))
