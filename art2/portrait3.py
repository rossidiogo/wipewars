import cv2,numpy as np,sys
sys.path.insert(0,'/mnt/user-data/working/src20/art2')
from PIL import Image,ImageEnhance
import pixelize
im=Image.open('/mnt/user-data/working/src20/art2/p_full.png').convert('RGBA')
a=np.array(im)
rgb=cv2.cvtColor(a[...,:3],cv2.COLOR_RGB2BGR)
for _ in range(3): rgb=cv2.bilateralFilter(rgb,9,40,9)
rgb=cv2.cvtColor(rgb,cv2.COLOR_BGR2RGB)
a[...,:3]=rgb
im=Image.fromarray(a,'RGBA')
im=im.crop((60,40,603,749));W=128;H=int(W*im.height/im.width)
rgbf,al=pixelize.down(im,W,H)
pil=Image.fromarray((rgbf*255).astype(np.uint8));pil=ImageEnhance.Contrast(pil).enhance(1.18);pil=ImageEnhance.Color(pil).enhance(1.25)
m=al>0.5
arr=np.asarray(pil)
op=arr[m]
n=len(op);side=int(np.ceil(np.sqrt(n)));buf=np.zeros((side*side,3),np.uint8);buf[:n]=op;buf[n:]=op[0]
pal=Image.fromarray(buf.reshape(side,side,3)).quantize(30,method=Image.MEDIANCUT,dither=Image.NONE)
P=np.array(pal.getpalette()[:90],np.uint8).reshape(-1,3).astype(np.float32)
d=((arr.reshape(-1,1,3).astype(np.float32)-P[None])**2).sum(-1).argmin(1)
q=P[d].reshape(H,W,3).astype(np.uint8)
out=np.zeros((H,W,4),np.uint8);out[...,:3]=q;out[...,3]=np.where(m,255,0)
img=pixelize.despeckle(pixelize.finish(Image.fromarray(out,'RGBA'),rimk=0.2))
img.save('/mnt/user-data/working/src20/art2/jack_portrait.png')
bg=Image.new('RGBA',img.size,(34,44,66,255));bg.alpha_composite(img)
bg.resize((W*6,H*6),Image.NEAREST).convert('RGB').save('/mnt/user-data/working/src20/shots/jack_portrait.png')
