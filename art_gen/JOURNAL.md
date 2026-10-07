# Diario do projeto (so o que importa)

## 2026-10-06 / 07
- Estilo definido e testado com o Jacquin: pixel art escura, contorno de 1 px, no maximo 24 cores. A limpeza por codigo (grade de pixels, cores, contorno) funciona.
- Flavio removido do jogo (Rubens e o curandeiro). Estudio de fotos pronto; 31 fotos do Big Head recebidas.
- Itens (24 icones gerados): **14 aprovados pelo Jacquin** (placa, manto, cota de malha, 2 elmos, 2 luvas, 3 botas, machado, espada, varinha, cajado rubi) -> `art_gen/approved/items/`. 10 faltam: couro escuro, capuz, diadema, luva de aco, luva roxa, bota verde, maca, adaga, arco, cajado azul (vao ser refeitos mais claros e grossos).
- Clorox (lata amarela, rotulo azul com "CLOROX", tampa-mandibula, lingua de lenco): quase aprovado (88); faltam retoques de codigo. Rolo de papel higienico: reprovado (80), vai ser refeito.
- Gerador gratis encontrado: Google AI Studio (mesmo tipo de modelo, centenas de imagens/dia gratis). Falta o Diogo entrar na conta Google no navegador do app para eu testar (FREE_GENERATORS.md).
- Trabalho automatico ligado: uma tarefa agendada me retoma a cada 20 min, o computador fica acordado, e a fila esta em WORK_QUEUE.md.
- Cota da use.ai: ~25 imagens por janela de 24 h; trial vai ate 12-13/10. Hoje ja usado ~65%.

## 2026-10-07
- Geradores comparados pelo Jacquin: use.ai ficou melhor (86 x 79), mas o Gemini gratis serve com ajuste de estilo. Plano: use.ai para personagens/itens ate o fim do trial; Gemini (gratis, ~100/dia) em paralelo para cenarios, cutscenes, interface e tudo depois do trial. A chave de API do Google nao gera imagem de graca (so o app).

## 2026-10-06 (noite)
- Geradas 3 folhas de itens (12 icones: couro, capuz, luva de aco, diadema, luva roxa, bota verde, maca, adaga, arco, cajado azul, anel, amuleto) em out/clean; enviadas ao Jacquin. Arco ficou escuro/fino (provavel refazer).
- Jacquin aprovou: adaga, anel de rubi, cajado safira, luva de aco (total 18 itens aprovados). Corrigir em codigo (ja no relatorio dele): couro/jerkin (cor marrom quente), capuz (detalhe dourado), amuleto (tirar 1 linha), maca (cabo mais grosso), bota (virar em par), arco (clarear). Refazer: diadema (vista frontal com pico), luva roxa (reta). Cota use.ai ~25% restante.

- Monstros dos cap. 2-4 gerados (6 criaturas, mesmo estilo). Jacquin: nenhum aprovado ainda; 3 se resolvem em codigo (anel permafrost, serra de fita, fatia de pizza) e 3 serao refeitos (anel congelado, lixa em anel, mini pizza queimada). +3 icones aprovados (couro, diadema, luva de prata): total 17 itens aprovados.

- Monstros refeitos no Gemini gratis depois do seu aviso (lixa nao parecia lixa, rolo com folha ilogica): agora o Jacquin so aprova se um estranho reconhecer o objeto e se cada parte fizer sentido fisico. Aprovados: rolo de papel, lixa (com o 120 no verso), pizza queimada, condom congelado, condom permafrost (com saquinho de aluminio), lixadeira de cinta. Faltam: Clorox (retoques), chefes, cap. 5, herois (dependem das fotos).

- 8 monstros novos ja estao DENTRO DO JOGO (caps. 1 a 4: rolo de papel, Clorox, condom congelado e permafrost, lixa, lixadeira, pizza queimada, fatia de pizza). Testado: carrega sem erros, aparece na batalha. Chefes Big Head e cap. 5 ainda com arte antiga.

- Lucao definido (voce): pescador tank, vara de pesca; ultimate 'Pescaria Gigante' (pesca um peixe, gira como piao e bate nos monstros) ja funciona no jogo (testada) e esta traduzida.

## Cenarios definidos por voce (2026-10-07)
- Cap. 1: banheiro (continua). Cap. 2: rua, com um carro atras; as camisinhas vem grudadas no vidro e (no futuro, com animacao) o carro chega, para, elas se soltam do vidro e caem no campo de batalha. Cap. 3 (lixa): oficina com torno/CNC. Cap. 4 (pizza): dentro do carro. Cap. 5 (dildos): como se fosse a tela de um PC olhando pra frente: parte da mesa com o teclado e a cadeira ao fundo, sem pessoas. Casa (tela inicial) e tela de titulo: eu invento.

- Cap. 5 (monstros-dildo): referencia = as criacoes do Diogo com o kit Clone-A-Willy mostradas aos amigos (silicone cor de pele, brilhante). Vai ser versao cartoon, engracada, sem nada explicito, no mesmo estilo dos outros monstros.

- Referencias recebidas: Jack (prints do Instagram) e Daniel (prints do Instagram, com a calopsita real). Daniel agora e 'Invocador Necromante' (vai usar manto de necromante/feiticeiro) e sua ultimate mostra a calopsita saindo do ombro, voando por cima da cabeca, atacando e voltando (ja funciona no jogo, testado). Faltam fotos de 10 herois.

