import sys
sys.path.insert(0,'/mnt/user-data/working/src20/art2')
from jack_sos import sh,limb,D,star
DEFS='''<defs>
<linearGradient id="skin" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stop-color="#fcd0a0"/><stop offset=".55" stop-color="#e8a47a"/><stop offset="1" stop-color="#c07868"/></linearGradient>
<linearGradient id="robe" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7a64c4"/><stop offset=".5" stop-color="#4c3a92"/><stop offset="1" stop-color="#241848"/></linearGradient>
<linearGradient id="robe2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3e2e84"/><stop offset="1" stop-color="#1c1440"/></linearGradient>
<linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff0a0"/><stop offset=".5" stop-color="#f0bc3a"/><stop offset="1" stop-color="#b87a14"/></linearGradient>
<linearGradient id="hair" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6a4640"/><stop offset=".5" stop-color="#3a2422"/><stop offset="1" stop-color="#1c1014"/></linearGradient>
<linearGradient id="beard" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5a3c36"/><stop offset=".5" stop-color="#3a2422"/><stop offset="1" stop-color="#1e1216"/></linearGradient>
<linearGradient id="wood" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b8844a"/><stop offset="1" stop-color="#5a3a3a"/></linearGradient>
<linearGradient id="shoe" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#b4b4d0"/></linearGradient>
<radialGradient id="glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#d8f8ff" stop-opacity=".95"/><stop offset=".5" stop-color="#5ad0e8" stop-opacity=".5"/><stop offset="1" stop-color="#5ad0e8" stop-opacity="0"/></radialGradient>
<radialGradient id="shade" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#2a1030" stop-opacity=".6"/><stop offset="1" stop-color="#2a1030" stop-opacity="0"/></radialGradient>
</defs>'''
def pts(a): return ' '.join(('M' if i==0 else 'L')+'%d %d'%p for i,p in enumerate(a))
def bird(x,y,s,pose='perch',wing='mid',rot=0,blink=0):
    g='<g transform="translate(%s,%s) rotate(%s) scale(%s)">'%(x,y,rot,s)
    if pose=='perch':
        # origin = feet
        g+=sh('M-6 -30 L-30 8 L-22 12 L-2 -12 Z','#7e7e94',2.5)  # tail
        g+=sh('M-18 -38 C-22 -12 -10 4 6 4 C20 4 24 -16 18 -40 C14 -56 -12 -56 -18 -38 Z','#a4a4b8',2.5)  # body
        g+=sh('M-14 -34 C-18 -14 -6 -2 8 -4 C-2 -16 -2 -28 -2 -44 Z','#80809a',2)  # wing
        g+='<path d="M-10 -26 L2 -20 L0 -12 L-10 -18 Z" fill="#f4f4ff"/>'
        g+=sh('M-8 -58 Q-18 -78 -34 -78 Q-22 -70 -22 -62 Q-30 -62 -36 -56 Q-18 -56 -8 -50 Z','#f8d83a',2)  # crest
        g+=sh('M-10 -52 C-12 -72 4 -80 16 -74 C28 -68 28 -48 14 -42 C4 -40 -8 -42 -10 -52 Z','#f8d83a',2.5)  # head
        g+='<circle cx="14" cy="-56" r="6.5" fill="#f07828" stroke="#a8401c" stroke-width="1.5"/>'
        g+='<circle cx="17" cy="-64" r="3.4" fill="#1a1020"/><circle cx="18" cy="-65" r="1.1" fill="#fff"/>' if not blink else '<path d="M14 -64 H20" stroke="#1a1020" stroke-width="2"/>'
        g+=sh('M24 -62 L36 -56 L26 -50 Z','#9a8a8a',2)
        g+='<path d="M-3 4 V10 M5 4 V10" stroke="#a8803a" stroke-width="3"/>'
    else:
        g+=sh('M-22 0 L-76 14 L-72 20 L-20 10 Z','#7e7e94',2.5)
        wings={'up':'M-6 -8 C-16 -26 -22 -40 -18 -50 C-6 -44 8 -30 12 -10 Z','mid':'M-4 -6 C-26 -16 -50 -22 -68 -16 C-54 0 -26 6 10 4 Z','down':'M-6 2 C-20 22 -32 44 -26 62 C-8 52 8 30 14 4 Z'}
        g+=sh(wings[wing],'#70708a',2.5)  # far wing
        g+=sh('M-26 4 C-26 -18 -4 -22 18 -18 C34 -14 36 8 18 16 C0 22 -26 20 -26 4 Z','#a4a4b8',2.5)
        g+=sh('M20 -14 C18 -30 32 -34 42 -26 C50 -18 46 -2 34 0 C26 0 20 -4 20 -14 Z','#f8d83a',2.5)
        g+=sh('M24 -26 Q16 -42 2 -46 Q12 -38 10 -30 Q4 -32 -2 -28 Q14 -26 22 -20 Z','#f8d83a',2)
        g+='<circle cx="36" cy="-12" r="5.5" fill="#f07828" stroke="#a8401c" stroke-width="1.5"/><circle cx="41" cy="-20" r="3" fill="#1a1020"/><circle cx="42" cy="-21" r="1" fill="#fff"/>'
        g+=sh('M48 -20 L58 -14 L48 -8 Z','#9a8a8a',2)
        wn={'up':'M-2 -8 C-12 -28 -18 -44 -12 -56 C0 -48 12 -32 16 -8 Z','mid':'M-2 -4 C-24 -14 -50 -20 -70 -14 C-56 4 -26 10 12 6 Z','down':'M-4 4 C-18 24 -30 48 -24 66 C-6 56 10 32 16 6 Z'}[wing]
        g+=sh(wn,'#8a8aa4',2.5)
        wp={'up':'M-8 -36 L-12 -52 L-2 -42 Z','mid':'M-34 -14 L-64 -14 L-40 -4 Z','down':'M-12 38 L-24 58 L-6 46 Z'}[wing]
        g+='<path d="%s" fill="#f4f4ff"/>'%wp
    return g+'</g>'
