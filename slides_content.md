# Implementación Técnica de Roles y Permisos en SIGER PRO

## Diapositiva 1: Portada

**Título Principal:**
# Implementación Técnica de Roles y Permisos
## SIGER PRO - Sistema de Gestión de Riesgos Operacionales

**Subtítulo:**
Arquitectura de Control de Acceso y Seguridad

**Pie de página:**
SIGER PRO v5.0 | Febrero 2026

---

## Diapositiva 2: Agenda

**Contenido:**
1. Introducción a Control de Acceso
2. Estructura de Roles en SIGER PRO
3. Matriz de Permisos Detallada
4. Implementación en Base de Datos
5. Implementación en Backend (tRPC)
6. Implementación en Frontend (React)
7. Auditoría y Trazabilidad
8. Mejores Prácticas de Seguridad
9. Casos de Uso Prácticos
10. Preguntas y Discusión

---

## Diapositiva 3: ¿Qué es Control de Acceso?

**Definición:**
Control de Acceso es el mecanismo que determina qué usuarios pueden realizar qué acciones en qué recursos.

**Componentes Clave:**
- **Autenticación:** ¿Quién eres? (Login)
- **Autorización:** ¿Qué puedes hacer? (Permisos)
- **Auditoría:** ¿Qué hiciste? (Registro)

**Principios:**
- Principio de Menor Privilegio
- Separación de Responsabilidades
- Trazabilidad Completa

---

## Diapositiva 4: Los 3 Roles de SIGER PRO

**Estructura Jerárquica:**

```
SUPER_ADMIN
    ↓
ADMINISTRADOR
    ↓
AUDITOR
```

**Características:**
- SUPER_ADMIN: Control total del sistema
- ADMINISTRADOR: Gestión de evaluaciones
- AUDITOR: Revisión de solo lectura

**Estándar OACI:**
Basado en recomendaciones de seguridad operacional aeronáutica

---

## Diapositiva 5: SUPER_ADMIN - Permisos Completos

**Evaluaciones de Riesgos:**
✅ Crear, Leer, Editar, Eliminar
✅ Cambiar estado y reasignar

**Reportes:**
✅ Crear, generar, editar, descargar
✅ Programar generación automática

**Auditoría:**
✅ Ver bitácora completa
✅ Exportar registros de auditoría

**Sistema:**
✅ Gestionar usuarios y roles
✅ Importar/Exportar datos
✅ Configurar parámetros

---

## Diapositiva 6: ADMINISTRADOR - Permisos Limitados

**Evaluaciones de Riesgos:**
✅ Crear evaluaciones
✅ Editar evaluaciones propias
❌ Editar evaluaciones de otros
❌ Eliminar evaluaciones

**Reportes:**
✅ Crear y generar reportes
✅ Descargar PDF/Excel
❌ Editar plantillas

**Auditoría:**
✅ Ver cambios propios
❌ Ver bitácora completa

**Sistema:**
❌ Gestionar usuarios
❌ Importar datos

---

## Diapositiva 7: AUDITOR - Solo Lectura

**Evaluaciones de Riesgos:**
✅ Leer todas las evaluaciones
❌ Crear, editar, eliminar

**Reportes:**
✅ Ver y descargar reportes
❌ Crear o generar nuevos

**Auditoría:**
✅ Ver bitácora completa
✅ Exportar para análisis
❌ Agregar comentarios

**Sistema:**
❌ Gestionar usuarios
❌ Modificar datos

---

## Diapositiva 8: Matriz de Permisos - Evaluaciones

**Tabla Comparativa:**

| Acción | SUPER_ADMIN | ADMINISTRADOR | AUDITOR |
|--------|:-----------:|:-------------:|:-------:|
| Crear | ✅ | ✅ | ❌ |
| Leer Propia | ✅ | ✅ | ✅ |
| Leer de Otros | ✅ | ✅ | ✅ |
| Editar Propia | ✅ | ✅ | ❌ |
| Editar de Otros | ✅ | ❌ | ❌ |
| Eliminar | ✅ | ❌ | ❌ |
| Cambiar Estado | ✅ | ✅* | ❌ |
| Reasignar | ✅ | ❌ | ❌ |

*Solo propias

---

