# Asset routing table - "when Diogo asks for X, this is the exact path"

Folders: `art_gen/prompts/` (prompt text per attempt) -> `art_gen/out/` (raw download, git-ignored) -> `art_gen/out/clean/` (code-cleaned) -> Jacquin verdict in `art_gen/verdicts/` -> `art_gen/approved/<category>/` (git-tracked finals) -> integrated into the game (`assets/`, `js/`) -> `python build.py test.html` -> check in browser (muted) -> commit.
Generator: use.ai Images page, model "Nano Banana 2 Lite" (quota via `fetch('/v1/limits')` on use.ai; ~4% per image; window 24h). Helpers saved in the use.ai tab's localStorage: `SL` (style lock), `IV` (icon variant), `GEN1` (start generation), `WAIT` (get the image URL). Download+clean: `art_gen/tools/fetch.ps1 -Url ... -Name <name> -Expect N -Colors 24 [-Floor 70] [-Canvas 40]`.
Text on art: never generated; added by code (`tools/label.py`) or HTML/CSS.

| Request | Prompt recipe (always start with STYLE LOCK) | Cleanup flags | Approved to | Integrated into | Notes |
|---|---|---|---|---|---|
| Hero battle sprite (12) | hero variant + ficha + photo-derived signature features; 1 hero per image, 2 poses side by side if quota allows | `--expect 1|2 --colors 24` | `approved/heroes/<id>.png` | `assets/sprites2.json` key `<id>` (frames idle[4]/atk[4] built procedurally by `tools/export_sprite.py`), `js/art.js` STEPS/SHW (new keys only) | canvas 112x112 anchor ax36 ay108 s.85 (tank 160x160 s.62); Jacquin likeness check vs `art_gen/refs/<id>/` |
| Hero portrait/avatar | bust, front, same style, expression set | `--colors 24` crop to 96x96 | `approved/portraits/` | `assets/ava_<id>.png` (96x96; build.py embeds every `ava_*.png` as `AVA[id]`) | Julia busts 160x208 `ava_jul0..3` |
| Monster / boss | monster variant, 1-2 per image (2 poses for key monsters) | `--expect N --colors 24` | `approved/monsters/<key>.png` | `assets/sprites2.json` key + `js/battle.js` CHAPMON (k/m overrides) + `js/art.js` STEPS/SHW | Clorox label added with `tools/label.py`; detached effects (`*_fxN.png`) become CSS/JS effects |
| Big Head boss (5 stages) | photos in `refs/bighead/` -> description; stage table in GAME_BIBLE | `--colors 24` | `approved/bosses/bh<1-5>.png` | sprites2.json keys bh1..bh5 | head grows each chapter |
| Item icon (PoE bases) | icon variant, 4 per image, same angle | `--expect 4 --colors 22 --floor 70 --canvas 40` | `approved/items/<slot>_<base>.png` | `assets/icons2.json` key `item_<slot>_<base>` (40x40, shown 2x); rarity = frame in CSS | list in `ITEM_BASES.md` |
| Currency/key/chest/nav icon | icon variant, 4 per image | same, `--canvas 32` or 48 | `approved/icons/` | `assets/icons2.json` existing keys (gold, gem, key_*, chest_*, ui_*, ticket) | replaces the placeholder with the same key |
| Background (battle, chapter) | background variant, 1 per image | none (scene is not keyed) -> `tools/export_bg.py` resize to 320x293 | `approved/bg/` | `assets/bg_ch.json` keys 0-4 (battle field), `assets/bg2.json` wide (320x293) / tall (320x693) for home | add a readable floor line |
| UI kit (frames, buttons, bars) | sheet of parts | `--expect N` | `approved/ui/` | `css/style.css` (border-image/background), `index.html` | 9-slice friendly |
| Cutscene panel | comic page 4 panels | split in code | `approved/cuts/ch<N>_<n>.png` | `js/cuts.js` panel `img` + `build.py` embed | no text in art |
| Logo/title | logo without letters + text via CSS | | `approved/logo/` | `assets/logo.png` (128x108) | |

Rules: Jacquin approves before integration; max 4 attempts per asset; log every attempt in `art_gen/JOURNAL.md` (one line); no assets from photos leave the PC (refs are git-ignored).
