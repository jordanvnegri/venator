# Como hospedar o Venator

Este projeto tem três peças independentes, cada uma hospedada separadamente
(é o jeito mais barato e simples de manter):

| Peça | O que é | Onde hospedar |
|---|---|---|
| `frontend/` | App React (Vite) — o CRM que você usa no navegador | Vercel ou Netlify |
| `backend/` | API Node/Express — login, contatos, mensagens, memória | Railway, Render, Fly.io ou uma VPS com Docker |
| n8n | Automação que conecta WhatsApp → IA → CRM | n8n Cloud, ou self-hosted (incluso no `docker-compose.yml`) |

Se preferir tudo em um único lugar mais simples de administrar, veja a
opção **"Tudo em uma VPS"** no final.

---

## 1. Backend

### Opção A — Railway / Render (mais simples)
1. Suba a pasta `backend/` para um repositório Git (GitHub/GitLab).
2. Crie um novo serviço no Railway ou Render apontando para esse repositório,
   com "Root Directory" = `backend`.
3. Comando de build: `npm install`. Comando de start: `npm start`.
4. Configure as variáveis de ambiente do `.env.example` no painel do
   provedor (nunca suba o `.env` de verdade para o Git).
5. Gere a senha do master localmente antes: `node gerar-hash-senha.js "SuaSenha"`
   e cole o resultado em `MASTER_SENHA_HASH`.
6. Depois do deploy, anote a URL pública (ex.: `https://venator-backend.up.railway.app`).

### Opção B — Docker em uma VPS
```bash
cd backend
docker build -t venator-backend .
docker run -d --name venator-backend -p 3333:3333 \
  --env-file .env \
  -v venator_data:/app/data \
  venator-backend
```

Em qualquer uma das opções, coloque um proxy com HTTPS na frente (Railway/
Render já entregam isso prontos; numa VPS, use Caddy ou Nginx + Let's Encrypt).

---

## 2. Frontend

```bash
cd frontend
npm install
npm run build       # gera a pasta dist/
```

### Vercel
1. Importe a pasta `frontend/` como projeto no Vercel (framework: Vite).
2. Defina a variável de ambiente `VITE_API_BASE_URL` apontando para a URL
   pública do backend + `/api` (ex.: `https://venator-backend.up.railway.app/api`).
3. Deploy.

### Netlify
1. Build command: `npm run build`. Publish directory: `dist`.
2. Defina `VITE_API_BASE_URL` nas variáveis de ambiente do site.
3. Deploy.

---

## 3. n8n

### Opção A — n8n Cloud
Crie uma conta em n8n.io, importe `n8n/workflow-sdr-ia.json` ("Import from
File") e configure as credenciais/URLs conforme o `ARQUITETURA.md`.

### Opção B — Self-hosted (incluso no docker-compose.yml deste projeto)
```bash
docker compose up -d n8n
```
Acesse `http://SEU_SERVIDOR:5678`, crie sua conta local, importe o workflow
e configure as credenciais.

Nos dois casos, configure o webhook do WhatsApp Business API (Meta) para
apontar para a URL pública do n8n + `/webhook/whatsapp-inbound`.

---

## Tudo em uma VPS (mais simples de administrar, um único servidor)

Suba backend e n8n juntos com o `docker-compose.yml` da raiz do projeto, e
sirva o build estático do frontend com o mesmo Nginx/Caddy que você já vai
usar para o HTTPS:

```bash
# 1. Backend + n8n
cp backend/.env.example backend/.env   # preencha os valores
docker compose up -d --build

# 2. Frontend (build estático)
cd frontend
cp .env.example .env    # aponte VITE_API_BASE_URL para https://seu-dominio/api
npm install && npm run build
# copie o conteúdo de frontend/dist/ para a pasta servida pelo seu Nginx/Caddy
```

Exemplo de roteamento no Nginx/Caddy nesse cenário:
- `/` → arquivos estáticos de `frontend/dist/`
- `/api/*` → `http://localhost:3333`
- `/webhook/*` → `http://localhost:5678` (n8n)

---

## Checklist antes de divulgar a URL para a equipe

- [ ] `JWT_SECRET` e `N8N_SHARED_KEY` são valores aleatórios únicos (não os de exemplo)
- [ ] `MASTER_SENHA_HASH` foi gerado com uma senha forte, não a senha antiga que já circulou nesta conversa
- [ ] `CORS_ORIGIN` no backend está configurado com a URL real do frontend
- [ ] Backend e n8n estão atrás de HTTPS
- [ ] `.env` e `data.json` não foram commitados no Git (`.gitignore` já cobre isso)
- [ ] Chave da OpenAI está configurada como credencial no n8n, não em texto solto num node
