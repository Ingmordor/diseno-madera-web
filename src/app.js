/**
 * CONTROLADOR PRINCIPAL DE LA APLICACIÓN (app.js)
 * Conexión de interfaz de usuario con motores de cálculo en tiempo real
 */

import { MATERIALES, FACTORES_CD, FACTORES_CM, FACTORES_CIN, FACTORES_K, SECCIONES_COMERCIALES } from './constants.js';
import { verifyBeam } from './calculations/beams.js';
import { verifyColumn } from './calculations/columns.js';
import { verifyBiaxialInteraction } from './calculations/biaxial.js';
import { renderCrossSectionSVG } from './components/svgViewer.js';
import { renderBeamDiagramsSVG, renderColumnCapacitySVG, renderPMSurfaceSVG } from './components/charts.js';
import { generateReportHTML } from './components/reportGenerator.js';

// ESTADO GLOBAL REACTIVO
const state = {
  activeTab: 'vigas',
  graphMode: 'seccion',
  materialKey: 'ES7',
  sectionTipo: 'tubo',
  // Parámetros de sección
  D: 140, // mm
  t: 14,  // mm
  b: 100, // mm
  d: 200, // mm
  // Parámetros de viga
  Luz: 3.5, // m
  w: 2.5,   // kN/m
  // Factores
  CD: 1.00,
  CmKey: '12',
  CinKey: 'sin',
  Cr: 1.00,
  // Columna
  Pu: 45, // kN
  L_col: 2.8, // m
  K_col: 1.00,
  colArrangement: '1',
  // Biaxial
  fc_P: 30, // kN
  fc_Mx: 2.5, // kN·m
  fc_My: 1.0, // kN·m
  // Opciones de Reporte
  reportMode: 'completo',
  reportIncludeImages: true,
  proyecto: {
    nombre: 'DISEÑO DE ESTRUCTURAS EN BAMBÚ (TRL-3)',
    codigo: 'FLG1',
    archivo: '136-MC-PTC-MLFGL - TRL-3',
    disenador: 'Ingeniero Antonio Suarez Pirazan',
    email: 'jsuarez@gemalab.co',
    norma: 'NSR-10 Título G (Estructuras de Madera y Bambú)'
  },
  elementosDiseno: [],
  // Resultados almacenados
  beamResults: null,
  colResults: null,
  biaxialResults: null
};

