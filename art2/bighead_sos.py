import sys
sys.path.insert(0,'/mnt/user-data/working/src20/art2')
from jack_sos import sh,limb,D,star
# viewBox 0 0 176 208 ; feet at y=200 ; neck at (88,104)
DEFS='''<defs>
<linearGradient id="sk" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stop-color="#fcd0a0"/><stop offset=".55" stop-color="#e8a47a"/><stop offset="1" stop-color="#c07868"/></linearGradient>
<linearGradient id="hd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4a8ae8"/><stop offset="1" stop-color="#1c2a6a"/></linearGradient>
<linearGradient id="jn" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5a70b0"/><stop offset="1" stop-color="#28386e"/></linearGradient>
<linearGradient id="br" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffb0c0"/><stop offset=".5" stop-color="#e8708c"/><stop offset="1" stop-color="#a02a5c"/></linearGradient>
</defs>'''
def head(hs,stage,tilt):
    # head centered (88,70) at scale hs ; stage: 0 normal,1 big,2 cracked,3 burst(brain),4 brain biceps
    g='<g transform="translate(88,104) rotate(%s) scale(%s) translate(-88,-104)">'%(tilt,hs)
    g+='<ellipse cx="50" cy="74" rx="6" ry="9" fill="#e0a07a" stroke="%s" stroke-width="2.4"/><ellipse cx="126" cy="74" rx="6" ry="9" fill="#e0a07a" stroke="%s" stroke-width="2.4"/>'%(D,D)
    if stage>=3:
        if stage>=4:
            for sx in (-1,1):
                g+=limb([(88+sx*30,40),(88+sx*56,48),(88+sx*60,18)],11,'#e8708c')
                g+='<circle cx="%d" cy="%d" r="8" fill="#f0a0b4" stroke="%s" stroke-width="2.4"/><circle cx="%d" cy="%d" r="6" fill="#f4c0cc" stroke="%s" stroke-width="2.2"/>'%(88+sx*54,46,D,88+sx*60,14,D)
        # open skull: brain bulges from top
        g+=sh('M50 70 C46 30 70 18 88 20 C106 18 130 30 126 70 C126 96 110 108 88 108 C66 108 50 96 50 70 Z','url(#sk)',3)
        g+=sh('M54 44 C50 14 76 -6 88 -4 C102 -6 128 14 122 44 C108 34 98 40 88 36 C78 40 66 34 54 44 Z','url(#br)',3)
        g+='<path d="M64 26 Q76 14 88 22 Q100 12 114 26 M72 36 Q88 28 104 36 M88 -2 Q84 12 90 24" stroke="#a02a5c" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
        g+='<path d="M52 44 L60 52 L56 60 L64 64 M124 44 L116 52 L120 60" stroke="#6a1c3c" stroke-width="2.4" fill="none" stroke-linejoin="round"/>'
    else:
        g+=sh('M88 20 C116 20 130 44 130 70 C130 96 114 110 88 110 C62 110 46 96 46 70 C46 44 60 20 88 20 Z','url(#sk)',3)
        g+=sh('M48 62 C44 32 66 14 88 14 C112 14 132 32 128 62 C124 46 114 38 100 40 C92 34 80 34 72 40 C58 38 50 48 48 62 Z','#2c2030',3)
        if stage==2: g+='<path d="M92 14 L86 30 L96 40 L88 54 M70 18 L76 32" stroke="#2a1a24" stroke-width="2.6" fill="none" stroke-linejoin="round"/><path d="M92 14 L86 30 L96 40" stroke="#fff" stroke-width="1" fill="none" opacity=".5"/>'
    # face (generic placeholder)
    g+='<ellipse cx="72" cy="76" rx="8" ry="7" fill="#fff8f0" stroke="#2a1a24" stroke-width="2"/><ellipse cx="104" cy="76" rx="8" ry="7" fill="#fff8f0" stroke="#2a1a24" stroke-width="2"/>'
    g+='<circle cx="73" cy="77" r="3.6" fill="#3a2418"/><circle cx="105" cy="77" r="3.6" fill="#3a2418"/><circle cx="74" cy="75.6" r="1.2" fill="#fff"/><circle cx="106" cy="75.6" r="1.2" fill="#fff"/>'
    g+='<path d="M62 66 Q72 61 82 65 M94 65 Q104 61 114 66" stroke="#2a1a1c" stroke-width="4.2" fill="none" stroke-linecap="round"/>'
    g+='<path d="M86 78 Q82 90 88 92 Q94 90 90 78" fill="#e49a74" stroke="#a4603f" stroke-width="1.8" stroke-linejoin="round"/>'
    g+='<path d="M72 96 Q88 108 104 96" stroke="#2a1a24" stroke-width="2.4" fill="#fff4e8" stroke-linejoin="round"/>'
    return g+'</g>'
