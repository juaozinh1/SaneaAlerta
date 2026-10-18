import { useState } from "react";

export default function Login({ onLoginSuccess, onIrParaCadastro }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    const cadastros = JSON.parse(localStorage.getItem("sanea_usuarios") || "[]");
    const usuarioEncontrado = cadastros.find(
      (u) => u.email === email && u.senha === senha
    );

    if (usuarioEncontrado) {
      onLoginSuccess(usuarioEncontrado);
    } else {
      setErro("E-mail ou senha inválidos.");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Entrar no SaneaAlerta</h2>
        {erro && <p style={{ color: "var(--danger)", marginBottom: "1rem" }}>{erro}</p>}
        <form onSubmit={handleLogin}>
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
            <label>Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "0.5rem" }}>
            Entrar
          </button>
        </form>
        <p style={{ marginTop: "1rem", textAlign: "center", fontSize: "0.9rem" }}>
          Não tem conta?{" "}
          <button
            onClick={onIrParaCadastro}
            style={{ background: "none", border: "none", color: "var(--primary)", cursor: "pointer", fontWeight: 600 }}
          >
            Cadastre-se
          </button>
        </p>
      </div>
    </div>
  );
}