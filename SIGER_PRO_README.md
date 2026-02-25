# SIGER PRO - Sistema de Gestión de Riesgos Operacionales Aeronáuticos

## 📋 Descripción

SIGER PRO es una aplicación web integral para la gestión, evaluación y análisis de riesgos de seguridad operacional aeronáutica según los estándares de la Organización de Aviación Civil Internacional (OACI).

## ✨ Características Principales

### 1. **Gestión de Evaluaciones de Riesgos**
- Captura de reportes de incidentes y peligros operacionales
- Campos: fecha, forma de reporte, tipo de ocurrencia, regulación, probabilidad, severidad
- Cálculo automático de índice de riesgo inherente (probabilidad × severidad)
- Clasificación automática: Bajo, Medio, Alto, Crítico
- Validación de campos obligatorios

### 2. **Dashboard e Indicadores**
- Indicadores KPI en tiempo real
- Gráficos de distribución de riesgos por clasificación
- Gráficos de estado (Abiertos vs Cerrados)
- Tendencias temporales de evaluaciones
- Listado de evaluaciones recientes

### 3. **Control de Acceso**
- Sistema de autenticación OAuth integrado
- Tres niveles de rol:
  - **SUPER_ADMIN**: Acceso total al sistema
  - **ADMINISTRADOR**: Gestión de evaluaciones y usuarios
  - **AUDITOR**: Lectura y auditoría

### 4. **Módulos Complementarios** (En desarrollo)
- Gestión de normativa (RAC, AIES-SOARG, NSOAM)
- Gestión de proveedores
- Reportes de Seguridad Confidenciales (RSC)
- Sistema de seguimiento y bitácora
- Exportación a Excel

## 🚀 Inicio Rápido

### Requisitos Previos
- Node.js 22.x
- pnpm 10.x
- Base de datos MySQL/TiDB

### Instalación

1. **Clonar el repositorio**
```bash
cd /home/ubuntu/sigerpro
```

2. **Instalar dependencias**
```bash
pnpm install
```

3. **Configurar variables de entorno**
Las siguientes variables se inyectan automáticamente:
- `DATABASE_URL`: Conexión a la base de datos
- `JWT_SECRET`: Secreto para sesiones
- `VITE_APP_ID`: ID de aplicación OAuth
- `OAUTH_SERVER_URL`: URL del servidor OAuth

4. **Ejecutar migraciones de base de datos**
```bash
pnpm db:push
```

