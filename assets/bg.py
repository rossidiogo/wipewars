import math, random, io, base64, json, sys
from PIL import Image

def clamp(v, a=0.0, b=1.0): return max(a, min(b, v))
def mulc(c, f): return (c[0]*f, c[1]*f, c[2]*f)
def addc(c, d): return (c[0]+d[0], c[1]+d[1], c[2]+d[2])
def lerp(a, b, t): return (a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t, a[2]+(b[2]-a[2])*t)
def ramp(r, t):
    i = int(clamp(t) * len(r))
    return r[min(len(r)-1, i)]
def hsh(x, y, s=0):
    n = (x*374761393 + y*668265263 + s*2147483647) & 0xffffffff
    n = ((n ^ (n >> 13)) * 1274126177) & 0xffffffff
    return ((n ^ (n >> 16)) & 0xffff) / 65535.0

POR = [(58, 72, 88), (96, 116, 132), (142, 164, 178), (190, 208, 218), (232, 242, 246)]   # porcelain, dark -> light
SEAT = [(78, 88, 92), (122, 134, 138), (170, 182, 184), (214, 222, 222), (244, 248, 246)]
STEEL = [(40, 48, 54), (84, 98, 108), (140, 156, 164), (200, 214, 220), (246, 250, 252)]
GLOW = [(4, 20, 18), (10, 46, 38), (26, 96, 66), (70, 170, 104), (170, 240, 170)]
RED = [(70, 14, 16), (130, 26, 28), (186, 44, 40), (226, 84, 66), (250, 150, 120)]
WOOD = [(40, 26, 18), (74, 48, 30), (110, 74, 44), (150, 106, 62), (190, 146, 90)]
OUT = (12, 20, 22)