// LISTA PREDETERMINADA DE ELEMENTOS BASADA EN EL DOCUMENTO OFICIAL TRL3-DENDROCALAMUS
const ELEMENTOS_BASE_TRL3 = [
  {
    nombre: 'COL-B01 (Dendrocalamus Ø140)',
    tipoSeccion: 'tubo',
    seccionTexto: 'Tubo Ø140 (t=14mm)',
    materialCodigo: 'ES7',
    D: 140, t: 14, b: 0, d: 0,
    L: 3.00, Ke: 1.00,
    Pa: 45.0, Ma1: 2.50, Ma2: 1.00, Va1: 5.0, Va2: 2.0
  },
  {
    nombre: 'COL-B02 (Haz 2 Culmos Ø120)',
    tipoSeccion: 'haz2',
    seccionTexto: '2 Culmos Ø120 (t=12mm)',
    materialCodigo: 'ES7',
    D: 120, t: 12, b: 0, d: 0,
    L: 3.50, Ke: 1.00,
    Pa: 75.0, Ma1: 4.20, Ma2: 1.80, Va1: 8.5, Va2: 3.2
  },
  {
    nombre: 'C20 ES7',
    tipoSeccion: 'rect',
    seccionTexto: 'VM 120x180',
    materialCodigo: 'ES7',
    D: 0, t: 0, b: 120, d: 180,
    L: 3.85, Ke: 0.85,
    Pa: 9.4, Ma1: 23.11, Ma2: 0.10, Va1: 6.02, Va2: 0.20
  },
  {
    nombre: 'C20 ES2 (Laminada)',
    tipoSeccion: 'rect',
    seccionTexto: 'VM 120x180',
    materialCodigo: 'ES2',
    D: 0, t: 0, b: 120, d: 180,
    L: 3.85, Ke: 0.85,
    Pa: 9.4, Ma1: 23.11, Ma2: 0.10, Va1: 6.02, Va2: 0.20
  },
  {
    nombre: 'C20 CARGA',
    tipoSeccion: 'rect',
    seccionTexto: 'VM 160x180',
    materialCodigo: 'ES7',
    D: 0, t: 0, b: 160, d: 180,
    L: 4.90, Ke: 0.85,
    Pa: 9.8, Ma1: 14.67, Ma2: 0.05, Va1: 4.05, Va2: 0.01
  },
  {
    nombre: 'C12',
    tipoSeccion: 'rect',
    seccionTexto: 'VM 140x140',
    materialCodigo: 'ES7',
    D: 0, t: 0, b: 140, d: 140,
    L: 4.90, Ke: 0.85,
    Pa: 4.6, Ma1: 19.59, Ma2: 2.58, Va1: 3.94, Va2: 1.64
  },
  {
    nombre: 'C54',
    tipoSeccion: 'rect',
    seccionTexto: 'VM 40x80',
    materialCodigo: 'ES7',
    D: 0, t: 0, b: 40, d: 80,
    L: 4.90, Ke: 0.85,
    Pa: 1.3, Ma1: 0.09, Ma2: 0.26, Va1: 0.26, Va2: 0.38
  },
  {
    nombre: 'C2',
    tipoSeccion: 'rect',
    seccionTexto: 'VM 80x80',
    materialCodigo: 'ES7',
    D: 0, t: 0, b: 80, d: 80,
    L: 3.65, Ke: 0.85,
    Pa: 4.0, Ma1: 0.06, Ma2: 0.22, Va1: 0.15, Va2: 0.37
  },
  {
    nombre: 'B8',
    tipoSeccion: 'rect',
    seccionTexto: 'VM 40x80',
    materialCodigo: 'ES7',
    D: 0, t: 0, b: 40, d: 80,
    L: 3.65, Ke: 0.85,
    Pa: 2.7, Ma1: 0.19, Ma2: 0.49, Va1: 0.01, Va2: 0.02
  }
];

// Evalúa y calcula estructuralmente un elemento de la lista
export function evaluarElemento(el) {
  const mat = MATERIALES[el.materialCodigo || 'ES7'] || MATERIALES.ES7;
  const sec = {
    tipo: el.tipoSeccion || 'tubo',
    D: el.D || 140,
    t: el.t || 14,
    b: el.b || 100,
    d: el.d || 200
  };

  // Verificación de columna
  const colRes = verifyColumn({
    material: mat,
    section: sec,
    Pu: el.Pa || 10,
    L: el.L || 3.0,
    K: el.Ke || 1.0,
    factores: { CD: 0.90, Cm: 1.0, Ct: 1.0, Cin: 1.0, Cr: 1.0, Ckd: 1.0 }
  });

  // Verificación biaxial
  const biaxRes = verifyBiaxialInteraction({
    material: mat,
    section: sec,
    Pu: el.Pa || 10,
    Mx: el.Ma1 || 0.1,
    My: el.Ma2 || 0.05,
    Lx: el.L || 3.0,
    Ly: el.L || 3.0,
    factores: { CD: 0.90 }
  });

  const Mn = biaxRes.nominales.M_nx || 15.0;
  const Pn = colRes.admisibles.Padm || 50.0;
  const dcrAxial = el.Pa / Pn;
  const dcrFlex = (el.Ma1 || 0.1) / Mn;
  const rbi = biaxRes.ratioTotal;
  const cumple = rbi <= 1.0 && colRes.esbeltez.cumple && dcrAxial <= 1.0;

  return {
    ...el,
    geom: colRes.geom,
    lambda: colRes.esbeltez.lambda,
    Cp: colRes.estabilidad.Cp,
    FcE1: colRes.estabilidad.FcE,
    Fc_adm: colRes.admisibles.Fc_adm,
    Pn,
    Mn,
    Vn: 25.0, // Capacidad cortante base
    fc: colRes.actuantes.fc_act,
    fb1: biaxRes.esfuerzos.fb1,
    fb2: biaxRes.esfuerzos.fb2,
    dcrAxial,
    dcrFlex,
    rbi,
    cumple
  };
}

