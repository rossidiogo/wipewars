"""Tiny local receiver so Gemini images can be saved WITHOUT the browser's 'Save as' popup.
Run: python tools/receive.py   (listens on 127.0.0.1:8799, writes POST bodies to art_gen/out/<name>.png)
The page does: fetch('http://127.0.0.1:8799/save?name=NAME',{method:'POST',mode:'no-cors',body:blob})"""
import os, re
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'out')
class H(BaseHTTPRequestHandler):
    def _cors(self):
        self.send_header('Access-Control-Allow-Origin', '*'); self.send_header('Access-Control-Allow-Headers', '*'); self.send_header('Access-Control-Allow-Private-Network', 'true')
    def do_OPTIONS(self):
        self.send_response(204); self._cors(); self.end_headers()
    def do_POST(self):
        q = parse_qs(urlparse(self.path).query)
        name = re.sub(r'[^A-Za-z0-9_\-]', '', (q.get('name') or ['img'])[0]) or 'img'
        n = int(self.headers.get('Content-Length', 0)); data = self.rfile.read(n)
        with open(os.path.join(OUT, name + '.png'), 'wb') as f: f.write(data)
        self.send_response(200); self._cors(); self.end_headers(); self.wfile.write(b'ok %d' % len(data))
    def do_GET(self):
        if self.path.startswith('/recv'):
            html=b"""<!doctype html><title>recv</title><body>waiting<script>addEventListener("message",async e=>{const m=e.data||{};if(!m.name)return;const b=atob(m.b64),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);const r=await fetch("/save?name="+m.name,{method:"POST",body:u});const t=await r.text();document.body.textContent="saved "+t;e.source.postMessage({saved:t},"*");});if(window.opener)window.opener.postMessage({ready:1},"*");</script>"""
            self.send_response(200); self.send_header('Content-Type','text/html'); self.end_headers(); self.wfile.write(html); return
        # chunked upload for pages whose CSP blocks fetch/XHR: /c?name=N&i=I&n=TOTAL&d=BASE64URL ; assembled when all chunks arrived
        import base64
        q = parse_qs(urlparse(self.path).query)
        if 'd' in q:
            name = re.sub(r'[^A-Za-z0-9_\-]', '', q['name'][0]); i = int(q['i'][0]); n = int(q['n'][0])
            CH.setdefault(name, {})[i] = base64.urlsafe_b64decode(q['d'][0] + '=' * (-len(q['d'][0]) % 4))
            if len(CH[name]) == n:
                with open(os.path.join(OUT, name + '.png'), 'wb') as f:
                    for k in range(n): f.write(CH[name][k])
                del CH[name]
        self.send_response(200); self._cors(); self.send_header('Content-Type', 'image/gif'); self.end_headers()
        self.wfile.write(base64.b64decode('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'))
    def log_message(self, *a): pass
CH = {}
HTTPServer(('127.0.0.1', 8799), H).serve_forever()



