# LuCrattiva Contabilidade

Site estático para homologação, refinado a partir do protótipo enviado. HTML, CSS e JavaScript, sem framework, npm, build ou dependências de produção. A direção visual da home foi aprovada na conversa antes do refinamento das páginas internas. Nenhum deploy foi realizado.

## Executar

Na raiz do repositório:

```sh
python3 -m http.server 8080
```

No Windows, `INICIAR_SITE_WINDOWS.bat`. O servidor é necessário para que os caminhos absolutos de assets funcionem; abrir o HTML diretamente pelo explorador de arquivos não é equivalente.

Rotas: `/`, `/agronegocio/`, `/industria/`, `/servicos/`, `/transportes/`, `/trocar-de-contador/`, `/sobre/`, `/equipe/`, `/contato/`, `/privacidade/`. A página `404.html` atende ao fallback da Vercel.

## Editar a equipe: somente dados

Adicione, remova ou reordene objetos em `team`, em `assets/js/config.js`. Home e Equipe se atualizam automaticamente; não duplique HTML. Campos aceitos:

```js
{
  name: 'Nome autorizado',
  role: 'Cargo aprovado',
  photo: '/assets/images/equipe/retrato.webp',
  alt: 'Retrato profissional de Nome autorizado',
  bio: 'Biografia curta aprovada.', // opcional
  socials: { LinkedIn: 'https://www.linkedin.com/in/perfil-autorizado/' } // opcional
}
```

Use fotografias próprias autorizadas em `assets/images/equipe/`, em WebP ou AVIF, proporção 4:5, idealmente 800 × 1000 px e arquivo otimizado. JPEG e PNG também são aceitos. URLs externas não são carregadas para fotografias de equipe. Uma imagem ausente ou inválida exibe “Foto a inserir”. Links de perfis exigem HTTPS. Os dados são inseridos como texto, sem interpretar HTML.

Os três cartões atuais são espaços de áreas, sem nomes ou fotografias fictícias. Confirme os profissionais reais antes de publicar. A grade se adapta inclusive quando não há integrantes configurados.

## Contatos e WhatsApp

Edite `whatsapp`, `phoneDisplay`, `email` e `whatsappMessages` em `assets/js/config.js`. Telefone e e-mail do arquivo original foram preservados e ainda precisam de confirmação comercial. Não há envio automatizado de mensagens.

Os CTAs usam o mesmo número e mensagens específicas. As landings preselecionam o segmento do formulário, que continua editável. O formulário usa nome, segmento e necessidade opcional para preparar uma mensagem no dispositivo. A pessoa conclui o envio no WhatsApp; não existe cadastro de leads, backend ou CRM nesta versão.

Após preparar a mensagem, ficam disponíveis o link, o texto e botões para copiá-los. Os campos permanecem preenchidos mesmo se a abertura do WhatsApp falhar. CTAs diretos oferecem também “WhatsApp não abriu?”.

## Visual e assets

- `assets/css/styles.css`: base herdada e componentes existentes.
- `assets/css/experience.css`: fontes locais, navegação, equipe, consentimento e recuperação de WhatsApp.
- `assets/css/home.css`: composição editorial da home.
- `assets/css/pages.css`: landings e páginas institucionais.
- `assets/js/site.js`: interações compartilhadas.
- `assets/ASSETS.md`: origem das imagens e licenças das fontes.

Paisagens e cenas setoriais são ilustrações geradas por IA, identificadas nas páginas; não são fotos de propriedades, instalações ou clientes da LuCrattiva. Logo provisória e fotos de equipe precisam de validação. As fontes Manrope e Cormorant Garamond são locais e têm licenças incluídas. Nenhuma fonte ou imagem depende de um CDN durante a visita.

A referência HBB indicada pelo usuário não pôde ser consultada: o proxy retornou HTTP 403 no túnel HTTPS. Os domínios necessários foram registrados no rascunho de rede; salvar esse rascunho não aplica a liberação ao ambiente atual. Não houve reprodução de conteúdo ou assets da HBB.

## Privacidade e eventos

Estatísticas e publicidade têm escolhas separadas, recusáveis e revogáveis pelo botão fixo ou pela página Privacidade. O consentimento fica no armazenamento local; se ele não estiver disponível, o site mantém a escolha somente durante a sessão. A política é uma minuta, sujeita à aprovação do controlador de dados.

