import numpy as np
from PIL import Image, ImageFilter
def down(im,w,h):
    a=np.asarray(im).astype(np.float32)/255
    a[...,:3]*=a[...,3:4]
    t=Image.fromarray((a*255).astype(np.uint8),'RGBA').resize((w,h),Image.BOX)
    b=np.asarray(t).astype(np.float32)/255
    al=b[...,3:4];rgb=np.where(al>0,b[...,:3]/np.maximum(al,1e-4),0)
    return np.clip(rgb,0,1),al[...,0]
def pixelize(ims,w,h,ncol=40,athr=0.5,sharpen=0.6):
    parts=[]
    for im in ims:
        rgb,al=down(im,w,h)
        # unsharp on rgb
        pil=Image.fromarray((rgb*255).astype(np.uint8))
        bl=np.asarray(pil.filter(ImageFilter.GaussianBlur(0.8))).astype(np.float32)/255
        rgb=np.clip(rgb+(rgb-bl)*sharpen,0,1)
        parts.append((rgb,al>athr))
    # shared palette from all opaque pixels
    px=np.concatenate([p[0][p[1]] for p in parts])
    n=len(px);side=int(np.ceil(np.sqrt(n)))
    buf=np.zeros((side*side,3),np.float32);buf[:n]=px;buf[n:]=px[:side*side-n] if side*side-n<=n else px[0]
    pal=Image.fromarray((buf.reshape(side,side,3)*255).astype(np.uint8)).quantize(ncol,method=Image.MEDIANCUT,dither=Image.NONE)
    P=np.array(pal.getpalette()[:ncol*3],np.uint8).reshape(-1,3)
    outs=[]
    for rgb,m in parts:
        flat=(rgb*255).reshape(-1,3)
        d=((flat[:,None,:]-P[None,:,:].astype(np.float32))**2).sum(-1)
        idx=d.argmin(1);q=P[idx].reshape(h,w,3)
        out=np.zeros((h,w,4),np.uint8);out[...,:3]=q;out[...,3]=np.where(m,255,0)
        outs.append(Image.fromarray(out,'RGBA'))
    return outs
def outline(im,col=(30,16,12)):
    a=np.asarray(im).copy();m=a[...,3]>0
    d=np.zeros_like(m)
    for dx,dy in((1,0),(-1,0),(0,1),(0,-1)):
        d|=np.roll(np.roll(m,dx,1),dy,0)
    edge=d&~m;a[edge]=col+(255,)
    return Image.fromarray(a,'RGBA')

def despeckle(im,minpx=8):
    from scipy import ndimage
    a=np.asarray(im).copy();m=a[...,3]>0
    lab,n=ndimage.label(m,structure=np.ones((3,3)))
    for i in range(1,n+1):
        if (lab==i).sum()<minpx: a[lab==i]=0
    return Image.fromarray(a,'RGBA')

def finish(im,rim=(150,208,255),rimk=0.35,oc=(40,20,60)):
    a=np.asarray(im).copy().astype(np.float32);m=a[...,3]>0
    # rim light on right / upper-right silhouette edges
    r=np.roll(m,-1,1)==False
    r2=np.roll(np.roll(m,-1,1),1,0)==False
    edge=m&(r|r2)
    edge[:,-1]=False
    a[edge,:3]=a[edge,:3]*(1-rimk)+np.array(rim)*rimk
    out=a.astype(np.uint8)
    # outline: darkened + hue shifted neighbour colour
    d=np.zeros_like(m)
    for dx,dy in((1,0),(-1,0),(0,1),(0,-1)): d|=np.roll(np.roll(m,dx,1),dy,0)
    edge2=d&~m
    H,W=m.shape
    res=out.copy()
    for y,x in zip(*np.where(edge2)):
        for dx,dy in((1,0),(-1,0),(0,1),(0,-1)):
            yy,xx=y+dy,x+dx
            if 0<=yy<H and 0<=xx<W and m[yy,xx]:
                c=out[yy,xx,:3].astype(np.float32)*0.42+np.array(oc)*0.5;res[y,x]=(*np.clip(c,0,255).astype(np.uint8),255);break
    return Image.fromarray(res,'RGBA')

def pixelize_pal(ims,w,h,athr=0.5,sharpen=0.35):
    import palette
    outs=[]
    for im in ims:
        rgb,al=down(im,w,h)
        pil=Image.fromarray((rgb*255).astype(np.uint8))
        bl=np.asarray(pil.filter(ImageFilter.GaussianBlur(0.8))).astype(np.float32)/255
        rgb=np.clip(rgb+(rgb-bl)*sharpen,0,1)
        q=palette.snap(rgb);out=np.zeros((h,w,4),np.uint8);out[...,:3]=q;out[...,3]=np.where(al>athr,255,0)
        outs.append(Image.fromarray(out,'RGBA'))
    return outs
