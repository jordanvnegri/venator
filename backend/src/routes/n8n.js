// Rotas internas chamadas apenas pelo n8n (nunca pelo navegador de um
// usuário final). Protegidas pelo header "x-n8n-key" — ver src/auth.js.
const express = require("express");
const { db, uuid, ESTAGIOS } = require("../db");
const { autenticadoN8n } = require("../auth");

const router = express.Router();
router.use(autenticadoN8n);

// Busca (ou cria) o contato pelo telefone e devolve tudo que a IA precisa
// para responder com contexto: dados do lead, memória resumida e as
// últimas mensagens da conversa.
router.get("/context/:telefone", (req, res) => {
  const telefone = decodeURIComponent(req.params.telefone);
  let contato = db.get("contatos").find({ telefone }).value();

  if (!contato) {
    contato = {
      id: uuid(),
      nome: req.query.nome || telefone,
      telefone,
      estagio: "Frio",
      ultimaMsg: "—",
      criadoEm: new Date().toISOString(),
      origemLead: "whatsapp-ia",
    };
    db.get("contatos").push(contato).write();
  }

  const memoria = db.get("memoria").get(contato.id).value() || { resumo: "" };
  const mensagensRecentes = db
    .get("mensagens")
    .filter({ contatoId: contato.id })
    .takeRight(20)
    .value();

  res.json({ contato, memoria, mensagensRecentes });
});

// Salva a mensagem recebida do lead e/ou a resposta gerada pela IA.
// origem: 'lead' | 'ia'
router.post("/message", (req, res) => {
  const { contatoId, origem, texto } = req.body || {};
  if (!contatoId || !origem || !texto) {
    return res.status(400).json({ erro: "contatoId, origem e texto são obrigatórios." });
  }
  const msg = {
    id: uuid(),
    contatoId,
    origem,
    tipo: "texto",
    texto,
    hora: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    criadoEm: new Date().toISOString(),
  };
  db.get("mensagens").push(msg).write();
  db.get("contatos").find({ id: contatoId }).assign({ ultimaMsg: texto }).write();
  res.status(201).json(msg);
});

// Atualiza o resumo de memória da conversa (o que a IA já sabe sobre o lead:
// dores, orçamento, prazo, objeções etc.) para injetar nas próximas chamadas.
router.patch("/memory", (req, res) => {
  const { contatoId, resumo } = req.body || {};
  if (!contatoId || typeof resumo !== "string") {
    return res.status(400).json({ erro: "contatoId e resumo são obrigatórios." });
  }
  db.get("memoria").set(contatoId, { resumo, atualizadoEm: new Date().toISOString() }).write();
  res.json({ ok: true });
});

// Move o contato no funil (ex.: "Interessado" quando qualificado,
// "Negociação" quando a IA identifica intenção de compra).
router.patch("/estagio", (req, res) => {
  const { contatoId, estagio } = req.body || {};
  if (!ESTAGIOS.includes(estagio)) return res.status(400).json({ erro: "Estágio inválido." });
  const contato = db.get("contatos").find({ id: contatoId });
  if (!contato.value()) return res.status(404).json({ erro: "Contato não encontrado." });
  contato.assign({ estagio }).write();
  res.json(contato.value());
});

// Busca simples por palavra-chave na base de conhecimento (troque por
// embeddings/busca vetorial quando o volume de artigos crescer).
router.get("/knowledge-base", (req, res) => {
  const termo = (req.query.query || "").toLowerCase();
  const artigos = db.get("baseConhecimento").value();
  const encontrados = termo
    ? artigos.filter(
        (a) => a.titulo.toLowerCase().includes(termo) || a.conteudo.toLowerCase().includes(termo)
      )
    : artigos;
  res.json(encontrados);
});

// Marca o lead como quente e registra o evento — o n8n chama isso quando a
// IA qualifica ou identifica intenção de compra, e este endpoint é o
// gatilho para notificar o vendedor humano (Slack/e-mail/WhatsApp interno).
router.post("/lead-quente", (req, res) => {
  const { contatoId, motivo } = req.body || {};
  const contato = db.get("contatos").find({ id: contatoId }).value();
  if (!contato) return res.status(404).json({ erro: "Contato não encontrado." });

  // TODO: plugue aqui o envio real da notificação (Slack, e-mail, WhatsApp
  // interno para o vendedor responsável pela etapa). Por padrão, apenas
  // registra no log do servidor.
  console.log(`[lead-quente] ${contato.nome} (${contato.telefone}) — motivo: ${motivo || "não informado"}`);

  res.json({ ok: true });
});

module.exports = router;
