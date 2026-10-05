import math, io, base64, json
from PIL import Image

N = 24
def rgb(h): return tuple(int(h[i:i+2], 16) for i in (1, 3, 5))
def R(*cols): return [c if isinstance(c, tuple) else rgb(c) for c in cols]

GOLD = R('#5c3a0c', '#a06e18', '#d6a42c', '#f6d25a', '#fff4aa')
STEEL = R('#28303a', '#54626f', '#8c9ca8', '#c8d6e0', '#f6faff')
TIER = [R('#2e3034', '#5c6066', '#969aa0', '#ccd0d4', '#f4f6f8'),         # common (white/grey)
        R('#141e5c', '#2c40aa', '#5c78ec', '#96b0ff', '#d6e2ff'),         # magic (blue)
        R('#644c06', '#aa840c', '#e6c428', '#fff064', '#fffcbe'),         # rare (yellow)
        R('#562206', '#96420e', '#ce6a1e', '#f69a40', '#ffd696')]         # legendary (orange)
WOOD = R('#28180c', '#4a2e18', '#6e4826', '#966a3a', '#be8c54')
LEATHER = R('#2a1a10', '#503420', '#7a5232', '#a47448', '#caa070')
RED = R('#4a0e10', '#861c1c', '#c0302a', '#e8604a', '#fa9a80')
BLUE = R('#08225a', '#145aa8', '#2896f0', '#78d2ff', '#e6faff')
GREEN = R('#0a3a22', '#1a7a42', '#34b86a', '#7ae8a0', '#d2ffe0')
PAPER = R('#6a5c44', '#a89870', '#d8caa0', '#f2e8c8', '#fffaec')
OUT = (14, 10, 8)

class Cv:
    def __init__(s):
        s.g = [[None] * N for _ in range(N)]
    def put(s, x, y, c):
        if 0 <= x < N and 0 <= y < N: s.g[y][x] = c
    def shape(s, inside, ramp, tf=None, bbox=(0, 0, N, N)):
        x0, y0, x1, y1 = bbox
        for y in range(y0, y1):
            for x in range(x0, x1):
                if inside(x + .5, y + .5):
                    u = (x - x0) / max(1, x1 - x0 - 1); v = (y - y0) / max(1, y1 - y0 - 1)
                    t = tf(u, v, x, y) if tf else 0.78 - 0.5 * u - 0.28 * v
                    s.put(x, y, ramp[min(4, max(0, int(t * 5)))])
    def rect(s, x0, y0, x1, y1, ramp, tf=None):
        s.shape(lambda x, y: x0 <= x <= x1 + 1 and y0 <= y <= y1 + 1, ramp, tf, (x0, y0, x1 + 1, y1 + 1))
    def ell(s, cx, cy, rx, ry, ramp, tf=None):
        s.shape(lambda x, y: ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1, ramp, tf, (int(cx - rx) - 1, int(cy - ry) - 1, int(cx + rx) + 2, int(cy + ry) + 2))
    def poly(s, pts, ramp, tf=None):
        xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
        def inside(x, y):
            c = False; j = len(pts) - 1
            for i in range(len(pts)):
                xi, yi = pts[i]; xj, yj = pts[j]
                if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / (yj - yi + 1e-9) + xi: c = not c
                j = i
            return c
        s.shape(inside, ramp, tf, (int(min(xs)), int(min(ys)), int(max(xs)) + 2, int(max(ys)) + 2))
    def line(s, x0, y0, x1, y1, col, t=1):
        n = int(max(abs(x1 - x0), abs(y1 - y0)) * 2) + 1
        for i in range(n + 1):
            x = x0 + (x1 - x0) * i / n; y = y0 + (y1 - y0) * i / n
            for dx in range(t):
                for dy in range(t): s.put(int(x) + dx, int(y) + dy, col)
    def tline(s, x0, y0, x1, y1, ramp, t=3):
        n = int(max(abs(x1 - x0), abs(y1 - y0)) * 2) + 1
        for i in range(n + 1):
            x = x0 + (x1 - x0) * i / n; y = y0 + (y1 - y0) * i / n
            for dx in range(t):
                for dy in range(t):
                    k = (dx + dy) / max(1, 2 * (t - 1))
                    s.put(int(x) + dx, int(y) + dy, ramp[min(4, int((0.85 - 0.6 * k) * 5))])
    def px(s, x, y, c): s.put(x, y, c)
    def image(s, outline=True):
        g = [r[:] for r in s.g]
        if outline:
            for y in range(N):
                for x in range(N):
                    if s.g[y][x] is None:
                        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                            xx, yy = x + dx, y + dy
                            if 0 <= xx < N and 0 <= yy < N and s.g[yy][xx] is not None: g[y][x] = OUT; break
        return g

