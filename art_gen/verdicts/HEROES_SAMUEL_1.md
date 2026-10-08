JACQUIN VERDICT: REJECTED   (REGENERATE)
Asset: hero_samuel_gem2_0 (Samuel, Synthetic Assassin)   Type: hero sprite   Attempt: 2 (first judged)
Scores: pixel 84 | silhouette 82 | color 78 | anatomy 82 | design 84 | symmetry 70 | ready 78 | brief 74 | likeness 85   => overall 80
Likeness check (friend-based only): signature features present at in-game size: black quiff + faded sides: present; mustache + chin goatee: present; dark clubmaster-style sunglasses: present (no gold bridge); circuit eye: weak (green glow on both lens rims, reads as reflection); hoop earring with cross: weak (2-3 px, lost at 112 px); silver chain: present; light-medium/pale skin: weak (rendered warm tan-peach, face reads older and angrier than the photos); blind-ID: yes, borderline; distinct from other heroes: yes (only clean-shaven-plus-shades, all-black hero).
What works: the hair silhouette, shades and mustache-plus-goatee combination reads as Samuel instantly; outline is clean and unbroken, 24 colors, transparent background with no halo.
Defects (most severe first):
 1. Proportions are off-roster. The head (hair top to chin) is about 52% of total height. The style bible says about 1/3, and the anchors are about 35-42% (Daniel about 35%, Ze about 40%). Next to Jack/Daniel/Ze he would look like a bobblehead.
 2. Size: the object is 69x113 logical px against the roster's ~87-90. Getting to 88 means a 0.78x non-integer downscale, which breaks the pixel grid (the bible says integer rescale only). The grid detection is also weak: period 5.85, conf 2.55/3.0. Do not rescale this file. Regenerate at the right proportions.
 3. Weapon does not read. The "monofilament blade" is a thin tan/brown diagonal line that reads as a wooden stick or chopstick. Nothing shows it comes from the wrist console. It has no glow, no metal and no hilt.
 4. Floating green glyphs ("D", "r" and 2-3 single pixels next to the blade) are orphan pixels. At 112 px they look like dirt, not code.
 5. Contrast: 35.8% of pixels are low-contrast against the #1a1612 panel. The black jacket and pants merge into the UI in the preview. There is no rim light on the right or top-left edge of the jacket, and the legs are a single dark mass.
 6. Brief misses: no white synthetic blood (instead, unexplained orange/tan smears on his right chest panel, which read as rust or dirt), no thin green trim on the jacket, and skin is not the pale synthetic tone. Pose is dead frontal and symmetric, not the bible's 15-degree turn.
 7. Construction: the right fist (screen right) holds nothing and the left fist hides the blade root. The blade's attachment point is unexplained.
Fix (prompt delta, self-contained, repeat the STYLE_BIBLE style-lock text verbatim):
 - "semi-chibi, exactly 3 heads tall, head one third of total height, same proportions as the reference heroes, feet on baseline, body turned 15 degrees right".
 - "young man, pale cool-toned synthetic skin, short thick black hair with faded sides and a side-swept quiff, thin neat mustache and short chin goatee, black clubmaster sunglasses with a gold bridge, the left lens cracked showing one glowing terminal-green circuit eye, small silver hoop earring with a tiny cross, thin silver chain".
 - "black high-collar tactical jacket with a thin terminal-green piping line down the zipper and cuffs, dark gray pants (lighter than the jacket), black boots; cool blue-gray rim light on the right edges, warm top-left key light".
 - "RIGHT forearm wears a chunky wrist console with a green screen; a thin straight glowing white-green monofilament blade extends forward from the console's front edge past the knuckles (attached to the console, not held), pointing down-forward".
 - "a streak of milky WHITE synthetic blood on the cheek or jacket".
 - Remove: floating letters/code glyphs around the weapon, orange/brown stains, stick-like brown blade.
