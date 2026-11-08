/**
 * CONSTANTES Y BASES DE DATOS ESTRUCTURALES - NSR-10 TÍTULO G
 * Extraídas y calibradas directamente de TRL3-DENDROCALAMUS.xlsx
 */

// Propiedades mecánicas admisibles base (Fi) a Contenido de Humedad CH = 12% (MPa)
// y Módulos de Elasticidad Longitudinal (Ei)
export const MATERIALES = {
  ES7: {
    codigo: 'ES7',
    nombre: 'Dendrocalamus asper (Bambú Gigante)',
    descripcion: 'Especie caracterizada de bambú leñoso con alta resistencia a flexión y compresión.',
    tipo: 'bambu',
    // Esfuerzos admisibles base en MPa (CH = 12%)
    fb: 85.17, // Flexión
    ft: 7.00,  // Tensión paralela
    fc: 34.12, // Compresión paralela
    fp: 8.16,  // Compresión perpendicular / Aplastamiento
    fv: 8.30,  // Cortante paralelo a la fibra
    // Módulos de elasticidad en MPa
    e05: 19220, // Módulo promedio E0.5
    e005: 12493, // Módulo 5° percentil (0.65 * E0.5)
    emin: 6727,  // Módulo mínimo de estabilidad (0.35 * E0.5)
    densidad: 750 // kg/m³
  },
  ES1: {
    codigo: 'ES1',
    nombre: 'NSR-10 Madera Grupo A (Duras)',
    descripcion: 'Maderas de alta densidad (Abarco, Algarrobo, Guayacán, Choiba).',
    tipo: 'madera',
    fb: 15.00,
    ft: 18.00,
    fc: 14.00,
    fp: 1.40,
    fv: 1.20,
    e05: 9500,
    e005: 7500,
    emin: 4000,
    densidad: 850
  },
  ES2: {
    codigo: 'ES2',
    nombre: 'Madera Laminada Encolada (K.T.)',
    descripcion: 'Vigas y columnas de madera laminada estructural de alta capacidad.',
    tipo: 'laminada',
    fb: 89.70,
    ft: 1.39,
    fc: 65.70,
    fp: 9.30,
    fv: 5.10,
    e05: 23674,
    e005: 13250,
    emin: 7130,
    densidad: 600
  },
  ES3: {
    codigo: 'ES3',
    nombre: 'NSR-10 Madera Grupo B (Medias)',
    descripcion: 'Maderas de densidad intermedia (Agracejo, Cedro, Laurel, Roble).',
    tipo: 'madera',
    fb: 23.00,
    ft: 17.00,
    fc: 19.00,
    fp: 3.80,
    fv: 1.60,
    e05: 14000,
    e005: 11000,
    emin: 5500,
    densidad: 700
  },
  ES4: {
    codigo: 'ES4',
    nombre: 'NSR-10 Madera Grupo C (Blandas)',
    descripcion: 'Maderas blandas (Caracolí, Ceiba, Guamo, Machare, Pino Pátula).',
    tipo: 'madera',
    fb: 17.90,
    ft: 8.30,
    fc: 11.00,
    fp: 5.10,
    fv: 2.10,
    e05: 13100,
    e005: 10200,
    emin: 6145,
    densidad: 500
  },
  ES6: {
    codigo: 'ES6',
    nombre: 'Madera Maciza T.E.',
    descripcion: 'Madera maciza tratada estructuralmente.',
    tipo: 'madera',
    fb: 10.30,
    ft: 5.70,
    fc: 11.40,
    fp: 3.90,
    fv: 1.20,
    e05: 11721,
    e005: 7096,
    emin: 4274,
    densidad: 550
  }
};

// Factores por Duración de la Carga (CD) - NSR-10 G.2.2.1
export const FACTORES_CD = [
  { valor: 0.90, label: '0.90 - Permanente / Carga Muerta', desc: 'Más de 10 años continuos' },
  { valor: 1.00, label: '1.00 - Normal de Ocupación / Carga Viva', desc: '10 años de duración acumulada' },
  { valor: 1.15, label: '1.15 - Nieve / Viento Temporal', desc: '2 meses de duración' },
  { valor: 1.25, label: '1.25 - Construcción / Montaje', desc: '7 días de duración' },
  { valor: 1.60, label: '1.60 - Sismo / Viento Máximo', desc: '10 minutos (evento sísmico)' },
  { valor: 2.00, label: '2.00 - Carga de Impacto', desc: 'Segundos' }
];

