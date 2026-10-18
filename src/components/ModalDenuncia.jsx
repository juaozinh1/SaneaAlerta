import { useState, useEffect, useRef } from "react";

export default function ModalDenuncia({ usuario, onClose, onSalvar }) {
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("Vazamento de Esgoto");
  const [cep, setCep] = useState("");
  const [bairro, setBairro] = useState(usuario?.bairro || "");
  const [cidade, setCidade] = useState("Recife");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [descricao, setDescricao] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");

  const [coords, setCoords] = useState(null);
  const [statusBusca, setStatusBusca] = useState("");

  const miniMapContainerRef = useRef(null);
  const miniMapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const L = window.L;
    if (!L || !miniMapContainerRef.current) return;

    if (!miniMapInstanceRef.current) {
      const centroInicial = [-8.05, -34.9];
      const mapa = L.map(miniMapContainerRef.current).setView(centroInicial, 12);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
      }).addTo(mapa);

      mapa.on("click", (e) => {
        const { lat, lng } = e.latlng;
        setCoords({ lat, lng });

        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(mapa);
          markerRef.current.on("dragend", (ev) => {
            const novaPos = ev.target.getLatLng();
            setCoords({ lat: novaPos.lat, lng: novaPos.lng });
          });
        }
      });

      miniMapInstanceRef.current = mapa;
    }

    const timer = setTimeout(() => {
      miniMapInstanceRef.current?.invalidateSize();
    }, 250);

    return () => clearTimeout(timer);
  }, []);

  const atualizarPinoMapa = (lat, lng, zoom = 16) => {
    const L = window.L;
    const mapa = miniMapInstanceRef.current;
    if (!mapa || !L) return;

    setCoords({ lat, lng });
    mapa.setView([lat, lng], zoom);

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(mapa);
      markerRef.current.on("dragend", (ev) => {
        const novaPos = ev.target.getLatLng();
        setCoords({ lat: novaPos.lat, lng: novaPos.lng });
      });
    }
  };

  const obterLocalizacaoGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocalização não suportada no seu navegador.");
      return;
    }

    setStatusBusca("Obtendo GPS...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        atualizarPinoMapa(latitude, longitude, 16);
        setStatusBusca("Localização marcada via GPS!");
      },
      () => {
        setStatusBusca("Falha no GPS. Busque por CEP ou clique no mapa.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const buscarPorCep = async (valorCep) => {
    setCep(valorCep);
    const cepLimpo = valorCep.replace(/\D/g, "");

    if (cepLimpo.length === 8) {
      setStatusBusca("Consultando CEP...");
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const dados = await res.json();

        if (!dados.erro) {
          if (dados.logradouro) setRua(dados.logradouro);
          if (dados.bairro) setBairro(dados.bairro);
          if (dados.localidade) setCidade(dados.localidade);

          const consultaEndereco = `${dados.logradouro || ""}, ${dados.bairro || ""}, ${dados.localidade || "Recife"}`;
          geocodificarEndereco(consultaEndereco);
        } else {
          setStatusBusca("CEP não encontrado.");
        }
      } catch {
        setStatusBusca("Erro ao consultar o serviço de CEP.");
      }
    }
  };

  const geocodificarEndereco = async (textoEndereco) => {
    const consulta =
      textoEndereco ||
      `${rua}${numero ? `, ${numero}` : ""}, ${bairro}, ${cidade}`;

    if (!consulta.replace(/,/g, "").trim()) return;

    setStatusBusca("Localizando no mapa...");
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        consulta
      )}`;
      const res = await fetch(url);
      const resultados = await res.json();

      if (resultados && resultados.length > 0) {
        const lat = parseFloat(resultados[0].lat);
        const lng = parseFloat(resultados[0].lon);
        atualizarPinoMapa(lat, lng, 16);
        setStatusBusca("Localização encontrada e marcada!");
      } else {
        setStatusBusca("Endereço aproximado. Ajuste o pino no mapa.");
      }
    } catch {
      setStatusBusca("Não foi possível buscar as coordenadas no momento.");
    }
  };

  const handleFileChange = (e) => {
    const arquivo = e.target.files[0];
    if (!arquivo) return;

    if (arquivo.size > 2 * 1024 * 1024) {
      alert("A imagem selecionada é muito grande. Escolha uma foto de até 2MB.");
      e.target.value = "";
      return;
    }

    const leitor = new FileReader();
    leitor.onloadend = () => {
      setFotoUrl(leitor.result);
    };
    leitor.readAsDataURL(arquivo);
  };

  const handleRemoverFoto = () => {
    setFotoUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!titulo || !rua || !bairro || !descricao) {
      alert("Por favor, preencha todos os campos obrigatórios (*).");
      return;
    }

    const enderecoCompleto = `${rua}${numero ? `, nº ${numero}` : ""} — ${bairro}, ${cidade}`;

    const novaDenuncia = {
      id: Date.now(),
      titulo,
      categoria,
      bairro,
      endereco: enderecoCompleto,
      descricao,
      fotoUrl: fotoUrl.trim(),
      status: "Pendente",
      apoios: 1,
      autor: usuario?.nome || "Cidadão Anônimo",
      lat: coords?.lat || null,
      lng: coords?.lng || null,
      data: new Date().toLocaleDateString("pt-BR"),
    };

    onSalvar(novaDenuncia);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 my-auto">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-5">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 tracking-tight">
              Registrar Nova Ocorrência
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Preencha os dados e posicione o local no mapa cívico
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors text-sm"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-zinc-700 mb-1">
              Título do Problema *
            </label>
            <input
              type="text"
              placeholder="Ex: Vazamento de esgoto na calçada"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs bg-zinc-50/50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-zinc-800 transition-all placeholder:text-zinc-400"
            />
          </div>

          <div>
            <label className="block font-semibold text-zinc-700 mb-1">
              Categoria
            </label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-zinc-50/50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-zinc-800 cursor-pointer"
            >
              <option value="Vazamento de Esgoto">Vazamento de Esgoto</option>
              <option value="Falta de Água">Falta de Água Potável</option>
              <option value="Buraco na Via">Buraco / Pavimentação</option>
              <option value="Acúmulo de Lixo">Acúmulo de Lixo</option>
              <option value="Boca de Lobo Entupida">Boca de Lobo Entupida</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-zinc-700 mb-1">
                CEP (Autocompletar)
              </label>
              <input
                type="text"
                placeholder="Ex: 50740-000"
                value={cep}
                onChange={(e) => buscarPorCep(e.target.value)}
                maxLength={9}
                className="w-full px-3 py-2 text-xs bg-zinc-50/50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-zinc-800 transition-all placeholder:text-zinc-400"
              />
            </div>
            <div>
              <label className="block font-semibold text-zinc-700 mb-1">
                Bairro *
              </label>
              <input
                type="text"
                placeholder="Ex: Várzea"
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-zinc-50/50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-zinc-800 transition-all placeholder:text-zinc-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block font-semibold text-zinc-700 mb-1">
                Rua / Logradouro *
              </label>
              <input
                type="text"
                placeholder="Ex: Rua Acadêmico Hélio Ramos"
                value={rua}
                onChange={(e) => setRua(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-zinc-50/50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-zinc-800 transition-all placeholder:text-zinc-400"
              />
            </div>
            <div>
              <label className="block font-semibold text-zinc-700 mb-1">
                Número / Ref.
              </label>
              <input
                type="text"
                placeholder="Ex: 120"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-zinc-50/50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-zinc-800 transition-all placeholder:text-zinc-400"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => geocodificarEndereco()}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 hover:underline"
            >
              🔍 Localizar endereço digitado no mapa
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-zinc-700">
                Ponto Exato no Mapa
              </label>
              <button
                type="button"
                onClick={obterLocalizacaoGPS}
                className="text-xs font-semibold text-sky-600 hover:text-sky-700"
              >
                📍 Usar meu GPS
              </button>
            </div>

            <div
              ref={miniMapContainerRef}
              className="h-44 w-full rounded-xl border border-zinc-200 bg-zinc-100 overflow-hidden"
              style={{ zIndex: 1 }}
            />

            <span className="block text-[11px] text-zinc-400 mt-1">
              {statusBusca
                ? statusBusca
                : coords
                ? `Pino posicionado: (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}) — você pode arrastar o pino.`
                : "Clique no mapa para posicionar o pino exato do problema."}
            </span>
          </div>

          <div>
            <label className="block font-semibold text-zinc-700 mb-1">
              Foto do Problema (Upload do Dispositivo)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-xs text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200 cursor-pointer"
            />

            {fotoUrl && (
              <div className="relative mt-2.5 w-fit">
                <img
                  src={fotoUrl}
                  alt="Prévia"
                  className="w-48 h-28 object-cover rounded-lg border border-zinc-200"
                />
                <button
                  type="button"
                  onClick={handleRemoverFoto}
                  className="absolute top-1.5 right-1.5 w-5 h-5 bg-zinc-900/70 hover:bg-zinc-900 text-white rounded-full flex items-center justify-center text-[10px]"
                  title="Remover foto"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block font-semibold text-zinc-700 mb-1">
              Descrição Detalhada *
            </label>
            <textarea
              rows="3"
              placeholder="Descreva o problema e detalhes para localização..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs bg-zinc-50/50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-zinc-800 transition-all placeholder:text-zinc-400"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 active:scale-[0.98] rounded-lg transition-all shadow-sm shadow-sky-600/20"
            >
              Publicar Denúncia
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}