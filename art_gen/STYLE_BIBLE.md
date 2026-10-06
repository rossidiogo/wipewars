# Wipe Wars - Style Bible (source of truth for every art prompt and for Jacquin)

Written from Jacquin's calibration (`verdicts/style_calibration.md`) + owner decisions (2026-10-06).
Owner decisions: semi-chibi, dark Path-of-Exile mood (dark + gold), "just make it beautiful", items = pixel-art versions of popular **PoE1 rare bases** (no uniques), heroes get a main attribute STR/DEX/INT, Jacquin gates everything.

## 1. STYLE LOCK (paste unchanged at the start of EVERY prompt - the generator has no memory)
STYLE LOCK: Hand-placed 16-bit pixel art for a dark-fantasy idle RPG. One uniform pixel grid: every pixel is a clean square block, all the same size, aligned to the grid, no anti-aliasing, no blur, no smooth gradients, no glow, no soft shadows, no sparkle effects, no film grain, no JPEG look. Outline: exactly 1 pixel thick, dark near-black tinted with the local color (never pure black), unbroken around the whole silhouette; inside the shapes separate parts with color shifts, not extra outlines. Shading: 3 tones per material (shadow, base, highlight) plus a single bright specular pixel cluster on metal and gems; shadows shift cooler toward blue-violet, highlights shift warmer toward yellow. Light comes from the top-left, shadow falls bottom-right, plus a thin cool rim light on the right edge so the shape separates from a near-black background. Palette: at most 24 colors per asset, muted dark-fantasy base colors with ONE saturated accent color; big shapes have clear value contrast (head and torso lighter than limbs). Bold simplified shapes, chunky details at least 2x2 pixels, no fine texture noise, no text or letters. Background: one perfectly flat solid #FF00FF magenta, no gradient, no vignette, no floor, no cast shadow, nothing else in the image. Full figure visible with at least 10% empty margin on all sides.

### Variants appended after the lock
- **Hero:** Proportions: semi-chibi, character 3 heads tall, head about one third of total height, large hands and feet, short thick limbs. Perspective: flat orthographic front view, body slightly turned 15 degrees toward the right, feet on one baseline, standing idle, weapon in the right hand.
- **Monster / boss:** creature 2.5 to 3 heads tall, chunky, silhouette readable at 64 px, same lighting and outline rules.
- **Icon:** single object, centered, fills about 80% of its cell, same viewing angle and same scale as its siblings, drawn so it still reads at 32x32 pixels. No magenta in any asset (purple tier uses violet around #5a2d82).
- **Background scene:** same pixel rules but a full scene: dark-fantasy palette, readable floor line for the battle field, no characters, no text; background tint stays darker than the sprites so units pop.

## 2. Sheet rules (Jacquin)
- Heroes: 4 per image, same-role or mixed, equal cells, identical height/head size/baseline/pose; differences only in costume, prop and one accent hue each. Generate and approve ONE neutral base body first and use it as the reference for later prompts when the tool accepts image upload.
- Icons: **4 per image** (never 16), same size, angle and centering; boots as a pair side view toes right, gloves upright palm to viewer, armor front torso, helmet front view. Cell backgrounds one flat magenta.
- Monsters: 3 per image (a chapter set) or 1 for bosses.
- Max 4 attempts per asset, then Jacquin ESCALATEs (change approach).

## 3. Code cleanup (required order, `art_gen/tools/`)
1 key background per cell (chroma key + 1px erode + decontaminate) -> 2 median denoise -> 3 detect grid per cell (reject if period varies > 0.3px) -> 4 snap to block mode -> 5 quantize to 24 colors (16 icons) in OKLab, lock one outline color -> 6 force unbroken 1px outline, delete orphans -> 7 integer rescale only -> 8 cut cells, recenter, anchor feet -> 9 send Jacquin the 1x PNG and a preview on the dark UI panel (#1a1612).
Target logical sizes (decision): heroes ~64 px tall logical, small monsters ~48, bosses 96-140, icons 32 logical shown at 64 (2x). All drawn with the same pixel size on screen.

## 4. Attributes (colors for UI accents, not for character costumes)
STR = red (armour base) - DEX = green (evasion base) - INT = blue (energy shield base); hybrids use two. Main attributes (default, unless owner changes): STR Jack, Rafinha, Lucao, Glem - DEX Copello, Chavoso, Samuel, Malaguti - INT Daniel, Rubens, Ze Vitor, Donnie.

## 5. Items
Pixel-art versions of popular PoE1 rare bases, one set per attribute (and hybrids) per slot, rarity shown by frame/border color (Common/Magic/Rare/Legendary), not by redrawing the base. Slot list: helmet, body armour, gloves, boots, weapons (sword, axe, mace, bow, wand, staff, dagger), shield/offhand, jewelry (ring, amulet, belt). The base list is in `art_gen/ITEM_BASES.md`.

## 6. Roster anchor
The first approved hero base body becomes `art_gen/approved/ANCHOR_hero.png`; the first approved monster `ANCHOR_monster.png`; first approved icon row `ANCHOR_icons.png`; first approved background `ANCHOR_bg.png`. Everything after is judged against them.
