# SaneaAlerta — Plataforma SaaS de Zeladoria Urbana e Rural

Plataforma cívica para registro, priorização e gestão operacional de demandas de zeladoria urbana e rural, com suporte a georreferenciamento, upload de evidências multimídia, mapas de calor (*heatmaps*) e integração simulada ao Sistema Eletrônico de Informações (SEI).

---

## O Problema

A gestão de zeladoria pública nos municípios enfrenta gargalos estruturais que comprometem a agilidade e a transparência do atendimento às demandas da população:

1. **Triagem Manual e Fragmentada:** Solicitações de munícipes chegam despadronizadas por múltiplos canais (telefone, redes sociais, balcão presencial), exigindo esforço manual para autuação formal nos sistemas governamentais.
2. **Deficit de Cobertura Espacial:** Demandas de áreas rurais (conservação de estradas vicinais, pontilhões, mata-burros) e zonas periféricas frequentemente ficam à margem do monitoramento pela falta de georreferenciamento preciso.
3. **Falta de Dados Analíticos para Decisão:** Gestores públicos operam de forma reativa, sem acesso a mapas de calor de densidade de falhas ou indicadores consolidados de atendimento por região e categoria.
4. **Desconexão com Sistemas Oficiais (SEI):** A ausência de integração automatizada com o Sistema Eletrônico de Informações (SEI) atrasa a emissão de Ordens de Serviço (OS) e a rastreabilidade do processo administrativo pelo cidadão.

---

## 💡 A Solução Proposta

O **SaneaAlerta** foi concebido sob a arquitetura SaaS multisserviços, operando em duas frentes integradas:

### 1. Módulo Munícipe / Cidadão
* **Abertura Georreferenciada de Ocorrências:** Registro via coordenadas de GPS do dispositivo, busca automatizada por CEP (ViaCEP) ou marcação direta em mapa cartográfico interativo (Leaflet).
* **Catálogo Amplo de Zeladoria:** Suporte completo a demandas urbanas e rurais divididas em:
  * *Saneamento & Drenagem* (esgoto a céu aberto, adutoras rompidas, galerias entupidas).
  * *Vias Urbanas & Estradas Rurais* (pavimentação asfáltica, nivelamento de estradas de terra, pontes de madeira).
  * *Iluminação Pública* (pontos escuros, fiação caída, lâmpadas apagadas).
  * *Acessibilidade* (calçadas intransitáveis, ausência de piso tátil, rampas destruídas).
  * *Limpeza Urbana & Meio Ambiente* (pontos de descarte irregular de lixo, poda de árvores em rede elétrica).
* **Registro Fotográfico:** Captura de fotos com upload e conversão em Base64 para persistência sem custos de armazenamento externo.
* **Engajamento Comunitário:** Sistema de apoio popular aos chamados existentes com feedback tátil/visual imediato para sinalizar urgência coletiva.

### 2. Módulo Painel Web do Gestor Público
* **Triagem Automatizada via API SEI:** Cada chamado gera instantaneamente um número de Processo Administrativo rastreável no padrão do Sistema Eletrônico de Informações (`23067.xxxx/2026-xx`), eliminando a necessidade de triagem manual inicial.
* **Mapa de Calor (*Heatmap*):** Camada térmica de densidade (via `leaflet.heat`) permitindo à gestão pública identificar manchas críticas de acúmulo de falhas de infraestrutura.
* **Mesa de Despacho Operacional:** Painel de controle para atualização de status (*Pendente*, *Em Análise*, *Em Execução*, *Resolvido*) com inclusão de despachos fiscais e relatórios operacionais.
* **Dashboard de KPIs:** Monitoramento em tempo real de métricas-chave: taxa de resolução, volume de pendências, bairros sob maior impacto e chamados encaminhados a campo.

---

## Tecnologias Utilizadas

* **Frontend:** [React](https://react.dev/) + [Vite](https://vitejs.dev/)
* **Estilização e Design System:** [Tailwind CSS](https://tailwindcss.com/) 
* **Cartografia e Georreferenciamento:** [Leaflet](https://leafletjs.com/) e [Leaflet.heat](https://github.com/Leaflet/Leaflet.heat)
* **Serviços de Localização:** API pública ViaCEP e Nominatim (OpenStreetMap)
* **Persistência de Dados:** `localStorage` (simulando banco de dados cliente e chamadas assíncronas do SEI com custo zero)

---

## Instruções para Execução

### Pré-requisitos
Certifique-se de possuir instalado em sua máquina:
* [Node.js](https://nodejs.org/) (versão 18.x ou superior recomendada)
* Gerenciador de pacotes **npm**

### Passo a Passo

1. **Clonar ou acessar a pasta do repositório:**
   ```bash
   cd B:/SaneaAlerta/SaneaAlerta
2. Instalar as dependências do projeto:

Bash(Terminal)
npm install

3. Iniciar o servidor de desenvolvimento:

Bash
npm run dev

4. Acessar a aplicação:
Abra o seu navegador web no endereço indicado pelo terminal.

 Guia Rápido de Uso da Aplicação
Cadastro e Acesso: Realize o cadastro de morador ou login. *As credenciais e chamados são persistidos localmente no navegador*.

Alternância de Visão: No menu superior (Navbar), alterne entre:

Visão Munícipe: Para visualizar o feed, buscar ocorrências por setor/bairro, apoiar chamados e abrir novas ocorrências.

Mesa do Gestor: Para acessar os cartões de KPIs, chavear entre os pinos e o mapa de calor térmico, e despachar ordens de serviço na tabela operacional.

Abertura de Ocorrência: Clique no botão + Abrir Chamado, preencha os dados, capture o GPS ou posicione o pino no mapa, anexe uma imagem do dispositivo e confirme. O número de processo SEI será atribuído imediatamente.

