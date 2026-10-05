import numpy as np
from scipy.spatial import cKDTree
from PIL import Image
import palette
_T=cKDTree(palette.PLAB)
def to_pixels(im,W,H,thr=0.5):
    a=np.asarray(im).astype(np.float32);al=a[...,3]
    lab=palette.lab(a[...,:3]);idx=_T.query(lab.reshape(-1,3))[1].reshape(al.shape)
    idx=np.where(al>127,idx,-1);s=im.width//W
    blk=idx.reshape(H,s,W,s).transpose(0,2,1,3).reshape(H,W,s*s)
    K=len(palette.PAL);cnt=np.stack([(blk==k).sum(-1) for k in range(K)],-1)
    best=cnt.argmax(-1);frac=(blk>=0).mean(-1)
    out=np.zeros((H,W,4),np.uint8);out[...,:3]=palette.PAL[best].astype(np.uint8);out[...,3]=np.where(frac>thr,255,0)
    return Image.fromarray(out,'RGBA')
def cleanup(im,minpx=3):
    from scipy import ndimage
    a=np.array(im);al=a[...,3]>0
    lab,n=ndimage.label(al)
    for i in range(1,n+1):
        if (lab==i).sum()<minpx: a[lab==i]=0
    return Image.fromarray(a,'RGBA')
