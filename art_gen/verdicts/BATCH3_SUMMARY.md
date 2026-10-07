# Jacquin - Batch 3 summary (Clorox 2, toilet paper 4, item sheets 1, body 2)

## Verdict blocks

```
JACQUIN VERDICT: REJECTED (FIXABLE_IN_CODE)
Asset: ch1 Clorox label_0 (idle) + label_1 (attack)   Type: monster   Attempt: 2
Scores: pixel 90 | silhouette 90 | color 88 | anatomy 88 | design 90 | symmetry 86 | ready 84 | brief 88 | likeness N/A => overall 88
What works: reads as the approved Clorox at once: yellow canister, tilted jaw lid with teeth, wipe tongue, code-stamped CLOROX is clean and legible; burning wipe is a strong separable accent; idle is nearly shippable.
Defects: 1. attack lid still has the round knob on top (not in the concept). 2. orphan dark speck left of the attack lid (still a stray component). 3. label is an edge-to-edge slate-blue band, paler than the concept's saturated blue plate; 4. idle tongue arches thin up and right, concept has it thick and hanging over the front. 5. frame sizes differ, idle lid clipped on the left.
Fix: delete knob (repaint lid), delete components < 12 px except the flame, re-saturate the label blue (+chroma) and narrow it to the plate shape, thicken idle tongue by copying the attack tongue, align by can base.
```
```
JACQUIN VERDICT: REJECTED (FIXABLE_IN_CODE, then REGENERATE if still weak)
Asset: ch1 toilet paper roll (ch1_monsters_3_1)   Type: monster   Attempt: 4 (ESCALATE next time)
Scores: pixel 86 | silhouette 84 | color 84 | anatomy 78 | design 80 | symmetry 80 | ready 66 | brief 80 | likeness N/A => overall 80
Defects: 1. magenta pockets between both arms and torso are STILL visible as hot-pink blocks on the panel (the new key did not catch them). 2. still no cardboard core or paper-wrap bands: reads as a grey pillar. 3. legs thin, feet small.
Fix: key every pixel near #FF00FF anywhere in the cell, refill gaps with outline colour; paint brown core ring + 2 cream wrap bands by code; reserve palette slots. If it still reads as a pillar, change approach (ESCALATE): build the roll from the old placeholder's three cues (white paper, wrap lines, dangling sheet) and add only the new face and fists.
```

## Item sheets

SHEET body (attempt 2): REJECTED overall because of leather. Set score 88.
- 0 plate APPROVE (torso only now, clean blue-grey with gold star).
- 1 leather REJECT: still a near-black blob, only belt shows; code lift insufficient. REGENERATE with the prompt delta below.
- 2 robe APPROVE (best: violet and gold, clear silhouette).
- 3 chainmail/tabard APPROVE (white and gold tabard; checker gone).

SHEET helmets (1): REJECTED as a sheet, 2 of 4 pass. Score 86. Outline halo is fuzzy on all.
- 0 steel great helm APPROVE.
- 1 hood REJECT: murky olive, face hole an undefined dark smudge. Code: lift value and cut a clean 3-tone face hole; else regenerate lighter.
- 2 winged circlet REJECT: wings and band are 1 px thin, reads as a tiara at 32 px. Regenerate: "thick 3 px band, large chunky wings".
- 3 crowned helm with white plume APPROVE.

SHEET gloves (1): REJECTED as a sheet, 2 of 4 pass. Score 85.
- 0 dark steel gauntlet REJECT: low value, finger separations lost. Code: lift dark ramp +0.12 L.
- 1 green leather glove APPROVE.
- 2 blue glove with gold cuff APPROVE.
- 3 purple glove with white cuff REJECT: fingers near panel value and blurred. Regenerate "mid-violet, lighter than the panel".

SHEET boots (1): REJECTED as a sheet, 3 of 4 pass. Score 87.
- 0 steel greaves pair APPROVE.
- 1 green boots REJECT: dark green on dark panel, shaft merges; code lift +0.10 L.
- 2 brown fur-top boots APPROVE.
- 3 blue gold-trim shoes APPROVE.

