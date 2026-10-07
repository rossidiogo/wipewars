"""Make assets/ava_<key>.png (96x96, transparent) from an approved hero sprite: the top 48 rows around the head, scaled x2 with nearest neighbour.
  python export_avatar.py KEY sprite.png
The head centre is taken from the opaque pixels of the top 24 rows of the sprite."""
import os, sys
import numpy as np
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))


def main():
    key, path = sys.argv[1], sys.argv[2]
    im = Image.open(path).convert('RGBA')
    a = np.array(im)
    ys = np.nonzero(a[..., 3] > 0)[0]
    top = int(ys.min())
    head = a[top:top + 24, :, 3] > 0
    xs = np.nonzero(head.any(axis=0))[0]
    cx = int(round((xs.min() + xs.max()) / 2))
    box = (cx - 24, top - 2, cx + 24, top + 46)
    canvas = Image.new('RGBA', (48, 48), (0, 0, 0, 0))
    canvas.paste(im.crop(box), (0, 0))
    out = canvas.resize((96, 96), Image.NEAREST)
    dst = os.path.join(ROOT, 'assets', f'ava_{key}.png')
    out.save(dst)
    print('wrote', dst, 'head centre x', cx, 'top', top)


if __name__ == '__main__':
    main()
