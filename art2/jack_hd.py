import sys;sys.path.insert(0,'/mnt/user-data/working/src20/art2')
from jack_vec import star,OL,boot
DEFS='''<defs>
<linearGradient id="skin" x1="0" y1="0" x2="0.5" y2="1"><stop offset="0" stop-color="#f0b68a"/><stop offset=".55" stop-color="#d99468"/><stop offset="1" stop-color="#b87650"/></linearGradient>
<linearGradient id="shirt" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9cc4ee"/><stop offset=".5" stop-color="#6e9ad0"/><stop offset="1" stop-color="#4468a0"/></linearGradient>
<linearGradient id="vest" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b87444"/><stop offset="1" stop-color="#5c3420"/></linearGradient>
<linearGradient id="hat" x1="0" y1="0" x2="0.3" y2="1"><stop offset="0" stop-color="#e6b874"/><stop offset=".6" stop-color="#b88448"/><stop offset="1" stop-color="#8a5c34"/></linearGradient>
<linearGradient id="boot" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d28848"/><stop offset=".55" stop-color="#a45f30"/><stop offset="1" stop-color="#6a381a"/></linearGradient>
<linearGradient id="jeans" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7090d0"/><stop offset="1" stop-color="#2c4486"/></linearGradient>
<linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff0a0"/><stop offset=".5" stop-color="#f0bc3a"/><stop offset="1" stop-color="#b87a14"/></linearGradient>
<radialGradient id="shade" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".6"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
</defs>'''
def jack(P):
    lean=P.get('lean',0);bob=P.get('bob',0);tap=P.get('tap',0)
    arm=P['arm'];hand=P['hand'];wp=P['whip'];spark=P.get('spark')
    s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -24 480 444">'+DEFS
    s+='<ellipse cx="160" cy="398" rx="110" ry="15" fill="#000" opacity=".28"/>'
    s+='<path d="M104 300 H150 L148 332 H104 Z" fill="url(#jeans)" stroke="%s" stroke-width="4"/>'%OL
    s+=boot(100,0)
    s+='<path d="M150 300 H198 L196 332 H152 Z" fill="url(#jeans)" stroke="%s" stroke-width="4"/>'%OL
    s+='<path d="M174 306 V330" stroke="#1c2c66" stroke-width="3" opacity=".6"/>'
    s+=boot(150,tap)
    s+='<g transform="translate(%s,%s)">'%(lean,bob)
    # whip behind everything upper
    s+='<path d="%s" stroke="%s" stroke-width="14" fill="none" stroke-linecap="round"/><path d="%s" stroke="#5a3420" stroke-width="9" fill="none" stroke-linecap="round"/><path d="%s" stroke="#b07a44" stroke-width="2" fill="none" stroke-dasharray="5 4" stroke-linecap="round"/>'%(wp,OL,wp,wp)
    if spark:
        sx,sy=spark
        s+='<polygon points="%s" fill="#fff6b0" stroke="#f0b020" stroke-width="3" stroke-linejoin="round"/><polygon points="%s" fill="#fff" opacity=".9"/><circle cx="%d" cy="%d" r="6" fill="#fff"/>'%(star(sx,sy,22,7,8),star(sx,sy,13,5,4,0),sx,sy)
    # far arm
    s+='<path d="M98 240 L106 288" stroke="%s" stroke-width="40" stroke-linecap="round"/><path d="M98 240 L106 288" stroke="url(#shirt)" stroke-width="32" stroke-linecap="round"/>'%OL
    # torso
    s+='<path d="M94 222 Q150 206 206 222 L202 306 Q150 316 98 306 Z" fill="url(#shirt)" stroke="%s" stroke-width="4" stroke-linejoin="round"/>'%OL
    s+='<path d="M124 262 Q136 270 134 290 M176 262 Q166 272 170 292" stroke="#3a5a90" stroke-width="3" fill="none" opacity=".55" stroke-linecap="round"/>'
    for x0,x1,x2,x3 in ((98,140,134,102),(202,162,168,198)):
        s+='<path d="M%d 224 L%d 222 L%d 304 L%d 304 Z" fill="url(#vest)" stroke="%s" stroke-width="4" stroke-linejoin="round"/>'%(x0 if x0<x1 else x1,x1 if x0<x1 else x0,x2 if x0<x1 else x3,x3 if x0<x1 else x2,OL)
    s+='<path d="M108 232 L110 296 M192 232 L190 296" stroke="#f0b87c" stroke-width="2.5" stroke-dasharray="5 4" opacity=".85"/>'
    s+='<rect x="108" y="262" width="22" height="26" rx="3" fill="none" stroke="#3a1c10" stroke-width="3" opacity=".7"/>'
    s+='<path d="M110 214 Q152 206 192 214 L172 250 Q152 276 152 276 Q130 262 128 250 Z" fill="#dc4a3a" stroke="%s" stroke-width="4" stroke-linejoin="round"/>'%OL
    s+='<path d="M124 224 Q140 236 152 270 M170 224 Q162 240 156 266" stroke="#a82e24" stroke-width="3" fill="none"/><circle cx="140" cy="236" r="2.5" fill="#fff" opacity=".8"/><circle cx="160" cy="244" r="2.5" fill="#fff" opacity=".8"/><circle cx="148" cy="256" r="2.5" fill="#fff" opacity=".8"/>'
    s+='<polygon points="%s" fill="url(#gold)" stroke="%s" stroke-width="3.5" stroke-linejoin="round"/>'%(star(182,268,17,7.5),OL)
    s+='<rect x="96" y="296" width="108" height="20" rx="5" fill="#4a2a1a" stroke="%s" stroke-width="4"/>'%OL
    s+='<path d="M104 306 H134 M170 306 H196" stroke="#8a5a3a" stroke-width="2" stroke-dasharray="4 4"/>'
    s+='<rect x="136" y="291" width="30" height="30" rx="6" fill="url(#gold)" stroke="%s" stroke-width="4"/><rect x="145" y="300" width="12" height="12" rx="2" fill="#7a4a10"/><path d="M142 296 H156" stroke="#fff6c0" stroke-width="2.5" stroke-linecap="round"/>'%OL
    s+='<circle cx="112" cy="298" r="13" fill="url(#skin)" stroke="%s" stroke-width="4"/>'%OL
    # near arm
    ap=' '.join(('M' if i==0 else 'L')+'%d %d'%p for i,p in enumerate(arm))
    s+='<path d="%s" stroke="%s" stroke-width="42" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="%s" stroke="url(#shirt)" stroke-width="34" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'%(ap,OL,ap)
    hx,hy=hand
    s+='<path d="%s" stroke="#bcdcf8" stroke-width="3" fill="none" stroke-linecap="round" opacity=".55" transform="translate(-9,-9)"/>'%ap
    s+='<rect x="%d" y="%d" width="26" height="13" rx="5" fill="#3a2214" stroke="%s" stroke-width="3" transform="rotate(-30 %d %d)"/>'%(hx-7,hy-19,OL,hx,hy)
    s+='<circle cx="%d" cy="%d" r="15" fill="url(#skin)" stroke="%s" stroke-width="4"/><path d="M%d %d H%d" stroke="#a46a48" stroke-width="2" opacity=".7"/>'%(hx,hy,OL,hx-8,hy+2,hx+8)
    # head
    s+='<g transform="translate(0,24)">'
    s+='<circle cx="98" cy="118" r="17" fill="#2b2024" stroke="%s" stroke-width="4"/><circle cx="92" cy="144" r="16" fill="#2b2024" stroke="%s" stroke-width="4"/><circle cx="98" cy="168" r="13" fill="#2b2024" stroke="%s" stroke-width="4"/>'%(OL,OL,OL)
    s+='<path d="M90 124 Q96 112 106 116 M84 148 Q90 138 100 142" stroke="#6a5668" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>'
    s+='<ellipse cx="156" cy="148" rx="60" ry="64" fill="url(#skin)" stroke="%s" stroke-width="4"/>'%OL
    s+='<path d="M196 100 Q214 148 196 196" stroke="#a46444" stroke-width="10" fill="none" opacity=".25" stroke-linecap="round"/>'
    s+='<ellipse cx="102" cy="156" rx="9" ry="14" fill="#c98860" stroke="%s" stroke-width="3.5"/><path d="M102 150 Q106 156 102 162" stroke="#a46444" stroke-width="2.5" fill="none"/>'%OL
    s+='<circle cx="102" cy="180" r="9" fill="none" stroke="%s" stroke-width="6"/><circle cx="102" cy="180" r="9" fill="none" stroke="#dfe6f2" stroke-width="3.5"/>'%OL
    s+='<path d="M106 172 Q104 214 140 232 Q172 242 196 222 Q214 204 214 168 Q200 186 176 186 Q150 184 130 184 Q116 184 106 172 Z" fill="#2c1f1b" stroke="%s" stroke-width="4" stroke-linejoin="round"/>'%OL
    s+='<path d="M116 196 Q128 216 150 224 M150 214 Q170 224 190 208 M126 190 Q136 204 150 208 M180 196 Q198 192 206 180" stroke="#5a463e" stroke-width="3" fill="none" stroke-linecap="round" opacity=".85"/>'
    s+='<path d="M140 180 Q166 168 208 176 Q192 196 166 194 Q150 192 140 180 Z" fill="#2c1f1b" stroke="%s" stroke-width="3" stroke-linejoin="round"/><path d="M152 182 Q170 174 196 178" stroke="#5a463e" stroke-width="2.5" fill="none" stroke-linecap="round"/>'%OL
    s+='<path d="M166 207 Q180 216 195 205" stroke="#c0706a" stroke-width="5.5" fill="none" stroke-linecap="round"/><path d="M172 208 Q181 212 190 207" stroke="#fff" stroke-width="2" fill="none" opacity=".8"/>'
    s+='<path d="M190 146 Q203 166 188 172" stroke="#a06440" stroke-width="3.5" fill="none" stroke-linecap="round"/>'
    s+='<ellipse cx="180" cy="140" rx="19" ry="19" fill="#d8eefa" fill-opacity=".55" stroke="#1c1c28" stroke-width="5"/><ellipse cx="128" cy="142" rx="16" ry="18" fill="#d8eefa" fill-opacity=".55" stroke="#1c1c28" stroke-width="5"/>'
    s+='<path d="M146 139 Q154 131 162 138 M112 138 L100 136" stroke="#1c1c28" stroke-width="4.5" fill="none" stroke-linecap="round"/>'
    s+='<ellipse cx="183" cy="143" rx="6.5" ry="8" fill="#20161a"/><ellipse cx="131" cy="145" rx="6" ry="7.5" fill="#20161a"/><circle cx="185.5" cy="139.5" r="2.6" fill="#fff"/><circle cx="133.5" cy="141.5" r="2.4" fill="#fff"/>'
    s+='<path d="M170 128 Q178 124 188 128" stroke="#fff" stroke-width="2.5" fill="none" opacity=".7" stroke-linecap="round"/>'
    s+='<path d="M163 112 Q180 100 198 110 M110 116 Q128 104 144 112" stroke="#241a1c" stroke-width="7" fill="none" stroke-linecap="round"/>'
    s+='<ellipse cx="204" cy="170" rx="10" ry="6" fill="#e07a6a" opacity=".35"/>'
    s+='</g>'
    # hat
    s+='<g transform="translate(0,-20)">'
    s+='<path d="M90 104 Q84 36 112 24 Q134 30 150 50 Q166 30 190 24 Q218 36 214 104 Z" fill="url(#hat)" stroke="%s" stroke-width="4.5" stroke-linejoin="round"/>'%OL
    s+='<path d="M104 62 Q106 40 120 34 M170 44 Q184 34 196 38" stroke="#f8d898" stroke-width="5" fill="none" stroke-linecap="round" opacity=".8"/><path d="M150 52 V90" stroke="#8a5c34" stroke-width="3" opacity=".55"/>'
    s+='<path d="M90 104 Q152 122 214 104 L214 82 Q152 98 90 82 Z" fill="#3a2418" stroke="%s" stroke-width="4" stroke-linejoin="round"/><path d="M96 94 Q152 110 208 94" stroke="#6a4a38" stroke-width="2.5" fill="none" stroke-dasharray="6 5"/>'%OL
    s+='<polygon points="%s" fill="url(#gold)" stroke="%s" stroke-width="3" stroke-linejoin="round"/>'%(star(190,98,14,6),OL)
    s+='<path d="M24 98 Q40 128 96 126 Q152 138 208 126 Q264 128 286 90 Q300 124 268 142 Q212 154 152 152 Q92 154 38 140 Q8 124 24 98 Z" fill="url(#hat)" stroke="%s" stroke-width="4.5" stroke-linejoin="round"/>'%OL
    s+='<path d="M44 122 Q96 138 150 138 Q208 138 262 124" stroke="#f8d898" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/><path d="M60 146 Q150 160 250 140" stroke="#6a4426" stroke-width="3" fill="none" opacity=".5"/>'
    s+='</g><ellipse cx="156" cy="150" rx="62" ry="10" fill="url(#shade)" opacity=".5"/>'
    s+='</g></svg>'
    return s
