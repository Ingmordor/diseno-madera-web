/**
 * MÓDULO DE FLEXO-COMPRESIÓN BIAXIAL
 * Implementación exacta de la ecuación de interacción NSR-10 Capítulo G.5.2
 * (Calibrada con las hojas COLUMNAS BAMBU y COLUMNAS de TRL3-DENDROCALAMUS.xlsx)
 */

import { calculateBeamProperties, calculateCL } from './beams.js';
import { calculateCp } from './columns.js';

export function verifyBiaxialInteraction(input) {
  const {
    material,
    section,
    Pu,        // Axial de compresión (kN)
    Mx,        // Momento flector en eje principal 1 (kN·m)
    My,        // Momento flector en eje principal 2 (kN·m)
    Lx,        // Luz no soportada eje X (m)
    Ly,        // Luz no soportada eje Y (m)
    Kx = 1.0,
    Ky = 1.0,
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

  // Módulos elásticos modificados
  const Emin_mod = material.emin * Cm * Ct * Cin;

  // Longitudes efectivas y esbelteces
  const Le_x = Kx * (Lx * 1000); // mm
  const Le_y = Ky * (Ly * 1000); // mm

  const lambda_x = Le_x / geom.rx;
  const lambda_y = Le_y / geom.ry;

  // Esfuerzos de compresión de Euler FcE1 y FcE2
  const FcE1 = (0.822 * Emin_mod) / Math.pow(Math.max(1, lambda_x), 2);
  const FcE2 = (0.822 * Emin_mod) / Math.pow(Math.max(1, lambda_y), 2);

  // Esfuerzo de pandeo lateral torsional de viga FbE1
  const estLat = calculateCL(section.tipo, geom.ancho, geom.peralte, Lx, Emin_mod, material.fb);
  const FbE1 = estLat.F_bE === Infinity ? (3.0 * material.fb) : estLat.F_bE;

  // Factores Cp1 y Cp2
  const Fc_ast = material.fc * CD * Cm * Ct * Cin * Cr * Ckd;
  const stab_x = calculateCp(lambda_x, Emin_mod, Fc_ast, material.tipo);
  const stab_y = calculateCp(lambda_y, Emin_mod, Fc_ast, material.tipo);
  const Cp = Math.min(stab_x.Cp, stab_y.Cp);

  // Resistencias admisibles modificadas
  const Fc_adm = Fc_ast * Cp; // MPa
  const Fb1_adm = material.fb * CD * Cm * Ct * Cin * Cr * estLat.CL; // MPa
  const Fb2_adm = material.fb * CD * Cm * Ct * Cin * Cr; // MPa (eje secundario)

  // Esfuerzos actuantes
  const fc_act = (Pu * 1000) / geom.Area; // MPa
  const fb1_act = (Math.abs(Mx) * 1e6) / geom.Sx;  // MPa
  const fb2_act = (Math.abs(My) * 1e6) / geom.Sy;  // MPa

  // TÉRMINOS DE LA ECUACIÓN DE INTERACCIÓN NSR-10 G.5.2
  // Término 1: Efecto axial directo al cuadrado
  const terminoAxial = Math.pow(fc_act / Fc_adm, 2);

  // Término 2: Flexión en eje 1 con amplificación por pandeo
  const denomFlex1 = Fb1_adm * Math.max(0.01, 1 - (fc_act / FcE1));
  const terminoFlex1 = fb1_act / denomFlex1;

  // Término 3: Flexión en eje 2 con amplificación por interacción biaxial y pandeo
  const factorAcople = Math.pow(fb1_act / FbE1, 2);
  const denomFlex2 = Fb2_adm * Math.max(0.01, 1 - (fc_act / FcE2) - factorAcople);
  const terminoFlex2 = fb2_act / denomFlex2;

  // Ratio de interacción total
  const ratioTotal = terminoAxial + terminoFlex1 + terminoFlex2;

  return {
    geom,
    solicitaciones: { Pu, Mx, My, Lx, Ly },
    esbelteces: { lambda_x, lambda_y, FcE1, FcE2, FbE1 },
    admisibles: { Fc_adm, Fb1_adm, Fb2_adm, Cp },
    actuantes: { fc_act, fb1_act, fb2_act },
    desglose: {
      terminoAxial,
      terminoFlex1,
      terminoFlex2,
      aporteAxialPct: (terminoAxial / Math.max(0.001, ratioTotal)) * 100,
      aporteFlex1Pct: (terminoFlex1 / Math.max(0.001, ratioTotal)) * 100,
      aporteFlex2Pct: (terminoFlex2 / Math.max(0.001, ratioTotal)) * 100
    },
    ratioTotal,
    cumple: Number.isFinite(ratioTotal) && ratioTotal <= 1.00 && lambda_x <= 50 && lambda_y <= 50 && fc_act < FcE1 && fc_act < FcE2 && estLat.cumpleEsbeltez
  };
}
