# Venator

CRM de prospecção via WhatsApp com SDR de IA (qualificação automática via
OpenAI, orquestrada pelo n8n).

## Estrutura

```
venator/
├── frontend/     App React (Vite) — o CRM que a equipe usa no navegador
├── backend/      API Node/Express — login, contatos, mensagens, memória
├── n8n/          Workflow de automação (WhatsApp → IA → CRM)
├── ARQUITETURA.md  Como as peças se conectam e o fluxo da conversa
└── DEPLOY.md       Passo a passo para hospedar cada peça
```

## Rodando localmente

```bash
# Backend
cd backend
npm install
cp .env.example .env   # preencha os valores (ver backend/README.md)
npm start               # http://localhost:3333

# Frontend (em outro terminal)
cd frontend
npm install
cp .env.example .env    # já aponta para o backend local por padrão
npm run dev              # http://localhost:5173
```

Login inicial: use o e-mail definido em `MASTER_EMAIL` no `.env` do backend
com a senha que você usou para gerar `MASTER_SENHA_HASH`
(`node backend/gerar-hash-senha.js "SuaSenha"`).

## Documentação

- **`ARQUITETURA.md`** — explica o fluxo completo: WhatsApp → n8n → Memória/CRM/Base de conhecimento → OpenAI → SDR de IA → Lead quente → Vendedor.
- **`DEPLOY.md`** — como colocar cada peça no ar (Vercel/Netlify, Railway/Render, Docker, n8n).
- **`backend/README.md`** — endpoints da API e variáveis de ambiente do backend.
