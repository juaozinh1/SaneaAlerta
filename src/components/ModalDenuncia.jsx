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

  // Inicializa o mini-mapa interativo dentro do modal
  useEffect(() => {
    const L = window.L;
    if (!L || !miniMapContainerRef.current) return;

    if (!miniMapInstanceRef.current) {
      const centroInicial = [-8.05, -34.9];
      const mapa = L.map(miniMapContainerRef.current).setView(centroInicial, 12);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
      }).addTo(mapa);

      // Permite clicar no mapa para marcar ou mover o pino
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

  // Move o pino e recentraliza o mapa
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

  // 1. Localização por GPS do dispositivo
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

  // 2. Consulta automática pelo CEP (ViaCEP)
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

  // 3. Geocodificação pelo Nominatim (OpenStreetMap)
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
        setStatusBusca("Endereço aproximado. Ajuste o pino clicando no mapa.");
      }
    } catch {
      setStatusBusca("Não foi possível buscar as coordenadas no momento.");
    }
  };

  // Upload e conversão do arquivo de imagem para Base64
  const handleFileChange = (e) => {
    const arquivo = e.target.files[0];
    if (!arquivo) return;

    // Limite de 2MB para não sobrecarregar o localStorage
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
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: "580px" }}>
        <h2 style={{ marginBottom: "1rem" }}>Registrar Nova Ocorrência</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Título do Problema *</label>
            <input
              type="text"
              placeholder="Ex: Vazamento de esgoto na calçada"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Categoria</label>
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
              <option value="Vazamento de Esgoto">Vazamento de Esgoto</option>
              <option value="Falta de Água">Falta de Água Potável</option>
              <option value="Buraco na Via">Buraco / Pavimentação</option>
              <option value="Acúmulo de Lixo">Acúmulo de Lixo</option>
              <option value="Boca de Lobo Entupida">Boca de Lobo Entupida</option>
            </select>
          </div>

          {/* Busca por CEP e Bairro */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
            <div className="input-group">
              <label>CEP (Preenchimento Rápido)</label>
              <input
                type="text"
                placeholder="Ex: 50740-000"
                value={cep}
                onChange={(e) => buscarPorCep(e.target.value)}
                maxLength={9}
              />
            </div>
            <div className="input-group">
              <label>Bairro *</label>
              <input
                type="text"
                placeholder="Ex: Várzea"
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Rua e Número */}
          <div style={{ display: "grid", gridTemplateColumns: "2.5fr 1fr", gap: "0.8rem" }}>
            <div className="input-group">
              <label>Rua / Logradouro *</label>
              <input
                type="text"
                placeholder="Ex: Rua Acadêmico Hélio Ramos"
                value={rua}
                onChange={(e) => setRua(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>Número / Ref.</label>
              <input
                type="text"
                placeholder="Ex: 120"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0.8rem" }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => geocodificarEndereco()}
              style={{ fontSize: "0.85rem", padding: "0.4rem 0.8rem" }}
            >
              🔍 Localizar endereço no mapa
            </button>
          </div>

          {/* Mini-mapa interativo com suporte a GPS e clique */}
          <div className="input-group">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
              <label>Marque o ponto exato no mapa:</label>
              <button
                type="button"
                onClick={obterLocalizacaoGPS}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--primary)",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                }}
              >
                📍 Usar meu GPS
              </button>
            </div>

            <div
              ref={miniMapContainerRef}
              style={{
                height: "200px",
                width: "100%",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "#e2e8f0",
                zIndex: 1,
              }}
            />

            <small style={{ color: "var(--text-muted)", marginTop: "0.3rem", display: "block" }}>
              {statusBusca
                ? statusBusca
                : coords
                ? `Pino posicionado em: (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}) — você pode arrastar o pino.`
                : "Clique no mapa para colocar o pino onde está o problema."}
            </small>
          </div>

          {/* Upload de Foto do Dispositivo com Preview */}
          <div className="input-group">
            <label>Foto do Problema (Upload do Dispositivo)</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ padding: "0.4rem" }}
            />

            {fotoUrl && (
              <div style={{ marginTop: "0.8rem", position: "relative", width: "fit-content" }}>
                <img
                  src={fotoUrl}
                  alt="Pré-visualização do problema"
                  style={{
                    width: "100%",
                    maxWidth: "320px",
                    maxHeight: "180px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    display: "block",
                  }}
                />
                <button
                  type="button"
                  onClick={handleRemoverFoto}
                  style={{
                    position: "absolute",
                    top: "6px",
                    right: "6px",
                    backgroundColor: "rgba(0, 0, 0, 0.65)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "50%",
                    width: "26px",
                    height: "26px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.85rem",
                  }}
                  title="Remover foto"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div className="input-group">
            <label>Descrição Detalhada *</label>
            <textarea
              rows="3"
              placeholder="Descreva o problema e detalhes para localização..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1rem" }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Publicar Denúncia
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}