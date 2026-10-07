# JACQUIN VERDICTS - HEROES BATCH 1 (attempt 1 each)

Assets: out\clean\hero_{jack,daniel,ze,donnie,chavoso,rafinha}_gem1_0.png (+_x4, _preview). Raw: out\hero_*_gem1.jpg. Refs: refs\<name>\. Blind-ID waived by owner (real friends); likeness judged at in-game size (~90 logical px, shown 112).

| hero | verdict | fix |
|---|---|---|
| Jack | APPROVED | none. (Optional later: move the cool rim light from the left edge to the right edge for roster consistency.) |
| Daniel | REJECTED - FIXABLE_IN_CODE | Recolor the staff orb: in the clean PNG it has the skin colour (230,202,174) because the pale green was merged into the skin palette slot (raw orb is green). Repaint the orb pixels pale green (~#9fd8a0 base, #d5f5c8 highlight, #5a9a6a shade). Then APPROVED. |
| Ze Vitor | REJECTED - FIXABLE_IN_CODE | (1) Skin is khaki-green (193,182,133) and mauve-grey shade (169,141,140); the raw JPEG is already this colour (generator error). Remap the face/arm/hand ramp to warm light-olive: base ~(222,170,125), shade ~(176,120,92), highlight ~(236,192,150); leave hair, teeth and shirt untouched. (2) The white sneakers have no dark outline underneath: bottom edge rows are beige (183,174,154), roster rule is an unbroken dark 1px outline. Add the dark outline colour under both shoes. Then re-judge. |
| Donnie | REJECTED - REGENERATE | Face is not recognizable at game size (see block). Prompt delta below. |
| Chavoso | REJECTED - REGENERATE (halo+string are code-rescuable but face detail is too weak) | Prompt delta below. |
| Rafinha | REJECTED - REGENERATE | Build and skin wrong for the brief (see block). Prompt delta below. |

## Answers to the two known issues
1. Chavoso pale dotted outline/bow string: BOTH. The raw JPEG already has a pale lilac/white sticker-style halo about 1 block thick around the whole silhouette, and the bow string is a hair-thin white line (about a third of a block, off-grid). tools\clean.py then makes it worse: key_background only removes magenta-leaning pixels, so the lilac halo survives as sprite content; fix_outline then adds a NEW dark outline outside the halo, leaving a pale ring one pixel inside the outline; the block median (20-80% sampling) turns the sub-block string into dotted dashes. Code rescue if wanted: before fix_outline, delete pixels with lum>140 and chroma<40 within 2 px of the alpha edge (re-outline afterwards) and redraw the string as one solid 1-px line between the two bow tips.
2. Skin tones: Ze Vitor and Rafinha are greenish-khaki IN THE RAW JPEG (generator bias; Ze 193,183,132; Rafinha 196,173,128; refs are warm light-olive). Donnie's raw skin is correct warm peach (238,196,173); the grey-mauve (161,131,140) seen in the clean PNG is introduced by clean.py quantization: stubble, lips, nose shadow and chin merged into one flat blob (also erased the septum ring, the mouth and the neck tattoo). Same tool also turned Daniel's green orb into skin colour.

## Batch-level symmetry (all six)
- Pixel scale: all six share period 10.25 on 99x99 logical, heights 86-94 px, same scale as the approved monsters (88-97 px). OK. Palette 23-24 colours each. OK.
- Outline: dark near-black, unbroken, 1 px on all except Ze's shoe soles (fail) and Chavoso's pale inner halo ring (fail).
- Head ratio: head is about 41-46% of height (about 2.3 heads), NOT the bible's 3 heads/33%. Consistent across the six, so roster-safe; owner should either accept it and update the bible, or require "head one third" in all regenerations. Decide once so Donnie/Chavoso/Rafinha regenerations match the five others.
- Light/rim: lavender cool rim sits on the LEFT edge on Jack/Daniel/Rafinha (bible: right edge). Minor, consistent, not a blocker.
- Contrast vs UI panel (#1a1612), % of pixels low-contrast: Jack 21, Ze 20, Daniel 26, Rafinha 31, Chavoso 45, Donnie 60. Donnie fails readability.
- Faces: eye style differs (Ze/Donnie large eyes with whites, Jack/Daniel/Rafinha small dark eyes). Acceptable but regenerations should use the Jack/Daniel eye style.

---

## JACQUIN VERDICT: APPROVED
Asset: hero_jack_gem1_0   Type: hero sprite   Attempt: 1
Scores: pixel 92 | silhouette 94 | color 91 | anatomy 91 | design 93 | symmetry 92 | ready 92 | brief 94 | likeness 90   => overall 92
Likeness: round thin glasses present; full dark beard + mustache present; thick brows present; small silver hoop present (1-2 px, weak); wavy dark hair/high forehead hidden by hat (weak, acceptable, hat is the owner-approved costume); olive-tan skin correct (221,161,117). Blind-ID: n/a. Distinct from the other bearded heroes: yes (hat, glasses, whip).
4b: hat sits on skull with brim over brows; vest over teal shirt with belt; bracer wraps the forearm; whip handle leaves the fist and coils down to the ground, readable; boots with spurs at baseline. No unexplained attachments.
Defect to watch: glasses are 1 px grey lines, thin at 112 px but still read.

## JACQUIN VERDICT: REJECTED (FIXABLE_IN_CODE)
Asset: hero_daniel_gem1_0   Type: hero sprite   Attempt: 1
Scores: pixel 90 | silhouette 91 | color 84 | anatomy 91 | design 92 | symmetry 91 | ready 90 | brief 86 | likeness 91   => overall 89
Likeness: full dark-brown beard + mustache present; round full face present; short dark swept-back hair, receding temple (present); ear plug (present, left ear); forearm tattoos (present on both hands/forearm, weak-medium); cockatiel with yellow crest + orange cheek (present, strongest feature); stocky build (present). Distinct from other heroes: yes (bird, robe).
4b: bird perches on the shoulder (feet gripping the hood edge) OK; hood/cowl drapes over shoulders, rope belt with pouch ties properly, sleeves open; staff held in fist, orb socketed in a twisted wood fork OK.
Defects: 1. Staff orb is skin beige (230,202,174) instead of the raw green; it reads as a bone ball and the staff loses its "magic" read. 2. Cool rim on left instead of right (minor).
Fix: recolor orb pixels to pale green (see table). No regeneration needed.

## JACQUIN VERDICT: REJECTED (FIXABLE_IN_CODE)
Asset: hero_ze_gem1_0   Type: hero sprite   Attempt: 1
Scores: pixel 88 | silhouette 92 | color 74 | anatomy 90 | design 91 | symmetry 88 | ready 82 | brief 92 | likeness 84   => overall 87
Likeness: big toothy smile (present, strong); dark quiff with short faded sides (present); blue-green graphic shirt with cartoon character print (present); drum + green-tipped mallet + sticks (present); silver chain (present); light goatee (weak, 3-4 dark dots at chin); skin should be light-olive warm, is khaki-green (wrong, reads sickly). Ear stud missing (minor). With the skin fixed he is the second most recognizable of the six.
4b: drum hangs from a diagonal brown sling that crosses the chest from the shoulder (physical, OK); mallet held in the fist (OK); sticks tucked in sling; the mini-character print on the shirt is a cute reference to the photo.
Defects: 1. Skin colour greenish (raw error + quantization). 2. Sneaker soles: bottom edge rows are beige (183,174,154), no dark outline under the white shoes. 3. Raw JPEG had a stray ground-line (dashes under the feet), already removed; verify no remnants after recolor.
Fix: remap skin ramp and add dark sole outline (see table).

## JACQUIN VERDICT: REJECTED (REGENERATE)
Asset: hero_donnie_gem1_0   Type: hero sprite   Attempt: 1
Scores: pixel 80 | silhouette 86 | color 70 | anatomy 84 | design 88 | symmetry 84 | ready 84 | brief 80 | likeness 68   => overall 80
Likeness: black hair with long side bangs (present but exaggerated: long curtain to the shoulder on one side, shaved other side, reads emo/feminine; ref is a thick short-sided mop with side fringe); septum ring (lost in the clean PNG, visible only in raw); ear gauge (present, purple, good); neck tattoos (lost, merged into a blob); silver chain (present); all-black outfit (present); skull staff in black+purple (present, strong); BIG SMILE (the ref's defining trait) is a half-lidded smirk, then the clean erased the mouth into a grey-mauve blob (161,131,140). Blind-ID: no, a stranger sees a goth girl. Distinct from others: yes.
4b: skull is fixed to the top of the staff (staff passes under the jaw, OK); purple flame floats above the skull and nearly vanishes in the clean; belt charms (bone, purple vial) hang from the belt loops, OK; sleeve tattoo wraps the arm OK.
Defects: 1. Face features lost at game size (mouth, septum ring, neck tattoo, stubble merged into one flat mauve patch). 2. Expression sleepy/smug, not the open friendly grin. 3. Hair too long and feminine. 4. Near-black coat on near-black outline: 60% of pixels low-contrast vs the panel; body is an unreadable silhouette. 5. Purple flame mostly lost.
Fix (REGENERATE, self-contained: paste the STYLE LOCK first, then the Hero variant, then): "A young man, fair warm-peach skin, big open friendly grin showing white teeth, eyes wide open and smiling (NOT half-closed). Thick straight black hair as a short mop: sides and back ear-length at most, long side-swept fringe over the forehead to the eyebrow; no long hair on the shoulders. Thick dark eyebrows. Light stubble drawn as 3-4 separate dark 2x2 dots on the chin and upper lip. A silver septum ring drawn as a 2x2 silver arc under the nose. One black gauge plug in the ear, 2x2, with a small silver hoop. Neck tattoos: a dark-grey leafy wolf pattern covering the whole side of the neck, 4-5 blocks tall, clearly visible above the collar. Outfit: charcoal-grey (#3a3a4a, clearly lighter than the black outline) hooded jacket with bright violet (#8a3fd0) trim on the lapel and cuffs, black tee underneath with a silver chain; dark grey trousers; black boots with grey soles. He holds a wooden staff in his right hand, topped by a bone-white cow skull with two curved horns: the staff shaft enters the skull's underside; above the skull a violet flame 3 blocks wide rises from between the horns, attached to the skull. Every feature of the face must be at least 2x2 blocks. Head one third of total height (match the other five heroes)."

## JACQUIN VERDICT: REJECTED (REGENERATE)
Asset: hero_chavoso_gem1_0   Type: hero sprite   Attempt: 1
Scores: pixel 70 | silhouette 86 | color 82 | anatomy 86 | design 88 | symmetry 80 | ready 68 | brief 88 | likeness 80   => overall 81
Likeness: rectangular black glasses (present, strong); dark-brown side-swept fringe + faded sides (present, though the hair is a big helmet); thin mustache (weak, reads as one dash); chin strip (weak, 2 px); slim build (present); silver chain (weak); forearm wind swirl tattoo (present in raw, tiny in clean); fair skin (correct); ear stud (present in raw). Blind-ID: probably "guy with glasses and a bow" only. Distinct from others: yes.
4b: quiver straps to the back with a diagonal sling across the chest and a belt buckle (OK); left hand holds an arrow with a fingerless glove (OK); bow grip wrapped in yellow tape (OK); hood + brown mantle coat OK. Problem: the bowstring is a hairline floating off-grid and in the clean becomes disconnected dots, so the bow reads as a stick with a dotted line.
Defects: 1. Pale lilac/white halo around the silhouette in the RAW JPEG, kept by clean.py (key_background only keys magenta) and wrapped by a second dark outline, giving a dotted pale ring inside the outline (125 light pixels in ring 2). 2. Bowstring sub-grid hairline, dotted after snapping. 3. 45% of pixels low-contrast vs the panel (dark green coat on dark UI). 4. Face detail (mustache, goatee, chain, tattoo) too small to survive.
Fix (REGENERATE): add to the prompt: "The outline is ONLY the dark near-black 1-pixel outline: no white, light or lilac border or sticker edge anywhere. The bowstring is a solid 1-block-thick light-grey (#c8c8d0) line running from the top tip of the bow to the bottom tip, same thickness as the outline, no thinner. Thin black rectangular glasses, brown eyes visible. Thin dark mustache drawn as two 2x2 blocks plus a dark chin strip 2 blocks wide under the lip. A silver chain as a clear 1-block light line on the chest. Forearm tattoo as a 3x3 dark swirl on the pale forearm. Coat colour: medium forest green (#3f6b4a), lighter than the outline, with tan-brown mantle; slim body. Head one third of height." Fallback if the owner wants to save the image: run the halo-removal + string redraw described above, but the face-detail weakness would remain.

## JACQUIN VERDICT: REJECTED (REGENERATE)
Asset: hero_rafinha_gem1_0   Type: hero sprite   Attempt: 1
Scores: pixel 90 | silhouette 90 | color 78 | anatomy 88 | design 84 | symmetry 82 | ready 90 | brief 70 | likeness 84   => overall 83
Likeness: full black beard + mustache (present, strong); thick dark brows (present); short dark messy hair (present); faint green veins (present, neon, a bit loud but good as the monster hint); SHORT stature (MISSING: he is the tallest/widest sprite, 94x81 vs 86-91 for the others, with bodybuilder arms); skin should be olive/fair-warm, is khaki-green (196,173,128, generator error). Calm slight smile (missing, he glares sideways). Blind-ID: reads as "generic bearded brute"; shares the beard and hair-colour family with Jack and Daniel but is distinct by black hair + tank top.
4b: tank top over torso, belt with buckle, wrist guards wrap the forearms, cargo shorts with a thigh pocket, boots. Constructively clean. But the normal form is already a hulking orc-sized muscle man, so the ult transformation (bigger, stronger, orc) has nothing left to grow into; owner brief says "SHORT, SUBTLE monster signs".
Defects: 1. Build too big/tall for "baixinho" and for a pre-ult form. 2. Skin tone greenish. 3. Expression angry, brief says calm slight smile. 4. Veins neon green and everywhere, not subtle.
Fix (REGENERATE): "A SHORT stocky man, clearly the shortest of the party: legs short and the body about 10 percent smaller than a normal hero, thick but ordinary arms (not bodybuilder). Warm olive-fair skin (#d9a577 base, #b57f58 shade). Short dark messy hair with a side fringe, thick black eyebrows, full neat black beard and mustache, calm slight friendly smile with the mouth visible in the beard, eyes looking at the viewer. A few thin green vein lines (3-4 blocks) only on the back of one hand and one side of the neck. Outfit: black short-sleeve tee, dark grey cargo shorts or trousers, one leather wristband per wrist, brown boots. Head one third of total height." Accept the existing outfit only if the owner prefers it; the skin can then be recolored in code, but the build and expression must change.
