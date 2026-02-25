# SIGER PRO - Configuración de Roles y Permisos

## 🔐 Estructura de Roles

SIGER PRO implementa un sistema de **3 roles principales** basado en estándares de seguridad operacional aeronáutica:

| Rol | Descripción | Nivel de Acceso |
|-----|-------------|-----------------|
| **SUPER_ADMIN** | Administrador del sistema con acceso total | Máximo |
| **ADMINISTRADOR** | Gestor de evaluaciones y reportes | Medio-Alto |
| **AUDITOR** | Revisor de solo lectura | Bajo |

---

## 👤 SUPER_ADMIN (Administrador del Sistema)

### **Descripción**
El rol más privilegiado del sistema. Tiene control total sobre todas las funcionalidades y datos.

### **Permisos - Evaluaciones de Riesgos**
- ✅ **Crear** nuevas evaluaciones
- ✅ **Leer** todas las evaluaciones (propias y de otros usuarios)
- ✅ **Editar** cualquier evaluación (incluyendo las de otros)
- ✅ **Eliminar** evaluaciones
- ✅ **Cambiar estado** de evaluaciones (Abierto → Cerrado, etc.)
- ✅ **Reasignar** evaluaciones a otros usuarios
- ✅ **Forzar sincronización** de datos

### **Permisos - Reportes**
- ✅ **Crear** reportes manuales
- ✅ **Generar** reportes automáticos mensuales
- ✅ **Editar** plantillas de reportes
- ✅ **Descargar** reportes en PDF y Excel
- ✅ **Programar** generación automática de reportes
- ✅ **Acceder** a reportes históricos

### **Permisos - Seguimiento y Auditoría**
- ✅ **Ver** bitácora completa de auditoría
- ✅ **Ver** historial de cambios de todas las evaluaciones
- ✅ **Ver** comentarios y acciones de otros usuarios
- ✅ **Agregar** comentarios administrativos
- ✅ **Exportar** bitácora de auditoría

### **Permisos - Gestión de Sistema**
- ✅ **Crear** nuevos usuarios
- ✅ **Editar** roles de usuarios
- ✅ **Desactivar/Activar** usuarios
- ✅ **Resetear** contraseñas
- ✅ **Importar** datos desde Excel
- ✅ **Exportar** base de datos completa
- ✅ **Configurar** parámetros del sistema
- ✅ **Ver** logs del sistema

### **Permisos - Normativa y Configuración**
- ✅ **Crear** nuevas normativas (RAC, AIES-SOARG, NSOAM)
- ✅ **Editar** normativas existentes
- ✅ **Crear** nuevos proveedores
- ✅ **Editar** información de proveedores
- ✅ **Gestionar** clasificaciones de riesgo

### **Ejemplo de Uso**
```typescript
// SUPER_ADMIN puede ejecutar cualquier operación
const evaluation = await trpc.evaluaciones.create.mutate({
  // Crear evaluación
});

await trpc.evaluaciones.delete.mutate({ id: 1 }); // Eliminar
await trpc.users.updateRole.mutate({ userId: 5, role: 'ADMINISTRADOR' }); // Cambiar rol
```

---

## 👨‍💼 ADMINISTRADOR (Gestor de Evaluaciones)

### **Descripción**
Rol intermedio. Gestiona evaluaciones y reportes pero no puede eliminar ni cambiar permisos de otros usuarios.

### **Permisos - Evaluaciones de Riesgos**
- ✅ **Crear** nuevas evaluaciones
- ✅ **Leer** todas las evaluaciones
- ✅ **Editar** evaluaciones propias
- ❌ **Editar** evaluaciones de otros (solo ver)
- ❌ **Eliminar** evaluaciones
- ✅ **Cambiar estado** de evaluaciones propias
- ❌ **Reasignar** evaluaciones

### **Permisos - Reportes**
- ✅ **Crear** reportes manuales
- ✅ **Generar** reportes automáticos mensuales
- ❌ **Editar** plantillas de reportes
- ✅ **Descargar** reportes en PDF y Excel
- ❌ **Programar** generación automática
- ✅ **Acceder** a reportes del período actual

### **Permisos - Seguimiento y Auditoría**
- ✅ **Ver** historial de cambios de evaluaciones propias
- ✅ **Ver** comentarios y acciones propias
- ✅ **Agregar** comentarios a evaluaciones
- ❌ **Ver** bitácora completa (solo auditoría propia)
- ❌ **Exportar** bitácora

### **Permisos - Gestión de Sistema**
- ❌ **Crear** nuevos usuarios
- ❌ **Editar** roles de usuarios
- ❌ **Importar** datos desde Excel
- ✅ **Exportar** evaluaciones propias
- ❌ **Configurar** parámetros del sistema

### **Permisos - Normativa y Configuración**
- ✅ **Ver** normativas (RAC, AIES-SOARG, NSOAM)
- ❌ **Crear/Editar** normativas
- ✅ **Ver** información de proveedores
- ❌ **Crear/Editar** proveedores

