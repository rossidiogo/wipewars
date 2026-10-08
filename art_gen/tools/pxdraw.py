"""Tiny procedural pixel-art kit (shapes on a label grid -> bevel shading + side shading + 1px outline + rim light).
Used by draw_glem.py / draw_glem_tiger.py (draw_rubens.py has its own older copy of the same pipeline)."""
import os
from PIL import Image

R = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
OUTLINE = (22, 18, 30)


def flat(c):
    return (c, c, c)


class Kit:
    def __init__(self, W, H, pal, flats=()):
        self.W, self.H, self.pal, self.flats = W, H, pal, set(flats)
        self.lab = [[None] * W for _ in range(H)]

    def put(self, x, y, k):
        if 0 <= x < self.W and 0 <= y < self.H:
            self.lab[y][x] = k

    def get(self, x, y):
        return self.lab[y][x] if 0 <= x < self.W and 0 <= y < self.H else None

    def ell(self, cx, cy, rx, ry, k, only=None):
        for y in range(int(cy - ry) - 1, int(cy + ry) + 2):
            for x in range(int(cx - rx) - 1, int(cx + rx) + 2):
                if ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1.0 and (only is None or self.get(x, y) in only):
                    self.put(x, y, k)

    def rect(self, x0, y0, x1, y1, k, only=None):
        for y in range(y0, y1 + 1):
            for x in range(x0, x1 + 1):
                if 0 <= x < self.W and 0 <= y < self.H and (only is None or self.lab[y][x] in only):
                    self.put(x, y, k)

    def pts(self, lst, k):
        for x, y in lst:
            self.put(x, y, k)

    def line(self, x0, y0, x1, y1, k, th=1):
        n = max(abs(x1 - x0), abs(y1 - y0), 1)
        for i in range(n + 1):
            x = round(x0 + (x1 - x0) * i / n)
            y = round(y0 + (y1 - y0) * i / n)
            for t in range(th):
                self.put(x + t, y, k)

    def render(self, name, shade_sets=()):
        W, H, lab, pal, flats = self.W, self.H, self.lab, self.pal, self.flats
        img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        px = img.load()

        def same(x, y, k):
            return 0 <= x < W and 0 <= y < H and lab[y][x] == k
        for y in range(H):
            for x in range(W):
                k = lab[y][x]
                if not k:
                    continue
                base, light, dark = pal[k]
                c = base
                if k not in flats:
                    if not same(x - 1, y - 1, k) or (not same(x, y - 1, k) and not same(x - 1, y, k)):
                        c = light
                    elif not same(x + 1, y + 1, k) or (not same(x, y + 1, k) and not same(x + 1, y, k)):
                        c = dark
                px[x, y] = c + (255,)
        # side shading: right ~30% of every horizontal run of big shapes
        for y in range(H):
            x = 0
            while x < W:
                k = lab[y][x]
                if k in shade_sets:
                    x1 = x
                    while x1 + 1 < W and lab[y][x1 + 1] == k:
                        x1 += 1
                    n = x1 - x + 1
                    if n >= 5:
                        for xx in range(x1 - max(1, n * 3 // 10) + 1, x1 + 1):
                            px[xx, y] = pal[k][2] + (255,)
                    x = x1 + 1
                else:
                    x += 1
        # contact shadow below dark/overhanging shapes
        for y in range(1, H):
            for x in range(W):
                k = lab[y][x]
                if k and k not in flats and k != lab[y - 1][x] and lab[y - 1][x] in ('beard', 'hair', 'brim', 'cap'):
                    px[x, y] = pal[k][2] + (255,)
        # outline
        o = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        op = o.load()
        for y in range(H):
            for x in range(W):
                if px[x, y][3] == 0:
                    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                        nx, ny = x + dx, y + dy
                        if 0 <= nx < W and 0 <= ny < H and px[nx, ny][3]:
                            op[x, y] = OUTLINE + (255,)
                            break
        for y in range(H):
            for x in range(W):
                if op[x, y][3]:
                    px[x, y] = op[x, y]
        # rim light on the right edge
        for y in range(H):
            for x in range(W - 1):
                if px[x, y][3] and px[x, y][:3] != OUTLINE and px[x + 1, y][:3] == OUTLINE:
                    kk = lab[y][x]
                    if kk and kk not in flats:
                        px[x, y] = pal[kk][1] + (255,)
        out = os.path.join(R, 'out', 'clean')
        os.makedirs(out, exist_ok=True)
        p = os.path.join(out, name + '.png')
        img.save(p)
        img.resize((W * 4, H * 4), Image.NEAREST).save(p.replace('.png', '_x4.png'))
        cols = len(set(px[x, y] for y in range(H) for x in range(W) if px[x, y][3]))
        print(p, cols, 'colors')
        return p
