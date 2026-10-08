# HANDOFF - Wipe Wars (escrito 2026-10-07, para o proximo Claude)

> PAUSA (2026-10-07, ordem do Diogo): a politica de 'nunca parar de trabalhar' esta PAUSADA. Tarefa agendada wipewars-keep-working DESATIVADA e cron da sessao apagado. Nao procurar trabalho sozinho nem agendar nada; so fazer o que o Diogo pedir. Teto diario acordado: 10% do limite semanal por dia (base de 07/10 = 31%, teto do dia 41%); checar get_usage no inicio e no fim de cada lote; handoff automatico via tarefa agendada de uso unico (ver skill handoff).

## Projeto e ordens permanentes do Diogo
- Idle auto-battler HTML (arquivo unico gerado por `python build.py test.html`), amigos reais como herois, publicado no GitHub Pages (repo publico rossidiogo/wipewars). Diogo nao programa: linguagem simples, chat curto, tudo registrado em `art_gen/JOURNAL.md`.
- (PAUSADO) Antes: trabalhar sem parar enquanto o PC estiver ligado. Agora: so fazer o que for pedido; chat curto. Avisar so quando os 12 herois estiverem prontos (faltam fotos de 6: Lucao, Copello, Malaguti, Glem, Samuel, Rubens).
- Todo asset de arte passa pelo Jacquin (agente critico, `.claude/agents/jacquin.md`) antes de entrar no jogo. Features aprovadas por ele: ver `FEATURES_ROADMAP.md`. Historia: `LORE.md` (tudo acontece DENTRO da cabeca do Diogo; cada capitulo = uma memoria).
- Privacidade: repo PUBLICO. Nunca commitar `art_gen/refs/`, `.env`, `art_gen/out/`, fotos pessoais, chaves.

## Estado (VERIFICADO em 07/10/2026, fim da sessao longa)
- Cenarios NO JOGO: 5 de capitulo (assets/bg_ch.json) + casa/titulo novo (assets/bg2.json 'tall', approved/bg/home_livingroom.png). Cap.5 retocado (verdicts/bg_ch5_1.md) e casa retocada (verdicts/bg_home_1.md; nota 85 ANTES do retoque, sem novo julgamento).
- Herois NO JOGO com arte nova (ids: tank=Jack, dps=Daniel, ze, donnie, chavoso, rafinha): Jack, Daniel, Ze APROVADOS. Donnie, Chavoso, Rafinha PROVISORIOS (Jacquin 87-90; ver verdicts/HEROES_BATCH3.md). Rafinha baixinho (sc:1) e orc `rafinha_orc` NO JOGO (retocado; Jacquin 91; teste cego 92%; ver verdicts/rafinha_orc_1.md e BOSS_BIGHEAD_3.md).
- Monstros NO JOGO: caps 1-4 (8) + cap.5 normal (aprovado) e elite (retocado com faixa dourada/olhos laranja; sem novo julgamento).
- Big Head bh1..bh5 NO JOGO (approved/bosses/), com retoques do Jacquin (~86-91, verdicts/BOSS_BIGHEAD_2.md e _3.md). Multiplicador de tamanho por capitulo m=[.9,1.0,1.1,1.2,1.35] (js/battle.js). Teste cego: cerebro lido 85-92%; o anel branco do cranio le como faixa/coroa (opcional refazer como casca de ovo quebrada); bh1-3 faltam acento de cor/blind-ID.
- js/net.js: camada online plugavel com banco local de mentira (bots de treino); Acct.mock=true sem claude.ai; amigos testados (pedido->bot aceita). Guilda NAO testada na tela. Troca por servidor real: Net.setBackend(...) quando o Diogo criar projeto gratis.
- Presentes: limite diario salvo em localStorage.

## AUTORIZACAO PERMANENTE (Diogo, 07/10): ele autoriza TUDO que for necessario no projeto (Gemini no navegador embutido, subir as fotos de art_gen/refs/, baixar imagens, editar, commitar). NAO pedir OK por passo. Limites fixos: sem senhas/dados financeiros, sem apagar dados de vez, nada de fotos/chaves no git (repo publico), respeitar teto diario de uso.

## REGRA (Diogo, 07/10): em TODA sessao nova (inclusive handoff automatico) ligar a conexao remota (set_remote_control) para ele usar o celular.

