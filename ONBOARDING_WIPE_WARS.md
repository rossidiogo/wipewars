# Wipe Wars — Onboarding para o Claude Code (resumo completo da sessão)

## 0. Quem é o usuário e como trabalhar com ele
- Diogo. Mora em Lowell, MA (fuso America/New_York). **Zero experiência com programação/gamedev**; Claude escreve TODO o código e a arte placeholder. Estava no plano grátis do Claude, pretende assinar depois. Usa o celular.
- Fala português (BR) e inglês. Explique em linguagem simples, sem jargão; entregue algo pronto para usar, não relatos de esforço.
- Preferências observadas: quer ser perguntado pouco, quer que Claude decida e siga; quer ver o jogo funcionando a cada versão.
- Projeto: **Wipe Wars**, um idle auto-battler (RPG ocioso de batalha automática) feito como **um único arquivo HTML** (publicado como Artifact no claude.ai). Os heróis são amigos reais do Diogo (com permissão). Será só para amigos (não será vendido) — por isso o gacha não pode ser "miserável".
- TODA a arte atual é placeholder em pixel art feita por código (SVG -> pixelizada). Será refeita depois por artista/gerador de imagens real.
- Namorada do Diogo, **Julia**, é a personagem do tutorial.

## 1. Estado atual (última versão publicada: v34)
- Artifact ao vivo: https://claude.ai/artifact/D7CkDtTmGoLrpcKT5qe4is (v34 = gacha + troca de idioma PT/EN).
- Arquivos entregues: wipe-wars-v34.html (build), HANDOFF.md (notas técnicas até v34), GAME_BIBLE.md (design), _source20/ (cópia do código-fonte; sincronizada em v34).
- Código-fonte de trabalho: /mnt/user-data/working/src20 (cópia em /mnt/user-data/outputs/_source20). **No Claude Code, o fonte precisa ser levado junto** (baixar _source20 ou o zip enviado junto com este arquivo).
- Doc "Wipe Wars: Work Guide" (Claude Docs, id 927f8a2c-cefa-4f94-8d30-fc7b1360fa28): guia de tarefas + tabela do elenco de lançamento + notas.
- Testes passando em v34: monkey.py (699 cliques, 0 erros), play.py (jogo completo), multi.py (3 tamanhos de tela), migração de save antigo, fluxo do gacha, crawl do PT.

## 2. Arquitetura técnica
- Vanilla HTML/JS/CSS, tudo em um arquivo final. Build: `python3 build.py <saida.html>` junta os JS na ordem `['core','lang','art','battle','ui','recruit','cuts','account','guild','music','title']`, mais index.html e css/style.css, sprites (sprites2.json), avatares e ícones embutidos. **Sempre buildar para test.html primeiro e testar** (já houve test.html velho enganando).
- Save: localStorage chave `wipewars` (objeto `save`). Funciona com migração de saves antigos (ver core.js load).
- Pipeline de arte (art2/): SVG por código -> `pxlib.make(svgs,W,H)` (render crispEdges, encaixa em rampas do palette.py incluindo 'olive', pixelize.finish, pxclean) -> sprites2.json `SP[key]={w,h,ax,ay,top,s,idle[4],atk[4]}`. Avatares: assets/ava_*.png (chave = nome após `ava_`: tank, dps, sup, jul0-3, coffee0-2). Ícones: assets/icons2.json (inclui 'ticket'). Scripts: ph_sos.py/ph_chars.py/export_ph.py (10 heróis placeholder), julia_big.py+export_julia_big.py (Julia grande), flavio_sos.py+export_flavio*.py, export_coffee.py, export_ticket.py.
- Modelo de heróis (core.js): `HEROES[id]={n,role,sub,cls(tank|dps|sup),rng,heal,sc,nopool,hp,atk,iv}`, `ULT[id]={n,mana,d}`, HIDS, MAXTEAM=4, `isOwned(k)=save.own[k]||save.digas`; `save.team` (<=4), `save.form[id]`=slot 0-5 (slot<3 = fileira da frente, senão trás); `fixForm()` filtra por posse e atribui slots. `heroStats` multiplica por (1+0.1*estrelas).
- Batalha (battle.js): unidades vêm de save.team; sistema de status `u.fx=[{k:'atk'|'in'|'spd'|'stun'|'grow'|'tiger',m,t,tag}]` com addFx/fxm/A(u)/stunned/fxVis; tabela `ULTFX[id]`; castUlt chama ULTFX; heróis à distância (rng) atingem a fileira de trás; passiva do Zé (+8% ataque aliado); golpes do Donnie aplicam maldição; helpers hitFor/healAll/cloud. `fxVis` usa `u.el.querySelector('.msp,.spr')` (spriteArt troca classe spr->msp). Seletor de elenco (drawRoster/toggleTeam).
- UI (ui.js): HOMEH (posições na tela inicial, rebuildBgH mostra o time), abas de herói (4 colunas, bloqueados com estilo próprio), botão Subir estrela, equipBest só para o time, tutorial da Julia.
- Gacha (recruit.js): ver seção 4.
- Idioma (lang.js): ver seção 5.
- Outros: cuts.js (cutscenes), account.js, guild.js (totalPower usa save.team; guilda/amigos precisam da versão online com login claude.ai + acesso de Colaborador), music.js, title.js.
- Testes: monkey.py, play.py, multi.py (Playwright); sim.py/sim2.py (simuladores de balanceamento — **DESATUALIZADOS** para times de 4 e novo elenco); mockdb*.py (mock do DB). Scripts ad hoc em /tmp (ut.py ult por time, mg.py migração, gc.py gacha, crawl/pt.py crawler de strings) — recriar se necessário. Playwright: Chromium em /opt/pw-browsers (não rodar playwright install).

