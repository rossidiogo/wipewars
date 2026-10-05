import sys,io,base64,json,pickle;sys.path.insert(0,'/mnt/user-data/working/src20/art2')
import pxlib,condom_sos,bighead_sos,numpy as np
def uri(im):
    b=io.BytesIO();im.save(b,'PNG',optimize=True);return 'data:image/png;base64,'+base64.b64encode(b.getvalue()).decode()
pj='/mnt/user-data/working/src20/assets/sprites2.json';d=json.load(open(pj))
def put(key,px,W,H,ax,ay,s=1):
    top=min(int(np.asarray(p)[...,3].nonzero()[0].min()) for p in px)
    d[key]={'w':W,'h':H,'ax':ax,'ay':ay,'top':top,'s':s,'face':'l','idle':[uri(x) for x in px[:4]],'atk':[uri(x) for x in px[4:]]}
for rare,key in ((False,'fcondom'),(True,'pcondom')):
    i,a=condom_sos.frames(rare);px=pxlib.make(i+a,64,96);put(key,px,64,96,32,93)
    pxlib.sheet(px,'/mnt/user-data/working/src20/shots/%s.png'%key,S=3)
i,a=bighead_sos.frames(1.4,1);px=pxlib.make(i+a,88,136);put('bh2',px,88,136,44,132)
pxlib.sheet(px,'/mnt/user-data/working/src20/shots/bh2.png',S=3)
json.dump(d,open(pj,'w'))
