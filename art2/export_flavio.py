import sys,io,base64,json;sys.path.insert(0,'/mnt/user-data/working/src20/art2')
import pxlib,flavio_sos,numpy as np
i,a=flavio_sos.frames();px=pxlib.make(i+a,112,112)
pxlib.sheet(px,'/tmp/flavio.png',4)
def uri(im):
    b=io.BytesIO();im.save(b,'PNG',optimize=True);return 'data:image/png;base64,'+base64.b64encode(b.getvalue()).decode()
pj='/mnt/user-data/working/src20/assets/sprites2.json';d=json.load(open(pj))
top=min(int(np.asarray(p)[...,3].nonzero()[0].min()) for p in px)
d['sup']={'w':112,'h':112,'ax':36,'ay':108,'top':top,'s':0.85,'face':'r','idle':[uri(x) for x in px[:4]],'atk':[uri(x) for x in px[4:]]}
json.dump(d,open(pj,'w'));print('ok',top)
