# SIGER PRO - Gestión de Riesgos Operacionales Aeronáuticos

## Fase 1: Base de Datos y Autenticación
- [x] Implementar esquema Drizzle basado en SQL proporcionado (roles, usuarios, severidad, clasificaciones)
- [x] Crear tablas para evaluaciones, seguimiento, bitácora, normativa, proveedores, RSC
- [x] Configurar relaciones y restricciones de integridad referencial
- [x] Implementar procedimientos protegidos con roles (SUPER_ADMIN, ADMINISTRADOR, AUDITOR)
- [x] Crear helpers de base de datos para consultas optimizadas

## Fase 2: Migración de Datos
- [x] Procesar datos del Excel 2025 (MATRIZ, INDICADORES, DATOS PARA GRÁFICOS, RSC, NORMATIVA, PROVEEDORES)
- [x] Validar y transformar datos a formato compatible con esquema Drizzle
- [x] Crear script de importación reutilizable
- [ ] Ejecutar migración cuando tablas estén disponibles

## Fase 3: Módulo de Evaluaciones de Riesgos
- [x] Implementar formulario de captura de nuevas evaluaciones
- [x] Crear campos: fecha, forma de reporte, tipo de ocurrencia, regulación, probabilidad, severidad
- [x] Implementar cálculo automático de índice de riesgo inherente (probabilidad × severidad)
- [x] Implementar clasificación automática (Bajo, Medio, Alto, Crítico) según rangos
- [x] Crear vista de listado de evaluaciones con filtros y búsqueda
- [x] Implementar validación de campos obligatorios
- [ ] Implementar vista detallada de evaluación individual
- [ ] Crear funcionalidad de edición y actualización de evaluaciones

## Fase 4: Sistema de Seguimiento y Bitácora
- [ ] Implementar módulo de seguimiento con comentarios por evaluación
- [ ] Crear tabla de auditoría para rastrear cambios (usuario, acción, tabla, registro, fecha)
- [ ] Implementar registro automático de cambios en bitácora
- [ ] Crear vista de historial de cambios por evaluación
- [ ] Implementar vista de bitácora general con filtros por usuario y acción

## Fase 5: Dashboard e Indicadores
- [x] Crear dashboard principal con resumen de evaluaciones
- [x] Implementar gráficos de distribución de riesgos (por clasificación, tipo, estado)
- [x] Crear indicadores KPI (total evaluaciones, evaluaciones pendientes, críticas, etc.)
- [x] Implementar gráficos de tendencias temporales de riesgos
- [ ] Crear gráficos de distribución por tipo de ocurrencia y regulación
- [ ] Implementar tabla de indicadores con métricas detalladas
- [ ] Crear visualizaciones basadas en datos del Excel (INDICADORES, DATOS PARA GRÁFICOS)

## Fase 6: Módulos de Normativa, Proveedores y RSC
- [ ] Implementar módulo de gestión de normativa (RAC, AIES-SOARG, NSOAM)
- [ ] Crear CRUD para normativa aplicable
- [ ] Implementar módulo de gestión de proveedores
- [ ] Crear CRUD para proveedores
- [ ] Implementar módulo de Reportes de Seguridad Confidenciales (RSC)
- [ ] Crear vista de RSC con filtros y búsqueda
- [ ] Implementar relación entre evaluaciones y RSC

## Fase 7: Formularios y Validación
- [ ] Crear formulario avanzado de captura de reportes
- [ ] Implementar validación en tiempo real de campos
- [ ] Crear selectores dinámicos para tipo de ocurrencia, regulación, etc.
- [ ] Implementar autocompletado para campos comunes
- [ ] Crear vista previa de evaluación antes de guardar
- [ ] Implementar manejo de errores y mensajes de validación

## Fase 8: Exportación de Datos
- [ ] Implementar exportación de evaluaciones a Excel
- [ ] Crear plantilla de reporte con formato profesional
- [ ] Implementar exportación de indicadores y gráficos
- [ ] Crear exportación de bitácora de auditoría
- [ ] Implementar exportación de RSC
- [ ] Crear descarga de reportes personalizados

## Fase 9: Reportes PDF Mensuales
- [x] Crear tabla de reportes en base de datos
- [x] Implementar página de gestión de reportes
- [x] Crear interfaz para generar reportes mensuales
- [x] Implementar listado de reportes disponibles
- [x] Crear funcionalidad de descarga de reportes
- [ ] Implementar generación automática mensual (cron)
- [ ] Integrar generador PDF con estadísticas y gráficos

## Fase 10: Análisis LLM (Opcional - Futuro)
- [ ] Integrar invokeLLM para análisis automático de evaluaciones
- [ ] Crear análisis de tendencias de riesgos
- [ ] Implementar generación automática de recomendaciones
- [ ] Crear resumen ejecutivo de riesgos usando LLM
- [ ] Implementar análisis de patrones de incidentes
- [ ] Crear sugerencias de acciones mitigatorias
## Fase 10: UI/UX y Optimización
- [ ] Diseñar y implementar DashboardLayout para navegación
- [ ] Crear componentes reutilizables para formularios
- [ ] Implementar tema visual profesional (colores, tipografía)
- [ ] Optimizar para mobile (PWA) y escritorio
- [ ] Implementar carga progresiva de datos
- [ ] Crear estados de carga y error
- [ ] Implementar notificaciones y toasts

## Fase 11: Pruebas
- [ ] Crear tests unitarios para cálculos de riesgo
- [ ] Crear tests para procedimientos de base de datos
- [ ] Crear tests para validación de formularios
- [ ] Crear tests para exportación de datos
- [ ] Crear tests de integración para flujos críticos

## Fase 12: Entrega
- [ ] Verificar todas las funcionalidades
- [ ] Realizar pruebas de rendimiento
- [ ] Crear checkpoint final
- [ ] Documentar uso de la aplicación
- [ ] Entregar proyecto al usuario

## Fase 13: Módulo de Inspecciones de Aeródromo (Independiente)
- [x] Crear tablas de base de datos para inspecciones (categorías, regulaciones, inspecciones, fotos, historial)
- [x] Implementar procedimientos tRPC para CRUD de inspecciones
- [x] Crear página de dashboard de inspecciones con gráficos y KPIs
- [x] Implementar formulario de captura de inspecciones
- [ ] Crear listado de inspecciones con filtros y búsqueda
- [ ] Implementar gestión de fotos de evidencia
- [ ] Crear historial de cambios de estado
- [x] Integrar navegación en DashboardLayout
- [x] Crear rutas para módulo de inspecciones
- [ ] Probar funcionalidad completa del módulo


## Fase 14: Módulo de Ingreso de Reportes de Riesgos Operacionales
- [x] Crear tablas de base de datos para reportes (matriz de riesgos, seguimiento, acciones)
- [x] Implementar procedimientos tRPC para CRUD de reportes
- [x] Crear página de ingreso de reportes con formulario completo
- [ ] Crear listado de reportes con filtros y búsqueda
- [ ] Implementar importación de datos desde Excel (559 registros históricos)
- [ ] Crear vista de detalles y edición de reportes
- [x] Integrar cálculo automático de índice de riesgo
- [ ] Crear reportes y estadísticas
- [ ] Integrar navegación en DashboardLayout
- [ ] Probar funcionalidad completa del módulo
