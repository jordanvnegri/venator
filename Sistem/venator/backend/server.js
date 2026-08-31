require("dotenv").config();
const express = require("express");
const cors = require("cors");

const rotasFrontend = require("./src/routes/frontend");
const rotasN8n = require("./src/routes/n8n");

const app = express();

// Em desenvolvimento, sem CORS_ORIGIN definido, libera qualquer origem.
// Em produção, defina CORS_ORIGIN com a URL exata do seu frontend
// (ex.: https://venator.suaempresa.com) para bloquear outras origens.
const origemPermitida = process.env.CORS_ORIGIN;
app.use(cors(origemPermitida ? { origin: origemPermitida } : {}));

app.use(express.json({ limit: "5mb" }));

app.get("/health", (req, res) => res.json({ ok: true }));

// Rotas usadas pelo frontend Venator (exigem login de usuário)
app.use("/api", rotasFrontend);

// Rotas usadas apenas pelo workflow do n8n (exigem a chave x-n8n-key)
app.use("/api/n8n", rotasN8n);

const PORTA = process.env.PORT || 3333;
app.listen(PORTA, () => {
  console.log(`[venator] backend rodando em http://localhost:${PORTA}`);
});
