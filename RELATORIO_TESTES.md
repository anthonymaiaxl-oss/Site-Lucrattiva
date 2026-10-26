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

## Atualização: aba Depoimentos

A atualização inclui `/depoimentos/`, entrada no menu e no rodapé de todas as páginas e uma seção na home. A lista de relatos permanece vazia até receber textos e identificações reais autorizados. Não foram criados depoimentos ou avaliações fictícias.

Validação da atualização: **591 verificações estáticas**, **29 verificações de interação existentes** e **296 verificações no Chromium** passaram. O navegador observou **956 respostas locais**, sem falhas de assets ou erros JavaScript. As **22 auditorias automatizadas das 11 rotas em desktop/mobile** não apontaram violações nas regras WCAG selecionadas; os limites e resultados inconclusivos de contraste continuam registrados no JSON.

As verificações novas usam apenas dados sintéticos em contextos de teste isolados: descartam relatos sem aprovação, nome ou texto válidos; exibem somente três na home e todos na página completa; preservam o conteúdo como texto sem permitir injeção de HTML; verificam atribuição opcional, layout com relatos preenchidos em dez larguras e o estado vazio honesto. Esses dados não fazem parte da configuração publicada.

Evidências desta atualização: `/workspace/artifacts/lucrattiva-depoimentos/browser-results.json`, `/workspace/artifacts/depoimentos-desktop.png`, `/workspace/artifacts/depoimentos-mobile.png` e `/workspace/artifacts/depoimentos-home-desktop.png`.

### Acesso direto pela página principal

O menu e o rodapé agora levam à seção `/#depoimentos`, e a home mostra todos os relatos aprovados. A URL dedicada foi preservada para links existentes. Na verificação deste ajuste, 588 checagens estáticas passaram. Foram executados seis cenários reais de navegação (home, indústria e página dedicada, em desktop de 1440 px e celular de 390 px), confirmando destino na home, seção acessível, ausência de overflow e fechamento do menu móvel. O teste de navegador existente foi atualizado para refletir a navegação pela âncora.

### Faixa de setores ampliada

A faixa abaixo do hero passou de 95 para 138 px de altura mínima no desktop e os nomes de 13 para 19 px. Tablet e celular receberam tamanhos proporcionais. A faixa foi validada em dez larguras de 360 a 1920 px, sem overflow na página ou nos links individuais. Capturas em `/workspace/artifacts/faixa-setores-maior-1440.png` e `/workspace/artifacts/faixa-setores-maior-390.png`.

## Exemplos fictícios e revisão de legibilidade

A pedido explícito do usuário, foram acrescentados três depoimentos fictícios para testar o visual. Eles usam uma lista separada dos relatos reais, exibem um aviso geral e o rótulo “Depoimento de teste · fictício” em cada cartão. As identificações dizem “Cliente de exemplo” e “Empresa fictícia”. Não há fotografias, notas ou estrelas inventadas. Os exemplos desaparecem automaticamente quando existe algum relato real aprovado; também podem ser desativados em `showTestimonialExamples`.

A leitura foi revista em todas as páginas, preservando as famílias verificadas no navegador: Manrope nos textos e Cormorant nos títulos. Parágrafos principais usam 16–17 px, controles e apoio usam 14–16 px, notas e legendas usam 12–13 px. A assinatura tipográfica do logotipo continua menor e foi ampliada em relação à versão inicial. O menu passa ao modo expansível em telas intermediárias para acomodar a escala maior sem reduzir os textos.

Passaram 601 verificações estáticas, 29 verificações de interação existentes e 304 verificações no Chromium, com 1031 respostas locais observadas sem falhas. Após o ajuste final dos pequenos rótulos, a revisão complementar validou **132 combinações de rota/largura**, além de **22 auditorias axe**, sem overflow ou violações automáticas nas regras selecionadas. Os limites das verificações de acessibilidade e os inconclusivos permanecem registrados.

Os testes agora verificam aviso e rótulo em cada exemplo, a separação de relatos aprovados e fictícios, a desativação dos exemplos, a preservação de dados como texto e a ausência de tags opcionais indevidas. O relatório final de escala está em `/workspace/artifacts/lucrattiva-legibilidade/final-readability.json`; o relatório funcional está em `browser-results.json` no mesmo diretório.

Capturas finais: `home-desktop-atualizada.png`, `home-mobile-atualizada.png`, `depoimentos-desktop-atualizados.png` e `depoimentos-mobile-atualizados.png`, em `/workspace/artifacts/lucrattiva-legibilidade/`.

## Revisão institucional local — 26/10/2026

- 618 verificações estáticas aprovadas, 12 arquivos HTML e sintaxe JavaScript válida.
- 29 verificações de interação sem dependências aprovadas.
- 304 verificações em Chromium aprovadas, com 1.104 respostas locais verificadas e nenhum erro JavaScript ou asset com falha.
- 22 auditorias axe-core nas páginas e configurações cobertas pela suíte, sem violações automáticas WCAG A/AA.
- 19 verificações adicionais das mudanças: destaque agro íntegro em 13 larguras (360 a 1920 px), duas auditorias axe da home final, assuntos de serviço sem perda de resposta e operação por teclado.
- A inspeção visual identificou e corrigiu a ausência de `display:block` no destaque agro em celular; as verificações adicionais confirmam que seu conteúdo permanece dentro do cartão e não se sobrepõe aos outros blocos.
- Depoimentos de teste continuam identificados como fictícios. A grade de retratos da home fica oculta enquanto não há fotos locais configuradas; edição central da equipe e página própria permanecem funcionais.
- Sem mensagens reais enviadas ou tags de analytics reais; somente simulações isoladas nos testes.
- Evidências: `/workspace/artifacts/lucrattiva-atualizacao-outubro/`. A publicação na Vercel não faz parte desta atualização. Auditorias automáticas não são certificação completa de acessibilidade.

### Apresentação exclusiva das duas sócias

A pedido do usuário, a seção e a página institucional passaram a apresentar somente duas sócias, com espaços explícitos de nome e foto a inserir. Foram removidos os três perfis de departamentos/funcionários da configuração. O acesso público agora é “Sócias” / “As sócias”; a URL `/equipe/` permanece por compatibilidade.

Validação final: 630 verificações estáticas, 29 de interação e 304 em Chromium aprovadas. As 22 auditorias automatizadas da suíte seguem sem violações. Verificação adicional confirma os dois cartões visíveis na home, sem perfis de funcionários. Capturas em `/workspace/artifacts/lucrattiva-atualizacao-outubro/socias/`.