def epx(g, W, H):
    at = lambda x, y: g[min(max(y, 0), H - 1)][min(max(x, 0), W - 1)]
    o = [[None] * (W * 2) for _ in range(H * 2)]
    for y in range(H):
        for x in range(W):
            P = at(x, y); A = at(x, y - 1); B = at(x + 1, y); C = at(x - 1, y); D = at(x, y + 1)
            r1 = r2 = r3 = r4 = P
            if C == A and C != D and A != B: r1 = A
            if A == B and A != C and B != D: r2 = B
            if D == C and D != B and C != A: r3 = C
            if B == D and B != A and D != C: r4 = D
            o[2*y][2*x] = r1; o[2*y][2*x+1] = r2; o[2*y+1][2*x] = r3; o[2*y+1][2*x+1] = r4
    return o

def to_png(g):
    W = len(g[0]); H = len(g)
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    for y in range(H):
        for x in range(W):
            c = g[y][x]
            if c is not None: im.putpixel((x, y), tuple(int(v) for v in c) + (255,))
    return im

# ---------------------------------------------------------------- icon drawers
def coin():
    c = Cv()
    c.ell(12, 12, 10, 10, GOLD, lambda u, v, x, y: 0.82 - 0.5 * u - 0.22 * v)
    c.ell(12, 12, 7.2, 7.2, GOLD, lambda u, v, x, y: 0.40 + 0.34 * u + 0.18 * v)       # inner dish (reverse shading)
    c.ell(12, 12, 6, 6, GOLD, lambda u, v, x, y: 0.72 - 0.38 * u - 0.2 * v)
    c.poly([(12, 7.5), (16, 12), (12, 16.5), (8, 12)], GOLD, lambda u, v, x, y: 0.28 + 0.30 * (1 - u) + 0.12 * (1 - v))
    c.px(7, 6, GOLD[4]); c.px(8, 5, GOLD[4]); c.px(6, 8, GOLD[4])
    return c

def gem():
    c = Cv()
    P = BLUE
    c.poly([(6, 5), (18, 5), (22, 10), (12, 22), (2, 10)], P, lambda u, v, x, y: 0.5)
    c.poly([(7, 5), (17, 5), (15, 10), (9, 10)], P, lambda u, v, x, y: 0.92)            # table
    c.poly([(6, 5), (7, 5), (9, 10), (2, 10)], P, lambda u, v, x, y: 0.62)              # crown left
    c.poly([(17, 5), (18, 5), (22, 10), (15, 10)], P, lambda u, v, x, y: 0.36)          # crown right
    c.poly([(2, 10), (9, 10), (12, 22)], P, lambda u, v, x, y: 0.56)                    # pavilion left
    c.poly([(9, 10), (15, 10), (12, 22)], P, lambda u, v, x, y: 0.74)                   # pavilion mid
    c.poly([(15, 10), (22, 10), (12, 22)], P, lambda u, v, x, y: 0.22)                  # pavilion right
    c.px(9, 6, P[4]); c.px(10, 6, P[4]); c.px(8, 7, P[4]); c.px(4, 9, P[4]); c.px(5, 9, P[4])
    return c

def key(metal):
    c = Cv()
    rp = metal
    # bow
    c.ell(7.5, 7.5, 6, 6, rp, lambda u, v, x, y: 0.82 - 0.5 * u - 0.25 * v)
    c.ell(7.5, 7.5, 2.6, 2.6, [None] * 5)
    for y in range(N):
        for x in range(N):
            if ((x + .5 - 7.5) ** 2 + (y + .5 - 7.5) ** 2) <= 2.6 ** 2: c.g[y][x] = None
    c.tline(11, 11, 21, 21, rp, 3)
    c.rect(17, 18, 21, 19, rp, lambda u, v, x, y: 0.5)
    c.rect(15, 16, 18, 17, rp, lambda u, v, x, y: 0.45)
    c.px(5, 4, rp[4]); c.px(6, 3, rp[4])
    return c

