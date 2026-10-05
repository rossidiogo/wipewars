import sys,asyncio,io,base64,json
sys.path.insert(0,'/mnt/user-data/working/src20/art2')
import jack_hd,hd_render,pixelize
import numpy as np
W,H=160,148
i,a=jack_hd.frames()
ims=asyncio.run(hd_render.render(i+a,dsf=6))
px=pixelize.pixelize(ims,W,H,ncol=56)
px=[pixelize.despeckle(pixelize.outline(p)) for p in px]
def uri(im):
    b=io.BytesIO();im.save(b,'PNG',optimize=True);return 'data:image/png;base64,'+base64.b64encode(b.getvalue()).decode()
top=min(np.asarray(p)[...,3].nonzero()[0].min() for p in px)
p='/mnt/user-data/working/src20/assets/sprites2.json';d=json.load(open(p))
d['tank']={'w':W,'h':H,'ax':47,'ay':140,'top':int(top),'s':0.5,'face':'r','idle':[uri(x) for x in px[:4]],'atk':[uri(x) for x in px[4:]]}
json.dump(d,open(p,'w'))
from PIL import Image
sh=Image.new('RGBA',(W*4,H*2),(42,48,64,255))
for n,q in enumerate(px): sh.alpha_composite(q,((n%4)*W,(n//4)*H))
sh.resize((sh.width*2,sh.height*2),Image.NEAREST).convert('RGB').save('/mnt/user-data/working/src20/shots/hd_px_sheet.png')
print('top',top)