def sparkles(L):
    return ''.join('<polygon points="%s" fill="%s" stroke="#2a1a24" stroke-width="1.6" stroke-linejoin="round"/>'%(star(x,y,r,r*0.38,4,0),c) for x,y,r,c in L)
def sneaker(x,lift=0):
    s='<g transform="translate(%d,%d)">'%(x,-lift)
    s+=sh('M-18 372 C-18 364 -8 360 2 362 L20 366 C32 368 40 376 40 384 C40 392 36 394 30 394 H-16 C-22 394 -22 386 -18 372 Z','url(#shoe)',3)
    s+='<path d="M-14 388 H36" stroke="#8a8aa8" stroke-width="4"/>'
    s+='<path d="M0 364 L12 374 M6 363 L18 374 M12 365 L24 376" stroke="#2a2a48" stroke-width="3.2" stroke-linecap="round"/>'
    return s+'</g>'
def daniel(P,bv='shoulder'):
    bob=P.get('bob',0);sw=P.get('sway',0);arm=P['arm'];far=P['far'];st=P['staff'];glow=P.get('glow',0)
    bd=P.get('bird');ex=P.get('extra','');blink=P.get('blink',0)
    s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -70 480 480">'+DEFS
    # ground shadow
    s+='<ellipse cx="158" cy="392" rx="76" ry="9" fill="url(#shade)"/>'
    # robe back flap
    s+=sh('M92 270 L84 372 Q%d 384 160 380 Q%d 386 230 372 L224 270 Z'%(120+sw,200+sw),'url(#robe2)')
    s+=sneaker(132,P.get('foot',0))+sneaker(176,0)
    s+='<g transform="translate(0,%s) rotate(%s 156 392)">'%(bob,P.get('lean',0))
    # hood bunched behind neck
    s+=sh('M110 196 Q110 172 156 170 Q202 172 204 196 Q204 224 160 230 Q112 224 110 196 Z','url(#robe2)')
    # far arm (viewer-left)
    fs,fe,fh=far
    s+=limb([fs,fe],38,'url(#robe)')
    s+=limb([fe,fh],24,'url(#skin)')
    s+='<path d="%s" stroke="#2c3c50" stroke-width="12" stroke-linecap="round" fill="none" stroke-dasharray="7 5" opacity=".8"/>'%pts([fe,fh])
    s+='<path d="%s" stroke="#4aa84a" stroke-width="3.5" stroke-linecap="round" fill="none" stroke-dasharray="3 5"/>'%pts([fe,fh])
    wx=(fe[0]*.35+fh[0]*.65);wy=(fe[1]*.35+fh[1]*.65)
    s+='<circle cx="%d" cy="%d" r="11" fill="#3a2a30" stroke="%s" stroke-width="2.5"/><circle cx="%d" cy="%d" r="6.5" fill="#cfcfe0" stroke="%s" stroke-width="1.5"/><path d="M%d %d l4 3" stroke="#2a1a24" stroke-width="1.6"/>'%(wx,wy,D,wx,wy,D,wx,wy)
    s+='<path d="M%d %d l8 -4" stroke="#9a5a38" stroke-width="7" stroke-linecap="round" opacity=".001"/>'%(wx,wy)
    s+='<circle cx="%d" cy="%d" r="13" fill="url(#skin)" stroke="%s" stroke-width="3"/>'%(fh[0],fh[1],D)
    # torso: wide, round belly
    s+=sh('M100 214 Q106 200 132 198 L182 198 Q208 200 214 214 L222 300 Q232 340 240 378 Q160 396 82 380 Q92 340 98 300 Z','url(#robe)',3.5)
    s+='<path d="M184 232 L214 228 L222 300 Q232 340 240 378 L200 386 Q208 330 196 300 Z" fill="#1c0e40" opacity=".5"/><path d="M104 232 L120 236 L114 300 Q110 340 96 380 L84 378 Q94 340 98 300 Z" fill="#b8a0ff" opacity=".4"/>'
    # inner lining V
    s+=sh('M138 198 L156 262 L176 198 Z','#2c88c0',2.5)+'<path d="M146 214 L156 250 L168 214" stroke="#5ad0e8" stroke-width="2" fill="none" opacity=".7"/>'
    # gold trim down front
    s+='<path d="M138 198 L152 300 L150 376 M176 198 L162 300 L164 376" stroke="#2a1a24" stroke-width="12" fill="none" stroke-linecap="round" opacity=".9"/><path d="M138 198 L152 300 L150 376 M176 198 L162 300 L164 376" stroke="url(#gold)" stroke-width="7" fill="none" stroke-linecap="round"/>'
    # shoulder mantle
    s+=sh('M88 214 Q108 192 156 198 Q204 192 226 214 Q216 236 190 232 Q156 240 124 232 Q98 236 88 214 Z','url(#robe)',3.5)
    s+='<path d="M96 220 Q122 238 156 238 Q192 238 218 220" stroke="url(#gold)" stroke-width="5" fill="none" stroke-linecap="round"/>'
    # belt + pouch + feather charm
    s+=sh('M92 296 Q158 316 224 296 L226 316 Q158 336 90 316 Z','#6a3a2c',3)
    s+=sh('M146 298 H172 V322 H146 Z','url(#gold)',3)+'<rect x="154" y="306" width="10" height="9" rx="2" fill="#7a4a14"/>'
    s+=sh('M190 312 Q204 322 200 346 Q190 334 186 316 Z','#f8d83a',2.5)+sh('M200 316 Q214 332 208 354 Q198 340 196 320 Z','#a4a4b8',2.5)
    s+=sh('M186 318 q-6 14 -4 28 q10 -10 10 -26 z','#ececf8',1.5,'#2a1a24','opacity=".0"')
    # near arm with staff
    ns,ne,nh=arm
    s+=limb([ns,ne],38,'url(#robe)')
    s+='<path d="%s" stroke="#a89ae8" stroke-width="3" stroke-linecap="round" fill="none" opacity=".45" transform="translate(-9,-8)"/>'%pts([ns,ne])
    # staff
    (bx,by),(tx,ty)=st
    s+='<path d="M%d %d L%d %d" stroke="%s" stroke-width="15" stroke-linecap="round"/><path d="M%d %d L%d %d" stroke="url(#wood)" stroke-width="9" stroke-linecap="round"/>'%(bx,by,tx,ty,D,bx,by,tx,ty)
    s+='<path d="M%d %d L%d %d" stroke="#e0b078" stroke-width="2" stroke-linecap="round" opacity=".7" transform="translate(-2,0)"/>'%(bx,by,tx,ty)
    # claw prongs + crystal at top
    s+='<g transform="translate(%d,%d)">'%(tx,ty)
    if glow: s+='<polygon points="%s" fill="#5ad0e8" opacity=".55"/><polygon points="%s" fill="#d8f8ff"/>'%(star(0,-16,22+glow*20,8,8,-90),star(0,-16,12+glow*10,5,4,-90))
    s+=sh('M-14 8 Q-20 -14 -6 -26 Q-12 -10 -6 6 Z','#8a5a3a',2.5)+sh('M14 8 Q20 -14 6 -26 Q12 -10 6 6 Z','#8a5a3a',2.5)
    s+=sh('M0 -38 L12 -18 L0 4 L-12 -18 Z','#5ad0e8',3)+'<path d="M0 -38 L-12 -18 L0 -16 Z" fill="#d8f8ff"/><path d="M0 -16 L12 -18 L0 4 Z" fill="#2c88c0"/>'
    s+='</g>'
    # forearm tattoo sleeve + hand
    s+=limb([ne,nh],24,'url(#skin)')
    s+='<path d="%s" stroke="#2c3c50" stroke-width="12" stroke-linecap="round" fill="none" stroke-dasharray="7 5" opacity=".8"/>'%pts([ne,nh])
    s+='<path d="%s" stroke="#4aa84a" stroke-width="3.5" stroke-linecap="round" fill="none" stroke-dasharray="3 5"/>'%pts([ne,nh])
    s+='<circle cx="%d" cy="%d" r="13" fill="url(#skin)" stroke="%s" stroke-width="3"/>'%(nh[0],nh[1],D)
    s+='<path d="M%d %d H%d" stroke="#a4603f" stroke-width="2.5" opacity=".6"/>'%(nh[0]-7,nh[1]-1,nh[0]+7)
    # ---- head ----
    s+='<g transform="translate(156,196) scale(1.18) translate(-156,-196)">'
    s+='<ellipse cx="104" cy="132" rx="9" ry="13" fill="#e0a07a" stroke="%s" stroke-width="3"/><circle cx="104" cy="144" r="4" fill="none" stroke="#dfe6f2" stroke-width="2"/>'%D
    s+='<ellipse cx="208" cy="132" rx="9" ry="13" fill="#e0a07a" stroke="%s" stroke-width="3"/><circle cx="208" cy="136" r="7.5" fill="#14101a" stroke="#c0cadc" stroke-width="2.5"/><circle cx="208" cy="136" r="2.5" fill="#3a3248"/>'%D
    s+=sh('M156 76 C188 76 206 100 206 128 C206 162 186 184 156 186 C126 184 106 162 106 128 C106 100 124 76 156 76 Z','url(#skin)',3.5)
    s+='<ellipse cx="124" cy="146" rx="10" ry="7" fill="#e8806a" opacity=".35"/><ellipse cx="190" cy="146" rx="10" ry="7" fill="#e8806a" opacity=".35"/>'
    # hair: voluminous top, short faded sides
    s+=sh('M104 126 C98 84 120 58 152 56 C158 54 172 52 186 60 C210 72 216 100 208 128 C206 112 202 102 194 96 C188 86 172 80 156 82 C140 80 126 88 118 98 C110 104 106 114 104 126 Z','url(#hair)',3.5)
    s+='<path d="M128 68 Q146 56 168 62 M140 80 Q158 70 178 78 M118 90 Q124 78 136 74" stroke="#7a5448" stroke-width="3" fill="none" stroke-linecap="round" opacity=".75"/>'
    s+='<path d="M190 92 Q208 118 204 150 Q196 124 184 104 Z" fill="#c07868" opacity=".7"/>'
    # beard
    s+=sh('M104 118 C102 160 114 188 136 202 C148 212 170 212 180 202 C202 188 212 160 208 118 C204 134 198 146 190 150 C182 146 170 144 156 146 C142 144 130 146 122 150 C114 146 108 134 104 118 Z','url(#beard)',3.5)
    s+='<path d="M114 156 Q118 176 134 192 Q124 180 120 164 Z M196 160 Q192 178 178 192 Q190 182 194 166 Z M138 198 Q156 206 174 198 Q156 202 138 198 Z" fill="#6a4238"/>'
    s+='<path d="M124 72 Q146 60 170 66 Q150 66 132 80 Z M178 70 Q196 80 200 100 Q190 84 176 76 Z" fill="#9a6448"/>'
    # mustache + lips
    s+=sh('M124 152 Q140 140 156 148 Q172 140 188 152 Q176 162 156 156 Q136 162 124 152 Z','#2a1a1c',2.5)
    s+='<path d="M144 164 Q156 178 168 164 Q156 170 144 164 Z" fill="#fff4e8" stroke="#2a1a24" stroke-width="1.6"/><path d="M146 170 Q156 176 166 170" stroke="#d4707c" stroke-width="3" fill="none" stroke-linecap="round"/>'
    s+='<path d="M142 163 Q156 170 170 163" stroke="#fff4e8" stroke-width="1.4" fill="none" opacity=".0"/>'
    # nose
    s+='<path d="M150 118 Q146 140 150 144 Q156 148 162 144 Q166 140 162 118" fill="#e49a74" stroke="#a4603f" stroke-width="2.4" stroke-linejoin="round"/><ellipse cx="156" cy="143" rx="9" ry="5" fill="#d4846a" opacity=".6"/>'
    # eyes
    for ex_,flip in ((136,1),(176,-1)):
        s+='<ellipse cx="%d" cy="122" rx="11" ry="7.5" fill="#fff8f0" stroke="#2a1a24" stroke-width="2.2"/>'%ex_
        s+='<circle cx="%d" cy="122.5" r="5.6" fill="#6a3a22"/><circle cx="%d" cy="122.5" r="2.8" fill="#1a0e12"/><circle cx="%d" cy="120.8" r="1.3" fill="#fff"/>'%(ex_+flip*0.5,ex_+flip*0.5,ex_+flip*0.5+1.4)
        s+='<path d="M%d 118 Q%d 113 %d 118" stroke="#1a0e12" stroke-width="3" fill="none" stroke-linecap="round"/>'%(ex_-11,ex_,ex_+11)
        s+='<path d="M%d 128 Q%d 131 %d 128" stroke="#b4705a" stroke-width="1.8" fill="none" opacity=".6"/>'%(ex_-8,ex_,ex_+8)
    # brows: thick, right one raised
    s+='<path d="M122 108 Q136 99 150 106" stroke="#2a1a1c" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M164 105 Q178 94 192 100" stroke="#2a1a1c" stroke-width="7" fill="none" stroke-linecap="round"/>'
    s+='</g>'
    s+='</g>'
    # glow/extras and bird (outside body bob so flight is free)
    s+=ex
    if bd:
        x,y,sc,pose,wing,rot=bd
        s+=bird(x,y,sc,pose,wing,rot,blink)
    return s+'</svg>'
