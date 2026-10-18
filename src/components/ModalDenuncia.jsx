import { useState } from "react";

export default function ModalDenuncia({ usuario, onClose, onSalvar }) {
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("Vazamento de Esgoto");
  const [bairro, setBairro] = useState(usuario?.bairro || "");
  const [endereco, setEndereco] = useState("");
  const [descricao, setDescricao] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!titulo || !endereco || !descricao) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const novaDenuncia = {
      id: Date.now(),
      titulo,
      categoria,
      bairro,
      endereco,
      descricao,
      fotoUrl: fotoUrl.trim(),
      status: "Pendente",
      apoios: 1,
      autor: usuario.nome,
      data: new Date().toLocaleDateString("pt-BR"),
    };

    onSalvar(novaDenuncia);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 style={{ marginBottom: "1rem" }}>Registrar Nova Ocorrência</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Título do Problema *</label>
            <input
              type="text"
              placeholder="Ex: Esgoto vazando próximo à praça"
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

          <div className="input-group">
            <label>Bairro *</label>
            <input
              type="text"
              placeholder="Ex: Boa Vista"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Endereço / Referência *</label>
            <input
              type="text"
              placeholder="Ex: Rua das Flores, em frente ao nº 120"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>URL da Foto (opcional)</label>
            <input
              type="url"
              placeholder="https://exemplo.com/imagem.jpg"
              value={fotoUrl}
              onChange={(e) => setFotoUrl(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Descrição Detalhada *</label>
            <textarea
              rows="3"
              placeholder="Descreva o impacto do problema para o bairro..."
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