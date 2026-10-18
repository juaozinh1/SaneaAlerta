import { useState, useEffect, useRef } from "react";

export default function PainelGestor({ denuncias, onAtualizarStatus }) {
  const [visaoMapa, setVisaoMapa] = useState("calor"); // 'calor' ou 'pinos'
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [chamadoSelecionado, setChamadoSelecionado] = useState(null);
  const [despachoTexto, setDespachoTexto] = useState("");
  const [novoStatus, setNovoStatus] = useState("Em Execução");

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);
  const heatLayerRef = useRef(null);

  // Métricas do Dashboard (KPIs)
  const total = denuncias.length;
  const pendentes = denuncias.filter((d) => d.status === "Pendente").length;
  const emAndamento = denuncias.filter((d) => d.status === "Em Análise" || d.status === "Em Execução").length;
  const resolvidos = denuncias.filter((d) => d.status === "Resolvido").length;
  const taxaResolucao = total > 0 ? Math.round((resolvidos / total) * 100) : 0;

  // Encontrar o bairro mais demandado
  const contagemBairros = denuncias.reduce((acc, d) => {
    acc[d.bairro] = (acc[d.bairro] || 0) + 1;
    return acc;
  }, {});
  const bairroCritico = Object.keys(contagemBairros).reduce(
    (a, b) => (contagemBairros[a] > contagemBairros[b] ? a : b),
    "Nenhum"
  );

  // Inicializa o Mapa
  useEffect(() => {
    const L = window.L;
    if (!L || !mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const mapa = L.map(mapContainerRef.current).setView([-8.05, -34.9], 12);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
      }).addTo(mapa);

      mapInstanceRef.current = mapa;
      markersGroupRef.current = L.layerGroup().addTo(mapa);
    }

    const mapa = mapInstanceRef.current;
    const grupoPinos = markersGroupRef.current;

    // Limpa camadas anteriores
    grupoPinos.clearLayers();
    if (heatLayerRef.current) {
      mapa.removeLayer(heatLayerRef.current);
      heatLayerRef.current = null;
    }

    const coordenadasValidas = denuncias
      .filter((d) => d.lat && d.lng)
      .map((d) => [d.lat, d.lng, 0.8]); // [lat, lng, intensidade]

    if (visaoMapa === "calor" && window.L.heatLayer) {
      // Adiciona camada de calor
      const heat = window.L.heatLayer(coordenadasValidas, {
        radius: 30,
        blur: 20,
        maxZoom: 16,
        gradient: { 0.4: "blue", 0.6: "lime", 0.8: "yellow", 1.0: "red" },
      }).addTo(mapa);
      heatLayerRef.current = heat;
    } else {
      // Adiciona marcadores individuais com popup analítico
      denuncias
        .filter((d) => d.lat && d.lng)
        .forEach((d) => {
          L.circleMarker([d.lat, d.lng], {
            radius: 8,
            fillColor: d.status === "Resolvido" ? "#10b981" : d.status === "Pendente" ? "#f59e0b" : "#0284c7",
            color: "#ffffff",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9,
          })
            .addTo(grupoPinos)
            .bindPopup(`
              <div class="text-xs">
                <strong>${d.titulo}</strong><br/>
                <span class="text-zinc-500">${d.categoria} — ${d.bairro}</span><br/>
                <span class="font-semibold">Status: ${d.status}</span><br/>
                <span class="font-mono text-[10px] text-zinc-400">SEI: ${d.numeroSei || "Processado"}</span>
              </div>
            `);
        });
    }

    setTimeout(() => mapa.invalidateSize(), 200);
  }, [denuncias, visaoMapa]);

  const denunciasTabela = denuncias.filter(
    (d) => filtroStatus === "Todos" || d.status === filtroStatus
  );

  const salvarDespacho = (e) => {
    e.preventDefault();
    if (!chamadoSelecionado) return;

    onAtualizarStatus(chamadoSelecionado.id, novoStatus, despachoTexto);
    setChamadoSelecionado(null);
    setDespachoTexto("");
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Header do Gestor */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Secretaria de Zeladoria e Serviços Públicos
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Painel Analítico de Gestão Urbana
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Triagem automatizada via SEI, priorização de rotas operacionais e mapas de concentração.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-zinc-100 text-zinc-600 px-3 py-1.5 rounded-lg border border-zinc-200 font-mono">
            Ambiente Integrado: <strong>SEI-Geral v4.2</strong>
          </span>
        </div>
      </div>

      {/* Grid de KPIs Analíticos */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-xl bg-white border border-zinc-200/80 shadow-xs">
          <span className="text-xs font-medium text-zinc-500">Total de Ocorrências</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-zinc-900 tracking-tight">{total}</span>
            <span className="text-xs text-zinc-400 font-mono">100% integradas</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-zinc-200/80 shadow-xs">
          <span className="text-xs font-medium text-amber-600">Pendentes de Ação</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-600 tracking-tight">{pendentes}</span>
            <span className="text-xs text-zinc-400">fila de despacho</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-zinc-200/80 shadow-xs">
          <span className="text-xs font-medium text-sky-600">Em Execução / Análise</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-sky-600 tracking-tight">{emAndamento}</span>
            <span className="text-xs text-zinc-400">equipes na rua</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-zinc-200/80 shadow-xs">
          <span className="text-xs font-medium text-emerald-600">Taxa de Resolução</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600 tracking-tight">{taxaResolucao}%</span>
            <span className="text-xs text-zinc-400 font-mono">bairro crítico: {bairroCritico}</span>
          </div>
        </div>
      </section>

      {/* Seção do Mapa Analítico (Heatmap vs Pontos) */}
      <section className="bg-white rounded-xl border border-zinc-200/80 shadow-xs p-5 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-sm font-bold text-zinc-900 tracking-tight flex items-center gap-2">
              <span>{visaoMapa === "calor" ? "🔥" : "📍"}</span>
              {visaoMapa === "calor" ? "Mapa de Calor (Densidade de Falhas)" : "Distribuição Geográfica Pontual"}
            </h2>
            <p className="text-xs text-zinc-500">
              {visaoMapa === "calor"
                ? "Identificação das regiões críticas com maior acúmulo de esgoto, lixo e buracos."
                : "Clique nos pontos para visualizar o número do processo SEI e dados do munícipe."}
            </p>
          </div>

          <div className="inline-flex p-1 bg-zinc-100 rounded-lg border border-zinc-200 text-xs font-medium">
            <button
              type="button"
              onClick={() => setVisaoMapa("calor")}
              className={`px-3 py-1 rounded-md transition-all ${
                visaoMapa === "calor"
                  ? "bg-white text-zinc-900 font-semibold shadow-xs"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              🔥 Mapa de Calor (Heatmap)
            </button>
            <button
              type="button"
              onClick={() => setVisaoMapa("pinos")}
              className={`px-3 py-1 rounded-md transition-all ${
                visaoMapa === "pinos"
                  ? "bg-white text-zinc-900 font-semibold shadow-xs"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              📍 Visualizar Pontos
            </button>
          </div>
        </div>

        <div
          ref={mapContainerRef}
          className="h-80 w-full rounded-lg border border-zinc-200 overflow-hidden"
          style={{ zIndex: 1 }}
        />
      </section>

      {/* Tabela de Triagem e Despacho de Processos */}
      <section className="bg-white rounded-xl border border-zinc-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-zinc-900">
              Fila Operacional de Atendimento
            </h2>
            <p className="text-xs text-zinc-500">
              Despache ordens de serviço e atualize o status no fluxo do SEI.
            </p>
          </div>

          {/* Filtro de Status da Tabela */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Status:</span>
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="text-xs px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-zinc-700"
            >
              <option value="Todos">Todos os chamados</option>
              <option value="Pendente">Pendente</option>
              <option value="Em Análise">Em Análise</option>
              <option value="Em Execução">Em Execução</option>
              <option value="Resolvido">Resolvido</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50/75 border-b border-zinc-200 text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Processo SEI</th>
                <th className="px-4 py-3">Problema / Categoria</th>
                <th className="px-4 py-3">Bairro & Endereço</th>
                <th className="px-4 py-3">Apoios</th>
                <th className="px-4 py-3">Status Atual</th>
                <th className="px-4 py-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-700">
              {denunciasTabela.map((d) => (
                <tr key={d.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-[11px] text-sky-700 font-medium">
                    {d.numeroSei || `23067.${String(d.id).slice(-4)}/2026`}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-zinc-900 block truncate max-w-xs">{d.titulo}</span>
                    <span className="text-[11px] text-zinc-500">{d.categoria}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-zinc-800">{d.bairro}</span>
                    <span className="block text-zinc-400 text-[11px] truncate max-w-xs">{d.endereco}</span>
                  </td>
                  <td className="px-4 py-3 font-mono text-zinc-600 font-semibold">
                    ▲ {d.apoios}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        d.status === "Resolvido"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : d.status === "Pendente"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-sky-50 text-sky-700 border border-sky-200"
                      }`}
                    >
                      {d.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setChamadoSelecionado(d);
                        setNovoStatus(d.status);
                        setDespachoTexto(d.despacho || "");
                      }}
                      className="px-2.5 py-1 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-md border border-sky-200/80 transition-all"
                    >
                      Despachar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal de Despacho e Alteração de Status */}
      {chamadoSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs">
          <div className="bg-white border border-zinc-200 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-base font-bold text-zinc-900 mb-1">
              Despacho Operacional — Processo SEI
            </h3>
            <p className="text-xs text-zinc-500 mb-4 font-mono">
              Nº {chamadoSelecionado.numeroSei || `23067.${String(chamadoSelecionado.id).slice(-4)}/2026`}
            </p>

            <form onSubmit={salvarDespacho} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Alterar Status</label>
                <select
                  value={novoStatus}
                  onChange={(e) => setNovoStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-800 font-medium"
                >
                  <option value="Pendente">Pendente (Em fila)</option>
                  <option value="Em Análise">Em Análise (Engenharia)</option>
                  <option value="Em Execução">Em Execução (Ordem de Serviço Emitida)</option>
                  <option value="Resolvido">Resolvido (Reparo Concluído)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">
                  Nota de Despacho / Relatório Fiscal
                </label>
                <textarea
                  rows="3"
                  value={despachoTexto}
                  onChange={(e) => setDespachoTexto(e.target.value)}
                  placeholder="Ex: Equipe de desobstrução enviada no dia 19/10 sob OS #1042."
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setChamadoSelecionado(null)}
                  className="px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm"
                >
                  Confirmar Despacho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}