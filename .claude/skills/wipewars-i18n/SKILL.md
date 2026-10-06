---
name: wipewars-i18n
description: Use whenever you add or change ANY visible text in Wipe Wars (UI labels, hero/monster/item names, tooltips, cutscene lines, tutorial lines, toasts) so it has a Portuguese translation. Load before editing js/*.js, index.html text, or adding new heroes, monsters, items, screens or art that carries text.
---

# Wipe Wars PT/EN rule

The game writes English in the code and translates to Portuguese (BR) at the DOM level in `js/lang.js`. A string with no entry stays English for PT players.

## How it works
- `PT` (object, starts near line 5 of `js/lang.js`): exact-string dictionary `'English text': 'Texto em português'`.
- `RX` (array, ~line 104): regex rules for strings with numbers/names, e.g. `[/^Level (\d+)$/,'Nível $1']`.
- `TIERW`, `TYPEW`, `SETW`, `RARW`: item-name grammar (tier/type/set/rarity words). New item words go here.
- `t(s)` translates a string in code; a MutationObserver translates text nodes and `placeholder`/`aria-label`/`title`. `setLang(l)` switches; `save.lang` stores it.

## Checklist when you add text
1. Write the English text in the code exactly as it will display.
2. Add the PT entry (exact match) in `PT`, or an `RX` rule if it contains variable parts. Keep keys identical, including punctuation and `·`.
3. New hero/monster/boss/item names: add them too (proper nouns that stay the same still need `'Jack':'Jack'` only if they are inside longer sentences - otherwise skip).
4. Dynamic text built with `innerHTML`/typewriter effects: call `t()` before animating (the tutorial bug fixed in v34).
5. Prefer natural Brazilian Portuguese, informal and short, matching the game's humor; keep inside jokes.
6. Verify: rebuild `python build.py test.html`, switch to Portuguese in Settings > Language, open every screen you touched and look for leftover English. The `calendar` screen was not covered by the earlier crawl: check it manually.
7. Art with baked-in text (logos, banners, signs) must be generated WITHOUT text (the generator garbles it) and have the text added in HTML/CSS so it can be translated.