## Elenco (Diogo, 07/10): Flavio NAO faz mais parte do roster. Faltam 5 herois com arte nova (Lucao, Copello, Malaguti, Glem, Rubens; Samuel ja entrou como provisorio); Diogo manda foto + descricao de um em um. Rubens: fotos recebidas (ficha refs/rubens/FEATURES.md), arte ainda NAO feita.

## Feito em 07/10 (commitado: 20b6a3e e 5392671; SEM push, o jogo online nao mudou)
- Donnie espelhado (agora olha para a direita, como os outros) em assets/sprites2.json; ult Hex of Ruin = UM pentagrama grande sob todos os monstros (battle.js ULTFX.donnie). Testado na tela.
- ARMAS FIXAS: armas deixaram de ser item. Cada heroi tem 1 arma fixa (WEAPONS em core.js, arte = emoji PROVISORIO, falta arte real + Jacquin) que sobe de nivel 1-12 com Chaos (wepCost, wepStat, save.wlv; painel 'Weapon' na tela Herois, ui.js). Saves antigos: itens arma viram Chaos (dropOldWeapons). Itens agora so helm/armor/gloves/boots. Testado: migracao, upgrade, sem erro no console. NAO testado: baú/loja gerando itens novos, nem balance (stats = o que 2 armas do melhor set davam).
- SAMUEL (design do Diogo, 07/10): Assassino Sintetico estilo androides de Alien (pele palida, jaqueta tatica preta, sangue branco, um olho com circuito atras dos oculos escuros; cabelo preto degrade, bigode fino + cavanhaque, argola com cruz na orelha). Arma: Synth Wristblade (lamina + console de pulso, golpes = linhas de codigo verde/branco). Ult Root Access JA NO CODIGO e testada: glitch-teleporta atras do inimigo de maior atk da fileira de tras, backstab 5.5x + stun 2s; passiva +30% dano em alvo atordoado/fileira de tras. Arte feita (ver item 3 abaixo); fotos em art_gen/refs/samuel/ (036fb7c1 e de OUTRA pessoa, ignorar).
- Opcional: arma aparecer na mao do sprite/animacao de ataque.

## LABORATORIO (feito 07/10, js/lab.js, testado: galeria 34 cartas + luta de teste sem erro)
- Configuracoes > Laboratorio > Abrir (ou URL com ?lab). Aba 'Laboratorio de luta': escolhe ate 6 herois (qualquer um) e ate 6 inimigos (qualquer monstro/chefe), cenario (cap 1-5), herois nao morrem, inimigos imortais, ults sempre prontas, respawn automatico, velocidade 1/0.5/0.25/2. Aba 'Galeria': sprite, arma, ult e status (aprovado/provisorio/placeholder) de cada heroi, monstros/chefes e cenarios.
- Rubens deve usar a camisa havaiana especifica (ver art_gen/refs/rubens/FEATURES.md). Porta 8799 = art_gen/tools/receive.py (receptor local; so e necessario se achar um jeito de contornar o CSP do Gemini).

## PEDIDOS DO DIOGO AINDA ABERTOS (07/10, anotados para nao perder)
1. BOSS FINAL (Big Head bh5, e talvez bh1-4): o 'double biceps' que ele pediu era do CEREBRO, NAO do corpo. O personagem/corpo deve parecer um VESSEL usado, que nao aguenta mais ser hospedeiro de tanto poder: flacido, murcho, 'just hanging there'; toda a vida/forca esta no cerebro (cerebro gigante e musculoso/vivo, corpo pendurado). Refazer a arte do boss assim (passar pelo Jacquin).
2. RUBENS (heroi de apoio/curandeiro): 'maconheiro da paz', olhos vermelhos, paz e amor e erva, camisa havaiana, oculos retangulares pretos, cabelo castanho com mechas grisalhas, bigode+barba, argola, tatuagem de anime no antebraco (ficha: art_gen/refs/rubens/FEATURES.md; as 2 fotos NAO foram salvas em disco). ULT Smoke Session: poe o cigarro na boca, puxa e solta fumaca em volta de TODO o time curando todos (hoje o codigo cura todos com nuvem; trocar visual/animacao para essa descricao). Arma atual no codigo: Cloud Vaporizer (trocar para joint/cigarro de erva se quiser).
3. SAMUEL: NO JOGO como PROVISORIO (Jacquin 86.3 na 4a tentativa; verdicts/HEROES_SAMUEL_1..3.md; art_gen/tools/patch_samuel.py gera a versao final a partir de out/clean/hero_samuel_gem3_1.png; approved/heroes/samuel.png; avatar assets/ava_samuel.png). Testado em batalha (Lab) sem erro. Falta so uma re-checagem rapida do Jacquin (ele espera 88+). Residual: cabeca ~46% da altura (aceitavel); a pose/lamina pode melhorar numa regeneracao futura.
4. POPUP DO DOWNLOAD - RESOLVIDO (07/10): usar o CHROME REAL (ferramentas mcp__claude-in-chrome__*), nao o navegador embutido do app: abrir o chat do Gemini la (mesma conta), achar 'Download full size image', clicar; cai em Downloads como .tmp sem popup; depois rodar art_gen/tools/gemget.ps1 -Name <nome> -Expect 1 -Colors 24. Gerar SEMPRE com fundo MAGENTA #FF00FF (cinza nao e removido pelo clean.py). receive.py/porta 8799 nao e mais necessario.

