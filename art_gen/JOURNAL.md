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
