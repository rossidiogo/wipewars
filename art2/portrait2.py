import cv2,numpy as np,io,asyncio
from PIL import Image,ImageDraw,ImageFilter,ImageEnhance
src='/root/.claude/uploads/82bc145f-d89e-5b9b-8331-f30e6464ff87/9a344f5d-image.jpg'
im=Image.open(src).convert('RGB').resize((603,599),Image.LANCZOS)
PADY=150
canvas=Image.new('RGB',(603,599+PADY),(40,60,70));canvas.paste(im,(0,PADY))
poly=[(296,80),(325,25),(380,3),(440,0),(505,45),(548,115),(603,95),(603,200),(586,214),(584,300),(584,380),(578,440),(556,480),(516,500),(497,560),(493,605),(603,610),(603,599),(76,599),(78,488),(180,458),(262,436),(306,408),(290,330),(270,272),(244,214),(244,198),(268,176),(282,150)]
poly=[(x,y+PADY) for x,y in poly]
mk=Image.new('L',canvas.size,0);ImageDraw.Draw(mk).polygon(poly,fill=255)
# hat svg
HAT='''<svg xmlns="http://www.w3.org/2000/svg" width="603" height="749" viewBox="0 0 603 749"><defs>
<linearGradient id="h" x1="0" y1="0" x2="0.35" y2="1"><stop offset="0" stop-color="#d2a066"/><stop offset=".55" stop-color="#9a6a3e"/><stop offset="1" stop-color="#5e3c28"/></linearGradient>
<linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a3024"/><stop offset="1" stop-color="#22140e"/></linearGradient>
<linearGradient id="br" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b8844e"/><stop offset=".6" stop-color="#7a4e2e"/><stop offset="1" stop-color="#3e2418"/></linearGradient>
<linearGradient id="coat" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4e8aa4"/><stop offset=".6" stop-color="#2e5a78"/><stop offset="1" stop-color="#1c3250"/></linearGradient>
<linearGradient id="vest" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a06a40"/><stop offset="1" stop-color="#4c2c20"/></linearGradient>
<radialGradient id="sh" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".7"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>
<g transform="rotate(-5 405 190)">
<ellipse cx="405" cy="206" rx="200" ry="30" fill="url(#sh)"/>
<path d="M110 176 Q130 150 405 148 Q680 150 700 176 Q690 200 640 206 L170 206 Q120 200 110 176 Z" fill="url(#br)"/>
<path d="M276 170 C268 70 304 24 346 30 C374 34 388 52 405 58 C424 50 440 30 470 28 C510 26 540 70 534 170 Z" fill="url(#h)"/>
<path d="M302 76 C312 48 332 40 350 46 M456 52 C474 42 500 42 516 62" stroke="#f0cc98" stroke-width="7" fill="none" stroke-linecap="round" opacity=".5"/>
<path d="M274 172 C300 186 350 192 405 192 C460 192 510 186 536 172 L538 128 C510 142 460 148 405 148 C350 148 300 142 276 128 Z" fill="url(#b)"/>
<path d="M286 150 C340 164 470 164 526 150" stroke="#8a6a52" stroke-width="3" fill="none" stroke-dasharray="9 7" opacity=".7"/>
<rect x="470" y="140" width="30" height="36" rx="5" fill="#d8b050" stroke="#6a4818" stroke-width="3"/><rect x="478" y="149" width="14" height="18" rx="3" fill="#3a2a1a"/>
<path d="M110 176 Q405 270 700 176 Q690 214 620 232 Q405 262 190 232 Q120 214 110 176 Z" fill="url(#br)"/>
<path d="M170 206 Q405 256 640 206" stroke="#e0b880" stroke-width="5" fill="none" opacity=".45" stroke-linecap="round"/>
</g>
<g>
<path d="M120 600 Q180 560 290 590 L300 700 L260 749 L90 749 Z" fill="url(#coat)"/>
<path d="M560 590 Q640 560 700 600 L740 749 L480 749 L470 690 Z" fill="url(#coat)"/>
<path d="M290 590 L330 600 L350 749 L270 749 Z" fill="url(#vest)"/>
<path d="M470 600 L500 588 L520 749 L440 749 Z" fill="url(#vest)"/>
<path d="M330 600 L470 600 L420 690 L400 720 Z" fill="#d84a3c"/>
<path d="M350 612 Q390 640 400 700" stroke="#8a2a2c" stroke-width="4" fill="none"/>
<polygon points="470,670 478,690 500,692 483,705 489,727 470,715 451,727 457,705 440,692 462,690" fill="#f0bc3a" stroke="#6a4818" stroke-width="3"/>
</g></svg>'''
async def rh():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':603,'height':749})
        await pg.set_content('<body style="margin:0;background:transparent">'+HAT)
        d=await pg.screenshot(omit_background=True);await b.close();return Image.open(io.BytesIO(d)).convert('RGBA')
hat=asyncio.run(rh())
# hat shifted: place so brim sits on brow
hat_s=Image.new('RGBA',canvas.size,(0,0,0,0));hat_s.alpha_composite(hat,(0,38))
rgba=canvas.convert('RGBA');rgba.putalpha(mk)
# union mask with hat
hm=hat_s.getchannel('A');full=Image.new('RGBA',canvas.size,(0,0,0,0));full.alpha_composite(rgba);full.alpha_composite(hat_s)
full.save('/mnt/user-data/working/src20/art2/p_full.png')
bg=Image.new('RGBA',full.size,(30,40,60,255));bg.alpha_composite(full);bg.convert('RGB').save('/mnt/user-data/working/src20/shots/p_full.png')