A configuração entregue contém `gtMId: ''` e `trackingReviewed: false`. Nenhuma tag Google ou Meta é carregada. Preencher um ID sem habilitar a revisão também não ativa o container.

Uma futura ativação exige auditoria do container, finalidade e política aprovadas. O código prepara Consent Mode v2 com todas as categorias negadas antes de inicializar o container e atualiza cada categoria conforme a escolha. A revogação de qualquer categoria previamente concedida atualiza o consentimento e recarrega a página para remover código opcional já executado. Um container real deve respeitar as categorias também em suas próprias tags; sua homologação não foi realizada aqui.

Com consentimento de estatísticas, os eventos locais de intenção são:

| Evento | Disparo | Campos |
| --- | --- | --- |
| `whatsapp_click` | CTA de WhatsApp | `segment`, `page_path`, `cta_position` |
| `whatsapp_form_intent` | Preparação da mensagem pelo formulário | `segment`, `page_path`, `cta_position` |
| `sector_cta_click` | Card ou navegação entre setores | `segment`, `page_path`, `cta_position` |

Não são contratos, conversas concluídas ou clientes adquiridos. Nome e necessidade do formulário nunca entram nesses eventos. `utm_source`, `utm_medium` e `utm_campaign` da URL podem acompanhar eventos consentidos se forem identificadores curtos contendo somente letras ASCII, números, `_` e `-`. Não coloque dados pessoais em UTMs. Não há armazenamento de atribuição entre sessões, exportação ou integração com CRM. Isso exigirá especificação e revisão próprias.

## Verificar

```sh
python3 scripts/test_static.py
node --check assets/js/config.js
node --check assets/js/site.js
node scripts/test_interactions.js
```

A validação opcional de desenvolvimento usa Python Playwright e Chromium, com o servidor em execução:

```sh
python3 scripts/test_browser.py --artifacts /tmp/lucrattiva-validacao
```

O ambiente preparado já oferece Python Playwright e `/usr/bin/chromium`. Em outra máquina, instale o Playwright em um ambiente virtual de desenvolvimento e ajuste o caminho do navegador em `scripts/test_browser.py` se necessário. Esses pacotes não fazem parte do site ou do deploy.

Para incluir a auditoria automatizada de acessibilidade, passe `--axe /caminho/axe.min.js` (distribuição oficial de `axe-core`, apenas para desenvolvimento). Relatórios registram separadamente violações e verificações inconclusivas. Isso não é certificação integral de acessibilidade.

O teste de navegador simula WhatsApp e GTM em contextos isolados; não envia mensagens nem ativa rastreamento real. As capturas são do site executando no Chromium, diferentes das imagens conceituais originais da pasta `references/`.

## Vercel e publicação

O projeto é compatível com Vercel: preset **Other**, raiz do repositório, sem comando de instalação/build e saída na raiz. `vercel.json` conserva URLs com barra final e headers básicos. Não há SPA ou catch-all que transforme rotas inexistentes em HTTP 200.

Esta entrega é de homologação: `noindex,nofollow` nos HTMLs e `X-Robots-Tag: noindex, nofollow` na configuração Vercel. O sitemap usa o domínio herdado, ainda a confirmar. O robots.txt permite leitura das páginas para que os robôs possam observar o `noindex`.

Antes de um deploy público de produção, mediante autorização:

1. Confirmar logo, telefone comercial, e-mail, domínio, responsáveis/CRC, serviços, endereço e modalidades de atendimento. Não há dados legais ou resultados de clientes inventados.
2. Incluir equipe e fotografias reais autorizadas e aprovar a minuta de privacidade.
3. Confirmar canonical, Open Graph e sitemap para o domínio final. Não há schema de serviços com credenciais não aprovadas.
4. Decidir a política de indexação da produção: remover o header global `X-Robots-Tag` e alterar as páginas públicas para `index,follow`; manter homologação e erros fora do índice. Não faça essa mudança automaticamente na preview.
5. Inventariar URLs antigas antes de criar redirects 301. Nenhuma origem ou destino foi presumido.
6. Revalidar o deploy real, inclusive HTTP, imagens de compartilhamento, navegação, consentimento e WhatsApp. Nenhuma publicação ou avaliação Lighthouse da Vercel foi feita nesta tarefa.

A publicação do ambiente na nuvem salva sua configuração e snapshot de desenvolvimento. Ela é distinta de publicar o site na Vercel.
