# Generator comparison: use.ai (Nano Banana 2 Lite) vs Gemini app - Clorox canister monster

Judged by Jacquin, 2026-10-06. One sample per generator (N=1), same concept and same style lock. Measured with Pillow/numpy on the raw JPGs, the cleaned PNGs and `out/clean/*_report.json`.

## Measurements
| | A) use.ai (attempt 2, label stamped) | B) Gemini app (attempt 1, label blank) |
|---|---|---|
| Detected pixel period (x / y) | 10.25 / 10.25 px, conf 4.4 / 5.4 | 10.25 / 10.25 px, conf 5.4 / 5.6 |
| Logical canvas | 99 x 99 | 99 x 99 |
| Sprite size after cleanup (idle / attack) | 36x68 / 44x76 | 40x84 / 48x83 |
| Colors after 24-color quantize (before label) | 24 / 24 | 23 / 23 |
| Mean saturation / value (HSV, opaque pixels) | S 0.55 / V 0.72 | S 0.75 / V 0.75 |
| Approved item icons, same measure | S 0.21-0.58, V 0.40-0.61 (muted, dark) | - |
| Raw unique colors (5-bit), JPEG noise | 4901 | 5356 |
| Background | flat magenta, std ~4 (JPEG only) | flat magenta, std ~4 (JPEG only) |

Grid quality is a TIE: both generators snap to the same ~10.25 px block grid, both cleaned with one code pass and 23-24 colors. Pixel integrity is not what separates them. Style and design are.

## Verdicts

```
JACQUIN VERDICT: REJECTED   (FIXABLE_IN_CODE)
Asset: ch1_clorox idle+attack, use.ai attempt 2 (ch1_clorox_1.jpg / clean/ch1_clorox_label_preview.png)   Type: monster   Attempt: 2
Scores: pixel 86 | silhouette 88 | color 85 | anatomy 84 | design 88 | symmetry 86 | ready 82 | brief 92 | likeness N/A   => overall 86
Likeness check: N/A (original monster)
What works: teeth on BOTH jaws (lid and can rim), dark maroon throat, fat cream tongue in attack, grimy speckle, violet-cool shadow side with blue rim: this is the dark-fantasy mood of the approved icon set (S 0.55 vs icons 0.21-0.58). Reads as "Clorox monster" at 60 px (teeth rows visible, label word legible).
Defects (most severe first):
 1. Attack frame still has the round knob on the lid and orphan pixels beside the flame (preview shows a stray dark dot at far left); previous verdict items a, d, e not yet applied.
 2. Palette is 30 colors after label stamping (cap 24); label blue still paler than the approved accent.
 3. Idle tongue 2-3 px thin, same cream as base ring; idle and attack bbox/pivot differ (36x68 vs 44x76).
 4. Body is 68-76 logical px tall: bigger than the 48 px small-monster target (acceptable only if this is a boss/chapter anchor, owner to decide).
Fix: code only: delete components < 12 px, remove knob, shared 24-color palette with locked accents, pivot from can body, thicken idle tongue.

JACQUIN VERDICT: REJECTED   (REGENERATE, prompt delta below)
Asset: ch1_clorox idle+attack, Gemini app attempt 1 (ch1_clorox_gem1.jpg / clean/ch1_clorox_gem1_preview.png)   Type: monster   Attempt: 1
Scores: pixel 84 | silhouette 80 | color 78 | anatomy 80 | design 78 | symmetry 72 | ready 78 | brief 80 | likeness N/A   => overall 79
Likeness check: N/A (original monster)
What works: very clean large shapes and a clearer burning wipe (cream square with a real flame, better than use.ai's small flap); wide maroon mouth in the attack frame; sharp 1px navy outline. Grid is as clean as use.ai.
Defects (most severe first):
 1. Mood: S 0.75 and flat, banded orange stripes with no grime; reads as a bright mobile-game/sticker can, not dark Path-of-Exile. Next to approved icons (muted, violet-fringed, S <= 0.58) it is the loudest piece in the set. Symmetry fail.
 2. Fangs are sparse and thin: 4-5 tiny white triangles on the lid, a few on the rim; at 60 px the idle frame shows an orange disc with a tongue and no readable mouth. Silhouette/brief weak.
 3. Idle lid floats detached above the can with a hollow gap; the attack canister is tilted about 8 degrees, so the grid shears (stair-stepped edges) and the pivot differs from idle: breaks bottom-center anchoring for the lunge animation.
 4. Pale cyan 1-px rim fringe on the right edge (stronger than the "thin cool rim light" in the lock); it survives key/erode as a light halo risk.
 5. Cleanup damage: the label band turned gray-blue after 24-color quantization (blue slot lost), and sprite is 83-84 px tall vs 48 px small-monster target.
Fix: REGENERATE with the Gemini delta in the section below, upright can (no tilt) in both frames, then lock an accent blue before quantizing.
```