export function recalcularTodosElementos() {
  state.elementosDiseno = state.elementosDiseno.map(evaluarElemento);
}

// CAMBIO DE PESTAÑAS (TABS)
export function switchTab(tabId) {
  state.activeTab = tabId;
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active', 'border-emerald-600', 'text-emerald-600', 'dark:text-emerald-400', 'font-semibold', 'bg-[var(--card)]');
    btn.classList.add('border-transparent', 'text-[var(--muted-foreground)]');
  });

  const tabElem = document.getElementById('tab-' + tabId);
  const tabBtn = document.getElementById('tab-btn-' + tabId);
  if (tabElem) tabElem.classList.add('active');
  if (tabBtn) {
    tabBtn.classList.add('active', 'border-emerald-600', 'text-emerald-600', 'dark:text-emerald-400', 'font-semibold', 'bg-[var(--card)]');
    tabBtn.classList.remove('border-transparent', 'text-[var(--muted-foreground)]');
  }

  if (tabId === 'columnas') runColumnRecalc();
  if (tabId === 'flexocomp') runBiaxialRecalc();
  if (tabId === 'catalogo') renderReport();
}

// CAMBIO DE MODO DE GRÁFICO (Sección 2D, Esfuerzos, Solicitaciones)
export function setGraphMode(mode) {
  state.graphMode = mode;
  ['seccion', 'esfuerzos', 'solicitaciones'].forEach(m => {
    const btn = document.getElementById('btn-mode-' + (m === 'solicitaciones' ? 'sol' : m));
    if (btn) {
      if (m === mode) {
        btn.className = 'px-2.5 py-1 rounded bg-emerald-600 text-white font-medium text-xs';
      } else {
        btn.className = 'px-2.5 py-1 rounded bg-[var(--background)] border border-[var(--border)] text-[var(--muted-foreground)] text-xs';
      }
    }
  });

  updateMainGraph();
}

function updateMainGraph() {
  const currentSection = {
    tipo: state.sectionTipo,
    D: state.D,
    t: state.t,
    b: state.b,
    d: state.d
  };

  if (state.graphMode === 'solicitaciones' && state.beamResults) {
    renderBeamDiagramsSVG('svg-viewer', state.beamResults);
  } else {
    renderCrossSectionSVG('svg-viewer', currentSection, state.graphMode, state.beamResults);
  }
}

// CÁLCULO DE VIGAS
export function runBeamRecalc() {
  const material = MATERIALES[state.materialKey];
  const cmFactor = FACTORES_CM[state.CmKey].valor;
  const cinFactor = FACTORES_CIN[state.CinKey].valor;

  const section = {
    tipo: state.sectionTipo,
    D: state.D,
    t: state.t,
    b: state.b,
    d: state.d
  };

  const results = verifyBeam({
    material,
    section,
    Luz: state.Luz,
    w: state.w,
    factores: {
      CD: state.CD,
      Cm: cmFactor,
      Ct: 1.00,
      Cin: cinFactor,
      Cr: state.Cr,
      Cfu: 1.00,
      Ckd: 1.00
    }
  });

  state.beamResults = results;

  // Actualizar valores en UI
  document.getElementById('prop-area').textContent = (results.geom.Area / 100).toFixed(1) + ' cm²';
  document.getElementById('prop-inercia').textContent = Math.round(results.geom.Ix / 10000).toLocaleString() + ' cm⁴';
  document.getElementById('prop-mod').textContent = (results.geom.Sx / 1000).toFixed(1) + ' cm³';

  document.getElementById('val-mu').textContent = results.solicitaciones.Mu.toFixed(2) + ' kN·m';
  document.getElementById('val-vu').textContent = results.solicitaciones.Vu.toFixed(2) + ' kN';

  // Ratios y Semáforos
  updateDCRCard('flex', results.dcr.flex * 100, results.actuantes.fb_act.toFixed(1), results.admisibles.F_b_adm.toFixed(1));
  updateDCRCard('cort', results.dcr.cort * 100, results.actuantes.fv_act.toFixed(2), results.admisibles.F_v_adm.toFixed(2));
  updateDCRCard('flecha', results.dcr.delta * 100, results.actuantes.delta_mm.toFixed(1), results.limites.delta_adm_240.toFixed(1));

  // Actualizar gráfico
  updateMainGraph();
}

