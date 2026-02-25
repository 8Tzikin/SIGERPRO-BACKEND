# 📱 Guía de Instalación de PWA SIGER PRO en Android

## ¿Qué es una PWA?

Una **Progressive Web App (PWA)** es una aplicación web que funciona como una app nativa en tu teléfono Android. Tiene las siguientes características:

✅ **Instalación sin Google Play** - Instálala directamente desde el navegador
✅ **Funciona offline** - Accede a datos guardados sin conexión
✅ **Sincronización automática** - Los datos se sincronizan cuando hay conexión
✅ **Acceso rápido** - Ícono en la pantalla de inicio como cualquier app
✅ **Notificaciones push** - Recibe alertas de nuevas evaluaciones
✅ **Actualizaciones automáticas** - Siempre tienes la versión más reciente

---

## Requisitos

- **Android 5.0+** (cualquier teléfono moderno)
- **Navegador Chrome, Firefox o Edge** (recomendado: Chrome)
- **Conexión a Internet** (para la instalación inicial)

---

## Paso 1: Abrir SIGER PRO en el Navegador

1. Abre **Chrome** (o tu navegador preferido) en tu teléfono Android
2. Ve a la URL donde está SIGER PRO:
   ```
   http://localhost:3000
   ```
   O si está en un servidor:
   ```
   https://tu-servidor.com/sigerpro
   ```

3. Espera a que la página cargue completamente

---

## Paso 2: Instalar la PWA

### **Opción A: Desde el Menú (Recomendado)**

1. **Abre el menú del navegador** (3 puntos verticales en la esquina superior derecha)
2. Busca la opción **"Instalar aplicación"** o **"Agregar a pantalla de inicio"**
3. Haz clic en esa opción
4. Confirma que deseas instalar SIGER PRO
5. ¡Listo! La app se instalará en tu pantalla de inicio

### **Opción B: Desde el Ícono de Instalación**

Si ves un **ícono de descarga** o **"+"** en la barra de direcciones:
1. Haz clic en ese ícono
2. Confirma la instalación
3. La app se agregará a tu pantalla de inicio

### **Opción C: Menú de Contexto**

1. Mantén presionada la página
2. Selecciona **"Agregar a pantalla de inicio"**
3. Confirma

---

## Paso 3: Usar la PWA

Una vez instalada, verás un ícono de **SIGER PRO** en tu pantalla de inicio.

### **Primer Acceso**

1. Toca el ícono de SIGER PRO
2. La app se abrirá en modo **fullscreen** (sin barra de navegación del navegador)
3. Haz clic en **"Acceso Demo"** para acceder sin autenticación

### **Funcionalidades Disponibles**

✅ **Dashboard** - Ver 174 evaluaciones importadas
✅ **Nueva Evaluación** - Crear nuevas evaluaciones
✅ **Reportes** - Generar reportes PDF
✅ **Exportar** - Descargar datos en Excel
✅ **Sincronización** - Los datos se sincronizan automáticamente

---

## Paso 4: Funcionalidad Offline

### **Acceso Offline**

Una vez instalada, puedes usar SIGER PRO **sin conexión a Internet**:

1. **Datos en caché** - Las evaluaciones que viste se guardan automáticamente
2. **Crear evaluaciones** - Puedes crear nuevas evaluaciones offline
3. **Sincronización automática** - Cuando recuperes conexión, los datos se sincronizan automáticamente

### **Indicador de Conexión**

La app muestra automáticamente si estás online u offline en la interfaz.

---

## Paso 5: Notificaciones Push (Opcional)

Si tu servidor está configurado para enviar notificaciones:

1. Cuando la app te pida permiso para notificaciones, haz clic en **"Permitir"**
2. Recibirás notificaciones de:
   - Nuevas evaluaciones críticas
   - Reportes generados
   - Cambios en evaluaciones

---

## Paso 6: Actualizar la PWA

### **Actualizaciones Automáticas**

La PWA se actualiza automáticamente cuando:
- Cierras y abres la app
- Actualizas el navegador
- Pasan 24 horas

