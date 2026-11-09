/**
 * MÓDULO DE CÁLCULO DE COLUMNAS Y ELEMENTOS CARGADOS AXIALMENTE
 * Cumplimiento con NSR-10 Título G (Capítulo G.4.2 y G.4.3)
 */

import { calculateBeamProperties } from './beams.js';

/**
 * Coeficiente de estabilidad de columnas (Cp) - NSR-10 G.4.3.5
 * @param {number} lambda - Relación de esbeltez (Le / r)
 * @param {number} Emin_mod - Módulo elástico mínimo modificado (MPa)
 * @param {number} Fc_ast - Esfuerzo de compresión modificado sin Cp (MPa)
 * @param {string} tipoMaterial - 'bambu', 'madera', 'laminada'
 */
export function calculateCp(lambda, Emin_mod, Fc_ast, tipoMaterial = 'bambu') {
  // Parámetro 'c' según NSR-10 G.4.3.5
  let c = 0.85; // Rolliza / Bambú
  if (tipoMaterial === 'madera') c = 0.80; // Madera aserrada
  if (tipoMaterial === 'laminada') c = 0.90; // Madera laminada

  // Tensión elástica crítica de Euler FcE (MPa)
  // FcE = (0.822 * E'min) / lambda^2
  const FcE = (0.822 * Emin_mod) / Math.pow(Math.max(1, lambda), 2);

  const ratio = FcE / Fc_ast;
  const term1 = (1 + ratio) / (2 * c);
  const radical = Math.pow(term1, 2) - (ratio / c);
  const Cp = term1 - Math.sqrt(Math.max(0, radical));

  return {
    Cp: Math.min(1.00, Math.max(0.01, Cp)),
    FcE,
    cumpleEsbeltez: lambda <= 50
  };
}

/**
 * Fórmula de Hankinson para cargas inclinadas respecto a la fibra (NSR-10 G.3.5.2)
 * @param {number} Fc_adm - Esfuerzo admisible a compresión paralela (MPa)
 * @param {number} Fp_adm - Esfuerzo admisible a compresión perpendicular (MPa)
 * @param {number} thetaGrados - Ángulo en grados respecto a la dirección de la fibra (0° a 90°)
 */
export function calculateHankinson(Fc_adm, Fp_adm, thetaGrados) {
  const thetaRad = (thetaGrados * Math.PI) / 180;
  const sin2 = Math.pow(Math.sin(thetaRad), 2);
  const cos2 = Math.pow(Math.cos(thetaRad), 2);
  
  const F_theta = (Fc_adm * Fp_adm) / ((Fc_adm * sin2) + (Fp_adm * cos2));
  return F_theta;
}

/**
 * Verificación completa de columna sometida a compresión axial
 */
export function verifyColumn(input) {
  const {
    material,
    section,
    Pu,        // Carga axial de compresión actuante (kN)
    L,         // Longitud no soportada (m)
    K = 1.00,  // Coeficiente de longitud efectiva
    numPernos = 0,
    diamPerno = 12.7, // 1/2 pulg
    anguloHankinson = 0, // Grados
    factores = {}
  } = input;

  const CD = factores.CD ?? 1.00;
  const Cm = factores.Cm ?? 1.00;
  const Ct = factores.Ct ?? 1.00;
  const Cin = factores.Cin ?? 1.00;
  const Cr = factores.Cr ?? 1.00;
  const Ckd = factores.Ckd ?? 1.00;

  // Propiedades geométricas
  const geom = calculateBeamProperties(section);

  // Descuento por pernos pasantes para área neta
  const areaPerno = numPernos * (diamPerno * (section.t || 15) * 2);
  const Aneta = Math.max(100, geom.Area - areaPerno); // mm²

  // Longitud efectiva
  const Le_mm = K * (L * 1000); // mm
  const r_min = Math.min(geom.rx, geom.ry);
  const lambda = Le_mm / r_min;

  // Módulos modificados
  const Emin_mod = material.emin * Cm * Ct * Cin;
  const E05_mod = material.e05 * Cm * Ct * Cin;

  // Esfuerzo de compresión modificado de referencia F*c
  const Fc_ast = material.fc * CD * Cm * Ct * Cin * Cr * Ckd;

  // Factor de Estabilidad Cp
  const stab = calculateCp(lambda, Emin_mod, Fc_ast, material.tipo);
  const Cp = stab.Cp;

  // Esfuerzo de compresión admisible modificado
  const Fc_adm = Fc_ast * Cp; // MPa
  const Padm = (Fc_adm * Aneta) / 1000; // kN

  // Esfuerzo actuante
  const fc_act = (Pu * 1000) / Aneta; // MPa

  // Esfuerzo admisible para carga inclinada si aplica
  let Ftheta_adm = Fc_adm;
  if (anguloHankinson > 0) {
    const Fp_adm = material.fp * CD * Cm * Ct * Cin;
    Ftheta_adm = calculateHankinson(Fc_adm, Fp_adm, anguloHankinson);
  }

  // Ratios de Demanda / Capacidad
  const dcr_axial = Pu / Padm;
  const dcr_hankinson = anguloHankinson > 0 ? (fc_act / Ftheta_adm) : dcr_axial;

  return {
    geom: { ...geom, Aneta },
    material,
    solicitaciones: { Pu, L, K, Le_mm },
    esbeltez: { lambda, r_min, cumple: stab.cumpleEsbeltez },
    estabilidad: { Cp, FcE: stab.FcE },
    admisibles: { Fc_adm, Ftheta_adm, Padm, Emin_mod },
    actuantes: { fc_act },
    dcr: {
      axial: dcr_axial,
      hankinson: dcr_hankinson,
      max: Math.max(dcr_axial, dcr_hankinson)
    },
    cumple: dcr_axial <= 1.0 && dcr_hankinson <= 1.0 && stab.cumpleEsbeltez
  };
}
