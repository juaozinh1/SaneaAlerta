import { useState } from "react";
import CardDenuncia from "../components/CardDenuncia.jsx";
import MapaDenuncias from "../components/MapaDenuncias.jsx";

export default function Feed({ denuncias, onApoiar, onAbrirModal, onExcluir, usuario }) {
  const [filtroBairro, setFiltroBairro] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [abaAtiva, setAbaAtiva] = useState("mural"); // 'mural' ou 'mapa'

  const denunciasFiltradas = denuncias.filter((item) => {
    const combinaBairro = item.bairro
      .toLowerCase()
      .includes(filtroBairro.toLowerCase());
    const combinaCategoria =
      filtroCategoria === "" || item.categoria === filtroCategoria;
    return combinaBairro && combinaCategoria;
  });

  return (
    <main className="container">
      <div className="feed-header">
        <div>
          <h2>Mural de Ocorrências</h2>
          <p style={{ color: "var(--text-muted)" }}>
            Acompanhe e apoie as melhorias para o saneamento do seu bairro.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {/* Botão para alternar a exibição entre Cards e Mapa */}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setAbaAtiva(abaAtiva === "mural" ? "mapa" : "mural")}
          >
            {abaAtiva === "mural" ? "🗺️ Ver no Mapa" : "📋 Ver em Cards"}
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onAbrirModal}
          >
            + Nova Denúncia
          </button>
        </div>
      </div>

      {/* Controles de Filtros */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Filtrar por bairro..."
          value={filtroBairro}
          onChange={(e) => setFiltroBairro(e.target.value)}
          style={{
            padding: "0.6rem",
            borderRadius: "6px",
            border: "1px solid var(--border)",
            flex: 1,
          }}
        />
        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          style={{
            padding: "0.6rem",
            borderRadius: "6px",
            border: "1px solid var(--border)",
            minWidth: "180px",
          }}
        >
          <option value="">Todas as categorias</option>
          <option value="Vazamento de Esgoto">Vazamento de Esgoto</option>
          <option value="Falta de Água">Falta de Água</option>
          <option value="Buraco na Via">Buraco na Via</option>
          <option value="Acúmulo de Lixo">Acúmulo de Lixo</option>
          <option value="Boca de Lobo Entupida">Boca de Lobo Entupida</option>
        </select>
      </div>

      {/* Alternância entre a visualização de Mapa e Lista de Cards */}
      {abaAtiva === "mapa" ? (
        <section>
          <MapaDenuncias denuncias={denunciasFiltradas} />
        </section>
      ) : denunciasFiltradas.length === 0 ? (
        <p
          style={{
            textAlign: "center",
            color: "var(--text-muted)",
            marginTop: "2rem",
          }}
        >
          Nenhuma denúncia encontrada para esses filtros.
        </p>
      ) : (
        <section className="cards-grid">
          {denunciasFiltradas.map((d) => (
            <CardDenuncia
              key={d.id}
              denuncia={d}
              usuario={usuario}
              onApoiar={onApoiar}
              onExcluir={onExcluir} 
          />
          ))}
        </section>
      )}
    </main>
  );
}