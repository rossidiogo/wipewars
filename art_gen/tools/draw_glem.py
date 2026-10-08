"""Procedural pixel art: GLEM (casino millionaire, melee bruiser) human form. 72x104. Output out/clean/hero_glem_proc{N}.png
Design from the owner's photos: dark wavy hair, thick brows, full dark beard + goatee, stocky, smirk. Red jacket (his red hoodie) with gold trim,
black tee, gold chain + coin pendant, gold watch, gold tiger-claw gauntlet, poker chip in the other hand, white sneakers."""
import sys
from pxdraw import Kit, flat

N = sys.argv[1] if len(sys.argv) > 1 else '1'
W, H = 72, 104
PAL = {
    'skin': ((214, 160, 124), (238, 192, 158), (166, 112, 92)),
    'hair': ((46, 36, 44), (86, 70, 82), (28, 22, 30)),
    'beard': ((54, 40, 40), (92, 70, 62), (34, 26, 28)),
    'red': ((196, 36, 52), (238, 84, 92), (128, 22, 46)),
    'gold': ((232, 188, 52), (255, 232, 130), (160, 112, 28)),
    'tee': ((38, 40, 56), (70, 74, 98), (22, 22, 34)),
    'pants': ((34, 34, 48), (66, 68, 88), (20, 20, 30)),
    'shoe': ((238, 238, 240), (255, 255, 255), (160, 168, 192)),
    'steel': ((200, 208, 222), (255, 255, 255), (130, 140, 170)),
    'chip': ((210, 30, 50), (240, 80, 90), (140, 20, 40)),
    'white': flat((250, 250, 250)), 'eye': flat((30, 22, 30)), 'mouth': flat((150, 64, 70)),
    'tooth': flat((250, 244, 236)), 'shred': flat((126, 22, 46)),
}
k = Kit(W, H, PAL, flats={'white', 'eye', 'mouth', 'tooth', 'shred'})
CX = 36
# legs + shoes
k.rect(25, 80, 34, 92, 'pants'); k.rect(38, 80, 47, 92, 'pants')
k.rect(22, 92, 35, 98, 'shoe'); k.rect(37, 92, 50, 98, 'shoe')
k.pts([(24, 96), (25, 96), (26, 96), (39, 96), (40, 96), (41, 96)], 'red')
# torso: tee, belt/hip
k.ell(CX, 58, 18, 15, 'tee'); k.rect(19, 46, 53, 70, 'tee')
k.rect(19, 66, 53, 82, 'pants'); k.rect(35, 78, 37, 83, None)
k.rect(19, 69, 53, 70, 'gold')
# jacket panels (open), gold trim at edges
k.rect(12, 42, 26, 72, 'red'); k.rect(46, 42, 60, 72, 'red')
k.ell(CX, 43, 20, 5, 'red', only=[None, 'red'])
k.rect(26, 42, 46, 47, 'tee')
k.rect(26, 47, 26, 72, 'gold'); k.rect(46, 47, 46, 72, 'gold')
k.rect(12, 71, 25, 72, 'gold'); k.rect(47, 71, 60, 72, 'gold')
# collar
k.pts([(25, 42), (24, 43), (26, 43), (47, 43), (48, 43), (46, 42)], 'red')
# gold chain + coin pendant
for i, (x, y) in enumerate([(27, 45), (28, 47), (30, 49), (32, 50), (34, 51), (38, 51), (40, 50), (42, 49), (44, 47), (45, 45)]):
    k.put(x, y, 'gold')
