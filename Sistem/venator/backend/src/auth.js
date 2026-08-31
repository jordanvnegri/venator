const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { db } = require("./db");

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.includes("troque-por")) {
  console.warn(
    "[venator] AVISO: JWT_SECRET não foi definido corretamente no .env. Defina um valor forte antes de ir para produção."
  );
}

function gerarToken(usuario) {
  // Nunca coloque a senha (nem o hash) dentro do token.
  return jwt.sign(
    { id: usuario.id, tipo: usuario.tipo, nome: usuario.nome, email: usuario.email, etapas: usuario.etapas || [] },
    JWT_SECRET,
    { expiresIn: "12h" }
  );
}

function login(email, senha) {
  if (email === process.env.MASTER_EMAIL && process.env.MASTER_SENHA_HASH) {
    const ok = bcrypt.compareSync(senha, process.env.MASTER_SENHA_HASH);
    if (ok) {
      return gerarToken({ id: "master", tipo: "master", nome: "Administrador", email });
    }
  }
  const colab = db.get("colaboradores").find({ email }).value();
  if (colab && bcrypt.compareSync(senha, colab.senhaHash)) {
    return gerarToken({ id: colab.id, tipo: "colaborador", nome: colab.nome, email: colab.email, etapas: colab.etapas });
  }
  return null;
}

// Middleware: exige token válido (master ou colaborador) — usado pelas
// rotas que o FRONTEND do Venator chama.
function autenticado(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ erro: "Token ausente." });
  try {
    req.usuario = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ erro: "Token inválido ou expirado." });
  }
}

function apenasMaster(req, res, next) {
  if (req.usuario?.tipo !== "master") {
    return res.status(403).json({ erro: "Apenas o usuário master pode executar esta ação." });
  }
  next();
}

// Middleware separado para as rotas internas que o n8n chama. Não usa JWT
// de usuário — usa uma chave compartilhada fixa (ver .env N8N_SHARED_KEY),
// porque quem chama é o próprio workflow de automação, não uma pessoa logada.
function autenticadoN8n(req, res, next) {
  const chave = req.headers["x-n8n-key"];
  if (!chave || chave !== process.env.N8N_SHARED_KEY) {
    return res.status(401).json({ erro: "Chave do n8n ausente ou inválida." });
  }
  next();
}

module.exports = { login, autenticado, apenasMaster, autenticadoN8n, gerarToken };
