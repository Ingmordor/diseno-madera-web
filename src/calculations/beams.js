/**
 * MÓDULO DE CÁLCULO DE VIGAS A FLEXIÓN, CORTANTE Y DEFLEXIÓN
 * Cumplimiento estricto con NSR-10 Título G (Capítulo G.4.1 y G.4.6)
 */

export function calculateBeamProperties(section) {
  const { tipo } = section;
  let Area = 0; // mm²
  let Ix = 0;   // mm⁴
  let Iy = 0;   // mm⁴
  let Sx = 0;   // mm³
  let Sy = 0;   // mm³
  let rx = 0;   // mm
  let ry = 0;   // mm
  let peralte = 0; // mm (d o D)
  let ancho = 0;   // mm (b o D)

  if (tipo === 'tubo') {
    const D = parseFloat(section.D);
    const t = parseFloat(section.t);
    const Di = Math.max(0, D - 2 * t);
    
    Area = (Math.PI / 4) * (Math.pow(D, 2) - Math.pow(Di, 2));
    Ix = (Math.PI / 64) * (Math.pow(D, 4) - Math.pow(Di, 4));
    Iy = Ix;
    Sx = (2 * Ix) / D;
    Sy = Sx;
    rx = Math.sqrt(Ix / Area);
    ry = rx;
    peralte = D;
    ancho = D;
  } else if (tipo === 'haz2') {
    // 2 Culmos unidos en paralelo
    const D = parseFloat(section.D);
    const t = parseFloat(section.t);
    const Di = Math.max(0, D - 2 * t);
    const A1 = (Math.PI / 4) * (Math.pow(D, 2) - Math.pow(Di, 2));
    const I1 = (Math.PI / 64) * (Math.pow(D, 4) - Math.pow(Di, 4));
    
    Area = 2 * A1;
    // Eje fuerte vertical (uno al lado del otro o uno sobre otro)
    // Asumimos viga bi-culmo acoplada con pernos pasantes
    Ix = 2 * I1; 
    Iy = 2 * (I1 + A1 * Math.pow(D / 2, 2));
    Sx = 2 * ((2 * I1) / D);
    Sy = Iy / D;
    rx = Math.sqrt(Ix / Area);
    ry = Math.sqrt(Iy / Area);
    peralte = D;
    ancho = 2 * D;
  } else if (tipo === 'rolliza') {
    const D = parseFloat(section.D);
    Area = (Math.PI * Math.pow(D, 2)) / 4;
    Ix = (Math.PI * Math.pow(D, 4)) / 64;
    Iy = Ix;
    Sx = (Math.PI * Math.pow(D, 3)) / 32;
    Sy = Sx;
    rx = D / 4;
    ry = rx;
    peralte = D;
    ancho = D;
  } else if (tipo === 'rect') {
    const b = parseFloat(section.b);
    const d = parseFloat(section.d);
    Area = b * d;
    Ix = (b * Math.pow(d, 3)) / 12;
    Iy = (d * Math.pow(b, 3)) / 12;
    Sx = (b * Math.pow(d, 2)) / 6;
    Sy = (d * Math.pow(b, 2)) / 6;
    rx = d / Math.sqrt(12);
    ry = b / Math.sqrt(12);
    peralte = d;
    ancho = b;
  } else if (tipo === 'seccionI') {
    const bf = parseFloat(section.bf || 120);
    const h = parseFloat(section.h || 240);
    const tw = parseFloat(section.tw || 40);
    const tf = parseFloat(section.tf || 30);
    const hw = h - 2 * tf;

    Area = 2 * (bf * tf) + (hw * tw);
    Ix = (tw * Math.pow(hw, 3)) / 12 + 2 * ((bf * Math.pow(tf, 3)) / 12 + bf * tf * Math.pow((h - tf) / 2, 2));
    Iy = (hw * Math.pow(tw, 3)) / 12 + 2 * (tf * Math.pow(bf, 3) / 12);
    Sx = Ix / (h / 2);
    Sy = Iy / (bf / 2);
    rx = Math.sqrt(Ix / Area);
    ry = Math.sqrt(Iy / Area);
    peralte = h;
    ancho = bf;
  }

  return { Area, Ix, Iy, Sx, Sy, rx, ry, peralte, ancho };
}

/**
 * Cálculo del Factor de Estabilidad Lateral de Vigas (CL) - NSR-10 G.4.1.3
 */
