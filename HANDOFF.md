# HANDOFF - Wipe Wars (escrito 2026-10-07, para o proximo Claude)

## Projeto e ordens permanentes do Diogo
- Idle auto-battler HTML (arquivo unico gerado por `python build.py test.html`), amigos reais como herois, publicado no GitHub Pages (repo publico rossidiogo/wipewars). Diogo nao programa: linguagem simples, chat curto, tudo registrado em `art_gen/JOURNAL.md`.
- Trabalhar SEM PARAR enquanto o PC estiver ligado, nunca perguntar, nao encher o chat. Avisar so quando os 12 herois estiverem prontos (faltam fotos de 6: Lucao, Copello, Malaguti, Glem, Samuel, Rubens).
- Todo asset de arte passa pelo Jacquin (agente critico, `.claude/agents/jacquin.md`) antes de entrar no jogo. Features aprovadas por ele: ver `FEATURES_ROADMAP.md`. Historia: `LORE.md` (tudo acontece DENTRO da cabeca do Diogo; cada capitulo = uma memoria).
- Privacidade: repo PUBLICO. Nunca commitar `art_gen/refs/`, `.env`, `art_gen/out/`, fotos pessoais, chaves.

## Estado (VERIFICADO nesta sessao)
- 5 cenarios de capitulo aprovados e NO JOGO (assets/bg_ch.json; verificado no navegador). Filtro antigo do cap.2 removido em js/battle.js.
- 6 herois NO JOGO com arte nova (sprites2.json + avatares assets/ava_*.png, ids do jogo: tank=Jack, dps=Daniel, ze, donnie, chavoso, rafinha): Jack, Daniel, Ze aprovados pelo Jacquin. Donnie, Chavoso e Rafinha entraram PROVISORIOS (Jacquin rodada 3: notas 87-90 < 92, so retoques finos pendentes: ver art_gen/verdicts/HEROES_BATCH3.md). Rafinha agora e baixinho (sc:1 em core.js); orc ainda e filtro CSS (falta sprite `rafinha_orc`).
- js/net.js (NOVO): camada online plugavel com banco local de mentira (bots de treino). Sem o runtime do claude.ai, Acct usa Net (Acct.mock=true; nuvem de save desligada no mock). Testado: busca, pedido de amizade, bot aceita, lista de amigos. Guilda usa a mesma API (nao testada ainda na tela). Para ficar online de verdade: Net.setBackend({use:async nome=>...}) com a mesma API (Supabase/Firebase) quando o Diogo criar o projeto gratis.
- Presentes: limite diario agora salvo em localStorage (antes dava para fazer farm recarregando).
- 8 monstros dos caps 1-4 no jogo. Monstros do cap.5 gerados mas SEM veredito do Jacquin.

## Proximos passos (ordem)
1. EM ANDAMENTO: Big Head v2 (out/clean/boss_bh1_gem2_0, bh2_gem2_0, bh3_gem2_0, bh4_gem3_0, bh5_gem2_0) esta no Jacquin (verdicts/BOSS_BIGHEAD_2.md). Se aprovado/retocado: copiar para art_gen/approved/bosses/bh1..5.png, exportar com export_sprite.py chaves bh1..bh5 (--steps boss; ver KINDS/CHAPMON em js/battle.js, o multiplicador m dos chefes hoje diminui por capitulo (.9,.8,.72,.62,.6): como a cabeca ja cresce na arte, usar m parecido (~.8 todos) e testar). Monstros do cap.5 (normal+elite) JA no jogo. Cenario ch5_pc_monitor ainda sem veredito do Jacquin. Cap.5 se chama 'The Basement' no jogo (lore diz PC).
2. Sprite `rafinha_orc` (orc estilo WoW) via Gemini; chave rafinha_orc em sprites2.json (o jogo troca sozinho).
3. Big Head (chefe, 5 fases, 31 fotos em refs/bighead), cutscenes a partir de LORE.md, Julia corrompida (chefe da Torre).
4. Codigo em arquivos novos: tower.js, pvp.js (usa Net.ghosts()), colecao, pets, pesca, eventos, itens STR/DEX/INT. Testar tela de Guilda com o mock.
5. Herois restantes quando chegarem fotos: Lucao, Copello, Malaguti, Glem, Samuel, Rubens (refs em art_gen/refs/<nome>/).
## Armadilhas conhecidas
- Python real: `C:\Users\diogo\AppData\Local\Programs\Python\Python313\python.exe` (o `python` do PATH e atalho da Store e NAO funciona).
- Gemini (aba do navegador embutido, `https://gemini.google.com/app`): digitar o prompt + Return; a tela so atualiza depois de um screenshot/scroll (nao clicar no botao enviar, ele vira "parar"); baixar com o botao "Download full size image" (find) e rodar `art_gen/tools/gemget.ps1 -Name <nome> -Expect 1 -Colors 24 [-Floor N]`. Cenarios: `tools/scene.py IN.jpg OUT.png --colors 48 --aspect 320:293 --top 0`.
- Servidor de teste: `python -m http.server 8734` escondido na pasta do projeto; matar depois. `startStage(n)` respeita progresso do save; para ver outro cenario, setar `#fbg` background com `BGCH[i]`.
- Animacoes de dano nao podem depender de WAAPI onfinish (usar setTimeout).
- A tarefa agendada `wipewars-keep-working` e so de codigo (sem navegador). Nao reativar navegador nela.

