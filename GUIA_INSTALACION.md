# Guía de Instalación - SIGER PRO

## 🎯 Objetivo
Esta guía te ayudará a instalar y configurar SIGER PRO en tu entorno local o servidor.

## ✅ Requisitos Previos

### Software Requerido
- **Node.js**: v22.x o superior
- **pnpm**: v10.x (gestor de paquetes)
- **MySQL/TiDB**: Base de datos compatible con MySQL
- **Git**: Para clonar el repositorio (opcional)

### Verificar Instalación
```bash
node --version     # Debe ser v22.x
pnpm --version     # Debe ser 10.x
mysql --version    # Debe estar instalado
```

## 📦 Instalación

### Paso 1: Obtener el Código

**Opción A: Desde Git**
```bash
git clone <url-del-repositorio> sigerpro
cd sigerpro
```

**Opción B: Desde carpeta existente**
```bash
cd /home/ubuntu/sigerpro
```

### Paso 2: Instalar Dependencias

```bash
pnpm install
```

Esto instalará:
- React 19 (frontend)
- Express 4 (backend)
- tRPC 11 (comunicación RPC)
- Drizzle ORM (acceso a BD)
- Y más de 100 dependencias adicionales

Tiempo estimado: 2-5 minutos

### Paso 3: Configurar Variables de Entorno

Las variables de entorno se inyectan automáticamente por Manus. Verificar en `.env`:

```bash
# Base de datos
DATABASE_URL=mysql://usuario:contraseña@host:puerto/base_datos

# Autenticación
JWT_SECRET=tu-secreto-jwt
VITE_APP_ID=tu-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im

# Propietario
OWNER_NAME=Tu Nombre
OWNER_OPEN_ID=tu-open-id

# APIs Manus
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=tu-api-key
VITE_FRONTEND_FORGE_API_KEY=tu-frontend-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
```

### Paso 4: Crear Base de Datos

```bash
# Conectarse a MySQL
mysql -u root -p

# Crear base de datos
CREATE DATABASE sigerpro;
CREATE USER 'sigerpro'@'localhost' IDENTIFIED BY 'contraseña_segura';
GRANT ALL PRIVILEGES ON sigerpro.* TO 'sigerpro'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Paso 5: Ejecutar Migraciones

```bash
pnpm db:push
```

Este comando:
1. Genera migraciones desde `drizzle/schema.ts`
2. Crea todas las tablas en la base de datos
3. Configura relaciones y restricciones

**Salida esperada:**
```
✓ 0 migrations generated
✓ Migrations pushed to database
```

### Paso 6: Iniciar Servidor de Desarrollo

```bash
pnpm dev
```

**Salida esperada:**
```
> NODE_ENV=development tsx watch server/_core/index.ts
[OAuth] Initialized with baseURL: https://api.manus.im
Server running on http://localhost:3000/
```

### Paso 7: Acceder a la Aplicación

1. Abre tu navegador
2. Ve a `http://localhost:3000`
3. Haz clic en "Ingresar"
4. Completa el login con Manus OAuth

## 🗄️ Migración de Datos (Excel)

### Paso 1: Preparar Archivo Excel

Asegúrate de tener el archivo:
```
/home/ubuntu/upload/EVALUACIONESRIESGOAGAREPORTES2025.xlsx
```

Con las siguientes hojas:
- **MATRIZ**: Datos principales de evaluaciones
- **NORMATIVA**: Normativas aplicables
- **PROVEEDORES**: Proveedores
- **RSC**: Reportes de Seguridad Confidenciales

### Paso 2: Ejecutar Script de Migración

```bash
node scripts/migrate-excel-data.mjs
```

**Salida esperada:**
```
Connected to database successfully
Reading Excel file...

=== Migrating NORMATIVA ===
✓ Inserted normativa: RAC
✓ Inserted normativa: NSOAM
...

=== Migrating PROVEEDORES ===
✓ Inserted proveedor: UNITED AIRLINES
...

=== Migrating EVALUACIONES ===
✓ Migrated 50 evaluaciones...
✓ Successfully migrated 500 evaluaciones

=== Inserting Reference Data ===
✓ Inserted severity: A
...
✓ Data migration completed successfully!
```

### Paso 3: Verificar Datos

```bash
# Conectarse a la BD
mysql -u sigerpro -p sigerpro

# Verificar tablas
SHOW TABLES;

# Contar evaluaciones
SELECT COUNT(*) FROM evaluaciones;

# Ver primeras evaluaciones
SELECT * FROM evaluaciones LIMIT 5;
```

## 🧪 Ejecutar Tests

```bash
pnpm test
```

Esto ejecutará todos los tests unitarios en `server/*.test.ts`

