export default function CardDenuncia({ denuncia, onApoiar }) {
  const getBadgeClass = (status) => {
    switch (status) {
      case "Em Análise":
        return "badge-analise";
      case "Resolvido":
        return "badge-resolvido";
      default:
        return "badge-pendente";
    }
  };

  return (
    <article className="card">
      <img
        src={denuncia.fotoUrl || "https://placehold.co/600x400?text=Sem+Foto"}
        alt={denuncia.titulo}
        className="card-image"
      />
      <div className="card-body">
        <div>
          <span className={`badge ${getBadgeClass(denuncia.status)}`}>
            {denuncia.status}
          </span>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginLeft: "0.5rem" }}>
            {denuncia.categoria}
          </span>
        </div>
        <h3 style={{ margin: "0.5rem 0" }}>{denuncia.titulo}</h3>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "0.8rem" }}>
          {denuncia.descricao}
        </p>
        <p style={{ fontSize: "0.85rem", color: "var(--text-main)" }}>
          📍 <strong>{denuncia.bairro}</strong> — {denuncia.endereco}
        </p>

        <div className="card-footer">
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Registrado por: {denuncia.autor}
          </span>
          <button className="btn btn-secondary" onClick={() => onApoiar(denuncia.id)}>
            👍 Apoiar ({denuncia.apoios})
          </button>
        </div>
      </div>
    </article>
  );
}