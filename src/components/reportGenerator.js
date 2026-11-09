/**
 * GENERADOR DE MEMORIAS Y REPORTES DE DISEÑO ESTRUCTURAL (NSR-10 TÍTULO G)
 * Diseñado conforme a los estándares técnicos y salidas del proyecto TRL3-DENDROCALAMUS
 */

import { MATERIALES, FACTORES_CD, FACTORES_CM } from '../constants.js';

/**
 * Genera el reporte técnico profesional en formato HTML.
 * Permite alternar entre memoria completa, resumen multi-elemento o ficha individual,
 * e incluye las imágenes y esquemas normativos del catálogo assets/images/.
 *
 * @param {Object} options Opciones de generación del reporte
 * @returns {string} Código HTML listo para visualización e impresión PDF
 */
export function generateReportHTML(options = {}) {
  const {
    modo = 'completo', // 'completo' | 'multielemento' | 'individual'
    incluirImagenes = true,
    proyecto = {
      nombre: 'DISEÑO DE ESTRUCTURAS EN BAMBÚ (TRL-3)',
      codigo: 'FLG1',
      archivo: '136-MC-PTC-MLFGL - TRL-3',
      disenador: 'Ingeniero Antonio Suarez Pirazan',
      email: 'jsuarez@gemalab.co',
      norma: 'NSR-10 Título G (Estructuras de Madera y Bambú)'
    },
    elementos = [],
    elementoActivo = null,
    material = MATERIALES.ES7,
    section = { tipo: 'tubo', D: 140, t: 14 }
  } = options;

  const fechaHoy = new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <div class="report-document text-gray-900 bg-white font-sans text-xs leading-relaxed max-w-5xl mx-auto space-y-6 print:space-y-4 print:text-[10px] print:p-0">
      
      <style>
        @media print {
          .page-break { page-break-before: always; break-before: page; }
          .avoid-break { page-break-inside: avoid; break-inside: avoid; }
          .no-print { display: none !important; }
          body { font-size: 10px; background: white !important; color: black !important; }
        }
        .report-table th, .report-table td {
          border: 1px solid #cbd5e1;
          padding: 5px 8px;
        }
        .report-table th {
          background-color: #f1f5f9;
          font-weight: 700;
          text-align: center;
        }
      </style>

      <!-- ======================================================== -->
      <!-- ENCABEZADO OFICIAL (Conforme a formato TRL-3 / NSR-10)    -->
      <!-- ======================================================== -->
      <header class="border-b-2 border-gray-900 pb-4 avoid-break">
        <div class="flex justify-between items-start gap-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-emerald-800 text-white rounded-lg flex items-center justify-center font-bold text-xl print:w-10 print:h-10">
              🎋
            </div>
            <div>
              <h1 class="text-base font-extrabold tracking-wide uppercase text-gray-900 print:text-sm">
                MEMORIA DE CÁLCULO Y VERIFICACIÓN ESTRUCTURAL
              </h1>
              <p class="text-emerald-800 font-semibold text-xs print:text-[11px]">
                ${proyecto.norma} — Bambú (<em>Dendrocalamus asper</em>) y Maderas
              </p>
              <p class="text-gray-500 text-[11px]">Sistema DENDRO-STRUCT / TRL-3 Dendrocalamus</p>
            </div>
          </div>
          <div class="text-right text-[11px] font-mono bg-gray-50 p-2.5 rounded border border-gray-200">
            <div><strong class="text-gray-700">Proyecto:</strong> ${proyecto.codigo}</div>
            <div><strong class="text-gray-700">Archivo:</strong> ${proyecto.archivo}</div>
            <div><strong class="text-gray-700">Fecha:</strong> ${fechaHoy}</div>
            <div><strong class="text-gray-700">Diseñó:</strong> ${proyecto.disenador}</div>
          </div>
        </div>
      </header>

      ${modo === 'completo' || modo === 'individual' ? renderSeccionTeorica(material, incluirImagenes) : ''}

      ${modo === 'completo' || modo === 'multielemento' ? renderSeccionMultiElemento(elementos, incluirImagenes) : ''}

      ${(modo === 'completo' || modo === 'individual') && elementoActivo ? renderFichaDetallada(elementoActivo, material, incluirImagenes) : ''}

      ${modo === 'completo' && incluirImagenes ? renderGaleriaProyecto() : ''}

      <!-- ======================================================== -->
      <!-- FIRMAS DE RESPONSABILIDAD PROFESIONAL                    -->
      <!-- ======================================================== -->
      <footer class="pt-8 border-t-2 border-gray-800 avoid-break">
        <div class="grid grid-cols-2 gap-8 text-[11px]">
          <div>
            <h4 class="font-bold text-gray-900 uppercase mb-1">Notas Técnicas y Responsabilidad:</h4>
            <p class="text-gray-600 text-[10px] leading-normal">
              Esta memoria de cálculo ha sido generada bajo los lineamientos del Reglamento Colombiano de Construcción
              Sismo Resistente NSR-10 Título G. Las propiedades mecánicas del bambú <em>Dendrocalamus asper</em> (ES7)
              corresponden a probetas ensayadas a escala natural y calibradas según la hoja oficial TRL3-DENDROCALAMUS.
            </p>
          </div>
          <div class="flex flex-col items-center justify-end text-center">
            <div class="w-64 border-b border-gray-800 mb-1.5"></div>
            <p class="font-bold text-gray-900">${proyecto.disenador}</p>
            <p class="text-gray-600 text-[10px]">Ingeniero Estructural — Matrícula Profesional</p>
            <p class="text-gray-500 text-[9px]">${proyecto.email}</p>
          </div>
        </div>
      </footer>

    </div>
  `;
}

/**
 * SECCIÓN 1: PROPIEDADES MECÁNICAS Y FACTORES DE MODIFICACIÓN
 */
function renderSeccionTeorica(mat, incluirImagenes) {
  return `
    <section class="space-y-4 avoid-break">
      <div class="bg-gray-100 px-3 py-1.5 border-l-4 border-emerald-700 font-bold text-gray-800 text-xs uppercase">
        1. Propiedades Mecánicas del Bambú (NSR-10 G.2) y Factores de Modificación
      </div>

      <!-- Tabla de Esfuerzos Admisibles Base -->
      <div>
        <p class="text-gray-700 font-semibold mb-1 text-[11px]">
          1.1 Esfuerzos Admisibles Base ($F_i$) a Contenido de Humedad CH = 12% (MPa) y Módulos Elásticos ($E_i$):
        </p>
        <table class="report-table w-full text-center text-[11px]">
          <thead>
            <tr>
              <th rowspan="2">Grupo / Especie</th>
              <th colspan="5">Esfuerzos Admisibles Base $F_i$ (MPa)</th>
              <th colspan="3">Módulos de Elasticidad Longitudinal $E_i$ (MPa)</th>
            </tr>
            <tr>
              <th>Flexión ($F_b$)</th>
              <th>Tensión ($F_t$)</th>
              <th>Compresión $\\parallel$ ($F_c$)</th>
              <th>Compresión $\\perp$ ($F_p$)</th>
              <th>Cortante ($F_v$)</th>
              <th>Promedio ($E_{0.5}$)</th>
              <th>5° Percentil ($E_{0.05}$)</th>
              <th>Mínimo ($E_{min}$)</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-emerald-50/50 font-bold text-emerald-950">
              <td class="text-left font-bold">${mat.codigo} — ${mat.nombre}</td>
              <td>${mat.fb.toFixed(1)}</td>
              <td>${mat.ft.toFixed(1)}</td>
              <td>${mat.fc.toFixed(1)}</td>
              <td>${mat.fp.toFixed(1)}</td>
              <td>${mat.fv.toFixed(1)}</td>
              <td>${mat.e05.toLocaleString()}</td>
              <td>${mat.e005.toLocaleString()}</td>
              <td>${mat.emin.toLocaleString()}</td>
            </tr>
            <tr class="text-gray-600">
              <td class="text-left">ES1 — NSR-10 Maderas Duras (Grupo A)</td>
              <td>15.0</td><td>18.0</td><td>14.0</td><td>1.4</td><td>1.2</td>
              <td>9,500</td><td>7,500</td><td>4,000</td>
            </tr>
            <tr class="text-gray-600">
              <td class="text-left">ES2 — Madera Laminada (K.T.)</td>
              <td>89.7</td><td>1.4</td><td>65.7</td><td>9.3</td><td>5.1</td>
              <td>23,674</td><td>13,250</td><td>7,130</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Resumen de Factores Modificadores -->
      <div class="grid grid-cols-2 gap-3 text-[11px]">
        <div class="p-2.5 rounded border border-gray-200 bg-gray-50/70">
          <h4 class="font-bold text-gray-900 border-b border-gray-200 pb-1 mb-1.5">Factores de Modificación Ambiental y Uso:</h4>
          <ul class="space-y-1 text-gray-700">
            <li>• <strong>$C_D$ (Duración de la carga):</strong> 0.90 Permanente, 1.00 Viva, 1.60 Sismo/Viento, 2.00 Impacto.</li>
            <li>• <strong>$C_m$ (Contenido de humedad):</strong> 1.00 para $CH \\le 12\\%$, 0.91 para $14\\%$, 0.70 para $\\ge 19\\%$.</li>
            <li>• <strong>$C_t$ (Temperatura):</strong> 1.00 para $T \\le 37.8^\\circ\\text{C}$ servicio seco/húmedo.</li>
            <li>• <strong>$C_{in}$ (Incisiones):</strong> 1.00 sin perforación previa, 0.80 con tratamientos punzonados.</li>
          </ul>
        </div>
        <div class="p-2.5 rounded border border-gray-200 bg-gray-50/70">
          <h4 class="font-bold text-gray-900 border-b border-gray-200 pb-1 mb-1.5">Factores de Estabilidad y Apoyos:</h4>
          <ul class="space-y-1 text-gray-700">
            <li>• <strong>$C_p$ (Estabilidad de columna):</strong> Ecuación NSR-10 G.4-2 con parámetro $c = 0.85$ (Bambú / Rolliza).</li>
            <li>• <strong>$C_L$ (Estabilidad de viga):</strong> Verificación de vuelco lateral según relación $d/b$ y arriostramiento.</li>
            <li>• <strong>$K_e$ (Longitud efectiva):</strong> 1.00 Articulado-Articulado, 0.80 Empotrado-Articulado, 0.65 Empotrado.</li>
            <li>• <strong>$C_b$ (Área de apoyo / Aplastamiento):</strong> Factores de mayoración para apoyos cortos $\\le 150\\text{ mm}$.</li>
          </ul>
        </div>
      </div>

      ${incluirImagenes ? `
      <!-- Esquemas Normativos de Apoyos y Columnas -->
      <div class="grid grid-cols-3 gap-3 pt-1 avoid-break">
        <div class="border border-gray-200 rounded p-2 text-center bg-white">
          <img src="assets/images/normativa/factores_k_longitud_efectiva.png" alt="Factores K NSR-10" class="max-h-36 mx-auto object-contain" />
          <span class="text-[9px] text-gray-500 block mt-1 font-semibold">NSR-10 G.4.3.2: Factores de Longitud Efectiva Ke</span>
        </div>
        <div class="border border-gray-200 rounded p-2 text-center bg-white">
          <img src="assets/images/formulas/formula_estabilidad_columnas_cp.png" alt="Fórmula Cp" class="max-h-36 mx-auto object-contain" />
          <span class="text-[9px] text-gray-500 block mt-1 font-semibold">NSR-10 G.4.3.5: Estabilidad de Columnas Cp y FcE</span>
        </div>
        <div class="border border-gray-200 rounded p-2 text-center bg-white">
          <img src="assets/images/formulas/formula_interaccion_biaxial_g52.png" alt="Interacción Biaxial" class="max-h-36 mx-auto object-contain" />
          <span class="text-[9px] text-gray-500 block mt-1 font-semibold">NSR-10 G.5.2: Ecuación Interacción Biaxial</span>
        </div>
      </div>
      ` : ''}

    </section>
  `;
}

/**
 * SECCIÓN 2: SALIDA MULTI-ELEMENTO (TABLA GENERAL DE ELEMENTOS DE BAMBÚ Y MADERA)
 * Equivalente a las páginas 41 a 59 del documento oficial TRL3-DENDROCALAMUS COLUMNAS.pdf
 */
function renderSeccionMultiElemento(elementos, incluirImagenes) {
  if (!elementos || elementos.length === 0) {
    return `
      <section class="space-y-3 avoid-break">
        <div class="bg-gray-100 px-3 py-1.5 border-l-4 border-emerald-700 font-bold text-gray-800 text-xs uppercase">
          2. Resumen General de Elementos de Bambú (Diseño Multi-Elemento)
        </div>
        <p class="text-gray-500 italic p-3 text-center border rounded">
          No hay elementos en la lista multi-elemento. Agregue columnas o elementos desde el módulo superior.
        </p>
      </section>
    `;
  }

  return `
    <section class="space-y-3 avoid-break">
      <div class="flex justify-between items-center bg-gray-100 px-3 py-1.5 border-l-4 border-emerald-700 font-bold text-gray-800 text-xs uppercase">
        <span>2. Resumen General de Elementos y Verificación de Estados Límite (NSR-10 G.4 y G.5)</span>
        <span class="text-[10px] text-gray-600 font-normal">Total: ${elementos.length} Elementos</span>
      </div>

      <!-- Tabla 1: Ratios DCR y Veredicto Final -->
      <div>
        <h4 class="font-bold text-gray-900 text-[11px] mb-1">
          2.1 Tabla de Ratios de Demanda / Capacidad (DCR) y Evaluación de Confortabilidad:
        </h4>
        <div class="overflow-x-auto">
          <table class="report-table w-full text-center text-[10px]">
            <thead>
              <tr>
                <th class="text-left">Nombre</th>
                <th>Sección</th>
                <th>Material</th>
                <th>Esbeltez (λ)</th>
                <th>Cp</th>
                <th>Pn (kN)</th>
                <th>Pa (kN)</th>
                <th>DCR Axial (Pa/Pn)</th>
                <th>Mn (kN·m)</th>
                <th>Ma (kN·m)</th>
                <th>DCR Flex (Ma/Mn)</th>
                <th>RBI (G.5.2)</th>
                <th>Veredicto</th>
              </tr>
            </thead>
            <tbody>
              ${elementos.map(el => {
                const axialPct = (el.dcrAxial * 100).toFixed(1);
                const flexPct = (el.dcrFlex * 100).toFixed(1);
                const rbiVal = el.rbi.toFixed(3);
                const pasa = el.cumple;
                return `
                  <tr class="${pasa ? '' : 'bg-red-50 text-red-950 font-semibold'}">
                    <td class="text-left font-bold text-gray-900">${el.nombre}</td>
                    <td>${el.seccionTexto}</td>
                    <td>${el.materialCodigo}</td>
                    <td>${el.lambda.toFixed(1)} ${el.lambda <= 50 ? '✓' : '⚠️'}</td>
                    <td>${el.Cp.toFixed(3)}</td>
                    <td class="font-mono">${el.Pn.toFixed(1)}</td>
                    <td class="font-mono">${el.Pa.toFixed(1)}</td>
                    <td class="font-bold font-mono ${el.dcrAxial <= 1.0 ? 'text-emerald-700' : 'text-red-600'}">
                      ${axialPct}%
                    </td>
                    <td class="font-mono">${el.Mn.toFixed(2)}</td>
                    <td class="font-mono">${el.Ma1.toFixed(2)}</td>
                    <td class="font-bold font-mono ${el.dcrFlex <= 1.0 ? 'text-emerald-700' : 'text-red-600'}">
                      ${flexPct}%
                    </td>
                    <td class="font-bold font-mono ${el.rbi <= 1.0 ? 'text-emerald-700' : 'text-red-600'}">
                      ${rbiVal}
                    </td>
                    <td>
                      <span class="px-1.5 py-0.5 rounded text-[9px] font-bold ${pasa ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}">
                        ${pasa ? 'OK' : 'SOBREESFUERZO'}
                      </span>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tabla 2: Fuerzas y Momentos Actuantes -->
      <div class="avoid-break pt-2">
        <h4 class="font-bold text-gray-900 text-[11px] mb-1">
          2.2 Solicitaciones y Esfuerzos Actuantes en Cada Elemento:
        </h4>
        <div class="overflow-x-auto">
          <table class="report-table w-full text-center text-[10px]">
            <thead>
              <tr>
                <th class="text-left">Nombre</th>
                <th>Longitud (L)</th>
                <th>Ke</th>
                <th>Pa (kN)</th>
                <th>Ma1 (kN·m)</th>
                <th>Ma2 (kN·m)</th>
                <th>Va1 (kN)</th>
                <th>Va2 (kN)</th>
                <th>fc (MPa)</th>
                <th>fb1 (MPa)</th>
                <th>fb2 (MPa)</th>
                <th>F'c (MPa)</th>
                <th>FcE1 (MPa)</th>
              </tr>
            </thead>
            <tbody>
              ${elementos.map(el => `
                <tr>
                  <td class="text-left font-bold text-gray-900">${el.nombre}</td>
                  <td>${el.L.toFixed(2)} m</td>
                  <td>${el.Ke.toFixed(2)}</td>
                  <td class="font-mono">${el.Pa.toFixed(1)}</td>
                  <td class="font-mono">${el.Ma1.toFixed(2)}</td>
                  <td class="font-mono">${el.Ma2.toFixed(2)}</td>
                  <td class="font-mono">${el.Va1.toFixed(2)}</td>
                  <td class="font-mono">${el.Va2.toFixed(2)}</td>
                  <td class="font-mono">${el.fc.toFixed(2)}</td>
                  <td class="font-mono">${el.fb1.toFixed(2)}</td>
                  <td class="font-mono">${el.fb2.toFixed(2)}</td>
                  <td class="font-mono">${el.Fc_adm.toFixed(2)}</td>
                  <td class="font-mono">${el.FcE1.toFixed(1)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `;
}

/**
 * SECCIÓN 3: MEMORIA DETALLADA POR ELEMENTO INDIVIDUAL (PASO A PASO)
 */
function renderFichaDetallada(item, material, incluirImagenes) {
  return `
    <div class="page-break"></div>
    <section class="space-y-4">
      <div class="bg-gray-100 px-3 py-1.5 border-l-4 border-emerald-700 font-bold text-gray-800 text-xs uppercase flex justify-between items-center">
        <span>3. Ficha Técnica Detallada de Elemento: ${item.nombre}</span>
        <span class="text-xs font-mono font-bold text-emerald-800">${item.seccionTexto}</span>
      </div>

      <!-- Resumen Geométrico y Mecánico -->
      <div class="grid grid-cols-3 gap-3 text-[11px] avoid-break">
        <div class="p-3 bg-gray-50 border border-gray-200 rounded">
          <h4 class="font-bold text-gray-900 border-b pb-1 mb-1.5">Geometría de la Sección:</h4>
          <p>• <strong>Tipo:</strong> ${item.seccionTexto}</p>
          <p>• <strong>Área Neta ($A_n$):</strong> ${(item.geom.Aneta / 100).toFixed(1)} cm²</p>
          <p>• <strong>Radio de Giro Mínimo ($r_{min}$):</strong> ${(item.geom.rx / 10).toFixed(2)} cm</p>
          <p>• <strong>Inercia ($I_x$):</strong> ${Math.round(item.geom.Ix / 10000).toLocaleString()} cm⁴</p>
          <p>• <strong>Módulo ($S_x$):</strong> ${(item.geom.Sx / 1000).toFixed(1)} cm³</p>
        </div>

        <div class="p-3 bg-gray-50 border border-gray-200 rounded">
          <h4 class="font-bold text-gray-900 border-b pb-1 mb-1.5">Estabilidad y Esbeltez (G.4.3):</h4>
          <p>• <strong>Longitud no soportada ($L_u$):</strong> ${item.L.toFixed(2)} m</p>
          <p>• <strong>Factor de longitud ($K_e$):</strong> ${item.Ke.toFixed(2)}</p>
          <p>• <strong>Longitud efectiva ($L_e$):</strong> ${(item.L * item.Ke).toFixed(2)} m</p>
          <p>• <strong>Esbeltez $(\\lambda = L_e/r)$:</strong> ${item.lambda.toFixed(1)} (Límite $\\le 50$)</p>
          <p>• <strong>Factor Estabilidad ($C_p$):</strong> ${item.Cp.toFixed(3)}</p>
        </div>

        <div class="p-3 bg-gray-50 border border-gray-200 rounded">
          <h4 class="font-bold text-gray-900 border-b pb-1 mb-1.5">Resistencia y Capacidad Admisible:</h4>
          <p>• <strong>Esfuerzo Euler ($F_{cE}$):</strong> ${item.FcE1.toFixed(2)} MPa</p>
          <p>• <strong>Esfuerzo Base Modificado ($F^*_c$):</strong> ${(item.Fc_adm / (item.Cp || 1)).toFixed(2)} MPa</p>
          <p>• <strong>Esfuerzo Admisible ($F'_c$):</strong> ${item.Fc_adm.toFixed(2)} MPa</p>
          <p>• <strong>Capacidad Admisible ($P_n$):</strong> ${item.Pn.toFixed(1)} kN</p>
          <p>• <strong>Momento Admisible ($M_n$):</strong> ${item.Mn.toFixed(2)} kN·m</p>
        </div>
      </div>

      <!-- Tabla de Verificación de Solicitaciones -->
      <div class="avoid-break">
        <h4 class="font-bold text-gray-900 text-[11px] mb-1">
          Verificación de Estados Límite de Resistencia:
        </h4>
        <table class="report-table w-full text-center text-[11px]">
          <thead>
            <tr>
              <th class="text-left">Efecto / Estado Límite</th>
              <th>Solicitación Actuante</th>
              <th>Capacidad Admisible</th>
              <th>Ratio DCR</th>
              <th>Evaluación NSR-10</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-left font-medium">Compresión Axial ($P_a \\le P_n$)</td>
              <td class="font-mono">${item.Pa.toFixed(1)} kN</td>
              <td class="font-mono">${item.Pn.toFixed(1)} kN</td>
              <td class="font-bold font-mono ${item.dcrAxial <= 1.0 ? 'text-emerald-700' : 'text-red-600'}">
                ${(item.dcrAxial * 100).toFixed(1)}%
              </td>
              <td class="font-bold ${item.dcrAxial <= 1.0 ? 'text-emerald-700' : 'text-red-600'}">
                ${item.dcrAxial <= 1.0 ? 'CUMPLE' : 'SOBREESFUERZO'}
              </td>
            </tr>
            <tr>
              <td class="text-left font-medium">Flexión Fuerte ($M_{a1} \\le M_{n1}$)</td>
              <td class="font-mono">${item.Ma1.toFixed(2)} kN·m</td>
              <td class="font-mono">${item.Mn.toFixed(2)} kN·m</td>
              <td class="font-bold font-mono ${item.dcrFlex <= 1.0 ? 'text-emerald-700' : 'text-red-600'}">
                ${(item.dcrFlex * 100).toFixed(1)}%
              </td>
              <td class="font-bold ${item.dcrFlex <= 1.0 ? 'text-emerald-700' : 'text-red-600'}">
                ${item.dcrFlex <= 1.0 ? 'CUMPLE' : 'SOBREESFUERZO'}
              </td>
            </tr>
            <tr>
              <td class="text-left font-medium">Cortante Actuante ($V_a \\le V_n$)</td>
              <td class="font-mono">${Math.hypot(item.Va1, item.Va2).toFixed(2)} kN</td>
              <td class="font-mono">${item.Vn.toFixed(2)} kN</td>
              <td class="font-bold font-mono text-emerald-700">
                ${((Math.hypot(item.Va1, item.Va2) / item.Vn) * 100).toFixed(1)}%
              </td>
              <td class="font-bold">${Math.hypot(item.Va1, item.Va2) <= item.Vn ? "CUMPLE" : "SOBREESFUERZO"}</td>
            </tr>
            <tr class="bg-gray-50 font-bold">
              <td class="text-left">Interacción Biaxial NSR-10 G.5.2</td>
              <td colspan="2" class="text-center font-mono">Índice Total = ${item.rbi.toFixed(3)}</td>
              <td class="font-mono text-center ${item.rbi <= 1.0 ? 'text-emerald-700' : 'text-red-600'}">
                ${(item.rbi * 100).toFixed(1)}%
              </td>
              <td class="${item.rbi <= 1.0 ? 'text-emerald-700' : 'text-red-600'}">
                ${item.rbi <= 1.0 ? 'CUMPLE G.5.2' : 'FALLA INTERACCIÓN'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      ${incluirImagenes ? `
      <!-- Esquema visual de sección y fórmulas aplicables -->
      <div class="grid grid-cols-2 gap-4 pt-2 avoid-break">
        <div class="border border-gray-200 rounded p-2 text-center bg-white">
          <img src="assets/images/secciones/tipos_secciones_geometria.png" alt="Geometría" class="max-h-36 mx-auto object-contain" />
          <span class="text-[9px] text-gray-500 block mt-1">Ejes Principales y Dimensiones de la Sección</span>
        </div>
        <div class="border border-gray-200 rounded p-2 text-center bg-white">
          <img src="assets/images/formulas/formula_hankinson.png" alt="Fórmula Hankinson" class="max-h-36 mx-auto object-contain" />
          <span class="text-[9px] text-gray-500 block mt-1">NSR-10 G.3.5.2: Fórmula de Hankinson para Cargas Inclinadas</span>
        </div>
      </div>
      ` : ''}

    </section>
  `;
}

/**
 * SECCIÓN 4: GALERÍA DE PROYECTO Y MODELO ESTRUCTURAL
 */
function renderGaleriaProyecto() {
  return `
    <div class="page-break"></div>
    <section class="space-y-3 avoid-break">
      <div class="bg-gray-100 px-3 py-1.5 border-l-4 border-emerald-700 font-bold text-gray-800 text-xs uppercase">
        4. Modelo Estructural Tridimensional y Configuración Constructiva
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div class="border border-gray-200 rounded-lg p-2.5 text-center bg-white shadow-sm">
          <img src="assets/images/proyecto/modelo_estructural_3d.jpg" alt="Modelo 3D" class="rounded max-h-56 mx-auto object-contain" />
          <p class="text-[10px] text-gray-600 mt-2 font-medium">
            Figura 4.1: Modelo analítico por elementos finitos del pórtico en bambú <em>Dendrocalamus asper</em>.
          </p>
        </div>
        <div class="border border-gray-200 rounded-lg p-2.5 text-center bg-white shadow-sm">
          <img src="assets/images/proyecto/portico_estructural_bambu.jpg" alt="Pórtico Estructural" class="rounded max-h-56 mx-auto object-contain" />
          <p class="text-[10px] text-gray-600 mt-2 font-medium">
            Figura 4.2: Prototipo estructural ensayado y configuración de uniones pasantes con pernos de 1/2".
          </p>
        </div>
      </div>
    </section>
  `;
}
