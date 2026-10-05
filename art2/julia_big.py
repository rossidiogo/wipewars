import re
O='#1a0e12'
DEFS='''<defs>
<linearGradient id="sk" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b88a5c"/><stop offset=".35" stop-color="#d9ae7c"/><stop offset="1" stop-color="#e8c490"/></linearGradient>
<linearGradient id="sk2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a87a52"/><stop offset="1" stop-color="#d0a470"/></linearGradient>
<linearGradient id="hr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6a3c34"/><stop offset=".5" stop-color="#3c2024"/><stop offset="1" stop-color="#1c0e18"/></linearGradient>
<linearGradient id="cd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6a98e8"/><stop offset=".55" stop-color="#4a78d8"/><stop offset="1" stop-color="#2c4a9a"/></linearGradient>
<linearGradient id="tp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff4d8"/><stop offset="1" stop-color="#b8a898"/></linearGradient>
</defs>'''
def wave_lock(x,y,w,l,flip=1,fill='url(#hr)'):
    # long wavy lock hanging from (x,y), width w, length l
    d='M%d %d C%d %d %d %d %d %d C%d %d %d %d %d %d C%d %d %d %d %d %d L%d %d C%d %d %d %d %d %d C%d %d %d %d %d %d Z'%(
      x,y, x-flip*w*.9,y+l*.18, x+flip*w*.3,y+l*.35, x-flip*w*.2,y+l*.55,
      x-flip*w*.9,y+l*.72, x+flip*w*.2,y+l*.85, x-flip*w*.1,y+l,
      x+flip*w*.5,y+l*1.0, x+flip*w*.9,y+l*.9, x+flip*w*.7,y+l*.75,
      x+flip*w*.7,y+l*.75,
      x+flip*w*1.4,y+l*.55, x+flip*w*.5,y+l*.35, x+flip*w*1.0,y+l*.18,
      x+flip*w*1.2,y+l*.08, x+flip*w*.8,y+l*.02, x,y)
    return d
