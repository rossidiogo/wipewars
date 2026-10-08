JACQUIN VERDICT: REJECTED   (FIXABLE_IN_CODE - small script edits, both forms)
Asset: GLEM human (hero_glem_proc2) + GLEM tiger (hero_glem_tiger_proc2)   Type: hero sprite x2 (procedural)   Attempt: 1
Note: judged visually from 1x and x4 PNGs and the scripts. No shell available in this session, so no pixel/palette count was measured.

HUMAN  - Scores: pixel 88 | silhouette 80 | color 84 | anatomy 80 | design 82 | symmetry 86 | ready 88 | brief 84 | likeness 84  => overall 84
Likeness at 1x: dark wavy hair present; thick brows present; full beard + goatee present (strongest feature); stocky build present; red top present but stripes are gold, not his white hoodie stripes (weak); smirk WRONG (open toothy grin, photos show a closed one-sided smirk). Blind-ID: probable. Distinct from the other heroes: yes.
TIGER  - Scores: pixel 86 | silhouette 74 | color 84 | anatomy 72 | design 80 | symmetry 82 | ready 85 | brief 78 | likeness N/A  => overall 80
What works: the human beard/hair/red-jacket mass reads as Glem at 1x; the tiger is clearly a bulky orange tiger keeping the red+gold casino trim and coin pendant, so the two forms read as the same character.

Defects (most severe first):
 1. Tiger: the arms (ell 18,64 / 70,64) melt into the body. There is no contour, so the arms read as striped slabs, not limbs.
 2. Tiger: the claws are 1px white lines with toe dots at y=101, so they read as a comb ("UUU"). The brief asks for GOLD claws, and the human claws are steel too.
 3. Tiger: the forehead mark is 3 vertical bars plus 1 horizontal bar (reads as "H"/"卄"). The Fortune Tiger mark is 王 (3 horizontal bars plus 1 vertical).
 4. Tiger: the tail is fully hidden behind the right arm, so the curled tail (a key silhouette feature) is lost.
 5. Human: the mouth is an open toothy grin. Glem's signature is a closed one-sided smirk.
 6. Human: the sleeve stripes are gold. His hoodie has white double stripes, which is a real likeness cue.
 7. Human: the shoulders are square boxes (rect 6,44 / 56,44), which gives a robot silhouette, and the claw gauntlet reads as a small rake at 1x.

Fix (exact):
 TIGER draw_glem_tiger.py
  - Lines 59-61 -> `for y in (14,18,22): k.rect(CX-6,y,CX+5,y,'stripe')` then `k.rect(CX-1,14,CX,22,'stripe')`.
  - Line 15 claw palette -> gold `((255,214,90),(255,240,170),(170,120,30))`. Lines 41/43: `k.line(x,85,x-1,91,'claw',2); k.put(x-2,92,'claw')` (mirror +1/+2 on the right). Delete the toe-claw pts row at y=100-101 (line 29).
  - After line 38 add arm contours: `k.line(25,50,24,78,'stripe')` and `k.line(63,50,64,78,'stripe')`.
  - Tail (line 22) -> segments [(66,90,80,88),(80,88,85,78),(85,78,84,66),(84,66,80,60)] width 4, and move the stripe pts to x+4 so the tail peeks out right of the arm.
  - Eye catchlights: `k.put(CX-11,26,'white'); k.put(CX+11,26,'white')`.
 HUMAN draw_glem.py
  - Lines 89-90 -> `k.rect(31,38,40,38,'mouth')` with no tooth row, plus `k.pts([(41,37),(42,37),(43,36)],'mouth')` (closed smirk lifted on screen-right).
  - Line 47 -> two white stripes per sleeve: `k.rect(9,44,9,62,'white'); k.rect(11,44,11,62,'white'); k.rect(61,44,61,62,'white'); k.rect(63,44,63,62,'white')`.
  - Round the shoulders: after line 46 add `k.put(6,44,None); k.put(7,44,None); k.put(6,45,None); k.put(66,44,None); k.put(65,44,None); k.put(66,45,None)`.
  - Claws (lines 55-57) -> xs (5,9,13), `k.line(x,78,x-2,86,'gold',2); k.put(x-3,87,'gold')`, so they match the tiger's gold claws.
Expected after fixes: human ~87, tiger ~86 (provisional bar 86). Resubmit as attempt 2.
