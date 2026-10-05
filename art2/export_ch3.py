import sys,io,base64,json;sys.path.insert(0,'/mnt/user-data/working/src20/art2')
import pxlib,sander_sos,bighead_sos,numpy as np
def uri(im):
    b=io.BytesIO();im.save(b,'PNG',optimize=True);return 'data:image/png;base64,'+base64.b64encode(b.getvalue()).decode()
pj='/mnt/user-data/working/src20/assets/sprites2.json';d=json.load(open(pj))
def put(key,px,W,H,ax,ay,s=1):
    top=min(int(np.asarray(p)[...,3].nonzero()[0].min()) for p in px)
    d[key]={'w':W,'h':H,'ax':ax,'ay':ay,'top':top,'s':s,'face':'l','idle':[uri(x) for x in px[:4]],'atk':[uri(x) for x in px[4:]]}
i,a=sander_sos.frames('belt');px=pxlib.make(i+a,64,96);put('belt',px,64,96,32,93)
i,a=sander_sos.frames('machine');px=pxlib.make(i+a,80,104);put('machine',px,80,104,40,101)
vb0=[(0,0),(0,-34),(0,-64),(0,-112),(-70,-128)]
for ch in range(5):
    c=bighead_sos.CH[ch];i,a=bighead_sos.frames_ch(ch);px=pxlib.make(i+a,c['W'],c['H'])
    x0,y0=vb0[ch];put('bh%d'%(ch+1),px,c['W'],c['H'],int((88-x0)/2),int((200-y0)/2))
json.dump(d,open(pj,'w'));print('ok',[k for k in d])