## Protecao global instalada hoje (~/.claude): hook de saude da conversa (200k/350k/600k), skills `handoff` e `session-health`, regras no CLAUDE.md.
## Duvidas so do Diogo: fotos dos 6 herois restantes; lacunas [?] do LORE.md; aceitar cabeca ~2.3 corpos (em vez de 3) nos herois.

---
# HISTORICO (notas antigas v19-v34, preservadas; o estado atual esta acima)

# Wipe Wars - handoff (v19)

**Playable file:** `wipe-wars-v19.html` (single file, saves to the browser under key `wipewars`).
**Source (rebuildable):** `_source/` -> `python3 build.py` stitches `index.html + css/style.css + js/{core,art,battle,ui}.js + assets/*.json` into the HTML.

## What exists
- Home (idle fight scene, idle chest + claim, quick idle, level/XP, gold/gems/keys, side icons, bottom nav)
- Campaign: 5 chapters x 10 stages (boss on stage 10), formation screen, battle with ultimates, results screen
- Heroes (stats, level up, equipment grid, locked jewelry slots), Bag (filters, fuse, scrap), item tooltips
- Shop: Daily Deals (1 free + 5 rotating, refresh with gems), Chests (bronze/silver/gold, x1/x10, keys, pity), Gold bundles + quick idle, Gems (placeholder packs)
- Daily Tasks + activity chest, Achievements, 7-day Login calendar, Mail (welcome gift), Guild/Friends (coming soon), Settings (testing tools)
- Sound effects (synth), save migration from v18

## Where to change numbers
Everything economic is in `ECON` at the top of `js/core.js` (idle rate, hero level cost, chest odds/prices/pity, shop prices, task/calendar/achievement rewards, chapter names/colors, monster growth).
Heroes/ultimates: `HEROES`, `ULT` in core.js. Monsters: `KINDS` in battle.js.

## Balance notes (from a headless simulation)
- Without gear, a hero needs roughly level = stage number; gear is meant to close the gap (monsters grow 1.035x per stage on top of linear growth).
- Target F2P gem income is roughly 100/day (activity chest 70, calendar ~14, first clears). Silver chest = 100 gems.

## Ideas not built yet
Real art for jewelry slots, hero portraits/designs for friends, boss sprite, more monster types per chapter, hero skill/star upgrades, guild/friends, real sound files/music, tutorial.