def scene(W, H, yh, tcx, tbase, wide):
    buf = [[(0, 0, 0)]*W for _ in range(H)]
    obj = [[0]*W for _ in range(H)]
    def put(x, y, c, o=0):
        if 0 <= x < W and 0 <= y < H:
            buf[y][x] = c
            if o: obj[y][x] = o
    # ---------- wall: staggered subway tiles ----------
    TW, TH = 16, 8
    for y in range(0, yh):
        r = y // TH; off = (r % 2) * (TW // 2)
        for x in range(W):
            i = (x + off) // TW; lx = (x + off) % TW; ly = y % TH
            v = (hsh(i, r) - 0.5) * 7
            base = (66 + v, 98 + v, 98 + v)
            if lx == 0 or ly == 0: c = (24, 38, 40)
            elif lx == 1 or ly == 1: c = addc(base, (26, 30, 28))
            elif lx == TW-1 or ly == TH-1: c = mulc(base, 0.78)
            else: c = base
            put(x, y, c)
    # wainscot (darker band) + trim
    wy = yh - 26
    for y in range(wy, yh):
        r = (y - wy) // 10; ly = (y - wy) % 10
        for x in range(W):
            i = x // 14; lx = x % 14
            v = (hsh(i, r, 5) - 0.5) * 6
            base = (38 + v, 64 + v, 58 + v)
            if lx == 0 or ly == 0: c = (14, 24, 22)
            elif lx == 1 or ly == 1: c = addc(base, (22, 26, 22))
            elif lx == 13 or ly == 9: c = mulc(base, 0.74)
            else: c = base
            put(x, y, c)
    for x in range(W):
        put(x, wy - 2, (150, 136, 104)); put(x, wy - 1, (186, 172, 136)); put(x, wy, (96, 82, 62)); put(x, wy + 1, (60, 50, 40))
        put(x, yh - 1, (14, 22, 22)); put(x, yh - 2, (30, 44, 40))
    # grime / water streaks on the wall
    for sx, ln in ((int(W*0.27), 34), (int(W*0.74), 40), (int(W*0.46), 22), (int(W*0.9), 28)):
        for y in range(4, 4 + ln):
            for dx in (0, 1):
                x = sx + dx
                if 0 <= x < W and y < wy - 2:
                    f = 0.90 if (hsh(x, y, 9) > 0.35) else 0.96
                    buf[y][x] = mulc(buf[y][x], f)
    # cracks
    def crack(x, y, steps, seed):
        for k in range(steps):
            if 0 <= x < W and 0 <= y < wy - 2: buf[y][x] = (16, 22, 24)
            x += 1 if hsh(k, seed) > 0.62 else (-1 if hsh(k, seed, 3) > 0.7 else 0)
            y += 1
    crack(int(W*0.60), 8, 22, 1); crack(int(W*0.32), 30, 16, 2); crack(int(W*0.86), 6, 14, 3)
    # ---------- floor: perspective checker ----------
    K, A = (60.0, 0.66) if wide else (150.0, 0.27)
    for y in range(yh, H):
        dz = y - yh + 1.0
        v = K / dz
        fv = v - math.floor(v)
        for x in range(W):
            u = (x - W/2) / (dz * A)
            fu = u - math.floor(u)
            chk = (math.floor(u) + math.floor(v)) & 1
            base = (92, 100, 94) if chk == 0 else (58, 66, 64)
            n = (hsh(x // 3, y // 2, 4) - 0.5) * 7
            c = (base[0] + n, base[1] + n, base[2] + n)
            gw = 0.55 / max(1, dz * A / 14.0)
            gh = 0.55 / max(1, dz / 14.0)
            if min(fu, 1 - fu) * (dz * A) < 1.0 or min(fv, 1 - fv) * (dz * dz / K) < 1.0:
                c = (22, 28, 28)
            elif min(fu, 1 - fu) * (dz * A) < 2.0 or fv < 0.06 and dz > 20:
                c = addc(c, (14, 14, 12))
            # far tiles darker (distance haze)
            c = lerp(c, (30, 46, 46), clamp(1 - dz / 46.0) * 0.55)
            put(x, y, c)
    put_floor_base = yh
    # baseboard at wall/floor seam
    for x in range(W):
        for k in range(3): put(x, yh + k, mulc((38, 44, 42), 1.0 - 0.18*k))
    # ---------- helpers for shaded shapes ----------
    def ell(cx, cy, rx, ry, fn, o):
        for y in range(int(cy - ry) - 1, int(cy + ry) + 2):
            for x in range(int(cx - rx) - 1, int(cx + rx) + 2):
                nx = (x + 0.5 - cx) / rx; ny = (y + 0.5 - cy) / ry
                if nx*nx + ny*ny <= 1.0:
                    c = fn(nx, ny, x, y)
                    if c is not None: put(x, y, c, o)
    def rrect(x0, y0, x1, y1, r, fn, o):
        for y in range(y0, y1 + 1):
            for x in range(x0, x1 + 1):
                cx = min(max(x, x0 + r), x1 - r); cy = min(max(y, y0 + r), y1 - r)
                if (x - cx)**2 + (y - cy)**2 <= r*r + 0.3:
                    nx = (x - x0) / max(1, x1 - x0) * 2 - 1; ny = (y - y0) / max(1, y1 - y0) * 2 - 1
                    c = fn(nx, ny, x, y)
                    if c is not None: put(x, y, c, o)
    def shade_por(nx, ny, ramp_=POR, spec=True, dark=0.0):
        t = 0.70 - 0.46 * nx - 0.05 * ny - dark
        if spec and -0.62 < nx < -0.50 and abs(ny) < 0.62: t = 1.0
        if nx > 0.86: t = 0.04
        return ramp(ramp_, t)

    ox, oy = tcx - 96, tbase - 124
    # ---------- sink + mirror (left) ----------
    mx0 = 10; my0 = max(8, yh - 82)
    rrect(mx0, my0, mx0 + 30, my0 + 40, 2, lambda nx, ny, x, y: (150, 118, 62) if (abs(nx) > 0.86 or abs(ny) > 0.88) else
          lerp((70, 104, 112), (140, 176, 180), clamp(1 - abs(((x - mx0) - (y - my0) * 0.72) - 9) / 7.0)), 11)
    for k in range(10): put(mx0 + 8 + k // 2 + k, my0 + 6 + k * 3, (18, 26, 28), 11)     # crack in mirror
    put(mx0 + 14, my0 + 20, (18, 26, 28), 11)
    sy = yh - 30
    rrect(mx0 - 2, sy, mx0 + 32, sy + 12, 5, lambda nx, ny, x, y: shade_por(nx, ny), 12)
    rrect(mx0 + 4, sy + 2, mx0 + 26, sy + 6, 2, lambda nx, ny, x, y: ramp(GLOW, 0.2 + 0.2 * (1 - abs(nx))), 12)
    for y in range(sy + 12, yh + 2):
        for x in range(mx0 + 10, mx0 + 21):
            nx = (x - (mx0 + 10)) / 10 * 2 - 1
            put(x, y, shade_por(nx, 0.0, POR, False, 0.05), 12)
    rrect(mx0 + 13, sy - 7, mx0 + 18, sy, 1, lambda nx, ny, x, y: ramp(STEEL, 0.6 - 0.4 * nx), 12)
    # ---------- window (right) with night sky ----------
    wx0 = W - 44; wy0 = max(4, yh - 96); ww, wh = 32, 26
    for y in range(wy0, wy0 + wh):
        for x in range(wx0, wx0 + ww):
            fr = x < wx0 + 2 or x >= wx0 + ww - 2 or y < wy0 + 2 or y >= wy0 + wh - 2 or abs(x - (wx0 + ww // 2)) < 1 or abs(y - (wy0 + wh // 2)) < 1
            if fr: c = ramp(WOOD, 0.55 + 0.25 * (1 - (y - wy0) / wh))
            else:
                t = (y - wy0) / wh
                c = lerp((24, 38, 84), (70, 98, 170), t)
                if hsh(x, y, 11) > 0.97: c = (240, 240, 255)
            put(x, y, c, 13)
    for k in range(3):
        for x in range(wx0 - 2 + k * 0, wx0 + ww + 2):
            put(x, wy0 + wh + k, ramp(WOOD, 0.8 - 0.25 * k), 13)
    mxm, mym = wx0 + 22, wy0 + 9
    ell(mxm, mym, 4, 4, lambda nx, ny, x, y: (236, 232, 206) if nx + ny < 0.6 else (190, 188, 170), 13)
    # ---------- shelf with cleaning bottles (below window) ----------
    shy = wy0 + wh + 22
    for x in range(wx0 - 2, wx0 + ww + 2):
        put(x, shy, ramp(WOOD, 0.7), 14); put(x, shy + 1, ramp(WOOD, 0.45), 14); put(x, shy + 2, ramp(WOOD, 0.2), 14)
    def bottle(bx, h, col, cap):
        rrect(bx, shy - h, bx + 6, shy - 1, 1, lambda nx, ny, x, y: ramp(col, 0.7 - 0.35 * nx - 0.1 * ny), 14)
        rrect(bx + 1, shy - h - 4, bx + 5, shy - h, 1, lambda nx, ny, x, y: ramp(cap, 0.7 - 0.3 * nx), 14)
    bottle(wx0 + 2, 14, [(20, 50, 120), (30, 80, 170), (60, 120, 220), (110, 170, 240), (180, 220, 255)], [(150, 110, 10), (210, 160, 30), (240, 200, 60), (250, 224, 110), (255, 240, 170)])
    bottle(wx0 + 11, 11, [(110, 80, 8), (180, 140, 20), (230, 190, 40), (250, 220, 90), (255, 240, 160)], RED)
    bottle(wx0 + 20, 16, [(20, 90, 60), (30, 140, 90), (60, 190, 120), (120, 230, 160), (190, 250, 200)], [(60, 60, 64), (110, 110, 116), (160, 160, 166), (200, 200, 206), (240, 240, 244)])
    # ---------- floor shadow + glow under the toilet ----------
    for y in range(max(yh, tbase - 6), tbase + 16):
        for x in range(tcx - 70, tcx + 70):
            d = ((x - tcx) / 56.0)**2 + ((y - (tbase + 3)) / 8.5)**2
            if 0 <= x < W and y < H and d < 1: buf[y][x] = mulc(buf[y][x], 1 - 0.62 * (1 - d)**0.6)
    # contact shadow (tight, dark) so the toilet sits on the floor
    for y in range(max(yh, tbase - 3), min(H, tbase + 9)):
        for x in range(tcx - 46, tcx + 47):
            d = ((x - tcx) / 40.0)**2 + ((y - (tbase + 2)) / 5.0)**2
            if 0 <= x < W and d < 1: buf[y][x] = mulc(buf[y][x], 1 - 0.55 * (1 - d)**0.5)
    # ---------- the big toilet ----------
    def X(v): return int(round(v + ox))
    def Y(v): return int(round(v + oy))
    # pedestal
    for y in range(Y(104), Y(124)):
        t = (y - Y(104)) / 20.0
        hw = 24 + 8 * clamp((t - 0.55) / 0.45) ** 1.6
        for x in range(int(tcx - hw), int(tcx + hw) + 1):
            nx = (x - tcx) / hw
            put(x, y, shade_por(nx, 0.0, POR, True, 0.12 + 0.12 * (t > 0.5)), 20)
    ell(tcx, Y(121), 35, 6.5, lambda nx, ny, x, y: ramp(POR, 0.62 - 0.46 * nx - 0.20 * (ny + 1) / 2 - 0.12), 20)
    ell(tcx, Y(119), 31, 4.2, lambda nx, ny, x, y: ramp(POR, 0.58 - 0.40 * nx - 0.1), 20)
    # bowl body
    def hwb(y):
        if y < 70: return 36.0
        if y < 96: return 36.0 - 2.0 * (y - 70) / 26.0
        return 34.0 - 10.0 * ((y - 96) / 10.0) ** 0.8 if y < 106 else 24.0
    for y in range(Y(66), Y(106)):
        yy = y - oy; hw = hwb(yy)
        for x in range(int(tcx - hw) - 1, int(tcx + hw) + 2):
            if abs(x - tcx) > hw: continue
            nx = (x - tcx) / hw; ny = (yy - 66) / 40.0
            dark = (0.14 if yy > 96 else 0) + (0.16 if yy < 76 else 0)
            c = shade_por(nx, 0.0, POR, True, dark)
            # waterline stain + grime
            if 77 < yy < 80 and hsh(x, y, 2) > 0.45: c = mulc(c, 0.74)
            if hsh(x // 2, y // 3, 8) > 0.965 and yy > 82: c = mulc(c, 0.72)
            put(x, y, c, 21)
    # tank
    tx0, tx1, ty0, ty1 = X(64), X(128), Y(20), Y(56)
    rrect(tx0, ty0, tx1, ty1, 4, lambda nx, ny, x, y: shade_por(nx, ny, POR, True, 0.04), 22)
    for x in range(tx0 + 3, tx1 - 2): put(x, ty0 + 6, ramp(POR, 0.1), 22)          # lid seam
    rrect(X(60), Y(14), X(132), Y(22), 3, lambda nx, ny, x, y: ramp(SEAT, 0.74 - 0.42 * nx - 0.3 * ny), 22)
    for k in range(3): put(X(63) + k, Y(16), (255, 255, 255), 22)
    ell(X(96), Y(14), 5, 3, lambda nx, ny, x, y: ramp(STEEL, 0.75 - 0.4 * nx - 0.2 * ny), 22)  # flush button
    rrect(X(54), Y(30), X(64), Y(33), 1, lambda nx, ny, x, y: ramp(STEEL, 0.8 - 0.5 * ny), 22)  # handle
    ell(X(54), Y(31), 3, 3, lambda nx, ny, x, y: ramp(STEEL, 0.7 - 0.3 * nx), 22)
    # seat ring (viewed from above) + bowl water
    scx, scy = X(96), Y(68)
    ell(scx, scy, 44, 13, lambda nx, ny, x, y: ramp(SEAT, 0.82 - 0.34 * nx - 0.30 * ny - (0.16 if nx*nx + ny*ny > 0.88 else 0)), 24)
    ell(scx, scy + 1, 33, 8.5, lambda nx, ny, x, y: None, 24)
    def water(nx, ny, x, y):
        d = math.hypot(nx * 0.95, ny * 1.0)
        t = 0.78 - d * 0.72 + 0.10 * (ny + 1) / 2
        c = ramp(GLOW, t)
        if (y + int(3 * math.sin(x * 0.45))) % 4 == 0 and t > 0.38: c = mulc(c, 1.18)
        if hsh(x, y, 14) > 0.985 and t > 0.4: c = (210, 255, 215)
        if ny < -0.35: c = mulc(c, 0.55)          # inner back wall shadow
        return c
    ell(scx, scy + 1, 33, 8.5, water, 25)
    # sheen on the seat
    for k in range(10): put(scx - 34 + k, scy - 9 + (k // 5) - int(0.06 * (k - 5) ** 2 * 0.2), (252, 255, 255), 24)
    # drip + small dark hinge blocks
    for hx2 in (X(80), X(112)): rrect(hx2, Y(55), hx2 + 6, Y(59), 1, lambda nx, ny, x, y: ramp(STEEL, 0.7 - 0.4 * ny), 24)
    # ---------- puddles with reflections ----------
    for (pcx, pcy, prx, pry) in ((int(W*0.74), yh + int((H-yh)*0.50), 20, 4.2), (int(W*0.22), yh + int((H-yh)*0.34), 14, 3.2)):
        ell(pcx, pcy, prx, pry, lambda nx, ny, x, y: (150, 206, 196) if (ny < -0.45 and -0.6 < nx < 0.1) else (lerp((30, 54, 56), (70, 120, 114), clamp(0.5 - ny * 0.5))), 29)
    # ---------- floor drain (front-left) ----------
    dx, dy = int(W * 0.5), yh + int((H - yh) * 0.78)
    ell(dx, dy, 14, 4, lambda nx, ny, x, y: ramp(STEEL, 0.5 - 0.3 * ny) if (x + y) % 3 else (12, 20, 22), 31)

    # ---------- outlines ----------
    for y in range(H):
        for x in range(W):
            if obj[y][x] == 0:
                for dx_, dy_ in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    xx, yy = x + dx_, y + dy_
                    if 0 <= xx < W and 0 <= yy < H and obj[yy][xx] not in (0, 31):
                        buf[y][x] = OUT; break
    # inner contour lines between toilet parts
    for y in range(H):
        for x in range(W):
            o = obj[y][x]
            if o in (22, 24) and x + 1 < W and obj[y][x + 1] != o and obj[y][x + 1] != 0 and o != obj[y][x + 1]:
                buf[y][x] = mulc(buf[y][x], 0.55)
            if o in (22, 21, 24, 20) and y + 1 < H and obj[y + 1][x] != o and obj[y + 1][x] not in (0, 20, 21, 22, 24, 25):
                pass
    for y in range(H - 1):
        for x in range(W):
            a, b = obj[y][x], obj[y + 1][x]
            if a != b and a in (22, 24, 21, 25) and b in (22, 24, 21, 25, 20):
                buf[y + 1][x] = mulc(buf[y + 1][x], 0.5)

    # ---------- lighting ----------
    gx, gy = tcx, Y(70)
    wsx0, wsx1 = wx0 + 4, wx0 + ww - 2
    for y in range(H):
        for x in range(W):
            c = buf[y][x]
            # global ambient: darker toward top and corners
            vg = clamp(math.hypot((x - W / 2) / (W * 0.62), (y - H * 0.50) / (H * 0.70)) - 0.38) / 0.62
            f = 1.0 - 0.58 * vg ** 1.2
            # toilet green glow
            d = math.hypot((x - gx) / 80.0, (y - gy) / 54.0)
            gl = clamp(1 - d) ** 2.0
            if obj[y][x] not in (24, 25): c = addc(c, (-8 * gl, 38 * gl, 18 * gl))
            # moonlight shaft from the window
            ym = y - (wy0 + wh)
            if ym > 0:
                ls = wsx0 - ym * 0.55; le = wsx1 - ym * 0.55
                if ls <= x <= le and obj[y][x] not in (13,):
                    edge = min(x - ls, le - x) / 5.0
                    s = clamp(edge) * clamp(1 - ym / 95.0) * 0.26
                    c = addc(c, (20 * s * 3, 34 * s * 3, 56 * s * 3))
            buf[y][x] = mulc(c, f)

    # ---------- ordered-dither quantise brightness bands (pixel-art banding) ----------
    B4 = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]
    img = Image.new('RGB', (W, H))
    for y in range(H):
        for x in range(W):
            c = buf[y][x]
            b = (B4[y % 4][x % 4] - 7.5) * 0.85
            img.putpixel((x, y), tuple(int(clamp(v + b, 0, 255)) for v in c))
    return img

def build(W, H, yh, tcx, tbase, wide, scale, path):
    random.seed(3)
    im = scene(W, H, yh, tcx, tbase, wide)
    im = im.quantize(colors=64, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).convert('RGB')
    im = im.resize((W * scale, H * scale), Image.NEAREST)
    b = io.BytesIO(); im.save(b, 'PNG', optimize=True)
    open(path, 'wb').write(b.getvalue())
    return 'data:image/png;base64,' + base64.b64encode(b.getvalue()).decode(), len(b.getvalue())

if __name__ == '__main__':
    out = {}
    u1, n1 = build(192, 176, 86, 96, 116, True, 3, '/mnt/user-data/working/src19/assets/bg_wide.png')
    u2, n2 = build(160, 336, 150, 80, 214, False, 3, '/mnt/user-data/working/src19/assets/bg_tall.png')
    json.dump({'wide': u1, 'tall': u2}, open('/mnt/user-data/working/src19/assets/bg.json', 'w'))
    print(n1, n2)
