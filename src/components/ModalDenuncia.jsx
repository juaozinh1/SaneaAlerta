import { useState, useEffect, useRef } from "react";

const GRUPOS_CATEGORIAS_ZELADORIA = [
  {
    setor: "Saneamento & Drenagem",
    opcoes: [
      "Vazamento de Esgoto na Via",
      "Falta de Água Potável / Tubulação Rompida",
      "Boca de Lobo / Bueiro Entupido",
      "Galeria Pluvial Rompida / Alagamento",
    ],
  },
  {
    setor: "Vias Urbanas & Estradas Rurais",
    opcoes: [
      "Buraco / Falha na Pavimentação Asfáltica",
      "Conservação / Nivelamento de Estrada Vicinal (Rural)",
      "Ponte ou Pontilhão Avariado",
      "Mata-burro Quebrado ou Obstruído",
      "Paralelepípedo Solto / Desnível Crítico",
    ],
  },
  {
    setor: "Iluminação Pública & Energia",
    opcoes: [
      "Lâmpada Apagada / Ponto Escuro à Noite",
      "Lâmpada Acesa Durante o Dia (Desperdício)",
      "Poste Avariado / Risco de Queda",
      "Fiação Rompida / Curto-Circuito",
    ],
  },
  {
    setor: "Acessibilidade & Calçadas",
    opcoes: [
      "Calçada Intransitável / Desnível Severo",
      "Rampa de Acessibilidade Quebrada ou Ausente",
      "Piso Tátil Interrompido ou Destruído",
      "Obstrução Indevida de Passeio Público",
    ],
  },
  {
    setor: "Limpeza Urbana & Meio Ambiente",
    opcoes: [
      "Acúmulo de Lixo / Ponto Viciado de Descarte",
      "Entulho de Construção Abandonado na Via",
      "Poda de Árvore em Fiação / Risco de Queda",
      "Capinação / Mato Alto em Espaço Público",
    ],
  },
];

