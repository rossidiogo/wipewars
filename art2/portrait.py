import cv2,numpy as np
from PIL import Image
src='/root/.claude/uploads/82bc145f-d89e-5b9b-8331-f30e6464ff87/9a344f5d-image.jpg'
im=cv2.imread(src);h,w=im.shape[:2]
sc=0.5;sm=cv2.resize(im,(int(w*sc),int(h*sc)),interpolation=cv2.INTER_AREA)
H,W=sm.shape[:2]
mask=np.full((H,W),cv2.GC_PR_BGD,np.uint8)
mask[:, :int(W*0.12)]=cv2.GC_BGD
mask[:int(H*0.02),:int(W*0.3)]=cv2.GC_BGD
cv2.rectangle(mask,(int(W*.30),int(H*.04)),(int(W*.95),int(H*.98)),cv2.GC_PR_FGD,-1)
cv2.rectangle(mask,(int(W*.45),int(H*.2)),(int(W*.85),int(H*.8)),cv2.GC_FGD,-1)
# shirt/shoulders bottom area probable fg
cv2.rectangle(mask,(int(W*.15),int(H*.80)),(int(W*1.0),H-1),cv2.GC_PR_FGD,-1)
bg=np.zeros((1,65),np.float64);fg=np.zeros((1,65),np.float64)
cv2.grabCut(sm,mask,None,bg,fg,8,cv2.GC_INIT_WITH_MASK)
m=((mask==cv2.GC_FGD)|(mask==cv2.GC_PR_FGD)).astype(np.uint8)
m=cv2.morphologyEx(m,cv2.MORPH_OPEN,np.ones((5,5),np.uint8));m=cv2.morphologyEx(m,cv2.MORPH_CLOSE,np.ones((9,9),np.uint8))
n,lab,st,_=cv2.connectedComponentsWithStats(m)
if n>1:
    k=1+np.argmax(st[1:,cv2.CC_STAT_AREA]);m=(lab==k).astype(np.uint8)
cv2.imwrite('/mnt/user-data/working/src20/art2/p_mask.png',m*255)
vis=sm.copy();vis[m==0]=(vis[m==0]*0.25+np.array([60,40,20])*0.75).astype(np.uint8)
cv2.imwrite('/mnt/user-data/working/src20/shots/p_mask_vis.png',vis)
