import sys,asyncio,pickle
sys.path.insert(0,'/mnt/user-data/working/src20/art2')
import daniel_sos,hd_render,pixelize
from PIL import Image
W,H=112,112
out={}
for bv in('shoulder','head'):
    i,a=daniel_sos.frames(bv)
    ims=asyncio.run(hd_render.render(i+a,dsf=6))
    px=pixelize.pixelize_pal(ims,W,H)
    px=[pixelize.despeckle(pixelize.finish(p)) for p in px]
    out[bv]=px
    sh=Image.new('RGBA',(W*4,H*2),(42,48,64,255))
    for n,q in enumerate(px): sh.alpha_composite(q,((n%4)*W,(n//4)*H))
    sh.resize((sh.width*2,sh.height*2),Image.NEAREST).convert('RGB').save('/mnt/user-data/working/src20/shots/dan_px_%s.png'%bv)
pickle.dump(out,open('dan_px.pkl','wb'))
