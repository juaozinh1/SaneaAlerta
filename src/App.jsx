import { useState, useEffect } from "react";
import Navbar from "./components/Navbar.jsx";
import ModalDenuncia from "./components/ModalDenuncia.jsx";
import Feed from "./pages/Feed.jsx";
import Login from "./pages/Login.jsx";
import Cadastro from "./pages/Cadastro.jsx";

const DADOS_INICIAIS = [
  {
    id: 1,
    titulo: "Esgoto a céu aberto na calçada",
    categoria: "Vazamento de Esgoto",
    bairro: "Várzea",
    endereco: "Rua Acadêmico Hélio Ramos, 120 — Várzea, Recife",
    descricao: "Vazamento contínuo há mais de 4 dias gerando forte odor próximo ao ponto de ônibus.",
    fotoUrl: "https://images.unsplash.com/photo-1542385151-efd9000785a0?w=600&auto=format&fit=crop&q=60",
    status: "Pendente",
    apoios: 12,
    autor: "Carlos Silva",
    lat: -8.0539,
    lng: -34.9542,
  },
  {
    id: 2,
    titulo: "Tubulação rompida jorrando água limpa",
    categoria: "Falta de Água",
    bairro: "Boa Viagem",
    endereco: "Av. Conselheiro Aguiar, 1400 — Boa Viagem, Recife",
    descricao: "Cano quebrado desperdiçando grande quantidade de água tratada na pista.",
    fotoUrl: "https://images.unsplash.com/photo-1584463699042-494bcf9db7f0?w=600&auto=format&fit=crop&q=60",
    status: "Em Análise",
    apoios: 27,
    autor: "Mariana Souza",
    lat: -8.1158,
    lng: -34.8988,
  },
];

export default function App() {
  const [usuario, setUsuario] = useState(() => {
    return JSON.parse(localStorage.getItem("sanea_session") || "null");
  });
  const [telaAuth, setTelaAuth] = useState("login");
  const [modalAberto, setModalAberto] = useState(false);

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
    setDenuncias([nova, ...denuncias]);
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

  return (
    <div>
      <Navbar
        usuario={usuario}
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