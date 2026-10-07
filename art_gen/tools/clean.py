"""Wipe Wars art cleanup (Jacquin's required pipeline).
raw generator image (JPEG, magenta flat background) -> true pixel grid -> keyed, quantized, outlined logical sprites.

Usage:
  python clean.py IN.jpg OUTDIR NAME [--colors 24] [--min-area 200] [--expect N] [--grid P]
Outputs in OUTDIR:  NAME_<i>.png        logical-resolution transparent sprite (1 pixel = 1 art pixel)
                    NAME_<i>_x4.png     nearest-neighbor x4 preview
                    NAME_preview.png    all sprites at x3 on the game's dark panel (#1a1612)
                    NAME_report.json    detected grid, colors, sizes
"""
import json, os, sys, argparse
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi

PANEL = (0x1a, 0x16, 0x12)


def detect_period(g, pmin=4.0, pmax=16.0):
    """g: 1-D gradient profile. Returns (period, phase, confidence)."""
    n = len(g)
    mean_all = g.mean() + 1e-9
    best = []
    for p in np.arange(pmin, pmax, 0.05):
        bestph, bestv = 0, 0
        for ph in np.arange(0, p, 0.5):
            idx = np.round(np.arange(ph, n, p)).astype(int)
            idx = idx[idx < n]
            v = g[idx].mean() / mean_all
            if v > bestv:
                bestv, bestph = v, ph
        best.append((bestv, p, bestph))
    top = max(best)[0]
    # smallest local peak that is nearly as good as the best (multiples of the true period also score high)
    bs = sorted(best, key=lambda t: t[1])
    for i in range(1, len(bs) - 1):
        v, p, ph = bs[i]
        if v >= 0.7 * top and v >= bs[i - 1][0] and v >= bs[i + 1][0]:
            return p, ph, v
    return bs[0][1], bs[0][2], bs[0][0]


def grid_profile(a):
    gray = a.astype(np.float32).mean(axis=2)
    gx = np.abs(np.diff(gray, axis=1)).sum(axis=0)
    gy = np.abs(np.diff(gray, axis=0)).sum(axis=1)
    # use only strong edges so JPEG noise does not wash out the comb
    gx = np.where(gx > np.percentile(gx, 60), gx, 0)
    gy = np.where(gy > np.percentile(gy, 60), gy, 0)
    return gx, gy


def snap(a, px, ph_x, py, ph_y):
    H, W, _ = a.shape
    nx = int((W - ph_x) // px)
    ny = int((H - ph_y) // py)
    out = np.zeros((ny, nx, 3), np.uint8)
    for j in range(ny):
        y0 = ph_y + j * py
        ya, yb = int(round(y0 + .2 * py)), max(int(round(y0 + .8 * py)), int(round(y0 + .2 * py)) + 1)
        for i in range(nx):
            x0 = ph_x + i * px
            xa, xb = int(round(x0 + .2 * px)), max(int(round(x0 + .8 * px)), int(round(x0 + .2 * px)) + 1)
            blk = a[ya:yb, xa:xb].reshape(-1, 3)
            out[j, i] = np.median(blk, axis=0)
    return out


def magenta_likeness(rgb):
    r, g, b = [rgb[..., k].astype(np.float32) for k in range(3)]
    return (np.minimum(r, b) - g) / 255.0


def key_background(logical):
    m = magenta_likeness(logical)
    cand = m > 0.45
    lab, n = ndi.label(cand)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    bg = np.isin(lab, list(border)) if border else np.zeros_like(cand)
    bg = bg | (m > 0.6)          # enclosed pockets (between arms and body etc.) that are pure key colour
    # kill pink fringe: opaque blocks next to the background that still lean magenta
    for _ in range(2):
        edge = ndi.binary_dilation(bg) & ~bg
        fringe = edge & (m > 0.25)
        bg = bg | fringe
    return ~bg


def despeckle(alpha, min_px=4):
    lab, n = ndi.label(alpha, structure=np.ones((3, 3)))
    if n == 0:
        return alpha
    sizes = ndi.sum(alpha, lab, range(1, n + 1))
    keep = np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s >= min_px])
    return keep