- Referencias recebidas: Ze Vitor (print do Instagram; roupa de fanfarra azul/verde, tambor). No jogo: ataque basico = joga baquetas (ranged), ultimate toca o tambor, notas musicais voam pra cima e o time ganha +35% ataque, +25% velocidade e +15 mana por 10s (testado). Faltam fotos de 9 herois.

- Referencias recebidas: Donnie (3 prints; so ele foi separado, as outras pessoas dos prints ficaram de fora). Tema: xama ocultista (quimbanda), preto e roxo, mago a distancia, caveira de boi. No jogo: ultimate abre um pentagrama vermelho num circulo embaixo de cada inimigo (testado). Faltam fotos de 8 herois.

- Referencias recebidas: Chavoso (3 prints). Deadeye do PoE, flechas no ataque basico (agora voam ate o alvo). Ultimate nova 'Tiro Tornado': tornado de flechas acerta todo inimigo 2x e ele ganha +30% de velocidade por 8s (testado). Corrigido: dano de flecha/baqueta agora nao depende de animacao (nao trava se a aba ficar em segundo plano). Faltam fotos de 7 herois.

- Referencias recebidas: Rafinha (foto recente do perfil + fotos antigas). Baixinho, barba preta cheia, veias verdes discretas. Ultimate 'Modo Orc': bebe lata de MONSTER (lata desenhada com o logo e o nome) e vira orc estilo WoW (por enquanto verde por filtro; sprite do orc entra quando eu desenhar: o jogo ja troca sozinho para rafinha_orc). Ataque basico do orc = soco pesado com onda de choque (testado). Faltam fotos de 6 herois: Lucao, Copello, Malaguti, Glem, Samuel, Rubens.

## 2026-10-07 manha
- PROBLEMA ENCONTRADO: depois do ultimo commit (23:42) nada novo foi feito durante a noite. A tarefa automatica ficou TRAVADA desde as 21:33 esperando uma permissao do navegador que ninguem aprovou, e uma execucao travada impede as proximas. Corrigido: sessao travada encerrada e tarefa reiniciada; falta voce aprovar as permissoes dela uma vez (veja a barra lateral).

- 07/10 manha: monstros do cap. 5 gerados no Gemini (silicone cor de pele e versao deluxe verde-azulada), cartoon sem nada explicito; aguardando Jacquin. Tarefa agendada agora so faz codigo (sem navegador, para nao travar); esta sessao ganhou um lembrete a cada 20 min para continuar a arte.

- Torre definida por voce: a Julia corrompida vira vilã e chefe da Torre (nos pontos de parada, aparencia muda); a Torre abre quando o tutorial dela terminar (quase tudo liberado). Plano mestre em FEATURES_ROADMAP.md.

- Historia (LORE.md): premissa sua + capitulos, cutscenes e epilogo da Torre escritos por mim; lacunas marcadas com [?] para voce revisar.

- 2026-10-07: Instalei protecao global (~/.claude): hook que avisa em 200k/350k/600k tokens para fazer handoff, skills handoff + session-health, regras anti-invencao no CLAUDE.md. LORE.md atualizado: tudo acontece dentro da cabeca do Diogo; cada capitulo = uma memoria. Jacquin HEROES_BATCH1: Jack aprovado; Daniel e Ze corrigir (cor); Donnie, Chavoso, Rafinha regenerar.

- 2026-10-07: Jack e Daniel (aprovados pelo Jacquin) ja estao no jogo com a arte nova; Donnie/Chavoso/Rafinha refeitos e em julgamento (rodada 2); cenario do cap. 5 (dentro do monitor) gerado; cinco cenarios novos ligados no jogo. HANDOFF.md atualizado (historico antigo preservado embaixo).

- 2026-10-07: Ze Vitor aprovado. Donnie, Chavoso e Rafinha refeitos/retocados e ja no jogo como PROVISORIOS (Jacquin deu 87-90, falta retoque fino). Avatares novos dos 6 herois. Novo js/net.js: amigos/guilda funcionam offline com bots de treino (troca por servidor real depois). Rafinha agora baixinho de verdade.

- 2026-10-07: Chefe Big Head gerado nos 5 estagios a partir das suas fotos (azul calmo; cachecol gelado; cabeca rachada + avental laranja; cranio aberto com cerebro; final musculoso com cerebro gigante e capa roxa): conjunto muito consistente, em julgamento do Jacquin. Monstros do cap. 5: o normal (rosa) aprovado apos limpeza de pixels; o elite (verde) refeito e em julgamento. Teste cego: leu como brinquedo/condom (a piada do capitulo).

- 2026-10-07: Monstros do cap. 5 (normal rosa + elite verde com faixa dourada e olhos laranja) prontos e NO JOGO; testado sem erros. Falta: Jacquin no chefe Big Head (5 estagios) e depois exportar. Cap. 5 ainda se chama 'The Basement' no jogo (o lore diz que e o PC): renomear quando o Diogo quiser.

- 2026-10-07: Jacquin reprovou o 1o conjunto do Big Head (cabeca ja enorme no cap.1, sem iris, abas do cranio viravam chifres). Refiz os 5 estagios com a cabeca crescendo de verdade (45% > 55% > 63% > 68%+cerebro > maior de todas + cerebro gigante), iris nos olhos, brinco, cranio quebrado em forma de coroa. Teste cego: cerebro lido com 65-80%. Em novo julgamento (verdicts/BOSS_BIGHEAD_2.md).
