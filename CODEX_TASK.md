# TAREFA PARA O CODEX — LUCRATTIVA PREMIUM

## 1. Missão

Atue como lead designer UI/UX, desenvolvedor front-end sênior e engenheiro de CRO/SEO. Use a implementação contida neste repositório para criar uma versão refinada, de alto desempenho e pronta para homologação do site da **LuCrattiva Contabilidade**, empresa de Nova Mutum, MT. **Não comece do zero sem justificar**: o protótipo já tem identidade editorial, 10 rotas comerciais/institucionais, CTAs, configuração de equipe e consentimento.

O site deve competir visualmente com propostas criadas no Claude Design. Entrega que queremos: estética premium e sóbria, mas principalmente páginas que gerem conversas B2B qualificadas via WhatsApp.

## 2. Público-alvo

- Agronegócio: produtores/empresas da cadeia, sujeitos à confirmação de escopo e serviços.
- Indústria: empresários e responsáveis por gestão industrial.
- Serviços: donos, gestores e administradores de prestadores de serviços.
- Transportes: gestores e operadores de transporte/logística.
- Clientes que querem mudar de contador e precisam entender o processo.

Não atribua à LuCrattiva serviços técnicos especializados não confirmados. Descrever benefícios comerciais sem fazer promessa fiscal ou de economia tributária.

## 3. Conceito visual e tom

**Direção:** institucional contemporâneo, sofisticado, elegante, editorial; nada de template contábil genérico, excesso de ícones ou gradientes chamativos.

**Paleta base** (pode ajustar respeitando identidade):
- Verde floresta `#082C22`
- Verde escuro `#041E17`
- Verde médio `#16513C`
- Verde claro/oliva `#67856A`
- Dourado fosco `#C9AB74`
- Creme/off-white `#F7F6F0`

**Referência de composição:** hero amplo, imagem/cena agro digna, serif elegante para manchetes, sans legível para texto, bastante respiro, cards setoriais com fotos ou arte licenciada, retratos dos sócios e equipe, CTA destacado. Animações discretas somente quando melhorarem experiência. Preferir imagens próprias autorizadas ou imagens com licenças verificadas; imagens SVG atuais são ilustrativas. Não apresentar arte ilustrada como fotografia real.

**Tom textual:** empresarial, claro, seguro, acolhedor e conciso; focar decisão, organização, proximidade e confiança. Não exagerar em promessas; evitar clichês vazios.

## 4. Estrutura e conteúdo obrigatórios

| Página | Intenção | Conversão primária |
|---|---|---|
| `/` | Posicionamento e escolha do segmento | WhatsApp geral/segmentado |
| `/agronegocio/` | Oferta e contexto do agro | WhatsApp com assunto pré-definido “agronegócio” |
| `/industria/` | Oferta para indústria | WhatsApp contextual |
| `/servicos/` | Oferta para prestadores de serviços | WhatsApp contextual |
| `/transportes/` | Oferta para logística/transporte | WhatsApp contextual |
| `/trocar-de-contador/` | Reduzir atrito da migração | WhatsApp “troca de contador” |
| `/sobre/` | História e pilares aprovados | Conhecer equipe / atendimento |
| `/equipe/` | Pessoas reais: sócios e colaboradores | WhatsApp |
| `/contato/` | Contatos e formulário | WhatsApp |
| `/privacidade/` | Explicar dados/cookies e direitos | Gerenciar consentimento |

**Homepage:** cabeçalho premium, hero com CTA forte, quatro áreas, diferenciais verificáveis, apresentação de sócios/equipe (foto, nome, cargo, mini bio se fornecidos), “como funciona”, formulário curtíssimo, FAQ e rodapé completo.

**Páginas setoriais:** manchete específica, desafios e exemplos de rotina sem afirmar serviços não validados, 1 CTA acima da dobra, explicação objetiva, seção de perguntas pertinentes, mais CTA final. Cada URL precisa de título/descrição próprios e intenção comercial clara.

## 5. Equipe editável (prioridade alta)

O protótipo usa `window.LUCRATTIVA.team` em `assets/js/config.js` e cartões `data-team-index` na home e na página Equipe. Melhorar se necessário para que **adicionar/editar/remover profissionais exija alterar apenas os dados de uma configuração**, e não manualmente duplicar HTML.

Cada integrante deve aceitar: `name`, `role`, `photo`, `alt`, `bio` (opcional), `socials` (opcional). Fotos reais em `assets/images/equipe/`, preferir WebP/AVIF otimizados, proporção 4:5. Até que dados reais sejam entregues, exibir blocos “Foto a inserir” sem inventar nomes ou usar fotos de pessoas fictícias com aparência de integrantes reais.

## 6. Funil de conversão e WhatsApp

**Objetivo:** anúncio/pesquisa → página específica → prova de confiança → clique contextual de WhatsApp → conversa com humano. Não criar chatbot desnecessário nesta etapa.

