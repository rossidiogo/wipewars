import sys,io,base64,json;sys.path.insert(0,'/mnt/user-data/working/src20/art2')
import pxlib,pizza_sos,numpy as np
def uri(im):
    b=io.BytesIO();im.save(b,'PNG',optimize=True);return 'data:image/png;base64,'+base64.b64encode(b.getvalue()).decode()
pj='/mnt/user-data/working/src20/assets/sprites2.json';d=json.load(open(pj))
def put(key,px,W,H,ax,ay,s=1):
    top=min(int(np.asarray(p)[...,3].nonzero()[0].min()) for p in px)
    d[key]={'w':W,'h':H,'ax':ax,'ay':ay,'top':top,'s':s,'face':'l','idle':[uri(x) for x in px[:4]],'atk':[uri(x) for x in px[4:]]}
for kind,key,W,H,ax in (('burnt','pzburnt',64,72,32),('messy','pzmessy',80,72,40)):
    i,a=pizza_sos.frames(kind);px=pxlib.make(i+a,W,H);put(key,px,W,H,ax,69)
json.dump(d,open(pj,'w'));print('ok')
