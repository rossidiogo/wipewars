import cv2,numpy as np,sys
sys.path.insert(0,'/mnt/user-data/working/src20/art2')
from PIL import Image,ImageEnhance
import pixelize,palette
im=Image.open('/mnt/user-data/working/src20/art2/p_full.png').convert('RGBA')
a=np.array(im);al=a[...,3].copy()
bgr=cv2.cvtColor(a[...,:3],cv2.COLOR_RGB2BGR)
# emphasise thin dark lines (glasses frame, brows, lashes) before smoothing
gray=cv2.cvtColor(bgr,cv2.COLOR_BGR2GRAY)
bh=cv2.morphologyEx(gray,cv2.MORPH_BLACKHAT,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(9,9)))
lines=(bh>26).astype(np.uint8)
lines=cv2.dilate(lines,np.ones((3,3),np.uint8))
sm=cv2.pyrMeanShiftFiltering(bgr,10,24)
sm=cv2.medianBlur(sm,5)
sm[lines>0]=(sm[lines>0]*0.35).astype(np.uint8)
rgb=cv2.cvtColor(sm,cv2.COLOR_BGR2RGB)
a[...,:3]=rgb;a[...,3]=al
im=Image.fromarray(a,'RGBA').crop((60,40,603,749))
W=128;H=int(W*im.height/im.width)
rgbf,alf=pixelize.down(im,W,H)
pil=Image.fromarray((rgbf*255).astype(np.uint8));pil=ImageEnhance.Contrast(pil).enhance(1.2);pil=ImageEnhance.Color(pil).enhance(1.15)
q=palette.snap(np.asarray(pil).astype(np.float32)/255)
out=np.zeros((H,W,4),np.uint8);out[...,:3]=q;out[...,3]=np.where(alf>0.5,255,0)
img=pixelize.despeckle(pixelize.finish(Image.fromarray(out,'RGBA'),rimk=0.22),10)
img.save('/mnt/user-data/working/src20/art2/jack_portrait2.png')
bg=Image.new('RGBA',img.size,(30,42,66,255));bg.alpha_composite(img)
bg.resize((W*6,H*6),Image.NEAREST).convert('RGB').save('/mnt/user-data/working/src20/shots/jack_portrait2.png')
