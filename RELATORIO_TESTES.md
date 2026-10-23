# Relatório de testes — LuCrattiva

Data: 23/10/2026.

## Executados

- `python scripts/test_static.py` — **443 verificações, 0 falhas** nas 11 páginas HTML (inclui 404), links/arquivos locais, assets SVG, sitemap, JSON Vercel, JavaScript sintaticamente válido, presença de H1/descrição e estrutura comercial.
- `node scripts/test_interactions.js` — **10 asserções passaram**: links WhatsApp distintos por segmento, tracking bloqueado antes do consentimento, carregamento GTM somente após aceite, evento após aceite, revogação com recarga. O GTM é um ID de teste apenas nesse script, não no site real.
- `node --check assets/js/site.js` e `node --check assets/js/config.js` — sintaxe válida.
- Parser CSS tinycss2: **217 regras, 0 erros de análise**.
- Servidor local `python -m http.server`: **HTTP 200** para as 10 rotas do site, CSS, JS, SVG principal, sitemap e robots.txt.
- ZIP testado para integridade (sem erros).

## Limitações

O navegador automatizado deste ambiente bloqueou o carregamento de URLs locais com `ERR_BLOCKED_BY_ADMINISTRATOR`. **Não foi possível validar renderização nem cliques reais no navegador nesta sessão.** As imagens incluídas em `references/` são conceitos visuais, não screenshots do site aberto.

## Pendências para homologação

1. Teste visual real em Chrome/Edge: 360, 390, 768, 1440px; navegação e acessibilidade de teclado.
2. Teste manual de formulário → WhatsApp e comportamento dos pop-ups no navegador.
3. Aprovar dados reais, logo, fotos, serviços, número comercial, e-mail e política de privacidade.
4. Instalar GTM/GA4/Meta apenas após configuração e revisão de consentimento.
5. Testar preview na Vercel; produção somente após aprovação.
