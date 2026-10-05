import sys,io,base64,json;sys.path.insert(0,'/mnt/user-data/working/src20/art2')
import pxlib,ph_sos,ph_chars,numpy as np
def uri(im):
    b=io.BytesIO();im.save(b,'PNG',optimize=True);return 'data:image/png;base64,'+base64.b64encode(b.getvalue()).decode()
pj='/mnt/user-data/working/src20/assets/sprites2.json';d=json.load(open(pj))
allpx=[]
for key,P in ph_chars.C.items():
    i,a=ph_sos.frames(P);px=pxlib.make(i+a,112,112);allpx+=px[:1]+px[5:6]
    top=min(int(np.asarray(p)[...,3].nonzero()[0].min()) for p in px)
    d[key]={'w':112,'h':112,'ax':36,'ay':108,'top':top,'s':0.85,'face':'r','idle':[uri(x) for x in px[:4]],'atk':[uri(x) for x in px[4:]]}
json.dump(d,open(pj,'w'))
pxlib.sheet(allpx,'/tmp/ph.png',3,10)
print('ok')
