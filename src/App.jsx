import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import ModalDenuncia from "./components/ModalDenuncia";
import Feed from "./pages/Feed";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";

const DADOS_INICIAIS = [
  {
    id: 1,
    titulo: "Esgoto a céu aberto na calçada",
    categoria: "Vazamento de Esgoto",
    bairro: "Várzea",
    endereco: "Rua Acadêmico Hélio Ramos",
    descricao: "Vazamento contínuo há mais de 4 dias gerando forte odor próximo ao ponto de ônibus.",
    fotoUrl: "https://images.unsplash.com/photo-1542385151-efd9000785a0?w=600&auto=format&fit=crop&q=60",
    status: "Pendente",
    apoios: 12,
    autor: "Carlos Silva",
  },
  {
    id: 2,
    titulo: "Tubulação rompida jorrando água limpa",
    categoria: "Falta de Água",
    bairro: "Boa Viagem",
    endereco: "Av. Conselheiro Aguiar, 1400",
    descricao: "Cano quebrado desperdiçando grande quantidade de água tratada na pista.",
    fotoUrl: "https://images.unsplash.com/photo-1584463699042-494bcf9db7f0?w=600&auto=format&fit=crop&q=60",
    status: "Em Análise",
    apoios: 27,
    autor: "Mariana Souza",
  },
];

export default function App() {
  const [usuario, setUsuario] = useState(() => {
    return JSON.parse(localStorage.getItem("sanea_session") || "null");
  });
  const [telaAuth, setTelaAuth] = useState("login"); // 'login' ou 'cadastro'
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
          onApoiar={handleApoiar}
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