## Proximos passos (Diogo pediu em 07/10: continuar com RUBENS, depois chefe final; nada rodando agora, nenhum agente vivo)
0. RUBENS agora: gerar sprite no Gemini (Chrome real, fundo magenta, fichas em refs/rubens/FEATURES.md, camisa havaiana obrigatoria), limpar com gemget.ps1 (-Expect 1), patch se preciso, Jacquin (aceitar >=86 como provisorio), export_sprite.py rubens ... --target-h 102 --steps hero --shw 30 --face r e export_avatar.py rubens; trocar visual da ult Smoke Session (joint na boca, puxa, fumaca em volta do TIME todo curando) em js/battle.js ULTFX.rubens; arma -> joint (WEAPONS.rubens em core.js + lang.js). Depois: chefe final (pedido 1 acima).
1. Mais baratos por token: codigo (cutscenes a partir de LORE.md, Torre/Julia corrompida, pvp.js com Net.ghosts(), colecao, pets, pesca, eventos, itens STR/DEX/INT; testar tela de Guilda).
2. Arte (mais caro): 6 herois restantes quando houver fotos (Lucao, Copello, Malaguti, Glem, Samuel, Rubens; refs em art_gen/refs/<nome>/); opcionais: anel do cranio do Big Head, acentos bh1-3, Jacquin na casa e no elite cap.5.
3. (FEITO 07/10) Cap.5 renomeado para 'The PC' / 'O PC' (core.js, lang.js; build ok, nao testado na tela). Diogo pediu em 07/10 para fazer TODOS os proximos passos; fotos dos 6 herois chegam depois.

## Como trabalhar (orcamento de uso: Pro, limite semanal)
- Teto 10%/dia do semanal; ler get_usage no inicio e fim de cada lote e dizer o numero. Base de 07/10 = 31%.
- Conversas curtas; nada de cadeias de esperas de 10s (Start-Sleep e bloqueado: usar run_in_background ou Monitor); uma revisao do Jacquin por lote, aceitar >=88; lotes de varias pecas.

## Armadilhas conhecidas
- Python real: `C:\Users\diogo\AppData\Local\Programs\Python\Python313\python.exe` (o `python` do PATH e atalho da Store e NAO funciona).
- Gemini (aba do navegador embutido, `https://gemini.google.com/app`): clicar na caixa, digitar o prompt + Return; a tela so atualiza depois de um screenshot/scroll (nao clicar no botao enviar, ele vira "parar"); se o screenshot der timeout, usar tabs_select e navegar de novo; baixar com o botao "Download full size image" (find) e rodar `art_gen/tools/gemget.ps1 -Name <nome> -Expect 1 -Colors 24 [-Floor N]`. Cenarios: `tools/scene.py IN.jpg OUT.png --colors 48 --aspect 320:293 --top 0`.
- Servidor de teste: `python -m http.server 8734` escondido na pasta do projeto; matar depois. `startStage(n)` respeita progresso do save (setar save.cleared=49 para testar caps altos); `castUlt(unit)` dispara ultimate.
- Animacoes de dano nao podem depender de WAAPI onfinish (usar setTimeout).
- Scripts de retoque do Jacquin: art_gen/tools/patch_*.py. Exportadores: tools/export_sprite.py, export_avatar.py.
- Tarefa agendada `wipewars-keep-working` DESATIVADA (nao reativar sem o Diogo).

## Protecao global (~/.claude): hook de saude da conversa (200k/350k/600k), skills `handoff` (inclui HANDOFF AUTOMATICO via tarefa agendada de uso unico) e `session-health`, regras no CLAUDE.md.
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