def chest(body, metal):
    c = Cv()
    c.rect(3, 11, 20, 20, body, lambda u, v, x, y: 0.7 - 0.38 * u - 0.28 * v)
    # lid (arched)
    c.shape(lambda x, y: y <= 12.5 and ((x - 12) / 9.2) ** 2 + ((y - 12.5) / 7.5) ** 2 <= 1, body, lambda u, v, x, y: 0.82 - 0.42 * u - 0.5 * v, (2, 4, 22, 13))
    for x in range(3, 21): c.put(x, 12, body[0])                                     # seam
    c.rect(6, 5, 8, 20, metal, lambda u, v, x, y: 0.82 - 0.3 * u)
    c.rect(15, 5, 17, 20, metal, lambda u, v, x, y: 0.62 - 0.3 * u)
    c.rect(3, 19, 20, 20, metal, lambda u, v, x, y: 0.4)
    c.rect(10, 10, 13, 15, metal, lambda u, v, x, y: 0.86 - 0.4 * u)                  # lock plate
    c.px(11, 12, OUT); c.px(11, 13, OUT); c.px(12, 12, OUT)
    c.px(5, 8, body[4]); c.px(4, 9, body[4]);
    return c

def item(kind, tier):
    c = Cv(); p = TIER[tier]; d = LEATHER
    if kind == 'helm':
        c.shape(lambda x, y: ((x - 12) / 8.5) ** 2 + ((y - 11) / 8.5) ** 2 <= 1 and y <= 12, p, lambda u, v, x, y: 0.85 - 0.55 * u - 0.2 * v, (3, 2, 21, 13))
        c.rect(3.5 and 4, 11, 19, 18, p, lambda u, v, x, y: 0.82 - 0.5 * u)
        c.rect(7, 13, 17, 14, [OUT] * 5)                                                # visor slit
        c.rect(11, 11, 12, 18, p, lambda u, v, x, y: 0.4)                               # nose guard
        c.rect(10, 19, 14, 20, p, lambda u, v, x, y: 0.4)
        c.rect(11, 0, 12, 3, RED, lambda u, v, x, y: 0.6)                               # plume
        c.rect(10, 1, 13, 2, RED, lambda u, v, x, y: 0.7)
        c.px(7, 6, p[4]); c.px(8, 5, p[4]); c.px(6, 8, p[4])
    elif kind == 'armor':
        c.poly([(2, 5), (7, 3), (17, 3), (22, 5), (21, 10), (18, 12), (17, 21), (7, 21), (6, 12), (3, 10)], p, lambda u, v, x, y: 0.84 - 0.5 * u - 0.15 * v)
        c.rect(9, 3, 14, 5, d, lambda u, v, x, y: 0.2)                                  # neckline
        c.rect(11, 6, 12, 19, p, lambda u, v, x, y: 0.95)                               # ridge
        c.rect(7, 15, 17, 16, d, lambda u, v, x, y: 0.55)                               # belt
        c.rect(11, 15, 13, 16, GOLD, lambda u, v, x, y: 0.8)
        c.ell(5.5, 6.5, 3.2, 2.8, p, lambda u, v, x, y: 0.9 - 0.4 * u); c.ell(18.5, 6.5, 3.2, 2.8, p, lambda u, v, x, y: 0.5 - 0.2 * u)
        c.px(5, 5, p[4]); c.px(6, 5, p[4])
    elif kind == 'gloves':
        c.rect(6, 10, 17, 19, p, lambda u, v, x, y: 0.82 - 0.45 * u - 0.15 * v)
        for i, x0 in enumerate((6, 9, 12, 15)):
            c.rect(x0, 5 + (i % 2 == 1 and 0 or 1) - (1 if i in (1, 2) else 0), x0 + 2, 11, p, lambda u, v, x, y: 0.85 - 0.5 * u)
        c.poly([(2, 11), (6, 11), (7, 16), (4, 17)], p, lambda u, v, x, y: 0.9 - 0.3 * v)   # thumb
        c.rect(5, 19, 18, 22, d, lambda u, v, x, y: 0.7 - 0.4 * v)                           # cuff
        c.rect(5, 19, 18, 19, GOLD, lambda u, v, x, y: 0.7)
        c.px(7, 12, p[4]); c.px(10, 7, p[4])
    elif kind == 'boots':
        c.poly([(7, 2), (15, 2), (15, 13), (21, 15), (22, 20), (5, 20), (5, 15), (7, 14)], p, lambda u, v, x, y: 0.82 - 0.5 * u - 0.15 * v)
        c.rect(5, 19, 22, 21, [(20, 14, 10)] * 5)
        c.rect(7, 2, 15, 4, d, lambda u, v, x, y: 0.55)                                  # cuff
        c.rect(7, 2, 15, 2, p, lambda u, v, x, y: 0.9)
        c.line(7, 9, 15, 9, p[0]); c.line(7, 12, 15, 12, p[0])
        c.px(8, 6, p[4]); c.px(8, 7, p[4])
    elif kind == 'sword':
        c.tline(18.5, 2.5, 8, 13, p, 3)
        c.px(17, 3, p[4]); c.px(16, 4, p[4]); c.px(14, 6, p[4])
        c.tline(5, 11.5, 12, 16, GOLD, 2)
        c.tline(11, 12, 6, 17, GOLD, 2) if False else None
        c.tline(4.5, 18.5, 9, 14, LEATHER, 2)
        c.ell(4, 20, 2, 2, GOLD, lambda u, v, x, y: 0.7 - 0.3 * u)
    return c