function updateDCRCard(name, dcrPct, act, adm) {
  const card = document.getElementById('card-dcr-' + name);
  const txt = document.getElementById('txt-dcr-' + name);
  const bar = document.getElementById('bar-' + name);
  const badge = document.getElementById('badge-' + name);
  const valAct = document.getElementById('val-' + name + '-act');
  const valAdm = document.getElementById('val-' + name + '-adm');

  if (valAct) valAct.textContent = act;
  if (valAdm) valAdm.textContent = adm;

  if (txt) txt.textContent = dcrPct.toFixed(1) + '%';
  if (bar) bar.style.width = Math.min(dcrPct, 100) + '%';

  if (card && badge && bar && txt) {
    if (dcrPct > 100) {
      card.className = 'bg-[var(--card)] border-2 border-red-500 rounded-xl p-3 shadow-sm';
      txt.className = 'text-xl font-bold font-mono text-red-600 dark:text-red-400';
      bar.className = 'bg-red-500 h-full transition-all duration-300';
      badge.className = 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 font-bold px-1.5 py-0.5 rounded text-[10px]';
      badge.textContent = 'SOBREESFUERZO';
    } else if (dcrPct >= 85) {
      card.className = 'bg-[var(--card)] border-2 border-amber-500 rounded-xl p-3 shadow-sm';
      txt.className = 'text-xl font-bold font-mono text-amber-600 dark:text-amber-400';
      bar.className = 'bg-amber-500 h-full transition-all duration-300';
      badge.className = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold px-1.5 py-0.5 rounded text-[10px]';
      badge.textContent = 'ALERTA (CUMPLE)';
    } else {
      card.className = 'bg-[var(--card)] border-2 border-emerald-500 rounded-xl p-3 shadow-sm';
      txt.className = 'text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400';
      bar.className = 'bg-emerald-500 h-full transition-all duration-300';
      badge.className = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded text-[10px]';
      badge.textContent = 'CUMPLE';
    }
  }
}

// CÁLCULO DE COLUMNAS
export function runColumnRecalc() {
  const material = MATERIALES[state.materialKey];
  const cmFactor = FACTORES_CM[state.CmKey].valor;
  const cinFactor = FACTORES_CIN[state.CinKey].valor;

  let factorCulmos = 1;
  if (state.colArrangement === '2') factorCulmos = 2;
  if (state.colArrangement === '4') factorCulmos = 4;

  const section = {
    tipo: state.sectionTipo,
    D: state.D,
    t: state.t,
    b: state.b,
    d: state.d
  };

  const results = verifyColumn({
    material,
    section,
    Pu: state.Pu,
    L: state.L_col,
    K: state.K_col,
    factores: {
      CD: state.CD,
      Cm: cmFactor,
      Ct: 1.00,
      Cin: cinFactor,
      Cr: state.Cr,
      Ckd: 1.00
    }
  });

  state.colResults = results;

  const elemEsbeltez = document.getElementById('col-val-esbeltez');
  const elemCp = document.getElementById('col-val-cp');
  const elemDcr = document.getElementById('col-val-dcr');

  if (elemEsbeltez) elemEsbeltez.textContent = results.esbeltez.lambda.toFixed(1);
  if (elemCp) elemCp.textContent = results.estabilidad.Cp.toFixed(3);
  if (elemDcr) {
    const dcrCol = (results.dcr.axial * 100);
    elemDcr.textContent = dcrCol.toFixed(1) + '%';
    elemDcr.className = dcrCol <= 100 ? 'text-xl font-bold font-mono text-emerald-600' : 'text-xl font-bold font-mono text-red-600';
  }

  renderColumnCapacitySVG('svg-col-viewer', state.L_col, results.admisibles.Padm, state.Pu);
}