FAR_IDLE=((100,222),(88,264),(94,300))
def idle(k,bv):
    bob=[0,-2,-3,-1][k];sw=[0,3,0,-3][k];fl=[0,0,1,0][k]
    near=((212,222),(232,258),(230,290))
    stf=((234,392),(232,100-bob))
    if bv=='shoulder':
        bd=(64,222+bob,1.3,'perch','mid',0)
    else:
        bd=(150,8-[0,-6,-2,4][k]*1,1.3,'fly',['up','mid','down','mid'][k],0)
    return dict(lean=[0,-1.5,-1,0][k],bob=bob,sway=sw,arm=near,far=FAR_IDLE,staff=stf,glow=[0,.2,.5,.2][k],bird=bd,blink=1 if k==3 else 0)
def atk(k,bv):
    far=FAR_IDLE
    if k==0: P=dict(lean=-5,bob=2,arm=((212,222),(244,246),(246,214)),far=((100,222),(84,256),(90,290)),staff=((250,330),(262,130)),glow=.3)
    elif k==1: P=dict(lean=5,bob=-2,arm=((212,222),(250,236),(276,226)),far=((100,222),(82,248),(70,214)),staff=((250,296),(340,170)),glow=1)
    elif k==2: P=dict(lean=9,bob=-3,arm=((212,222),(256,230),(290,214)),far=((100,222),(80,244),(66,206)),staff=((258,250),(380,150)),glow=1.6)
    else: P=dict(lean=3,bob=0,arm=((212,222),(238,252),(244,278)),far=FAR_IDLE,staff=((246,392),(244,104)),glow=.4)
    sparks=[]
    if bv=='shoulder':
        bd=[(64,222+P['bob'],1.3,'perch','mid',0),(96,24,1.4,'fly','up',-8),(350,120,1.5,'fly','mid',4),(240,50,1.4,'fly','down',-6)][k]
    else:
        bd=[(150,10,1.3,'fly','down',0),(240,20,1.5,'fly','up',-6),(360,110,1.5,'fly','mid',4),(250,40,1.4,'fly','down',-4)][k]
    ex=''
    if k==1: ex=sparkles([(300,160,10,'#d8f8ff'),(330,128,6,'#ffffff')])
    if k==2: ex=sparkles([(300,150,12,'#d8f8ff'),(334,142,8,'#ffffff'),(350,170,9,'#5ad0e8'),(300,190,7,'#ffffff')])+'<path d="M300 150 Q340 140 372 128" stroke="#5ad0e8" stroke-width="9" stroke-linecap="round" fill="none" opacity=".55"/>'
    P['bird']=bd;P['extra']=ex
    return P
def frames(bv): return [daniel(idle(k,bv),bv) for k in range(4)],[daniel(atk(k,bv),bv) for k in range(4)]
if __name__=='__main__':
    import asyncio,hd_render
    from PIL import Image
    for bv in ('shoulder','head'):
        i,a=frames(bv)
        ims=asyncio.run(hd_render.render(i[:1]+a[1:3],dsf=2))
        sh_=Image.new('RGBA',(960*len(ims)//2*1,960),(42,48,64,255))
        for n,q in enumerate(ims): sh_.alpha_composite(q,(n*960,0)) if False else None
        W=sum(q.width for q in ims);c=Image.new('RGBA',(W,ims[0].height),(42,48,64,255))
        x=0
        for q in ims: c.alpha_composite(q,(x,0));x+=q.width
        c.convert('RGB').save('/mnt/user-data/working/src20/shots/dan_hd_%s.png'%bv)