export function calculateCL(sectionType, b, d, Lu, E_min_mod, F_b_ast) {
  // Para secciones circulares o culmos de bambú, no hay pandeo lateral torsional preferencial (CL = 1.0)
  if (sectionType === 'tubo' || sectionType === 'rolliza' || sectionType === 'haz2') {
    return { CL: 1.00, RB: 0, F_bE: Infinity, cumpleEsbeltez: true };
  }

  // Longitud efectiva le según arriostramiento (asumiendo carga distribuida simple le = 1.63 Lu + 3d)
  const le = 1.63 * (Lu * 1000) + 3 * d; // mm
  const RB = Math.sqrt((le * d) / Math.pow(b, 2));

  const cumpleEsbeltez = RB <= 50; // Límite normativo NSR-10 G.4.1.3

  // Tensión elástica de pandeo por flexión FbE (MPa)
  const F_bE = (1.20 * E_min_mod) / Math.pow(RB, 2);

  // Parámetro de estabilidad CL
  const ratio = F_bE / F_b_ast;
  const term1 = (1 + ratio) / 1.9;
  const CL = term1 - Math.sqrt(Math.max(0, Math.pow(term1, 2) - (ratio / 0.95)));

  return {
    CL: Math.min(1.00, Math.max(0.01, CL)),
    RB,
    F_bE,
    cumpleEsbeltez
  };
}

/**
 * Verificación completa de viga
 */
export function verifyBeam(input) {
  const {
    material,
    section,
    Luz,       // m
    Lu = Luz,  // m
    w = 0,     // kN/m
    Mu_input,  // kN·m opcional
    Vu_input,  // kN opcional
    factores = {}
  } = input;

  const CD = factores.CD ?? 1.00;
  const Cm = factores.Cm ?? 1.00;
  const Ct = factores.Ct ?? 1.00;
  const Cin = factores.Cin ?? 1.00;
  const Cr = factores.Cr ?? 1.00;
  const Cfu = factores.Cfu ?? 1.00;
  const Ckd = factores.Ckd ?? 1.00;

  // Propiedades geométricas
  const geom = calculateBeamProperties(section);

  // Solicitaciones actuantes
  const L_mm = Luz * 1000;
  const Mu = Mu_input !== undefined && Mu_input !== null ? Mu_input : (w * Math.pow(Luz, 2)) / 8; // kN·m
  const Vu = Vu_input !== undefined && Vu_input !== null ? Vu_input : (w * Luz) / 2; // kN

  // Módulo de elasticidad mínimo modificado E'min
  const E_min_mod = material.emin * Cm * Ct * Cin; // MPa
  const E_05_mod = material.e05 * Cm * Ct * Cin;   // MPa

  // Esfuerzo de referencia antes de estabilidad F*b
  const F_b_ast = material.fb * CD * Cm * Ct * Cin * Cr * Cfu * Ckd;

  // Factor de Estabilidad Lateral CL
  const estLat = calculateCL(section.tipo, geom.ancho, geom.peralte, Lu, E_min_mod, F_b_ast);
  const CL = estLat.CL;

  // Factor de Forma CF (NSR-10 G.3.3.2)
  let CF = 1.0;
  if (section.tipo === 'rect' && geom.peralte > 300) {
    CF = Math.pow(300 / geom.peralte, 0.11);
  }

  // Esfuerzos Admisibles Modificados
  const F_b_adm = F_b_ast * CL * CF; // MPa
  const F_v_adm = material.fv * CD * Cm * Ct * Cin * Cr * Ckd; // MPa

  // Esfuerzos Actuantes
  const fb_act = (Mu * 1e6) / geom.Sx; // MPa
  let fv_act = 0;
  if (section.tipo === 'rect') {
    fv_act = (1.5 * (Vu * 1000)) / geom.Area; // 3V / 2A
  } else if (section.tipo === 'tubo') {
    fv_act = (2.0 * (Vu * 1000)) / geom.Area; // 2V / A para tubo de pared delgada
  } else {
    fv_act = (1.33 * (Vu * 1000)) / geom.Area; // 4V / 3A para circular maciza
  }

  // Deflexión elástica máxima
  const delta_mm = (5 * w * Math.pow(L_mm, 4)) / (384 * E_05_mod * geom.Ix);
  const delta_adm_240 = L_mm / 240;
  const delta_adm_360 = L_mm / 360;

  // Ratios de Demanda / Capacidad (DCR)
  const dcr_flex = (fb_act / F_b_adm);
  const dcr_cort = (fv_act / F_v_adm);
  const dcr_delta = (delta_mm / delta_adm_240);

  return {
    geom,
    solicitaciones: { Mu, Vu, w, Luz, Lu },
    admisibles: { F_b_adm, F_v_adm, E_min_mod, E_05_mod },
    actuantes: { fb_act, fv_act, delta_mm },
    estabilidad: estLat,
    factores: { CD, Cm, Ct, Cin, Cr, Cfu, Ckd, CF, CL },
    limites: { delta_adm_240, delta_adm_360 },
    dcr: {
      flex: dcr_flex,
      cort: dcr_cort,
      delta: dcr_delta,
      max: Math.max(dcr_flex, dcr_cort, dcr_delta)
    },
    cumple: dcr_flex <= 1.0 && dcr_cort <= 1.0 && dcr_delta <= 1.0 && estLat.cumpleEsbeltez
  };
}