def boss(P):
    outfit=P.get('outfit',0);vb=P.get('vb','0 -64 176 272')
    hs=P.get('hs',1.4);stage=P.get('stage',1);bob=P.get('bob',0);arm=P.get('arm',0);hx=P.get('hx',0);hy=P.get('hy',0);tilt=P.get('tilt',0);fx=P.get('fx','')
    c1,c2=OUT[outfit]['c']
    s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="%s">'%vb+DEFS.replace('#4a8ae8',c1).replace('#1c2a6a',c2)
    if outfit==4: s+=sh('M46 100 L130 100 L150 196 L26 196 Z','#4a2a98',3)+'<path d="M46 100 L26 196 M130 100 L150 196" stroke="#f0bc3a" stroke-width="3" fill="none"/>'
    s+='<ellipse cx="88" cy="202" rx="44" ry="6" fill="#101830" opacity=".5"/>'
    # legs + sneakers
    s+=sh('M62 140 h20 v52 h-20 z','url(#jn)',3)+sh('M94 140 h20 v52 h-20 z','url(#jn)',3)
    s+=sh('M58 190 h28 v10 h-30 z','#f4f4ff',3)+sh('M90 190 h28 v10 h-30 z','#f4f4ff',3)
    g='<g transform="translate(0,%s)">'%bob
    # far arm
    g+=limb([(56,112),(46,138-int(arm*10)),(44,160-int(arm*40))],18,'url(#hd)')
    g+='<circle cx="44" cy="%d" r="8" fill="url(#sk)" stroke="%s" stroke-width="2.5"/>'%(160-int(arm*40),D)
    # torso hoodie
    g+=sh('M54 108 Q56 98 72 96 L104 96 Q120 98 122 108 L126 148 L50 148 Z','url(#hd)',3)
    g+=sh('M70 98 Q88 112 106 98 L100 90 L76 90 Z','#2c4a9a',2.5)
    g+='<path d="M80 104 V130 M96 104 V130" stroke="#e8f4ff" stroke-width="2.2" stroke-linecap="round"/>'
    g+=sh('M70 128 h36 v16 h-36 z',c2,2)
    g+=OUT[outfit].get('acc','')
    # near arm
    g+=limb([(120,112),(132,138-int(arm*10)),(134,160-int(arm*40))],18,'url(#hd)')
    g+='<circle cx="134" cy="%d" r="8" fill="url(#sk)" stroke="%s" stroke-width="2.5"/>'%(160-int(arm*40),D)
    g+='<g transform="translate(%s,%s)">'%(hx,hy)+head(hs,stage,tilt)+'</g>'
    return s+g+'</g>'+fx+'</svg>'
OUT={0:{'c':('#4a8ae8','#1c2a6a')},
 1:{'c':('#7ad0e8','#2c6a9a'),'acc':'<path d="M62 98 Q88 112 114 98 L114 108 Q88 122 62 108 Z" fill="#f4f8ff" stroke="#2a1a24" stroke-width="2.4"/><path d="M104 108 l6 20 l-10 0 z" fill="#f4f8ff" stroke="#2a1a24" stroke-width="2.2"/>'},
 2:{'c':('#8a8a9a','#3a3a52'),'acc':'<path d="M64 104 L112 104 L116 150 L60 150 Z" fill="#c8742a" stroke="#2a1a24" stroke-width="2.6"/><path d="M72 112 h32 v16 h-32 z" fill="#8a4a1c" stroke="#2a1a24" stroke-width="2"/>'},
 3:{'c':('#4a4a5a','#14141c'),'acc':'<path d="M54 126 h72" stroke="#d82a2a" stroke-width="4"/><path d="M80 104 V130 M96 104 V130" stroke="#d82a2a" stroke-width="2.2"/>'},
 4:{'c':('#a888f8','#3a2a78'),'acc':'<path d="M70 98 L106 98 L100 106 L76 106 Z" fill="#f0bc3a" stroke="#2a1a24" stroke-width="2"/>'}}