## Diapositiva 9: Matriz de Permisos - Reportes

**Tabla Comparativa:**

| Acción | SUPER_ADMIN | ADMINISTRADOR | AUDITOR |
|--------|:-----------:|:-------------:|:-------:|
| Crear Manual | ✅ | ✅ | ❌ |
| Generar Auto | ✅ | ✅ | ❌ |
| Ver Reportes | ✅ | ✅ | ✅ |
| Descargar | ✅ | ✅ | ✅ |
| Editar Plantillas | ✅ | ❌ | ❌ |
| Programar | ✅ | ❌ | ❌ |

---

## Diapositiva 10: Implementación en Base de Datos

**Tabla de Usuarios:**

```sql
CREATE TABLE usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  openId VARCHAR(64) UNIQUE NOT NULL,
  nombre TEXT,
  correo VARCHAR(320),
  role ENUM('SUPER_ADMIN', 'ADMINISTRADOR', 'AUDITOR'),
  activo BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Características:**
- Rol almacenado en cada usuario
- Enum para valores válidos
- Campo activo para desactivar usuarios

---

## Diapositiva 11: Tabla de Bitácora de Auditoría

**Estructura:**

```sql
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

**Registra:**
- Quién realizó la acción
- Qué acción (CREATE, READ, UPDATE, DELETE)
- Qué tabla fue afectada
- Cambios específicos en JSON
- Cuándo ocurrió

---

## Diapositiva 12: Implementación en Backend - Procedimientos Protegidos

**Código TypeScript:**

```typescript
// Procedimiento solo para SUPER_ADMIN
export const adminProcedure = protectedProcedure
  .use(({ ctx, next }) => {
    if (ctx.user.role !== 'SUPER_ADMIN') {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }
    return next({ ctx });
  });

// Procedimiento para SUPER_ADMIN y ADMINISTRADOR
export const managerProcedure = protectedProcedure
  .use(({ ctx, next }) => {
    if (!['SUPER_ADMIN', 'ADMINISTRADOR'].includes(ctx.user.role)) {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }
    return next({ ctx });
  });
```

---

## Diapositiva 13: Uso de Procedimientos Protegidos

**Ejemplo - Eliminar Evaluación:**

```typescript
evaluaciones: router({
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      // Solo SUPER_ADMIN puede ejecutar
      await db.delete(evaluaciones)
        .where(eq(evaluaciones.id, input.id));
      
      // Registrar en bitácora
      await db.insert(bitacora).values({
        usuario_id: ctx.user.id,
        accion: 'DELETE',
        tabla_afectada: 'evaluaciones',
        registro_id: input.id,
      });
    }),
});
```

---

## Diapositiva 14: Ejemplo - Crear Evaluación

**Procedimiento tRPC:**

```typescript
create: managerProcedure
  .input(z.object({
    fecha: z.string(),
    tipoOcurrencia: z.string(),
    probabilidad: z.number(),
    severidad: z.string(),
    descripcion: z.string(),
  }))
  .mutation(async ({ input, ctx }) => {
    // SUPER_ADMIN y ADMINISTRADOR pueden crear
    const evaluation = await db.insert(evaluaciones).values({
      ...input,
      creadoPor: ctx.user.id,
      estado: 'ABIERTO',
    });
    
    // Registrar en bitácora
    await registrarEnBitacora(ctx.user.id, 'CREATE', 'evaluaciones', evaluation.id);
    
    return evaluation;
  }),
```

---

## Diapositiva 15: Implementación en Frontend - Hook de Permisos

**React Hook:**

```typescript
function useCanDelete() {
  const { user } = useAuth();
  return user?.role === 'SUPER_ADMIN';
}

function useCanEdit() {
  const { user } = useAuth();
  return ['SUPER_ADMIN', 'ADMINISTRADOR'].includes(user?.role);
}

function useCanCreate() {
  const { user } = useAuth();
  return ['SUPER_ADMIN', 'ADMINISTRADOR'].includes(user?.role);
}
```

---

## Diapositiva 16: Componente con Control de Acceso

**Ejemplo React:**

