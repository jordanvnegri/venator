const express = require("express");
const bcrypt = require("bcryptjs");
const { db, uuid, ESTAGIOS } = require("../db");
const { login, autenticado, apenasMaster } = require("../auth");

const router = express.Router();

// ---------------- LOGIN ----------------
router.post("/auth/login", (req, res) => {
  const { email, senha } = req.body || {};
  if (!email || !senha) return res.status(400).json({ erro: "E-mail e senha são obrigatórios." });
  const token = login(email, senha);
  if (!token) return res.status(401).json({ erro: "E-mail ou senha inválidos." });
  res.json({ token });
});

router.use(autenticado);

// ---------------- CONTATOS ----------------
router.get("/contatos", (req, res) => {
  let contatos = db.get("contatos").value();
  if (req.usuario.tipo === "colaborador") {
    contatos = contatos.filter((c) => req.usuario.etapas.includes(c.estagio));
  }
  res.json(contatos);
});

router.post("/contatos", apenasMaster, (req, res) => {
  const { nome, telefone, estagio } = req.body || {};
  if (!nome || !telefone) return res.status(400).json({ erro: "Nome e telefone são obrigatórios." });
  const contato = { id: uuid(), nome, telefone, estagio: estagio || "Frio", ultimaMsg: "—", criadoEm: new Date().toISOString() };
  db.get("contatos").push(contato).write();
  res.status(201).json(contato);
});

router.post("/contatos/import", apenasMaster, (req, res) => {
  const { linhas } = req.body || {}; // [{ nome, telefone }]
  if (!Array.isArray(linhas)) return res.status(400).json({ erro: "Envie um array \"linhas\"." });
  const criados = linhas.map((l) => ({
    id: uuid(),
    nome: l.nome || "Sem nome",
    telefone: l.telefone || "—",
    estagio: "Frio",
    ultimaMsg: "—",
    criadoEm: new Date().toISOString(),
  }));
  db.get("contatos").push(...criados).write();
  res.status(201).json(criados);
});

router.patch("/contatos/:id/estagio", (req, res) => {
  const { estagio } = req.body || {};
  if (!ESTAGIOS.includes(estagio)) return res.status(400).json({ erro: "Estágio inválido." });
  if (req.usuario.tipo === "colaborador" && !req.usuario.etapas.includes(estagio)) {
    return res.status(403).json({ erro: "Você só pode mover contatos para as etapas atribuídas a você." });
  }
  const contato = db.get("contatos").find({ id: req.params.id });
  if (!contato.value()) return res.status(404).json({ erro: "Contato não encontrado." });
  contato.assign({ estagio }).write();
  res.json(contato.value());
});

router.delete("/contatos/:id", apenasMaster, (req, res) => {
  db.get("contatos").remove({ id: req.params.id }).write();
  db.get("mensagens").remove({ contatoId: req.params.id }).write();
  res.status(204).end();
});

router.post("/contatos/excluir-em-massa", apenasMaster, (req, res) => {
  const { ids } = req.body || {};
  if (!Array.isArray(ids)) return res.status(400).json({ erro: "Envie um array \"ids\"." });
  db.get("contatos").remove((c) => ids.includes(c.id)).write();
  db.get("mensagens").remove((m) => ids.includes(m.contatoId)).write();
  res.status(204).end();
});

// ---------------- MENSAGENS ----------------
router.get("/contatos/:id/mensagens", (req, res) => {
  res.json(db.get("mensagens").filter({ contatoId: req.params.id }).value());
});

router.post("/contatos/:id/mensagens", (req, res) => {
  const { tipo, texto, audioUrl, arquivoUrl, arquivoNome, duracao } = req.body || {};
  const msg = {
    id: uuid(),
    contatoId: req.params.id,
    origem: "equipe",
    tipo: tipo || "texto",
    texto,
    audioUrl,
    arquivoUrl,
    arquivoNome,
    duracao,
    hora: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    criadoEm: new Date().toISOString(),
  };
  db.get("mensagens").push(msg).write();
  if (tipo === "texto" && texto) {
    db.get("contatos").find({ id: req.params.id }).assign({ ultimaMsg: texto }).write();
  }
  res.status(201).json(msg);
});

// ---------------- COLABORADORES (apenas master) ----------------
router.get("/colaboradores", apenasMaster, (req, res) => {
  const lista = db.get("colaboradores").value().map(({ senhaHash, ...resto }) => resto);
  res.json(lista);
});

router.post("/colaboradores", apenasMaster, (req, res) => {
  const { nome, email, senha, etapas } = req.body || {};
  if (!nome || !email || !senha) return res.status(400).json({ erro: "Nome, e-mail e senha são obrigatórios." });
  const colaborador = { id: uuid(), nome, email, senhaHash: bcrypt.hashSync(senha, 10), etapas: etapas || [] };
  db.get("colaboradores").push(colaborador).write();
  const { senhaHash, ...resto } = colaborador;
  res.status(201).json(resto);
});

router.patch("/colaboradores/:id", apenasMaster, (req, res) => {
  const { nome, email, senha, etapas } = req.body || {};
  const alvo = db.get("colaboradores").find({ id: req.params.id });
  if (!alvo.value()) return res.status(404).json({ erro: "Colaborador não encontrado." });
  const atualizacao = { nome, email, etapas };
  if (senha) atualizacao.senhaHash = bcrypt.hashSync(senha, 10);
  alvo.assign(atualizacao).write();
  const { senhaHash, ...resto } = alvo.value();
  res.json(resto);
});

router.delete("/colaboradores/:id", apenasMaster, (req, res) => {
  db.get("colaboradores").remove({ id: req.params.id }).write();
  res.status(204).end();
});

// ---------------- CHAMADAS GRAVADAS (apenas master) ----------------
router.get("/chamadas", apenasMaster, (req, res) => {
  res.json(db.get("chamadas").value());
});

router.post("/chamadas", (req, res) => {
  const { contatoNome, dataHora, duracao, arquivoUrl } = req.body || {};
  const chamada = {
    id: uuid(),
    colaboradorNome: req.usuario.nome,
    contatoNome,
    dataHora: dataHora || new Date().toISOString(),
    duracao,
    arquivoUrl,
  };
  db.get("chamadas").push(chamada).write();
  res.status(201).json(chamada);
});

// ---------------- BASE DE CONHECIMENTO ----------------
router.get("/base-conhecimento", (req, res) => {
  res.json(db.get("baseConhecimento").value());
});

router.post("/base-conhecimento", apenasMaster, (req, res) => {
  const { titulo, conteudo } = req.body || {};
  if (!titulo || !conteudo) return res.status(400).json({ erro: "Título e conteúdo são obrigatórios." });
  const artigo = { id: uuid(), titulo, conteudo };
  db.get("baseConhecimento").push(artigo).write();
  res.status(201).json(artigo);
});

module.exports = router;
