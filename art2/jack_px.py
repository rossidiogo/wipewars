import numpy as np, math
from PIL import Image, ImageDraw
S=0.2; W,H=96,84
def P(x,y): return (x*S,y*S)
def hx(c): return tuple(int(c[i:i+2],16) for i in (1,3,5))
R={ # hi, mid, dark, deep
 'skin':['#f2c096','#d99a70','#b4704e','#8a4e3c'],
 'beard':['#5a463e','#3a2a26','#2a1d1a','#1c1312'],
 'hat':['#f0cc88','#cf9c5c','#9a683a','#6a4426'],
 'band':['#6a4a38','#4a3022','#3a2418','#241410'],
 'shirt':['#bcdcf8','#86b0e0','#5a84b8','#3c5a8c'],
 'vest':['#c88858','#a0623a','#74442a','#4c2c1c'],
 'band2':['#ff8a70','#dc4a3a','#a82e24','#701c1a'],
 'jeans':['#8eaee0','#6486c6','#42609e','#2c4272'],
 'boot':['#e8a068','#c47a40','#9a5a2c','#6a3a1c'],
 'tan':['#fbe6b8','#e8c080','#c09858','#8a6a3c'],
 'gold':['#fff0a0','#f0c040','#c88a1c','#8a5a10'],
 'dkbrown':['#6a4a3a','#4a2a1a','#3a2014','#241008'],
 'whip':['#c08a54','#8a5a34','#5a3420','#3a2014'],
 'hair':['#5a4a58','#3a2c34','#2b2024','#1c1418'],
 'silver':['#ffffff','#dfe6f2','#aab4c8','#6a7488'],
}
canvas=np.zeros((H,W,4),np.uint8)
def sh(m,dx,dy):
    o=np.zeros_like(m); 
    ys,xs=np.mgrid[0:H,0:W]
    y2=ys-dy;x2=xs-dx;ok=(y2>=0)&(y2<H)&(x2>=0)&(x2<W)
    o[ok]=m[y2[ok],x2[ok]];return o
def poly(pts):
    im=Image.new('L',(W,H),0);ImageDraw.Draw(im).polygon([P(*p) for p in pts],fill=255);return np.array(im)>0
def ell(cx,cy,rx,ry):
    im=Image.new('L',(W,H),0);ImageDraw.Draw(im).ellipse([ (cx-rx)*S,(cy-ry)*S,(cx+rx)*S,(cy+ry)*S ],fill=255);return np.array(im)>0
def limb(pts,w):
    im=Image.new('L',(W,H),0);d=ImageDraw.Draw(im);q=[P(*p) for p in pts];d.line(q,fill=255,width=int(w*S));r=w*S/2
    for x,y in q: d.ellipse([x-r,y-r,x+r,y+r],fill=255)
    return np.array(im)>0
def paint(m,name,light=1):
    r=[hx(c) for c in R[name]]
    inn=sh(m,1,1)  # pixel whose up-left neighbour inside
    hi=m&~sh(m,-1,-1)&0 if False else None
    up=~sh(m,1,1)          # top-left edge pixels
    dk1=m&~sh(m,-1,-1)     # bottom-right edge
    dk2=m&~sh(m,-2,-2)
    cols=np.zeros((H,W),np.uint8)+1
    cols[m&up]=0
    cols[m&dk2]=2
    cols[m&dk1]=3 if False else 2
    for i,c in enumerate(r[:3]): canvas[m&(cols==i)]=c+(255,)
    # inner contour: deep colour on bottom-right edge
    canvas[m&dk1&sh(~m,0,0)]=r[3]+(255,)
    return m
def outline_all():
    a=canvas[...,3]>0
    d=np.zeros_like(a)
    for dx,dy in((1,0),(-1,0),(0,1),(0,-1)): d|=sh(a,dx,dy)
    edge=d&~a
    # colour: darkened nearest
    for y,x in zip(*np.where(edge)):
        col=None
        for dx,dy in((1,0),(-1,0),(0,1),(0,-1)):
            yy,xx=y+dy,x+dx
            if 0<=yy<H and 0<=xx<W and canvas[yy,xx,3]:
                col=canvas[yy,xx,:3].astype(float);break
        canvas[y,x]=(int(col[0]*.28+10),int(col[1]*.25+6),int(col[2]*.28+10),255)
def px(x,y,c):
    if 0<=x<W and 0<=y<H: canvas[int(y),int(x)]=hx(c)+(255,)
def hl(x0,x1,y,c):
    for x in range(x0,x1+1): px(x,y,c)
def star(cx,cy,Rr,r,n=5):
    pts=[]
    for i in range(n*2):
        a=math.radians(-90+i*180/n);rr=Rr if i%2==0 else r;pts.append((cx+rr*math.cos(a),cy+rr*math.sin(a)))
    return pts
def boot(dx):
    paint(poly([(dx-3,368),(dx+50,368),(dx+66,372),(dx+80,384),(dx+90,392),(dx+88,397),(dx-3,397)]),'boot')
    paint(poly([(dx-3,392),(dx+23,392),(dx+23,399),(dx-3,399)]),'dkbrown')
    paint(poly([(dx-2,322),(dx+48,322),(dx+50,372),(dx-3,372)]),'boot')
    paint(poly([(dx-2,322),(dx+48,322),(dx+48,340),(dx-2,340)]),'tan')
    paint(ell(dx-7,372,6,6),'gold')