// CÁLCULO BIAXIAL
export function runBiaxialRecalc() {
  const material = MATERIALES[state.materialKey];
  const section = {
    tipo: state.sectionTipo,
    D: state.D,
    t: state.t,
    b: state.b,
    d: state.d
  };

  const results = verifyBiaxialInteraction({
    material,
    section,
    Pu: state.fc_P,
    Mx: state.fc_Mx,
    My: state.fc_My,
    Lx: state.L_col,
    Ly: state.L_col,
    factores: { CD: state.CD }
  });

  state.biaxialResults = results;

  const ratioElem = document.getElementById('fc-total-ratio');
  const badgeElem = document.getElementById('fc-badge-status');

  if (ratioElem) {
    ratioElem.textContent = results.ratioTotal.toFixed(3);
    if (results.cumple) {
      ratioElem.className = 'text-3xl font-extrabold font-mono text-emerald-600';
      badgeElem.className = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-4 py-2 rounded-xl text-sm border border-emerald-500/20';
      badgeElem.textContent = 'SECCIÓN CONFORME';
    } else {
      ratioElem.className = 'text-3xl font-extrabold font-mono text-red-600';
      badgeElem.className = 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 font-bold px-4 py-2 rounded-xl text-sm border border-red-500/20';
      badgeElem.textContent = 'FALLA POR INTERACCIÓN';
    }
  }

  renderPMSurfaceSVG('svg-pm-viewer', state.fc_P, state.fc_Mx, results.ratioTotal);
}

// RENDERIZAR MEMORIA DE CÁLCULO
export function renderReport() {
  const container = document.getElementById('report-container');
  if (!container) return;

  const material = MATERIALES[state.materialKey];
  const section = {
    tipo: state.sectionTipo,
    D: state.D,
    t: state.t,
    b: state.b,
    d: state.d
  };

  // Recalcular elementos si es necesario
  if (state.elementosDiseno.length === 0) {
    state.elementosDiseno = ELEMENTOS_BASE_TRL3.map(evaluarElemento);
  } else {
    recalcularTodosElementos();
  }

  // Elemento activo para ficha técnica (el primer elemento o el seleccionado)
  const elementoActivo = state.elementosDiseno[0] || null;

  container.innerHTML = generateReportHTML({
    modo: state.reportMode,
    incluirImagenes: state.reportIncludeImages,
    proyecto: state.proyecto,
    elementos: state.elementosDiseno,
    elementoActivo,
    material,
    section
  });
}

// AGREGAR ELEMENTO ACTUAL DESDE CUALQUIER MÓDULO A LA MEMORIA MULTI-ELEMENTO
export function agregarElementoActual(nombrePersonalizado = null) {
  const nombre = nombrePersonalizado || prompt('Nombre del nuevo elemento de bambú / columna:', `COL-B${state.elementosDiseno.length + 1}`);
  if (!nombre) return;

  const seccionTexto = state.sectionTipo === 'tubo' 
    ? `Tubo Ø${state.D} (t=${state.t}mm)` 
    : (state.sectionTipo === 'haz2' ? `2 Culmos Ø${state.D}` : `VM ${state.b}x${state.d}`);

  const nuevo = {
    nombre,
    tipoSeccion: state.sectionTipo,
    seccionTexto,
    materialCodigo: state.materialKey,
    D: state.D,
    t: state.t,
    b: state.b,
    d: state.d,
    L: state.L_col || 3.0,
    Ke: state.K_col || 1.0,
    Pa: state.Pu || 45.0,
    Ma1: state.fc_Mx || 2.5,
    Ma2: state.fc_My || 1.0,
    Va1: 5.0,
    Va2: 2.0
  };

  state.elementosDiseno.push(evaluarElemento(nuevo));
  alert(`Elemento "${nombre}" agregado correctamente a la lista de diseño.`);
  
  if (state.activeTab === 'catalogo') {
    renderReport();
  }
}

