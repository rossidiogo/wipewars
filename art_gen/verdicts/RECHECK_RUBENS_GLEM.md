RECHECK 2026-10-08 (provisional procedural bar = 86; the chibi/frontal symmetry cap is not penalised again)
How this was judged: I viewed the x4 PNGs and read draw_glem_tiger.py and draw_glem.py. No shell was available, so I did not re-measure the colour count. Rubens' <=33 colours is the producer's number.

1) RUBENS hero_rubens_proc4   Attempt 3
Scores: pixel 87 | silhouette 86 | color 87 | anatomy 85 | design 87 | symmetry 80(capped) | ready 90 | brief 88 | likeness 87  => 86.3  PROVISIONAL OK (>=86)
All the fixes landed. The smoke now rises from the ember with no gap, the chalk-scribble print on the shorts is gone, and the palette was reduced. The knuckle creases barely show at 1x, which is acceptable. Not final-gate quality (92).

2) GLEM human hero_glem_proc3   Attempt 2
Scores: pixel 88 | silhouette 84 | color 86 | anatomy 85 | design 86 | symmetry 84(capped) | ready 89 | brief 88 | likeness 87  => 86.3  PROVISIONAL OK
The closed smirk (lines 89-90), the white double sleeve stripes (line 47) and the gold claws all landed. The gauntlet now reads as a gold claw glove, and the shoulders are less boxy.

3) GLEM tiger hero_glem_tiger_proc3   Attempt 2
Scores: pixel 82 | silhouette 82 | color 85 | anatomy 80 | design 85 | symmetry 84 | ready 86 | brief 87 | likeness N/A  => 83.9  REJECTED (FIXABLE_IN_CODE)
What works: the forehead mark now reads as the 王 sign, the tail shows and curls on the right, the claws are gold, and the eyes have catchlights.
Defects:
 1. Black stripe pixels fall OUTSIDE the arm/body silhouette and read as thorns or spikes (visible at x4 on both outer arm edges and at the shoulder tops):
    - line 45: (8,62),(9,62) are outside the arm ellipse (x min 10); (10,54),(11,54) are outside it at y54 (the arm spans about 12-24 there).
    - line 46 mirror: (80,62),(79,62),(78,54),(77,54).
    - line 43: the contour lines start at y50, where the body edge is about x25.4/62.6, so (25,50) and (63,50) poke out.
 2. The arms still read as slabs. The contour sits on the arm/body seam, but nothing separates the forearm from the body.
Fix (draw_glem_tiger.py):
 a. Line 45 -> replace (10,54),(11,54),(12,55) with (13,54),(14,54),(15,55); replace (8,62),(9,62),(10,63) with (11,62),(12,62),(13,63).
    Line 46 -> mirror: (75,54),(74,54),(73,55) and (77,62),(76,62),(75,63).
 b. Line 43 -> k.line(25,54,24,78,'stripe'); k.line(63,54,64,78,'stripe')
 c. Add a 1px stripe shadow under each forearm so the arm sits in front of the body: k.line(22,74,26,79,'stripe'); k.line(66,74,62,79,'stripe')
 d. Re-export proc4. Expected about 86 (provisional OK).
