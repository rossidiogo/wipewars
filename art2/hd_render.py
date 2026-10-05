import asyncio,io,sys
sys.path.insert(0,'/mnt/user-data/working/src20/art2')
import jack_hd
from PIL import Image
async def render(svgs,dsf=6):
    from playwright.async_api import async_playwright
    out=[]
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':480,'height':480},device_scale_factor=dsf)
        for s in svgs:
            await pg.set_content('<body style="margin:0;background:transparent">'+s)
            out.append(Image.open(io.BytesIO(await pg.screenshot(omit_background=True))).convert('RGBA'))
        await b.close()
    return out
