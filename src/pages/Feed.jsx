import { useState, useMemo } from "react";
import CardDenuncia from "../components/CardDenuncia.jsx";
import MapaDenuncias from "../components/MapaDenuncias.jsx";

const CHIPS_SETOR = [
  { id: "", label: "Todas as Demandas" },
  { id: "Saneamento", label: "Saneamento & Água" },
  { id: "Vias", label: "Vias & Estradas Rurais" },
  { id: "Iluminacao", label: "Iluminação" },
  { id: "Acessibilidade", label: "Acessibilidade" },
  { id: "Limpeza", label: "Limpeza Urbana" },
];

export default function Feed({
  denuncias,
  usuario,
  onApoiar,
  onExcluir,
  onAbrirModal,
}) {
  const [buscaTexto, setBuscaTexto] = useState("");
  const [setorAtivo, setSetorAtivo] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("");
  const [abaAtiva, setAbaAtiva] = useState("mural");

  const combinaSetor = (categoriaItem, setor) => {
    if (!setor) return true;
    const cat = categoriaItem.toLowerCase();
    switch (setor) {
      case "Saneamento":
        return cat.includes("esgoto") || cat.includes("água") || cat.includes("bueiro") || cat.includes("galeria");
      case "Vias":
        return cat.includes("buraco") || cat.includes("estrada") || cat.includes("asfáltica") || cat.includes("mata-burro") || cat.includes("ponte");
      case "Iluminacao":
        return cat.includes("iluminação") || cat.includes("lâmpada") || cat.includes("poste");
      case "Acessibilidade":
        return cat.includes("calçada") || cat.includes("rampa") || cat.includes("tátil");
      case "Limpeza":
        return cat.includes("lixo") || cat.includes("árvore") || cat.includes("entulho") || cat.includes("capinação");
      default:
        return true;
    }
  };

  const denunciasFiltradas = useMemo(() => {
    return denuncias.filter((item) => {
      const termo = buscaTexto.toLowerCase().trim();
      const matchTexto =
        !termo ||
        item.titulo.toLowerCase().includes(termo) ||
        item.bairro.toLowerCase().includes(termo) ||
        item.endereco.toLowerCase().includes(termo);

      const matchSetor = combinaSetor(item.categoria, setorAtivo);
      const matchStatus = !statusFiltro || item.status === statusFiltro;

      return matchTexto && matchSetor && matchStatus;
    });
  }, [denuncias, buscaTexto, setorAtivo, statusFiltro]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      
      {/* Barra de Título & Controle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-200 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-mono text-xs uppercase tracking-wider text-zinc-500 font-semibold">
              Recife & Zona Rural • Monitoramento Cívico
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl">
            Protocolos de Zeladoria Urbana e Rural
          </h1>
        </div>

        {/* Alternador Mural / Mapa */}
        <div className="inline-flex p-0.5 bg-zinc-200/70 rounded-md border border-zinc-300/80 text-xs font-medium">
          <button
            type="button"
            onClick={() => setAbaAtiva("mural")}
            className={`px-3 py-1.5 rounded transition-all ${
              abaAtiva === "mural"
                ? "bg-white text-zinc-900 font-semibold shadow-2xs"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Fichas ({denunciasFiltradas.length})
          </button>
          <button
            type="button"
            onClick={() => setAbaAtiva("mapa")}
            className={`px-3 py-1.5 rounded transition-all ${
              abaAtiva === "mapa"
                ? "bg-white text-zinc-900 font-semibold shadow-2xs"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Cartografia Leaflet
          </button>
        </div>
      </div>

      {/* Painel de Filtro Integrado (Barra Única) */}
      <div className="bg-white rounded-lg border border-zinc-200/90 p-3 mb-6 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Buscar por logradouro, comunidade, bairro ou palavra-chave..."
              value={buscaTexto}
              onChange={(e) => setBuscaTexto(e.target.value)}
              className="w-full h-9 pl-3 pr-8 text-xs bg-zinc-50 border border-zinc-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 placeholder:text-zinc-400 text-zinc-900"
            />
            {buscaTexto && (
              <button
                type="button"
                onClick={() => setBuscaTexto("")}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-zinc-400 hover:text-zinc-700 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          <select
            value={statusFiltro}
            onChange={(e) => setStatusFiltro(e.target.value)}
            className="h-9 px-2.5 text-xs bg-zinc-50 border border-zinc-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900 text-zinc-800 font-medium cursor-pointer"
          >
            <option value="">Todos os status</option>
            <option value="Pendente">Pendente</option>
            <option value="Em Análise">Em Análise</option>
            <option value="Em Execução">Em Execução</option>
            <option value="Resolvido">Resolvido</option>
          </select>
        </div>

        {/* Chips de Categorias Compactos */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          {CHIPS_SETOR.map((item) => {
            const ativo = setorAtivo === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSetorAtivo(ativo ? "" : item.id)}
                className={`h-7 px-2.5 text-xs font-medium rounded border whitespace-nowrap transition-colors ${
                  ativo
                    ? "bg-zinc-900 text-white border-zinc-900"
                    : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Principal */}
      {abaAtiva === "mapa" ? (
        <section className="bg-white p-2 rounded-lg border border-zinc-200 shadow-2xs">
          <MapaDenuncias denuncias={denunciasFiltradas} />
        </section>
      ) : denunciasFiltradas.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-lg border border-dashed border-zinc-300">
          <p className="text-xs font-mono uppercase tracking-wider text-zinc-400">0 Resultados</p>
          <h3 className="text-sm font-semibold text-zinc-800 mt-1">Nenhuma ocorrência encontrada</h3>
          <p className="text-xs text-zinc-500 mt-1">Ajuste os filtros de busca ou abra uma nova demanda.</p>
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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