import { useState } from "react";

export default function Cadastro({ onCadastroSuccess, onIrParaLogin }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [bairro, setBairro] = useState("");
  const [senha, setSenha] = useState("");

  const handleCadastro = (e) => {
    e.preventDefault();
    const cadastros = JSON.parse(localStorage.getItem("sanea_usuarios") || "[]");

    if (cadastros.some((u) => u.email === email)) {
      alert("Este e-mail já está em uso.");
      return;
    }

    const novoUsuario = { id: Date.now(), nome, email, bairro, senha };
    cadastros.push(novoUsuario);
    localStorage.setItem("sanea_usuarios", JSON.stringify(cadastros));

    onCadastroSuccess(novoUsuario);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Criar Nova Conta</h2>
        <form onSubmit={handleCadastro}>
          <div className="input-group">
            <label>Nome Completo</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Bairro Padrão</label>
            <input
              type="text"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "0.5rem" }}>
            Cadastrar
          </button>
        </form>
        <p style={{ marginTop: "1rem", textAlign: "center", fontSize: "0.9rem" }}>
          Já possui conta?{" "}
          <button
            onClick={onIrParaLogin}
            style={{ background: "none", border: "none", color: "var(--primary)", cursor: "pointer", fontWeight: 600 }}
          >
            Fazer login
          </button>
        </p>
      </div>
    </div>
  );
}