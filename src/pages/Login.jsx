import { useState } from "react";

export default function Login({ onLoginSuccess, onIrParaCadastro }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    const cadastros = JSON.parse(localStorage.getItem("sanea_usuarios") || "[]");
    const usuarioEncontrado = cadastros.find(
      (u) => u.email === email && u.senha === senha
    );

    if (usuarioEncontrado) {
      onLoginSuccess(usuarioEncontrado);
    } else {
      setErro("E-mail ou credenciais não encontrados.");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-10 h-10 rounded-xl bg-sky-600 items-center justify-center text-white font-bold text-lg mb-3 shadow-sm shadow-sky-600/30">
            S
          </div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900">
            Acessar o SaneaAlerta
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Participe do monitoramento cívico do seu bairro
          </p>
        </div>

        {/* Card do Formulário */}
        <div className="bg-white border border-zinc-200/80 rounded-xl p-6 shadow-xs">
          {erro && (
            <div className="mb-4 p-2.5 rounded-md bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {erro}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                E-mail
              </label>
              <input
                type="email"
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-zinc-50/50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-zinc-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Senha de Acesso
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-zinc-50/50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-zinc-800"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 active:scale-[0.99] rounded-lg transition-all shadow-sm shadow-sky-600/20"
            >
              Entrar na Plataforma
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-zinc-100 text-center">
            <p className="text-xs text-zinc-500">
              Ainda não tem conta?{" "}
              <button
                type="button"
                onClick={onIrParaCadastro}
                className="font-semibold text-sky-600 hover:text-sky-700 hover:underline"
              >
                Cadastre-se grátis
              </button>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}