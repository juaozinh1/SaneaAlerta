import { useState } from "react";

export default function CardDenuncia({ denuncia, usuario, onApoiar, onExcluir }) {
  const [apoiado, setApoiado] = useState(false);
  const [animando, setAnimando] = useState(false);

  const statusConfig = {
    "Pendente": {
      dot: "bg-amber-500",
      pill: "bg-amber-50 text-amber-700 border-amber-200/60",
    },
    "Em Análise": {
      dot: "bg-sky-500",
      pill: "bg-sky-50 text-sky-700 border-sky-200/60",
    },
    "Resolvido": {
      dot: "bg-emerald-500",
      pill: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    },
  }[denuncia.status] || {
    dot: "bg-zinc-400",
    pill: "bg-zinc-50 text-zinc-600 border-zinc-200",
  };

  const handleCliqueApoiar = () => {
    if (apoiado) return; // Evita apoiar duplicado na mesma sessão

    setAnimando(true);
    setApoiado(true);
    onApoiar(denuncia.id);

    // Reseta apenas a classe de pulso rápido após 400ms
    setTimeout(() => {
      setAnimando(false);
    }, 400);
  };

  return (
    <article className="group bg-white rounded-xl border border-zinc-200/80 hover:border-zinc-300 transition-all duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col justify-between">
      
      {/* Imagem */}
      {denuncia.fotoUrl && (
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-100 border-b border-zinc-100">
          <img
            src={denuncia.fotoUrl}
            alt={denuncia.titulo}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
          <span className="absolute top-2.5 right-2.5 text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-sm text-zinc-700 shadow-sm border border-zinc-200/60">
            {denuncia.categoria}
          </span>
        </div>
      )}

      {/* Conteúdo */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-2 mb-2">
          {!denuncia.fotoUrl && (
            <span className="text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200/60">
              {denuncia.categoria}
            </span>
          )}

          <div className="flex items-center gap-1.5 ml-auto">
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border ${statusConfig.pill}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
              {denuncia.status}
            </span>

            <button
              type="button"
              onClick={() => onExcluir(denuncia.id)}
              className="p-1 text-zinc-400 hover:text-rose-600 transition-colors rounded hover:bg-zinc-100"
              title="Excluir ocorrência"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <h3 className="text-sm font-semibold text-zinc-900 leading-snug tracking-tight mb-1.5 group-hover:text-sky-600 transition-colors">
          {denuncia.titulo}
        </h3>
        
        <p className="text-xs text-zinc-500 line-clamp-3 leading-relaxed mb-4">
          {denuncia.descricao}
        </p>

        <div className="mt-auto pt-3 border-t border-zinc-100 flex items-center gap-1.5 text-xs text-zinc-600">
          <svg className="w-3.5 h-3.5 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">
            <strong className="font-medium text-zinc-800">{denuncia.bairro}</strong> — {denuncia.endereco}
          </span>
        </div>
      </div>

      {/* Rodapé com botão animado */}
      <div className="px-4 py-2.5 bg-zinc-50/75 border-t border-zinc-100 flex items-center justify-between text-xs">
        <span className="text-[11px] text-zinc-400">
          Por: <span className="text-zinc-600 font-medium">{denuncia.autor}</span>
        </span>

        {/* Botão de Apoiar com transição e feedback verde */}
        <button
          type="button"
          onClick={handleCliqueApoiar}
          disabled={apoiado}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all duration-300 ease-out select-none shadow-xs ${
            animando ? "scale-110" : "scale-100"
          } ${
            apoiado
              ? "bg-emerald-600 text-white border border-emerald-600 shadow-emerald-600/20 cursor-default"
              : "bg-white text-zinc-700 border border-zinc-200 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50/50 active:scale-95"
          }`}
        >
          <span
            className={`transition-transform duration-300 ${
              apoiado ? "rotate-0 scale-110" : "text-zinc-400 group-hover:text-emerald-500"
            }`}
          >
            {apoiado ? "✓" : "▲"}
          </span>
          <span>{apoiado ? "Apoiado" : "Apoiar"}</span>
          <span
            className={`font-mono text-[11px] font-semibold transition-colors ${
              apoiado ? "text-emerald-100" : "text-zinc-400"
            }`}
          >
            ({denuncia.apoios})
          </span>
        </button>
      </div>

    </article>
  );
}