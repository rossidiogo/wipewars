"""Stamp pixel text on a blue label band of a cleaned sprite (the generator cannot spell, so brand text is drawn by code).
Usage: python label.py IN.png OUT.png [TEXT]   (default CLOROX)"""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

FONT = {
    'C': ['###', '#..', '#..', '#..', '###'],
    'L': ['#..', '#..', '#..', '#..', '###'],
    'O': ['###', '#.#', '#.#', '#.#', '###'],
    'R': ['##.', '#.#', '##.', '#.#', '#.#'],
    'X': ['#.#', '#.#', '.#.', '#.#', '#.#'],
}


def stamp(inp, out, text='CLOROX'):
    im = np.array(Image.open(inp).convert('RGBA')).astype(int)
    r, g, b, a = [im[..., i] for i in range(4)]
    strong = (a > 0) & (b > r + 55) & (b > g + 15)
    lab, n = ndi.label(strong)
    if n == 0:
        raise SystemExit('no blue label found')
    sizes = ndi.sum(strong, lab, range(1, n + 1))
    k = int(np.argmax(sizes)) + 1
    comp = lab == k
    # the label is the band of rows where the blue component is wide (the cool shadow strip is not)
    rowc = comp.sum(axis=1)
    thr = max(8, int(0.6 * rowc.max()))
    wide = np.nonzero(rowc >= thr)[0]
    peak = int(np.argmax(rowc))
    y0 = y1 = peak
    while y0 - 1 in wide: y0 -= 1
    while y1 + 1 in wide: y1 += 1
    lab = np.where(comp & (np.arange(comp.shape[0])[:, None] >= y0) & (np.arange(comp.shape[0])[:, None] <= y1), k, 0)
    mid = (y0 + y1) // 2
    cols = np.nonzero(a[mid] > 0)[0]
    lum = 0.299 * r + 0.587 * g + 0.114 * b
    xa, xb = cols.min(), cols.max()
    while lum[mid, xa] < 70 and xa < xb: xa += 1      # skip dark outline on the left
    while lum[mid, xb] < 70 and xb > xa: xb -= 1      # and on the right
    h = y1 - y0 + 1
    base = np.median(np.stack([r[lab == k], g[lab == k], b[lab == k]], axis=1), axis=0).astype(int)
    out_im = im.copy()
    width = xb - xa + 1
    for y in range(y0, y1 + 1):
        shade = 1.0
        if y == y0: shade = 1.12          # top highlight
        if y == y1: shade = 0.78          # bottom edge
        for x in range(xa, xb + 1):
            s = shade * (0.82 if x >= xb - 2 else 1.0)   # keep the cool shadow on the right side of the cylinder
            out_im[y, x, :3] = np.clip(base * s, 0, 255)
            out_im[y, x, 3] = 255
    # text
    glyphs = [FONT[c] for c in text]
    tw = len(glyphs) * 3 + (len(glyphs) - 1)
    if tw > width:
        print('WARNING: text %d px wider than label %d px' % (tw, width), file=sys.stderr)
    tx = xa + (width - tw) // 2
    ty = y0 + (h - 5) // 2
    cream = np.array([244, 236, 208])
    for gi, gl in enumerate(glyphs):
        for yy, row in enumerate(gl):
            for xx, ch in enumerate(row):
                if ch == '#':
                    out_im[ty + yy, tx + gi * 4 + xx, :3] = cream
    res = Image.fromarray(out_im.astype(np.uint8), 'RGBA')
    res.save(out)
    res.resize((res.width * 4, res.height * 4), Image.NEAREST).save(out.replace('.png', '_x4.png'))
    return xa, xb, y0, y1, tw


if __name__ == '__main__':
    print(stamp(sys.argv[1], sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else 'CLOROX'))
