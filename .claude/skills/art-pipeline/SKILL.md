---
name: art-pipeline
description: Use for ANY Wipe Wars art task - generating an image on use.ai (Nano Banana 2 Lite), downloading it, cleaning it to game-ready pixel art, getting Jacquin's approval, and wiring it into the game (sprites2.json, icons2.json, bg2/bg_ch, assets/ava_*). Load before generating, converting, reviewing or integrating any sprite, portrait, monster, boss, background, icon, UI piece or cutscene panel.
---

# Wipe Wars art pipeline

Nothing ships without **Jacquin's APPROVED** (`.claude/agents/jacquin.md`). Read `ART_PLAN.md` and `art_gen/STYLE_BIBLE.md` first; copy the style-lock text into EVERY prompt (the generator makes ONE image per prompt and has no memory).

## 1. Generate (use.ai, built-in browser)
- The user must already be logged in (never type their credentials). Open https://use.ai/images, model "Nano Banana 2 Lite", ratio 1:1 unless the asset needs another.
- Layout shifts: take a screenshot (scale 0.5) before clicking; the prompt box moves. Click the box, type the full prompt, click Generate, wait ~20 s, screenshot.
- Prompt skeleton: `[style-lock from STYLE_BIBLE] + [asset type, canvas, pose] + [character brief from art_gen/HEROES_QUESTIONNAIRE.md] + [palette] + "plain flat light-gray background, no text, no shadow, centered, whole body visible"`.
- Icons/UI/props: ask for a sheet (grid, equal cells, flat background) and cut with code. Sprites/portraits/backgrounds: one subject per image.
- Never reuse a chat thread's drift: start each asset with a fresh full prompt.
- Log every attempt in `art_gen/log.csv` (asset, attempt, prompt file, result path, verdict).

## 2. Download (only after the user granted download permission)
Save to `art_gen/out/<asset>_<attempt>.png` (git-ignored). Use the in-page image src/download button; verify the file opens and is not tiny.

## 3. Code cleanup (Python at `%LOCALAPPDATA%\Programs\Python\Python313\python.exe`)
Scripts live in `art_gen/tools/`. Steps: flat-background removal (flood from corners + tolerance, no halo) -> crop to content -> detect/force pixel grid -> nearest-neighbor downscale to target size -> quantize to the shared roster palette (hue-shifted ramps in `art2/palette.py`) -> 1px dark outline cleanup (`art2/pxclean.py`, `art2/pixelize.py`) -> feet anchor. Reuse `art2/pxlib.py` helpers where they fit.
Targets: hero sprite 112x112 (tank 160x160 allowed), small monster 64 wide, boss up to 89x165, avatar PNG like `assets/ava_*.png`, icons 48x48 cells, backgrounds like `assets/bg_wide.png`/`bg_tall.png`.

## 3b. Blind-ID test (mandatory before Jacquin for every monster, boss and item)
Spawn an agent with `model: sonnet` (haiku sees too little in pixel art and gives false failures; tested 2026-10-07), general-purpose, that views ONLY the cleaned `*_x4.png` of ONE creature per file (no names, no brief; tell it adult-humor everyday-object enemies are possible; ask top-3 guesses + confidences + any illogical/sloppy part) and says what each creature/item is plus confidence. Save its answer to `art_gen/verdicts/blind_<asset>.md` and hand it to Jacquin (category 10). Mismatch or confidence < 70 => regenerate with the object described more literally (see STYLE_BIBLE recognizability rule).

## 4. Jacquin gate
Spawn the `jacquin` agent (or a general-purpose agent given the contents of `.claude/agents/jacquin.md` if the type is not registered yet) with: file path, asset type, the brief, attempt number, and `art_gen/approved/` references. He returns APPROVED / REJECTED (FIXABLE_IN_CODE | REGENERATE | ESCALATE). Obey it. Max 4 attempts, then change approach.
Approved files -> `art_gen/approved/<asset>.png`.

## 5. Integrate
- Sprite entry shape in `assets/sprites2.json`: `SP[key]={w,h,ax,ay,top,s,idle[4],atk[4]}` (data-URI PNG frames). Animation is procedural: build 4 idle frames (1-2px bob/squash of the single approved image) and 4 attack frames (same image; the lunge/scale comes from `STEPS` in `js/art.js`).
- A NEW sprite key also needs `STEPS[key]` and `SHW[key]` entries in `js/art.js` (shadow width), or battle crashes.
- Avatars: `assets/ava_<key>.png`; icons: `assets/icons2.json`; backgrounds: `assets/bg2.json` / `bg_ch.json`.
- Rebuild: `python build.py test.html` (always to test.html first), serve the folder and check in the built-in browser **with sound muted** (`Music`/audio off) - the user asked for no music during tests.
- Commit per approved batch with the attribution line the session specifies; push only if the user wants.

## 6. Roster symmetry rules (Jacquin enforces)
Same head-to-body ratio, outline weight, light from top-left, shading model, detail level, canvas and foot-anchor for every hero; monsters share their own consistent set. When in doubt, compare against the first approved piece (the "style anchor").
