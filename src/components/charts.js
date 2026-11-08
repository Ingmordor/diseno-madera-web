/**
 * RENDERIZADOR DE DIAGRAMAS DE SOLICITACIONES Y CURVAS DE CAPACIDAD
 */

export function renderBeamDiagramsSVG(containerId, results) {
  const container = document.getElementById(containerId);
  if (!container || !results) return;

  const { solicitaciones, actuantes } = results;
  const Mu = solicitaciones.Mu.toFixed(2);
  const Vu = solicitaciones.Vu.toFixed(2);
  const delta = actuantes.delta_mm.toFixed(1);

  container.innerHTML = `
    <!-- DIAGRAMA DE MOMENTO FLECTOR M(x) -->
    <g transform="translate(40, 20)">
      <text x="180" y="15" text-anchor="middle" fill="currentColor" font-weight="bold" font-size="11">Momento Flector M(x) [kN·m]</text>
      <line x1="30" y1="50" x2="350" y2="50" stroke="currentColor" stroke-width="1.2" opacity="0.6" />
      <!-- Parábola flectora -->
      <path d="M 30 50 Q 190 115 350 50 Z" fill="#3b82f6" fill-opacity="0.25" stroke="#3b82f6" stroke-width="2" />
      <text x="190" y="100" text-anchor="middle" fill="#3b82f6" font-size="11" font-family="monospace" font-weight="bold">Mmax = ${Mu} kN·m</text>
      <!-- Apoyos simples -->
      <polygon points="25,50 35,50 30,42" fill="currentColor" />
      <polygon points="345,50 355,50 350,42" fill="currentColor" />
    </g>

    <!-- DIAGRAMA DE CORTANTE V(x) -->
    <g transform="translate(40, 140)">
      <text x="180" y="15" text-anchor="middle" fill="currentColor" font-weight="bold" font-size="11">Fuerza Cortante V(x) [kN]</text>
      <line x1="30" y1="55" x2="350" y2="55" stroke="currentColor" stroke-width="1.2" opacity="0.6" />
      <!-- Diagrama triangular cortante -->
      <polygon points="30,55 30,25 190,55" fill="#10b981" fill-opacity="0.25" stroke="#10b981" stroke-width="1.5" />
      <polygon points="190,55 350,85 350,55" fill="#10b981" fill-opacity="0.25" stroke="#10b981" stroke-width="1.5" />
      <text x="35" y="38" fill="#10b981" font-size="10" font-family="monospace font-weight-bold">+Vu = ${Vu} kN</text>
      <text x="290" y="80" fill="#10b981" font-size="10" font-family="monospace font-weight-bold">-Vu = -${Vu} kN</text>
    </g>
  `;
}

export function renderColumnCapacitySVG(containerId, L, Padm, Pu) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const w = 480;
  const h = 240;

  // Escalas
  const maxL = 6.0;
  const maxP = Math.max(Padm * 1.3, Pu * 1.5, 100);

  const xPos = 60 + (L / maxL) * 380;
  const yPos = 200 - (Pu / maxP) * 160;

  container.innerHTML = `
    <!-- Ejes -->
    <line x1="60" y1="200" x2="450" y2="200" stroke="currentColor" stroke-width="1.5" />
    <line x1="60" y1="25" x2="60" y2="200" stroke="currentColor" stroke-width="1.5" />
    <text x="410" y="215" fill="currentColor" font-size="10">Altura L (m)</text>
    <text x="25" y="30" fill="currentColor" font-size="10" transform="rotate(-90 25,30)">Capacidad Padm (kN)</text>

    <!-- Curva de Euler / Capacidad NSR-10 -->
    <path d="M 70 45 Q 180 85 440 185" fill="none" stroke="#059669" stroke-width="2.5" />
    <text x="300" y="95" fill="#059669" font-size="10" font-weight="bold">Curva Padm(L) NSR-10</text>

    <!-- Punto de operación actual -->
    <circle cx="${xPos}" cy="${yPos}" r="6" fill="${Pu <= Padm ? '#059669' : '#ef4444'}" stroke="#ffffff" stroke-width="2" />
    <line x1="${xPos}" y1="${yPos}" x2="${xPos}" y2="200" stroke="#ef4444" stroke-dasharray="3,3" stroke-width="1" />
    <line x1="60" y1="${yPos}" x2="${xPos}" y2="${yPos}" stroke="#ef4444" stroke-dasharray="3,3" stroke-width="1" />
    
    <text x="${xPos + 10}" y="${yPos - 5}" fill="${Pu <= Padm ? '#059669' : '#ef4444'}" font-size="11" font-weight="bold">Pu = ${Pu} kN</text>
    <text x="${xPos}" y="215" text-anchor="middle" fill="currentColor" font-size="10">L = ${L} m</text>
  `;
}

export function renderPMSurfaceSVG(containerId, P, Mx, ratioTotal) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const Pcap = 110;
  const MxCap = 7.5;

  const xPt = 70 + (Mx / MxCap) * 260;
  const yPt = 200 - (P / Pcap) * 150;

  container.innerHTML = `
    <!-- Ejes P - M -->
    <line x1="70" y1="200" x2="440" y2="200" stroke="currentColor" stroke-width="1.5" />
    <line x1="70" y1="25" x2="70" y2="200" stroke="currentColor" stroke-width="1.5" />
    <text x="375" y="215" fill="currentColor" font-size="10">Momento M (kN·m)</text>
    <text x="30" y="30" fill="currentColor" font-size="10" transform="rotate(-90 30,30)">Axial P (kN)</text>

    <!-- Superficie Envolvente Elíptica NSR-10 G.5.2 -->
    <path d="M 70 45 Q 310 55 380 200 Z" fill="#059669" fill-opacity="0.15" stroke="#059669" stroke-width="2.2" />
    <text x="260" y="75" fill="#059669" font-size="10" font-weight="bold">Límite Normativo G.5 (Ratio = 1.0)</text>

    <!-- Punto de Demanda Actual -->
    <circle cx="${xPt}" cy="${yPt}" r="6.5" fill="${ratioTotal <= 1.0 ? '#059669' : '#ef4444'}" stroke="#ffffff" stroke-width="2" />
    <text x="${xPt + 10}" y="${yPt - 4}" fill="${ratioTotal <= 1.0 ? '#059669' : '#ef4444'}" font-size="11" font-weight="bold">
      Demanda (M=${Mx}, P=${P}) [Ratio: ${ratioTotal.toFixed(2)}]
    </text>
  `;
}