IDLE=[dict(bob=0,tap=0,sw=0),dict(bob=-3,tap=16,sw=10),dict(bob=-3,tap=6,sw=-4),dict(bob=0,tap=0,sw=-10)]
def idle(k):
    d=IDLE[k]
    return dict(bob=d['bob'],tap=d['tap'],arm=[(204,244),(226,290),(240,322)],hand=(244,326),
        whip='M246 326 C262 352 %d 384 %d %d'%(276+d['sw'],316+d['sw']*2,376-abs(d['sw'])//2))
ATK=[
 dict(lean=-12,bob=3,arm=[(204,244),(240,200),(228,152)],hand=(228,148),whip='M228 148 C200 70 100 20 40 80'),
 dict(lean=6,bob=-3,arm=[(204,244),(250,192),(268,132)],hand=(270,128),whip='M270 128 C300 50 380 40 424 104'),
 dict(lean=20,bob=2,arm=[(204,244),(248,266),(290,262)],hand=(292,262),whip='M300 262 C340 232 380 292 420 262 S440 250 446 258',spark=(448,258)),
 dict(lean=8,bob=0,arm=[(204,244),(236,276),(256,300)],hand=(258,304),whip='M258 304 C300 296 330 330 310 372')]
def frames(): return [jack(idle(k)) for k in range(4)],[jack(a) for a in ATK]