def glyph(name):
    c = Cv(); g = GOLD
    if name == 'heroes':
        return item('helm', 2)
    if name == 'bag':
        c.poly([(5, 9), (19, 9), (21, 20), (3, 20)], LEATHER, lambda u, v, x, y: 0.8 - 0.5 * u - 0.2 * v)
        c.poly([(5, 6), (19, 6), (19, 12), (12, 14), (5, 12)], LEATHER, lambda u, v, x, y: 0.9 - 0.4 * u)
        c.rect(10, 11, 13, 15, g, lambda u, v, x, y: 0.85 - 0.3 * u)
        c.rect(8, 3, 15, 5, LEATHER, lambda u, v, x, y: 0.7)
        c.px(7, 11, LEATHER[4]); c.px(6, 13, LEATHER[4])
    elif name == 'shop':
        c.ell(12, 15, 8.5, 7, LEATHER, lambda u, v, x, y: 0.8 - 0.5 * u - 0.25 * v)
        c.poly([(8, 9), (16, 9), (15, 5), (9, 5)], LEATHER, lambda u, v, x, y: 0.7)
        c.rect(8, 8, 15, 9, RED, lambda u, v, x, y: 0.7)
        c.ell(12, 15, 3.2, 3.2, GOLD, lambda u, v, x, y: 0.85 - 0.4 * u)
        c.px(7, 12, LEATHER[4])
    elif name == 'battle':
        c.tline(18, 3, 5, 16, STEEL, 3); c.tline(5, 3, 18, 16, STEEL, 3)
        c.tline(3, 14, 8, 19, GOLD, 2); c.tline(20, 14, 15, 19, GOLD, 2)
        c.tline(3, 19, 6, 22, LEATHER, 2); c.tline(20, 19, 17, 22, LEATHER, 2)
    elif name == 'tasks':
        c.rect(5, 3, 18, 21, PAPER, lambda u, v, x, y: 0.85 - 0.3 * u - 0.15 * v)
        c.rect(4, 3, 19, 5, WOOD, lambda u, v, x, y: 0.7); c.rect(4, 19, 19, 21, WOOD, lambda u, v, x, y: 0.7)
        for k, y in enumerate((8, 12, 16)):
            c.line(7, y, 9, y + 2 if k < 2 else y + 1, GREEN[2], 1) if False else None
            c.px(7, y + 1, GREEN[2]); c.px(8, y + 2, GREEN[2]); c.px(9, y + 1, GREEN[2]); c.px(10, y, GREEN[2])
            c.line(12, y + 1, 16, y + 1, (110, 92, 66), 1)
    elif name == 'calendar':
        c.rect(3, 5, 20, 21, PAPER, lambda u, v, x, y: 0.85 - 0.3 * u - 0.15 * v)
        c.rect(3, 5, 20, 9, RED, lambda u, v, x, y: 0.7 - 0.3 * u)
        c.rect(7, 2, 8, 6, STEEL, lambda u, v, x, y: 0.7); c.rect(15, 2, 16, 6, STEEL, lambda u, v, x, y: 0.7)
        for yy in (12, 16):
            for xx in (6, 10, 14, 17):
                c.rect(xx, yy, xx + 1, yy + 1, WOOD, lambda u, v, x, y: 0.5)
        c.rect(14, 16, 15, 17, RED, lambda u, v, x, y: 0.8)
    elif name == 'mail':
        c.rect(2, 6, 21, 19, PAPER, lambda u, v, x, y: 0.85 - 0.3 * u - 0.15 * v)
        c.poly([(2, 6), (21, 6), (12, 14)], PAPER, lambda u, v, x, y: 0.55 + 0.2 * v)
        c.line(3, 7, 12, 13, (110, 92, 66), 1); c.line(20, 7, 12, 13, (110, 92, 66), 1)
        c.ell(12, 14, 2.2, 2.2, RED, lambda u, v, x, y: 0.8 - 0.4 * u)
    elif name == 'guild':
        c.poly([(3, 3), (21, 3), (21, 13), (12, 22), (3, 13)], BLUE, lambda u, v, x, y: 0.82 - 0.5 * u - 0.2 * v)
        c.rect(3, 3, 21, 5, g, lambda u, v, x, y: 0.75 - 0.3 * u)
        c.rect(11, 6, 13, 17, g, lambda u, v, x, y: 0.8 - 0.3 * u); c.rect(7, 9, 17, 11, g, lambda u, v, x, y: 0.8 - 0.3 * v)
    elif name == 'friends':
        c.ell(8, 8, 3.6, 3.8, LEATHER, lambda u, v, x, y: 0.9 - 0.4 * u - 0.2 * v)
        c.shape(lambda x, y: y >= 12 and ((x - 8) / 6.5) ** 2 + ((y - 20) / 8) ** 2 <= 1, BLUE, lambda u, v, x, y: 0.8 - 0.5 * u, (1, 12, 16, 22))
        c.ell(16.5, 9.5, 3.3, 3.5, LEATHER, lambda u, v, x, y: 0.9 - 0.4 * u - 0.2 * v)
        c.shape(lambda x, y: y >= 13 and ((x - 16.5) / 6) ** 2 + ((y - 21) / 8) ** 2 <= 1, GREEN, lambda u, v, x, y: 0.8 - 0.5 * u, (10, 13, 23, 22))
    elif name == 'settings':
        for a in range(0, 360, 45):
            x = 12 + 9 * math.cos(math.radians(a)); y = 12 + 9 * math.sin(math.radians(a))
            c.ell(x, y, 2.4, 2.4, STEEL, lambda u, v, x_, y_: 0.8 - 0.4 * u)
        c.ell(12, 12, 8, 8, STEEL, lambda u, v, x, y: 0.82 - 0.5 * u - 0.25 * v)
        for y in range(N):
            for x in range(N):
                if (x + .5 - 12) ** 2 + (y + .5 - 12) ** 2 <= 3.2 ** 2: c.g[y][x] = None
    elif name == 'hourglass':
        c.rect(5, 2, 18, 4, WOOD, lambda u, v, x, y: 0.7); c.rect(5, 19, 18, 21, WOOD, lambda u, v, x, y: 0.7)
        c.poly([(6, 4), (17, 4), (12, 12)], BLUE, lambda u, v, x, y: 0.6 + 0.2 * (1 - u))
        c.poly([(12, 12), (6, 19), (17, 19)], GOLD, lambda u, v, x, y: 0.5 + 0.3 * v)
        c.poly([(12, 12), (6, 19), (17, 19)], GOLD, lambda u, v, x, y: 0.4) if False else None
        c.px(8, 5, BLUE[4]); c.px(9, 6, BLUE[4])
    elif name == 'gift':
        c.rect(4, 11, 19, 21, RED, lambda u, v, x, y: 0.75 - 0.4 * u - 0.15 * v)
        c.rect(3, 8, 20, 12, RED, lambda u, v, x, y: 0.88 - 0.4 * u)
        c.rect(11, 8, 12, 21, GOLD, lambda u, v, x, y: 0.82 - 0.3 * u)
        c.ell(8, 6, 3.2, 2.4, GOLD, lambda u, v, x, y: 0.8 - 0.3 * u); c.ell(15, 6, 3.2, 2.4, GOLD, lambda u, v, x, y: 0.7 - 0.3 * u)
    elif name == 'lock':
        c.shape(lambda x, y: y <= 11 and ((x - 12) / 6) ** 2 + ((y - 11) / 7) ** 2 <= 1 and ((x - 12) / 3.4) ** 2 + ((y - 11) / 4.4) ** 2 >= 1, STEEL, None, (5, 3, 19, 12))
        c.rect(5, 10, 18, 21, g, lambda u, v, x, y: 0.82 - 0.4 * u - 0.2 * v)
        c.rect(11, 14, 12, 18, OUT and WOOD, lambda u, v, x, y: 0.1)
    elif name == 'star':
        pts = []
        for i in range(10):
            r = 10 if i % 2 == 0 else 4.4
            a = math.radians(-90 + i * 36)
            pts.append((12 + r * math.cos(a), 12.5 + r * math.sin(a)))
        c.poly(pts, GOLD, lambda u, v, x, y: 0.85 - 0.45 * u - 0.15 * v)
    elif name == 'check':
        for i in range(4): c.rect(4 + i, 11 + i, 5 + i, 12 + i, GREEN, lambda u, v, x, y: 0.7)
        for i in range(9): c.rect(8 + i, 14 - i, 9 + i, 15 - i, GREEN, lambda u, v, x, y: 0.7)
    elif name == 'sword_up':
        return item('sword', 3)
    return c