## 3. Elenco de lançamento (12 amigos + Flávio placeholder) — TODOS placeholders de arte/stats por enquanto
Descrições dadas pelo Diogo (tudo em português; o jogo terá PT e EN):
- **Tanques**: Rafinha (monstro; tanque baseado em vida; ultimate: bebe uma lata de Monster e fica maior/mais tanque/mais forte), Jack (cowboy), Lucão (habilidades A DEFINIR — o Diogo dará depois).
- **DPS à distância**: Copello (mangá; quebrou a perna escorregando numa manga -> atirador de elite com gesso, joga mangas), Daniel (calopsita; invocador), Chavoso (deadeye; o mais próximo possível do Deadeye de Path of Exile — arqueiro genérico com a cara dele).
- **DPS corpo a corpo**: Malaguti (porradeiro/lutador de jogo de luta; mantém camisa floral/bermuda/chinelo; meio-termo: dano alto, defesa média), Glem (tigrinho; druida cujo ultimate vira o tigre dos cassinos online — Diogo vai fornecer imagem-fonte; mais tanque/bruiser), Samuel (hacker/assassino; ultimate com tema de código; canhão de vidro).
- **Suporte**: Rubens (maconha; fumaça cura), Zé Vitor (fanfarra/tambor; buff no time), Donnie (xamã/tatuador, ocultismo; maldição/debuff nos inimigos).
- **Flávio** (id `sup`): primeiro suporte de cura, tema café (ultimate = faz café e cura o time com a bule). Ele pediu para sair do jogo -> **fica só como placeholder; precisa ser substituído antes de qualquer lançamento** (flag `nopool:1`: não aparece no gacha, escondido se não possuído).
- Time padrão do jogador novo: possui tank, dps, rubens; time [tank,dps,rubens]. Saves antigos migram para time [tank,dps,sup], own {tank,dps,sup,rubens}, 10 tickets.
- Modo Digas (config): trata tudo como possuído, libera fases/moedas/níveis (modo de teste).
- Heróis da v1: tank=Jack, dps=Daniel(?)/e demais conforme HEROES em core.js (conferir).
- Futuro: suportes de buff (Zé) e debuff (Donnie) já implementados como sabores; fonte do tigre do Glem e skills do Lucão pendentes.

