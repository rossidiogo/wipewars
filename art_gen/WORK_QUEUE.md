# Fila de trabalho (sempre trabalhando - leia isto primeiro em toda retomada)

Regra do Diogo: SEMPRE trabalhar enquanto o computador estiver ligado e houver algo util a fazer (nao so o que ele pediu: tudo que ajude os projetos dele). Se acabar a cota de uso (use.ai ou Claude), esperar e RETOMAR sozinho quando voltar. Nao parar para perguntar. Falar pouco no chat; registrar no `art_gen/JOURNAL.md` (so o que importa, em portugues simples).
Trava: `art_gen/.lock` (timestamp). Se o arquivo tem menos de 15 min, outra sessao esta trabalhando: nao dispute o navegador, faca so tarefas de codigo/documento.

## A. Arte (usa cota da use.ai: ver `fetch('/v1/limits')`; ~4% por imagem; usar a janela inteira antes de resetar)
Prioridade: 1) Clorox + rolo de papel (cap.1) aprovados pelo Jacquin  2) itens (bases PoE): corpo OK, elmos OK, luvas OK, botas OK -> faltam escudos, armas (STR/DEX/INT), joias, 3) icones de moeda/chave/bau/navegacao  4) monstros cap.2-4 (+cap.5 dildos)  5) herois (fotos em `art_gen/refs/<id>/`; so Big Head recebido) 6) cenarios 7) UI kit 8) cutscenes 9) futuro.
Status: ver JOURNAL. Pendente itens: ver ultimas linhas do JOURNAL (fixes de codigo + diadema + luva roxa).

### Decisao do Jacquin sobre geradores (2026-10-07, `verdicts/generator_comparison.md`)
- use.ai (trial) = padrao para PERSONAGENS, MONSTROS e ITENS ate acabar o trial (12-13/10): congelar ancoras e herois nesse estilo.
- App Gemini (gratis, ~100/dia) roda em PARALELO para: cenarios, cutscenes, UI, arte do futuro, e para TUDO depois do trial, sempre com o ajuste de estilo do arquivo de comparacao (saturacao ~55%, sujeira, sombras violeta, contorno fino violeta-preto, presas grandes etc.). Rodar o harmonizador de paleta/saturacao ao limpar imagens do Gemini.
- Usar a cota inteira das duas fontes todo dia (use.ai: /v1/limits; Gemini: contar imagens, parar no aviso de limite).

## B. Sem cota (fazer quando a cota acabar)
1. (FEITO e testado no jogo) `tools/export_sprite.py KEY idle.png [--atk atk.png] --target-h N --steps hero|tank|tp|boss --shw N`.
2. `tools/export_icons.py`: coloca icones aprovados em `icons2.json` (canvas 40, chaves item_<slot>_<base>).
3. Sistema de atributos STR/DEX/INT no jogo (core.js): atributo principal por heroi (tabela em STYLE_BIBLE), bases de itens por atributo, requisitos, UI, traducao PT.
4. Recriar testes (Playwright: monkey/play/multi) e rodar; reescrever `sim.py`/`sim2.py` para times de 4 + gacha + estrelas; passada de balanceamento (meta: cap.1 ~2h, jogo todo 3-4 semanas).
5. Auditar traducao PT (tela calendario) e novos textos.
6. Gerador local de imagens (RTX 3060 Ti): avaliar/instalar ComfyUI + modelo (ver `art_gen/FREE_GENERATORS.md`).
7. Efeitos (fx) em CSS/JS: lenco em chamas, fumaca, etc. a partir dos `_fxN.png`.
8. Publicar no GitHub (push) a cada lote aprovado; o site atualiza sozinho.
