# LuCrattiva — Site premium para Vercel

Versão autoral concorrente para comparação visual e técnica com o Claude Design. **Protótipo**; ainda não publicado.

## Rodar agora (sem npm)

- Abra um terminal na pasta do projeto.
- Execute `python -m http.server 8080`
- Acesse `http://localhost:8080/`

O site é HTML/CSS/JS estático, sem dependências. Na Vercel, importe o repositório e selecione **Other** / sem build command; output directory vazio ou raiz.

## Páginas

`/`, `/agronegocio/`, `/industria/`, `/servicos/`, `/transportes/`, `/sobre/`, `/equipe/`, `/trocar-de-contador/`, `/contato/`, `/privacidade/`.

## Alterar fotos dos sócios e colaboradores

1. Coloque arquivos WebP/JPEG autorizados dentro de `assets/images/`, por exemplo `cristiane.webp`, `socio-2.webp`, `time-contabil.webp`. Ideal: proporção 4:5, resolução mínima 800×1000, otimizado para web.
2. Abra `assets/js/config.js`. Em `team` altere `name`, `role`, `photo` e `alt` de cada pessoa. Ex.: `{name: 'Nome aprovado',role:'Sócia',photo:'/assets/images/cristiane.webp',alt:'Retrato profissional de ...'}`.
3. Adicione novos perfis duplicando um `<article class="person-card" data-team-index="N">...</article>` nas páginas `index.html` e `equipe/index.html`; incremente o índice e inclua a entrada em `team`. Ou ajuste para um sistema de conteúdo (CMS) se preferir.
4. Não publicar os placeholders de pessoas como se fossem fotos reais.

## Alterar telefone, logo e tracking

- WhatsApp e e-mail: `assets/js/config.js`. Todos os botões apontam para um número único com texto personalizado por setor.
- Logo temporária: `assets/images/logo-mark.svg`; substitua pelo arquivo oficial aprovado.
- Paleta e design: `assets/css/styles.css`.
- Arte editorial original (não é foto da região): `assets/images/campo-editorial.svg`. Você pode substituí-la por imagens reais licenciadas sem mudar o HTML, atualizando CSS.
- Google Tag Manager: `gtMId` em `assets/js/config.js`, mas **só após revisão da política de cookies e configuração correta de Consent Mode e respectivas tags**. Não há pixel configurado por padrão.
- Eventos com consentimento de estatísticas: `whatsapp_click`, `whatsapp_form_intent`. São intenções, **não** contratos nem leads confirmados.

## Antes de publicar

- Confirmar número WhatsApp e email, endereço, responsáveis técnicos, registro CRC e serviços de cada segmento. Não usar cadastro de terceiros como prova sem revisão.
- Validar fotos/nome/cargo/biografias da equipe, e imagem/identidade oficial da marca.
- Substituir minuta da política de privacidade por documento aprovado.
- Decidir domínio: site atual `lucrattivacontabilidade.com.br`; confirmar acesso ao DNS.
- Configurar redirecionamentos 301 das URLs PHP antigas com histórico de busca, se estiver substituindo o site atual.
- Depois do deploy: revisar Lighthouse mobile, GSC, favicon, WhatsApp, formulários, consentimento, eventos, copy e responsividade.
- Evitar alegar credenciais, resultados de clientes ou especialização técnica sem aprovação.

## Conceito

Estilo editorial contemporâneo com tipografia serifada premium, floresta profunda, dourado fosco, respiros off-white, mapas de lavoura vetoriais, fotos substituíveis, páginas segmentadas e captação simples para WhatsApp.

## Trabalhar pelo Codex

`AGENTS.md` traz as regras do projeto; `CODEX_TASK.md` contém o briefing integral com prioridades e critérios de aceite. Abra a pasta/repositório no Codex e peça: **“Leia AGENTS.md e CODEX_TASK.md e execute a Fase A e depois a Fase B.”**

## Testar no Windows

Dê dois cliques em `INICIAR_SITE_WINDOWS.bat` (requer Python instalado) e abra **http://localhost:8080/** no navegador. Depois rode `TESTAR_SITE_WINDOWS.bat` para a verificação automática de links, arquivos, JavaScript e metadados. O teste automático não substitui validação visual real.

Nas páginas de segmento, o formulário já marca a respectiva área de atuação. Antes de compartilhar com pessoas externas, confirme os dados reais em `assets/js/config.js`.

## Teste de eventos (Node)

Rode `node scripts/test_interactions.js` para testar, sem dados reais, geração de links WhatsApp, evento de intenção e consentimento/revogação de tags opcionais.
