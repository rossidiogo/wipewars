"""Wipe Wars photo-capture server. Serves the capture page and saves photos into art_gen/refs/<profile>/.
Run:  python server.py   (opens http://127.0.0.1:8765)   Stop: Ctrl+C
Only listens on this computer (127.0.0.1)."""
import json, os, re, sys, webbrowser
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, parse_qs

HERE = os.path.dirname(os.path.abspath(__file__))
REFS = os.path.abspath(os.path.join(HERE, '..', 'refs'))
PORT = 8765
SAFE = re.compile(r'^[A-Za-z0-9_\-]{1,60}$')
SAFE_FILE = re.compile(r'^[A-Za-z0-9_\-]{1,80}\.(jpg|png)$')


def pdir(profile, create=False):
    if not profile or not SAFE.match(profile):
        return None
    d = os.path.join(REFS, profile)
    if create:
        os.makedirs(d, exist_ok=True)
    return d


class H(BaseHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def send(self, code, body=b'', ctype='application/json'):
        if isinstance(body, (dict, list)):
            body = json.dumps(body).encode()
        self.send_response(code)
        self.send_header('Content-Type', ctype)
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Cache-Control', 'no-store')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Private-Network', 'true')
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.send_header('Access-Control-Allow-Private-Network', 'true')
        self.end_headers()

    def do_GET(self):
        u = urlparse(self.path)
        q = {k: v[0] for k, v in parse_qs(u.query).items()}
        if u.path in ('/', '/index.html'):
            with open(os.path.join(HERE, 'index.html'), 'rb') as f:
                return self.send(200, f.read(), 'text/html; charset=utf-8')
        if u.path == '/key':
            with open(os.path.join(HERE, 'key.html'), 'rb') as f:
                return self.send(200, f.read(), 'text/html; charset=utf-8')
        if u.path == '/upload':
            with open(os.path.join(HERE, 'upload.html'), 'rb') as f:
                return self.send(200, f.read(), 'text/html; charset=utf-8')
        d = pdir(q.get('profile'))
        if u.path == '/list':
            names = sorted(os.listdir(d)) if d and os.path.isdir(d) else []
            return self.send(200, [n for n in names if SAFE_FILE.match(n)])
        if u.path == '/file':
            name = q.get('name', '')
            p = os.path.join(d, name) if d and SAFE_FILE.match(name) else None
            if p and os.path.isfile(p):
                with open(p, 'rb') as f:
                    return self.send(200, f.read(), 'image/jpeg' if name.endswith('.jpg') else 'image/png')
            return self.send(404)
        if u.path == '/retakes':
            p = os.path.join(d, '_retakes.json') if d else None
            if p and os.path.isfile(p):
                try:
                    with open(p, encoding='utf-8-sig') as f:
                        return self.send(200, json.load(f))
                except Exception:
                    pass
            return self.send(200, [])
        self.send(404)

    def do_POST(self):
        u = urlparse(self.path)
        q = {k: v[0] for k, v in parse_qs(u.query).items()}
        n = int(self.headers.get('Content-Length', 0))
        data = self.rfile.read(n) if n else b''
        if u.path == '/setkey':
            import urllib.request, urllib.error
            try:
                key = json.loads(data.decode('utf-8')).get('key', '')
            except Exception:
                key = ''
            if not re.match(r'^[A-Za-z0-9_\-\.]{20,300}$', key):
                return self.send(200, {'ok': False, 'msg': 'Isso nao parece uma chave (tem espaco ou caractere estranho). Copie de novo, so a chave.'})
            try:
                rq = urllib.request.Request('https://generativelanguage.googleapis.com/v1beta/models', headers={'x-goog-api-key': key})
                urllib.request.urlopen(rq, timeout=20).read()
            except urllib.error.HTTPError as e:
                return self.send(200, {'ok': False, 'msg': 'O Google recusou a chave (erro %s). Confira se copiou inteira.' % e.code})
            except Exception as e:
                return self.send(200, {'ok': False, 'msg': 'Nao consegui falar com o Google: %s' % e})
            envp = os.path.abspath(os.path.join(HERE, '..', '..', '.env'))
            lines = []
            if os.path.exists(envp):
                lines = [l for l in open(envp, encoding='utf-8').read().splitlines() if not l.startswith('GEMINI_API_KEY=')]
            lines.append('GEMINI_API_KEY=' + key)
            open(envp, 'w', encoding='utf-8').write('\n'.join(lines) + '\n')
            return self.send(200, {'ok': True, 'msg': 'Chave valida e guardada! Pode fechar esta pagina.'})
        d = pdir(q.get('profile'), create=(u.path == '/save'))
        if not d:
            return self.send(400, {'error': 'bad profile'})
        if u.path == '/save':
            name = q.get('name', '')
            if not SAFE_FILE.match(name) or len(data) < 1000:
                return self.send(400, {'error': 'bad name or empty image'})
            with open(os.path.join(d, name), 'wb') as f:
                f.write(data)
            print('saved', q['profile'], name, len(data) // 1024, 'KB')
            return self.send(200, {'ok': True})
        if u.path == '/retake_done':
            p = os.path.join(d, '_retakes.json')
            try:
                with open(p, encoding='utf-8-sig') as f:
                    items = json.load(f)
                stem = lambda s: re.sub(r'\.(jpg|png)$', '', s or '')
                items = [i for i in items if stem(i.get('name')) != stem(q.get('name'))]
                with open(p, 'w', encoding='utf-8') as f:
                    json.dump(items, f, ensure_ascii=False)
            except Exception:
                pass
            return self.send(200, {'ok': True})
        self.send(404)


if __name__ == '__main__':
    os.makedirs(REFS, exist_ok=True)
    srv = ThreadingHTTPServer(('127.0.0.1', PORT), H)
    url = 'http://127.0.0.1:%d/' % PORT
    print('Wipe Wars photo capture running at', url, '- photos go to', REFS)
    if '--no-open' not in sys.argv:
        webbrowser.open(url)
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass
