export default function Navbar({ usuario, onLogout, onAbrirModal }) {
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
              Cívico
            </span>
          </div>
        </div>

        {/* Ações / Status */}
        <div className="flex items-center gap-3">
          {usuario ? (
            <>
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-medium text-zinc-900 leading-tight">
                  {usuario.nome}
                </span>
                <span className="text-[11px] text-zinc-500 leading-tight">
                  {usuario.bairro || "Morador"}
                </span>
              </div>

              <div className="h-6 w-px bg-zinc-200 hidden sm:block mx-1" />

              <button
                type="button"
                onClick={onAbrirModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 active:scale-[0.98] transition-all rounded-md shadow-sm shadow-sky-600/20"
              >
                <span className="text-sm leading-none">+</span> Nova Ocorrência
              </button>

              <button
                type="button"
                onClick={onLogout}
                className="px-2.5 py-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors"
                title="Desconectar"
              >
                Sair
              </button>
            </>
          ) : (
            <span className="text-xs font-medium text-zinc-500">
              Painel Comunitário
            </span>
          )}
        </div>

      </div>
    </header>
  );
}