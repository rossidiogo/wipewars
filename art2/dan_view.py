import sys,asyncio,pickle,io
sys.path.insert(0,'/mnt/user-data/working/src20/art2')
import daniel_sos,pixelize,palette
import numpy as np
from PIL import Image
async def rend(svgs,W):
    from playwright.async_api import async_playwright
    out=[]
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':480,'height':480},device_scale_factor=W/480)
        for s in svgs:
            s=s.replace('<svg ','<svg shape-rendering="crispEdges" ',1)
            await pg.set_content('<body style="margin:0;background:transparent">'+s)
            out.append(Image.open(io.BytesIO(await pg.screenshot(omit_background=True))).convert('RGBA'))
        await b.close()
    return out
def snapimg(im,W):
    a=np.asarray(im).astype(np.float32)/255
    q=palette.snap(a[...,:3]);o=np.zeros((a.shape[0],a.shape[1],4),np.uint8);o[...,:3]=q;o[...,3]=np.where(a[...,3]>0.5,255,0)
    return Image.fromarray(o,'RGBA')
def run(tag,W=112,post=None,frames=(0,5,6),bv='shoulder',S=5,fin=True):
    i,a=daniel_sos.frames(bv)
    ims=asyncio.run(rend(i+a,W))
    px=[snapimg(x,W) for x in ims]
    if fin: px=[pixelize.finish(p) for p in px]
    if post: px=[post(p) for p in px]
    pickle.dump(px,open('dan_%s.pkl'%tag,'wb'))
    cw=int(W*0.92)
    cv=Image.new('RGB',(len(frames)*(cw*S+10),W*S),(42,48,64))
    for n,f in enumerate(frames):
        im=px[f].crop((0,0,cw,W)).resize((cw*S,W*S),Image.NEAREST);cv.paste(im,(n*(cw*S+10),0),im)
    cv.save('/mnt/user-data/working/src20/shots/dan_%s.png'%tag);return px
if __name__=='__main__': run(sys.argv[1] if len(sys.argv)>1 else 'p1')
