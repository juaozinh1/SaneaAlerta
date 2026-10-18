export default function Navbar({
  usuario,
  visaoAtual,
  onMudarVisao,
  onLogout,
  onAbrirModal,
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        
        {/* Identidade Institucional */}
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded bg-zinc-900 flex items-center justify-center text-white font-mono font-bold text-xs tracking-wider">
            SA
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-900 tracking-tight text-sm">
              Sanea<span className="text-zinc-600">Alerta</span>
            </span>
            <span className="text-[10px] font-mono font-medium uppercase px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200/80">
              GovTech • SEI
            </span>
          </div>
        </div>

        {/* Seletor de Perfil & Ações */}
        <div className="flex items-center gap-3">
          <nav className="flex items-center p-0.5 bg-zinc-100 rounded-md border border-zinc-200">
            <button
              type="button"
              onClick={() => onMudarVisao("cidadao")}
              className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                visaoAtual === "cidadao"
                  ? "bg-white text-zinc-900 font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              Visão Munícipe
            </button>
            <button
              type="button"
              onClick={() => onMudarVisao("gestor")}
              className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                visaoAtual === "gestor"
                  ? "bg-zinc-900 text-white font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              Mesa do Gestor
            </button>
          </nav>

          <div className="h-4 w-px bg-zinc-200 hidden sm:block" />

          {usuario && (
            <div className="flex items-center gap-2">
              {visaoAtual === "cidadao" && (
                <button
                  type="button"
                  onClick={onAbrirModal}
                  className="h-8 px-3 inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 active:bg-black rounded border border-zinc-900 transition-colors shadow-2xs"
                >
                  <span className="text-sm leading-none">+</span> Abrir Chamado
                </button>
              )}

              <button
                type="button"
                onClick={onLogout}
                className="h-8 px-2.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded border border-transparent transition-colors"
                title="Encerrar sessão"
              >
                Sair
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}