---
## v20 (pixel-art overhaul) — source in `_source20/`
- Build: `python3 build.py <out.html>` (paths point at /mnt/user-data/working/src20; copy `_source20` there first). Inputs: index.html, css/style.css, js/{core,art,battle,ui}.js, assets/{sprites2,icons2,bg2,bg_ch}.json
- Art generators (Python, numpy/scipy/PIL) in `art/`: `px.py` engine (shaded, hue-shifted ramps, outlines), `heroes.py`, `monsters.py` (tp, old profile clorox), `clorox2.py` (CURRENT front-view clorox + boss), `export_sprites.py` (heroes/tp -> sprites2.json; clorox/boss were later overwritten by clorox2 snippet — re-run clorox2 export if regenerating), `icons2.py` (+ `orbs_ref.py`: Chaos/Divine orbs derived from user's reference PNGs in `ref/`), `props.py`/`props2.py` (room props), `bgpaint.py`/`rooms.py` (bathroom + 4 chapter rooms -> bg2.json / bg_ch.json)
- Currency rename: internal keys stay `gold`/`gems`; UI text says Chaos / Divine.
- Sprites are anchored at the feet (ax, ay); battle units are zero-size anchors positioned in % of a 320x293 field; pixel scale FS = fieldWidth/320.
- Combat juice (battle.js/CSS): sparks, shake, death poof, spawn-in, motes.
- Tests: monkey.py / play.py / multi.py (Playwright) all clean on v20.
- Known TODO: real hero designs from friends' photos, real chapter monsters, boss redesign, tongue of Clorox slightly stiff.

## v20 additions (title/UX pass)
- js/title.js: title screen, first-run name entry, Continue/New game; js/music.js: chiptune loop (Music.start/set, save.music); stage intro banner (battle.js stageBanner); first-time tips (ui.js TIPS/showTip, save.tut, replay in Settings). Tests: ?skiptitle bypasses title.
- v20b: js/account.js (Acct): claude.ai identity via db+user caps, cloud save at data/users/<id>/cloud, profiles/reqs/gifts collections, Friends screen (ui.js DRAW.friends). Real custom passwords not possible (shared db is not secret).
- Jack (tank hero, cowboy w/ whip): art/jack.py + art/export_jack.py (updates only 'tank' in sprites2.json; do NOT rerun export_sprites.py, it overwrites clorox/boss/tank).
- HD pipeline (art2/): jack_hd.py (SVG poses) -> hd_render.py (playwright) -> pixelize.py (box downsample, shared palette, outline, despeckle) -> export_jack_hd.py. Sprites have 's' scale (0.5 = 2x density). Plan: redo other heroes/monsters/bg in same pipeline.
- v20c: guild.js (guilds/gmembers collections), CHAPMON themed monsters (battle.js), AVA avatars (assets/ava_*.png), GAME_BIBLE.md

## v26 (overnight run) — live artifact = Version 22
- Heroes now: Jack (tank, cowboy), Daniel (ranged DPS summoner, cockatiel on shoulder, friend-based likeness), Sage (placeholder Mop Medic healer). ALL art is placeholder-quality and will be redone.
- Art code: art2/daniel_sos.py (SVG poses), art2/dan_view.py (crisp 112px render + palette snap + finish), art2/pxclean.py, art2/sage_sos.py. Daniel avatar: assets/ava_dps.png. Sprites are 112x112, ax36 ay108, s .85 in sprites2.json (keys dps, sup). 5 refinement passes were done on Daniel.
- Label-free monster sprites: `bottle` and `bossx` (clorox/boss with the CLOROX label painted out) are the bases for chapters 2-5 (battle.js CHAPMON line; STEPS/SHW entries in art.js).
- IMPORTANT: build the test page with `python3 build.py test.html` before running monkey/play/multi/shot; earlier sessions' tests used a stale test.html.
- Balance: replaying a cleared stage now gives 12% of its first-clear XP (ECON.replayXp) so player level (hero level cap) can't deadlock progress. Monster growth left at 1.035.
- Headless balance tools: sim.py (min uniform hero level per stage) and sim2.py (progression sim: auto-level, equip best, farm). Findings: with NO item leveling modeled, heroes stall at boss stages 30/40/50 (40 ~150 tries, 50 unwinnable), so those are gear-gated by design; the sim does not model item upgrades, so treat late-stage numbers as a lower bound on player power.
- Ideas next: real friend-based art (see PORTRAIT_PROMPT.md), unique chapter monsters, Sage/Jack avatar variants, tune bosses once real item-upgrade pacing is simulated.

## v27 — Chapter 2 monsters, boss, cutscene placeholders (live = Version 23)
- art2/condom_sos.py (normal/rare frozen condom), art2/bighead_sos.py (boss with head stage 0-4), art2/pxlib.py (generic crisp-render + palette snap + sheet helpers), art2/export_ch2.py writes sprites fcondom, pcondom, bh2 into sprites2.json.
- battle.js CHAPMON now supports per-chapter custom sprite keys (k) and scale (m); ch2 = fcondom/pcondom/bighead2. art.js has STEPS/SHW for new keys.
- js/cuts.js: SEEN_CH + playCut(chapter,done); startStage shows it once per chapter per session (set window.NOCUT=1 to bypass in sims/tests). "Next stage" now calls startStage so crossing a chapter triggers the cutscene.
- Chapter 2 renamed "The Deep Freeze" (background is still the laundry room, tinted).
- TODO: user's reference photo for the boss face; chapters 3-5 monsters and boss head stages 2-4; real cutscene animations/lore.

## v28 (live = Version 24)
- Ch3 = The Workshop: art2/sander_sos.py (belt, machine), sprites 'belt', 'machine'. Backdrop is still the tinted kitchen image (TODO: workshop background).
- Bosses: art2/bighead_sos.py CH[] table (per-chapter head scale, stage 0-4, outfit, viewBox/canvas); export via art2/export_ch3.py -> sprites bh1..bh5. KINDS.boss (ch1) uses key bh1; chapters 2-5 use k/m overrides in CHAPMON (null = keep base). Clorox wipes projectile now only for 'clorox' kind.
- Digas mode: ui.js digasOn/digasOff + Settings section; flags save.digas, dgInv, dgKill, dgMana (hooks in battle.js dealDamage/gainMana). Backs up real progress in save.digasBak.

## v29 (live = Version 25)
- Ch4 = The Car Ride: art2/pizza_sos.py + art2/export_ch4.py -> sprites pzburnt, pzmessy. Backdrop still the tinted garage image (TODO). Cutscene text updated.

## v30 — Julia tutorial
- art2/julia_sos.py + export_julia.py → assets/ava_julia0/1/2.png (idle, talk, blink). Placeholder bust art (girlfriend Julia: wavy dark hair, thick glasses, septum ring, necklace).
- ui.js: TIPS are now arrays of steps; Julia bubble with typewriter + talking frames, Next/Skip. Home intro (4 steps) on first run, per-screen tips for fight/heroes/bag. Settings "Tutorial with Julia → Replay" calls replayTutorial().

## v31 — Julia big
- art2/julia_big.py + export_julia_big.py → assets/ava_jul0..3 (160x208: idle, talk, blink, wave). Shown bottom-right ~56% width with bubble above (#tip CSS 'big Julia'). Placeholder art; old bust (julia_sos.py) unused.

## v32 — Flavio (first healer)
- Replaces Sage in 'sup' slot: art2/flavio_sos.py, export_flavio.py (sprite), export_flavio_ava.py (ava_sup), export_coffee.py (moka pot ult fx, ava_coffee0-2). Role Barista Medic. Ult 'Fresh Brew': pot pops on field, heals all allies (battle.js castUlt else-branch, .cpot CSS). Future: buff support, debuff support.

## v33 — 12-hero roster, teams of 4
- core.js: HEROES (13 incl. Flavio placeholder, ids: tank=Jack, dps=Daniel, sup=Flavio kept for save compat; new: rafinha, lucao, copello, chavoso, glem, malaguti, samuel, rubens, ze, donnie). Fields: cls(tank/dps/sup), sub, rng (ranged hits back row), heal, sc (scale). ULT table per hero. save.team (max 4, MAXTEAM), save.form[id]=slot. Old saves migrate to team [tank,dps,sup]. Default new-player team: Jack, Malaguti, Daniel, Rubens.
- battle.js: status effects u.fx [{k:atk|in|spd|stun|grow|tiger,m,t}] via addFx/fxm/A(); ULTFX table; Ze passive +8% atk, Donnie hits curse. Formation screen has a roster picker (toggleTeam). Equip best only touches team.
- art2/ph_sos.py, ph_chars.py, export_ph.py: placeholder sprites for the 10 new heroes (all OWNED for now; gacha not built; flip to owned-by-pull later).
- TODO: balance for 4-hero teams (sims not updated), Portuguese translation, gacha, real art, Lucao skills, chapter 5.

## v34
- Gacha "Recruit" (js/recruit.js): tickets, pity at 10, favorites, shards -> stars, pull reveal overlay.
- Portuguese/English switch (js/lang.js): DOM-level dictionary + regex translation, MutationObserver; Settings > Language. New text needs PT entries in lang.js PT/RX.
- Balance pass for 4-hero teams still TODO (sim.py/sim2.py outdated).
