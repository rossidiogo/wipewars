"""Generate ONE image with the Gemini API (Nano Banana family) using the free-tier key in ../../.env.
  python gen.py "PROMPT TEXT or @prompt_file.txt" OUT.jpg [--model gemini-3.1-flash-lite-image] [--aspect 1:1] [--size 1K]
Prints a JSON line: {"ok":true,"file":...,"bytes":...} or {"ok":false,"status":..,"error":..}.
Models (same key): gemini-3.1-flash-lite-image (Nano Banana 2 Lite), gemini-3.1-flash-image (NB2), gemini-2.5-flash-image (NB1), gemini-3-pro-image (Pro)."""
import argparse, base64, json, os, sys, urllib.request, urllib.error

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))


def key():
    for l in open(os.path.join(ROOT, '.env'), encoding='utf-8'):
        if l.startswith('GEMINI_API_KEY='):
            return l.split('=', 1)[1].strip()
    raise SystemExit('no GEMINI_API_KEY in .env (open http://127.0.0.1:8765/key)')


def generate(prompt, out, model='gemini-3.1-flash-lite-image', aspect='1:1', size=None, refs=()):
    parts = [{'text': prompt}]
    for r in refs:  # optional reference images (inline base64)
        parts.append({'inlineData': {'mimeType': 'image/jpeg' if r.lower().endswith(('jpg', 'jpeg')) else 'image/png',
                                    'data': base64.b64encode(open(r, 'rb').read()).decode()}})
    ic = {'aspectRatio': aspect}
    if size:
        ic['imageSize'] = size
    body = {'contents': [{'role': 'user', 'parts': parts}],
            'generationConfig': {'responseModalities': ['IMAGE'], 'imageConfig': ic}}
    rq = urllib.request.Request('https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent' % model,
                                data=json.dumps(body).encode(), headers={'Content-Type': 'application/json', 'x-goog-api-key': key()})
    try:
        d = json.load(urllib.request.urlopen(rq, timeout=180))
    except urllib.error.HTTPError as e:
        return {'ok': False, 'status': e.code, 'error': e.read().decode('utf-8', 'replace')[:600]}
    except Exception as e:
        return {'ok': False, 'status': 0, 'error': str(e)}
    for c in d.get('candidates', []):
        for p in c.get('content', {}).get('parts', []):
            inl = p.get('inlineData') or p.get('inline_data')
            if inl:
                raw = base64.b64decode(inl['data'])
                open(out, 'wb').write(raw)
                return {'ok': True, 'file': out, 'bytes': len(raw), 'mime': inl.get('mimeType') or inl.get('mime_type')}
    return {'ok': False, 'status': 200, 'error': 'no image in response: ' + json.dumps(d)[:500]}


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('prompt'); ap.add_argument('out')
    ap.add_argument('--model', default='gemini-3.1-flash-lite-image'); ap.add_argument('--aspect', default='1:1'); ap.add_argument('--size')
    ap.add_argument('--ref', action='append', default=[])
    a = ap.parse_args()
    p = open(a.prompt[1:], encoding='utf-8').read() if a.prompt.startswith('@') else a.prompt
    print(json.dumps(generate(p, a.out, a.model, a.aspect, a.size, a.ref)))
