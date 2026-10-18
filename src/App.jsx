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
    bairro: "Várzea (Área Urbana)",
    endereco: "Rua Acadêmico Hélio Ramos, 120 — Várzea, Recife",
    descricao: "Vazamento contínuo com contaminação da via pública.",
    fotoUrl: "https://cdn.folhape.com.br/img/c/1200/900/dn_arquivo/2018/08/sss.jpg",
    status: "Pendente",
    apoios: 12,
    autor: "Carlos Silva",
    lat: -8.0539,
    lng: -34.9542,
  },
  {
    id: 2,
    numeroSei: "23067.001043/2026-15",
    titulo: "Rampa de cadeirante quebrada e sem guia",
    categoria: "Calçada Intransitável / Rampa Avariada",
    bairro: "Boa Viagem (Área Urbana)",
    endereco: "Av. Conselheiro Aguiar, 1400 — Boa Viagem, Recife",
    descricao: "Cadeirantes e idosos impedidos de atravessar por desnível severo e entulho.",
    fotoUrl: "https://oxerecife.com.br/wp-content/uploads/2025/10/outubro25MPPE-acessibiidade-anita.jpg",
    status: "Em Análise",
    apoios: 27,
    autor: "Mariana Souza",
    lat: -8.1158,
    lng: -34.8988,
  },
  {
    id: 3,
    numeroSei: "23067.001044/2026-62",
    titulo: "Atoleiro e erosão em estrada vicinal",
    categoria: "Conservação de Estrada Vicinal / Rural",
    bairro: "Zona Rural / Chácaras",
    endereco: "Estrada do Engenho Velho, km 4 — Área Rural",
    descricao: "Erosão impedindo passagem de ônibus escolar e escoamento de produtores locais.",
    fotoUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=60",
    status: "Em Execução",
    apoios: 34,
    autor: "Severino Ramos",
    lat: -8.0210,
    lng: -34.9920,
  },
  {
    id: 4,
    numeroSei: "23067.001045/2026-90",
    titulo: "Poste sem iluminação há 3 semanas",
    categoria: "Iluminação Pública (Lâmpada Apagada)",
    bairro: "Cordeiro",
    endereco: "Rua Gomes Taborda, próx. ao nº 350",
    descricao: "Trecho completamente às escuras gerando insegurança aos pedestres.",
    fotoUrl: "https://f.i.uol.com.br/fotografia/2019/05/12/15577041345cd8adc612c28_1557704134_3x2_md.jpg",
    status: "Pendente",
    apoios: 15,
    autor: "Aline Castro",
    lat: -8.0612,
    lng: -34.9215,
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