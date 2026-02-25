# 🚀 Guía de Instalación Paso a Paso - SIGER PRO

## Requisitos Previos

Antes de instalar SIGER PRO, asegúrate de tener instalado:

### **Windows**
- **Node.js 18+** - Descarga desde https://nodejs.org/
- **Git** (opcional) - Descarga desde https://git-scm.com/
- **Visual Studio Code** (recomendado) - Descarga desde https://code.visualstudio.com/

### **macOS**
```bash
# Instalar Homebrew (si no lo tienes)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Instalar Node.js
brew install node
```

### **Linux (Ubuntu/Debian)**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## Paso 1: Descargar y Extraer el ZIP

1. **Descarga el archivo** `sigerpro-codigo-fuente.zip`
2. **Extrae el ZIP** en una carpeta de tu computadora
   - Windows: Click derecho → "Extraer todo..."
   - macOS/Linux: `unzip sigerpro-codigo-fuente.zip`
3. **Abre una terminal** en la carpeta extraída

## Paso 2: Instalar pnpm (Gestor de Paquetes)

pnpm es más rápido y eficiente que npm. Instálalo con:

```bash
npm install -g pnpm
```

Verifica la instalación:
```bash
pnpm --version
```

## Paso 3: Instalar Dependencias

En la carpeta del proyecto, ejecuta:

```bash
pnpm install
```

Esto descargará e instalará todas las dependencias necesarias (React, Express, Drizzle, etc.).
**Tiempo estimado:** 5-10 minutos

## Paso 4: Configurar Variables de Entorno

El proyecto necesita variables de entorno para funcionar. Crea un archivo `.env` en la raíz del proyecto:

```bash
# Crear archivo .env
echo "DATABASE_URL=mysql://user:password@localhost:3306/sigerpro" > .env
```

**Variables necesarias:**
- `DATABASE_URL` - Conexión a la base de datos TiDB o MySQL
- `JWT_SECRET` - Clave para firmar sesiones (puede ser cualquier string aleatorio)
- `VITE_APP_ID` - ID de la aplicación OAuth (si usas autenticación)

**Para desarrollo local sin base de datos:**
```env
DATABASE_URL=mysql://root@localhost:3306/sigerpro
JWT_SECRET=tu-clave-secreta-aqui
VITE_APP_ID=desarrollo
```

## Paso 5: Crear Base de Datos (Opcional)

Si quieres usar una base de datos local:

### **Con MySQL/MariaDB:**
```bash
# Crear base de datos
mysql -u root -p -e "CREATE DATABASE sigerpro;"

# Ejecutar migraciones
pnpm db:push
```

### **Sin base de datos (Demo):**
Puedes usar la versión demo que no requiere base de datos. Solo accede a `/demo.html`

## Paso 6: Ejecutar en Desarrollo

Inicia el servidor de desarrollo:

```bash
pnpm dev
```

Verás un mensaje como:
```
Server running on http://localhost:3000/
```

## Paso 7: Acceder a la Aplicación

Abre tu navegador en:

```
http://localhost:3000
```

Verás la página de inicio de SIGER PRO.

### **Opciones de Acceso:**

1. **Dashboard Demo** (sin autenticación)
   - Haz clic en "Acceso Demo"
   - Acceso inmediato a 174 evaluaciones

2. **Con Autenticación OAuth** (requiere configuración)
   - Haz clic en "Acceder a SIGER PRO"
   - Requiere credenciales OAuth configuradas

3. **Página de Captura** (formulario directo)
   - URL: `http://localhost:3000/captura.html`
   - Ingresa nuevas evaluaciones directamente

## Paso 8: Importar Datos del Excel (Opcional)

Si tienes datos del Excel 2025:

```bash
# Usar el script de importación
python3 scripts/import-excel-correct.py
```

Sigue las instrucciones en pantalla para seleccionar el archivo Excel.

## Paso 9: Compilar para Producción

Cuando estés listo para desplegar:

```bash
pnpm build
```

Esto crea una carpeta `dist/` con los archivos optimizados para producción.

Para ejecutar en producción:

```bash
pnpm start
```

---

## 🆘 Solución de Problemas

### **Error: "pnpm: command not found"**
```bash
npm install -g pnpm
```

### **Error: "Cannot find module..."**
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### **Error: "Port 3000 already in use"**
```bash
# Cambiar puerto
PORT=3001 pnpm dev
```

### **Error: "DATABASE_URL not found"**
Crea el archivo `.env` con las variables necesarias (ver Paso 4)

### **Error: "Cannot connect to database"**
- Verifica que la base de datos esté corriendo
- Comprueba las credenciales en `.env`
- Usa la versión demo sin base de datos

---

## 📊 Estructura de Carpetas Después de Instalar

```
sigerpro/
├── node_modules/          # Dependencias instaladas
├── client/                # Frontend React
│   ├── src/
│   │   ├── pages/        # Páginas (Home, Dashboard, etc.)
│   │   ├── components/   # Componentes reutilizables
│   │   └── App.tsx       # Punto de entrada
│   └── public/           # Archivos estáticos (demo.html, captura.html)
├── server/               # Backend Express + tRPC
│   ├── routers.ts        # Procedimientos tRPC
│   ├── db.ts             # Helpers de base de datos
│   └── _core/            # Autenticación, OAuth
├── drizzle/              # Esquema de base de datos
│   └── schema.ts         # Definición de tablas
├── scripts/              # Scripts de utilidad
├── .env                  # Variables de entorno (crea este archivo)
├── package.json          # Dependencias del proyecto
└── pnpm-lock.yaml        # Lock file de pnpm
```

---

## ✅ Verificar Instalación Exitosa

Cuando veas esto en la terminal:

```
✓ Server running on http://localhost:3000/
✓ Client ready at http://localhost:3000/
```

¡Tu instalación fue exitosa! 🎉

Abre el navegador en `http://localhost:3000` y comienza a usar SIGER PRO.

---

## 🎯 Próximos Pasos

1. **Explorar el Dashboard Demo** - Haz clic en "Acceso Demo"
2. **Crear nuevas evaluaciones** - Usa el formulario en el dashboard
3. **Importar datos Excel** - Ejecuta el script de importación
4. **Configurar autenticación** - Sigue la guía de OAuth si lo necesitas
5. **Personalizar** - Modifica el código según tus necesidades

---

## 📞 Soporte

Si encuentras problemas:

1. Revisa la sección "Solución de Problemas" arriba
2. Verifica que tengas Node.js 18+ instalado: `node --version`
3. Verifica que tengas pnpm instalado: `pnpm --version`
4. Revisa los logs en la terminal para mensajes de error
5. Consulta la documentación en `GUIA_INSTALACION.md`

¡Éxito con tu instalación! 🚀
