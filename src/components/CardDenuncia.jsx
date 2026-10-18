import { useState } from "react";

export default function CardDenuncia({ denuncia, usuario, onApoiar, onExcluir }) {
  const [apoiado, setApoiado] = useState(false);

  const statusMap = {
    "Pendente": {
      tag: "bg-amber-50 text-amber-800 border-amber-300/80",
      dot: "bg-amber-500",
    },
    "Em Análise": {
      tag: "bg-blue-50 text-blue-800 border-blue-300/80",
      dot: "bg-blue-600",
    },
    "Em Execução": {
      tag: "bg-purple-50 text-purple-800 border-purple-300/80",
      dot: "bg-purple-600",
    },
    "Resolvido": {
      tag: "bg-emerald-50 text-emerald-800 border-emerald-300/80",
      dot: "bg-emerald-600",
    },
  }[denuncia.status] || {
    tag: "bg-zinc-50 text-zinc-700 border-zinc-200",
    dot: "bg-zinc-500",
  };

  const handleCliqueApoiar = () => {
    if (apoiado) return;
    setApoiado(true);
    onApoiar(denuncia.id);
  };

  return (
    <article className="bg-white rounded-lg border border-zinc-200/90 hover:border-zinc-300 transition-colors shadow-2xs overflow-hidden flex flex-col justify-between">
      
      {/* Imagem Técnica (16:9 contida com proporção consistente) */}
      {denuncia.fotoUrl && (
        <div className="relative aspect-[16/9] w-full bg-zinc-100 border-b border-zinc-100 overflow-hidden">
          <img
            src={denuncia.fotoUrl}
            alt={denuncia.titulo}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2">
            <span className="font-mono text-[10px] tracking-tight font-medium bg-black/75 text-white backdrop-blur-xs px-2 py-0.5 rounded">
              {denuncia.numeroSei || `SEI-${String(denuncia.id).slice(-4)}`}
            </span>
          </div>
        </div>
      )}

      {/* Corpo da Ocorrência */}
      <div className="p-4 flex-1 flex flex-col">
        
        {/* Metadados e Status */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-[11px] font-medium text-zinc-600 tracking-tight truncate max-w-[180px]">
            {denuncia.categoria}
          </span>

          <div className="flex items-center gap-1.5 ml-auto">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${statusMap.tag}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusMap.dot}`} />
              {denuncia.status}
            </span>

            <button
              type="button"
              onClick={() => onExcluir(denuncia.id)}
              className="p-1 text-zinc-400 hover:text-rose-600 hover:bg-zinc-100 rounded transition-colors"
              title="Excluir chamado"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Título & Descrição */}
        <h3 className="text-sm font-semibold text-zinc-900 leading-snug tracking-tight mb-1.5">
          {denuncia.titulo}
        </h3>
        
        <p className="text-xs text-zinc-600 leading-relaxed line-clamp-3 mb-4">
          {denuncia.descricao}
        </p>

        {/* Endereço / Localizador */}
        <div className="mt-auto pt-3 border-t border-zinc-100 text-xs text-zinc-600 flex items-start gap-1.5">
          <span className="text-zinc-400 mt-0.5">📍</span>
          <div className="leading-snug truncate">
            <span className="font-semibold text-zinc-800">{denuncia.bairro}</span>
            <span className="text-zinc-400 font-mono text-[11px] block truncate">
              {denuncia.endereco}
            </span>
          </div>
        </div>
      </div>

      {/* Barra de Apoio e Autoria */}
      <div className="px-4 py-2.5 bg-zinc-50 border-t border-zinc-200/70 flex items-center justify-between text-xs">
        <span className="text-[11px] text-zinc-500 font-mono">
          Autor: <strong className="font-sans font-medium text-zinc-700">{denuncia.autor}</strong>
        </span>

        <button
          type="button"
          onClick={handleCliqueApoiar}
          disabled={apoiado}
          className={`h-7 px-2.5 inline-flex items-center gap-1.5 rounded text-xs font-medium border transition-colors select-none ${
            apoiado
              ? "bg-emerald-600 text-white border-emerald-600 cursor-default"
              : "bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-100 hover:text-zinc-900 active:bg-zinc-200"
          }`}
        >
          <span>{apoiado ? "✓" : "▲"}</span>
          <span>{apoiado ? "Apoiado" : "Apoiar"}</span>
          <span className="font-mono text-[11px]">({denuncia.apoios})</span>
        </button>
      </div>

    </article>
  );
}