## 4. Gacha "Recrutar" (decisão de design)
Escolhi com o Diogo: times de 4; pulls sempre dão algo; repetidos viram **fragmentos** que sobem **estrelas** (+10% de atributos por estrela). Sem dinheiro real.
- Tickets: começa com 10 (save.tix). ECON: firstClearTix 1 (primeira vitória em fase nova), bossFirstClearTix 3, chapterTix 5, ticketGems 60 (comprar 1 ticket com Divinos), metas diárias/calendário também dão.
- Pity: `pityNew` 10 -> amigo novo garantido em até 10 pulls (save.gp.n).
- Raridades: Comum 60% (+2 frag), Raro 28% (+6), Épico 10% (+15), Lendário 2% (+40). Favoritos (até 2, save.wish) têm peso 2x. Custo de estrelas [10,20,40,80,150] fragmentos; sobe estrela manualmente na tela do herói.
- Primeira cópia desbloqueia (save.own); duplicata/bônus dá fragmentos (save.shards).
- UI: tela Recrutar com banner da Julia, ×1/×10, comprar ticket, barra de pity, favoritos, coleção, tabela de odds; overlay de revelação (#pullfx) com portal, toque carta a carta, "Pular tudo" e grade de resumo.

## 5. Português/Inglês (lang.js)
- Tradução no nível do DOM: dicionário PT de strings exatas + regras RX (regex) + gramática de nomes de itens (TIERW/TYPEW/SETW) + MutationObserver traduzindo nós de texto e atributos; ORIGT (WeakMap) guarda o inglês original para voltar ao EN. `setLang(l)` salva `save.lang`, re-percorre o DOM e redesenha a tela. `comma()` usa locale pt-BR em PT. Config > Idioma alterna.
- Tutorial da Julia: os passos são traduzidos com `t()` antes do efeito de digitação (correção desta sessão).
- **Todo texto novo precisa de entrada PT em lang.js (PT/RX)**. O crawl PT cobriu: home, campanha, prep, heróis, mochila, loja, tarefas, correio, guilda/amigos, config, recrutar, pull, batalha, cutscene; tela calendar não foi coberta no crawl (erro de null no crawler — checar manualmente).

## 6. Julia (tutorial)
- Tutorial com a namorada Julia (baseado em selfie de espelho): redesenhada **grande, canto inferior direito, muito detalhada** (assets/ava_jul0-3, expressões/boca/piscar), balão `.jb`, sobreposição `#tip` em tela cheia, texto com efeito máquina de escrever; TIPS por tela: home, fight, heroes, recruit, bag; Config tem "Rever" tutorial. (Imagens da Julia são arte placeholder; refazer com arte real e com a permissão dela.)

## 7. Histórico de versões desta sessão
v30–v33: tutorial da Julia, Flávio/café, elenco completo placeholder (times de 4, ultimates por herói), roster picker, status effects. v34: gacha completo + PT/EN. (HANDOFF.md tem o detalhe técnico até v34.)

## 8. Erros já resolvidos (não repetir)
- STEPS[key] undefined em sprites novos -> toda chave nova precisa de STEPS/SHW em art.js.
- fxVis quebrava (.spr nulo) -> usar '.msp,.spr'; CSS `.unit.fx-* .msp`.
- equipBest espalhava itens por todos os 13 heróis -> agora só o time, respeitando itens equipados por outros.
- Testes: preencher nome 'Tester' antes de BEGIN; usar evaluate('startStage(n)'); `openScreen('id')` é a função de navegação; build sempre p/ test.html.
- Aviso do publish: página cita capability `db` sem declarar (guild/amigos); só importa se for usar online — decidir com o Diogo.

## 9. Pendências / próximos passos
1. **Balanceamento (o Diogo pediu que EU faça no fim)**: meta — nem meses, nem 1 dia. Proposta: capítulo 1 ≈ 2h; jogo todo ≈ 3–4 semanas jogando diariamente; catch-up para quem entra tarde. Precisa: reescrever sim.py/sim2.py para times de 4, tickets, fragmentos e estrelas; gravar o alvo de ritmo e os "botões" (dials) no guia + HANDOFF; playtest real com feedback dos amigos. Stats atuais dos placeholders não estão afinados.
2. Pedidos ao Diogo ainda abertos: **tema dos monstros do Capítulo 5**; **foto do rosto dele para o chefe "Big Head"**; **imagem-fonte do tigre de cassino do Glem**; **habilidades/tema do Lucão**.
3. Cenários faltando: oficina (cap. 3), carro (cap. 4), porão (cap. 5); cutscenes/animações e lore reais.
4. Substituir o Flávio antes de qualquer divulgação.
5. Refazer toda a arte com artista/gerador real; traduzir texto novo.
6. Se for usar guilda/amigos online: declarar capability `db` e abrir com acesso de Colaborador.

## 10. Como começar no Claude Code
1. Coloque o fonte (_source20) numa pasta e rode `python3 build.py test.html`; rode monkey.py/play.py/multi.py (Playwright) para confirmar o estado.
2. Leia HANDOFF.md e GAME_BIBLE.md.
3. Primeira tarefa sugerida: atualizar sim.py para o novo sistema e fazer a passada de balanceamento, ou receber as respostas das pendências do item 9.2.
