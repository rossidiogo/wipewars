import numpy as np
from PIL import Image
def clean(im,iters=2):
    a=np.array(im);h,w,_=a.shape
    for _ in range(iters):
        b=a.copy()
        for y in range(1,h-1):
            for x in range(1,w-1):
                if a[y,x,3]==0: continue
                c=tuple(a[y,x,:3]);nb=[(y-1,x),(y+1,x),(y,x-1),(y,x+1)]
                same=sum(1 for (j,i) in nb if a[j,i,3] and tuple(a[j,i,:3])==c)
                opq=[(j,i) for (j,i) in nb if a[j,i,3]]
                if len(opq)==0: b[y,x,3]=0;continue
                if same==0:
                    cnt={}
                    for (j,i) in opq: k=tuple(a[j,i,:3]);cnt[k]=cnt.get(k,0)+1
                    k=max(cnt,key=cnt.get)
                    if cnt[k]>=4: b[y,x,:3]=k
        a=b
    return Image.fromarray(a,'RGBA')
