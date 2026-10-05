import io,asyncio,sys
sys.path.insert(0,'/mnt/user-data/working/src20/art2')
import numpy as np,palette,pixelize,pxclean
from PIL import Image
async def _rend(svgs,W,H):
    from playwright.async_api import async_playwright
    out=[]
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':W,'height':H},device_scale_factor=1)
        for s in svgs:
            s=s.replace('<svg ','<svg width="%d" height="%d" shape-rendering="crispEdges" '%(W,H),1)
            await pg.set_content('<body style="margin:0;background:transparent">'+s)
            out.append(Image.open(io.BytesIO(await pg.screenshot(omit_background=True))).convert('RGBA'))
        await b.close()
    return out
def make(svgs,W,H,clean=True,fin=True):
    ims=asyncio.run(_rend(svgs,W,H))
    px=[]
    for im in ims:
        a=np.asarray(im).astype(np.float32)/255
        q=palette.snap(a[...,:3]);o=np.zeros((H,W,4),np.uint8);o[...,:3]=q;o[...,3]=np.where(a[...,3]>0.5,255,0)
        im2=Image.fromarray(o,'RGBA')
        if fin: im2=pixelize.finish(im2)
        if clean: im2=pxclean.clean(pixelize.despeckle(im2,4),1)
        px.append(im2)
    return px
def sheet(px,path,S=4,cols=4,bg=(42,48,64)):
    W,H=px[0].size;rows=(len(px)+cols-1)//cols
    cv=Image.new('RGB',(cols*W*S,rows*H*S),bg)
    for i,p in enumerate(px):
        im=p.resize((W*S,H*S),Image.NEAREST);cv.paste(im,((i%cols)*W*S,(i//cols)*H*S),im)
    cv.save(path)
