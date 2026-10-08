"""Procedural pixel art: GLEM TIGER FORM (Fortune Tiger style, bulky bruiser, keeps his gold chain/coin and red+gold trim). 88x108.
Output out/clean/hero_glem_tiger_proc{N}.png"""
import sys
from pxdraw import Kit, flat

N = sys.argv[1] if len(sys.argv) > 1 else '1'
W, H = 88, 108
PAL = {
    'fur': ((238, 132, 36), (255, 186, 84), (170, 82, 26)),
    'stripe': flat((40, 24, 30)),
    'belly': ((250, 236, 214), (255, 252, 244), (200, 176, 160)),
    'pink': flat((236, 120, 130)),
    'gold': ((232, 188, 52), (255, 232, 130), (160, 112, 28)),
    'red': ((196, 36, 52), (238, 84, 92), (128, 22, 46)),
    'claw': ((236, 240, 248), (255, 255, 255), (150, 160, 190)),
    'eye': flat((255, 224, 60)), 'pupil': flat((30, 18, 26)), 'white': flat((252, 250, 246)),
    'nose': flat((214, 70, 90)), 'mouth': flat((120, 30, 44)),
}
k = Kit(W, H, PAL, flats={'stripe', 'pink', 'eye', 'pupil', 'white', 'nose', 'mouth'})
CX = 44
# tail (behind, low on screen-right) curling up
for (x0, y0, x1, y1) in [(66, 90, 80, 88), (80, 88, 85, 78), (85, 78, 84, 66), (84, 66, 80, 60)]:
    k.line(x0, y0, x1, y1, 'fur', 4)
k.pts([(76, 89), (77, 89), (83, 83), (84, 83), (84, 72), (85, 72), (81, 62), (82, 62)], 'stripe')
k.rect(78, 58, 81, 60, 'stripe')
# legs + feet (thick)
k.rect(26, 84, 40, 96, 'fur'); k.rect(48, 84, 62, 96, 'fur')
k.ell(31, 98, 9, 5, 'fur'); k.ell(57, 98, 9, 5, 'fur')
# body (huge) + belly
k.ell(CX, 66, 25, 24, 'fur')
k.ell(CX, 71, 15, 17, 'belly')
# red-and-gold waist sash (casino millionaire nod)
k.rect(20, 82, 68, 86, 'red'); k.rect(20, 82, 68, 82, 'gold'); k.rect(20, 86, 68, 86, 'gold')
k.rect(40, 80, 48, 88, 'gold'); k.rect(42, 82, 46, 86, 'red')
# arms (thick, raised bruiser stance), claws out
k.ell(18, 64, 8, 17, 'fur'); k.ell(70, 64, 8, 17, 'fur')
k.ell(15, 80, 8, 7, 'fur'); k.ell(73, 80, 8, 7, 'fur')
k.rect(9, 72, 23, 73, 'gold'); k.rect(65, 72, 79, 73, 'gold')   # gold bracers
for x in (9, 13, 17):
    k.line(x, 85, x - 1, 92, 'gold', 2)
for x in (70, 74, 78):
    k.line(x, 85, x + 1, 92, 'gold', 2)
k.line(25, 54, 24, 78, 'stripe'); k.line(63, 54, 64, 78, 'stripe')
k.line(22, 74, 26, 79, 'stripe'); k.line(66, 74, 62, 79, 'stripe')
# arm / body stripes
for (x, y) in [(13, 54), (14, 54), (15, 55), (18, 58), (19, 58), (20, 59), (11, 62), (12, 62), (13, 63), (16, 66), (17, 66), (18, 67),
               (75, 54), (74, 54), (73, 55), (70, 58), (69, 58), (68, 59), (77, 62), (76, 62), (75, 63), (72, 66), (71, 66), (70, 67)]:
    k.put(x, y, 'stripe')
for y0 in (52, 58, 64):
    k.rect(22, y0, 27, y0 + 1, 'stripe'); k.rect(61, y0, 66, y0 + 1, 'stripe')
# gold chain + big coin pendant
for (x, y) in [(31, 50), (33, 53), (36, 55), (40, 57), (44, 58), (48, 57), (52, 55), (55, 53), (57, 50)]:
    k.put(x, y, 'gold'); k.put(x, y + 1, 'gold')
k.ell(44, 63, 4.2, 4.2, 'gold'); k.rect(43, 61, 45, 65, 'red', only=['gold'])
# head: round, wide cheeks
k.ell(CX, 30, 23, 19, 'fur')
k.ell(24, 14, 6, 6, 'fur'); k.ell(64, 14, 6, 6, 'fur')    # ears
k.ell(24, 15, 3, 3.5, 'pink'); k.ell(64, 15, 3, 3.5, 'pink')
# forehead stripes (the royal "wang" marks)
for yy in (14, 18, 22):
    k.rect(CX - 6, yy, CX + 5, yy, 'stripe')
k.rect(CX - 1, 14, CX, 22, 'stripe')
k.rect(CX - 20, 28, CX - 15, 29, 'stripe'); k.rect(CX + 15, 28, CX + 20, 29, 'stripe')
k.rect(CX - 21, 33, CX - 16, 34, 'stripe'); k.rect(CX + 16, 33, CX + 21, 34, 'stripe')
# muzzle
k.ell(CX, 38, 13, 9, 'belly')
k.rect(CX - 2, 31, CX + 2, 33, 'nose'); k.rect(CX, 34, CX, 38, 'stripe')
# mouth + fangs + tiny goatee tuft (Glem's goatee)
k.rect(CX - 8, 41, CX + 8, 41, 'mouth'); k.rect(CX - 6, 42, CX + 6, 43, 'mouth')
k.rect(CX - 5, 41, CX - 4, 44, 'white'); k.rect(CX + 4, 41, CX + 5, 44, 'white')
k.rect(CX - 3, 46, CX + 3, 49, 'stripe')
# angry yellow eyes
k.rect(CX - 16, 25, CX - 7, 29, 'eye'); k.rect(CX + 7, 25, CX + 16, 29, 'eye')
k.rect(CX - 12, 25, CX - 10, 29, 'pupil'); k.rect(CX + 10, 25, CX + 12, 29, 'pupil')
k.pts([(CX - 11, 26), (CX + 11, 26)], 'white')
k.line(CX - 18, 21, CX - 6, 25, 'stripe', 2); k.line(CX + 18, 21, CX + 6, 25, 'stripe', 2)   # brows
# whisker dots
k.pts([(CX - 11, 38), (CX - 13, 40), (CX + 11, 38), (CX + 13, 40)], 'stripe')
k.render('hero_glem_tiger_proc' + N, shade_sets={'fur', 'belly', 'red'})
