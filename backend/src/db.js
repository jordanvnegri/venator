// Camada de persistência. Usa lowdb (arquivo JSON local em disco) para não
// exigir instalação de um banco de dados separado — troque por Postgres/
// MySQL quando o volume de leads justificar (ver ARQUITETURA.md).
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const bcrypt = require("bcryptjs");

// Em Docker, defina DATA_DIR=/app/data (ver Dockerfile) e monte um volume
// nesse caminho para o data.json sobreviver a reinícios/deploys.
const dataDir = process.env.DATA_DIR || path.join(__dirname, "..");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const adapter = new FileSync(path.join(dataDir, "data.json"));
const db = low(adapter);

const ESTAGIOS = ["Frio", "Novo", "Contatado", "Interessado", "Negociação", "Fechado", "Sem Interesse"];

db.defaults({
  colaboradores: [
    // senha inicial "colab123" / "colab456" já com hash — troque em produção
    {
      id: uuid(),
      nome: "Ana Beatriz",
      email: "ana@venator.com",
      senhaHash: bcrypt.hashSync("colab123", 10),
      etapas: ["Novo", "Contatado"],
    },
    {
      id: uuid(),
      nome: "Rafael Prado",
      email: "rafael@venator.com",
      senhaHash: bcrypt.hashSync("colab456", 10),
      etapas: ["Interessado", "Negociação"],
    },
  ],
  contatos: [],
  mensagens: [], // { id, contatoId, origem: 'lead'|'equipe'|'ia', tipo, texto, hora, criadoEm }
  memoria: {}, // { [contatoId]: { resumo, atualizadoEm } }
  baseConhecimento: [
    {
      id: uuid(),
      titulo: "Planos e preços",
      conteudo:
        "Descreva aqui os planos, faixas de preço e condições comerciais que a IA pode citar durante a qualificação.",
    },
    {
      id: uuid(),
      titulo: "Perguntas frequentes",
      conteudo: "Adicione respostas para as dúvidas mais comuns dos leads antes de colocar a IA em produção.",
    },
  ],
  chamadas: [], // { id, colaboradorNome, contatoNome, dataHora, duracao, arquivoUrl }
}).write();

module.exports = { db, uuid, ESTAGIOS };
