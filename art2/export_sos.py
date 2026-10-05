import sys,asyncio,io,base64,json
sys.path.insert(0,'/mnt/user-data/working/src20/art2')
import jack_sos,hd_render,pixelize
import numpy as np
from PIL import Image
W,H=160,160
i,a=jack_sos.frames()
ims=asyncio.run(hd_render.render(i+a,dsf=6))
px=pixelize.pixelize_pal(ims,W,H)
px=[pixelize.despeckle(pixelize.finish(p)) for p in px]
sh=Image.new('RGBA',(W*4,H*2),(42,48,64,255))
for n,q in enumerate(px): sh.alpha_composite(q,((n%4)*W,(n//4)*H))
sh.resize((sh.width*2,sh.height*2),Image.NEAREST).convert('RGB').save('/mnt/user-data/working/src20/shots/sos_px_sheet.png')
px[0].resize((W*6,H*6),Image.NEAREST).save('/mnt/user-data/working/src20/shots/sos_px0.png')
import pickle;pickle.dump(px,open('/mnt/user-data/working/src20/art2/sos_px.pkl','wb'))
def uri(im):
    b=io.BytesIO();im.save(b,'PNG',optimize=True);return 'data:image/png;base64,'+base64.b64encode(b.getvalue()).decode()
top=min(int(np.asarray(p)[...,3].nonzero()[0].min()) for p in px)
pj='/mnt/user-data/working/src20/assets/sprites2.json';d=json.load(open(pj))
d['tank']={'w':W,'h':H,'ax':49,'ay':162,'top':top,'s':0.62,'face':'r','idle':[uri(x) for x in px[:4]],'atk':[uri(x) for x in px[4:]]}
json.dump(d,open(pj,'w'));print('top',top)
