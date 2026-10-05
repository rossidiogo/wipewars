import sys,io,base64,json;sys.path.insert(0,'/mnt/user-data/working/src20/art2')
import pxlib
from jack_sos import star
svg='''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="t" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe9a0"/><stop offset=".5" stop-color="#f0bc3a"/><stop offset="1" stop-color="#b87a14"/></linearGradient></defs>
<g transform="rotate(-18 32 32)"><path d="M6 18 H58 V27 A5 5 0 0 0 58 37 V46 H6 V37 A5 5 0 0 0 6 27 Z" fill="url(#t)" stroke="#5a3410" stroke-width="3" stroke-linejoin="round"/>
<path d="M20 20 V44" stroke="#8a5a14" stroke-width="2" stroke-dasharray="3 3"/>
<polygon points="%s" fill="#d84a3c" stroke="#7a1c1c" stroke-width="1.8" stroke-linejoin="round"/></g></svg>'''%star(40,32,10,4.6)
px=pxlib.make([svg],32,32)
px[0].save('/tmp/ticket.png')
b=io.BytesIO();px[0].save(b,'PNG',optimize=True)
p='/mnt/user-data/working/src20/assets/icons2.json';d=json.load(open(p));d['ticket']='data:image/png;base64,'+base64.b64encode(b.getvalue()).decode();json.dump(d,open(p,'w'))
pxlib.sheet(px,'/tmp/ticket_s.png',8,1)
