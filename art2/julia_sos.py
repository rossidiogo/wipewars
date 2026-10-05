import sys
sys.path.insert(0,'/mnt/user-data/working/src20/art2')
O='#1a0e12'
def bust(mouth=0,blink=0,wave=0):
    s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">'
    # back hair (long wavy)
    s+='<path d="M34 190 C18 150 22 100 34 70 C40 30 70 12 96 12 C124 12 152 30 158 70 C170 100 174 150 158 190 Z" fill="#3c2024" stroke="%s" stroke-width="3"/>'%O
    s+='<path d="M30 120 Q22 140 34 156 Q26 168 36 184 M162 120 Q170 140 158 156 Q166 168 156 184" stroke="#6a3c34" stroke-width="4" fill="none" stroke-linecap="round"/>'
    # shoulders / cardigan
    s+='<path d="M20 192 C24 160 52 150 70 148 L122 148 C140 150 168 160 172 192 Z" fill="#4a78d8" stroke="%s" stroke-width="3"/>'%O
    s+='<path d="M70 148 L96 176 L122 148 L112 146 L96 162 L80 146 Z" fill="#fff4e0" stroke="%s" stroke-width="2.5" stroke-linejoin="round"/>'%O
    s+='<path d="M96 176 L96 192" stroke="%s" stroke-width="2.5"/><circle cx="96" cy="184" r="2.5" fill="#fcd0a0"/>'%O
    # neck
    s+='<path d="M80 130 L80 150 Q96 164 112 150 L112 130 Z" fill="#c8946a" stroke="%s" stroke-width="3"/>'%O
    # necklace
    s+='<path d="M80 146 Q96 168 112 146" stroke="#f0d060" stroke-width="2.5" fill="none"/><circle cx="96" cy="162" r="2.6" fill="#fff0a0"/>'
    # face (light olive)
    s+='<path d="M52 82 C52 50 70 36 96 36 C122 36 140 50 140 82 C140 118 122 138 96 138 C70 138 52 118 52 82 Z" fill="#dcae80" stroke="%s" stroke-width="3"/>'%O
    # hair top w/ center part and waves
    s+='<path d="M48 92 C40 50 62 24 96 22 C130 24 152 50 144 92 C142 70 130 52 100 46 L96 40 L92 46 C62 52 50 70 48 92 Z" fill="#3c2024" stroke="%s" stroke-width="3" stroke-linejoin="round"/>'%O
    s+='<path d="M96 40 C80 44 62 54 56 72 M96 40 C112 44 130 54 136 72" stroke="#6a3c34" stroke-width="3" fill="none" stroke-linecap="round"/>'
    s+='<path d="M96 24 L96 40" stroke="#1c0e18" stroke-width="3"/>'
    # cheeks
    s+='<ellipse cx="68" cy="106" rx="8" ry="5" fill="#e07068" opacity=".35"/><ellipse cx="124" cy="106" rx="8" ry="5" fill="#e07068" opacity=".35"/>'
    # eyes
    for cx in (76,116):
        if blink: s+='<path d="M%d 90 Q%d 95 %d 90" stroke="%s" stroke-width="3" fill="none" stroke-linecap="round"/>'%(cx-8,cx,cx+8,O)
        else: s+='<ellipse cx="%d" cy="90" rx="7.5" ry="7" fill="#fff8f0"/><circle cx="%d" cy="91" r="5" fill="#4a2c20"/><circle cx="%d" cy="91" r="2.4" fill="#120808"/><circle cx="%d" cy="89" r="1.6" fill="#fff"/>'%(cx,cx,cx,cx+1.5)
    # brows
    s+='<path d="M64 76 Q76 70 88 75 M104 75 Q116 70 128 76" stroke="#2a1218" stroke-width="4" fill="none" stroke-linecap="round"/>'
    # glasses thick black
    s+='<rect x="62" y="78" width="28" height="23" rx="9" fill="#ffffff" fill-opacity=".12" stroke="#120a0e" stroke-width="5"/><rect x="102" y="78" width="28" height="23" rx="9" fill="#ffffff" fill-opacity=".12" stroke="#120a0e" stroke-width="5"/><path d="M90 87 Q96 83 102 87" stroke="#120a0e" stroke-width="4" fill="none"/><path d="M62 86 L52 84 M130 86 L140 84" stroke="#120a0e" stroke-width="4" stroke-linecap="round"/>'
    # nose + septum ring
    s+='<path d="M94 98 Q91 108 96 110 Q101 108 98 98" fill="#c08a60" stroke="#8a5a3c" stroke-width="2" stroke-linejoin="round"/>'
    s+='<path d="M91 112 Q96 120 101 112" stroke="#d8d8e8" stroke-width="2.6" fill="none" stroke-linecap="round"/>'
    # mouth
    if mouth: s+='<path d="M84 121 Q96 136 108 121 Q96 124 84 121 Z" fill="#8a2c3c" stroke="%s" stroke-width="2.4" stroke-linejoin="round"/><path d="M88 125 Q96 130 104 125" stroke="#e8707c" stroke-width="2.4" fill="none"/>'%O
    else: s+='<path d="M86 122 Q96 130 106 122" stroke="%s" stroke-width="3" fill="#d4707c" stroke-linejoin="round" stroke-linecap="round"/>'%O
    if wave:
        s+='<path d="M150 150 L150 112 Q150 104 158 104 Q166 104 166 112 L166 150 Z" fill="#c8946a" stroke="%s" stroke-width="3"/><path d="M142 150 C146 160 170 160 174 150 L172 190 L144 190 Z" fill="#4a78d8" stroke="%s" stroke-width="3"/>'%(O,O)
    return s+'</svg>'
def frames(): return [bust(0,0),bust(1,0),bust(0,1),bust(1,0,1)]
