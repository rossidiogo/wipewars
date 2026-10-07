# Geradores de imagem gratuitos (sem assinatura) - pesquisa de 2026-10-07

Objetivo: continuar gerando arte com qualidade parecida com o Nano Banana depois que o trial da use.ai acabar (12-13/10).

1. **Google AI Studio (aistudio.google.com) - melhor opcao.** Mesma familia de modelo (Nano Banana = Gemini Flash Image). Plano gratuito sem cartao: segundo fontes de 2026, 500 a 1000 imagens por dia na interface web e cerca de 500 por dia pela API, independente do app Gemini. Precisa so de uma conta Google. Com uma chave de API gratuita eu chamo o modelo direto por codigo (sem clicar em nada), muito mais rapido e barato em tokens.
2. **App Gemini (gemini.google.com):** cerca de 100 imagens/dia gratis (Nano Banana). Backup.
3. **Local no PC (ComfyUI + SDXL com LoRA de pixel art):** gratis e ilimitado; PC tem RTX 3060 Ti (8 GB), 16 GB RAM, 22 GB de disco livre. FLUX completo nao cabe bem em 8 GB; SDXL cabe. Qualidade e obediencia ao pedido menores que o Nano Banana (folhas de 4 itens saem piores). Plano C.
4. Outros (Bing Image Creator, Leonardo, Ideogram): limites diarios pequenos e login; so como reserva.

## Resultado dos testes (2026-10-07)
- **API do Google (chave gratis):** a chave funciona e enxerga Nano Banana 2 Lite / 2 / Pro, MAS o plano gratis da API tem limite ZERO para imagens (erro 429). Só funciona com cobranca ativada. Nao usar. (A chave esta em `.env`; `tools/gen.py` esta pronto caso um dia haja credito.)
- **App Gemini (gemini.google.com) logado na conta do Diogo: FUNCIONA de graca** (limite diario ~100 imagens segundo fontes; medir). Procedimento no navegador do app:
  1. Abrir https://gemini.google.com/app (nova conversa), clicar na caixa "Enter a prompt for Gemini", digitar `Create an image (1:1 square). ` + prompt, Enter.
  2. Esperar ~25-40 s; achar o botao `Download full size image` (aria-label) e clicar por JS; o arquivo cai em `%USERPROFILE%\Downloads\Gemini_Generated_Image_*.jpg` (1024x1024).
  3. Mover para `art_gen/out/<nome>.jpg` e rodar `tools/fetch.ps1 -Name <nome> ...`.
  O navegador do app nao deixa a pagina falar com o PC (bloqueio), por isso o download pelo botao.
- Comparacao de qualidade com a use.ai: ver `verdicts/generator_comparison.md`.

Avisos: os numeros vem de blogs e podem estar desatualizados; confirmar no primeiro uso. Para testar o AI Studio o Diogo precisa entrar na conta Google no navegador do app (eu nunca digito senha). Teste de qualidade: gerar o mesmo pedido (Clorox) e o Jacquin comparar com o resultado da use.ai.
