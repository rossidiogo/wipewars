import asyncio,sys
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':960,'height':420},device_scale_factor=2)
        h='<body style="margin:0;background:#2a3040;display:flex">'+''.join('<div style="width:480px">'+open('/mnt/user-data/working/src20/art2/jack_%s.svg'%n).read()+'</div>' for n in ('idle','crack'))
        await pg.set_content(h);await pg.screenshot(path='/mnt/user-data/working/src20/shots/jack_vec.png');await b.close()
asyncio.run(main())
