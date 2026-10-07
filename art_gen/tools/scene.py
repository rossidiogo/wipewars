"""Clean a generated BACKGROUND SCENE (no keying): detect the pixel grid, snap to it, quantize, crop to the battle-field aspect.
  python scene.py IN.jpg OUT.png [--colors 64] [--aspect 320:293] [--top 0.06]
Output is the LOGICAL image (1 px = 1 art pixel); the game stretches it with image-rendering:pixelated.
Prints the detected period and logical size (compare to monsters: ~0.7-1.05 field px per logical px => ideal logical width ~320-420)."""
import argparse, json, os, sys
import numpy as np
from PIL import Image, ImageFilter
sys.path.insert(0, os.path.dirname(__file__))
from clean import detect_period, grid_profile, snap


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('inp'); ap.add_argument('out')
    ap.add_argument('--colors', type=int, default=64)
    ap.add_argument('--aspect', default='320:293')
    ap.add_argument('--top', type=float, default=0.06, help='share of the excess height cropped from the top (rest from the bottom)')
    ap.add_argument('--grid', type=float)
    ap.add_argument('--mode', default='fine', help='fine = area-downsample to the field size (matches sprite pixel density, default); snap = keep the generator grid (chunky)')
    a = ap.parse_args()
    im = Image.open(a.inp).convert('RGB')
    if a.mode == 'fine':
        aw, ah = [int(x) for x in a.aspect.split(':')]
        w, h = im.size; th = int(round(w * ah / aw)); t = int(round((h - th) * a.top)) if th < h else 0
        crop = im.crop((0, t, w, t + min(th, h)))
        q = crop.resize((aw, ah), Image.LANCZOS).quantize(a.colors, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).convert('RGB')
        q.save(a.out)
        print(json.dumps({'mode': 'fine', 'saved': list(q.size), 'colors': a.colors}))
        return
    arr = np.array(im.filter(ImageFilter.MedianFilter(3)))
    gx, gy = grid_profile(arr)
    if a.grid:
        px = py = a.grid; phx = detect_period(gx, px - .01, px + .01)[1]; phy = detect_period(gy, py - .01, py + .01)[1]
    else:
        px, phx, cx = detect_period(gx, 2.0, 16.0); py, phy, cy = detect_period(gy, 2.0, 16.0)
        if abs(px / py - 2) < 0.2 or (abs(px / py - 1) > 0.1 and px > py): px, phx, cx = detect_period(gx, py - .01, py + .01)
        elif abs(py / px - 2) < 0.2 or (abs(py / px - 1) > 0.1 and py > px): py, phy, cy = detect_period(gy, px - .01, px + .01)
    lg = snap(arr, px, phx, py, phy)
    img = Image.fromarray(lg)
    q = img.quantize(colors=a.colors, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).convert('RGB')
    w, h = q.size
    aw, ah = [float(x) for x in a.aspect.split(':')]
    th = int(round(w * ah / aw))
    if th < h:
        extra = h - th; t = int(round(extra * a.top)); q = q.crop((0, t, w, t + th))
    elif th > h:
        tw = int(round(h * aw / ah)); l = (w - tw) // 2; q = q.crop((l, 0, l + tw, h))
    q.save(a.out)
    print(json.dumps({'period': [round(px, 2), round(py, 2)], 'logical': [w, h], 'saved': list(q.size), 'field_px_per_logical_px': round(320 / q.size[0], 2)}))


if __name__ == '__main__':
    main()
