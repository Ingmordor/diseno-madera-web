# Catálogo de Imágenes Estructurales - DENDRO-STRUCT

Este repositorio de imágenes contiene las referencias visuales, esquemas normativos (NSR-10 Título G) y fórmulas matemáticas extraídas del documento oficial de diseño **TRL3-DENDROCALAMUS COLUMNAS.pdf**.

Están clasificadas y optimizadas para ser incrustadas automáticamente en las memorias de cálculo generadas por la aplicación web (HTML imprimible y exportación a PDF).

---

## 1. Normativa y Esquemas Estructurales (`assets/images/normativa/`)

| Archivo | Descripción | Referencia NSR-10 |
| :--- | :--- | :--- |
| `factores_k_longitud_efectiva.png` | Casos de fijación de apoyos y factores de longitud efectiva $K_e$ (articulado, empotrado, libre) | NSR-10 Art. G.4.3.2 |
| `columnas_adelgazadas.png` | Geometría y cálculo de columnas de sección variable o adelgazada | NSR-10 Art. G.4.3.7 |
| `soporte_lateral_vigas_cl.png` | Criterios de arriostramiento lateral y recomendación para $C_L = 1.0$ | NSR-10 Art. G.3.3.2 |
| `arriostramiento_lateral_le.png` | Tabla de casos de restricción del ala a compresión y longitud efectiva $l_e$ | NSR-10 Tabla G.3-1 |

---

## 2. Fórmulas Matemáticas (`assets/images/formulas/`)

| Archivo | Ecuación / Formulación | Referencia NSR-10 |
| :--- | :--- | :--- |
| `formula_estabilidad_columnas_cp.png` | Factor de estabilidad de columna $C_p$ y Euler $F_{cE}$ | NSR-10 Ec. G.4-2 |
| `formula_cp_factor_c.png` | Parámetro $c$ ($0.85$ bambú/rolliza, $0.80$ aserrada, $0.90$ laminada) | NSR-10 Art. G.4.3.5 |
| `formula_hankinson.png` | Ecuación de Hankinson para compresión oblicua con ángulo $\theta$ | NSR-10 Ec. G.3-8 |
| `formula_interaccion_biaxial_g52.png` | Ecuación de interacción para flexión biaxial y carga axial ($RBI \le 1.0$) | NSR-10 Ec. G.5-1 / G.5-2 |
| `formula_esbeltez_vigas_rb.png` | Relación de esbeltez de vigas $R_B$ y esfuerzo crítico $F_{bE}$ | NSR-10 Art. G.3.3 |
| `formula_momento_admisible_mn.png` | Momento admisible $M_n = F'_b \cdot S$ | NSR-10 Art. G.3.2 |
| `formula_cortante_fv.png` | Esfuerzo cortante actuante $f_v = \frac{3V}{2A}$ y admisible $F'_v$ | NSR-10 Art. G.3.4 |

---

## 3. Geometría y Secciones (`assets/images/secciones/`)

| Archivo | Descripción | Secciones aplicables |
| :--- | :--- | :--- |
| `tipos_secciones_geometria.png` | Definición de ejes principales, dimensiones ($d_1, d_2, D, t$) y radios de giro ($r_x, r_y$) | Tubular (Bambú), Rectangular, Perfil Compuesto |

---

## 4. Estructura y Proyecto (`assets/images/proyecto/`)

| Archivo | Descripción |
| :--- | :--- |
| `modelo_estructural_3d.jpg` | Modelo analítico tridimensional del pórtico estructural TRL-3 en bambú |
| `portico_estructural_bambu.jpg` | Detalle constructivo y vista del pórtico estructural analizado |

---

## Modo de Uso en las Memorias de Cálculo

En HTML / Web:
```html
<img src="assets/images/normativa/factores_k_longitud_efectiva.png" alt="Factores K NSR-10" class="max-h-48 object-contain mx-auto" />
```
o incrustadas en SVG/Canvas para exportación PDF sin pérdida.