SHEET melee (1): REJECTED as a sheet, 2 of 4 pass. Score 86.
- 0 axe APPROVE.
- 1 spiked mace REJECT: dark purple, thin handle, spiked head blurs. Regenerate "3 px steel handle, light steel head".
- 2 sword APPROVE (clearest icon of the batch).
- 3 curved dagger REJECT: thin and dark. Regenerate "thick 4 px pale blade".

SHEET ranged/caster (1): REJECTED as a sheet, 2 of 4 pass. Score 85.
- 0 bow REJECT: thin dark purple, almost invisible. Regenerate "thick 3 px light-brown wood, gold tips, white string".
- 1 crystal wand APPROVE.
- 2 blue gem staff REJECT: 2 px dark shaft. Code: thicken shaft to 3 px and lift value.
- 3 ruby orb staff APPROVE.

## Table

| asset | file | APPROVED/REJECTED | fix |
|---|---|---|---|
| Clorox idle | ch1_clorox_label_0.png | REJECTED | thicken tongue, re-saturate label, align by base |
| Clorox attack | ch1_clorox_label_1.png | REJECTED | remove lid knob, delete orphan speck, align by base |
| Toilet roll | ch1_monsters_3_1.png | REJECTED | key magenta pockets anywhere, paint core and wrap bands, else escalate |
| Body plate | items_body_1_0_c40.png | APPROVED | none |
| Body leather | items_body_1_1_c40.png | REJECTED | regenerate (lighter, see prompt delta) |
| Body robe | items_body_1_2_c40.png | APPROVED | none |
| Body chainmail | items_body_1_3_c40.png | APPROVED | none |
| Helm steel | items_helm_1_0_c40.png | APPROVED | none |
| Helm hood | items_helm_1_1_c40.png | REJECTED | lift value, clean face hole |
| Helm circlet | items_helm_1_2_c40.png | REJECTED | regenerate thicker |
| Helm crowned | items_helm_1_3_c40.png | APPROVED | none |
| Gloves steel | items_gloves_1_0_c40.png | REJECTED | lift dark ramp +0.12 L |
| Gloves green | items_gloves_1_1_c40.png | APPROVED | none |
| Gloves blue | items_gloves_1_2_c40.png | APPROVED | none |
| Gloves purple | items_gloves_1_3_c40.png | REJECTED | regenerate lighter fingers |
| Boots steel | items_boots_1_0_c40.png | APPROVED | none |
| Boots green | items_boots_1_1_c40.png | REJECTED | lift +0.10 L |
| Boots brown | items_boots_1_2_c40.png | APPROVED | none |
| Boots blue | items_boots_1_3_c40.png | APPROVED | none |
| Axe | items_weapons_str_1_0_c40.png | APPROVED | none |
| Mace | items_weapons_str_1_1_c40.png | REJECTED | regenerate thick handle, light head |
| Sword | items_weapons_str_1_2_c40.png | APPROVED | none |
| Dagger | items_weapons_str_1_3_c40.png | REJECTED | regenerate thick pale blade |
| Bow | items_weapons_rng_1_0_c40.png | REJECTED | regenerate thick light wood |
| Wand | items_weapons_rng_1_1_c40.png | APPROVED | none |
| Staff blue | items_weapons_rng_1_2_c40.png | REJECTED | thicken shaft 3 px, lift value |
| Staff ruby | items_weapons_rng_1_3_c40.png | APPROVED | none |

## Anchors (ANCHOR_icons)
items_body_1_2_c40.png (robe), items_body_1_3_c40.png (tabard), items_helm_1_3_c40.png, items_weapons_str_1_2_c40.png (sword), items_gloves_1_2_c40.png, items_boots_1_2_c40.png, items_weapons_rng_1_3_c40.png.

## Single most valuable prompt change
Add to the icon variant: "Every material is mid-to-light value, never darker than 35% lightness; every thin part (shafts, strings, bands, wings) is at least 3 px thick; add a bright 1 px rim on the right and top-left edges so the object stays separate from a #1a1612 panel." Nearly every reject is dark or thin.
