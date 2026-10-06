# Style calibration (Jacquin) - Nano Banana 2 Lite

Basis: art_gen/out/test_monster.jpg, test_icons_sheet.jpg. Verdicts: test_monster_1.md (70, REJECTED), test_icons_1.md (73, REJECTED).

## (a) Is it good enough as the style anchor?
Yes as a render style, no as raw output. Do NOT ask for "more sophisticated"; more detail is the enemy (the figure is ~150 logical px tall and gets displayed at 112; icons ~30 logical px and displayed at 48). Ask for BOLDER, SIMPLER, HIGHER-CONTRAST. Dark-fantasy chunky 16-bit with dark outline, 3-tone materials, top-left light matches the Path-of-Exile mood and beats the current placeholders (flat, same shape recolored; hero art is pixelated photos).
Gaps to close: sub-pixel noise, vignette/gradient backgrounds, glow effects, low value separation between limbs/torso, drift in grid across the image, inconsistent construction between sibling items.
Approve the style only after one cleaned test (monster + 4 icons) passes at the real in-game size on the real dark UI background.

### Exact style-lock text (paste at the start of EVERY prompt, unchanged)
```
STYLE LOCK: Hand-placed 16-bit pixel art for a dark-fantasy idle RPG. One uniform pixel grid: every pixel is a clean square block, all the same size, aligned to the grid, no anti-aliasing, no blur, no smooth gradients, no glow, no soft shadows, no sparkle effects, no film grain, no JPEG look. Outline: exactly 1 pixel thick, dark near-black tinted with the local color (never pure black), unbroken around the whole silhouette; inside the shapes separate parts with color shifts, not extra outlines. Shading: 3 tones per material (shadow, base, highlight) plus a single bright specular pixel cluster on metal and gems; shadows shift cooler toward blue-violet, highlights shift warmer toward yellow. Light comes from the top-left, shadow falls bottom-right, plus a thin cool rim light on the right edge so the shape separates from a near-black background. Palette: at most 24 colors per asset, muted dark-fantasy base colors with ONE saturated accent color; big shapes have clear value contrast (head and torso lighter than limbs). Bold simplified shapes, chunky details at least 2x2 pixels, no fine texture noise, no text or letters. Proportions: semi-chibi, character 3 heads tall, head about one third of total height, large hands and feet, short thick limbs. Perspective: flat orthographic front view, no foreshortening, body slightly turned 15 degrees toward the right, feet on one baseline. Background: one perfectly flat solid #FF00FF magenta, no gradient, no vignette, no floor, no cast shadow, nothing else in the image. Full figure visible with at least 10% empty margin on all sides.
```
For monsters replace the proportions sentence: "creature 2.5 to 3 heads tall, chunky, silhouette readable at 64 px". For icons replace it: "single object, centered, fills about 80% of its cell, same viewing angle and same scale as its siblings, drawn so it still reads at 32x32 pixels". Do not use magenta in any asset (purple tier uses violet #5a2d82-ish, away from magenta; ban glow).

## (b) Cleanup in code (required, in this order)
1. Remove the background first, on the JPEG: sample the 4 corners; flat key #FF00FF with tolerance on chroma (not RGB distance) in Lab, then 1-px erode of the alpha mask; 2-px decontaminate (replace edge pixels' magenta tint by the nearest interior color). If generator still gives gray, flood-fill from the border with tolerance 18 per cell, never a global color key.
2. JPEG denoise before snapping: bilateral/median 3x3 (or non-local means h=6). Do not blur; just kill ringing.
3. Detect grid per image (per CELL on sheets): autocorrelation / edge-histogram on x and y to find the period p (expect 5-6 px at 1024) and the phase; verify the period by checking edge density at multiples. If detection confidence is low, regenerate.
4. Snap: for each p x p block take the MODE (after palette quantize) of the center 60% pixels, not the average; write a 1x logical image (about 115 x 150 for a character, about 30 x 30 for an icon).
5. Palette: quantize with median-cut/k-means in OKLab to max 24 colors (monster/hero) or 16 (icon); lock outline color to a single darkest color per asset, merge near-duplicates (dE < 6), then remap.
6. Outline fix: any logical pixel adjacent to transparent that is not the outline color becomes the outline color (forces unbroken 1-px outline); delete orphan pixels (4-neighbor count 0 with different color) and fill 1-pixel holes.
7. Rescale for the game: NEVER bilinear. Prefer integer: icons 32 logical -> display 64 (2x) (or redraw cell at 24 -> 48) ; heroes ~150 -> if display must stay 112, re-snap to a 56-logical-px-tall source at 2x using area-average downscale then re-quantize and re-run step 6; otherwise raise the hero display size to about 150. Decide before generating the roster.
8. Sheet cutting: cut by the generator's cell borders, then per cell compute the alpha bbox, scale to a common max dimension, center horizontally and anchor feet/bottom (heroes) or center both axes (icons), pad to the final cell size (64x64 icons). Export PNG with transparent bg, no premultiplied alpha, and a contact-sheet preview on #1a1612 (the game's dark panel) for review.
9. Save the cleaned PNG, and send Jacquin the cleaned PNG at 1x AND at in-game size on the dark panel.