// RESTAURAR ELEMENTOS OFICIALES DEL PROYECTO TRL-3
export function restaurarElementosTRL3() {
  state.elementosDiseno = ELEMENTOS_BASE_TRL3.map(evaluarElemento);
  renderReport();
}

// CAMBIAR MODO DE VISUALIZACIÓN DEL REPORTE
export function setReportMode(modo) {
  state.reportMode = modo;
  ['completo', 'multielemento', 'individual'].forEach(m => {
    const btn = document.getElementById('btn-rep-' + m);
    if (btn) {
      if (m === modo) {
        btn.className = 'px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-medium text-xs shadow-sm';
      } else {
        btn.className = 'px-3 py-1.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--muted-foreground)] text-xs hover:text-[var(--foreground)]';
      }
    }
  });
  renderReport();
}

// ACTIVAR / DESACTIVAR IMÁGENES EN EL REPORTE
export function toggleReportImages(checkbox) {
  state.reportIncludeImages = checkbox.checked;
  renderReport();
}

// INICIALIZACIÓN DE LA APLICACIÓN
export function initApp() {
  // Configurar listeners
  const selMat = document.getElementById('sel-material');
  if (selMat) {
    selMat.addEventListener('change', (e) => {
      state.materialKey = e.target.value;
      const mat = MATERIALES[state.materialKey];
      document.getElementById('badge-especie').textContent = `${mat.codigo}: ${mat.nombre.split(' (')[0]}`;
      document.getElementById('mat-fb').textContent = `${mat.fb.toFixed(1)} MPa`;
      document.getElementById('mat-fc').textContent = `${mat.fc.toFixed(1)} MPa`;
      document.getElementById('mat-fv').textContent = `${mat.fv.toFixed(1)} MPa`;
      document.getElementById('mat-e').textContent = `${mat.e05.toLocaleString()} MPa`;
      runBeamRecalc();
    });
  }

  const selSec = document.getElementById('sel-seccion-tipo');
  if (selSec) {
    selSec.addEventListener('change', (e) => {
      state.sectionTipo = e.target.value;
      if (state.sectionTipo === 'rect') {
        document.getElementById('controles-tubular').classList.add('hidden');
        document.getElementById('controles-rectangular').classList.remove('hidden');
      } else {
        document.getElementById('controles-tubular').classList.remove('hidden');
        document.getElementById('controles-rectangular').classList.add('hidden');
      }
      runBeamRecalc();
    });
  }

  // Sliders de geometría
  const sliderDiam = document.getElementById('slider-diam');
  if (sliderDiam) {
    sliderDiam.addEventListener('input', (e) => {
      state.D = parseFloat(e.target.value);
      document.getElementById('val-diam').textContent = state.D + ' mm';
      document.getElementById('geom-summary').textContent = `D=${state.D}mm, t=${state.t}mm`;
      runBeamRecalc();
    });
  }

  const sliderT = document.getElementById('slider-t');
  if (sliderT) {
    sliderT.addEventListener('input', (e) => {
      state.t = parseFloat(e.target.value);
      document.getElementById('val-t').textContent = state.t + ' mm';
      document.getElementById('geom-summary').textContent = `D=${state.D}mm, t=${state.t}mm`;
      runBeamRecalc();
    });
  }

  const sliderB = document.getElementById('slider-b');
  if (sliderB) {
    sliderB.addEventListener('input', (e) => {
      state.b = parseFloat(e.target.value);
      document.getElementById('val-b').textContent = state.b + ' mm';
      document.getElementById('geom-summary').textContent = `b=${state.b}mm, d=${state.d}mm`;
      runBeamRecalc();
    });
  }

  const sliderD = document.getElementById('slider-d');
  if (sliderD) {
    sliderD.addEventListener('input', (e) => {
      state.d = parseFloat(e.target.value);
      document.getElementById('val-d').textContent = state.d + ' mm';
      document.getElementById('geom-summary').textContent = `b=${state.b}mm, d=${state.d}mm`;
      runBeamRecalc();
    });
  }

  // Cargas y longitud
  const inpLuz = document.getElementById('inp-luz');
  if (inpLuz) {
    inpLuz.addEventListener('input', (e) => {
      state.Luz = parseFloat(e.target.value) || 3.0;
      runBeamRecalc();
    });
  }

  const inpW = document.getElementById('inp-w');
  if (inpW) {
    inpW.addEventListener('input', (e) => {
      state.w = parseFloat(e.target.value) || 2.0;
      runBeamRecalc();
    });
  }

  // Factores
  const selCd = document.getElementById('sel-cd');
  if (selCd) selCd.addEventListener('change', (e) => { state.CD = parseFloat(e.target.value); runBeamRecalc(); });

  const selCm = document.getElementById('sel-cm');
  if (selCm) selCm.addEventListener('change', (e) => { state.CmKey = e.target.value; runBeamRecalc(); });

  const selCin = document.getElementById('sel-cin');
  if (selCin) selCin.addEventListener('change', (e) => { state.CinKey = e.target.value; runBeamRecalc(); });

  const selCr = document.getElementById('sel-cr');
  if (selCr) selCr.addEventListener('change', (e) => { state.Cr = parseFloat(e.target.value); runBeamRecalc(); });

  // Column inputs
  const colP = document.getElementById('col-inp-p');
  if (colP) colP.addEventListener('input', (e) => { state.Pu = parseFloat(e.target.value) || 40; runColumnRecalc(); });

  const colL = document.getElementById('col-inp-l');
  if (colL) colL.addEventListener('input', (e) => { state.L_col = parseFloat(e.target.value) || 2.8; runColumnRecalc(); });

  const colK = document.getElementById('col-sel-k');
  if (colK) colK.addEventListener('change', (e) => { state.K_col = parseFloat(e.target.value) || 1.0; runColumnRecalc(); });

  // Biaxial inputs
  const fcP = document.getElementById('fc-p');
  if (fcP) fcP.addEventListener('input', (e) => { state.fc_P = parseFloat(e.target.value) || 30; runBiaxialRecalc(); });

  const fcMx = document.getElementById('fc-mx');
  if (fcMx) fcMx.addEventListener('input', (e) => { state.fc_Mx = parseFloat(e.target.value) || 2.5; runBiaxialRecalc(); });

  const fcMy = document.getElementById('fc-my');
  if (fcMy) fcMy.addEventListener('input', (e) => { state.fc_My = parseFloat(e.target.value) || 1.0; runBiaxialRecalc(); });

  // Disposición de columna
  window.setColArrangement = (n) => {
    state.colArrangement = n;
    ['1', '2', '4'].forEach(id => {
      const btn = document.getElementById('btn-col-' + id);
      if (btn) {
        if (id === n) {
          btn.className = 'p-2 border-2 border-emerald-500 rounded-lg text-center font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300';
        } else {
          btn.className = 'p-2 border border-[var(--border)] rounded-lg text-center font-medium text-[var(--muted-foreground)]';
        }
      }
    });
    runColumnRecalc();
  };

  // Exportar funciones globales
  window.switchTab = switchTab;
  window.setGraphMode = setGraphMode;
  window.agregarElementoActual = agregarElementoActual;
  window.restaurarElementosTRL3 = restaurarElementosTRL3;
  window.setReportMode = setReportMode;
  window.toggleReportImages = toggleReportImages;
  window.renderReport = renderReport;

  // Inicializar elementos de diseño con datos base de TRL-3
  state.elementosDiseno = ELEMENTOS_BASE_TRL3.map(evaluarElemento);

  // Ejecutar primer cálculo
  runBeamRecalc();
}

// Iniciar al cargar el DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
