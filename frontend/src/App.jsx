import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Send,
  Plus,
  Upload,
  Zap,
  X,
  Check,
  ChevronDown,
  ChevronUp,
  Trash2,
  Mic,
  Paperclip,
  Phone,
  PhoneOff,
  File as FileIcon,
  Bot,
  Settings,
  Pencil,
  ChevronLeft,
} from "lucide-react";

const LOGO_URI =
  "data:image/png;base64,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";

// ---------------------------------------------
// Dados mock — em produção viriam da API oficial
// do WhatsApp Business Platform via backend.
// ---------------------------------------------
const ESTAGIOS = ["Frio", "Novo", "Contatado", "Interessado", "Negociação", "Fechado", "Sem Interesse"];

// Endereço do backend (ver pacote venator-sdr/backend). Troque para a URL
// real do seu servidor quando fizer o deploy — nunca aponte para localhost
// em produção.
const API_BASE_URL = "http://localhost:3333/api";

// Prompt padrão do SDR de IA de teste embutido no chat (ver observação no
// modal "Configurações de IA"). O fluxo de produção de verdade — que recebe
// mensagens reais do WhatsApp — roda no workflow do n8n, não aqui.
const PROMPT_SDR_PADRAO = `Você é uma pessoa de vendas atendendo clientes pelo WhatsApp em nome da empresa — não diga que é uma IA, não se comporte como uma IA. Escreva como uma pessoa real digitando no celular: frases curtas, tom caloroso e direto, sem parecer roteiro nem discurso de vendas óbvio.

Estilo de escrita:
- Use no máximo 1 emoji de vez em quando, nunca em toda mensagem. Muitos emojis parecem robotizado.
- Escreva como quem manda mensagem de verdade: sem formalidade excessiva, sem "Olá, como posso ajudar hoje?".
- Varie as frases, não repita a mesma estrutura de mensagem em mensagem.

Seu objetivo é conduzir a conversa com técnica de vendas de verdade:
- Descubra a necessidade real do cliente com perguntas naturais (pra que é, quantidade, prazo).
- Use gatilhos mentais quando fizer sentido: prova social ("a maioria dos clientes pede..."), escassez/urgência genuína (nunca minta sobre estoque ou prazo), reciprocidade, e ancoragem de valor antes de falar preço.
- Quando o cliente trouxer uma objeção (preço, prazo, "vou pensar"), não empurre — acolha a objeção e responda com um argumento real que a desarme, usando as informações de produto disponíveis.
- Avance a conversa em direção à compra o tempo todo, mas sem parecer insistente ou desesperado.
- Você pode apresentar preços, materiais e condições usando a base de conhecimento de produtos abaixo. Nunca invente informação que não está nela.
- Você NÃO fecha o pedido nem processa pagamento — quando o cliente estiver pronto para comprar, diga que vai te repassar para finalizar os detalhes com um vendedor, e o sistema faz essa transferência automaticamente.

Responda sempre em português do Brasil, em no máximo 2 ou 3 frases.
Sua saída deve ser SOMENTE um objeto JSON, sem nenhum texto fora dele, no formato exato:
{"resposta": "mensagem que será enviada ao lead", "qualificado": true ou false}
Marque "qualificado" como true quando o lead demonstrar interesse real e estiver pronto para avançar com um vendedor.`;

const COR = {
  bg: "#ffffff",
  painel: "#c9d0da",
  painelEscuro: "#b8c1ce",
  linha: "#9aa5b5",
  texto: "#14181f",
  textoSuave: "#4c5566",
  destaque: "#1f6fd1",
  perigo: "#b3271f",
  ok: "#1f8a4c",
};

function LogoVenator({ size = 26 }) {
  return (
    <img
      src={LOGO_URI}
      alt="Venator"
      width={size}
      height={size}
      style={{ objectFit: "contain", display: "block" }}
    />
  );
}

function Avatar({ nome, size = 44 }) {
  const inicial = nome?.[0]?.toUpperCase() || "?";
  return (
    <div
      style={{
        width: size,
        height: size,
        background: COR.painelEscuro,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.4,
        fontWeight: 600,
        color: COR.texto,
        flexShrink: 0,
      }}
    >
      {inicial}
    </div>
  );
}

// Decodifica o "payload" de um JWT apenas para leitura no front-end (nome,
// tipo, etapas) — NÃO valida a assinatura. A validação de verdade acontece
// sempre no backend, a cada chamada; isso aqui só existe para popular a
// interface sem precisar de uma segunda chamada à API depois do login.
function decodificarToken(token) {
  try {
    const payload = token.split(".")[1];
    const normalizado = payload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(normalizado));
  } catch {
    return null;
  }
}

// Client HTTP simples para o backend do Venator. Centraliza a URL base, o
// header de autenticação e o tratamento de erro para não repetir isso em
// cada função que chama a API.
async function apiFetch(caminho, { token, ...opcoes } = {}) {
  const resposta = await fetch(`${API_BASE_URL}${caminho}`, {
    ...opcoes,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opcoes.headers || {}),
    },
  });
  const texto = await resposta.text();
  const dados = texto ? JSON.parse(texto) : null;
  if (!resposta.ok) {
    const erro = new Error(dados?.erro || `Erro ${resposta.status} ao chamar ${caminho}`);
    erro.status = resposta.status;
    throw erro;
  }
  return dados;
}

// Chave usada para guardar o token no localStorage do navegador, para o
// usuário continuar logado depois de recarregar a página — só sai de fato
// quando clica em "Sair" (ou quando o token expira no servidor).
const CHAVE_TOKEN_LOCAL = "venator_token";

// Lê o token salvo (se houver) e confere se ele já não expirou, antes de
// usá-lo para "logar automaticamente" a pessoa ao abrir a página de novo.
function obterSessaoSalva() {
  try {
    const tokenSalvo = localStorage.getItem(CHAVE_TOKEN_LOCAL);
    if (!tokenSalvo) return null;
    const dados = decodificarToken(tokenSalvo);
    if (!dados) return null;
    if (dados.exp && Date.now() >= dados.exp * 1000) {
      localStorage.removeItem(CHAVE_TOKEN_LOCAL);
      return null;
    }
    return { token: tokenSalvo, usuario: dados };
  } catch {
    // localStorage pode não estar disponível (modo privado, etc.) — nesse
    // caso simplesmente não há sessão salva, sem quebrar o app.
    return null;
  }
}

