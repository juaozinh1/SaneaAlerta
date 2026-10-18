export default function Navbar({
  usuario,
  visaoAtual,
  onMudarVisao,
  onLogout,
  onAbrirModal,
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Identidade */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-sky-600/20">
            S
          </div>
          <div>
            <span className="font-semibold text-zinc-900 tracking-tight text-base">
              Sanea<span className="text-sky-600">Alerta</span>
            </span>
            <span className="hidden sm:inline-block ml-2 px-1.5 py-0.5 rounded text-[10px] font-medium tracking-wide uppercase bg-zinc-100 text-zinc-500 border border-zinc-200/60">
              SaaS Zeladoria
            </span>
          </div>
        </div>

        {/* Alternador de Perfil: Cidadão vs Gestor */}
        <div className="flex items-center gap-3">
          <div className="inline-flex p-0.5 bg-zinc-100 rounded-lg border border-zinc-200 text-xs font-medium">
            <button
              type="button"
              onClick={() => onMudarVisao("cidadao")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                visaoAtual === "cidadao"
                  ? "bg-white text-zinc-900 font-semibold shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              👤 Cidadão
            </button>
            <button
              type="button"
              onClick={() => onMudarVisao("gestor")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                visaoAtual === "gestor"
                  ? "bg-sky-600 text-white font-semibold shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              🏛️ Painel do Gestor
            </button>
          </div>

          <div className="h-5 w-px bg-zinc-200 hidden sm:block" />

          {usuario && (
            <>
              {visaoAtual === "cidadao" && (
                <button
                  type="button"
                  onClick={onAbrirModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 active:scale-[0.98] transition-all rounded-md shadow-sm"
                >
                  <span className="text-sm leading-none">+</span> Nova Ocorrência
                </button>
              )}

              <button
                type="button"
                onClick={onLogout}
                className="px-2 py-1 text-xs font-medium text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors"
              >
                Sair
              </button>
            </>
          )}
        </div>

      </div>
    </header>
  );
}