import json,re,sys,base64,builtins
R=__import__('os').path.dirname(__import__('os').path.abspath(__file__)).replace('\\','/')+'/'
# Windows defaults to cp1252; force UTF-8 for text files
open=lambda f,m='r':builtins.open(f,m) if 'b' in m else builtins.open(f,m,encoding='utf-8')
ico=json.load(open(R+'assets/icons2.json'));bg=json.load(open(R+'assets/bg2.json'));spr=json.load(open(R+'assets/sprites2.json'))
from urllib.parse import quote
def corner(tf):
    svg=("<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16'><g transform='%s'>"
         "<path d='M1 15V4l3-3h11' fill='none' stroke='#c9a96a' stroke-width='1.4'/>"
         "<path d='M4 4l2.6 2.6L4 9.2 1.4 6.6z' fill='#e0c57a'/><path d='M1 15V8M8 1h-2' stroke='#7a5c32' stroke-width='1' /></g></svg>")%tf
    return 'url("data:image/svg+xml,%s")'%quote(svg)
css=open(R+'css/style.css').read()
css=':root{--cTL:%s;--cTR:%s;--cBL:%s;--cBR:%s;--bgimg:url(%s);--bgfield:url(%s)}\n'%(corner(''),corner('matrix(-1 0 0 1 16 0)'),corner('matrix(1 0 0 -1 0 16)'),corner('matrix(-1 0 0 -1 16 16)'),bg['tall'],bg['wide'])+css
bgch=json.load(open(R+'assets/bg_ch.json'))
logo=base64.b64encode(open(R+'assets/logo.png','rb').read()).decode()
import glob,os
ava={os.path.basename(f)[4:-4]:'data:image/png;base64,'+base64.b64encode(open(f,'rb').read()).decode() for f in glob.glob(os.path.join(os.path.dirname(os.path.abspath(__file__)),'assets','ava_*.png'))}
js='const AVA='+json.dumps(ava)+';\nconst LOGO="data:image/png;base64,'+logo+'";\nconst BGCH='+json.dumps([bgch[str(i)] for i in range(5)])+';\nconst ICO='+json.dumps(ico)+';\nconst SPD='+json.dumps(spr)+';\n'
for f in ['core','lang','art','battle','ui','recruit','cuts','net','account','guild','music','title']:
    js+=open(R+'js/%s.js'%f).read()+'\n'
html=open(R+'index.html').read().replace('/*CSS*/',css).replace('/*JS*/',js)
out=sys.argv[1] if len(sys.argv)>1 else R+'test.html'
open(out,'w').write(html);print(len(html))
