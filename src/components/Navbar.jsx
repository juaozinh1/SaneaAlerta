export default function Navbar({ usuario, onLogout, onAbrirModal }) {
  return (
    <nav className="navbar">
      <div className="container nav-content">
        <div className="brand">
          <span>💧</span> SaneaAlerta
        </div>
        <div>
          {usuario ? (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
                Olá, <strong>{usuario.nome}</strong>
              </span>
              <button className="btn btn-primary" onClick={onAbrirModal}>
                + Denunciar
              </button>
              <button className="btn btn-secondary" onClick={onLogout}>
                Sair
              </button>
            </div>
          ) : (
            <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
              Sistema Cidadão
            </span>
          )}
        </div>
      </div>
    </nav>
  );
}