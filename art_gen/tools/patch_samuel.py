"""Jacquin patch for Samuel (attempt 4 fixes a-d). Input: out/clean/hero_samuel_gem3_1.png  Output: out/clean/hero_samuel_gem3_p2.png (+ _x4, _panel)
Fixes: erase cane line; ONE continuous glowing blade from the console fist (angled ~20deg toward screen-left, tapering); cracked lens;
white synthetic-blood drip with bead; shoulder/sleeve gloss whites -> cool gray (only blade core, lens crack and blood stay pure white); boot rim light; brighter earring cross."""
import os
from PIL import Image
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
im = Image.open(os.path.join(R, 'out', 'clean', 'hero_samuel_gem3_1.png')).convert('RGBA')
W, H = im.size
px = im.load()
CORE, GLOW, GLOW2 = (232, 255, 240, 255), (60, 255, 122, 255), (30, 150, 80, 255)
BLOOD, BSHADE = (240, 244, 240, 255), (150, 170, 182, 255)
# 1. erase the cane on the screen-right side
for y in range(86, H):
    for x in range(64, W):
        px[x, y] = (0, 0, 0, 0)
# c. recolor gloss whites on the screen-left shoulder/sleeve (not the console, not the face) to mid cool gray
for y in range(56, 82):
    for x in range(0, 19):
        r, g, b, a = px[x, y]
        if a and min(r, g, b) > 120 and max(r, g, b) - min(r, g, b) < 40:
            px[x, y] = (96, 108, 122, 255)
# d. earring cross brighter
for y in range(44, 53):
    for x in range(10, 17):
        r, g, b, a = px[x, y]
        if a and min(r, g, b) > 110:
            px[x, y] = (236, 242, 246, 255)
# a. blade: emitter nub + one continuous line
for dx in (9, 10):
    for dy in (98, 99):
        px[dx, dy] = (42, 47, 51, 255)
px[10, 98] = GLOW
x0, y0, y1 = 10, 100, 118
for y in range(y0, y1 + 1):
    x = round(x0 - 0.36 * (y - y0))
    px[x, y] = CORE
    if y <= 108:
        px[x - 1, y] = GLOW
        px[x + 1, y] = GLOW
    elif y <= 114:
        px[x - 1, y] = GLOW2
# b. lens crack + blood drip with bead and drop
for k in range(9):
    px[30 + k, 31 + k] = (245, 255, 250, 255)
for y in range(41, 44):
    px[33, y] = BLOOD; px[34, y] = BLOOD
for y in range(44, 47):
    px[33, y] = BLOOD
for y in range(41, 47):
    px[35 if y < 44 else 34, y] = BSHADE
for dx in (33, 34):
    for dy in (47, 48):
        px[dx, dy] = BLOOD
px[34, 48] = BSHADE
px[33, 51] = BLOOD
# 4. rim light on boots (right edges)
RIM = (107, 130, 153, 255)
for y in range(105, H):
    for x in range(0, 62):
        if px[x, y][3] and (x + 1 >= W or px[x + 1, y][3] == 0):
            px[x, y] = RIM
out = os.path.join(R, 'out', 'clean', 'hero_samuel_gem3_p2.png')
im.save(out)
im.resize((W * 4, H * 4), Image.NEAREST).save(out.replace('.png', '_x4.png'))
bg = Image.new('RGBA', (W * 6, H * 6), (0x1a, 0x16, 0x12, 255)); bg.alpha_composite(im.resize((W * 6, H * 6), Image.NEAREST))
bg.save(out.replace('.png', '_panel.png'))
print('ok', im.size)