def build():
    out = {}
    def add(name, cv, outline=True):
        g = cv.image(outline)
        hd = epx(g, N, N)
        out[name] = 'data:image/png;base64,' + base64.b64encode(_png(to_png(hd))).decode()
        sheet.append((name, to_png(hd)))
    def _png(im):
        b = io.BytesIO(); im.save(b, 'PNG', optimize=True); return b.getvalue()
    sheet = []
    add('gold', coin()); add('gem', gem())
    add('key_bronze', key(R('#3c2210', '#7a4a22', '#b8793a', '#e0a468', '#ffd8a4')))
    add('key_silver', key(STEEL)); add('key_gold', key(GOLD))
    add('chest_bronze', chest(WOOD, R('#3c2210', '#7a4a22', '#b8793a', '#e0a468', '#ffd8a4')))
    add('chest_silver', chest(WOOD, STEEL)); add('chest_gold', chest(WOOD, GOLD))
    for t in range(4):
        for k in ('helm', 'armor', 'gloves', 'boots', 'sword'):
            add('item_%s_%d' % (k, t), item(k, t))
    for n in ('heroes', 'bag', 'shop', 'battle', 'tasks', 'calendar', 'mail', 'guild', 'friends', 'settings', 'hourglass', 'gift', 'lock', 'star', 'check'):
        add('ui_' + n, glyph(n))
    return out, sheet

if __name__ == '__main__':
    out, sheet = build()
    json.dump(out, open('/mnt/user-data/working/src19/assets/icons.json', 'w'))
    cols = 10; S = 2
    cell = N * 2 * S + 8
    rows = (len(sheet) + cols - 1) // cols
    im = Image.new('RGBA', (cols * cell, rows * cell), (34, 28, 24, 255))
    for i, (n, ic) in enumerate(sheet):
        big = ic.resize((ic.width * S, ic.height * S), Image.NEAREST)
        im.alpha_composite(big, ((i % cols) * cell + 4, (i // cols) * cell + 4))
    im.save('/mnt/user-data/working/src19/assets/icons_sheet.png')
    print(len(out), sum(len(v) for v in out.values()))
