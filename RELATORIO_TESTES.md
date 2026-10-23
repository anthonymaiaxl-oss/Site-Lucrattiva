# Validação — LuCrattiva refinada

Executada em 23/10/2026 no ambiente de desenvolvimento. Versão estática para homologação; nenhum deploy realizado.

## Resultados executados

| Verificação | Resultado |
| --- | --- |
| `python3 scripts/test_static.py` | 516 verificações, 11 HTMLs (10 rotas + 404), zero falhas |
| `node --check assets/js/config.js` | Passou |
| `node --check assets/js/site.js` | Passou |
| `node scripts/test_interactions.js` | 29 verificações passaram |
| `python3 scripts/test_browser.py --axe /workspace/artifacts/lucrattiva/axe.min.js` | 242 verificações passaram no Chromium real |
| Requisições locais observadas no teste de navegador | 802 respostas; nenhuma com status de falha |
| Erros JavaScript observados | Zero |
| axe-core 4.14.0: tags WCAG 2 A/AA e 2.1 AA | 20 execuções: 10 rotas × desktop/mobile; zero violações automáticas |

A validação estática cobre links e assets locais referenciados pelo HTML/CSS, sintaxe JavaScript, idioma, H1 único, IDs duplicados, presença de formulário/CTA, SVG/XML, sitemap e configuração Vercel. Os testes originais foram mantidos e ampliados; não foram substituídos por verificações vazias.

## Navegador

Chromium em modo headless, instalado em `/usr/bin/chromium`, controlado por Python Playwright. Larguras 360, 390, 430, 768, 1280, 1440 e 1920 px verificadas nas dez rotas, sem overflow horizontal. Capturas de comparação em 1440 e 390 px.

Comportamentos verificados: menu por toque e teclado, Escape, clique externo e retorno de foco; navegação entre setores; número centralizado nos CTAs; contexto de cada landing; pré-seleção editável; nome composto somente por espaços rejeitado; mensagem recuperável e respostas preservadas com abertura bloqueada; equipe gerada somente por dados com bio e links opcionais; filtro de URL insegura; rejeição e separação de estatísticas/publicidade; restauração de preferências; revogação; integração desativada por padrão; redução de movimento.

WhatsApp foi simulado durante os testes: nenhuma mensagem foi enviada. GTM foi substituído por um stub em contextos isolados; nenhuma tag de publicidade real foi ativada. O ID de teste existe somente nos testes. O código de produção continua com ID vazio e `trackingReviewed: false`.

## Acessibilidade e inspeção visual

Os contrastes insuficientes encontrados nas primeiras execuções foram corrigidos. As 20 auditorias finais não detectaram violações nas regras selecionadas. O axe conserva resultados inconclusivos de contraste, sobretudo em elementos sobre imagens/gradientes. Foram inspecionados visualmente hero, cards, equipe, contato e uso em celular/desktop. Os inconclusivos permanecem no JSON de evidência; não são contabilizados como aprovações automáticas.

Esta execução não certifica conformidade integral WCAG nem substitui teste com leitores de tela, usuários, Safari/iOS ou Android físico.

## Evidências

Capturas e relatório detalhado em `/workspace/artifacts/lucrattiva/`:

- `home-desktop.png`, `home-mobile.png`: homepage completa, capturas reais.
- `home-desktop-dobra.png`, `mobile-dobra.png`: primeira tela.
- `desktop-areas.png`, `mobile-areas.png`: setores.
- `<rota>-desktop.png`, `<rota>-mobile.png`: páginas internas completas.
- `formulario-recuperacao.png`: formulário com recuperação da mensagem simulada.
- `browser-results.json`: contagem, descrições dos testes e resultados axe, incluindo inconclusivos.
- `antes-desktop.png`, `antes-mobile.png`: base original executada antes do refinamento.

As imagens originais em `references/CONCEITO_*` são conceitos do ZIP, não capturas da implementação.

## Limites e pendências

Não foram executados deploy, entrega real de WhatsApp, homologação de container GTM/GA4/Meta, integração CRM, verificação de DNS, redirecionamentos de legado ou Lighthouse em hospedagem pública. Desempenho em servidor local não representa métricas de usuários reais.

A página HBB indicada como referência recebeu 403 no CONNECT do proxy e não foi analisada visualmente. Os domínios foram adicionados ao rascunho da política de rede; a alteração salva não libera automaticamente o runtime.

Precisam ser aprovados: logo oficial, contatos comerciais, responsáveis/CRC, endereço, domínio, escopo técnico, nomes/cargos/fotos e política de privacidade. A preview conserva `noindex` em HTML e no header Vercel. Publicar o ambiente de desenvolvimento e publicar o site são operações distintas.
