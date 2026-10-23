# AGENTS.md — Instruções para o Codex no projeto LuCrattiva

## Objetivo
Desenvolver e aprimorar **o site institucional comercial da LuCrattiva Contabilidade** usando o projeto existente como base. Trabalhar com a estética premium verde-escuro + dourado fosco + off-white, com foco em pessoas reais, confiança, clareza, acessibilidade e conversão para o WhatsApp.

## Leia primeiro
1. `CODEX_TASK.md` (briefing e critérios de aceite)
2. `README.md` (como rodar e editar dados)
3. `assets/js/config.js` (contatos, GTM e equipe)
4. `assets/css/styles.css` e `index.html` (design existente)

## Regras invioláveis
- Não inventar depoimentos, resultados, nomes, credenciais, CRC, endereço, data de fundação ou alegações tributárias.
- Não alterar o telefone/e-mail ou publicar domínio sem confirmação da LuCrattiva.
- Não incluir Pixel Meta, tags publicitárias ou analytics antes de consentimento válido e configuração revisada.
- Não tratar um clique em WhatsApp como lead confirmado ou contrato fechado. Evento = intenção de contato.
- Não adicionar frameworks, bibliotecas pesadas, carrosséis e animações só por estética. Preserve carregamento rápido e responsividade.
- Quatro áreas principais: Agronegócio, Indústria, Serviços e Transportes; quinto caminho: Trocar de contador.
- Manter conteúdo em português brasileiro. Sem textos de preenchimento enganosos.
- Preservar rota e SEO das páginas atuais. Redirecionamentos do site legado só após inventário de URLs.
- Não executar deploy de produção sem aprovação explícita.

## Ambiente
Site estático com HTML + CSS + JavaScript. Sem build e sem npm.
- Servir: `python -m http.server 8080`
- Testes: `python scripts/test_static.py`
- JavaScript: `node --check assets/js/site.js && node --check assets/js/config.js && node scripts/test_interactions.js`
- Rotas: `/`, `/agronegocio/`, `/industria/`, `/servicos/`, `/transportes/`, `/sobre/`, `/equipe/`, `/trocar-de-contador/`, `/contato/`, `/privacidade/`.

## Fluxo de trabalho esperado
Inspecionar; listar problemas; trabalhar em passos pequenos; executar testes; apresentar evidências (antes/depois, prints desktop e mobile, issues remanescentes); não fingir execução de testes indisponíveis. Veja o `CODEX_TASK.md` para entregáveis.
