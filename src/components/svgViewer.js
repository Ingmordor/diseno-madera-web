/**
 * RENDERIZADOR SVG DINÁMICO DE SECCIONES TRANSVERSALES Y TENSIONES
 */

export function renderCrossSectionSVG(containerId, section, mode = 'seccion', results = null) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const w = 480;
  const h = 280;
  const cx = w / 2;
  const cy = h / 2;

  let content = '';

  if (mode === 'seccion') {
    if (section.tipo === 'tubo') {
      const D = parseFloat(section.D);
      const t = parseFloat(section.t);
      const scale = 1.35;
      const R = (D / 2) * scale;
      const r = Math.max(5, ((D - 2 * t) / 2) * scale);

      content = `
        <!-- Fondo reticular milimétrico -->
        <defs>
          <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" stroke-opacity="0.06" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#gridPattern)" />

        <!-- Sombra y textura leñosa del culmo de bambú -->
        <circle cx="${cx}" cy="${cy}" r="${R}" fill="#059669" fill-opacity="0.18" stroke="#059669" stroke-width="3.5" />
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="var(--background)" stroke="#059669" stroke-dasharray="3,2" stroke-width="1.8" />
        
        <!-- Fibras vasculares intermedias -->
        <circle cx="${cx}" cy="${cy}" r="${(R + r) / 2}" fill="none" stroke="#10b981" stroke-opacity="0.35" stroke-dasharray="2,5" stroke-width="7" />

        <!-- Ejes principales de inercia -->
        <line x1="${cx - R - 35}" y1="${cy}" x2="${cx + R + 35}" y2="${cy}" stroke="#059669" stroke-dasharray="5,3" stroke-width="1.5" />
        <line x1="${cx}" y1="${cy - R - 35}" x2="${cx}" y2="${cy + R + 35}" stroke="#059669" stroke-dasharray="5,3" stroke-width="1.5" />
        <text x="${cx + R + 40}" y="${cy + 4}" fill="#059669" font-size="11" font-family="monospace" font-weight="bold">X - X</text>
        <text x="${cx - 4}" y="${cy - R - 40}" fill="#059669" font-size="11" font-family="monospace" font-weight="bold">Y</text>

        <!-- Cotas -->
        <line x1="${cx}" y1="${cy}" x2="${cx + R * Math.cos(-Math.PI / 4)}" y2="${cy + R * Math.sin(-Math.PI / 4)}" stroke="currentColor" stroke-width="1.2" />
        <circle cx="${cx + R * Math.cos(-Math.PI / 4)}" cy="${cy + R * Math.sin(-Math.PI / 4)}" r="2.5" fill="currentColor" />
        <text x="${cx + 45}" y="${cy - 45}" fill="currentColor" font-size="11" font-family="monospace" font-weight="bold">Ø ext = ${D} mm</text>
        <text x="${cx + 10}" y="${cy - R - 12}" fill="#059669" font-size="11" font-family="monospace">Espesor t = ${t} mm</text>
      `;
    } else if (section.tipo === 'haz2') {
      const D = parseFloat(section.D);
      const t = parseFloat(section.t);
      const scale = 0.95;
      const R = (D / 2) * scale;
      const r = Math.max(5, ((D - 2 * t) / 2) * scale);
      const offset = R + 5;

      content = `
        <text x="${cx}" y="25" text-anchor="middle" fill="currentColor" font-size="12" font-weight="bold">Columna / Viga Bi-Culmo (2 Cañas Acopladas)</text>
        <!-- Culmo Izquierdo -->
        <circle cx="${cx - offset}" cy="${cy}" r="${R}" fill="#059669" fill-opacity="0.18" stroke="#059669" stroke-width="3" />
        <circle cx="${cx - offset}" cy="${cy}" r="${r}" fill="var(--background)" stroke="#059669" stroke-dasharray="3,2" stroke-width="1.5" />
        <!-- Culmo Derecho -->
        <circle cx="${cx + offset}" cy="${cy}" r="${R}" fill="#059669" fill-opacity="0.18" stroke="#059669" stroke-width="3" />
        <circle cx="${cx + offset}" cy="${cy}" r="${r}" fill="var(--background)" stroke="#059669" stroke-dasharray="3,2" stroke-width="1.5" />
        
        <!-- Perno de conexión pasante -->
        <line x1="${cx - offset - 15}" y1="${cy}" x2="${cx + offset + 15}" y2="${cy}" stroke="#eab308" stroke-width="4" stroke-linecap="round" />
        <circle cx="${cx - offset - 15}" cy="${cy}" r="5" fill="#ca8a04" />
        <circle cx="${cx + offset + 15}" cy="${cy}" r="5" fill="#ca8a04" />
        <text x="${cx}" y="${cy + 25}" text-anchor="middle" fill="#ca8a04" font-size="10" font-family="monospace font-weight-bold">Perno Pasante Grado 2</text>
      `;
    } else if (section.tipo === 'rect') {
      const b = parseFloat(section.b);
      const d = parseFloat(section.d);
      const scale = Math.min(200 / d, 250 / b);
      const wb = b * scale;
      const hd = d * scale;

      content = `
        <!-- Sección Rectangular en Madera Aserrada / Laminada -->
        <rect x="${cx - wb / 2}" y="${cy - hd / 2}" width="${wb}" height="${hd}" rx="4" fill="#d97706" fill-opacity="0.2" stroke="#d97706" stroke-width="2.5" />
        
        <!-- Líneas centroidales -->
        <line x1="${cx - wb / 2 - 25}" y1="${cy}" x2="${cx + wb / 2 + 25}" y2="${cy}" stroke="#059669" stroke-dasharray="4,3" stroke-width="1.5" />
        <line x1="${cx}" y1="${cy - hd / 2 - 25}" x2="${cx}" y2="${cy + hd / 2 + 25}" stroke="#059669" stroke-dasharray="4,3" stroke-width="1.5" />
        <text x="${cx + wb / 2 + 28}" y="${cy + 4}" fill="#059669" font-size="11" font-family="monospace">Eje X</text>

        <!-- Cotas -->
        <line x1="${cx - wb / 2}" y1="${cy + hd / 2 + 15}" x2="${cx + wb / 2}" y2="${cy + hd / 2 + 15}" stroke="currentColor" stroke-width="1" />
        <text x="${cx}" y="${cy + hd / 2 + 30}" text-anchor="middle" fill="currentColor" font-size="11" font-family="monospace font-weight-bold">b = ${b} mm</text>

        <line x1="${cx + wb / 2 + 15}" y1="${cy - hd / 2}" x2="${cx + wb / 2 + 15}" y2="${cy + hd / 2}" stroke="currentColor" stroke-width="1" />
        <text x="${cx + wb / 2 + 22}" y="${cy + 4}" fill="currentColor" font-size="11" font-family="monospace font-weight-bold">d = ${d} mm</text>
      `;
    }
  } else if (mode === 'esfuerzos') {
    content = `
      <!-- Diagrama de Esfuerzos Normales (σ) por Flexión -->
      <g transform="translate(40, 20)">
        <text x="70" y="15" text-anchor="middle" fill="currentColor" font-weight="bold" font-size="12">Distribución σ (Flexión)</text>
        <line x1="70" y1="35" x2="70" y2="215" stroke="currentColor" stroke-width="1.5" />
        <!-- Compresión Superior -->
        <polygon points="70,35 125,35 70,125" fill="#ef4444" fill-opacity="0.3" stroke="#ef4444" stroke-width="1.5" />
        <!-- Tracción Inferior -->
        <polygon points="70,215 15,215 70,125" fill="#3b82f6" fill-opacity="0.3" stroke="#3b82f6" stroke-width="1.5" />
        <text x="130" y="45" fill="#ef4444" font-size="10" font-family="monospace">Compresión (+σ)</text>
        <text x="15" y="230" fill="#3b82f6" font-size="10" font-family="monospace">Tracción (-σ)</text>
        <text x="75" y="128" fill="#10b981" font-size="10" font-family="monospace">E.N. (σ = 0)</text>
      </g>

      <!-- Diagrama de Esfuerzos Cortantes (τ) -->
      <g transform="translate(260, 20)">
        <text x="90" y="15" text-anchor="middle" fill="currentColor" font-weight="bold" font-size="12">Distribución τ (Cortante)</text>
        <line x1="90" y1="35" x2="90" y2="215" stroke="currentColor" stroke-width="1.5" />
        <!-- Parábola cortante -->
        <path d="M 90 35 Q 165 125 90 215 Z" fill="#10b981" fill-opacity="0.3" stroke="#10b981" stroke-width="1.5" />
        <text x="170" y="130" fill="#10b981" font-size="11" font-family="monospace" font-weight="bold">τ max</text>
        <text x="95" y="45" fill="currentColor" opacity="0.6" font-size="9" font-family="monospace">τ = 0</text>
        <text x="95" y="210" fill="currentColor" opacity="0.6" font-size="9" font-family="monospace">τ = 0</text>
      </g>
    `;
  }

  container.innerHTML = content;
}
