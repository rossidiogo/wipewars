"""Put an approved cleaned sprite PNG into the game: assets/sprites2.json + js/art.js animation/shadow entries.
The game animates by transforms (STEPS in js/art.js), so ONE image is enough; idle gets a 1px breathing bob, attack frames reuse the
idle image (or the optional attack PNG for frames 1-2).

  python export_sprite.py KEY idle.png [--atk attack.png] [--target-h 100] [--steps hero|tank|tp|boss] [--shw 34] [--face r|l]
target-h = on-screen height in field pixels (the battle field is 320 px wide): heroes ~100, small monsters ~60, bosses ~130.
"""
import argparse, base64, io, json, os, re
import numpy as np
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
SPR = os.path.join(ROOT, 'assets', 'sprites2.json')
ART = os.path.join(ROOT, 'js', 'art.js')


def base_center(a):
    ys = np.nonzero(a[..., 3] > 0)[0]
    bottom = ys.max()
    rows = a[max(0, bottom - 3):bottom + 1, :, 3] > 0
    xs = np.nonzero(rows.any(axis=0))[0]
    return (xs.min() + xs.max()) / 2.0, bottom


def uri(img):
    b = io.BytesIO(); img.save(b, 'PNG'); return 'data:image/png;base64,' + base64.b64encode(b.getvalue()).decode()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('key'); ap.add_argument('idle')
    ap.add_argument('--atk'); ap.add_argument('--target-h', type=float, default=100)
    ap.add_argument('--steps', default='hero'); ap.add_argument('--shw', type=int, default=32)
    ap.add_argument('--face', default='r')
    a = ap.parse_args()
    idle = Image.open(a.idle).convert('RGBA'); atk = Image.open(a.atk).convert('RGBA') if a.atk else idle
    arrs = [np.array(idle), np.array(atk)]
    cs = [base_center(x) for x in arrs]
    left = max(c[0] for c in cs) ; right = max(arrs[i].shape[1] - c[0] for i, c in enumerate(cs))
    H = max(x.shape[0] for x in arrs)
    W = int(2 * max(left, right)) + 6
    CH = H + 4                       # headroom for the bob
    ax = W // 2
    ay = CH - 2
    def place(img, c, dy=0):
        cv = Image.new('RGBA', (W, CH), (0, 0, 0, 0))
        x = int(round(ax - c[0])); y = int(ay - img.height + 1 + dy)
        cv.paste(img, (x, y), img); return cv
    bob = [0, -1, -1, 0]
    idle_f = [place(idle, cs[0], d) for d in bob]
    atk_f = [place(idle, cs[0]), place(atk, cs[1]), place(atk, cs[1]), place(idle, cs[0])]
    top = int(np.nonzero(np.array(idle_f[0])[..., 3].any(axis=1))[0].min())
    s = round(a.target_h / float(idle.height) * 20) / 20.0
    sp = json.load(open(SPR, encoding='utf-8'))
    sp[a.key] = {'w': W, 'h': CH, 'ax': ax, 'ay': ay, 'top': top, 's': s, 'face': a.face,
                 'idle': [uri(f) for f in idle_f], 'atk': [uri(f) for f in atk_f]}
    json.dump(sp, open(SPR, 'w', encoding='utf-8'), separators=(',', ':'))
    # js/art.js: animation steps + shadow width for the new key (managed block)
    src = open(ART, encoding='utf-8').read()
    tpl = {'hero': 'HERO_ST', 'tank': 'STEPS.tank', 'tp': 'STEPS.tp', 'boss': 'STEPS.boss'}[a.steps]
    line = "STEPS['%s']=%s;SHW['%s']=%d;" % (a.key, tpl, a.key, a.shw)
    marker = '/*GENART*/'
    if marker not in src:
        src = src.replace('function atkEl(el){', marker + '\n/*END-GENART*/\nfunction atkEl(el){', 1)
    pat = re.compile(r"STEPS\['%s'\]=[^;]*;SHW\['%s'\]=\d+;" % (re.escape(a.key), re.escape(a.key)))
    if pat.search(src):
        src = pat.sub(line, src)
    else:
        src = src.replace('/*END-GENART*/', line + '\n/*END-GENART*/', 1)
    open(ART, 'w', encoding='utf-8', newline='').write(src)
    print('exported', a.key, 'canvas', W, 'x', CH, 'anchor', ax, ay, 'top', top, 's', s)


if __name__ == '__main__':
    main()
