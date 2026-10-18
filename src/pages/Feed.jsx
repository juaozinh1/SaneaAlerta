import { useState } from "react";
import CardDenuncia from "../components/CardDenuncia.jsx";
import MapaDenuncias from "../components/MapaDenuncias.jsx";

export default function Feed({
  denuncias,
  usuario,
  onApoiar,
  onExcluir,
  onAbrirModal,
}) {
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
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Hero / Header Cívico */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-zinc-200/80 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-sky-700 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
            Recife & Região Metropolitana
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            Painel de Ocorrências Urbanas
          </h1>
          <p className="text-sm text-zinc-500 mt-1 max-w-xl">
            Acompanhe vazamentos, esgoto a céu aberto e problemas de infraestrutura relatados pelos próprios moradores.
          </p>
        </div>

        {/* Alternância de Abas (Segmented Control) */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="inline-flex p-1 bg-zinc-200/70 rounded-lg border border-zinc-200 text-xs font-medium">
            <button
              type="button"
              onClick={() => setAbaAtiva("mural")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                abaAtiva === "mural"
                  ? "bg-white text-zinc-900 shadow-xs font-semibold"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              📋 Mural ({denunciasFiltradas.length})
            </button>
            <button
              type="button"
              onClick={() => setAbaAtiva("mapa")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                abaAtiva === "mapa"
                  ? "bg-white text-zinc-900 shadow-xs font-semibold"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              🗺️ Mapa Interativo
            </button>
          </div>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Filtrar por bairro (ex: Várzea, Boa Viagem)..."
            value={filtroBairro}
            onChange={(e) => setFiltroBairro(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 placeholder:text-zinc-400 text-zinc-800 transition-all shadow-2xs"
          />
          <svg className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          className="px-3 py-2 text-xs bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-zinc-700 font-medium cursor-pointer shadow-2xs"
        >
          <option value="">Todas as categorias</option>
          <option value="Vazamento de Esgoto">Vazamento de Esgoto</option>
          <option value="Falta de Água">Falta de Água Potável</option>
          <option value="Buraco na Via">Buraco / Pavimentação</option>
          <option value="Acúmulo de Lixo">Acúmulo de Lixo</option>
          <option value="Boca de Lobo Entupida">Boca de Lobo Entupida</option>
        </select>
      </div>

      {/* Área Principal */}
      {abaAtiva === "mapa" ? (
        <section className="bg-white p-2 rounded-xl border border-zinc-200/80 shadow-2xs">
          <MapaDenuncias denuncias={denunciasFiltradas} />
        </section>
      ) : denunciasFiltradas.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-xl border border-dashed border-zinc-200">
          <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">
            🔍
          </div>
          <h3 className="text-sm font-semibold text-zinc-800">Nenhum protocolo encontrado</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            Não há ocorrências cadastradas para os critérios de busca atuais.
          </p>
          <button
            type="button"
            onClick={onAbrirModal}
            className="mt-4 px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-md transition-all shadow-xs"
          >
            Cadastrar primeiro problema
          </button>
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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