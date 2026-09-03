# Venator Backend

Backend real do Venator: autenticação com senha em hash, CRM (contatos,
mensagens, chamadas), memória de conversa e base de conhecimento. É a peça
que faltava para tirar senhas e chaves de API do código do frontend, e é
quem o **n8n** consulta e atualiza durante o fluxo do SDR de IA.

## 1. Instalar

```bash
cd backend
npm install
cp .env.example .env
```

## 2. Configurar o `.env`

- `JWT_SECRET` e `N8N_SHARED_KEY`: gere valores aleatórios, por exemplo:
  ```bash
  openssl rand -hex 32
  ```
- `MASTER_SENHA_HASH`: gere o hash da senha do master (nunca coloque a senha em texto puro):
  ```bash
  node gerar-hash-senha.js "SuaSenhaForteAqui"
  ```
  Copie o resultado para `MASTER_SENHA_HASH` no `.env`.
- `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_VERIFY_TOKEN`: vêm do
  Meta for Developers, ao configurar seu número no WhatsApp Business Platform.
- `OPENAI_API_KEY`: sua chave da OpenAI (a mesma que **não deve mais** ficar no
  frontend). Essa chave é usada pelo n8n — configure-a lá como credencial,
  não como texto solto em um node.

## 3. Rodar

```bash
npm start
```

O servidor sobe em `http://localhost:3333` (ou a porta definida em `PORT`).

## 4. Endpoints principais

### Para o frontend Venator (exigem `Authorization: Bearer <token>`)
- `POST /api/auth/login`
- `GET/POST/PATCH/DELETE /api/contatos...`
- `GET/POST /api/contatos/:id/mensagens`
- `GET/POST/PATCH/DELETE /api/colaboradores...` (apenas master)
- `GET/POST /api/chamadas` (leitura apenas master)
- `GET/POST /api/base-conhecimento`

### Para o n8n (exigem header `x-n8n-key: <N8N_SHARED_KEY>`)
- `GET /api/n8n/context/:telefone` — busca/cria o lead e devolve contato + memória + últimas mensagens
- `POST /api/n8n/message` — salva mensagem do lead ou da IA
- `PATCH /api/n8n/memory` — atualiza o resumo de memória da conversa
- `PATCH /api/n8n/estagio` — move o contato no funil
- `GET /api/n8n/knowledge-base?query=...` — busca na base de conhecimento
- `POST /api/n8n/lead-quente` — dispara notificação para o vendedor (plugue Slack/e-mail em `src/routes/n8n.js`)

## 5. Sobre o armazenamento

Os dados ficam em `data.json` (via `lowdb`), criado automaticamente na
primeira execução — suficiente para prototipar e validar o fluxo. Para
produção com múltiplos colaboradores e volume real de leads, troque por
Postgres ou MySQL (ver `ARQUITETURA.md` na raiz do projeto).

## 6. Segurança — antes de ir ao ar

- Sirva este backend atrás de **HTTPS** (ex.: por trás de um proxy como Caddy/Nginx ou de um provedor com TLS gerenciado).
- Nunca exponha `.env`, `data.json` ou `N8N_SHARED_KEY` publicamente.
- Restrinja quem pode acessar as rotas `/api/n8n/*` por IP/rede, além da chave, se possível.
- Faça backup periódico de `data.json` (ou do banco, quando migrar).