Requisitos:
- Link `https://wa.me/NUMERO?text=...`, número e texto configuráveis, sem hardcode disperso.
- Mensagem adequada para cada setor e para troca de contador, em PT-BR, incluindo origem “site”.
- CTA principal no hero, CTAs ao longo do conteúdo, CTA no rodapé e WhatsApp flutuante discreto.
- Formulário leve de pré-atendimento: nome, segmento e necessidade opcional. **Não afirmar que é lead salvo**, pois esta versão apenas compõe mensagem no WhatsApp. A pessoa deve concluir o envio no aplicativo.
- Pré-selecionar segmento ao entrar via landing page de setor; permitir alteração.
- Em caso de problema ao abrir WhatsApp, apresentar URL copiável e mensagem em texto, sem perda das respostas.
- Planejar atribuição por canal/página para futura integração com CRM (UTM source, medium, campaign), sem recolher dados além do necessário.

## 7. Analytics / remarketing com privacidade

- Preparar eventos explícitos de **intenção** (`whatsapp_click`, `whatsapp_form_intent`, `sector_cta_click`) incluindo `segment`, `page_path`, `cta_position`. Jamais contar como “contrato”/“cliente adquirido”.
- Prever integração futura com GTM, GA4 e Meta Pixel, **desativada por padrão**. Não publicar IDs inventados.
- Consentimento separado para estatísticas e publicidade. Nenhuma tag opcional deve carregar antes de escolha adequada; consentimento revogável a qualquer momento. Se implementar Google Consent Mode v2, revisar sequência de inicialização/default/update e a compatibilidade das tags.
- Texto/política de privacidade são rascunhos a serem aprovados pelo controlador de dados; evitar alegar conformidade plena apenas por exibir banner.
- Remarketing depende de políticas, configuração de anúncios, público elegível, base legal e volume; não prometer públicos nem lookalikes automaticamente.

## 8. Requisitos de qualidade

### Acessibilidade / UX
- Mobile 360, 390, 430, 768; desktop 1280, 1440, 1920; sem scroll horizontal indesejado.
- Menu responsivo navegável por teclado e toque; fechar com Escape, ao clicar fora e após navegação se adequado.
- Focus visível; `alt` adequado; hierarquia de headings; contraste aceitável (WCAG AA para texto); redução de movimento.
- Formulário com labels, mensagens de erro úteis e sem perda de dados.
- Evitar modal de cookie invasivo em mobile; botões claros para aceitar, rejeitar ou configurar.

### Engenharia / SEO
- Preservar URLs amigáveis e arquivos estáticos para deploy **Vercel** sem npm.
- CSS/JS modular, mínimo possível; links internos válidos, assets locais preferidos.
- Title/description/canonical por página; Open Graph; sitemap.xml; robots.txt; schema `AccountingService` ou `LocalBusiness` **apenas com dados aprovados**; incluir `noindex` na preview se apropriado.
- Não duplicar H1. Imagens com width/height quando fizer sentido para evitar layout shift; lazy-loading fora da dobra.
- Revisar páginas antigas para possíveis redirects 301, sem inventar destinos.

## 9. Ordem de implementação

**Fase A — auditoria**: ver arquivos atuais, rodar `python scripts/test_static.py`, relatar 5 principais problemas de UX, conversão, performance e privacidade.

**Fase B — design**: melhorar home + seção Equipe sem quebrar componentes existentes; entregar prints desktop e mobile. Obter aprovação do visual antes de refazer as demais páginas.

**Fase C — conversão**: refinar WhatsApp, pré-seleção, mensagens, CTA e formulário; planejar UTMs e documentação de eventos.

**Fase D — SEO / tracking**: estruturar SEO técnico e tags futuras sem ativar publicidade antes de consentimento e validação.

**Fase E — validação**: rodar testes, links, scripts, acessibilidade manual, confirmar status de todas as páginas. Publicação é separada e necessita autorização.

## 10. Critérios de aceite

- [ ] Home sofisticada e responsiva, quatro segmentos visíveis com diferenciação clara.
- [ ] Navegação para 10 rotas validada; nenhum 404 em assets internos.
- [ ] WhatsApp contextual em cada uma das quatro landings + página de troca.
- [ ] Sócios/colaboradores editáveis por configuração, com orientação de imagens.
- [ ] Sem alegações técnicas, dados legais, fotos ou depoimentos inventados.
- [ ] Botões e formulário funcionam com e sem cookies opcionais.
- [ ] Consentimento e revogação não disparam scripts opcionais indevidamente.
- [ ] Teste em browser real em mobile e desktop; screenshots e eventuais problemas documentados.
- [ ] `python scripts/test_static.py`, `node --check` e `node scripts/test_interactions.js` passam.
- [ ] README atualizado com instruções de alteração da equipe, rodar local e deploy Vercel.
- [ ] Dados pendentes listados: logo oficial, número comercial, e-mail, responsáveis/CRC, área técnica dos serviços, fotos/equipe, política de dados e domínio.

## 11. Instrução de execução ao Codex

> Leia AGENTS.md e CODEX_TASK.md. Inspecione a implementação existente e rode os testes disponíveis. Aprimore o site mantendo o conceito editorial verde/dourado e as páginas existentes. Comece pela homepage, navegação responsiva, equipe editável e conversão WhatsApp. Faça commits pequenos, documente mudanças, tire screenshots em 1440px e 390px quando o navegador estiver disponível, e não publique em produção sem autorização. Relate o que foi implementado, testes efetivamente executados e pendências de aprovação.