export default function ModalDenuncia({ usuario, onClose, onSalvar }) {
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState(GRUPOS_CATEGORIAS_ZELADORIA[0].opcoes[0]);
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
      const mapa = L.map(miniMapContainerRef.current, { zoomControl: false }).setView(centroInicial, 12);
      L.control.zoom({ position: "bottomright" }).addTo(mapa);

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
            const p = ev.target.getLatLng();
            setCoords({ lat: p.lat, lng: p.lng });
          });
        }
      });

      miniMapInstanceRef.current = mapa;
    }

    const timer = setTimeout(() => {
      miniMapInstanceRef.current?.invalidateSize();
    }, 200);

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
        const p = ev.target.getLatLng();
        setCoords({ lat: p.lat, lng: p.lng });
      });
    }
  };

  const obterLocalizacaoGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocalização não suportada.");
      return;
    }
    setStatusBusca("Capturando coordenadas GPS...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        atualizarPinoMapa(pos.coords.latitude, pos.coords.longitude, 16);
        setStatusBusca("Coordenadas fixadas via GPS.");
      },
      () => setStatusBusca("Falha no GPS. Ajuste o ponto manualmente no mapa."),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const buscarPorCep = async (valorCep) => {
    setCep(valorCep);
    const cepLimpo = valorCep.replace(/\D/g, "");
    if (cepLimpo.length === 8) {
      setStatusBusca("Consultando base ViaCEP...");
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const dados = await res.json();
        if (!dados.erro) {
          if (dados.logradouro) setRua(dados.logradouro);
          if (dados.bairro) setBairro(dados.bairro);
          if (dados.localidade) setCidade(dados.localidade);
          geocodificarEndereco(`${dados.logradouro || ""}, ${dados.bairro || ""}, ${dados.localidade || "Recife"}`);
        }
      } catch {
        setStatusBusca("Erro na consulta de CEP.");
      }
    }
  };

  const geocodificarEndereco = async (textoEndereco) => {
    const consulta = textoEndereco || `${rua}${numero ? `, ${numero}` : ""}, ${bairro}, ${cidade}`;
    if (!consulta.replace(/,/g, "").trim()) return;
    setStatusBusca("Indexando coordenadas cartográficas...");
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(consulta)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data && data.length > 0) {
        atualizarPinoMapa(parseFloat(data[0].lat), parseFloat(data[0].lon), 16);
        setStatusBusca("Coordenadas vinculadas ao endereço.");
      }
    } catch {
      setStatusBusca("Não foi possível georreferenciar o endereço.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Tamanho máximo de 2MB por arquivo.");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setFotoUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!titulo || !rua || !bairro || !descricao) {
      alert("Preencha todos os campos obrigatórios (*)");
      return;
    }

    onSalvar({
      id: Date.now(),
      titulo,
      categoria,
      bairro,
      endereco: `${rua}${numero ? `, nº ${numero}` : ""} — ${bairro}, ${cidade}`,
      descricao,
      fotoUrl: fotoUrl.trim(),
      status: "Pendente",
      apoios: 1,
      autor: usuario?.nome || "Cidadão Anônimo",
      lat: coords?.lat || null,
      lng: coords?.lng || null,
      data: new Date().toLocaleDateString("pt-BR"),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/70 backdrop-blur-2xs overflow-y-auto">
      <div className="bg-white border border-zinc-300 rounded-lg shadow-xl w-full max-w-xl max-h-[92vh] overflow-y-auto p-5 my-auto">
        
        {/* Topo do Formulário */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200 mb-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 font-semibold block">
              Formulário Técnico
            </span>
            <h2 className="text-base font-bold text-zinc-900 tracking-tight">
              Abertura de Chamado de Zeladoria
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-7 w-7 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded flex items-center justify-center text-xs"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          
          <div>
            <label className="block font-semibold text-zinc-800 mb-1">Título do Problema *</label>
            <input
              type="text"
              placeholder="Ex: Rompimento de tubulação pluvial na via principal"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              className="w-full h-8 px-2.5 bg-zinc-50 border border-zinc-300 rounded text-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-zinc-800 mb-1">Setor & Categoria *</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full h-8 px-2 bg-zinc-50 border border-zinc-300 rounded text-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900 font-medium"
            >
              {GRUPOS_CATEGORIAS_ZELADORIA.map((g) => (
                <optgroup key={g.setor} label={g.setor} className="font-semibold text-zinc-700 bg-zinc-100">
                  {g.opcoes.map((op) => (
                    <option key={op} value={op} className="text-zinc-800 bg-white">
                      {op}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Endereçamento */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-semibold text-zinc-800 mb-1">CEP</label>
              <input
                type="text"
                placeholder="00000-000"
                value={cep}
                onChange={(e) => buscarPorCep(e.target.value)}
                maxLength={9}
                className="w-full h-8 px-2.5 font-mono bg-zinc-50 border border-zinc-300 rounded text-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-zinc-800 mb-1">Bairro / Região Rural *</label>
              <input
                type="text"
                placeholder="Ex: Várzea"
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                required
                className="w-full h-8 px-2.5 bg-zinc-50 border border-zinc-300 rounded text-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div className="col-span-2">
              <label className="block font-semibold text-zinc-800 mb-1">Logradouro / Estrada *</label>
              <input
                type="text"
                placeholder="Ex: Rua Acadêmico Hélio Ramos"
                value={rua}
                onChange={(e) => setRua(e.target.value)}
                required
                className="w-full h-8 px-2.5 bg-zinc-50 border border-zinc-300 rounded text-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-zinc-800 mb-1">Nº / Km</label>
              <input
                type="text"
                placeholder="Ex: 120"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                className="w-full h-8 px-2.5 bg-zinc-50 border border-zinc-300 rounded text-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
            </div>
          </div>

          {/* Mini-mapa compacto com coordenadas de precisão */}
          <div className="border border-zinc-200 rounded p-2.5 bg-zinc-50/60">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-zinc-800">Georreferenciamento</span>
              <button
                type="button"
                onClick={obterLocalizacaoGPS}
                className="font-mono text-[11px] text-zinc-800 hover:text-black font-semibold underline"
              >
                Capturar GPS
              </button>
            </div>

            <div
              ref={miniMapContainerRef}
              className="h-36 w-full rounded border border-zinc-300 bg-zinc-200"
              style={{ zIndex: 1 }}
            />

            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 mt-1.5">
              <span>{statusBusca || "Clique no mapa para marcar a coordenada exata"}</span>
              {coords && (
                <span className="font-semibold text-zinc-800">
                  [{coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}]
                </span>
              )}
            </div>
          </div>

          {/* Upload de Imagem */}
          <div>
            <label className="block font-semibold text-zinc-800 mb-1">Anexo Fotográfico</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-xs text-zinc-600 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border file:border-zinc-300 file:text-xs file:font-medium file:bg-zinc-100 hover:file:bg-zinc-200"
            />
            {fotoUrl && (
              <div className="mt-2 flex items-center gap-3">
                <img src={fotoUrl} alt="Anexo" className="h-16 w-24 object-cover rounded border border-zinc-300" />
                <button
                  type="button"
                  onClick={() => { setFotoUrl(""); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                  className="text-rose-600 font-medium hover:underline text-xs"
                >
                  Remover anexo
                </button>
              </div>
            )}
          </div>

          {/* Descrição */}
          <div>
            <label className="block font-semibold text-zinc-800 mb-1">Descrição Circunstanciada *</label>
            <textarea
              rows="3"
              placeholder="Descreva detalhes que auxiliem as equipes de campo na triagem do chamado..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
              className="w-full p-2 bg-zinc-50 border border-zinc-300 rounded text-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
            />
          </div>

          {/* Rodapé */}
          <div className="flex justify-end gap-2 pt-3 border-t border-zinc-200">
            <button
              type="button"
              onClick={onClose}
              className="h-8 px-3 text-xs font-medium text-zinc-700 hover:bg-zinc-100 rounded border border-zinc-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="h-8 px-4 text-xs font-semibold text-white bg-zinc-900 hover:bg-black rounded border border-zinc-900 transition-colors"
            >
              Registrar Protocolo
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}