5. **Iniciar servidor de desarrollo**
```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📊 Estructura de Datos

### Tablas Principales

#### `evaluaciones`
- `id`: Identificador único
- `numeroReporte`: Número de reporte único
- `fecha`: Fecha de la evaluación
- `formaReporte`: Forma en que se reportó (Email, Teléfono, etc.)
- `reportadoPor`: Nombre del reportante
- `entidadOrigen`: Organización de origen
- `descripcion`: Descripción detallada
- `tipoOcurrencia`: Tipo de incidente/peligro
- `regulacion`: Regulación aplicable
- `normativaId`: Referencia a normativa
- `proveedorId`: Referencia a proveedor
- `probabilidad`: Escala 1-4 (OACI)
- `severidadId`: Referencia a severidad (A-E)
- `impacto`: Escala de impacto
- `riesgoInherente`: Cálculo automático (probabilidad × impacto)
- `clasificacionId`: Clasificación automática (Bajo/Medio/Alto/Crítico)
- `estado`: Estado de la evaluación (ABIERTO/CERRADO/EN_REVISION)

#### `severidad`
- `id`: Identificador
- `letra`: Letra OACI (A-E)
- `nombre`: Descripción (Muy Baja, Baja, Moderada, Alta, Crítica)
- `valor`: Valor numérico

#### `clasificaciones`
- `id`: Identificador
- `nombre`: Nombre de clasificación
- `rango_min`: Rango mínimo de riesgo
- `rango_max`: Rango máximo de riesgo
- `color`: Color para visualización

#### `normativa`
- `id`: Identificador
- `codigo`: Código de normativa (RAC, NSOAM, etc.)
- `nombre`: Nombre completo
- `tipo`: Tipo de normativa

#### `proveedores`
- `id`: Identificador
- `nombre`: Nombre del proveedor
- `contacto`: Información de contacto

#### `usuarios`
- `id`: Identificador
- `openId`: ID de OAuth
- `nombre`: Nombre del usuario
- `email`: Email
- `role`: Rol (user/admin)

## 🔄 Flujo de Trabajo

### Crear Nueva Evaluación
1. Ir a "Evaluaciones" → "Nueva Evaluación"
2. Completar formulario con información del incidente
3. Seleccionar probabilidad y severidad
4. Sistema calcula automáticamente:
   - Índice de riesgo inherente
   - Clasificación (Bajo/Medio/Alto/Crítico)
5. Guardar evaluación

### Ver Dashboard
1. Ir a "Dashboard"
2. Ver indicadores KPI:
   - Total de evaluaciones
   - Evaluaciones abiertas
   - Riesgos críticos
   - Riesgos altos
3. Analizar gráficos:
   - Distribución de riesgos
   - Estado de evaluaciones
   - Tendencias temporales

### Filtrar Evaluaciones
1. Ir a "Evaluaciones"
2. Usar filtros:
   - Búsqueda por descripción
   - Filtrar por estado
   - Filtrar por clasificación
3. Ver resultados en tabla

## 📐 Estándares OACI Implementados

### Escala de Probabilidad
| Valor | Descripción | Significado |
|-------|-------------|------------|
| 1 | Remoto/Improbable | Muy poco probable que ocurra |
| 2 | Ocasional | Puede ocurrir ocasionalmente |
| 3 | Probable | Es probable que ocurra |
| 4 | Frecuente | Ocurre frecuentemente |

### Escala de Severidad
| Letra | Valor | Descripción | Impacto |
|-------|-------|------------|---------|
| A | 1 | Muy Baja | Insignificante |
| B | 2 | Baja | Menor |
| C | 3 | Moderada | Moderado |
| D | 4 | Alta | Mayor |
| E | 5 | Crítica | Crítico |

### Matriz de Riesgo
| Riesgo Inherente | Clasificación | Acción |
|------------------|----------------|--------|
| 1-5 | BAJO | Monitoreo |
| 6-10 | MEDIO | Seguimiento |
| 11-15 | ALTO | Acción inmediata |
| 16+ | CRÍTICO | Acción urgente |

## 🔐 Seguridad

- **Autenticación OAuth**: Integración con Manus OAuth
- **Control de Acceso**: Basado en roles (SUPER_ADMIN, ADMINISTRADOR, AUDITOR)
- **Encriptación**: Conexiones SSL/TLS
- **Auditoría**: Bitácora de cambios (usuario, acción, fecha)
- **Validación**: Validación de entrada en cliente y servidor

## 📁 Estructura del Proyecto

```
sigerpro/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── pages/         # Páginas principales
│   │   ├── components/    # Componentes reutilizables
│   │   ├── lib/           # Utilidades (tRPC, etc.)
│   │   └── App.tsx        # Rutas principales
│   └── public/            # Activos estáticos
├── server/                 # Backend Express + tRPC
│   ├── routers.ts         # Procedimientos tRPC
│   ├── db.ts              # Helpers de base de datos
│   └── _core/             # Configuración core
├── drizzle/               # Esquema y migraciones
│   └── schema.ts          # Definición de tablas
├── scripts/               # Scripts de utilidad
│   └── migrate-excel-data.mjs  # Migración de Excel
└── package.json           # Dependencias
```

## 🛠️ Desarrollo

### Agregar Nueva Funcionalidad

1. **Actualizar esquema** (`drizzle/schema.ts`)
```typescript
export const miTabla = mysqlTable("mi_tabla", {
  id: int("id").autoincrement().primaryKey(),
  nombre: varchar("nombre", { length: 255 }).notNull(),
});
```

2. **Crear helpers de BD** (`server/db.ts`)
```typescript
export async function getMiTabla() {
  const db = await getDb();
  return db.select().from(miTabla);
}
```

3. **Crear procedimientos tRPC** (`server/routers.ts`)
```typescript
miTabla: router({
  list: protectedProcedure.query(({ ctx }) =>
    db.getMiTabla()
  ),
}),
```

4. **Crear interfaz** (`client/src/pages/MiPagina.tsx`)
```typescript
const { data } = trpc.miTabla.list.useQuery();
```

5. **Ejecutar migración**
```bash
pnpm db:push
```

### Ejecutar Tests
```bash
pnpm test
```

### Build para Producción
```bash
pnpm build
```

## 📝 Notas Importantes

### Migración de Datos Excel
Se incluye un script para migrar datos del Excel 2025:
```bash
node scripts/migrate-excel-data.mjs
```

Este script:
- Lee datos de `EVALUACIONESRIESGOAGAREPORTES2025.xlsx`
- Procesa hojas: MATRIZ, NORMATIVA, PROVEEDORES
- Crea evaluaciones con cálculos automáticos
- Inserta datos de referencia

### Campos Calculados Automáticamente
- **riesgoInherente**: `probabilidad × impacto`
- **clasificacionId**: Basado en rango de riesgoInherente
- **fechaCreacion**: Timestamp actual
- **creadoPor**: ID del usuario autenticado

## 🐛 Troubleshooting

### Error: "Table doesn't exist"
- Ejecutar: `pnpm db:push`
- Verificar DATABASE_URL

### Error: "Unauthorized"
- Verificar autenticación OAuth
- Limpiar cookies del navegador

### Error: "Connection refused"
- Verificar que el servidor esté corriendo
- Verificar puerto 3000

## 📞 Soporte

Para reportar problemas o sugerencias, contactar al equipo de desarrollo.

## 📄 Licencia

Todos los derechos reservados © 2025 SIGER PRO

---

**Versión**: 1.0.0  
**Última actualización**: Febrero 2025  
**Estado**: En desarrollo - Funcionalidades principales completadas
