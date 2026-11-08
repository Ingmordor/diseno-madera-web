# DENDRO-STRUCT 🎋 | Diseño y Verificación Estructural en Bambú & Madera

Aplicación web interactiva de ingeniería civil para el diseño y verificación de secciones estructurales en madera y bambú (**_Dendrocalamus asper_** / bambú gigante) bajo los lineamientos del **Reglamento Colombiano de Construcción Sismo Resistente (NSR-10 - Título G)**.

Basada y calibrada directamente sobre las fórmulas, tablas y modelos de cálculo de la hoja de ingeniería **`TRL3-DENDROCALAMUS.xlsx`**.

---

## 🚀 Características Principales

*   **🎋 Caracterización de _Dendrocalamus asper_ (Grupo ES7):**
    *   Flexión admisible base: $F_b = 85.17\text{ MPa}$
    *   Tensión paralela: $F_t = 7.00\text{ MPa}$
    *   Compresión paralela: $F_c = 34.12\text{ MPa}$
    *   Compresión perpendicular / Aplastamiento: $F_p = 8.16\text{ MPa}$
    *   Cortante paralelo a la fibra: $F_v = 8.30\text{ MPa}$
    *   Módulo promedio: $E_{0.5} = 19,220\text{ MPa}$ | Módulo de estabilidad: $E_{min} = 6,727\text{ MPa}$
    *   Soporte comparativo con maderas comerciales NSR-10 (Grupo A - ES1, Madera Laminada - ES2, Grupo B - ES3, Grupo C - ES4, Madera Maciza - ES6).

*   **📐 Módulo 1: Vigas a Flexión, Cortante y Flecha (NSR-10 G.4.1):**
    *   Cálculo de propiedades geométricas en tiempo real ($A_{neta}, I_x, S_x, r_x$) para culmos tubulares de bambú, haces bi-culmo, madera rolliza y secciones rectangulares.
    *   Evaluación de la esbeltez de viga $R_B = \sqrt{l_e d / b^2} \le 50$ y factor de estabilidad lateral $C_L$.
    *   Verificación de deflexión elástica máxima instantánea y diferida ($\Delta \le L/240$).
    *   Semáforos DCR (*Demand / Capacity Ratio*) en tiempo real.

*   **🏛️ Módulo 2: Columnas y Carga Axial Pura (NSR-10 G.4.2 y G.4.3):**
    *   Verificación por esbeltez $\lambda = l_e / r \le 50$.
    *   Factor de estabilidad de columnas $C_P$ con parámetro $c = 0.85$ para rolliza / bambú y cálculo de Euler $F_{cE} = \frac{0.822 E'_{min}}{\lambda^2}$.
    *   Verificación de cargas inclinadas respecto a la fibra mediante la **Fórmula de Hankinson (NSR-10 G.3.5.2)**.

*   **🔄 Módulo 3: Flexo-Compresión Biaxial (NSR-10 G.5.2):**
    *   Implementación de la formulación cuadrática completa de interacción:
      $$\left(\frac{f_c}{F'_c}\right)^2 + \frac{f_{b1}}{F'_{b1} \left(1 - \frac{f_c}{F_{cE1}}\right)} + \frac{f_{b2}}{F'_{b2} \left(1 - \frac{f_c}{F_{cE2}} - \left(\frac{f_{b1}}{F_{bE1}}\right)^2\right)} \le 1.0$$
    *   Diagrama elíptico de interacción $P-M$ con proyección del punto de demanda.

*   **🔬 Gráficos Técnicos en Tiempo Real (SVG Nativo):**
    *   Dibujo a escala milimétrica de la sección transversal con cotas y ejes centroidales.
    *   Diagramas de distribución de esfuerzos normales ($\sigma$) y cortantes ($\tau$).
    *   Diagramas de solicitaciones de viga ($M(x), V(x)$).

*   **📋 Memorias de Cálculo & Salida Multi-Elemento (NSR-10 Título G):**
    *   Generación de reportes técnicos idénticos al formato oficial **`TRL3-DENDROCALAMUS COLUMNAS.pdf`**.
    *   **Salida Multi-Elemento (Páginas 41 a 59 del PDF):** Tabla consolidada para grupos de columnas y vigas con ratios de demanda/capacidad ($M_a/M_n$, $V_a/V_n$, $P_a/P_n$, $\lambda$, $C_p$, $C_L$, Euler $F_{cE}$ y ratio biaxial $RBI \le 1.0$) y veredicto normativo (CUMPLE / SOBREESFUERZO).
    *   **Ficha Detallada Paso a Paso:** Memorias analíticas individuales con desglose de factores ($C_D, C_m, C_t, C_{in}, C_r, C_{kd}, C_F, C_T$).
    *   **Catálogo de Imágenes y Esquemas Normativos Embebidos (`assets/images/`):**
        *   `normativa/`: Casos de longitud efectiva $K_e$, columnas adelgazadas, arriostramiento lateral de vigas y tablas NSR-10.
        *   `formulas/`: Ecuaciones oficiales de estabilidad $C_p$, Euler, Hankinson para compresión oblicua e interacción biaxial G.5.2.
        *   `proyecto/`: Modelos tridimensionales de pórticos estructurales en bambú del proyecto TRL-3.
    *   Impresión y exportación PDF optimizada con estilos `@media print` de paginación limpia.

---

## 💻 Ejecución Local

No requiere instalar Node.js ni dependencias pesadas. Puedes abrirlo directamente o correrlo con Python:

```bash
# Opción 1: Abrir directamente en tu navegador favorito
# Haz doble clic sobre 'index.html'

# Opción 2: Con el servidor web ligero de Python
python -m http.server 3000
# Abre http://localhost:3000 en tu navegador
```

---

## ☁️ Despliegue en Cloudflare Pages

La aplicación está lista para desplegarse gratuitamente en **Cloudflare Pages** conectada a este repositorio:

1. Entra a tu cuenta en [dash.cloudflare.com](https://dash.cloudflare.com).
2. Ve a **Workers & Pages** $\rightarrow$ **Create application** $\rightarrow$ pestaña **Pages**.
3. Selecciona **Connect to Git** y escoge el repositorio: `https://github.com/Ingmordor/diseno-madera-web.git`.
4. En la configuración de despliegue:
   * **Framework preset:** `None` (o dejar en blanco)
   * **Build command:** (dejar vacío)
   * **Build output directory:** `/` (o dejar vacío para servir la raíz)
5. Haz clic en **Save and Deploy**.
6. En segundos, Cloudflare te entregará una URL pública con HTTPS activo (ejemplo: `https://diseno-madera-web.pages.dev`).

Cada vez que hagamos `git push` a la rama `main`, Cloudflare actualizará el sitio automáticamente.

---

## 📄 Licencia

MIT License - Desarrollado para ingeniería sismorresistente con materiales sostenibles.