def julia(mouth=0,blink=0,pose=0):
    s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 416">'+DEFS
    # back hair
    s+='<path d="M72 400 C44 330 52 230 66 170 C70 80 112 36 160 34 C208 36 250 80 254 170 C268 230 276 330 248 400 Z" fill="url(#hr)" stroke="%s" stroke-width="4"/>'%O
    s+='<path d="M70 210 Q48 250 70 286 Q50 320 72 352 Q58 376 74 394 M250 210 Q272 250 250 286 Q270 320 248 352 Q262 376 246 394" stroke="#6a3c34" stroke-width="5" fill="none" stroke-linecap="round"/>'
    # body: cardigan torso
    s+='<path d="M40 416 C44 330 70 262 112 244 L208 244 C250 262 276 330 280 416 Z" fill="url(#cd)" stroke="%s" stroke-width="4"/>'%O
    # cream top
    s+='<path d="M122 244 L160 330 L198 244 C184 252 172 256 160 256 C148 256 136 252 122 244 Z" fill="url(#tp)" stroke="%s" stroke-width="3" stroke-linejoin="round"/>'%O
    s+='<path d="M140 270 Q160 296 180 270" stroke="#b8a898" stroke-width="3" fill="none"/>'
    # cardigan lapels + folds + buttons
    s+='<path d="M112 244 L132 252 L160 336 L160 416 L110 416 C100 350 100 290 112 244 Z" fill="#4a78d8" opacity=".0"/>'
    s+='<path d="M160 336 L160 416" stroke="%s" stroke-width="3"/>'%O
    s+='<path d="M96 300 Q100 350 92 410 M224 300 Q220 350 228 410 M72 330 Q80 370 76 410 M248 330 Q240 370 244 410" stroke="#2c4a9a" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/>'
    s+='<path d="M120 270 Q108 300 112 340" stroke="#8ab4ff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/>'
    for y in (352,382): s+='<circle cx="160" cy="%d" r="5" fill="#fff4d8" stroke="%s" stroke-width="2.5"/>'%(y,O)
    # neck
    s+='<path d="M138 196 L138 244 Q160 262 182 244 L182 196 Z" fill="url(#sk2)" stroke="%s" stroke-width="4"/>'%O
    s+='<path d="M138 224 Q160 240 182 224 L182 214 Q160 230 138 214 Z" fill="#8a5a3c" opacity=".5"/>'
    # necklace
    s+='<path d="M132 238 Q160 280 188 238" stroke="#f0d060" stroke-width="3" fill="none"/><path d="M160 276 l-5 6 l5 7 l5 -7 z" fill="#fff0a0" stroke="#b8902c" stroke-width="1.8"/>'
    # face
    s+='<path d="M106 122 C106 80 130 62 160 62 C190 62 214 80 214 122 C214 168 192 198 160 202 C128 198 106 168 106 122 Z" fill="url(#sk)" stroke="%s" stroke-width="4"/>'%O
    # ears hidden by hair; cheeks
    s+='<ellipse cx="128" cy="160" rx="14" ry="8" fill="#e07068" opacity=".35"/><ellipse cx="192" cy="160" rx="14" ry="8" fill="#e07068" opacity=".35"/>'
    # front hair top with center part
    s+='<path d="M102 150 C86 90 112 42 160 40 C208 42 234 90 218 150 C216 112 200 78 166 70 L160 62 L154 70 C120 78 104 112 102 150 Z" fill="url(#hr)" stroke="%s" stroke-width="4" stroke-linejoin="round"/>'%O
    s+='<path d="M160 42 L160 62" stroke="#1c0e18" stroke-width="4"/>'
    s+='<path d="M154 70 C128 76 112 98 108 124 M166 70 C192 76 208 98 212 124 M144 56 C120 66 104 90 100 116 M176 56 C200 66 216 90 220 116" stroke="#6a3c34" stroke-width="3.5" fill="none" stroke-linecap="round"/>'
    # side locks falling over shoulders (outside the face)
    L='M110 112 C90 150 82 190 98 226 C112 258 80 280 88 318 C94 344 76 366 92 392 C104 410 126 400 128 380 C124 354 142 336 132 306 C124 280 140 258 130 232 C122 206 126 176 118 150 Z'
    def mir(p): return re.sub(r'(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)',lambda m:'%g %s'%(320-float(m.group(1)),m.group(2)),p)
    for pth in (L,mir(L)):
        s+='<path d="%s" fill="url(#hr)" stroke="%s" stroke-width="4" stroke-linejoin="round"/>'%(pth,O)
    s+='<path d="M104 170 Q96 206 108 236 Q120 262 100 296 Q92 330 104 368 M216 170 Q224 206 212 236 Q200 262 220 296 Q228 330 216 368" stroke="#6a3c34" stroke-width="4" fill="none" stroke-linecap="round"/>'
    # brows
    s+='<path d="M120 108 Q138 98 156 106 M164 106 Q182 98 200 108" stroke="#2a1218" stroke-width="6" fill="none" stroke-linecap="round"/>'
    # eyes
    for cx in (134,186):
        if blink: s+='<path d="M%d 126 Q%d 134 %d 126" stroke="%s" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M%d 127 l-2 5 M%d 128 l0 5 M%d 127 l2 5" stroke="%s" stroke-width="2"/>'%(cx-13,cx,cx+13,O,cx-8,cx,cx+8,O)
        else:
            s+='<ellipse cx="%d" cy="126" rx="13" ry="11" fill="#fff8f0" stroke="%s" stroke-width="2"/><circle cx="%d" cy="128" r="8.5" fill="#6a4028"/><circle cx="%d" cy="128" r="5.4" fill="#2a1a10"/><circle cx="%d" cy="128" r="2.8" fill="#0c0606"/><circle cx="%d" cy="123" r="2.6" fill="#fff"/><circle cx="%d" cy="132" r="1.3" fill="#fff" opacity=".7"/>'%(cx,O,cx,cx,cx,cx+2.5,cx-2)
            s+='<path d="M%d 118 Q%d 112 %d 118" stroke="%s" stroke-width="3" fill="none" stroke-linecap="round"/>'%(cx-13,cx,cx+13,O)
    # glasses
    for cx in (134,186):
        s+='<rect x="%d" y="107" width="44" height="38" rx="14" fill="#c8e8ff" fill-opacity=".14" stroke="#120a0e" stroke-width="7"/>'%(cx-22)
        s+='<path d="M%d 112 L%d 120" stroke="#fff" stroke-width="3" opacity=".7" stroke-linecap="round"/>'%(cx-14,cx-9)
    s+='<path d="M156 126 Q160 120 164 126" stroke="#120a0e" stroke-width="6"/><path d="M156 124 Q160 118 164 124" stroke="#120a0e" stroke-width="5" fill="none"/><path d="M112 122 L104 118 M208 122 L216 118" stroke="#120a0e" stroke-width="6" stroke-linecap="round"/>'
    # nose, septum
    s+='<path d="M155 136 Q150 158 158 164 Q160 166 162 164 Q170 158 165 136" fill="#c8946a" stroke="#8a5a3c" stroke-width="2.6" stroke-linejoin="round"/><ellipse cx="154" cy="163" rx="3" ry="2" fill="#6a3c28"/><ellipse cx="166" cy="163" rx="3" ry="2" fill="#6a3c28"/>'
    s+='<path d="M153 168 Q160 182 167 168" stroke="#e0e0f0" stroke-width="3.4" fill="none" stroke-linecap="round"/><circle cx="153" cy="168" r="1.6" fill="#fff"/><circle cx="167" cy="168" r="1.6" fill="#fff"/>'
    # mouth
    if mouth: s+='<path d="M140 184 Q160 214 180 184 Q160 190 140 184 Z" fill="#7a2030" stroke="%s" stroke-width="3" stroke-linejoin="round"/><path d="M146 198 Q160 208 174 198 Q160 203 146 198 Z" fill="#e8707c"/><path d="M144 186 Q160 192 176 186 L174 190 Q160 195 146 190 Z" fill="#fff8f0"/>'%O
    else: s+='<path d="M142 186 Q160 202 178 186 Q160 192 142 186 Z" fill="#d4606c" stroke="%s" stroke-width="3" stroke-linejoin="round"/><path d="M148 190 Q160 196 172 190" stroke="#f08890" stroke-width="2" fill="none"/>'%O
    # hands
    if pose==0 and 0:
        # clasped hands in front
        s+='<path d="M124 386 C120 360 140 346 160 348 C180 346 200 360 196 386 C190 410 130 410 124 386 Z" fill="url(#sk2)" stroke="%s" stroke-width="4"/>'%O
        s+='<path d="M136 366 Q160 372 184 366 M142 378 Q160 384 178 378" stroke="#8a5a3c" stroke-width="3" fill="none"/>'
    elif pose:
        # waving right hand (viewer's right), open palm up
        s+='<path d="M252 330 C262 290 266 262 262 236 L286 232 C292 262 288 300 280 336 Z" fill="url(#cd)" stroke="%s" stroke-width="4"/>'%O
        s+='<path d="M258 238 C250 210 248 186 256 172 Q262 164 268 172 L270 190 L274 160 Q278 150 284 158 L284 188 L290 164 Q296 156 302 164 L298 200 L304 184 Q310 178 314 186 Q312 214 296 244 Z" fill="url(#sk2)" stroke="%s" stroke-width="3.5" stroke-linejoin="round"/>'%O
        s+='<path d="M270 200 Q282 214 296 204" stroke="#8a5a3c" stroke-width="2.5" fill="none"/>'
        s+='<path d="M228 168 q-10 -8 -10 -20 M236 150 q-8 -10 -6 -22" stroke="#ffe08a" stroke-width="4" fill="none" stroke-linecap="round" opacity=".9"/>'
    return s+'</svg>'
def frames(): return [julia(0,0,0),julia(1,0,0),julia(0,1,0),julia(1,0,1)]
