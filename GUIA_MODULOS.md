# SIGER PRO - Guía de Acceso a Módulos

## 🚀 Cómo Acceder a SIGER PRO

### Opción 1: Dashboard Demo (Recomendado para Pruebas)
**URL:** `https://3000-iwis36cnwnd66iijlc74g-b7aaedc0.us1.manus.computer/demo.html`

1. Haz clic en el botón **"Acceso Demo"** en la página de inicio
2. Verás el dashboard completo con:
   - 174 evaluaciones importadas del Excel 2025
   - Gráficos de distribución de riesgos
   - Indicadores KPI
   - Botones para ingresar nuevas evaluaciones

### Opción 2: Página de Captura Dedicada
**URL:** `https://3000-iwis36cnwnd66iijlc74g-b7aaedc0.us1.manus.computer/captura.html`

Acceso directo al formulario para ingresar nuevas evaluaciones sin pasar por el dashboard.

---

## 📝 Módulo de Evaluaciones de Riesgos

### ¿Cómo Ingresar una Nueva Evaluación?

#### **Método 1: Desde el Dashboard Demo**

1. **Accede a:** `/demo.html`
2. **Haz clic en:** Tab "Nueva Evaluación" (en la sección de gráficos)
3. **Completa el formulario con:**
   - **Fecha:** Selecciona la fecha del incidente
   - **Forma de Reporte:** Escrita / Verbal / Sistema
   - **Tipo de Ocurrencia:** Incidente / Observación / Hallazgo
   - **Regulación Aplicable:** RAC / AIES-SOARG / NSOAM
   - **Probabilidad:** 1 (Baja) a 4 (Alta)
   - **Severidad:** A (Muy Baja) a E (Crítica)
   - **Descripción:** Detalles del incidente
   - **Acción Mitigadora:** Medidas a tomar

4. **El sistema calcula automáticamente:**
   - **Índice de Riesgo Inherente** = Probabilidad × Severidad
   - **Clasificación** = Bajo / Medio / Alto / Crítico

5. **Haz clic en:** "Guardar Evaluación"

6. **Resultado:**
   - ✅ Se guarda en localStorage (almacenamiento local del navegador)
   - ✅ Aparece en la tabla "Mis Evaluaciones"
   - ✅ Se sincroniza automáticamente con el servidor cada 30 segundos

#### **Método 2: Página de Captura Dedicada**

1. **Accede a:** `/captura.html`
2. **Completa el mismo formulario** (interfaz más limpia y enfocada)
3. **Haz clic en:** "Registrar Evaluación"
4. **Los datos se guardan localmente** y se sincronizan automáticamente

---

## 📊 Módulo de Dashboard

### ¿Qué Puedo Ver en el Dashboard?

#### **Indicadores KPI (Arriba)**
- **Total de Evaluaciones:** 174 + las que ingreses
- **Riesgos Bajo:** Cantidad de evaluaciones clasificadas como Bajo
- **Riesgos Alto:** Cantidad de evaluaciones clasificadas como Alto
- **Riesgos Crítico:** Cantidad de evaluaciones clasificadas como Crítico

#### **Gráficos Disponibles**

1. **Distribución de Riesgos (Gráfico Circular)**
   - Muestra el porcentaje de evaluaciones por clasificación
   - Colores: Verde (Bajo), Amarillo (Medio), Naranja (Alto), Rojo (Crítico)

2. **Tendencias Mensuales (Gráfico de Línea)**
   - Evolución de riesgos mes a mes
   - Permite identificar patrones y tendencias

3. **Evaluaciones por Tipo de Ocurrencia (Gráfico de Barras)**
   - Incidentes vs Observaciones vs Hallazgos
   - Ayuda a identificar dónde se concentran los problemas

#### **Tabs del Dashboard**

- **Dashboard:** Vista general con gráficos
- **Nueva Evaluación:** Formulario para ingresar datos
- **Mis Evaluaciones:** Tabla con todas tus evaluaciones capturadas
- **Reportes:** Gestión de reportes PDF mensuales

---

## 💾 ¿Dónde Se Guardan los Datos?

### **Almacenamiento Local (localStorage)**
- **Ubicación:** Navegador del usuario
- **Persistencia:** Los datos se guardan incluso si cierras el navegador
- **Sincronización:** Automática cada 30 segundos con el servidor
- **Ventaja:** Funciona sin conexión a internet

### **Servidor (TiDB)**
- **Ubicación:** Base de datos en la nube
- **Persistencia:** Permanente y centralizada
- **Acceso:** Desde cualquier dispositivo
- **Estado:** En proceso de sincronización (script sync.js)

---

## 🔄 Flujo de Datos

```
Usuario completa formulario
        ↓
Se guarda en localStorage (inmediato)
        ↓
Aparece en "Mis Evaluaciones"
        ↓
sync.js intenta enviar al servidor cada 30 segundos
        ↓
Si tiene éxito → Se marca como "Sincronizado"
Si falla → Se reintenta automáticamente
```

---

## 📥 Importar Datos del Excel 2025

### **Ya Importados:**
✅ 174 evaluaciones del Excel 2025 están cargadas en el dashboard

### **Importar Nuevos Datos:**
1. Prepara tu archivo Excel con la estructura de MATRIZ
2. Contacta al administrador para ejecutar:
   ```bash
   python3 scripts/import-excel-correct.py
   ```
3. Los datos se cargarán en la base de datos

---

## 📤 Exportar Datos

### **Exportar a Excel:**
1. En el dashboard, haz clic en **"Exportar a Excel"**
2. Se descargará un archivo con todas tus evaluaciones
3. Puedes abrirlo en Excel, Google Sheets, etc.

### **Generar Reportes PDF:**
1. En el tab **"Reportes"**, haz clic en **"Generar Reporte Mensual"**
2. El sistema crea un PDF con:
   - Resumen de evaluaciones
   - Gráficos de distribución
   - Estadísticas por clasificación
3. Haz clic en **"Descargar"** para obtener el archivo

---

## ⚙️ Configuración de Roles

### **SUPER_ADMIN**
- Acceso a todos los módulos
- Puede crear, editar y eliminar evaluaciones
- Acceso a bitácora de auditoría
- Gestión de usuarios

### **ADMINISTRADOR**
- Acceso a evaluaciones y reportes
- Puede crear y editar evaluaciones
- No puede eliminar evaluaciones
- Acceso limitado a auditoría

### **AUDITOR**
- Acceso de solo lectura
- Puede ver evaluaciones y reportes
- No puede crear ni editar
- Acceso a bitácora de auditoría

---

## 🆘 Solución de Problemas

### **P: ¿Por qué no se sincroniza mi evaluación?**
**R:** El servidor podría estar temporalmente no disponible. El script sync.js reintentará cada 30 segundos. Verifica que tengas conexión a internet.

### **P: ¿Dónde veo si una evaluación está sincronizada?**
**R:** En la tabla "Mis Evaluaciones", habrá una columna que indica el estado de sincronización.

### **P: ¿Puedo editar una evaluación después de guardarla?**
**R:** Actualmente, puedes ver todas tus evaluaciones. La edición está en desarrollo.

### **P: ¿Los datos se pierden si cierro el navegador?**
**R:** No. Los datos se guardan en localStorage y persisten incluso si cierras el navegador.

---

## 📞 Contacto y Soporte

Para problemas o preguntas sobre los módulos, contacta al equipo de SIGER PRO.
