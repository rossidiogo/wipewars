```
JACQUIN VERDICT: REJECTED   (FIXABLE_IN_CODE for plate, robe, chainmail; leather jerkin FIXABLE_IN_CODE by value lift, REGENERATE if the lift looks muddy)
Asset: items_body_1 (0 STR plate, 1 DEX leather jerkin, 2 INT jeweled robe, 3 STR/INT chainmail + tabard), Common rarity   Type: icon set (body armour)   Attempt: 1
Scores (set): pixel 88 | silhouette 80 | color 83 | anatomy 84 | design 87 | symmetry 84 | ready 84 | brief 88 | likeness N/A   => overall 85
Per icon (overall): 0 plate 85 | 1 leather 68 | 2 robe 89 | 3 chainmail 86. No icon reaches 92, so none is approved and none becomes ANCHOR_icons.png yet.
Likeness check: N/A
What works: The set is a family: same 1 px dark outline, same top-left light with cool right-side shading, same front-on view, 20 colors each (under the icon target), no magenta, no orphans (each is one connected component), clean grid. The robe is the best piece (violet near the approved #5a2d82, gold trim, 2x2 blue gem); the white-and-gold tabard is the clearest silhouette of the four and says "STR/INT paladin" at once.
Defects (most severe first):
 1. Leather jerkin vanishes on the UI: report flags 51.8% of its pixels near the panel colour (#1a1612). Body is near-black green; only the grey X straps and belt carry shape. At 32-64 px it is a dark blob with a pale belt. Silhouette about 62, color about 60 on this icon.
 2. Plate icon is a suit, not a torso: it includes thigh plates and gold-toed greaves (about 8 px of legs under a dark waist gap). The other three are torso garments, so the plate is the odd one in footprint, and in a 32 px cell it reads as a tiny armoured creature.
 3. Chainmail uses a 1 px checkerboard on arms and skirt: fine texture noise forbidden by the style lock; it shimmers when scaled and flattens to grey at 32 px.
 4. Sizes are not normalized: 36x33, 34x34, 32x37, 32x36 logical. The plan is 32 logical drawn at 2x; the robe is 37 tall, so it does not fit a 32 cell without a non-integer downscale. Details (2x2 gem, sun emblem) are below legibility at 32 px screen size; fine at 64.
 5. Plate (blue-grey) and robe (violet) are close in hue and value at 32 px; leather and mail use the same grey ramp. Attribute cue is not required in the art, but give each a distinct small trim accent so siblings separate at a glance.
 6. The neck opening is a pure dark 4x3 block on all four, merging with the panel and breaking the top outline on the dark UI.
Fix:
 a) Leather: lift lightness of the darkest 5 non-outline ramp colors by about +0.10 to +0.14 OKLab L (keep hue), remap mid-dark pixels at the shoulders one step lighter for a top-left highlight; verify the low-contrast flag falls under 15%. If it looks muddy, REGENERATE the jerkin (see prompt note below).
 b) Plate: crop the legs just under the belt, redraw a 1 px bottom outline, target height 28-32.
 c) Chainmail: majority-filter the 1 px checker into 2x2 blocks or a 2 px diagonal weave; leave the tabard unchanged.
 d) Normalize all four on a 40x40 logical canvas, bottom-center anchored, no rescale; per-icon 24-color quantize with a locked outline. Fill the neck hole with a lighter inner-lining color (2 px) so the outline reads.
 e) Display contract: draw icons at exactly 2x (80 px cell) or 1x 40; never 0.9x.
 Expected after a-d: robe about 91, chainmail about 90, plate about 90, leather about 88; the robe and the tabard are the likely first anchors and the leather will probably need one regeneration.
```