### **Actualizar Manualmente**

1. Abre la app
2. Presiona el botón de **actualizar** (↻) en la barra de herramientas
3. La app descargará la última versión

---

## Paso 7: Desinstalar la PWA

Si necesitas desinstalar la PWA:

### **En Android**

1. Mantén presionado el ícono de SIGER PRO en la pantalla de inicio
2. Selecciona **"Desinstalar"** o **"Eliminar"**
3. Confirma

O:

1. Ve a **Configuración** → **Aplicaciones**
2. Busca **"SIGER PRO"**
3. Haz clic en **"Desinstalar"**

---

## 🎯 Casos de Uso

### **Uso en Campo**

Perfecto para pilotos, mecánicos y personal de operaciones:

```
1. Abre SIGER PRO en tu teléfono
2. Crea una nueva evaluación del incidente
3. Completa los campos (sin necesidad de conexión)
4. Cuando regreses a la oficina, se sincroniza automáticamente
```

### **Uso en Oficina**

Acceso rápido desde el escritorio:

```
1. Toca el ícono de SIGER PRO
2. Ve el dashboard de evaluaciones
3. Genera reportes
4. Exporta datos
```

---

## 🆘 Solución de Problemas

### **No veo la opción de instalar**

- Asegúrate de estar en Chrome, Firefox o Edge
- Espera a que la página cargue completamente
- Actualiza el navegador (F5)
- Intenta desde el menú (3 puntos) → "Instalar aplicación"

### **La app no funciona offline**

- Asegúrate de haber visitado la página antes de perder conexión
- Los datos se guardan automáticamente en caché
- Abre la app nuevamente para que sincronice

### **No puedo crear evaluaciones**

- Verifica que estés en la página correcta (`/captura.html`)
- Completa todos los campos obligatorios
- Los datos se guardan en localStorage (no requiere conexión)

### **La app está lenta**

- Limpia el caché: Configuración → Aplicaciones → Chrome → Almacenamiento → Borrar datos
- Desinstala y reinstala la PWA
- Verifica tu conexión a Internet

### **No recibo notificaciones**

- Ve a Configuración → Aplicaciones → SIGER PRO → Permisos → Notificaciones
- Asegúrate de que las notificaciones estén habilitadas
- Verifica que el servidor esté configurado para enviar notificaciones

---

## 📊 Características Avanzadas

### **Acceso Rápido (Shortcuts)**

Desde el menú de inicio, puedes acceder directamente a:
- **Nueva Evaluación** - Crear evaluación rápidamente
- **Dashboard** - Ver evaluaciones

Mantén presionado el ícono de SIGER PRO para ver los atajos.

### **Compartir Datos**

Puedes compartir evaluaciones:
1. Abre una evaluación
2. Haz clic en el botón de compartir
3. Selecciona la app para compartir (WhatsApp, Email, etc.)

### **Sincronización en Background**

La app sincroniza datos automáticamente cada 30 minutos cuando está en background.

---

## ✅ Verificar Instalación Exitosa

Cuando veas esto, la instalación fue exitosa:

✅ Ícono de SIGER PRO en la pantalla de inicio
✅ La app abre sin barra de navegación del navegador
✅ Funciona offline (sin conexión)
✅ Los datos se sincronizan automáticamente

---

## 🎓 Próximos Pasos

1. **Explora el Dashboard** - Familiarízate con la interfaz
2. **Crea una evaluación de prueba** - Prueba el formulario
3. **Prueba offline** - Desactiva WiFi y crea una evaluación
4. **Comparte con tu equipo** - Instala en otros teléfonos

---

## 📞 Soporte

Si tienes problemas:

1. Verifica que tengas Android 5.0+
2. Usa Chrome, Firefox o Edge
3. Limpia el caché del navegador
4. Intenta desinstalar y reinstalar
5. Consulta la sección "Solución de Problemas" arriba

¡Disfruta usando SIGER PRO en tu teléfono! 📱
