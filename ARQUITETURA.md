# Arquitetura do SDR de IA — Venator

Este documento explica como as peças do diagrama que você desenhou se conectam
na prática, o que já foi construído e o que ainda depende de você configurar
(contas, tokens, e uma decisão sobre onde hospedar cada peça).

```
📱 Cliente → WhatsApp Business API → n8n → (Memória / CRM / Base de conhecimento) → OpenAI
                                                                                        │
                                                                                        ▼
                                                                                  SDR de IA
                                                                    Qualifica · Vende (info) · Follow-up
                                                                                        │
                                                                                        ▼
                                                                                  Lead quente
                                                                                        │
                                                                                        ▼
                                                                                    Vendedor
                                                                                        │
                                                                                        ▼
                                                                                      Venda
```

## O que cada peça é, de verdade

| Peça no diagrama | O que construí | Onde está |
|---|---|---|
| WhatsApp Business API | Você precisa criar/configurar isso na Meta — eu não posso criar essa conta por você | conta na Meta for Developers |
| n8n (Automação) | O workflow completo, pronto para importar | `n8n/workflow-sdr-ia.json` |
| Memória | Endpoint que guarda um resumo da conversa por lead | backend, `/api/n8n/memory` |
| CRM | O próprio Venator (contatos, estágios do funil, mensagens) | backend, `/api/contatos`, `/api/n8n/context` |
| Base de conhecimento | Artigos que a IA pode citar (preços, FAQ) | backend, `/api/base-conhecimento` |
| OpenAI API | Chamada feita **pelo n8n**, nunca pelo navegador | node "Chamar OpenAI" no workflow |
| SDR de IA (qualifica/vende/follow-up) | Prompt + lógica de decisão no workflow | node "Montar mensagens para a IA" |
| Lead quente → Vendedor | Endpoint que marca o lead e dispara notificação | backend, `/api/n8n/lead-quente` |

O "backend" acima é a pasta `backend/` deste pacote — é a peça nova que
substitui o front-end sozinho: agora as senhas ficam com hash, a chave da
OpenAI fica só no servidor/n8n, e existe um lugar real para o n8n ler e
escrever dados do CRM.

## Como a conversa flui, passo a passo

1. O cliente manda mensagem no WhatsApp.
2. A Meta entrega essa mensagem via **webhook** para o n8n (rota `whatsapp-inbound`).
3. O n8n extrai telefone, texto e nome do payload.
4. O n8n busca no backend: dados do contato (ou cria um lead novo se for a
   primeira mensagem), o resumo de memória da conversa, e as últimas mensagens.
5. O n8n busca artigos relevantes na base de conhecimento (busca simples por
   palavra-chave — pode evoluir para busca vetorial depois).
6. O n8n monta o prompt do SDR com tudo isso e chama a OpenAI, pedindo uma
   saída em JSON: `{resposta, qualificado, quer_comprar, resumo_memoria}`.
7. O n8n salva a mensagem do lead e a resposta da IA no CRM, e atualiza a
   memória resumida.
8. Se `qualificado = true`, o contato é movido para **Interessado** (ou
   **Negociação**, se `quer_comprar = true`) e o vendedor é notificado.
9. O n8n envia a resposta da IA de volta ao lead via WhatsApp Business API.
10. O vendedor humano assume a partir do estágio "Interessado"/"Negociação"
    no Venator e fecha a venda.

## O que a IA pode e não pode fazer (por prompt)

O prompt em `montar-prompt` instrui a IA a **qualificar, informar sobre
produto/preço e fazer follow-up**, mas explicitamente **nunca fechar a venda
nem negociar condições finais** — isso é decisão de projeto, mantendo o "eu
fecho a venda" que você pediu desde o início. Ajuste o texto do prompt
(dentro do node "Montar mensagens para a IA") livremente conforme o tom e as
regras da sua empresa.

## Passo a passo para colocar no ar

1. **Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # preencha JWT_SECRET, N8N_SHARED_KEY, MASTER_SENHA_HASH (ver README.md do backend)
   npm start
   ```
2. **WhatsApp Business Platform** (Meta for Developers)
   - Crie um app Business, ative o produto WhatsApp.
   - Configure o webhook apontando para `https://SEU-DOMINIO-DO-N8N/webhook/whatsapp-inbound`
     (a URL pública do seu n8n, não do backend).
   - Use o mesmo valor de `WHATSAPP_VERIFY_TOKEN` do `.env` na verificação do webhook.
3. **n8n**
   - Importe `n8n/workflow-sdr-ia.json` ("Import from File").
   - Nos nodes marcados com `COLOQUE_AQUI_...`, substitua pelos valores reais
     (idealmente como *credenciais* do n8n — Header Auth, OpenAI, etc. — em
     vez de texto solto nos campos, para não versionar segredos).
   - Troque as URLs `http://localhost:3333` pela URL pública/interna real do
     seu backend, se ele não rodar na mesma máquina que o n8n.
   - Ative o workflow.
4. **Frontend Venator**
   - Ainda está usando dados locais (estado do React) para contatos, login e
     colaboradores. O próximo passo natural é trocar esses `useState` por
     chamadas aos endpoints `/api/...` deste backend, para que tudo — CRM,
     mensagens humanas e mensagens da IA — viva no mesmo lugar. Posso fazer
     essa integração a seguir, se quiser.

## Pontos de atenção antes de ativar com clientes reais

- **Opt-in / templates do WhatsApp**: a WhatsApp Business Platform exige que
  a empresa tenha consentimento do lead para iniciar conversa, e que a
  primeira mensagem fora da janela de 24h use um *template* pré-aprovado
  pela Meta. Uma IA respondendo livremente só funciona dentro da janela de
  24h de uma conversa já iniciada pelo cliente.
- **Limites de disparo**: contas novas no WhatsApp Business Platform têm
  limite de mensagens iniciadas por dia (crescem com a qualidade/reputação
  do número). Isso não afeta respostas dentro de uma conversa já aberta.
- **LGPD**: a IA vai processar e armazenar conversas com dados pessoais.
  Tenha uma política de privacidade clara, defina por quanto tempo guarda o
  histórico, e informe que o atendimento inicial é automatizado, se isso for
  exigido no seu caso de uso.
- **Erros da IA**: o node "Interpretar resposta da IA" tem um fallback caso a
  OpenAI devolva algo fora do formato esperado, mas vale monitorar as
  execuções do n8n nos primeiros dias para pegar respostas estranhas antes
  que cheguem a um cliente.
- **Segredos**: `N8N_SHARED_KEY`, `OPENAI_API_KEY` e `WHATSAPP_TOKEN` nunca
  devem aparecer no frontend nem em repositórios públicos. Use variáveis de
  ambiente / credenciais do n8n em todos os lugares.
