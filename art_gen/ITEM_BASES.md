# DECISION (Diogo, 2026-10-07): the hero's main attribute (STR/DEX/INT) decides which item set he can use. For now there are ONLY 3 rare sets (STR = Bulwark/armour, DEX = Fury/evasion, INT = Mercy/energy shield; slots: helmet, body, gloves, boots, weapon, + jewelry). Unique/legendary items with special abilities and HYBRID attributes come LATER. The hybrid icons already approved (chainmail tabard STR/INT, crowned helm STR/INT, brown boots STR/DEX, hybrid gloves) are parked in `approved/items/` for those future uniques.
Set mapping used by the art: STR set = plate body, steel helm, silver gauntlet, steel boots, axe/sword/mace; DEX set = leather jerkin, hood, green gloves, green boots, bow/dagger; INT set = robe, winged circlet, blue gloves, blue boots, wand/staff.

# Item bases (pixel-art versions of popular Path of Exile 1 RARE bases - no uniques)

Attribute -> defence type: **STR = Armour (red)**, **DEX = Evasion (green)**, **INT = Energy Shield (blue)**. Hybrids use two. Rarity (Common/Magic/Rare/Legendary) is shown by frame/border color + star count, not by redrawing the base.
Status: PROPOSAL, names/attributes are from memory of PoE1 and get verified against the PoE wiki before generation; the owner can veto any line.
Art budget: 4 icons per image (Jacquin). Order of generation = order below.

| Slot | STR (armour) | DEX (evasion) | INT (energy shield) | Hybrids |
|---|---|---|---|---|
| Body armour | Astral Plate, Glorious Plate | Assassin's Garb, Zodiac Leather | Vaal Regalia, Sacrificial Garb | Full Dragonscale (STR/DEX), Saintly Chainmail (STR/INT), Carnal Armour (DEX/INT) |
| Helmet | Eternal Burgonet | Hunter Hood / Deicide Mask | Hubris Circlet | Lion Pelt (STR/DEX), Praetor Crown (STR/INT) |
| Gloves | Titan Gauntlets | Gripped / Slink Gloves | Sorcerer Gloves | Spiked Gloves (STR/DEX), Fingerless Silk Gloves (DEX/INT) |
| Boots | Titan Greaves | Slink Boots | Sorcerer Boots | Two-Toned Boots (STR/DEX), Murder Boots (DEX/INT) |
| Shield / offhand | Colossal Tower Shield | Spiked Bundle / buckler | Titanium Spirit Shield | Elegant Round Shield (STR/INT) |
| Weapons | Vaal Axe (axe), Behemoth Mace (mace), Eternal Sword (sword) | Imperial Bow (bow), Jewelled Foil (sword), Imperial Claw (claw), Platinum Kris (dagger) | Opal Wand (wand), Eclipse Staff (staff), Imperial Skean (dagger), Rune/Ceremonial Sceptre | - |
| Jewelry | - | - | - | Opal Ring, Amethyst Ring (neutral), Onyx Amulet, Agate Amulet, Leather Belt, Heavy Belt, Stygian Vise |

Sheet plan (4 per image): body armour (STR 2 + DEX 2), (INT 2 + hybrids 2), (hybrid 1 + ...), helmets, gloves, boots, shields, weapons x3, jewelry x2 = about 14 sheets. Rarity frames/borders are one separate UI sheet.
Which hero uses which weapon type follows the hero list in `HEROES_QUESTIONNAIRE.md` (Copello/Chavoso bows or guns, Daniel/Donnie wands/staves, Jack/Rafinha maces/swords, etc.); decided at integration.
