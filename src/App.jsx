import { useState, useEffect } from "react";
import Navbar from "./components/Navbar.jsx";
import ModalDenuncia from "./components/ModalDenuncia.jsx";
import Feed from "./pages/Feed.jsx";
import PainelGestor from "./pages/PainelGestor.jsx";
import Login from "./pages/Login.jsx";
import Cadastro from "./pages/Cadastro.jsx";

const DADOS_INICIAIS = [
  {
    id: 1,
    numeroSei: "23067.001042/2026-81",
    titulo: "Esgoto a céu aberto na calçada",
    categoria: "Vazamento de Esgoto",
    bairro: "Várzea",
    endereco: "Rua Acadêmico Hélio Ramos, 120 — Várzea, Recife",
    descricao: "Vazamento contínuo gerando forte odor próximo ao ponto de ônibus.",
    fotoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfv7hy4ZTXy7du00dCys9dnai7NWeo3ZKtN6rkloJb1U7dSpB7CuYwp470&s=10",
    status: "Pendente",
    apoios: 12,
    autor: "Carlos Silva",
    lat: -8.0539,
    lng: -34.9542,
  },
  {
    id: 2,
    numeroSei: "23067.001043/2026-15",
    titulo: "Tubulação rompida jorrando água limpa",
    categoria: "Falta de Água",
    bairro: "Boa Viagem",
    endereco: "Av. Conselheiro Aguiar, 1400 — Boa Viagem, Recife",
    descricao: "Cano quebrado desperdiçando grande quantidade de água tratada.",
    fotoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvAwdtcLq-GRrxTJuPhg-8ArewtGVnuB5psFRHaszGqTsfEeI_-woRm39-&s=10",
    status: "Em Análise",
    apoios: 27,
    autor: "Mariana Souza",
    lat: -8.1158,
    lng: -34.8988,
  },
  {
    id: 3,
    numeroSei: "23067.001044/2026-62",
    titulo: "Acúmulo de entulho e esgoto represado",
    categoria: "Acúmulo de Lixo",
    bairro: "Várzea",
    endereco: "Rua do Hospício, 45 — Várzea, Recife",
    descricao: "Boca de lobo entupida com lixo gerando poça de contaminação.",
    fotoUrl: "",
    status: "Em Execução",
    apoios: 8,
    autor: "Roberto Dias",
    lat: -8.0521,
    lng: -34.9511,
  },
];

export default function App() {
  const [usuario, setUsuario] = useState(() => {
    return JSON.parse(localStorage.getItem("sanea_session") || "null");
  });
  const [telaAuth, setTelaAuth] = useState("login");
  const [modalAberto, setModalAberto] = useState(false);
  const [visao, setVisao] = useState("cidadao"); // 'cidadao' ou 'gestor'

  const [denuncias, setDenuncias] = useState(() => {
    const dadosSalvos = localStorage.getItem("sanea_denuncias");
    return dadosSalvos ? JSON.parse(dadosSalvos) : DADOS_INICIAIS;
  });

  useEffect(() => {
    localStorage.setItem("sanea_denuncias", JSON.stringify(denuncias));
  }, [denuncias]);

  const handleLogin = (user) => {
    setUsuario(user);
    localStorage.setItem("sanea_session", JSON.stringify(user));
  };

  const handleLogout = () => {
    setUsuario(null);
    localStorage.removeItem("sanea_session");
  };

  const handleSalvarDenuncia = (nova) => {
    // Gera automaticamente um número de processo SEI simulado
    const numeroSeiAuto = `23067.${String(Math.floor(1000 + Math.random() * 9000))}/2026-${Math.floor(10 + Math.random() * 89)}`;
    const denunciaComSei = { ...nova, numeroSei: numeroSeiAuto };
    setDenuncias([denunciaComSei, ...denuncias]);
  };

  const handleApoiar = (id) => {
    setDenuncias((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, apoios: item.apoios + 1 } : item
      )
    );
  };

  const handleExcluirDenuncia = (id) => {
    const confirmacao = window.confirm("Deseja realmente apagar esta denúncia?");
    if (confirmacao) {
      setDenuncias((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Atualização de status e despacho pelo Gestor
  const handleAtualizarStatus = (id, novoStatus, despacho) => {
    setDenuncias((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: novoStatus, despacho: despacho }
          : item
      )
    );
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <Navbar
        usuario={usuario}
        visaoAtual={visao}
        onMudarVisao={setVisao}
        onLogout={handleLogout}
        onAbrirModal={() => setModalAberto(true)}
      />

      {!usuario ? (
        telaAuth === "login" ? (
          <Login
            onLoginSuccess={handleLogin}
            onIrParaCadastro={() => setTelaAuth("cadastro")}
          />
        ) : (
          <Cadastro
            onCadastroSuccess={handleLogin}
            onIrParaLogin={() => setTelaAuth("login")}
          />
        )
      ) : visao === "gestor" ? (
        <PainelGestor
          denuncias={denuncias}
          onAtualizarStatus={handleAtualizarStatus}
        />
      ) : (
        <Feed
          denuncias={denuncias}
          usuario={usuario}
          onApoiar={handleApoiar}
          onExcluir={handleExcluirDenuncia}
          onAbrirModal={() => setModalAberto(true)}
        />
      )}

      {modalAberto && (
        <ModalDenuncia
          usuario={usuario}
          onClose={() => setModalAberto(false)}
          onSalvar={handleSalvarDenuncia}
        />
      )}
    </div>
  );
}