export default function App() {
  // Autenticação — se houver um token salvo e ainda válido, a pessoa já
  // começa logada, sem precisar entrar de novo a cada recarregamento.
  const [usuarioLogado, setUsuarioLogado] = useState(() => obterSessaoSalva()?.usuario ?? null); // { tipo: 'master' | 'colaborador', nome, email, etapas? }
  const [token, setToken] = useState(() => obterSessaoSalva()?.token ?? null);
  const [emailLogin, setEmailLogin] = useState("");
  const [senhaLogin, setSenhaLogin] = useState("");
  const [erroLogin, setErroLogin] = useState("");
  const [entrando, setEntrando] = useState(false);
  const [carregandoDados, setCarregandoDados] = useState(false);
  const [erroApi, setErroApi] = useState("");

  const [contatos, setContatos] = useState([]);
  const [colaboradores, setColaboradores] = useState([]);
  const [baseConhecimento, setBaseConhecimento] = useState([]);
  const [selecionadoId, setSelecionadoId] = useState(null);
  const [filtroEstagio, setFiltroEstagio] = useState("Todos");
  const [mensagem, setMensagem] = useState("");
  const [mostrarImport, setMostrarImport] = useState(false);
  const [textoImport, setTextoImport] = useState("");
  const [mostrarDisparo, setMostrarDisparo] = useState(false);
  const [msgDisparo, setMsgDisparo] = useState("");
  const [estagioDisparo, setEstagioDisparo] = useState("Todos");
  const [enviando, setEnviando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [avisoLimite, setAvisoLimite] = useState(false);
  const [etapasAbertas, setEtapasAbertas] = useState(false);
  const fileRef = useRef(null);

  // Exclusão de contatos (individual e em massa) — restrita ao master
  const [selecionados, setSelecionados] = useState([]);
  const [confirmarExclusao, setConfirmarExclusao] = useState(null); // { tipo: 'um'|'massa', ids: [], nome? }

  // Painel administrativo — gestão de colaboradores
  const [mostrarAdmin, setMostrarAdmin] = useState(false);
  const [formColabId, setFormColabId] = useState(null);
  const [formNome, setFormNome] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formSenha, setFormSenha] = useState("");
  const [formEtapas, setFormEtapas] = useState([]);

  // Base de conhecimento — produtos que a IA usa para atender (apenas master)
  const [mostrarBaseConhecimento, setMostrarBaseConhecimento] = useState(false);
  const [formularioArtigoAberto, setFormularioArtigoAberto] = useState(false);
  const [formArtigoId, setFormArtigoId] = useState(null);
  const [formArtigoNome, setFormArtigoNome] = useState("");
  const [formArtigoDescricao, setFormArtigoDescricao] = useState("");
  const [formArtigoMaterial, setFormArtigoMaterial] = useState("");
  const [formArtigoPreco, setFormArtigoPreco] = useState("");
  const [formArtigoPrecoAtacado, setFormArtigoPrecoAtacado] = useState("");
  const [formArtigoQtdMinima, setFormArtigoQtdMinima] = useState("");

  // Mensagens por contato (texto, áudio, arquivo, registro de chamada)
  const [mensagensPorContato, setMensagensPorContato] = useState({});
  const arquivoRef = useRef(null);

  // Gravação de nota de voz
  const [gravandoNota, setGravandoNota] = useState(false);
  const [duracaoNota, setDuracaoNota] = useState(0);
  const [erroMedia, setErroMedia] = useState("");
  const gravadorNotaRef = useRef(null);
  const chunksNotaRef = useRef([]);
  const intervaloNotaRef = useRef(null);

  // Chamadas de áudio — gravadas e armazenadas, visíveis apenas ao master
  const [chamadaAtiva, setChamadaAtiva] = useState(null); // { contatoId, contatoNome, inicio }
  const [duracaoChamada, setDuracaoChamada] = useState(0);
  const [chamadas, setChamadas] = useState([]); // { id, colaboradorNome, contatoNome, dataHora, duracao, audioUrl }
  const [mostrarChamadas, setMostrarChamadas] = useState(false);
  const gravadorChamadaRef = useRef(null);
  const chunksChamadaRef = useRef([]);
  const streamChamadaRef = useRef(null);
  const intervaloChamadaRef = useRef(null);

  // Integração com IA (SDR automático via OpenAI)
  const [configIA, setConfigIA] = useState({
    apiKey: "",
    modelo: "gpt-4o-mini",
    promptSistema: PROMPT_SDR_PADRAO,
    moverAutomaticamente: true,
  });
  const [mostrarConfigIA, setMostrarConfigIA] = useState(false);
  const [carregandoIaIds, setCarregandoIaIds] = useState([]);
  const [erroIA, setErroIA] = useState("");
  const [mensagemSimulada, setMensagemSimulada] = useState("");
  const [iaSdrPorContato, setIaSdrPorContato] = useState({});

  const ehMaster = usuarioLogado?.tipo === "master";
  const etapasVisiveis = ehMaster ? ESTAGIOS : usuarioLogado?.etapas || [];

  // Detecta o tamanho da tela para adaptar o layout entre celular, tablet
  // e computador, mantendo só uma coluna visível por vez no celular (como
  // o próprio WhatsApp faz), em vez de espremer sidebar + conversa juntos.
  const [larguraJanela, setLarguraJanela] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1280
  );
  useEffect(() => {
    function aoRedimensionar() {
      setLarguraJanela(window.innerWidth);
    }
    window.addEventListener("resize", aoRedimensionar);
    return () => window.removeEventListener("resize", aoRedimensionar);
  }, []);
  const ehMobile = larguraJanela < 760;

  // Busca os dados do backend sempre que alguém faz login (ou recarrega a
  // página já logado). Sem isso, a tela fica vazia mesmo com os dados
  // salvos certinho no servidor — foi o bug que fazia "Administração"
  // mostrar zero colaboradores mesmo com os logins deles funcionando.
  useEffect(() => {
    if (!usuarioLogado || !token) return;

    let cancelado = false;

    async function carregarDados() {
      try {
        const listaContatos = await apiFetch("/contatos", { token });
        if (!cancelado) setContatos(listaContatos);
      } catch (err) {
        if (cancelado) return;
        if (err.status === 401) {
          // Token salvo expirou ou não é mais válido — volta pra tela de
          // login em vez de deixar a tela travada em branco.
          sair();
          return;
        }
        setErroApi(err.message);
      }

      if (usuarioLogado.tipo === "master") {
        try {
          const listaColaboradores = await apiFetch("/colaboradores", { token });
          if (!cancelado) setColaboradores(listaColaboradores);
        } catch (err) {
          if (!cancelado) setErroApi(err.message);
        }
        try {
          const listaBaseConhecimento = await apiFetch("/base-conhecimento", { token });
          if (!cancelado) setBaseConhecimento(listaBaseConhecimento);
        } catch (err) {
          // silencioso
        }
      }
    }

    carregarDados();
    return () => {
      cancelado = true;
    };
  }, [usuarioLogado, token]);

  const selecionado = contatos.find((c) => c.id === selecionadoId);

  // Escopo de contatos visível ao usuário logado: colaborador só vê
  // contatos das etapas atribuídas a ele pelo master.
  const escopoContatos = useMemo(() => {
    if (usuarioLogado?.tipo === "colaborador") {
      return contatos.filter((c) => (usuarioLogado.etapas || []).includes(c.estagio));
    }
    return contatos;
  }, [contatos, usuarioLogado]);

  const contatosFiltrados = useMemo(() => {
    if (filtroEstagio === "Todos") return escopoContatos;
    return escopoContatos.filter((c) => c.estagio === filtroEstagio);
  }, [escopoContatos, filtroEstagio]);

  const contagemPorEstagio = useMemo(() => {
    const map = {};
    ESTAGIOS.forEach((e) => (map[e] = 0));
    contatos.forEach((c) => (map[c.estagio] = (map[c.estagio] || 0) + 1));
    return map;
  }, [contatos]);

  function horaAtual() {
    return new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  }

  function formatarDuracao(segundos) {
    const s = Math.max(0, segundos || 0);
    const min = Math.floor(s / 60);
    const seg = s % 60;
    return `${min}:${String(seg).padStart(2, "0")}`;
  }

  function formatarTamanho(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function adicionarMensagem(contatoId, msg) {
    setMensagensPorContato((prev) => ({
      ...prev,
      [contatoId]: [...(prev[contatoId] || []), msg],
    }));
  }

  function previewDe(c) {
    const msgs = mensagensPorContato[c.id];
    if (msgs && msgs.length > 0) {
      const ultima = msgs[msgs.length - 1];
      if (ultima.tipo === "audio") return "🎤 Mensagem de áudio";
      if (ultima.tipo === "arquivo") return `📎 ${ultima.nome}`;
      if (ultima.tipo === "chamada") return `📞 Chamada · ${formatarDuracao(ultima.duracao)}`;
      return ultima.texto;
    }
    return c.ultimaMsg;
  }

  const threadSelecionado = useMemo(() => {
    if (!selecionado) return [];
    const base = [];
    if (selecionado.ultimaMsg && selecionado.ultimaMsg !== "—") {
      base.push({ id: "seed", tipo: "texto", texto: selecionado.ultimaMsg, hora: "" });
    }
    return [...base, ...(mensagensPorContato[selecionado.id] || [])];
  }, [selecionado, mensagensPorContato]);

  async function fazerLogin() {
    if (!emailLogin.trim() || !senhaLogin) return;
    setEntrando(true);
    setErroLogin("");
    try {
      const { token: novoToken } = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: emailLogin.trim(), senha: senhaLogin }),
      });
      const dados = decodificarToken(novoToken);
      if (!dados) throw new Error("Não foi possível validar o token recebido.");
      try {
        localStorage.setItem(CHAVE_TOKEN_LOCAL, novoToken);
      } catch {
        // se o navegador bloquear localStorage (modo privado etc.), a
        // pessoa só vai precisar logar de novo no próximo acesso — não é
        // motivo para travar o login de agora.
      }
      setToken(novoToken);
      setUsuarioLogado(dados);
      setSenhaLogin("");
      setFiltroEstagio("Todos");
    } catch (err) {
      setErroLogin(err.message || "E-mail ou senha inválidos.");
    } finally {
      setEntrando(false);
    }
  }

  function sair() {
    try {
      localStorage.removeItem(CHAVE_TOKEN_LOCAL);
    } catch {
      // idem: sem localStorage disponível, não há o que limpar
    }
    setUsuarioLogado(null);
    setToken(null);
    setEmailLogin("");
    setSenhaLogin("");
    setSelecionados([]);
    setMostrarAdmin(false);
    setContatos([]);
    setColaboradores([]);
    setSelecionadoId(null);
    setMensagensPorContato({});
  }

  function alternarSelecao(id) {
    setSelecionados((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  async function excluirContatos(ids) {
    try {
      if (ids.length === 1) {
        await apiFetch(`/contatos/${ids[0]}`, { method: "DELETE", token });
      } else {
        await apiFetch("/contatos/excluir-em-massa", { method: "POST", token, body: JSON.stringify({ ids }) });
      }
      setContatos((prev) => prev.filter((c) => !ids.includes(c.id)));
      setSelecionados((prev) => prev.filter((x) => !ids.includes(x)));
      if (ids.includes(selecionadoId)) setSelecionadoId(null);
    } catch (err) {
      setErroApi(err.message);
    } finally {
      setConfirmarExclusao(null);
    }
  }

  function limparFormColab() {
    setFormColabId(null);
    setFormNome("");
    setFormEmail("");
    setFormSenha("");
    setFormEtapas([]);
  }

  function editarColaborador(c) {
    setFormColabId(c.id);
    setFormNome(c.nome);
    setFormEmail(c.email);
    setFormSenha(""); // senha nunca volta do backend; deixe em branco para manter a atual
    setFormEtapas(c.etapas);
  }

  function alternarEtapaForm(e) {
    setFormEtapas((prev) => (prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]));
  }

  async function salvarColaborador() {
    if (!formNome.trim() || !formEmail.trim() || (!formColabId && !formSenha.trim())) return;
    try {
      if (formColabId) {
        const atualizado = await apiFetch(`/colaboradores/${formColabId}`, {
          method: "PATCH",
          token,
          body: JSON.stringify({
            nome: formNome,
            email: formEmail,
            etapas: formEtapas,
            ...(formSenha.trim() ? { senha: formSenha } : {}),
          }),
        });
        setColaboradores((prev) => prev.map((c) => (c.id === formColabId ? atualizado : c)));
      } else {
        const criado = await apiFetch("/colaboradores", {
          method: "POST",
          token,
          body: JSON.stringify({ nome: formNome, email: formEmail, senha: formSenha, etapas: formEtapas }),
        });
        setColaboradores((prev) => [...prev, criado]);
      }
      limparFormColab();
    } catch (err) {
      setErroApi(err.message);
    }
  }

  async function excluirColaborador(id) {
    try {
      await apiFetch(`/colaboradores/${id}`, { method: "DELETE", token });
      setColaboradores((prev) => prev.filter((c) => c.id !== id));
      if (formColabId === id) limparFormColab();
    } catch (err) {
      setErroApi(err.message);
    }
  }

  // ---------------- BASE DE CONHECIMENTO (produtos para a IA) ----------------
  function limparFormArtigo() {
    setFormArtigoId(null);
    setFormArtigoNome("");
    setFormArtigoDescricao("");
    setFormArtigoMaterial("");
    setFormArtigoPreco("");
    setFormArtigoPrecoAtacado("");
    setFormArtigoQtdMinima("");
    setFormularioArtigoAberto(false);
  }

  function novoArtigo() {
    limparFormArtigo();
    setFormularioArtigoAberto(true);
  }

  function editarArtigo(a) {
    setFormArtigoId(a.id);
    setFormArtigoNome(a.nome || "");
    setFormArtigoDescricao(a.descricao || "");
    setFormArtigoMaterial(a.material || "");
    setFormArtigoPreco(a.preco || "");
    setFormArtigoPrecoAtacado(a.precoAtacado || "");
    setFormArtigoQtdMinima(a.quantidadeMinima || "");
    setFormularioArtigoAberto(true);
  }

  async function salvarArtigo() {
    if (!formArtigoNome.trim()) return;
    const dados = {
      nome: formArtigoNome,
      descricao: formArtigoDescricao,
      material: formArtigoMaterial,
      preco: formArtigoPreco,
      precoAtacado: formArtigoPrecoAtacado,
      quantidadeMinima: formArtigoQtdMinima,
    };
    try {
      if (formArtigoId) {
        const atualizado = await apiFetch(`/base-conhecimento/${formArtigoId}`, {
          method: "PATCH",
          token,
          body: JSON.stringify(dados),
        });
        setBaseConhecimento((prev) => prev.map((a) => (a.id === formArtigoId ? atualizado : a)));
      } else {
        const criado = await apiFetch("/base-conhecimento", {
          method: "POST",
          token,
          body: JSON.stringify(dados),
        });
        setBaseConhecimento((prev) => [...prev, criado]);
      }
      limparFormArtigo();
    } catch (err) {
      setErroApi(err.message);
    }
  }

  async function excluirArtigo(id) {
    try {
      await apiFetch(`/base-conhecimento/${id}`, { method: "DELETE", token });
      setBaseConhecimento((prev) => prev.filter((a) => a.id !== id));
      if (formArtigoId === id) limparFormArtigo();
    } catch (err) {
      setErroApi(err.message);
    }
  }

  async function enviarMensagem() {
    if (!mensagem.trim() || !selecionado) return;
    const texto = mensagem;
    setMensagem("");
    try {
      const salva = await apiFetch(`/contatos/${selecionado.id}/mensagens`, {
        method: "POST",
        token,
        body: JSON.stringify({ tipo: "texto", texto }),
      });
      adicionarMensagem(selecionado.id, { ...salva, origem: "equipe" });
      setContatos((prev) => prev.map((c) => (c.id === selecionado.id ? { ...c, ultimaMsg: texto } : c)));
    } catch (err) {
      setErroApi(err.message);
      setMensagem(texto); // devolve o texto ao campo para o usuário tentar de novo
    }
  }

  async function iniciarGravacaoNota() {
    if (!selecionado) return;
    setErroMedia("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const gravador = new MediaRecorder(stream);
      chunksNotaRef.current = [];
      gravador.ondataavailable = (e) => chunksNotaRef.current.push(e.data);
      gravador.onstop = () => {
        const blob = new Blob(chunksNotaRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        adicionarMensagem(selecionado.id, { id: Date.now(), tipo: "audio", audioUrl: url, hora: horaAtual() });
        stream.getTracks().forEach((t) => t.stop());
      };
      gravador.start();
      gravadorNotaRef.current = gravador;
      setDuracaoNota(0);
      setGravandoNota(true);
      intervaloNotaRef.current = setInterval(() => setDuracaoNota((d) => d + 1), 1000);
    } catch (err) {
      setErroMedia("Não foi possível acessar o microfone. Verifique as permissões do navegador.");
    }
  }

  function pararGravacaoNota() {
    gravadorNotaRef.current?.stop();
    clearInterval(intervaloNotaRef.current);
    setGravandoNota(false);
  }

  function enviarArquivo(file) {
    if (!file || !selecionado) return;
    const url = URL.createObjectURL(file);
    adicionarMensagem(selecionado.id, {
      id: Date.now(),
      tipo: "arquivo",
      nome: file.name,
      tamanho: formatarTamanho(file.size),
      url,
      hora: horaAtual(),
    });
  }

  async function iniciarChamada() {
    if (!selecionado || chamadaAtiva) return;
    setErroMedia("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamChamadaRef.current = stream;
      const gravador = new MediaRecorder(stream);
      chunksChamadaRef.current = [];
      gravador.ondataavailable = (e) => chunksChamadaRef.current.push(e.data);
      gravador.start();
      gravadorChamadaRef.current = gravador;
      setChamadaAtiva({ contatoId: selecionado.id, contatoNome: selecionado.nome, inicio: Date.now() });
      setDuracaoChamada(0);
      intervaloChamadaRef.current = setInterval(() => setDuracaoChamada((d) => d + 1), 1000);
    } catch (err) {
      setErroMedia("Não foi possível acessar o microfone para iniciar a chamada.");
    }
  }

  function encerrarChamada() {
    if (!chamadaAtiva) return;
    const { contatoId, contatoNome } = chamadaAtiva;
    const duracaoFinal = duracaoChamada;
    const gravador = gravadorChamadaRef.current;
    const nomeOperador = usuarioLogado.nome;

    if (gravador) {
      gravador.onstop = () => {
        const blob = new Blob(chunksChamadaRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setChamadas((prev) => [
          {
            id: Date.now(),
            colaboradorNome: nomeOperador,
            contatoNome,
            dataHora: new Date().toISOString(),
            duracao: duracaoFinal,
            audioUrl: url,
          },
          ...prev,
        ]);
        streamChamadaRef.current?.getTracks().forEach((t) => t.stop());
      };
      gravador.stop();
    }

    adicionarMensagem(contatoId, {
      id: Date.now() + 1,
      tipo: "chamada",
      duracao: duracaoFinal,
      hora: horaAtual(),
    });

    clearInterval(intervaloChamadaRef.current);
    setChamadaAtiva(null);
  }

  function alternarIaSdr(contatoId) {
    setIaSdrPorContato((prev) => ({ ...prev, [contatoId]: !prev[contatoId] }));
  }

  // Chama a IA (OpenAI) para atuar como SDR: qualifica o lead e, quando
  // identifica interesse real, move o contato automaticamente para "Interessado".
  // A chave da API é usada apenas em memória, no navegador do usuário — ver aviso
  // no modal de Configurações de IA sobre os riscos de expor a chave no front-end.
  async function chamarIaSdr(contatoId, textoRecebido) {
    if (!textoRecebido.trim()) return;
    const contato = contatos.find((c) => c.id === contatoId);
    if (!contato) return;

    if (!configIA.apiKey) {
      setErroIA("Configure a chave da API da OpenAI em \"Configurações de IA\" antes de ativar o SDR.");
      return;
    }

    adicionarMensagem(contatoId, {
      id: Date.now(),
      tipo: "texto",
      origem: "lead",
      texto: textoRecebido,
      hora: horaAtual(),
    });

    setErroIA("");
    setCarregandoIaIds((prev) => [...prev, contatoId]);

    try {
      const historico = (mensagensPorContato[contatoId] || [])
        .filter((m) => m.tipo === "texto")
        .map((m) => ({ role: m.origem === "lead" ? "user" : "assistant", content: m.texto }));

      const resposta = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${configIA.apiKey}`,
        },
        body: JSON.stringify({
          model: configIA.modelo || "gpt-4o-mini",
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: configIA.promptSistema },
            ...historico,
            { role: "user", content: textoRecebido },
          ],
        }),
      });

      if (!resposta.ok) {
        const detalhe = await resposta.text();
        throw new Error(`Erro ${resposta.status}: ${detalhe.slice(0, 200)}`);
      }

      const dados = await resposta.json();
      const bruto = dados.choices?.[0]?.message?.content || "{}";
      const saida = JSON.parse(bruto);

      adicionarMensagem(contatoId, {
        id: Date.now() + 1,
        tipo: "texto",
        origem: "ia",
        texto: saida.resposta || "(a IA não retornou uma resposta)",
        hora: horaAtual(),
      });

      if (
        saida.qualificado &&
        configIA.moverAutomaticamente &&
        contato.estagio !== "Interessado" &&
        contato.estagio !== "Negociação" &&
        contato.estagio !== "Fechado"
      ) {
        setContatos((prev) =>
          prev.map((c) => (c.id === contatoId ? { ...c, estagio: "Interessado" } : c))
        );
      }
    } catch (err) {
      setErroIA(`Falha ao chamar a IA: ${err.message || "verifique a chave e sua conexão."}`);
    } finally {
      setCarregandoIaIds((prev) => prev.filter((id) => id !== contatoId));
    }
  }

  function enviarMensagemSimulada() {
    if (!mensagemSimulada.trim() || !selecionado) return;
    const texto = mensagemSimulada;
    setMensagemSimulada("");
    if (iaSdrPorContato[selecionado.id]) {
      chamarIaSdr(selecionado.id, texto);
    } else {
      adicionarMensagem(selecionado.id, {
        id: Date.now(),
        tipo: "texto",
        origem: "lead",
        texto,
        hora: horaAtual(),
      });
    }
  }

  async function mudarEstagio(id, novoEstagio) {
    if (!ehMaster && !(usuarioLogado?.etapas || []).includes(novoEstagio)) return;
    const anterior = contatos.find((c) => c.id === id)?.estagio;
    setContatos((prev) => prev.map((c) => (c.id === id ? { ...c, estagio: novoEstagio } : c)));
    try {
      await apiFetch(`/contatos/${id}/estagio`, {
        method: "PATCH",
        token,
        body: JSON.stringify({ estagio: novoEstagio }),
      });
    } catch (err) {
      setErroApi(err.message);
      setContatos((prev) => prev.map((c) => (c.id === id ? { ...c, estagio: anterior } : c)));
    }
  }

  function importarContatos() {
    const linhas = textoImport
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const novos = linhas.map((linha, i) => {
      const [nome, telefone] = linha.split(",").map((s) => s?.trim());
      return {
        id: Date.now() + i,
        nome: nome || `Contato ${contatos.length + i + 1}`,
        telefone: telefone || "—",
        estagio: "Novo",
        ultimaMsg: "—",
      };
    });
    setContatos((prev) => [...novos, ...prev]);
    setTextoImport("");
    setMostrarImport(false);
  }

  function dispararMensagens() {
    if (!msgDisparo.trim()) return;
    const alvos =
      estagioDisparo === "Todos" ? contatos : contatos.filter((c) => c.estagio === estagioDisparo);
    if (alvos.length > 250) {
      setAvisoLimite(true);
    }
    setEnviando(true);
    setProgresso(0);
    let enviados = 0;
    const total = alvos.length;
    const intervalo = setInterval(() => {
      enviados += 1;
      setProgresso(Math.round((enviados / total) * 100));
      if (enviados >= total) {
        clearInterval(intervalo);
        setContatos((prev) =>
          prev.map((c) =>
            alvos.find((a) => a.id === c.id) ? { ...c, ultimaMsg: msgDisparo, estagio: c.estagio === "Novo" ? "Contatado" : c.estagio } : c
          )
        );
        setTimeout(() => {
          setEnviando(false);
          setMostrarDisparo(false);
          setMsgDisparo("");
        }, 500);
      }
    }, total > 0 ? Math.max(1200 / total, 40) : 0);
  }

  // ---------------- TELA DE LOGIN ----------------
  if (!usuarioLogado) {
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          minHeight: 640,
          background: COR.painel,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
          color: COR.texto,
        }}
      >
        <div style={{ background: "#fff", width: 360, maxWidth: "90vw", padding: ehMobile ? 22 : 32, border: `1px solid ${COR.linha}` }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginBottom: 26 }}>
            <LogoVenator size={40} />
            <div
              style={{
                fontFamily: "'Hiragino Mincho ProN', 'Yu Mincho', 'MS Mincho', 'Noto Serif JP', serif",
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: 1.5,
                textTransform: "uppercase",
              }}
            >
              Venator
            </div>
          </div>

          <label style={rotuloForm}>E-mail</label>
          <input
            value={emailLogin}
            onChange={(e) => setEmailLogin(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fazerLogin()}
            placeholder="seuemail@venator.com"
            style={inputForm}
          />
          <label style={rotuloForm}>Senha</label>
          <input
            type="password"
            value={senhaLogin}
            onChange={(e) => setSenhaLogin(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fazerLogin()}
            placeholder="••••••••"
            style={inputForm}
          />

          {erroLogin && (
            <div style={{ fontSize: 12, color: COR.perigo, marginBottom: 12 }}>{erroLogin}</div>
          )}

          <button onClick={fazerLogin} style={{ ...btnPrimario, width: "100%", marginTop: 6 }}>
            Entrar
          </button>

          <div style={{ fontSize: 11, color: COR.textoSuave, marginTop: 18, lineHeight: 1.4 }}>
            O acesso de colaboradores é criado e alterado apenas pelo usuário master, no painel
            administrativo.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100vh",
        minHeight: 640,
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        color: COR.texto,
        fontSize: 14,
      }}
    >
      {erroApi && (
        <div
          style={{
            background: COR.perigo,
            color: "#fff",
            padding: "8px 16px",
            fontSize: 12,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <span>Erro ao falar com o servidor: {erroApi}</span>
          <button
            onClick={() => setErroApi("")}
            style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontWeight: 700 }}
          >
            <X size={14} />
          </button>
        </div>
      )}
      <div style={{ display: "flex", flex: 1, minHeight: 0, background: COR.bg }}>
      {/* ---------------- SIDEBAR ---------------- */}
      <div
        style={{
          width: ehMobile ? "100%" : 320,
          minWidth: ehMobile ? "auto" : 280,
          display: ehMobile && selecionadoId ? "none" : "flex",
          background: COR.bg,
          borderRight: ehMobile ? "none" : `1px solid ${COR.linha}`,
          flexDirection: "column",
        }}
      >
        {/* Logomarca */}
        <div style={{ padding: "20px 16px 14px", display: "flex", alignItems: "center", gap: 10 }}>
          <LogoVenator size={26} />
          <div
            style={{
              fontFamily: "'Hiragino Mincho ProN', 'Yu Mincho', 'MS Mincho', 'Noto Serif JP', serif",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 1.5,
              textTransform: "uppercase",
            }}
          >
            Venator
          </div>
        </div>

        {/* Ações rápidas — apenas usuário master */}
        {ehMaster && (
          <div style={{ display: "flex", gap: 8, padding: "0 16px 12px" }}>
            <button
              onClick={() => setMostrarImport(true)}
              style={btnSecundario}
            >
              <Upload size={14} /> Add contatos
            </button>
            <button
              onClick={() => setMostrarDisparo(true)}
              style={btnPrimario}
            >
              <Zap size={14} /> Disparo
            </button>
          </div>
        )}

        {/* Etapas do funil (recolhível) */}
        <div style={{ padding: "0 16px 12px" }}>
          <button
            onClick={() => setEtapasAbertas((v) => !v)}
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "transparent",
              border: "none",
              borderBottom: `1px solid ${COR.linha}`,
              padding: "6px 2px",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 0.8,
                textTransform: "uppercase",
                color: COR.textoSuave,
              }}
            >
              Etapas do funil
              {!etapasAbertas && filtroEstagio !== "Todos" ? ` · ${filtroEstagio}` : ""}
            </span>
            {etapasAbertas ? <ChevronUp size={14} color={COR.textoSuave} /> : <ChevronDown size={14} color={COR.textoSuave} />}
          </button>

          {etapasAbertas && (
            <div style={{ background: COR.painel, display: "flex", flexDirection: "column", marginTop: 8 }}>
              <button
                onClick={() => {
                  setFiltroEstagio("Todos");
                  setEtapasAbertas(false);
                }}
                style={linhaEstagio(filtroEstagio === "Todos")}
              >
                <span>{ehMaster ? "Todos os contatos" : "Todos atribuídos a mim"}</span>
                <span>{escopoContatos.length}</span>
              </button>
              {etapasVisiveis.map((e) => (
                <button
                  key={e}
                  onClick={() => {
                    setFiltroEstagio(e);
                    setEtapasAbertas(false);
                  }}
                  style={linhaEstagio(filtroEstagio === e)}
                >
                  <span>{e}</span>
                  <span>{contagemPorEstagio[e] || 0}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Ações em massa — apenas usuário master */}
        {ehMaster && selecionados.length > 0 && (
          <div style={{ padding: "0 16px 10px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#fff3f2",
                border: `1px solid ${COR.perigo}`,
                padding: "8px 10px",
              }}
            >
              <span style={{ fontSize: 12, color: COR.perigo, fontWeight: 700 }}>
                {selecionados.length} selecionado(s)
              </span>
              <button
                onClick={() => setConfirmarExclusao({ tipo: "massa", ids: [...selecionados] })}
                style={{ ...btnSecundario, flex: "none", padding: "6px 10px", color: COR.perigo, borderColor: COR.perigo }}
              >
                <Trash2 size={13} /> Excluir
              </button>
            </div>
          </div>
        )}

        {/* Lista de contatos */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
          {contatosFiltrados.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelecionadoId(c.id)}
              style={{
                background: c.id === selecionadoId ? COR.painelEscuro : COR.painel,
                padding: "12px 14px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                  {ehMaster && (
                    <input
                      type="checkbox"
                      checked={selecionados.includes(c.id)}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => alternarSelecao(c.id)}
                      style={{ flexShrink: 0, cursor: "pointer" }}
                    />
                  )}
                  <span style={{ fontWeight: 600, fontSize: 15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {c.nome}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                  <select
                    value={c.estagio}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => mudarEstagio(c.id, e.target.value)}
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      border: "none",
                      background: "transparent",
                      color: COR.textoSuave,
                      cursor: "pointer",
                    }}
                  >
                    {(ehMaster ? ESTAGIOS : usuarioLogado.etapas).map((e) => (
                      <option key={e} value={e}>
                        {e}
                      </option>
                    ))}
                  </select>
                  {ehMaster && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmarExclusao({ tipo: "um", ids: [c.id], nome: c.nome });
                      }}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 2, display: "flex" }}
                      aria-label={`Excluir ${c.nome}`}
                    >
                      <Trash2 size={14} color={COR.perigo} />
                    </button>
                  )}
                </div>
              </div>
              <div style={{ fontSize: 12, color: COR.textoSuave }}>{previewDe(c)}</div>
            </div>
          ))}
          {contatosFiltrados.length === 0 && (
            <div style={{ color: COR.textoSuave, fontSize: 12, padding: 12 }}>
              Nenhum contato neste estágio.
            </div>
          )}
        </div>

        {/* Rodapé — usuário logado, administração e sair */}
        <div
          style={{
            borderTop: `1px solid ${COR.linha}`,
            padding: "10px 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {usuarioLogado.nome}
            </div>
            <div style={{ fontSize: 10, color: COR.textoSuave, textTransform: "uppercase", letterSpacing: 0.5 }}>
              {ehMaster ? "Usuário master" : "Colaborador"}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: 12,
              flexShrink: 0,
              flexWrap: "wrap",
              justifyContent: "flex-end",
              maxWidth: ehMobile ? "100%" : 150,
            }}
          >
            {ehMaster && (
              <button
                onClick={() => setMostrarAdmin(true)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, color: COR.destaque, padding: 0 }}
              >
                Administração
              </button>
            )}
            {ehMaster && (
              <button
                onClick={() => setMostrarChamadas(true)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, color: COR.destaque, padding: 0 }}
              >
                Chamadas
              </button>
            )}
            {ehMaster && (
              <button
                onClick={() => setMostrarConfigIA(true)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, color: COR.destaque, padding: 0 }}
              >
                IA SDR
              </button>
            )}
            {ehMaster && (
              <button
                onClick={() => setMostrarBaseConhecimento(true)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, color: COR.destaque, padding: 0 }}
              >
                Base de conhecimento
              </button>
            )}
            <button
              onClick={sair}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, color: COR.perigo, padding: 0 }}
            >
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* ---------------- PAINEL PRINCIPAL ---------------- */}
      <div
        style={{
          flex: 1,
          display: ehMobile && !selecionadoId ? "none" : "flex",
          flexDirection: "column",
          background: COR.painel,
          width: ehMobile ? "100%" : "auto",
          minWidth: 0,
        }}
      >
        {/* Foto do contato / cabeçalho */}
        <div style={{ background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, padding: ehMobile ? "12px 14px" : "14px 20px", borderBottom: `1px solid ${COR.linha}`, flexWrap: "wrap" }}>
          {selecionado ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: ehMobile ? 8 : 14, minWidth: 0 }}>
                {ehMobile && (
                  <button
                    onClick={() => setSelecionadoId(null)}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", flexShrink: 0 }}
                    aria-label="Voltar para a lista de contatos"
                  >
                    <ChevronLeft size={22} color={COR.texto} />
                  </button>
                )}
                <Avatar nome={selecionado.nome} size={ehMobile ? 38 : 44} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: ehMobile ? 15 : 17, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {selecionado.nome}
                  </div>
                  <div style={{ fontSize: 12, color: COR.textoSuave, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {selecionado.telefone} · {selecionado.estagio}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, flexWrap: "wrap" }}>
                <button
                  onClick={() => alternarIaSdr(selecionado.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    border: `1px solid ${iaSdrPorContato[selecionado.id] ? COR.destaque : COR.linha}`,
                    background: iaSdrPorContato[selecionado.id] ? COR.destaque : "#fff",
                    color: iaSdrPorContato[selecionado.id] ? "#fff" : COR.texto,
                    padding: "8px 12px",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Bot size={14} /> {ehMobile ? "IA SDR" : `IA SDR ${iaSdrPorContato[selecionado.id] ? "ativa" : "inativa"}`}
                </button>
                <button
                  onClick={iniciarChamada}
                  disabled={!!chamadaAtiva}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    border: `1px solid ${COR.linha}`,
                    background: "#fff",
                    color: COR.texto,
                    padding: "8px 12px",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: chamadaAtiva ? "not-allowed" : "pointer",
                    opacity: chamadaAtiva ? 0.5 : 1,
                    whiteSpace: "nowrap",
                  }}
                >
                  <Phone size={14} /> Ligar
                </button>
              </div>
            </>
          ) : (
            <div style={{ color: COR.textoSuave }}>Selecione um contato</div>
          )}
        </div>

        {/* Faixa de chamada em andamento */}
        {chamadaAtiva && (
          <div
            style={{
              background: COR.texto,
              color: "#fff",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 20px",
            }}
          >
            <span style={{ fontSize: 13 }}>
              Em chamada com {chamadaAtiva.contatoNome} · {formatarDuracao(duracaoChamada)} · gravando
            </span>
            <button
              onClick={encerrarChamada}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: COR.perigo,
                color: "#fff",
                border: "none",
                padding: "6px 14px",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <PhoneOff size={14} /> Encerrar
            </button>
          </div>
        )}

        {erroMedia && (
          <div style={{ background: "#fff3f2", color: COR.perigo, fontSize: 12, padding: "8px 20px" }}>
            {erroMedia}
          </div>
        )}

        {erroIA && (
          <div style={{ background: "#fff3f2", color: COR.perigo, fontSize: 12, padding: "8px 20px" }}>
            {erroIA}
          </div>
        )}

        {/* Área de mensagens */}
        <div style={{ flex: 1, padding: 20, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
          {threadSelecionado.length === 0 && (
            <div style={{ color: COR.textoSuave, fontSize: 13 }}>
              Nenhuma mensagem enviada a este contato ainda.
            </div>
          )}
          {threadSelecionado.map((m) => {
            if (m.tipo === "audio") {
              return (
                <div key={m.id} style={{ background: "#fff", display: "inline-flex", flexDirection: "column", gap: 4, padding: "10px 14px", maxWidth: "70%" }}>
                  <audio controls src={m.audioUrl} style={{ width: 240 }} />
                  {m.hora && <span style={{ fontSize: 10, color: COR.textoSuave }}>{m.hora}</span>}
                </div>
              );
            }
            if (m.tipo === "arquivo") {
              return (
                <a
                  key={m.id}
                  href={m.url}
                  download={m.nome}
                  style={{
                    background: "#fff",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 14px",
                    maxWidth: "70%",
                    textDecoration: "none",
                    color: COR.texto,
                  }}
                >
                  <FileIcon size={20} color={COR.textoSuave} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {m.nome}
                    </div>
                    <div style={{ fontSize: 11, color: COR.textoSuave }}>{m.tamanho}</div>
                  </div>
                </a>
              );
            }
            if (m.tipo === "chamada") {
              return (
                <div
                  key={m.id}
                  style={{
                    alignSelf: "flex-start",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: COR.painelEscuro,
                    padding: "8px 14px",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  <Phone size={13} /> Chamada de áudio · {formatarDuracao(m.duracao)}
                </div>
              );
            }
            const doLead = m.origem === "lead";
            const daIa = m.origem === "ia";
            return (
              <div
                key={m.id}
                style={{
                  alignSelf: doLead ? "flex-start" : "flex-end",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: doLead ? "flex-start" : "flex-end",
                  maxWidth: "70%",
                }}
              >
                {daIa && (
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, color: COR.destaque, marginBottom: 2 }}>
                    <Bot size={11} /> IA SDR
                  </div>
                )}
                <div
                  style={{
                    background: doLead ? "#e9ebef" : daIa ? "#eaf1ff" : "#fff",
                    padding: "10px 14px",
                    fontSize: 14,
                  }}
                >
                  {m.texto}
                  {m.hora && (
                    <div style={{ fontSize: 10, color: COR.textoSuave, marginTop: 4 }}>{m.hora}</div>
                  )}
                </div>
              </div>
            );
          })}
          {selecionado && carregandoIaIds.includes(selecionado.id) && (
            <div style={{ alignSelf: "flex-end", display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: COR.textoSuave }}>
              <Bot size={12} /> IA SDR digitando...
            </div>
          )}
        </div>

        {/* Simulação de mensagem recebida — uso apenas para testar o fluxo do SDR de IA,
            já que este protótipo não recebe mensagens reais do WhatsApp (sem webhook/backend). */}
        {selecionado && (
          <div
            style={{
              background: "#fbf8ee",
              borderTop: `1px solid ${COR.linha}`,
              padding: "10px 14px",
              display: "flex",
              flexDirection: ehMobile ? "column" : "row",
              alignItems: ehMobile ? "stretch" : "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 10, fontWeight: 700, color: COR.textoSuave, textTransform: "uppercase", flexShrink: 0 }}>
              Simular msg. do lead (teste)
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={mensagemSimulada}
                onChange={(e) => setMensagemSimulada(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && enviarMensagemSimulada()}
                placeholder="Digite como se fosse o lead respondendo..."
                style={{ flex: 1, border: `1px solid ${COR.linha}`, padding: "8px 12px", fontSize: 13, outline: "none", fontFamily: "inherit", background: "#fff", minWidth: 0 }}
              />
              <button onClick={enviarMensagemSimulada} style={{ ...btnSecundario, flex: "none", padding: "8px 12px" }}>
                Simular envio
              </button>
            </div>
          </div>
        )}

        {/* Campo para escrever mensagem + anexos + áudio + botão de enviar */}
        <div style={{ background: "#fff", display: "flex", alignItems: "center", gap: 8, padding: ehMobile ? "10px 12px" : 14, borderTop: `1px solid ${COR.linha}` }}>
          <input
            ref={arquivoRef}
            type="file"
            style={{ display: "none" }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) enviarArquivo(f);
              e.target.value = "";
            }}
          />
          <button
            onClick={() => arquivoRef.current?.click()}
            disabled={!selecionado}
            style={btnIconeComposer}
            aria-label="Anexar arquivo"
          >
            <Paperclip size={18} color={COR.textoSuave} />
          </button>
          <button
            onClick={gravandoNota ? pararGravacaoNota : iniciarGravacaoNota}
            disabled={!selecionado}
            style={{ ...btnIconeComposer, background: gravandoNota ? COR.perigo : "transparent", borderColor: gravandoNota ? COR.perigo : COR.linha }}
            aria-label={gravandoNota ? "Parar gravação" : "Gravar áudio"}
          >
            <Mic size={18} color={gravandoNota ? "#fff" : COR.textoSuave} />
          </button>
          {gravandoNota && (
            <span style={{ fontSize: 12, color: COR.perigo, fontWeight: 700, minWidth: 34 }}>
              {formatarDuracao(duracaoNota)}
            </span>
          )}
          <input
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && enviarMensagem()}
            placeholder="Escreva uma mensagem..."
            style={{
              flex: 1,
              minWidth: 0,
              border: `1px solid ${COR.linha}`,
              padding: "10px 14px",
              fontSize: 14,
              outline: "none",
              fontFamily: "inherit",
            }}
          />
          <button onClick={enviarMensagem} style={btnEnviar} aria-label="Enviar">
            <Send size={18} color="#fff" />
          </button>
        </div>
      </div>

      {/* ---------------- MODAL: IMPORTAR CONTATOS ---------------- */}
      {mostrarImport && (
        <Modal onClose={() => setMostrarImport(false)} titulo="Adicionar contatos em massa">
          <p style={{ fontSize: 12, color: COR.textoSuave, marginBottom: 10 }}>
            Cole uma linha por contato, no formato <b>Nome, Telefone</b>. Ou envie um CSV.
          </p>
          <textarea
            value={textoImport}
            onChange={(e) => setTextoImport(e.target.value)}
            placeholder={"Maria Silva, +55 11 99999-0001\nJoão Pedro, +55 11 99999-0002"}
            style={{
              width: "100%",
              height: 160,
              border: `1px solid ${COR.linha}`,
              padding: 10,
              fontSize: 13,
              fontFamily: "monospace",
              resize: "vertical",
              boxSizing: "border-box",
            }}
          />
          <input
            ref={fileRef}
            type="file"
            accept=".csv,.txt"
            style={{ marginTop: 10, fontSize: 12 }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = (ev) => setTextoImport((prev) => (prev ? prev + "\n" : "") + String(ev.target.result));
              reader.readAsText(file);
            }}
          />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
            <button onClick={() => setMostrarImport(false)} style={btnSecundario}>
              Cancelar
            </button>
            <button onClick={importarContatos} style={btnPrimario}>
              <Plus size={14} /> Importar
            </button>
          </div>
        </Modal>
      )}

      {/* ---------------- MODAL: DISPARO EM MASSA ---------------- */}
      {mostrarDisparo && (
        <Modal onClose={() => (enviando ? null : setMostrarDisparo(false))} titulo="Disparo automático">
          <div
            style={{
              background: "#fff3f2",
              border: `1px solid ${COR.perigo}`,
              padding: 10,
              fontSize: 12,
              color: COR.perigo,
              marginBottom: 12,
              lineHeight: 1.4,
            }}
          >
            Este protótipo simula o envio. Disparos reais em volume alto para contatos frios
            violam as políticas do WhatsApp e podem banir o número. Use a API oficial do
            WhatsApp Business com opt-in e limites de qualidade.
          </div>

          <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>
            Enviar para
          </label>
          <select
            value={estagioDisparo}
            onChange={(e) => setEstagioDisparo(e.target.value)}
            style={{ width: "100%", border: `1px solid ${COR.linha}`, padding: 8, fontSize: 13, marginBottom: 12 }}
          >
            <option value="Todos">Todos os contatos ({contatos.length})</option>
            {ESTAGIOS.map((e) => (
              <option key={e} value={e}>
                {e} ({contagemPorEstagio[e] || 0})
              </option>
            ))}
          </select>

          <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>
            Mensagem
          </label>
          <textarea
            value={msgDisparo}
            onChange={(e) => setMsgDisparo(e.target.value)}
            placeholder="Olá {nome}, tudo bem?"
            style={{
              width: "100%",
              height: 90,
              border: `1px solid ${COR.linha}`,
              padding: 10,
              fontSize: 13,
              boxSizing: "border-box",
              resize: "vertical",
            }}
          />

          {enviando && (
            <div style={{ marginTop: 14 }}>
              <div style={{ background: COR.painel, height: 8, width: "100%" }}>
                <div style={{ background: COR.destaque, height: 8, width: `${progresso}%`, transition: "width 0.1s" }} />
              </div>
              <div style={{ fontSize: 12, color: COR.textoSuave, marginTop: 6 }}>
                Enviando... {progresso}%
              </div>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
            <button onClick={() => setMostrarDisparo(false)} disabled={enviando} style={btnSecundario}>
              Cancelar
            </button>
            <button onClick={dispararMensagens} disabled={enviando} style={btnPrimario}>
              <Zap size={14} /> {enviando ? "Enviando..." : "Disparar"}
            </button>
          </div>
        </Modal>
      )}
      {/* ---------------- MODAL: CONFIRMAR EXCLUSÃO ---------------- */}
      {confirmarExclusao && ehMaster && (
        <Modal onClose={() => setConfirmarExclusao(null)} titulo="Confirmar exclusão">
          <p style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 18 }}>
            {confirmarExclusao.tipo === "um"
              ? `Excluir o contato "${confirmarExclusao.nome}"? Esta ação não pode ser desfeita.`
              : `Excluir ${confirmarExclusao.ids.length} contato(s) selecionado(s)? Esta ação não pode ser desfeita.`}
          </p>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button onClick={() => setConfirmarExclusao(null)} style={btnSecundario}>
              Cancelar
            </button>
            <button
              onClick={() => excluirContatos(confirmarExclusao.ids)}
              style={{ ...btnPrimario, background: COR.perigo }}
            >
              <Trash2 size={14} /> Excluir
            </button>
          </div>
        </Modal>
      )}

      {/* ---------------- MODAL: ADMINISTRAÇÃO DE COLABORADORES ---------------- */}
      {mostrarAdmin && ehMaster && (
        <Modal
          onClose={() => {
            setMostrarAdmin(false);
            limparFormColab();
          }}
          titulo="Administração · Colaboradores"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 18, maxHeight: 180, overflowY: "auto" }}>
            {colaboradores.length === 0 && (
              <div style={{ fontSize: 12, color: COR.textoSuave }}>Nenhum colaborador cadastrado.</div>
            )}
            {colaboradores.map((c) => (
              <div
                key={c.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: COR.painel,
                  padding: "8px 10px",
                  gap: 10,
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{c.nome}</div>
                  <div style={{ fontSize: 11, color: COR.textoSuave }}>
                    {c.email} · {c.etapas.length > 0 ? c.etapas.join(", ") : "sem etapas atribuídas"}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
                  <button
                    onClick={() => editarColaborador(c)}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, color: COR.destaque, padding: 0 }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => excluirColaborador(c.id)}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, color: COR.perigo, padding: 0 }}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: `1px solid ${COR.linha}`, paddingTop: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10 }}>
              {formColabId ? "Editar colaborador" : "Novo colaborador"}
            </div>

            <label style={rotuloForm}>Nome</label>
            <input value={formNome} onChange={(e) => setFormNome(e.target.value)} style={inputForm} />

            <label style={rotuloForm}>E-mail de acesso</label>
            <input value={formEmail} onChange={(e) => setFormEmail(e.target.value)} style={inputForm} />

            <label style={rotuloForm}>Senha</label>
            <input
              value={formSenha}
              onChange={(e) => setFormSenha(e.target.value)}
              placeholder="Defina ou altere a senha"
              style={inputForm}
            />

            <label style={rotuloForm}>Etapas do funil atribuídas</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
              {ESTAGIOS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => alternarEtapaForm(e)}
                  style={{
                    border: `1px solid ${COR.linha}`,
                    background: formEtapas.includes(e) ? COR.texto : "#fff",
                    color: formEtapas.includes(e) ? "#fff" : COR.texto,
                    padding: "4px 10px",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {e}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              {formColabId && (
                <button onClick={limparFormColab} style={btnSecundario}>
                  Cancelar edição
                </button>
              )}
              <button onClick={salvarColaborador} style={btnPrimario}>
                <Check size={14} /> {formColabId ? "Salvar alterações" : "Criar colaborador"}
              </button>
            </div>
          </div>
        </Modal>
      )}
      {/* ---------------- MODAL: CHAMADAS GRAVADAS (apenas master) ---------------- */}
      {mostrarChamadas && ehMaster && (
        <Modal onClose={() => setMostrarChamadas(false)} titulo="Chamadas de áudio gravadas">
          <div
            style={{
              background: "#fff3f2",
              border: `1px solid ${COR.perigo}`,
              padding: 10,
              fontSize: 11,
              color: COR.perigo,
              marginBottom: 14,
              lineHeight: 1.4,
            }}
          >
            Gravação de chamadas envolve requisitos legais (ex.: LGPD). Informe colaboradores e
            contatos de que a ligação é gravada antes de usar este recurso em produção.
          </div>

          {chamadas.length === 0 && (
            <div style={{ fontSize: 12, color: COR.textoSuave }}>Nenhuma chamada registrada ainda.</div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 420, overflowY: "auto" }}>
            {chamadas.map((ch) => (
              <div key={ch.id} style={{ background: COR.painel, padding: "10px 12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: 12, fontWeight: 700, marginBottom: 2 }}>
                  <span>
                    {ch.colaboradorNome} → {ch.contatoNome}
                  </span>
                  <span style={{ color: COR.textoSuave, fontWeight: 600 }}>{formatarDuracao(ch.duracao)}</span>
                </div>
                <div style={{ fontSize: 11, color: COR.textoSuave, marginBottom: 8 }}>
                  {new Date(ch.dataHora).toLocaleString("pt-BR")}
                </div>
                <audio controls src={ch.audioUrl} style={{ width: "100%" }} />
              </div>
            ))}
          </div>
        </Modal>
      )}

      {/* ---------------- MODAL: CONFIGURAÇÕES DE IA SDR (apenas master) ---------------- */}
      {mostrarConfigIA && ehMaster && (
        <Modal onClose={() => setMostrarConfigIA(false)} titulo="Configurações de IA SDR">
          <div
            style={{
              background: "#fff3f2",
              border: `1px solid ${COR.perigo}`,
              padding: 10,
              fontSize: 11,
              color: COR.perigo,
              marginBottom: 16,
              lineHeight: 1.4,
            }}
          >
            Este protótipo chama a OpenAI diretamente do navegador, então sua chave fica
            visível a quem inspecionar o código-fonte da página. Para uso em produção com
            outras pessoas, essa chamada precisa passar por um backend seu, que guarda a
            chave em sigilo e nunca a envia ao navegador.
          </div>

          <label style={rotuloForm}>Chave da API da OpenAI</label>
          <input
            type="password"
            value={configIA.apiKey}
            onChange={(e) => setConfigIA((prev) => ({ ...prev, apiKey: e.target.value }))}
            placeholder="sk-..."
            style={inputForm}
          />

          <label style={rotuloForm}>Modelo</label>
          <input
            value={configIA.modelo}
            onChange={(e) => setConfigIA((prev) => ({ ...prev, modelo: e.target.value }))}
            placeholder="gpt-4o-mini"
            style={inputForm}
          />

          <label style={rotuloForm}>Prompt do SDR</label>
          <textarea
            value={configIA.promptSistema}
            onChange={(e) => setConfigIA((prev) => ({ ...prev, promptSistema: e.target.value }))}
            rows={8}
            style={{ ...inputForm, resize: "vertical", fontFamily: "inherit" }}
          />

          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, marginBottom: 16, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={configIA.moverAutomaticamente}
              onChange={(e) => setConfigIA((prev) => ({ ...prev, moverAutomaticamente: e.target.checked }))}
            />
            Mover automaticamente para "Interessado" quando a IA qualificar o lead
          </label>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={() => setMostrarConfigIA(false)} style={btnPrimario}>
              <Check size={14} /> Salvar
            </button>
          </div>
        </Modal>
      )}

      {/* ---------------- MODAL: BASE DE CONHECIMENTO (apenas master) ---------------- */}
      {mostrarBaseConhecimento && ehMaster && (
        <Modal
          onClose={() => {
            setMostrarBaseConhecimento(false);
            limparFormArtigo();
          }}
          titulo="Base de conhecimento"
        >
          {!formularioArtigoAberto ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <span style={{ fontSize: 12, color: COR.textoSuave }}>
                  Produtos e informações que a IA usa para atender os clientes.
                </span>
                <button
                  onClick={novoArtigo}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 32,
                    height: 32,
                    flexShrink: 0,
                    background: COR.texto,
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                  }}
                  aria-label="Adicionar informação"
                  title="Adicionar informação"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 420, overflowY: "auto" }}>
                {baseConhecimento.length === 0 && (
                  <div style={{ fontSize: 12, color: COR.textoSuave }}>
                    Nenhuma informação cadastrada ainda. Clique no + para adicionar o primeiro produto.
                  </div>
                )}
                {baseConhecimento.map((a) => (
                  <div
                    key={a.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: COR.painel,
                      padding: "10px 12px",
                      gap: 10,
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{a.nome || "(sem nome)"}</div>
                      <div style={{ fontSize: 11, color: COR.textoSuave }}>
                        {[a.material, a.preco && `à vista: ${a.preco}`, a.precoAtacado && `atacado: ${a.precoAtacado}`]
                          .filter(Boolean)
                          .join(" · ") || "Sem detalhes preenchidos"}
                      </div>
                    </div>
                    <button
                      onClick={() => editarArtigo(a)}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 4, flexShrink: 0, display: "flex" }}
                      aria-label={`Editar ${a.nome}`}
                      title="Editar"
                    >
                      <Pencil size={15} color={COR.destaque} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 12 }}>
                {formArtigoId ? "Editar informação" : "Nova informação"}
              </div>

              <label style={rotuloForm}>Nome</label>
              <input value={formArtigoNome} onChange={(e) => setFormArtigoNome(e.target.value)} style={inputForm} placeholder="Ex.: Camiseta personalizada" />

              <label style={rotuloForm}>Descrição</label>
              <textarea
                value={formArtigoDescricao}
                onChange={(e) => setFormArtigoDescricao(e.target.value)}
                rows={3}
                style={{ ...inputForm, resize: "vertical", fontFamily: "inherit" }}
                placeholder="Ex.: Estampa do peito 10x10cm, costas 30x30cm. Tamanhos P, M, G, GG."
              />

              <label style={rotuloForm}>Material</label>
              <input value={formArtigoMaterial} onChange={(e) => setFormArtigoMaterial(e.target.value)} style={inputForm} placeholder="Ex.: Algodão" />

              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <label style={rotuloForm}>Preço</label>
                  <input value={formArtigoPreco} onChange={(e) => setFormArtigoPreco(e.target.value)} style={inputForm} placeholder="Ex.: R$ 45,00" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={rotuloForm}>Preço atacado</label>
                  <input value={formArtigoPrecoAtacado} onChange={(e) => setFormArtigoPrecoAtacado(e.target.value)} style={inputForm} placeholder="Ex.: R$ 32,00" />
                </div>
              </div>

              <label style={rotuloForm}>Quantidade mínima de compra</label>
              <input
                value={formArtigoQtdMinima}
                onChange={(e) => setFormArtigoQtdMinima(e.target.value)}
                style={inputForm}
                placeholder="Ex.: 10 unidades"
              />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                {formArtigoId ? (
                  <button
                    onClick={() => excluirArtigo(formArtigoId)}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, color: COR.perigo, padding: 0 }}
                  >
                    Excluir
                  </button>
                ) : (
                  <span />
                )}
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={limparFormArtigo} style={btnSecundario}>
                    Cancelar
                  </button>
                  <button onClick={salvarArtigo} style={btnPrimario}>
                    <Check size={14} /> Salvar
                  </button>
                </div>
              </div>
            </div>
          )}
        </Modal>
      )}
      </div>
    </div>
  );
}

function Modal({ onClose, titulo, children }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(20,24,31,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          width: 440,
          maxWidth: "92vw",
          maxHeight: "88vh",
          overflowY: "auto",
          padding: 20,
          border: `1px solid ${COR.linha}`,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>{titulo}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

const rotuloForm = {
  fontSize: 12,
  fontWeight: 600,
  display: "block",
  marginBottom: 6,
};

const inputForm = {
  width: "100%",
  border: "1px solid #9aa5b5",
  padding: 10,
  fontSize: 14,
  marginBottom: 14,
  boxSizing: "border-box",
  fontFamily: "inherit",
};

const btnPrimario = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  background: COR.texto,
  color: "#fff",
  border: "none",
  padding: "9px 12px",
  fontSize: 12,
  fontWeight: 700,
  cursor: "pointer",
};

const btnSecundario = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  background: "#fff",
  color: COR.texto,
  border: `1px solid ${COR.linha}`,
  padding: "9px 12px",
  fontSize: 12,
  fontWeight: 700,
  cursor: "pointer",
};

function linhaEstagio(ativo) {
  return {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    background: ativo ? COR.texto : "transparent",
    color: ativo ? "#fff" : COR.texto,
    border: "none",
    borderBottom: `1px solid ${ativo ? COR.texto : COR.linha}`,
    padding: "9px 12px",
    fontSize: 13,
    fontWeight: ativo ? 700 : 500,
    cursor: "pointer",
    textAlign: "left",
    fontFamily: "inherit",
  };
}

const btnIconeComposer = {
  width: 40,
  height: 40,
  border: "1px solid #9aa5b5",
  background: "transparent",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  flexShrink: 0,
};

const btnEnviar = {
  width: 40,
  height: 40,
  background: COR.destaque,
  border: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  flexShrink: 0,
};
