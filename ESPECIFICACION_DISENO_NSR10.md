# ESPECIFICACIÓN TÉCNICA DE DISEÑO ESTRUCTURAL EN BAMBÚ Y MADERA
## Formato Plano Universal para Programación de Algoritmos (NSR-10 Título G)
**Basado en:** `TRL3-DENDROCALAMUS.xlsx`  
**Referencia Normativa:** Reglamento Colombiano de Construcción Sismo Resistente (NSR-10) — Título G  
**Especie Principal:** *Dendrocalamus asper* (Bambú Gigante - Grupo Estructural ES7)  
**Sistema de Unidades:** Sistema Internacional (SI) — Longitud: `mm` o `m`, Fuerza: `N` o `kN`, Momento: `kN·m`, Esfuerzo: `MPa` (`N/mm²`).

---

## 1. INTRODUCCIÓN Y PROPÓSITO
Este documento describe el **flujo lógico, las tablas numéricas y las ecuaciones algebraicas** requeridas para programar el diseño y verificación de elementos estructurales de madera y culmos de bambú (*Dendrocalamus asper*) en cualquier lenguaje de programación (Python, JavaScript, C#, C++, MATLAB, Java, etc.) sin ambigüedad.

---

## 2. TABLAS DE CONSTANTES Y PROPIEDADES DE MATERIALES

### 2.1 Esfuerzos Admisibles Base ($F_i$) a Contenido de Humedad CH = 12% [MPa]
| Código | Especie / Grupo | Flexión ($F_b$) | Tensión // ($F_t$) | Compresión // ($F_c$) | Compresión ⟂ ($F_p$) | Cortante // ($F_v$) |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **ES7** | **Dendrocalamus asper** | **85.17** | **7.00** | **34.12** | **8.16** | **8.30** |
| **ES1** | NSR-10 Grupo A (Duras) | 15.00 | 18.00 | 14.00 | 1.40 | 1.20 |
| **ES2** | Madera Laminada K.T. | 89.70 | 1.39 | 65.70 | 9.30 | 5.10 |
| **ES3** | NSR-10 Grupo B (Medias) | 23.00 | 17.00 | 19.00 | 3.80 | 1.60 |
| **ES4** | NSR-10 Grupo C (Blandas) | 17.90 | 8.30 | 11.00 | 5.10 | 2.10 |
| **ES6** | Madera Maciza T.E. | 10.30 | 5.70 | 11.40 | 3.90 | 1.20 |

### 2.2 Módulos de Elasticidad Longitudinal ($E_i$) [MPa]
| Código | Especie / Grupo | Módulo Promedio ($E_{0.5}$) | 5° Percentil ($E_{0.05} = 0.65 E_{0.5}$) | Mínimo Estabilidad ($E_{min} = 0.35 E_{0.5}$) |
| :--- | :--- | :---: | :---: | :---: |
| **ES7** | **Dendrocalamus asper** | **19,220** | **12,493** | **6,727** |
| **ES1** | NSR-10 Grupo A | 9,500 | 7,500 | 4,000 |
| **ES2** | Madera Laminada | 23,674 | 13,250 | 7,130 |
| **ES3** | NSR-10 Grupo B | 14,000 | 11,000 | 5,500 |
| **ES4** | NSR-10 Grupo C | 13,100 | 10,200 | 6,145 |
| **ES6** | Madera Maciza T.E. | 11,721 | 7,096 | 4,274 |

---

## 3. FACTORES MODIFICADORES DE RESISTENCIA (NSR-10 G.2 Y G.3)

Los esfuerzos admisibles de diseño ($F'_i$) resultan de multiplicar el esfuerzo base ($F_i$) por factores que consideran el entorno y la solicitación:

$$F'_i = F_i \cdot \prod C_k$$

### 3.1 Factor por Duración de Carga ($C_D$) — NSR-10 G.2.2.1
```text
REGLA:
  SI duracion == "Permanente"    ENTONCES CD = 0.90   // Carga muerta continua (> 10 años)
  SI duracion == "Ocupacion"     ENTONCES CD = 1.00   // Carga viva normal (10 años acumulados)
  SI duracion == "Nieve_Viento"  ENTONCES CD = 1.15   // 2 meses de duración
  SI duracion == "Construccion"  ENTONCES CD = 1.25   // 7 días de duración
  SI duracion == "Sismo"         ENTONCES CD = 1.60   // 10 minutos (evento sísmico)
  SI duracion == "Impacto"       ENTONCES CD = 2.00   // Segundos
```

### 3.2 Factor por Contenido de Humedad ($C_m$) — NSR-10 G.2.2.2 y G.4.6.2.4
```text
REGLA:
  SI CH == "12%" ENTONCES Cm = 1.00 (en todos los esfuerzos y modulos)
  SI CH == "14%" ENTONCES Cm_Fb = 0.91, Cm_Ft = 0.94, Cm_Fc = 0.91, Cm_Fp = 0.90, Cm_Fv = 0.94, Cm_E = 0.95
  SI CH == "17%" ENTONCES Cm_Fb = 0.79, Cm_Ft = 0.86, Cm_Fc = 0.79, Cm_Fp = 0.76, Cm_Fv = 0.86, Cm_E = 0.89
  SI CH == "19%" ENTONCES Cm_Fb = 0.70, Cm_Ft = 0.80, Cm_Fc = 0.70, Cm_Fp = 0.67, Cm_Fv = 0.78, Cm_E = 0.80
  SI CH > "19%" (Húmedo para rolliza / bambú):
      Cm_Fb = 0.75, Cm_Fc = 0.65, Cm_Fp = 0.60, Cm_Fv = 0.75, Cm_E = 0.80
```

### 3.3 Factor por Tratamiento con Incisiones ($C_{in}$) — NSR-10 G.2.2.4
```text
REGLA:
  SI incisiones == FALSE ENTONCES Cin = 1.00
  SI incisiones == TRUE  ENTONCES Cin_esfuerzos = 0.80, Cin_modulos = 0.95, Cin_Fp = 1.00
```

### 3.4 Factor por Acción de Conjunto / Repartición ($C_r$) — NSR-10 G.2.2.3.5
```text
REGLA:
  SI elementos_paralelos >= 3 Y espaciamiento <= 610 mm Y cubierta_continua == TRUE ENTONCES
      Cr = 1.15
  SINO
      Cr = 1.00
```

### 3.5 Factor por Alisadura / Desbastado ($C_{kd}$) — NSR-10 G.4.6.2.3
```text
REGLA (Aplica a culmos y maderas rollizas):
  SI desbastado_mecanico == TRUE ENTONCES
      Ckd_Fb = 0.95, Ckd_Ft = 0.95, Ckd_Fc = 0.95, Ckd_Fp = 1.00
  SINO
      Ckd = 1.00
```

---

## 4. PROPIEDADES GEOMÉTRICAS DE SECCIÓN TRANSVERSAL

### 4.1 Culmo Tubular Único de Bambú (*Dendrocalamus*)
*   **Entradas:** Diámetro exterior $D$ [mm], Espesor de pared $t$ [mm].
*   **Diámetro interior:** $D_i = D - 2t$ [mm].
*   **Área neta ($A$):**
    $$A = \frac{\pi}{4} \cdot \left(D^2 - D_i^2\right) \quad [\text{mm}^2]$$
*   **Momento de Inercia ($I_x = I_y$):**
    $$I_x = \frac{\pi}{64} \cdot \left(D^4 - D_i^4\right) \quad [\text{mm}^4]$$
*   **Módulo de Sección elástico ($S_x = S_y$):**
    $$S_x = \frac{2 \cdot I_x}{D} \quad [\text{mm}^3]$$
*   **Radio de giro ($r_x = r_y$):**
    $$r_x = \sqrt{\frac{I_x}{A}} = \frac{\sqrt{D^2 + D_i^2}}{4} \quad [\text{mm}]$$

### 4.2 Haz Compuesto Bi-Culmo (2 Cañas Acopladas en Paralelo con Pernos)
*   **Área total ($A$):** $A = 2 \cdot A_1$ [mm²].
*   **Inercia eje fuerte (flexión respecto a X):** $I_x = 2 \cdot I_1$ [mm⁴].
*   **Inercia eje Y (acoplado por pernos a distancia $D$):**
    $$I_y = 2 \cdot \left[I_1 + A_1 \cdot \left(\frac{D}{2}\right)^2\right] \quad [\text{mm}^4]$$
*   **Módulos:** $S_x = 2 \cdot S_1$, $S_y = I_y / D$.

### 4.3 Sección Rectangular de Madera Aserrada / Laminada
*   **Entradas:** Base $b$ [mm], Altura $d$ [mm].
*   $A = b \cdot d$ [mm²].
*   $I_x = \frac{b \cdot d^3}{12}$, $I_y = \frac{d \cdot b^3}{12}$ [mm⁴].
*   $S_x = \frac{b \cdot d^2}{6}$, $S_y = \frac{d \cdot b^2}{6}$ [mm³].
*   $r_x = \frac{d}{\sqrt{12}}$, $r_y = \frac{b}{\sqrt{12}}$ [mm].

---

## 5. MÓDULO DE VIGAS A FLEXIÓN Y CORTANTE (NSR-10 G.4.1)

### 5.1 Entradas
*   Luz libre de cálculo $L$ [m].
*   Longitud no soportada lateralmente $L_u$ [m].
*   Carga distribuida $w$ [kN/m] (o momento actuante directo $M_u$ [kN·m], cortante $V_u$ [kN]).

### 5.2 Solicitaciones Actuantes
```text
Mu = (w * L^2) / 8                  [kN·m]
Vu = (w * L) / 2                    [kN]
fb = (Mu * 10^6) / Sx               [MPa] (Esfuerzo actuante a flexión)

SI tipo_seccion == "rect" ENTONCES:
    fv = (1.5 * Vu * 1000) / A      [MPa] (3V / 2A)
SINO SI tipo_seccion == "tubo" ENTONCES:
    fv = (2.0 * Vu * 1000) / A      [MPa] (2V / A para tubo circular)
SINO:
    fv = (1.33 * Vu * 1000) / A      [MPa] (4V / 3A para circular maciza)
```

### 5.3 Factor de Estabilidad Lateral de Viga ($C_L$) — NSR-10 G.4.1.3
```text
SI tipo_seccion IN ["tubo", "rolliza", "haz2"] ENTONCES:
    // En secciones circulares no existe tendencia preferente a pandeo lateral
    CL = 1.00
    RB = 0.0
SINO:
    // Sección rectangular
    le = 1.63 * (Lu * 1000) + 3 * d     [mm]
    RB = SQRT((le * d) / (b^2))

    SI RB > 50 ENTONCES
        ERROR: "La esbeltez RB excede el límite normativo de 50 (NSR-10 G.4.1.3)"

    E'min = Emin * Cm_E * Ct * Cin_E
    FbE = (1.20 * E'min) / (RB^2)       [MPa]
    F*b = Fb * CD * Cm_Fb * Ct * Cin * Cr * Cfu * Ckd

    ratio = FbE / F*b
    term1 = (1 + ratio) / 1.9
    CL = term1 - SQRT((term1^2) - (ratio / 0.95))
    CL = MIN(1.00, MAX(0.01, CL))
```

### 5.4 Factor por Forma / Peralte ($C_F$)
```text
SI tipo_seccion == "rect" Y d > 300 mm ENTONCES:
    CF = (300 / d)^0.11
SINO:
    CF = 1.00
```

### 5.5 Esfuerzos Admisibles Modificados
$$F'_b = F_b \cdot C_D \cdot C_m \cdot C_t \cdot C_{in} \cdot C_r \cdot C_L \cdot C_F \quad [\text{MPa}]$$
$$F'_v = F_v \cdot C_D \cdot C_m \cdot C_t \cdot C_{in} \cdot C_r \quad [\text{MPa}]$$

### 5.6 Deflexión Elástica ($\Delta$)
```text
E'05 = E05 * Cm_E * Ct * Cin_E          [MPa]
L_mm = L * 1000                         [mm]
delta = (5 * w * (L_mm^4)) / (384 * E'05 * Ix)   [mm]
delta_adm = L_mm / 240                  [mm] (Límite NSR-10)
```

### 5.7 Verificación de Cumplimiento (Ratios DCR)
```text
DCR_flexion   = fb / F'b
DCR_cortante  = fv / F'v
DCR_deflexion = delta / delta_adm

CUMPLE = (DCR_flexion <= 1.00) AND (DCR_cortante <= 1.00) AND (DCR_deflexion <= 1.00) AND (RB <= 50)
```

---

## 6. MÓDULO DE COLUMNAS Y COMPRESIÓN AXIAL (NSR-10 G.4.3)

### 6.1 Entradas
*   Carga axial actuante de compresión $P_u$ [kN].
*   Longitud no soportada $L$ [m].
*   Factor de longitud efectiva $K$:
    *   Articulado - Articulado: $K = 1.00$ (Teórico / Recomendado).
    *   Empotrado - Articulado: $K = 0.80$.
    *   Empotrado - Empotrado: $K = 0.65$.
    *   Voladizo (Cantilever): $K = 2.10$.

### 6.2 Relación de Esbeltez ($\lambda$) — NSR-10 G.4.3.2
```text
Le_mm = K * (L * 1000)                  [mm]
r_min = MIN(rx, ry)                     [mm]
lambda = Le_mm / r_min

SI lambda > 50 ENTONCES:
    ERROR: "La esbeltez lambda = {lambda} supera el límite normativo de 50 (NSR-10 G.4.3.2)"
```

### 6.3 Factor de Estabilidad de Columna ($C_P$) — NSR-10 G.4.3.5
```text
E'min = Emin * Cm_E * Ct * Cin_E        [MPa]
F*c = Fc * CD * Cm_Fc * Ct * Cin * Cr * Ckd   [MPa]

// Tensión elástica crítica de Euler:
FcE = (0.822 * E'min) / (lambda^2)      [MPa]

// Parámetro de material 'c':
SI tipo_material == "bambu" O tipo_seccion IN ["tubo", "rolliza"] ENTONCES:
    c = 0.85   // Rolliza y bambú (NSR-10 G.4.6)
SINO SI tipo_material == "laminada" ENTONCES:
    c = 0.90   // Madera laminada encolada
SINO:
    c = 0.80   // Madera aserrada maciza

ratio = FcE / F*c
term1 = (1 + ratio) / (2 * c)
radical = (term1^2) - (ratio / c)
Cp = term1 - SQRT(MAX(0, radical))
Cp = MIN(1.00, MAX(0.01, Cp))
```

### 6.4 Resistencia Admisible y Verificación
```text
F'c = F*c * Cp                          [MPa]
Padm = (F'c * Aneta) / 1000             [kN]
fc_act = (Pu * 1000) / Aneta            [MPa]

DCR_axial = Pu / Padm

CUMPLE_COLUMNA = (DCR_axial <= 1.00) AND (lambda <= 50)
```

### 6.5 Cargas Inclinadas Respecto a la Fibra (Fórmula de Hankinson — NSR-10 G.3.5.2)
Cuando la fuerza forma un ángulo $\theta$ con respecto a la fibra (ej: apoyos inclinados, cerchas):
$$F'_\theta = \frac{F'_c \cdot F'_p}{F'_c \cdot \sin^2\theta + F'_p \cdot \cos^2\theta} \quad [\text{MPa}]$$
```text
DCR_hankinson = fc_act / F'theta
```

---

## 7. MÓDULO DE FLEXO-COMPRESIÓN BIAXIAL (NSR-10 G.5.2)

Aplica a elementos tipo columna-viga sometidos simultáneamente a carga axial de compresión ($P_u$) y momentos flectores en ambos ejes ($M_{ux}, M_{uy}$).

### 7.1 Ecuación de Interacción Normativa
$$\left(\frac{f_c}{F'_c}\right)^2 + \frac{f_{b1}}{F'_{b1} \cdot \left(1 - \frac{f_c}{F_{cE1}}\right)} + \frac{f_{b2}}{F'_{b2} \cdot \left(1 - \frac{f_c}{F_{cE2}} - \left(\frac{f_{b1}}{F_{bE1}}\right)^2\right)} \le 1.00$$

### 7.2 Definición de Variables y Términos
*   $f_c = \frac{P_u \cdot 1000}{A}$ [MPa]: Esfuerzo actuante a compresión paralela.
*   $f_{b1} = \frac{M_{ux} \cdot 10^6}{S_x}$ [MPa]: Esfuerzo actuante a flexión en eje fuerte.
*   $f_{b2} = \frac{M_{uy} \cdot 10^6}{S_y}$ [MPa]: Esfuerzo actuante a flexión en eje débil.
*   $F'_c$: Esfuerzo admisible modificado a compresión con factor $C_P$ incluido.
*   $F'_{b1}$: Esfuerzo admisible modificado a flexión eje fuerte con factor $C_{L}$ incluido.
*   $F'_{b2}$: Esfuerzo admisible modificado a flexión eje débil.
*   $F_{cE1} = \frac{0.822 E'_{min}}{\lambda_x^2}$: Esfuerzo crítico de Euler respecto al eje 1.
*   $F_{cE2} = \frac{0.822 E'_{min}}{\lambda_y^2}$: Esfuerzo crítico de Euler respecto al eje 2.
*   $F_{bE1} = \frac{1.20 E'_{min}}{R_{B1}^2}$: Esfuerzo crítico de pandeo lateral de viga.

### 7.3 Algoritmo de Cálculo Paso a Paso
```text
1. Termino_Axial = (fc / F'c)^2

2. Denominador_Flex1 = F'b1 * MAX(0.01, 1 - (fc / FcE1))
   Termino_Flex1 = fb1 / Denominador_Flex1

3. Acople_Torsional = (fb1 / FbE1)^2
   Denominador_Flex2 = F'b2 * MAX(0.01, 1 - (fc / FcE2) - Acople_Torsional)
   Termino_Flex2 = fb2 / Denominador_Flex2

4. Ratio_Total = Termino_Axial + Termino_Flex1 + Termino_Flex2

5. EVALUACIÓN:
   SI Ratio_Total <= 1.00 ENTONCES:
       diagnostico = "CUMPLE (SECCIÓN SEGURA)"
   SINO:
       diagnostico = "FALLA POR SOBREESFUERZO EN INTERACCIÓN"
```

> **Nota Técnica:** En la hoja Excel original `TRL3-DENDROCALAMUS.xlsx` (celda `CX46`), la condición lógica fue escrita erróneamente como `=IF(CW46>1,"OK","R")`. El algoritmo correcto de ingeniería exige rigurosamente que $\text{Ratio} \le 1.00$ representa "OK" y $> 1.00$ representa "FALLA".

---

## 8. ESTRUCTURA DE DATOS JSON RECOMENDADA
Para alimentar programas en cualquier lenguaje, la base de datos de materiales se estructura en un archivo `.json`:

```json
{
  "materiales": {
    "ES7": {
      "nombre": "Dendrocalamus asper",
      "tipo": "bambu",
      "esfuerzos_base": { "fb": 85.17, "ft": 7.00, "fc": 34.12, "fp": 8.16, "fv": 8.30 },
      "modulos_elasticidad": { "e05": 19220, "e005": 12493, "emin": 6727 },
      "densidad_kg_m3": 750
    },
    "ES1": {
      "nombre": "NSR-10 Grupo A",
      "tipo": "madera",
      "esfuerzos_base": { "fb": 15.00, "ft": 18.00, "fc": 14.00, "fp": 1.40, "fv": 1.20 },
      "modulos_elasticidad": { "e05": 9500, "e005": 7500, "emin": 4000 },
      "densidad_kg_m3": 850
    }
  }
}
```

---

## 9. CONCLUSIÓN
Cualquier programador puede traducir esta especificación a:
*   Un script de Python (`def calcular_viga(...)`).
*   Una librería en C# (`public class DisenoMadera`).
*   Un módulo web en JavaScript / TypeScript (`export function verifyBeam(...)`).
*   Una hoja de cálculo automatizada o macro.
