/**
 * GENERADOR DE MEMORIAS DE CÁLCULO ESTRUCTURAL (NSR-10)
 */

export function generateReportHTML(beamResults, colResults, biaxialResults, material, section) {
  const dateStr = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
  const geom = beamResults ? beamResults.geom : (colResults ? colResults.geom : {});

  return `
    <div class="space-y-4 text-xs font-sans text-gray-800">
      <!-- Encabezado Memoria -->
      <div class="border-b-2 border-gray-900 pb-3 flex justify-between items-end">
        <div>
          <h2 class="text-base font-extrabold uppercase text-gray-900 tracking-wide">Memoria de Verificación Estructural</h2>
          <p class="text-gray-600">Proyecto: Diseño de Secciones en Madera & Bambú | Archivo: TRL3-DENDROCALAMUS</p>
        </div>
        <div class="text-right">
          <p class="font-bold text-gray-900">Normativa: NSR-10 Título G</p>
          <p class="text-gray-500 text-[11px]">${dateStr}</p>
        </div>
      </div>

      <!-- Cuadros de Datos -->
      <div class="grid grid-cols-2 gap-4">
        <!-- 1. Material -->
        <div class="p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 class="font-bold text-gray-900 mb-1 border-b pb-1">1. Material Estructural:</h3>
          <p>• <strong>Especie / Grupo:</strong> ${material.nombre}</p>
          <p>• <strong>Flexión Base (Fb):</strong> ${material.fb.toFixed(2)} MPa</p>
          <p>• <strong>Compresión Base (Fc):</strong> ${material.fc.toFixed(2)} MPa</p>
          <p>• <strong>Cortante Base (Fv):</strong> ${material.fv.toFixed(2)} MPa</p>
          <p>• <strong>Módulo Elástico (E0.5 / Emin):</strong> ${material.e05.toLocaleString()} / ${material.emin.toLocaleString()} MPa</p>
        </div>

        <!-- 2. Geometría -->
        <div class="p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 class="font-bold text-gray-900 mb-1 border-b pb-1">2. Propiedades de la Sección:</h3>
          <p>• <strong>Tipo:</strong> ${section.tipo === 'tubo' ? 'Culmo Tubular de Bambú' : (section.tipo === 'rect' ? 'Rectangular Aserrada' : section.tipo)}</p>
          <p>• <strong>Dimensiones:</strong> ${section.tipo === 'tubo' ? `Ø ext = ${section.D} mm, t = ${section.t} mm` : `b = ${section.b} mm, d = ${section.d} mm`}</p>
          <p>• <strong>Área Neta:</strong> ${(geom.Area / 100).toFixed(1)} cm²</p>
          <p>• <strong>Momento de Inercia (Ix):</strong> ${Math.round(geom.Ix / 10000).toLocaleString()} cm⁴</p>
          <p>• <strong>Módulo de Sección (Sx):</strong> ${(geom.Sx / 1000).toFixed(1)} cm³</p>
        </div>
      </div>

      <!-- 3. Tabla de Verificaciones -->
      <div>
        <h3 class="font-bold text-gray-900 mb-2">3. Resumen de Estados Límite y Verificaciones (NSR-10):</h3>
        <table class="w-full text-left border-collapse border border-gray-300">
          <thead class="bg-gray-100 text-gray-800">
            <tr>
              <th class="border border-gray-300 p-2">Estado Límite</th>
              <th class="border border-gray-300 p-2">Solicitación Actuante</th>
              <th class="border border-gray-300 p-2">Capacidad Admisible</th>
              <th class="border border-gray-300 p-2">Ratio DCR</th>
              <th class="border border-gray-300 p-2">Resultado</th>
            </tr>
          </thead>
          <tbody>
            ${beamResults ? `
            <tr>
              <td class="border border-gray-300 p-2 font-medium">Flexión (fb ≤ F'b)</td>
              <td class="border border-gray-300 p-2">${beamResults.actuantes.fb_act.toFixed(2)} MPa</td>
              <td class="border border-gray-300 p-2">${beamResults.admisibles.F_b_adm.toFixed(2)} MPa</td>
              <td class="border border-gray-300 p-2 font-bold ${beamResults.dcr.flex <= 1 ? 'text-emerald-700' : 'text-red-600'}">
                ${(beamResults.dcr.flex * 100).toFixed(1)}%
              </td>
              <td class="border border-gray-300 p-2 font-bold ${beamResults.dcr.flex <= 1 ? 'text-emerald-700' : 'text-red-600'}">
                ${beamResults.dcr.flex <= 1 ? 'CUMPLE' : 'SOBREESFUERZO'}
              </td>
            </tr>
            <tr>
              <td class="border border-gray-300 p-2 font-medium">Cortante (fv ≤ F'v)</td>
              <td class="border border-gray-300 p-2">${beamResults.actuantes.fv_act.toFixed(2)} MPa</td>
              <td class="border border-gray-300 p-2">${beamResults.admisibles.F_v_adm.toFixed(2)} MPa</td>
              <td class="border border-gray-300 p-2 font-bold ${beamResults.dcr.cort <= 1 ? 'text-emerald-700' : 'text-red-600'}">
                ${(beamResults.dcr.cort * 100).toFixed(1)}%
              </td>
              <td class="border border-gray-300 p-2 font-bold ${beamResults.dcr.cort <= 1 ? 'text-emerald-700' : 'text-red-600'}">
                ${beamResults.dcr.cort <= 1 ? 'CUMPLE' : 'SOBREESFUERZO'}
              </td>
            </tr>
            <tr>
              <td class="border border-gray-300 p-2 font-medium">Deflexión Elástica (Δ ≤ L/240)</td>
              <td class="border border-gray-300 p-2">${beamResults.actuantes.delta_mm.toFixed(1)} mm</td>
              <td class="border border-gray-300 p-2">${beamResults.limites.delta_adm_240.toFixed(1)} mm</td>
              <td class="border border-gray-300 p-2 font-bold ${beamResults.dcr.delta <= 1 ? 'text-emerald-700' : 'text-red-600'}">
                ${(beamResults.dcr.delta * 100).toFixed(1)}%
              </td>
              <td class="border border-gray-300 p-2 font-bold ${beamResults.dcr.delta <= 1 ? 'text-emerald-700' : 'text-red-600'}">
                ${beamResults.dcr.delta <= 1 ? 'CUMPLE' : 'EXCEDE FLECHA'}
              </td>
            </tr>
            ` : ''}
          </tbody>
        </table>
      </div>

      <!-- Pie de Firma -->
      <div class="pt-6 border-t border-gray-300 flex justify-between items-end text-[11px] text-gray-600">
        <div>
          <p>Memoria generada por DENDRO-STRUCT</p>
          <p>Conforme con NSR-10 Título G</p>
        </div>
        <div class="text-center">
          <div class="w-48 border-b border-gray-400 mb-1"></div>
          <p class="font-bold text-gray-800">Ingeniero Diseñador Responsable</p>
          <p>Matrícula Profesional</p>
        </div>
      </div>
    </div>
  `;
}