```typescript
export function EvaluacionActions({ evaluacionId }) {
  const { user } = useAuth();
  const canDelete = user?.role === 'SUPER_ADMIN';
  const canEdit = ['SUPER_ADMIN', 'ADMINISTRADOR'].includes(user?.role);

  return (
    <div>
      {canEdit && (
        <Button onClick={() => editarEvaluacion(evaluacionId)}>
          Editar
        </Button>
      )}
      {canDelete && (
        <Button variant="destructive" onClick={() => eliminarEvaluacion(evaluacionId)}>
          Eliminar
        </Button>
      )}
    </div>
  );
}
```

---

## Diapositiva 17: Flujo de Autorización

**Diagrama de Flujo:**

```
Usuario intenta realizar acción
        ↓
¿Está autenticado?
  NO → Redirigir a login
  SÍ ↓
¿Tiene el rol requerido?
  NO → Error 403 FORBIDDEN
  SÍ ↓
¿Es propietario del recurso?
  NO (si aplica) → Error 403 FORBIDDEN
  SÍ ↓
Ejecutar acción
        ↓
Registrar en bitácora
```

---

## Diapositiva 18: Auditoría - Ejemplo de Registro

**Entrada en Bitácora:**

```json
{
  "id": 1,
  "usuario_id": 5,
  "accion": "UPDATE",
  "tabla_afectada": "evaluaciones",
  "registro_id": 42,
  "cambios": {
    "estado": {
      "old": "ABIERTO",
      "new": "CERRADO"
    },
    "actualizado_por": {
      "old": null,
      "new": 5
    }
  },
  "fecha_accion": "2026-02-18T19:30:00Z"
}
```

---

## Diapositiva 19: Auditoría - Consultas Útiles

**Consultas SQL para Auditoría:**

```sql
-- Ver todas las acciones de un usuario
SELECT * FROM bitacora 
WHERE usuario_id = 5 
ORDER BY fecha_accion DESC;

-- Ver cambios en una evaluación específica
SELECT * FROM bitacora 
WHERE tabla_afectada = 'evaluaciones' 
AND registro_id = 42;

-- Ver eliminaciones en el último mes
SELECT * FROM bitacora 
WHERE accion = 'DELETE' 
AND fecha_accion >= DATE_SUB(NOW(), INTERVAL 1 MONTH);
```

---

## Diapositiva 20: Mejores Prácticas - Principio de Menor Privilegio

**Concepto:**
Asigna el rol más bajo que permita al usuario hacer su trabajo.

**Ejemplos:**
- ❌ Dar SUPER_ADMIN a todos
- ✅ ADMINISTRADOR para gestores de evaluaciones
- ✅ AUDITOR para revisores
- ✅ SUPER_ADMIN solo para administradores de sistema

**Beneficios:**
- Reduce riesgo de errores accidentales
- Limita daño en caso de compromiso de cuenta
- Cumple con estándares de seguridad

---

## Diapositiva 21: Mejores Prácticas - Separación de Responsabilidades

**Concepto:**
Diferentes usuarios tienen responsabilidades diferentes.

**Ejemplo en SIGER PRO:**
- ADMINISTRADOR: Crea y edita evaluaciones
- AUDITOR: Revisa y valida evaluaciones
- SUPER_ADMIN: Gestiona sistema y usuarios

**Ventajas:**
- Evita conflictos de interés
- Mejora control y auditoría
- Facilita investigación de incidentes

---

## Diapositiva 22: Mejores Prácticas - Auditoría Continua

**Actividades:**
1. Revisar bitácora regularmente
2. Identificar acciones inusuales
3. Investigar cambios no autorizados
4. Alertar sobre intentos de acceso denegado

**Herramientas:**
- Consultas SQL para análisis
- Reportes automáticos
- Alertas en tiempo real

---

## Diapositiva 23: Mejores Prácticas - Rotación de Credenciales

**Medidas:**
- Cambiar contraseñas regularmente
- Desactivar usuarios inactivos
- Revocar acceso cuando sea necesario
- Revisar roles asignados periódicamente

**Frecuencia Recomendada:**
- Cambio de contraseña: Cada 90 días
- Revisión de roles: Mensual
- Auditoría de acceso: Semanal

---

## Diapositiva 24: Caso de Uso 1 - Nuevo Administrador

**Escenario:**
Se contrata a un nuevo gestor de evaluaciones.