k.rect(35, 52, 37, 54, 'gold'); k.put(36, 53, 'red')
# sleeves: red with gold stripe (his red hoodie stripes)
k.rect(6, 44, 16, 62, 'red'); k.rect(56, 44, 66, 62, 'red')
k.rect(9, 44, 9, 62, 'white'); k.rect(11, 44, 11, 62, 'white'); k.rect(61, 44, 61, 62, 'white'); k.rect(63, 44, 63, 62, 'white')
k.pts([(6, 44), (7, 44), (6, 45), (66, 44), (65, 44), (66, 45)], None)
k.rect(6, 62, 16, 64, 'gold'); k.rect(56, 62, 66, 64, 'gold')
# forearms + hands
k.rect(7, 65, 15, 71, 'skin'); k.rect(57, 65, 65, 71, 'skin')
k.pts([(58, 68), (59, 68), (60, 68), (58, 69), (59, 69), (60, 69)], 'gold')  # watch
# left (screen-left) gold claw gauntlet
k.ell(10, 74, 5.5, 4.5, 'gold')
k.rect(5, 76, 15, 77, 'gold')
for x in (5, 9, 13):
    k.line(x, 78, x - 2, 86, 'gold', 2)
# right hand holds a poker chip
k.ell(61, 75, 4.5, 4.5, 'skin')
k.ell(68, 72, 3.5, 3.5, 'chip'); k.pts([(68, 69), (68, 75), (65, 72), (71, 72)], 'white'); k.put(68, 72, 'white')
# neck, head
k.ell(CX, 41, 7, 3, 'skin')
k.ell(CX, 28, 18, 16, 'skin')
k.rect(18, 30, 54, 33, 'skin')
k.ell(18, 30, 2.5, 3.5, 'skin'); k.ell(54, 30, 2.5, 3.5, 'skin')
# wavy dark hair: top mass + a few curls, forehead stays visible
k.ell(CX, 15, 18, 8, 'hair', only=[None, 'skin'])
for (x, y, rx, ry) in [(21, 17, 3.5, 4), (51, 17, 3.5, 4), (28, 9, 4, 3), (36, 7, 4, 3), (44, 9, 4, 3)]:
    k.ell(x, y, rx, ry, 'hair', only=[None, 'skin', 'hair'])
k.rect(19, 19, 53, 19, 'hair')
k.pts([(26, 20), (27, 20), (28, 20), (34, 20), (35, 20), (44, 20), (45, 20), (46, 20)], 'hair')   # fringe waves
k.rect(17, 20, 18, 28, 'hair'); k.rect(54, 20, 55, 28, 'hair')   # sideburns
# thick brows
k.rect(23, 24, 31, 25, 'hair'); k.rect(41, 24, 49, 25, 'hair')
k.pts([(22, 25), (50, 25)], 'hair')
# eyes (friendly, half-lidded smirk)
k.rect(25, 27, 30, 29, 'white'); k.rect(42, 27, 47, 29, 'white')
k.rect(27, 27, 29, 29, 'eye'); k.rect(44, 27, 46, 29, 'eye')
k.rect(25, 27, 30, 27, 'skin'); k.rect(42, 27, 47, 27, 'skin')  # heavy lids
k.rect(25, 26, 30, 26, 'hair'); k.rect(42, 26, 47, 26, 'hair')
# nose
k.rect(34, 29, 38, 33, 'skin'); k.pts([(34, 33), (38, 33)], 'skin')
# beard (full) + mustache + goatee + smirk
k.ell(CX, 39, 15, 8, 'beard', only=['skin'])
k.rect(19, 33, 22, 40, 'beard', only=['skin']); k.rect(50, 33, 53, 40, 'beard', only=['skin'])
k.ell(CX, 43, 11, 4, 'beard', only=[None, 'skin'])
k.rect(27, 34, 45, 35, 'beard')
k.rect(30, 38, 42, 39, 'skin')
k.rect(31, 38, 40, 38, 'mouth')
k.pts([(41, 37), (42, 37), (43, 36)], 'mouth')
k.rect(34, 41, 38, 42, 'skin', only=['beard'])  # light goatee gap
# cuff scuffs
k.render('hero_glem_proc' + N, shade_sets={'red', 'tee', 'pants', 'skin', 'shoe'})