### **Ejemplo de Uso**
```typescript
// ADMINISTRADOR puede crear y editar sus propias evaluaciones
const evaluation = await trpc.evaluaciones.create.mutate({
  fecha: "2026-02-18",
  tipoOcurrencia: "Incidente",
  // ...
});

// Puede editar su propia evaluación
await trpc.evaluaciones.update.mutate({ 
  id: evaluation.id,
  estado: "CERRADO"
});

// NO puede eliminar
await trpc.evaluaciones.delete.mutate({ id: 1 }); // ❌ DENEGADO
```

---

## 👁️ AUDITOR (Revisor de Solo Lectura)

### **Descripción**
Rol de solo lectura. Puede revisar evaluaciones y reportes pero no puede crear ni modificar datos.

### **Permisos - Evaluaciones de Riesgos**
- ✅ **Leer** todas las evaluaciones
- ❌ **Crear** nuevas evaluaciones
- ❌ **Editar** evaluaciones
- ❌ **Eliminar** evaluaciones

### **Permisos - Reportes**
- ✅ **Ver** todos los reportes
- ✅ **Descargar** reportes en PDF y Excel
- ❌ **Crear** reportes manuales
- ❌ **Generar** reportes automáticos
- ❌ **Editar** reportes

### **Permisos - Seguimiento y Auditoría**
- ✅ **Ver** bitácora completa de auditoría
- ✅ **Ver** historial de cambios de todas las evaluaciones
- ✅ **Ver** comentarios y acciones de todos
- ❌ **Agregar** comentarios
- ✅ **Exportar** bitácora para análisis

### **Permisos - Gestión de Sistema**
- ❌ **Crear** usuarios
- ❌ **Editar** roles
- ❌ **Importar** datos
- ✅ **Exportar** datos para auditoría
- ❌ **Configurar** parámetros

### **Permisos - Normativa y Configuración**
- ✅ **Ver** normativas (RAC, AIES-SOARG, NSOAM)
- ❌ **Crear/Editar** normativas
- ✅ **Ver** información de proveedores
- ❌ **Crear/Editar** proveedores

### **Ejemplo de Uso**
```typescript
// AUDITOR solo puede leer
const evaluations = await trpc.evaluaciones.list.query();

// NO puede crear
await trpc.evaluaciones.create.mutate({ ... }); // ❌ DENEGADO

// NO puede editar
await trpc.evaluaciones.update.mutate({ ... }); // ❌ DENEGADO
```

---

## 🔑 Matriz de Permisos Detallada

### **Evaluaciones de Riesgos**

| Acción | SUPER_ADMIN | ADMINISTRADOR | AUDITOR |
|--------|:-----------:|:-------------:|:-------:|
| Crear evaluación | ✅ | ✅ | ❌ |
| Leer propia | ✅ | ✅ | ✅ |
| Leer de otros | ✅ | ✅ | ✅ |
| Editar propia | ✅ | ✅ | ❌ |
| Editar de otros | ✅ | ❌ | ❌ |
| Eliminar | ✅ | ❌ | ❌ |
| Cambiar estado | ✅ | ✅* | ❌ |
| Reasignar | ✅ | ❌ | ❌ |

*Solo evaluaciones propias

### **Reportes**

| Acción | SUPER_ADMIN | ADMINISTRADOR | AUDITOR |
|--------|:-----------:|:-------------:|:-------:|
| Crear reporte manual | ✅ | ✅ | ❌ |
| Generar automático | ✅ | ✅ | ❌ |
| Ver reportes | ✅ | ✅ | ✅ |
| Descargar PDF/Excel | ✅ | ✅ | ✅ |
| Editar plantillas | ✅ | ❌ | ❌ |
| Programar generación | ✅ | ❌ | ❌ |

### **Auditoría**

| Acción | SUPER_ADMIN | ADMINISTRADOR | AUDITOR |
|--------|:-----------:|:-------------:|:-------:|
| Ver bitácora completa | ✅ | ❌* | ✅ |
| Ver cambios propios | ✅ | ✅ | ✅ |
| Ver cambios de otros | ✅ | ❌* | ✅ |
| Agregar comentarios | ✅ | ✅ | ❌ |
| Exportar bitácora | ✅ | ❌ | ✅ |

*Solo auditoría propia

### **Gestión de Sistema**

| Acción | SUPER_ADMIN | ADMINISTRADOR | AUDITOR |
|--------|:-----------:|:-------------:|:-------:|
| Crear usuarios | ✅ | ❌ | ❌ |
| Editar roles | ✅ | ❌ | ❌ |
| Importar Excel | ✅ | ❌ | ❌ |
| Exportar datos | ✅ | ✅* | ✅* |
| Configurar sistema | ✅ | ❌ | ❌ |

*Solo datos propios o permitidos

---

## 🔐 Implementación Técnica de Roles

### **En la Base de Datos**