**Pasos:**
1. SUPER_ADMIN crea usuario con rol ADMINISTRADOR
2. Usuario se autentica con OAuth
3. Sistema asigna permisos automáticamente
4. Usuario puede crear y editar evaluaciones
5. Todas las acciones se registran en bitácora

**Resultado:**
✅ Acceso controlado y auditable

---

## Diapositiva 25: Caso de Uso 2 - Auditoría de Cambios

**Escenario:**
Se necesita investigar quién cambió una evaluación.

**Pasos:**
1. AUDITOR consulta bitácora para evaluación #42
2. Ve que usuario #5 cambió estado a CERRADO
3. Consulta otros cambios del usuario #5
4. Identifica patrón de actividad
5. Reporta hallazgos a SUPER_ADMIN

**Resultado:**
✅ Trazabilidad completa de cambios

---

## Diapositiva 26: Caso de Uso 3 - Revocar Acceso

**Escenario:**
Un empleado se va de la empresa.

**Pasos:**
1. SUPER_ADMIN desactiva usuario
2. Usuario ya no puede autenticarse
3. Acciones futuras son bloqueadas
4. Bitácora muestra cuándo fue desactivado
5. Datos históricos se mantienen para auditoría

**Resultado:**
✅ Acceso revocado, auditoría preservada

---

## Diapositiva 27: Seguridad - Protección contra Ataques

**Ataques Comunes:**
- Escalación de privilegios
- Acceso no autorizado
- Modificación no autorizada

**Defensas en SIGER PRO:**
- Verificación de rol en cada operación
- Auditoría completa de cambios
- Separación de responsabilidades
- Principio de menor privilegio

---

## Diapositiva 28: Integración con OAuth

**Flujo:**
1. Usuario intenta acceder
2. Redirige a Manus OAuth
3. Usuario se autentica
4. OAuth devuelve openId y datos
5. Sistema crea/actualiza usuario en BD
6. Asigna rol según configuración

**Ventaja:**
✅ Autenticación centralizada y segura

---

## Diapositiva 29: Monitoreo y Alertas

**Métricas a Monitorear:**
- Intentos de acceso denegado
- Cambios de rol
- Eliminaciones de evaluaciones
- Acceso a datos sensibles

**Alertas Recomendadas:**
- Múltiples intentos fallidos de login
- Cambios de rol no esperados
- Acciones de SUPER_ADMIN fuera de horario
- Acceso a evaluaciones críticas

---

## Diapositiva 30: Roadmap Futuro

**Mejoras Planeadas:**
- [ ] Roles personalizados
- [ ] Permisos a nivel de campo
- [ ] Autenticación multifactor (MFA)
- [ ] Alertas en tiempo real
- [ ] Dashboard de auditoría avanzado
- [ ] Integración con SIEM

**Objetivo:**
Mejorar seguridad y cumplimiento normativo

---

## Diapositiva 31: Resumen

**Puntos Clave:**
1. SIGER PRO implementa 3 roles bien definidos
2. Permisos granulares por rol
3. Auditoría completa de todas las acciones
4. Implementación en BD, Backend y Frontend
5. Mejores prácticas de seguridad aplicadas

**Beneficios:**
- ✅ Control de acceso robusto
- ✅ Trazabilidad completa
- ✅ Cumplimiento OACI
- ✅ Seguridad operacional

---

## Diapositiva 32: Preguntas y Discusión

**Temas para Discutir:**
- ¿Cómo asignar roles a nuevos usuarios?
- ¿Cómo investigar cambios no autorizados?
- ¿Qué hacer si se compromete una cuenta?
- ¿Cómo escalar privilegios si es necesario?

**Contacto:**
- Email: soporte@sigerpro.com
- Teléfono: +1-XXX-XXX-XXXX
- Documentación: https://docs.sigerpro.com

---

## Diapositiva 33: Gracias

**Conclusión:**
La implementación técnica de roles y permisos es fundamental para la seguridad operacional en SIGER PRO.

**Próximos Pasos:**
1. Revisar documentación completa
2. Implementar en tu organización
3. Entrenar a usuarios
4. Monitorear auditoría regularmente

**¡Gracias por tu atención!**