**Salida esperada:**
```
✓ server/auth.logout.test.ts (1)
✓ server/evaluaciones.test.ts (7)

Test Files  2 passed (2)
     Tests  8 passed (8)
```

## 🏗️ Build para Producción

```bash
pnpm build
```

Esto genera:
- `dist/index.js`: Servidor compilado
- `client/dist/`: Frontend compilado

### Iniciar en Producción

```bash
pnpm start
```

## 📊 Estructura de Carpetas

```
sigerpro/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── pages/            # Páginas principales
│   │   │   ├── Home.tsx      # Página de inicio
│   │   │   ├── Dashboard.tsx # Dashboard con gráficos
│   │   │   ├── Evaluaciones.tsx # Listado de evaluaciones
│   │   │   └── NuevaEvaluacion.tsx # Formulario
│   │   ├── components/       # Componentes reutilizables
│   │   ├── lib/              # Librerías (tRPC, etc.)
│   │   └── App.tsx           # Rutas y layout
│   └── public/               # Activos estáticos
│
├── server/                    # Backend Express + tRPC
│   ├── routers.ts            # Procedimientos tRPC
│   ├── db.ts                 # Helpers de BD
│   ├── auth.logout.test.ts   # Tests de autenticación
│   ├── evaluaciones.test.ts  # Tests de evaluaciones
│   └── _core/                # Configuración core
│       ├── index.ts          # Servidor Express
│       ├── context.ts        # Contexto tRPC
│       ├── trpc.ts           # Configuración tRPC
│       └── ...
│
├── drizzle/                  # ORM Drizzle
│   ├── schema.ts             # Definición de tablas
│   └── migrations/           # Historial de migraciones
│
├── scripts/                  # Scripts de utilidad
│   └── migrate-excel-data.mjs # Migración desde Excel
│
├── package.json              # Dependencias
├── tsconfig.json             # Configuración TypeScript
├── vite.config.ts            # Configuración Vite
└── README.md                 # Documentación
```

## 🔧 Comandos Útiles

```bash
# Desarrollo
pnpm dev                      # Iniciar servidor de desarrollo

# Pruebas
pnpm test                     # Ejecutar tests
pnpm test --watch             # Tests en modo watch

# Base de datos
pnpm db:push                  # Aplicar migraciones
pnpm db:pull                  # Generar schema desde BD

# Build
pnpm build                    # Compilar para producción
pnpm start                    # Iniciar servidor producción

# Código
pnpm format                   # Formatear código
pnpm check                    # Verificar tipos TypeScript

# Limpieza
pnpm clean                    # Limpiar caché
```

## 🐛 Solución de Problemas

### Error: "Port 3000 already in use"
```bash
# Encontrar proceso en puerto 3000
lsof -i :3000

# Matar proceso
kill -9 <PID>

# O usar puerto diferente
PORT=3001 pnpm dev
```

### Error: "Table doesn't exist"
```bash
# Ejecutar migraciones nuevamente
pnpm db:push

# Verificar conexión a BD
mysql -u sigerpro -p sigerpro -e "SHOW TABLES;"
```

### Error: "DATABASE_URL not set"
```bash
# Verificar archivo .env
cat .env | grep DATABASE_URL

# Si no existe, crear .env con:
DATABASE_URL=mysql://usuario:contraseña@localhost:3306/sigerpro
```

### Error: "ECONNREFUSED - Cannot connect to database"
```bash
# Verificar que MySQL está corriendo
sudo service mysql status

# Iniciar MySQL si no está corriendo
sudo service mysql start

# Verificar credenciales
mysql -u sigerpro -p -h localhost
```

### Error: "UNAUTHORIZED" al acceder
```bash
# Limpiar cookies del navegador
# Ir a DevTools → Application → Cookies
# Eliminar todas las cookies

# Intentar login nuevamente
```

## 📈 Próximos Pasos

1. **Crear primera evaluación**
   - Ir a Dashboard
   - Clic en "Nueva Evaluación"
   - Completar formulario

2. **Importar datos históricos**
   - Ejecutar: `node scripts/migrate-excel-data.mjs`
   - Verificar en Dashboard

3. **Configurar usuarios**
   - Crear usuarios con diferentes roles
   - Asignar permisos según rol

4. **Personalizar**
   - Agregar normativas adicionales
   - Configurar proveedores
   - Personalizar campos

## 📞 Soporte

Si encuentras problemas:

1. Verifica los logs:
   ```bash
   tail -f .manus-logs/devserver.log
   ```

2. Consulta la documentación:
   - `SIGER_PRO_README.md` - Descripción general
   - `README.md` - Documentación técnica

3. Contacta al equipo de desarrollo

---

**Versión**: 1.0.0  
**Última actualización**: Febrero 2025