// Factores por Contenido de Humedad (Cm) - NSR-10 G.2.2.2
export const FACTORES_CM = {
  '12': { valor: 1.00, fb: 1.00, ft: 1.00, fc: 1.00, fp: 1.00, fv: 1.00, e: 1.00, label: 'CH = 12% (Condición seca estándar)' },
  '14': { valor: 0.91, fb: 0.91, ft: 0.94, fc: 0.91, fp: 0.90, fv: 0.94, e: 0.95, label: 'CH = 14% (Ambiente seco protegido)' },
  '17': { valor: 0.79, fb: 0.79, ft: 0.86, fc: 0.79, fp: 0.76, fv: 0.86, e: 0.89, label: 'CH = 17% (Ambiente semi-húmedo)' },
  '19': { valor: 0.70, fb: 0.70, ft: 0.80, fc: 0.70, fp: 0.67, fv: 0.78, e: 0.80, label: 'CH = 19% (Límite madera seca)' },
  'humedo': { valor: 0.75, fb: 0.75, ft: 0.75, fc: 0.65, fp: 0.60, fv: 0.75, e: 0.80, label: 'CH > 19% (Estado verde / Rolliza G.4.6.2.4)' }
};

// Factores por Incisiones de Tratamiento (Cin) - NSR-10 G.2.2.4
export const FACTORES_CIN = {
  sin: { valor: 1.00, fb: 1.00, ft: 1.00, fc: 1.00, fv: 1.00, fp: 1.00, e: 1.00, label: 'Sin Incisiones' },
  con: { valor: 0.80, fb: 0.80, ft: 0.80, fc: 0.80, fv: 0.80, fp: 1.00, e: 0.95, label: 'Tratado con Incisiones (Cin)' }
};

// Factores de Fijación de Apoyos de Columna (K) - NSR-10 G.4.3.2
export const FACTORES_K = [
  { valor: 1.00, label: 'K = 1.00 : Articulado - Articulado (Teórico y Recomendado)', desc: 'Libre de girar en ambos extremos' },
  { valor: 0.80, label: 'K = 0.80 : Empotrado - Articulado', desc: 'Un extremo empotrado, otro articulado' },
  { valor: 0.65, label: 'K = 0.65 : Empotrado - Empotrado', desc: 'Rotación impedida en ambos apoyos' },
  { valor: 2.10, label: 'K = 2.10 : Voladizo / Libre (Cantilever)', desc: 'Empotrado en base, libre en corona' }
];

// Catálogo de Secciones Comerciales (de Hoja 76 SECCIONES COMERCIALES)
export const SECCIONES_COMERCIALES = [
  // Culmos estándar de Dendrocalamus (diámetro y espesor típico)
  { nombre: 'Dendrocalamus Ø100 (t=10mm)', tipo: 'tubo', D: 100, t: 10 },
  { nombre: 'Dendrocalamus Ø120 (t=12mm)', tipo: 'tubo', D: 120, t: 12 },
  { nombre: 'Dendrocalamus Ø140 (t=14mm)', tipo: 'tubo', D: 140, t: 14 },
  { nombre: 'Dendrocalamus Ø160 (t=16mm)', tipo: 'tubo', D: 160, t: 16 },
  { nombre: 'Dendrocalamus Ø180 (t=18mm)', tipo: 'tubo', D: 180, t: 18 },
  { nombre: 'Dendrocalamus Ø200 (t=20mm)', tipo: 'tubo', D: 200, t: 20 },

  // Secciones Rectangulares comerciales (b x d en mm)
  { nombre: 'VM 40x80', tipo: 'rect', b: 40, d: 80 },
  { nombre: 'VM 40x100', tipo: 'rect', b: 40, d: 100 },
  { nombre: 'VM 40x120', tipo: 'rect', b: 40, d: 120 },
  { nombre: 'VM 60x100', tipo: 'rect', b: 60, d: 100 },
  { nombre: 'VM 80x80', tipo: 'rect', b: 80, d: 80 },
  { nombre: 'VM 100x100', tipo: 'rect', b: 100, d: 100 },
  { nombre: 'VM 80x180', tipo: 'rect', b: 80, d: 180 },
  { nombre: 'VM 100x180', tipo: 'rect', b: 100, d: 180 },
  { nombre: 'VM 100x200', tipo: 'rect', b: 100, d: 200 },
  { nombre: 'VM 120x180', tipo: 'rect', b: 120, d: 180 },
  { nombre: 'VM 140x180', tipo: 'rect', b: 140, d: 180 },
  { nombre: 'VM 160x180', tipo: 'rect', b: 160, d: 180 },
  { nombre: 'VM 180x180', tipo: 'rect', b: 180, d: 180 },
  { nombre: 'VM 80x200', tipo: 'rect', b: 80, d: 200 },
  { nombre: 'VM 100x400', tipo: 'rect', b: 100, d: 400 },
  { nombre: 'VM 100x500', tipo: 'rect', b: 100, d: 500 },
  { nombre: 'VM 200x500', tipo: 'rect', b: 200, d: 500 },
  { nombre: 'VM 300x500', tipo: 'rect', b: 300, d: 500 }
];
