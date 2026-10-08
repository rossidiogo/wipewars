"""Procedural pixel art for Rubens (Smoke Medic) - fallback used when Gemini was unreachable (no browser approval, API quota 0).
Draws shapes on a 64x104 canvas, auto-shades (top-left light) and outlines. Output: out/clean/hero_rubens_proc{N}.png (+ _x4)
Run: python draw_rubens.py [N]"""
import os, sys, random
from PIL import Image, ImageDraw

R = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
N = sys.argv[1] if len(sys.argv) > 1 else '1'
W, H = 64, 104
random.seed(7)

# region id -> (base, light, dark)
PAL = {
    'skin':  ((226, 170, 140), (246, 200, 172), (176, 118, 104)),
    'cap':   ((40, 40, 52), (72, 74, 92), (22, 22, 32)),
    'hair':  ((120, 86, 60), (178, 164, 150), (80, 56, 42)),
    'beard': ((86, 58, 40), (124, 88, 60), (52, 34, 26)),
    'glass': ((26, 26, 36), (70, 72, 90), (14, 14, 22)),
    'white': ((238, 238, 232), (255, 255, 250), (170, 176, 196)),
    'tee':   ((212, 218, 234), (236, 240, 248), (166, 174, 202)),
    'sleeve': ((238, 238, 232), (255, 255, 250), (170, 176, 196)),
    'brim':  ((26, 26, 36), (70, 72, 90), (14, 14, 22)),
    'grey':  ((186, 182, 176), (186, 182, 176), (186, 182, 176)),
    'lid':   ((196, 136, 118), (196, 136, 118), (196, 136, 118)),
    'pupil': ((34, 20, 30), (34, 20, 30), (34, 20, 30)),
    'print': ((214, 218, 214), (214, 218, 214), (214, 218, 214)),
    'seam':  ((150, 156, 182), (150, 156, 182), (150, 156, 182)),
    'leafn': ((40, 52, 120), (40, 52, 120), (40, 52, 120)),
    'leafg': ((60, 160, 80), (60, 160, 80), (60, 160, 80)),
    'mag':   ((200, 40, 96), (236, 90, 140), (130, 24, 74)),
    'blue':  ((50, 110, 210), (110, 170, 245), (28, 62, 140)),
    'navy':  ((28, 38, 98), (52, 70, 150), (16, 20, 60)),
    'green': ((70, 190, 80), (140, 235, 130), (36, 120, 52)),
    'short': ((30, 30, 40), (62, 64, 80), (16, 16, 24)),
    'sandal': ((110, 74, 48), (150, 108, 72), (70, 44, 30)),
    'ink':   ((52, 56, 76), (52, 56, 76), (52, 56, 76)),
    'eyered': ((232, 96, 104), (232, 96, 104), (232, 96, 104)),
    'ember': ((255, 150, 40), (255, 150, 40), (255, 150, 40)),
    'joint': ((244, 240, 224), (255, 255, 250), (190, 184, 160)),
    'smoke': ((170, 222, 168), (170, 222, 168), (170, 222, 168)),
    'gold':  ((230, 200, 70), (230, 200, 70), (230, 200, 70)),
    'logo':  ((250, 250, 250), (250, 250, 250), (250, 250, 250)),
    'tooth': ((250, 245, 235), (250, 245, 235), (250, 245, 235)),
    'mouth': ((150, 60, 70), (150, 60, 70), (150, 60, 70)),
}
def _f(c): return (c, c, c)
PAL['glass'] = PAL['brim'] = PAL['cap']
PAL['joint'] = PAL['white']
PAL['sandal'] = PAL['beard']
PAL['hair'] = ((124, 88, 60), (178, 164, 150), (86, 58, 40))
for _k, _c in dict(logo=(255, 255, 250), tooth=(255, 255, 250), seam=(166, 174, 202), print=(62, 64, 80), leafn=(28, 38, 98),
                   lid=(176, 118, 104), pupil=(22, 18, 30), ink=(62, 64, 80), grey=(178, 164, 150), mouth=(130, 24, 74), knuck=(176, 118, 104)).items():
    PAL[_k] = _f(_c)
FLAT = {'knuck', 'grey', 'lid', 'pupil', 'print', 'seam', 'leafn', 'leafg', 'ink', 'eyered', 'ember', 'smoke', 'gold', 'logo', 'tooth', 'mouth'}

lab = [[None] * W for _ in range(H)]


def put(x, y, k):
    if 0 <= x < W and 0 <= y < H:
        lab[y][x] = k


def ell(cx, cy, rx, ry, k, only=None):
    for y in range(int(cy - ry) - 1, int(cy + ry) + 2):
        for x in range(int(cx - rx) - 1, int(cx + rx) + 2):
            if ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1.0 and (only is None or lab[y][x] in only):
                put(x, y, k)


def rect(x0, y0, x1, y1, k, only=None):
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            if 0 <= x < W and 0 <= y < H and (only is None or lab[y][x] in only):
                put(x, y, k)