def lift_dark(rgb, alpha, floor):
    """Raise the luminance of interior pixels darker than `floor` (outline pixels on the silhouette edge are kept)."""
    if not floor:
        return rgb
    er = ndi.binary_erosion(alpha)
    L = lum(rgb)
    edge = alpha & ~er
    ecols, ecnt = np.unique(rgb[edge], axis=0, return_counts=True)
    oc = ecols[np.argmax(ecnt)] if len(ecols) else np.array([0, 0, 0])      # the silhouette outline colour stays dark
    is_oc = (rgb == oc).all(axis=2)
    m = alpha & ~is_oc & (L < floor) & (L > 12)
    if not m.any():
        return rgb
    out = rgb.copy()
    cols, inv = np.unique(rgb[m], axis=0, return_inverse=True)   # lift per palette colour so the colour count does not grow
    cl = 0.299 * cols[:, 0] + 0.587 * cols[:, 1] + 0.114 * cols[:, 2]
    scale = (floor / np.maximum(cl, 1)) ** 0.9
    new = np.clip(cols.astype(np.float32) * scale[:, None], 0, 255).astype(np.uint8)
    out[m] = new[inv.reshape(-1)]
    return out


def _quant_subset(px, n):
    im = Image.fromarray(px.reshape(-1, 1, 3))
    q = im.quantize(colors=n, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    pal = np.array(q.getpalette()[:n * 3], np.uint8).reshape(-1, 3)
    return pal[np.minimum(np.array(q).reshape(-1), len(pal) - 1)]


def quantize(logical, alpha, ncol, accent_slots=7, chroma_thr=80):
    """Quantize to ncol colours but lock accent_slots palette entries for the saturated accent pixels
    (plain median-cut merges small saturated areas into the greys)."""
    ys, xs = np.nonzero(alpha)
    if len(ys) == 0:
        return logical
    accent_slots = min(accent_slots, max(1, ncol // 3))
    px = logical[ys, xs].astype(np.int32)
    chroma = px.max(axis=1) - px.min(axis=1)
    acc = (chroma >= chroma_thr) & (px.max(axis=1) > 110)
    out = logical.copy()
    res = np.zeros((len(ys), 3), np.uint8)
    if acc.sum() >= 4 and accent_slots > 0:
        res[acc] = _quant_subset(px[acc].astype(np.uint8), min(accent_slots, max(1, int(acc.sum()) // 2)))
        rest = ~acc
        res[rest] = _quant_subset(px[rest].astype(np.uint8), max(2, ncol - accent_slots))
    else:
        res[:] = _quant_subset(px.astype(np.uint8), ncol)
    out[ys, xs] = res
    return out


def kill_thin_lines(rgb, alpha):
    """Remove 1px-wide lines/specks inside flat interior regions (breaks the chunky 2x2 rule). Outline untouched."""
    er = ndi.binary_erosion(alpha, iterations=2)
    L = lum(rgb)
    out = rgb.copy()
    for ax in (1, 0):
        a = np.roll(rgb, 1, axis=ax); b = np.roll(rgb, -1, axis=ax)
        same = (a == b).all(axis=2) & ~(a == rgb).all(axis=2)
        la, lb = lum(a), lum(b)
        m = same & er & (L > 50) & (la > 50) & (lb > 50)
        out[m] = a[m]
    return out


def contrast_report(rgb, alpha):
    """Share of opaque pixels whose luminance is within 8% of the game's dark panel (they vanish on the UI)."""
    L = lum(rgb) / 255.0
    pl = (0.299 * PANEL[0] + 0.587 * PANEL[1] + 0.114 * PANEL[2]) / 255.0
    inner = ndi.binary_erosion(alpha)
    low = (np.abs(L - pl) < 0.08) & inner
    return float(low.sum() / max(1, inner.sum()))


def lum(rgb):
    return 0.299 * rgb[..., 0] + 0.587 * rgb[..., 1] + 0.114 * rgb[..., 2]


def fix_outline(rgb, alpha):
    """Force an unbroken 1px dark outline: if the silhouette edge is not already dark, add one."""
    er = ndi.binary_erosion(alpha)
    edge = alpha & ~er
    if edge.sum() == 0:
        return rgb, alpha
    dark = lum(rgb) < 70
    frac = (dark & edge).sum() / edge.sum()
    if frac >= 0.85:
        return rgb, alpha
    pad = 1
    rgb2 = np.pad(rgb, ((pad, pad), (pad, pad), (0, 0)))
    a2 = np.pad(alpha, pad)
    ring = ndi.binary_dilation(a2, structure=np.array([[0, 1, 0], [1, 1, 1], [0, 1, 0]])) & ~a2
    # outline colour = darkest colour present, tinted
    cols = rgb[alpha]
    oc = cols[np.argmin(lum(cols))]
    rgb2[ring] = oc
    return rgb2, a2 | ring


def remove_orphans(rgb, alpha):
    a = alpha.copy()
    # drop opaque specks with no opaque neighbour
    nb = ndi.convolve(alpha.astype(int), np.ones((3, 3), int), mode='constant') - alpha.astype(int)
    a &= ~((nb == 0) & alpha)
    return rgb, a


def process(path, outdir, name, ncol=24, min_area=200, expect=None, grid=None, floor=0, canvas=None):
    os.makedirs(outdir, exist_ok=True)
    im = Image.open(path).convert('RGB')
    den = im.filter(ImageFilter.MedianFilter(3))
    a = np.array(den)
    gx, gy = grid_profile(a)
    if grid:
        px = py = float(grid); phx = detect_period(gx, grid - .01, grid + .01)[1]; phy = detect_period(gy, grid - .01, grid + .01)[1]; cx = cy = 1.0
    else:
        px, phx, cx = detect_period(gx)
        py, phy, cy = detect_period(gy)
        # pixels are square: if one axis found a multiple of the other, use the smaller one on both
        if abs(px / py - 2) < 0.2 or abs(px / py - 1) > 0.1 and px > py:
            px, phx, cx = detect_period(gx, py - .01, py + .01)
        elif abs(py / px - 2) < 0.2 or abs(py / px - 1) > 0.1 and py > px:
            py, phy, cy = detect_period(gy, px - .01, px + .01)
    logical = snap(a, px, phx, py, phy)
    alpha = key_background(logical)
    # separate objects
    for iters in (2, 1, 0):
        close = ndi.binary_closing(alpha, structure=np.ones((3, 3)), iterations=iters) if iters else alpha
        lab, n = ndi.label(close)
        big = sorted([int(((lab == i) & alpha).sum()) for i in range(1, n + 1)], reverse=True)
        if not expect or sum(1 for b in big if b >= min_area) >= expect:
            break
    objs = []
    for i in range(1, n + 1):
        ys, xs = np.nonzero((lab == i) & alpha)
        if len(ys) < min_area // 4:
            continue
        objs.append((ys.min(), ys.max(), xs.min(), xs.max(), i, len(ys)))
    # bodies = the `expect` biggest components (or everything >= 25% of the biggest); the rest are detached effects
    objs.sort(key=lambda o: -o[5])
    if expect:
        bodies, fxs = objs[:expect], objs[expect:]
    else:
        big = objs[0][5] if objs else 0
        bodies = [o for o in objs if o[5] >= 0.25 * big]; fxs = [o for o in objs if o[5] < 0.25 * big]
    # order top-to-bottom bands then left-to-right
    bodies.sort(key=lambda o: (round(o[0] / 40), o[2]))
    objs = bodies
    if expect and len(objs) != expect:
        print('WARNING: expected %d objects, found %d' % (expect, len(objs)), file=sys.stderr)
    report = {'file': os.path.basename(path), 'period_x': round(px, 2), 'period_y': round(py, 2), 'conf_x': round(float(cx), 2), 'conf_y': round(float(cy), 2),
              'logical_size': list(logical.shape[1::-1]), 'objects': []}
    sprites = []
    for fk, (y0, y1, x0, x1, i, _) in enumerate(fxs):
        m = (lab == i) & alpha
        sa = m[y0:y1 + 1, x0:x1 + 1]
        sub = quantize(logical[y0:y1 + 1, x0:x1 + 1].copy(), sa, 8)
        Image.fromarray(np.dstack([sub, (sa * 255).astype(np.uint8)]), 'RGBA').save(os.path.join(outdir, '%s_fx%d.png' % (name, fk)))
    for k, (y0, y1, x0, x1, i, _) in enumerate(objs):
        m = (lab == i) & alpha
        sub = logical[y0:y1 + 1, x0:x1 + 1].copy()
        sa = m[y0:y1 + 1, x0:x1 + 1]
        sub = quantize(sub, sa, ncol)
        sub = lift_dark(sub, sa, floor)
        sub = kill_thin_lines(sub, sa)
        sa = despeckle(sa)
        sub, sa = remove_orphans(sub, sa)
        sub, sa = fix_outline(sub, sa)
        ys, xs = np.nonzero(sa)
        sub, sa = sub[ys.min():ys.max() + 1, xs.min():xs.max() + 1], sa[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
        rgba = np.dstack([sub, (sa * 255).astype(np.uint8)])
        img = Image.fromarray(rgba, 'RGBA')
        fn = os.path.join(outdir, '%s_%d.png' % (name, k))
        img.save(fn)
        if canvas:   # normalised canvas (icons): centred, same size for every sibling
            cw, ch = canvas
            cv = Image.new('RGBA', (cw, ch), (0, 0, 0, 0))
            sc = img if (img.width <= cw and img.height <= ch) else img.resize((min(cw, img.width), min(ch, img.height)), Image.NEAREST)
            cv.paste(sc, ((cw - sc.width) // 2, (ch - sc.height) // 2), sc)
            cv.save(os.path.join(outdir, '%s_%d_c%d.png' % (name, k, cw)))
        img.resize((img.width * 4, img.height * 4), Image.NEAREST).save(os.path.join(outdir, '%s_%d_x4.png' % (name, k)))
        ncolors = len(np.unique(sub[sa].reshape(-1, 3), axis=0))
        report['objects'].append({'index': k, 'size': [img.width, img.height], 'colors': int(ncolors),
                                  'low_contrast_vs_panel_pct': round(100 * contrast_report(sub, sa), 1)})
        sprites.append(img)
    if sprites:
        S = 3
        W = sum(s.width * S + 24 for s in sprites) + 24
        Hh = max(s.height * S for s in sprites) + 48
        sheet = Image.new('RGB', (W, Hh), PANEL)
        x = 24
        for s in sprites:
            b = s.resize((s.width * S, s.height * S), Image.NEAREST)
            sheet.paste(b, (x, Hh - 24 - b.height), b)
            x += b.width + 24
        sheet.save(os.path.join(outdir, '%s_preview.png' % name))
    json.dump(report, open(os.path.join(outdir, '%s_report.json' % name), 'w'), indent=1)
    return report


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('inp'); ap.add_argument('outdir'); ap.add_argument('name')
    ap.add_argument('--colors', type=int, default=24)
    ap.add_argument('--min-area', type=int, default=200)
    ap.add_argument('--expect', type=int)
    ap.add_argument('--grid', type=float)
    ap.add_argument('--floor', type=int, default=0, help='lift interior pixels darker than this luminance (0-255)')
    ap.add_argument('--canvas', type=int, help='also write NAME_i_cN.png on an N x N transparent canvas (icons)')
    a = ap.parse_args()
    print(json.dumps(process(a.inp, a.outdir, a.name, a.colors, a.min_area, a.expect, a.grid, a.floor, (a.canvas, a.canvas) if a.canvas else None), indent=1))