```sql
-- Tabla de usuarios con rol
CREATE TABLE usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  openId VARCHAR(64) UNIQUE NOT NULL,
  nombre TEXT,
  correo VARCHAR(320),
  role ENUM('SUPER_ADMIN', 'ADMINISTRADOR', 'AUDITOR') DEFAULT 'AUDITOR',
  activo BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de bitácora de auditoría
CREATE TABLE bitacora (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  accion VARCHAR(100),
  tabla_afectada VARCHAR(50),
  registro_id INT,
  cambios JSON,
  fecha_accion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
```

### **En el Backend (tRPC)**

```typescript
// Procedimiento protegido que verifica rol
export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'SUPER_ADMIN') {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }
  return next({ ctx });
});

// Procedimiento que permite SUPER_ADMIN y ADMINISTRADOR
export const managerProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (!['SUPER_ADMIN', 'ADMINISTRADOR'].includes(ctx.user.role)) {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }
  return next({ ctx });
});

// Uso en procedimientos
evaluaciones: router({
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      // Solo SUPER_ADMIN puede eliminar
      return db.delete(evaluaciones).where(eq(evaluaciones.id, input.id));
    }),

  create: managerProcedure
    .input(z.object({ /* ... */ }))
    .mutation(async ({ input, ctx }) => {
      // SUPER_ADMIN y ADMINISTRADOR pueden crear
      return db.insert(evaluaciones).values({
        ...input,
        creadoPor: ctx.user.id,
      });
    }),
})
```

### **En el Frontend (React)**

```typescript
// Hook para verificar permisos
function useCanDelete() {
  const { user } = useAuth();
  return user?.role === 'SUPER_ADMIN';
}

// Componente que muestra/oculta botones según rol
export function EvaluacionActions({ evaluacionId }) {
  const { user } = useAuth();
  const canDelete = user?.role === 'SUPER_ADMIN';
  const canEdit = ['SUPER_ADMIN', 'ADMINISTRADOR'].includes(user?.role);

  return (
    <>
      {canEdit && <Button>Editar</Button>}
      {canDelete && <Button variant="destructive">Eliminar</Button>}
    </>
  );
}
```

---

## 👥 Gestión de Usuarios y Asignación de Roles

### **Crear un Nuevo Usuario**

Solo SUPER_ADMIN puede crear usuarios:

```typescript
// Backend
const newUser = await db.insert(usuarios).values({
  openId: 'user-123',
  nombre: 'Juan Pérez',
  correo: 'juan@example.com',
  role: 'ADMINISTRADOR', // Asignar rol
  activo: true,
});
```

### **Cambiar Rol de un Usuario**

Solo SUPER_ADMIN puede cambiar roles:

```typescript
// Backend
await db.update(usuarios)
  .set({ role: 'AUDITOR' })
  .where(eq(usuarios.id, userId));
```

### **Desactivar un Usuario**

Solo SUPER_ADMIN puede desactivar usuarios:

```typescript
// Backend
await db.update(usuarios)
  .set({ activo: false })
  .where(eq(usuarios.id, userId));
```

---

## 📋 Flujo de Autorización

```
Usuario intenta realizar acción
        ↓
¿Está autenticado? → NO → Redirigir a login
        ↓ SÍ
¿Tiene el rol requerido? → NO → Error 403 FORBIDDEN
        ↓ SÍ
¿Es propietario del recurso? → NO (si aplica) → Error 403 FORBIDDEN
        ↓ SÍ
Ejecutar acción
        ↓
Registrar en bitácora de auditoría
```

---

## 🔍 Auditoría y Trazabilidad

Todas las acciones se registran en la **bitácora de auditoría**:

```sql
-- Ejemplo de registro de auditoría
INSERT INTO bitacora (usuario_id, accion, tabla_afectada, registro_id, cambios)
VALUES (
  1,
  'UPDATE',
  'evaluaciones',
  42,
  '{"estado": {"old": "ABIERTO", "new": "CERRADO"}}'
);
```

### **Información Registrada**
- ✅ Quién hizo la acción (usuario_id)
- ✅ Qué acción realizó (CREATE, READ, UPDATE, DELETE)
- ✅ Qué tabla fue afectada
- ✅ Qué registro fue modificado
- ✅ Cuáles fueron los cambios específicos
- ✅ Cuándo ocurrió (timestamp)

---

## 🛡️ Mejores Prácticas de Seguridad

### **1. Principio de Menor Privilegio**
- Asigna el rol más bajo que permita al usuario hacer su trabajo
- Revisa periódicamente los roles asignados

### **2. Separación de Responsabilidades**
- ADMINISTRADOR: Crea evaluaciones
- AUDITOR: Revisa evaluaciones
- SUPER_ADMIN: Gestiona el sistema

### **3. Auditoría Continua**
- Revisa la bitácora regularmente
- Identifica acciones inusuales
- Investiga cambios no autorizados

### **4. Rotación de Credenciales**
- Cambia contraseñas regularmente
- Desactiva usuarios inactivos
- Revoca acceso cuando sea necesario

---

## 📞 Soporte y Preguntas

¿Tienes dudas sobre roles y permisos? Contacta al equipo de SIGER PRO.