def draw(crack=False):
    canvas[:]=0
    # shadow
    sm=ell(160,398,110,14)
    canvas[sm]=(20,24,36,120)
    paint(poly([(104,300),(150,300),(148,332),(104,332)]),'jeans'); boot(100)
    paint(poly([(150,300),(198,300),(196,332),(152,332)]),'jeans'); boot(150)
    paint(limb([(98,240),(106,288)],38),'shirt')
    if crack: wp=[(300,262),(318,248),(340,252),(366,274),(392,272),(420,262),(446,252),(466,258)]
    else: wp=[(246,326),(256,346),(270,370),(292,380),(316,376)]
    paint(limb(wp,7),'whip')
    paint(poly([(94,222),(150,208),(206,222),(202,306),(150,314),(98,306)]),'shirt')
    paint(poly([(98,224),(140,222),(134,304),(102,304)]),'vest'); paint(poly([(162,222),(202,224),(198,304),(168,304)]),'vest')
    paint(poly([(110,214),(150,206),(192,214),(172,250),(152,276),(128,250)]),'band2')
    paint(poly(star(182,268,16,7)),'gold')
    paint(poly([(96,296),(204,296),(204,316),(96,316)]),'dkbrown'); paint(poly([(138,292),(166,292),(166,320),(138,320)]),'gold')
    paint(ell(112,298,13,13),'skin')
    # near arm (before head)
    pts=[(204,244),(248,266),(290,262)] if crack else [(204,244),(226,290),(240,322)]
    paint(limb(pts,36),'shirt')
    hx_,hy_=(292,262) if crack else (244,326)
    paint(ell(hx_,hy_,15,15),'skin')
    # head
    paint(ell(98,142,17,17),'hair');paint(ell(92,168,16,16),'hair')
    paint(ell(156,172,60,64),'skin')
    paint(ell(102,180,9,14),'skin')
    paint(poly([(106,196),(104,238),(140,256),(172,266),(196,246),(214,228),(214,192),(176,210),(130,208),(116,208)]),'beard')
    paint(poly([(140,204),(166,192),(208,200),(192,220),(166,218),(150,216)]),'beard')
    # earring
    d=Image.new('L',(W,H),0);ImageDraw.Draw(d).ellipse([93*S*1,193*S+0,111*S,215*S],outline=255);e=np.array(d)>0
    canvas[e]=hx(R['silver'][1])+(255,)
    # glasses (hand placed)
    for cx,cy,rx,ry in ((180,164,19,19),(128,166,16,18)):
        d=Image.new('L',(W,H),0);dd=ImageDraw.Draw(d);dd.ellipse([(cx-rx)*S,(cy-ry)*S,(cx+rx)*S,(cy+ry)*S],fill=255);full=np.array(d)>0
        inner=full&sh(full,1,1)&sh(full,-1,-1)&sh(full,1,-1)&sh(full,-1,1)
        canvas[full]=hx('#1c1c28')+(255,);canvas[inner]=hx('#d8ecf8')+(255,)
        ex,ey=int(cx*S+1),int(cy*S+1)
        for yy in (ey,ey+1,ey+2): px(ex,yy,'#20161a');px(ex+1,yy,'#20161a')
        px(ex,ey,'#ffffff')
    px(int(154*S),int(160*S),'#1c1c28');px(int(158*S),int(160*S),'#1c1c28')
    # brows
    hl(int(163*S),int(198*S),int(134*S),'#241a1c');hl(int(112*S),int(144*S),int(138*S),'#241a1c')
    # mouth
    hl(int(172*S),int(190*S),int(232*S),'#d0786c')
    px(int(196*S),int(192*S),'#e07a6a')
    # hat
    t=-20
    paint(poly([(90,104+t),(86,50+t),(112,26+t+4),(130,34+t),(150,58+t),(170,34+t),(190,26+t+4),(216,50+t),(214,104+t)]),'hat')
    paint(poly([(90,104+t),(152,122+t),(214,104+t),(214,82+t),(152,98+t),(90,82+t)]),'band')
    paint(poly(star(190,98+t,13,5.5)),'gold')
    paint(poly([(26,98+t),(50,120+t),(96,124+t),(152,134+t),(208,124+t),(256,118+t),(286,90+t),(296,118+t),(268,142+t),(212,150+t),(152,148+t),(92,150+t),(38,138+t),(10,120+t)]),'hat')
    outline_all()
    return Image.fromarray(canvas.copy(),'RGBA')
if __name__=='__main__':
    a=draw(False);b=draw(True)
    g=Image.new('RGBA',(W*2+8,H),(42,48,64,255));g.alpha_composite(a,(0,0));g.alpha_composite(b,(W+8,0))
    g.resize((g.width*5,g.height*5),Image.NEAREST).save('/mnt/user-data/working/src20/shots/jack_px.png')
    a.save('/mnt/user-data/working/src20/shots/jack_px_idle.png')
