import { useEffect, useRef } from "react";

export default function MapaOcorrencias({ denuncias, centro = [-8.05, -34.9] }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);

  useEffect(() => {
    // Acessa o Leaflet carregado via CDN no index.html
    const L = window.L;
    if (!L || !mapContainerRef.current) return;

    // 1. Inicializa o mapa apenas na primeira renderização
    if (!mapInstanceRef.current) {
      const mapa = L.map(mapContainerRef.current).setView(centro, 12);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapa);

      // Cria um grupo de camadas para gerenciar os marcadores com facilidade
      const layerGroup = L.layerGroup().addTo(mapa);
      
      mapInstanceRef.current = mapa;
      layerGroupRef.current = layerGroup;
    }

    // 2. Atualiza os marcadores sempre que a lista de denúncias mudar
    const grupo = layerGroupRef.current;
    grupo.clearLayers();

    denuncias
      .filter((d) => d.lat && d.lng)
      .forEach((d) => {
        const popupContent = `
          <div style="font-size: 0.9rem;">
            <strong>${d.titulo}</strong><br/>
            <span style="color: #64748b;">${d.categoria} — ${d.bairro}</span><br/>
            <small>${d.endereco}</small><br/>
            <strong>Status:</strong> ${d.status} | <strong>Apoios:</strong> ${d.apoios}
          </div>
        `;

        L.marker([d.lat, d.lng])
          .addTo(grupo)
          .bindPopup(popupContent);
      });
  }, [denuncias, centro]);

  return (
    <div
      ref={mapContainerRef}
      style={{
        height: "380px",
        width: "100%",
        borderRadius: "12px",
        marginBottom: "1.5rem",
        border: "1px solid var(--border)",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        zIndex: 1,
      }}
    />
  );
}