## Recommendation
1. Standard for the project: **use.ai until the trial ends (2026-10-12/13), then Gemini with the adjusted style lock.** Not Gemini-only today: on this sample Gemini is a different art style (brighter, cleaner, flatter) and would break symmetry with the 18 approved icons. Not use.ai-only: the trial ends in about 6 days and the free tier is the only no-cost path. Caveat: N=1 per side, and Gemini's gap is mostly tone/saturation and tooth density, which are prompt-controllable; its grid quality already equals use.ai.
2. Use the remaining trial days for everything where "same look" matters most and that needs many attempts: all chapter monsters/bosses and anchor assets (ANCHOR_monster, base hero body, ANCHOR_bg). Generate them now, approve, freeze.
3. Before the trial ends, run Gemini attempt 2 of Clorox WITH the delta below plus approved references uploaded (Gemini accepts images). If Jacquin passes it at >= 88 raw, the switch is safe. If not, spend the trial's last day generating the largest backlog possible, and fall back to AI Studio API with the same delta.

## Prompt additions to make Gemini match the use.ai look
Append after the STYLE LOCK (and upload 3 approved icons + the approved Clorox as "style reference, match palette and mood exactly"):

> Mood: grim, grimy dark fantasy, NOT cheerful, NOT cartoon, NOT mobile-game sticker. Overall saturation about 55%: muted, slightly dirty colors; keep ONE saturated accent only (the blue label, plus orange for fire). Mid-tones are darker and dustier than usual; the yellow is a worn mustard-ochre (about #d9a021), not bright lemon. Add 20-30 scattered single-pixel scuffs, dents and grime specks on the body, and a darker stained band near the base. NO flat horizontal orange bands or stripes; use irregular dither-free patches of 3 tones only. Shadow side (right third) shifts to cool violet-blue (#3b3558), with a 1-pixel pale blue rim, NOT cyan, NOT bright. Outline: 1 pixel, dark violet-near-black (#1f1530), thinner and quieter than the fill; no double or doubled outlines. Mouth: deep dark maroon (#4a1418). Fangs: 7-9 chunky white-cream fangs on the lid AND 5-7 on the can rim, each at least 2x3 pixels, clearly pointing at each other. Tongue: a thick wet cream wipe, at least 5 pixels thick along its whole length, sagging over the rim. Keep the can perfectly upright with vertical sides in BOTH poses (no tilt, no perspective skew, same bottom-center). Lid is a flat slab attached by a visible hinge pixel block, no knob. Burning wipe in the attack frame: a cream square wipe at the end of the tongue with a 3-color flame (dark red, orange, pale yellow). Label band: leave the band a flat saturated blue with a blank center (code stamps the text). Creature total height about 45 logical pixels.

Code-side companion: lock the label blue and flame orange as protected accent slots before the 24-color quantize, so the label does not gray out.

## Risks of switching mid-project, and mitigation
| Risk | Mitigation |
|---|---|
| Two visual "dialects" (muted use.ai vs bright Gemini) in one roster | Approve and freeze the anchors during the trial; judge every Gemini output against the ANCHOR files, using the same Jacquin score gate (symmetry >= 90) |
| Saturation/value drift between batches | Code harmonization pass after cleanup: scale saturation to the roster mean (S ~0.5), remap into a shared project palette in OKLab, lock one outline color (#1f1530) |
| Different sprite scale (Gemini sprites came out 83 px vs 68 px) | State the exact logical height in every prompt and normalize with the integer-only rescale step; check the pivot rule (bottom-center of body only) |
| Inconsistent proportions between hero sets | Generate the whole hero base set and all four attribute item sets inside the trial; later Gemini jobs are only variants/recolors, uploaded with the approved base as reference |
| Gemini free limits/model changes | Treat free-tier numbers as unverified; keep ComfyUI/SDXL as plan C; save every winning prompt verbatim in `art_gen/prompts/` |
| Regeneration cost if the switch fails | If a Gemini asset fails symmetry twice, do not retry blind: apply the harmonization pass, then ESCALATE per the 4-attempt rule |

Assets to regenerate first if the owner insists on a single generator: none of the 18 approved icons (use.ai, frozen); everything NOT yet generated should be produced on use.ai first. If Gemini becomes the standard after all, regenerate only the Clorox pair (and any asset measured above S 0.70) rather than the approved icons, and re-measure with `ch1_*_report.json`.
