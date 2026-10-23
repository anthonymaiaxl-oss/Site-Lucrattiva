# Auditoria e decisões de implementação

Base: ZIP fornecido pelo usuário, importado integralmente antes do refinamento. Os testes originais passaram: 443 verificações estáticas e 10 asserções de interação. Isso validava a estrutura inicial, sem demonstrar o funcionamento em navegador.

## Cinco prioridades encontradas

| Área | Evidência inicial | Refinamento |
| --- | --- | --- |
| Composição visual | Hero e quatro setores dependiam de SVGs simples; hierarquia repetida nas landings. | Imagens editoriais originais em WebP, tipografia local, respiro, contraste revisado, quatro contextos comerciais e páginas institucionais distintas. |
| Equipe | Alterar a quantidade exigia duplicar `data-team-index` em dois HTMLs. | Uma única lista gera todos os cartões nas duas páginas; foto, bio e perfis opcionais; placeholders explícitos. |
| Navegação | Menu fechava por clique em links, sem Escape ou clique fora; dropdown sem estado expandido controlado. | Disclosure por toque e teclado, estado ARIA, fechamento externo/Escape, retorno de foco e indicação da rota. |
| Conversão | Formulário abria um link sem alternativa recuperável; respostas e mensagem não eram apresentadas se a abertura falhasse. | Texto e link copiáveis, respostas mantidas, contexto setorial e mensagens centralizadas. Eventos de intenção sem PII do formulário. |
| Privacidade e performance | Fontes remotas por CSS; revogação parcial não descarregava tags; reabertura não refletia escolha anterior; container futuro sem sequência padrão v2. | Fontes e assets locais; revisão obrigatória adicional ao ID; default denied, categorias separadas, atualização/reload na revogação; escolhas restauradas. Tags continuam desativadas. |

## Etapas

A direção visual de home/equipe foi apresentada com capturas reais e aprovada pelo usuário na conversa. Em seguida, o refinamento foi aplicado às quatro landings, troca de contador, sobre, contato e privacidade. A estrutura estática original, URLs e dados de contato foram preservados.

A referência HBB não foi acessível no ambiente (403 no CONNECT do proxy). A liberação dos domínios foi salva no rascunho da configuração, sem alteração automática do runtime. A ausência de acesso foi informada; o site não foi descrito como se tivesse sido analisado.

A primeira auditoria automatizada de acessibilidade identificou contrastes insuficientes em rótulos dourados e texto secundário. As cores foram corrigidas antes da validação final. O relatório final diferencia verificações automáticas de inspeção visual e de homologação de produção.

## Pendências de conteúdo

Logo oficial; confirmação de telefone/e-mail; domínio/DNS; endereço e canais definitivos; nomes, cargos, biografias e retratos autorizados; responsáveis e CRC; escopo técnico de cada setor; política de dados aprovada. Sem depoimentos, estatísticas comerciais, selos, prêmios ou promessas tributárias inventadas.

A publicação exige autorização e validação em infraestrutura real. Configuração Vercel preparada para homologação com `noindex`. Os resultados executados e limites estão em `RELATORIO_TESTES.md`.