CX = 32
# ---- legs + sandals
rect(23, 82, 29, 93, 'skin'); rect(35, 82, 41, 93, 'skin')
rect(21, 93, 30, 98, 'sandal'); rect(34, 93, 43, 98, 'sandal')
# ---- shorts
rect(20, 66, 44, 83, 'short')
rect(31, 77, 33, 83, None)
for (x, y) in [(22,70),(23,70),(23,71),(24,71),(24,72),(25,72),(25,73),(26,73),(22,73),(23,73),(26,70),(27,70),
               (42,74),(41,74),(41,75),(40,75),(40,76),(39,76),(39,77),(38,77),(42,77),(41,77),(38,74),(37,74)]:
    put(x, y, 'print')
# ---- torso: tee
ell(CX, 56, 15, 14, 'tee')
rect(18, 46, 46, 68, 'tee')
# ---- Hawaiian shirt panels (open)
rect(14, 42, 25, 70, 'white'); rect(39, 42, 50, 70, 'white')
ell(CX, 44, 17, 6, 'white', only=[None, 'white'])
# collar notch
rect(26, 42, 38, 47, 'tee')
for i in range(5):
    put(25 - i // 2, 42 + i, 'white'); put(39 + i // 2, 42 + i, 'white')
for y in range(47, 71):
    put(25, y, 'seam'); put(39, y, 'seam')
# hibiscus blobs and leaves (left panel then right panel)
def flower(cx, cy, c1, c2):
    for dx, dy in [(0, -2), (2, -1), (2, 1), (0, 2), (-2, 1), (-2, -1)]:
        ell(cx + dx, cy + dy, 1.6, 1.6, c1, only=['white'])
    put(cx, cy, c2); put(cx + 1, cy, c2)
def leaf(cx, cy, c):
    for dx, dy in [(0, 0), (1, 1), (2, 2), (1, 0), (2, 1), (0, 1)]:
        if lab[cy + dy][cx + dx] == 'white':
            put(cx + dx, cy + dy, c)
flower(18, 50, 'mag', 'gold'); flower(21, 60, 'blue', 'navy'); flower(17, 66, 'mag', 'gold')
flower(43, 49, 'blue', 'navy'); flower(46, 58, 'mag', 'gold'); flower(42, 66, 'mag', 'gold')
for (x, y) in [(22, 47), (23, 62)]:
    leaf(x, y, 'leafn')
for (x, y) in [(19, 52), (44, 60), (47, 48)]:
    leaf(x, y, 'leafg')
# ---- arms: short sleeves (shirt) then forearms
# screen-left arm (holds the joint)
rect(8, 46, 16, 56, 'sleeve'); flower(11, 50, 'mag', 'gold')
rect(7, 56, 14, 69, 'skin')
ell(10, 71, 4.2, 3.8, 'skin')
# screen-right arm (tattoo sleeve)
rect(48, 46, 56, 56, 'sleeve'); flower(53, 51, 'blue', 'navy')
rect(50, 56, 57, 69, 'skin')
rect(52, 59, 55, 62, 'ink'); rect(51, 64, 53, 67, 'ink'); rect(55, 64, 56, 65, 'ink')
ell(54, 71, 4.2, 3.8, 'skin')
rect(15, 57, 15, 69, None); rect(49, 57, 49, 69, None)
# joint pinched at the fingertips, pointing out; green smoke ribbon
for i in range(4):
    put(6 - i, 69 - i, 'joint'); put(7 - i, 69 - i, 'joint')
rect(2, 64, 3, 65, 'ember'); put(2, 63, 'gold')
for (x, y) in [(2,61),(2,60),(3,59),(3,58),(4,57),(4,56),(3,55),(3,54),(2,53),(2,52)]:
    put(x, y, 'smoke'); put(x + 1, y, 'smoke')
put(3, 51, 'smoke'); put(4, 50, 'smoke'); put(2, 62, 'smoke')
for _x in (8, 10, 12, 52, 54, 56):
    put(_x, 72, 'knuck')
# ---- neck + head
ell(CX, 41, 6, 3, 'skin')
ell(CX, 27, 17, 15, 'skin')
# ears
ell(14, 29, 2.5, 3.5, 'skin'); ell(50, 29, 2.5, 3.5, 'skin')
put(13, 33, 'gold'); put(13, 34, 'gold'); put(12, 34, 'gold'); put(12, 35, 'gold'); put(13, 36, 'gold')
# hair under cap (brown + grey fringe at sides/front)
rect(15, 18, 17, 27, 'hair'); rect(47, 18, 49, 27, 'hair')
for (x, y) in [(16, 19), (16, 22), (48, 21), (48, 24), (15, 25)]:
    put(x, y, 'white')
rect(20, 17, 44, 19, 'hair')
for x in range(21, 44, 3):
    put(x, 18, 'white')
# cap dome + brim (toward screen-right, 15deg turn)
ell(CX, 16, 17, 10, 'cap', only=[None, 'skin', 'hair', 'white'])
rect(15, 15, 49, 17, 'cap')
rect(16, 19, 52, 20, 'brim')   # brim
rect(0, 21, 63, 30, 'skin', only=['cap'])
rect(19, 21, 45, 21, 'hair', only=['skin'])
for x0 in (21, 27, 36, 42):
    rect(x0, 21, x0 + 1, 21, 'grey')
rect(15, 22, 16, 23, 'grey'); rect(48, 22, 49, 23, 'grey')
rect(34, 8, 40, 9, 'cap')
for (x, y) in [(27, 11), (28, 11), (29, 11), (31, 11), (32, 11), (34, 11), (35, 11), (28, 13), (29, 13), (30, 13), (32, 13), (33, 13)]:
    put(x, y, 'logo')
# ---- face: glasses
rect(19, 23, 30, 30, 'glass'); rect(34, 23, 45, 30, 'glass'); rect(30, 24, 34, 25, 'glass')
rect(21, 25, 28, 28, 'skin'); rect(36, 25, 43, 28, 'skin')
rect(23, 26, 26, 26, 'lid'); rect(23, 27, 26, 28, 'eyered'); put(24, 27, 'pupil'); put(25, 27, 'pupil')
rect(38, 26, 41, 26, 'lid'); rect(38, 27, 41, 28, 'eyered'); put(39, 27, 'pupil'); put(40, 27, 'pupil')
rect(18, 24, 19, 25, 'glass'); rect(45, 24, 46, 25, 'glass')
# ---- beard + mustache + smile
ell(CX, 36, 14, 8, 'beard', only=['skin'])
rect(16, 31, 48, 33, 'skin', only=['skin'])
rect(17, 28, 20, 36, 'beard', only=['skin']); rect(44, 28, 47, 36, 'beard', only=['skin'])
ell(CX, 42, 10, 3, 'beard', only=[None, 'skin'])
rect(24, 32, 40, 34, 'beard')              # mustache
put(23, 33, 'hair'); put(41, 33, 'hair')    # lighter tips
rect(27, 36, 37, 38, 'skin')                # mouth patch
rect(27, 37, 37, 37, 'mouth'); rect(29, 36, 35, 36, 'tooth')
put(26, 36, 'mouth'); put(38, 36, 'mouth')
# nose
rect(31, 30, 33, 32, 'skin')

lab = [[None] * 4 + row + [None] * 4 for row in lab]
W = 72
# ================= render: shading + outline =================
img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
px = img.load()


def same(x, y, k):
    return 0 <= x < W and 0 <= y < H and lab[y][x] == k


for y in range(H):
    for x in range(W):
        k = lab[y][x]
        if not k:
            continue
        base, light, dark = PAL[k]
        c = base
        if k not in FLAT:
            if not same(x - 1, y - 1, k) or not same(x, y - 1, k) and not same(x - 1, y, k):
                c = light
            elif not same(x + 1, y + 1, k) or not same(x, y + 1, k) and not same(x + 1, y, k):
                c = dark
        px[x, y] = c + (255,)

SH = {'white', 'sleeve', 'tee', 'short', 'skin', 'sandal'}
for y in range(H):
    x = 0
    while x < W:
        k = lab[y][x]
        if k in SH:
            x1 = x
            while x1 + 1 < W and lab[y][x1 + 1] == k:
                x1 += 1
            n = x1 - x + 1
            if n >= 5:
                for xx in range(x1 - max(1, n * 3 // 10) + 1, x1 + 1):
                    px[xx, y] = PAL[k][2] + (255,)
            x = x1 + 1
        else:
            x += 1
for y in range(1, H):
    for x in range(W):
        k = lab[y][x]
        if k and k not in FLAT and k != lab[y - 1][x] and lab[y - 1][x] in ('beard', 'brim', 'cap'):
            px[x, y] = PAL[k][2] + (255,)

# outline (1px, dark tinted)
out = Image.new('RGBA', (W, H), (0, 0, 0, 0))
op = out.load()
for y in range(H):
    for x in range(W):
        if px[x, y][3] == 0:
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nx, ny = x + dx, y + dy
                if 0 <= nx < W and 0 <= ny < H and px[nx, ny][3]:
                    op[x, y] = (22, 18, 30, 255)
                    break
for y in range(H):
    for x in range(W):
        if op[x, y][3]:
            px[x, y] = op[x, y]

# thin cool rim light on screen-right edge
for y in range(H):
    for x in range(W - 2):
        if px[x, y][3] and px[x, y] != (22, 18, 30, 255) and px[x + 1, y] == (22, 18, 30, 255):
            kk = lab[y][x]
            if kk and kk not in FLAT:
                px[x, y] = PAL[kk][1] + (255,)

o = os.path.join(R, 'out', 'clean')
os.makedirs(o, exist_ok=True)
p = os.path.join(o, 'hero_rubens_proc%s.png' % N)
img.save(p)
img.resize((W * 4, H * 4), Image.NEAREST).save(p.replace('.png', '_x4.png'))
print(p, len(set(px[x, y] for y in range(H) for x in range(W) if px[x, y][3])), 'colors')
