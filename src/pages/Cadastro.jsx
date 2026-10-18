import { useState } from "react";

export default function Cadastro({ onCadastroSuccess, onIrParaLogin }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [bairro, setBairro] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleCadastro = (e) => {
    e.preventDefault();
    setErro("");

    const cadastros = JSON.parse(localStorage.getItem("sanea_usuarios") || "[]");

    if (cadastros.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      setErro("Este e-mail já está cadastrado no sistema.");
      return;
    }

    if (senha.length < 6) {
      setErro("A senha deve conter no mínimo 6 caracteres.");
      return;
    }

    const novoUsuario = {
      id: Date.now(),
      nome: nome.trim(),
      email: email.trim(),
      bairro: bairro.trim(),
      senha,
    };

    cadastros.push(novoUsuario);
    localStorage.setItem("sanea_usuarios", JSON.stringify(cadastros));

    onCadastroSuccess(novoUsuario);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        
        {/* Identidade / Cabeçalho */}
        <div className="text-center mb-8">
          <div className="inline-flex w-10 h-10 rounded-xl bg-sky-600 items-center justify-center text-white font-bold text-lg mb-3 shadow-sm shadow-sky-600/30">
            S
          </div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900">
            Criar conta de morador
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Cadastre-se para relatar e apoiar demandas da sua região
          </p>
        </div>

        {/* Card do Formulário */}
        <div className="bg-white border border-zinc-200/80 rounded-xl p-6 shadow-xs">
          {erro && (
            <div className="mb-4 p-2.5 rounded-md bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-1.5">
              <span>⚠️</span>
              <span>{erro}</span>
            </div>
          )}

          <form onSubmit={handleCadastro} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Nome Completo
              </label>
              <input
                type="text"
                placeholder="Ex: João Silva"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-zinc-50/50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-zinc-800 placeholder:text-zinc-400"
              />
            </div>

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
                className="w-full px-3 py-2 text-xs bg-zinc-50/50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-zinc-800 placeholder:text-zinc-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Bairro de Residência
              </label>
              <input
                type="text"
                placeholder="Ex: Várzea, Boa Viagem, Madalena..."
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-zinc-50/50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-zinc-800 placeholder:text-zinc-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Criar Senha
              </label>
              <input
                type="password"
                placeholder="Mínimo de 6 caracteres"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-zinc-50/50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-zinc-800 placeholder:text-zinc-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 active:scale-[0.99] rounded-lg transition-all shadow-sm shadow-sky-600/20 mt-2"
            >
              Concluir Cadastro
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-zinc-100 text-center">
            <p className="text-xs text-zinc-500">
              Já possui uma conta?{" "}
              <button
                type="button"
                onClick={onIrParaLogin}
                className="font-semibold text-sky-600 hover:text-sky-700 hover:underline"
              >
                Fazer login
              </button>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}