def ring(x,y,r):
    return '<circle cx="%d" cy="%d" r="%d" fill="none" stroke="#e8f4ff" stroke-width="3" opacity=".8"/><circle cx="%d" cy="%d" r="%d" fill="none" stroke="#86c8ec" stroke-width="2" opacity=".8"/>'%(x,y,r,x,y,r-6)
CH=[dict(hs=1.0,stage=0,vb='0 0 176 208',W=88,H=104,outfit=0),
    dict(hs=1.35,stage=1,vb='0 -34 176 242',W=88,H=121,outfit=1),
    dict(hs=1.7,stage=2,vb='0 -64 176 272',W=88,H=136,outfit=2),
    dict(hs=1.85,stage=3,vb='0 -112 176 320',W=88,H=160,outfit=3),
    dict(hs=2.0,stage=4,vb='-70 -128 316 336',W=158,H=168,outfit=4)]
def frames_ch(ch):
    c=CH[ch];k=dict(hs=c['hs'],stage=c['stage'],vb=c['vb'],outfit=c['outfit']);h=1.0 if c['hs']<1.5 else .5
    idle=[dict(bob=0),dict(bob=-2,tilt=-1.5),dict(bob=-3),dict(bob=-1,tilt=1.5)]
    atk=[dict(hx=6*h,hy=4,tilt=6,arm=.2),dict(hx=-8*h,hy=2,tilt=-8,arm=.6,bob=-2),dict(hx=-16*h,hy=8,tilt=-14,arm=1,fx=ring(14,112,20)),dict(hx=-6*h,hy=2,tilt=-4,arm=.3)]
    return [boss(dict(k,**p)) for p in idle],[boss(dict(k,**p)) for p in atk]
def frames(hs,stage):
    idle=[dict(bob=0),dict(bob=-2,tilt=-1.5),dict(bob=-3),dict(bob=-1,tilt=1.5)]
    atk=[dict(hx=6,hy=4,tilt=6,arm=.2),dict(hx=-8,hy=2,tilt=-8,arm=.6,bob=-2),dict(hx=-16,hy=8,tilt=-14,arm=1,fx=ring(14,112,20)),dict(hx=-6,hy=2,tilt=-4,arm=.3)]
    return [boss(dict(hs=hs,stage=stage,**p)) for p in idle],[boss(dict(hs=hs,stage=stage,**p)) for p in atk]
if __name__=='__main__':
    import pxlib
    from PIL import Image
    allp=[]
    for ch in range(5):
        c=CH[ch];i,a=frames_ch(ch);px=pxlib.make(i[:1]+a[1:3],c['W'],c['H']);allp.append(px)
    S=3;Wt=sum(p[0].width*3*S for p in allp[:0])+0
    H=max(p[0].height for p in allp)*S
    cv=Image.new('RGB',(sum(p[0].width*S*3+10 for p in allp[:3]),H*2+10),(42,48,64))
    # row1: ch1-3 (3 frames each) row2: ch4-5
    x=0
    for k,px in enumerate(allp[:3]):
        for j,im in enumerate(px):
            b=im.resize((im.width*S,im.height*S),Image.NEAREST);cv.paste(b,(x,H-b.height),b);x+=b.width
        x+=10
    x=0
    for px in allp[3:]:
        for j,im in enumerate(px):
            b=im.resize((im.width*S,im.height*S),Image.NEAREST);cv.paste(b,(x,H+10+H-b.height),b);x+=b.width
        x+=10
    cv.save('/mnt/user-data/working/src20/shots/bh_chapters.png');print(cv.size)