## (c) 4-hero sheet prompt must contain
- Style lock (full text) verbatim.
- Layout: "a 4-column by 1-row sheet, 4 separate characters in equal invisible cells of 256x256 within a 1024x256 image" (ask for a 1024x1024 output only if the model forces square: then 2x2 with big margins and cell centers listed).
- Identical scale rule: "all four characters exactly the same height, 3 heads tall, head 1/3 of height, top of head at the same y line, feet on the same baseline, same head size, same hand size, same outline weight, same light direction; none touches the cell borders or another character".
- The same pose for all: "standing idle, arms relaxed, weapon held in the right hand, front view turned 15 degrees right" with role differences only in costume/prop/silhouette (tank = wide + big shield, dps = lean + weapon, support = staff + hat/hood, ranged = bow, etc.).
- One line per hero with face signature features (from the questionnaire), own color accent (4 distinct hues), and "same pixel size for all characters".
- Negatives: "no overlapping, no cropped limbs, no text, no ground, no shadow, no glow, no extra characters, no background texture".
- Symmetry assurance: "characters are mirrored in the layout from left to right as pairs"? No, simpler: tell the model to first draw a neutral base body and then dress it; for roster symmetry, ALWAYS generate a body "template" hero once, approve it, and pass it as the image reference for every later prompt.
- Use the approved monster/hero as an image-to-image reference whenever the tool supports it (strongest consistency lever).

## (d) Risks
1. Grid drift: the generator's pixel size varies slightly across the image, so global snap will smear; mitigate with per-cell snap, and reject images where detected period variance > 0.3 px.
2. The "pixel art" is rendered fake pixel art: soft gradients inside blocks will survive as muddy 2-3 tone blocks after quantization. Mitigate with the "3 tones, no gradients" lock and by re-quantizing after snap.
3. Roster drift: separate generations will not share proportions or shading; only a reference-image workflow and per-batch review will fix this.
4. Dark-on-dark: dark-fantasy palette loses on dark UI; require rim light and a value check (min luminance contrast 4.5:1 between silhouette mean and panel) in code.
5. Likeness of real friends: this generator does low-detail faces; at 112 px faces are about 20-30 px tall. Beard/glasses/hat signature features must be exaggerated, otherwise likeness is lost (the current photo-pixelated portraits already have more likeness than a 2-px-eye chibi).
6. Magenta key bleed into purple/pink items and the lime-green text on the can; gold tier highlights can contain specular near-white that the key can eat. Verify each key with a preview on magenta, black and the dark UI color.
7. Text/logos (the can "Z") are hallucinated per image: do not rely on legible text; make it a single bold glyph or a stripe pattern.
8. Quota/iteration cost: use.ai Lite may fail identical prompts differently; cap at 4 attempts per asset (Jacquin escalates), keep seeds/prompts in art_gen/prompts.
9. Icon scale: 48 px display vs 32 logical is a non-integer scale; fix the target size now (32 logical -> 64, or 24 -> 48) so the whole UI uses one consistent pixel size and mixed-pixel-size violations do not appear next to UI text/panels.
10. Missing process assets: STYLE_BIBLE.md and art_gen/approved/ do not exist yet, so symmetry cannot be judged. Create them from the cleaned versions of these tests before the roster is generated.
