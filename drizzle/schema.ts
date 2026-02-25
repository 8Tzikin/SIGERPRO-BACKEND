import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
  date,
  bigint,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("usuarios", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  nombre: varchar("nombre", { length: 255 }),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  roleId: int("roleId").default(1),
  intentosFallidos: int("intentosFallidos").default(0),
  bloqueado: boolean("bloqueado").default(false),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Alias para compatibilidad
export const correo = users.email;
export const password_hash = undefined;
export const rol_id = users.roleId;
export const fecha_creacion = users.createdAt;

/**
 * Roles table for RBAC
 */
export const roles = mysqlTable("roles", {
  id: int("id").autoincrement().primaryKey(),
  nombre: varchar("nombre", { length: 50 }).notNull().unique(),
});

export type Role = typeof roles.$inferSelect;
export type InsertRole = typeof roles.$inferInsert;

/**
 * Severity levels (A-E) according to ICAO standards
 */
export const severidad = mysqlTable("severidad", {
  id: int("id").autoincrement().primaryKey(),
  letra: varchar("letra", { length: 1 }).notNull().unique(),
  nombre: varchar("nombre", { length: 50 }).notNull(),
  valor: int("valor").notNull(),
});

export type Severidad = typeof severidad.$inferSelect;
export type InsertSeveridad = typeof severidad.$inferInsert;

/**
 * Risk classifications based on index ranges
 */
export const clasificaciones = mysqlTable("clasificaciones", {
  id: int("id").autoincrement().primaryKey(),
  nombre: varchar("nombre", { length: 50 }).notNull(),
  rangoMin: int("rango_min").notNull(),
  rangoMax: int("rango_max").notNull(),
  color: varchar("color", { length: 20 }).notNull(),
});

export type Clasificacion = typeof clasificaciones.$inferSelect;
export type InsertClasificacion = typeof clasificaciones.$inferInsert;

/**
 * Regulations and standards (RAC, AIES-SOARG, NSOAM)
 */
export const normativa = mysqlTable("normativa", {
  id: int("id").autoincrement().primaryKey(),
  codigo: varchar("codigo", { length: 50 }).notNull().unique(),
  nombre: varchar("nombre", { length: 150 }).notNull(),
  descripcion: text("descripcion"),
  tipo: varchar("tipo", { length: 50 }).notNull(), // RAC, AIES-SOARG, NSOAM
  activa: boolean("activa").default(true),
  fechaCreacion: timestamp("fecha_creacion").defaultNow(),
});

export type Normativa = typeof normativa.$inferSelect;
export type InsertNormativa = typeof normativa.$inferInsert;

/**
 * Providers/Vendors
 */
export const proveedores = mysqlTable("proveedores", {
  id: int("id").autoincrement().primaryKey(),
  nombre: varchar("nombre", { length: 150 }).notNull(),
  contacto: varchar("contacto", { length: 150 }),
  email: varchar("email", { length: 150 }),
  telefono: varchar("telefono", { length: 20 }),
  activo: boolean("activo").default(true),
  fechaCreacion: timestamp("fecha_creacion").defaultNow(),
});

export type Proveedor = typeof proveedores.$inferSelect;
export type InsertProveedor = typeof proveedores.$inferInsert;

/**
 * Risk evaluations - Core table for incident/hazard reporting
 */
export const evaluaciones = mysqlTable("evaluaciones", {
  id: int("id").autoincrement().primaryKey(),
  numeroReporte: varchar("numeroReporte", { length: 100 }).notNull().unique(),
  fecha: timestamp("fecha").defaultNow(),
  formaReporte: varchar("formaReporte", { length: 100 }),
  reportadoPor: varchar("reportadoPor", { length: 255 }),
  entidadOrigen: varchar("entidadOrigen", { length: 255 }),
  descripcion: text("descripcion").notNull(),
  tipoOcurrencia: varchar("tipoOcurrencia", { length: 100 }),
  regulacion: varchar("regulacion", { length: 100 }),

  // Risk calculation fields
  probabilidad: int("probabilidad").notNull(),
  severidadId: int("severidadId").notNull().references(() => severidad.id),
  impacto: int("impacto"),
  riesgoInherente: int("riesgoInherente"),
  clasificacionId: int("clasificacionId").references(() => clasificaciones.id),

  // Follow-up and status
  estado: varchar("estado", { length: 20 }).default("ABIERTO"),

  // Audit fields
  creadoPor: int("creadoPor").notNull().references(() => users.id),
  fechaCreacion: timestamp("fechaCreacion").defaultNow(),
});

export type Evaluacion = typeof evaluaciones.$inferSelect;
export type InsertEvaluacion = typeof evaluaciones.$inferInsert;

/**
 * Follow-up comments and actions on evaluations
 */
export const seguimiento = mysqlTable("seguimiento", {
  id: int("id").autoincrement().primaryKey(),
  evaluacionId: int("evaluacion_id")
    .references(() => evaluaciones.id, { onDelete: "cascade" })
    .notNull(),
  comentario: text("comentario"),
  usuarioId: int("usuario_id").references(() => users.id),
  tipoAccion: varchar("tipo_accion", { length: 100 }),
  fechaImplementacion: date("fecha_implementacion"),
  fecha: timestamp("fecha").defaultNow(),
});

export type Seguimiento = typeof seguimiento.$inferSelect;
export type InsertSeguimiento = typeof seguimiento.$inferInsert;

/**
 * Confidential Safety Reports (RSC)
 */
export const rsc = mysqlTable("rsc", {
  id: int("id").autoincrement().primaryKey(),
  evaluacionId: int("evaluacion_id")
    .references(() => evaluaciones.id, { onDelete: "cascade" })
    .notNull(),
  numeroRSC: varchar("numero_rsc", { length: 50 }).unique(),
  descripcion: text("descripcion"),
  clasificacion: varchar("clasificacion", { length: 50 }),
  estado: varchar("estado", { length: 50 }).default("ABIERTO"),
  fechaCreacion: timestamp("fecha_creacion").defaultNow(),
  fechaCierre: timestamp("fecha_cierre"),
});

export type RSC = typeof rsc.$inferSelect;
export type InsertRSC = typeof rsc.$inferInsert;

/**
 * Audit log for tracking all changes in the system
 */
export const bitacora = mysqlTable("bitacora", {
  id: int("id").autoincrement().primaryKey(),
  usuarioId: int("usuario_id").references(() => users.id),
  accion: varchar("accion", { length: 100 }).notNull(),
  tablaAfectada: varchar("tabla_afectada", { length: 100 }).notNull(),
  registroId: int("registro_id"),
  detalles: text("detalles"),
  fecha: timestamp("fecha").defaultNow(),
});

export type Bitacora = typeof bitacora.$inferSelect;
export type InsertBitacora = typeof bitacora.$inferInsert;

/**
 * Risk indicators and metrics for dashboard
 */
export const indicadores = mysqlTable("indicadores", {
  id: int("id").autoincrement().primaryKey(),
  nombre: varchar("nombre", { length: 150 }).notNull(),
  descripcion: text("descripcion"),
  tipo: varchar("tipo", { length: 50 }).notNull(), // TOTAL, PENDIENTE, CRITICO, etc.
  valor: int("valor").default(0),
  porcentaje: decimal("porcentaje", { precision: 5, scale: 2 }),
  mes: int("mes"),
  anio: int("anio"),
  fechaActualizacion: timestamp("fecha_actualizacion").defaultNow(),
});

export type Indicador = typeof indicadores.$inferSelect;
export type InsertIndicador = typeof indicadores.$inferInsert;

/**
 * Monthly risk reports for download
 */
export const reportes = mysqlTable("reportes", {
  id: int("id").autoincrement().primaryKey(),
  titulo: varchar("titulo", { length: 255 }).notNull(),
  mes: int("mes").notNull(),
  anio: int("anio").notNull(),
  rutaArchivo: varchar("ruta_archivo", { length: 500 }).notNull(),
  nombreArchivo: varchar("nombre_archivo", { length: 255 }).notNull(),
  totalEvaluaciones: int("total_evaluaciones").default(0),
  riesgoBajo: int("riesgo_bajo").default(0),
  riesgoMedio: int("riesgo_medio").default(0),
  riesgoAlto: int("riesgo_alto").default(0),
  riesgoCritico: int("riesgo_critico").default(0),
  resumen: text("resumen"),
  generadoPor: int("generado_por").references(() => users.id),
  fechaGeneracion: timestamp("fecha_generacion").defaultNow(),
  fechaDescarga: timestamp("fecha_descarga"),
  descargas: int("descargas").default(0),
});

export type Reporte = typeof reportes.$inferSelect;
export type InsertReporte = typeof reportes.$inferInsert;


/**
 * ============================================
 * MÓDULO DE INSPECCIONES DE AERÓDROMO (Independiente)
 * ============================================
 */

/**
 * Categorías de inspección del programa 2026
 */
export const inspectionCategories = mysqlTable("inspection_categories", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 10 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  frequency: varchar("frequency", { length: 50 }).notNull(),
  programNumber: int("programNumber").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type InspectionCategory = typeof inspectionCategories.$inferSelect;
export type InsertInspectionCategory = typeof inspectionCategories.$inferInsert;

/**
 * Normativas RAC aplicables
 */
export const inspectionRegulations = mysqlTable("inspection_regulations", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 100 }).notNull().unique(),
  title: varchar("title", { length: 500 }).notNull(),
  regulationType: mysqlEnum("regulationType", ["RAC_139", "RAC_14", "RAC_19", "APENDICE"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type InspectionRegulation = typeof inspectionRegulations.$inferSelect;
export type InsertInspectionRegulation = typeof inspectionRegulations.$inferInsert;

/**
 * Relación categoría → normativas (muchos a muchos)
 */
export const categoryRegulations = mysqlTable("category_regulations", {
  id: int("id").autoincrement().primaryKey(),
  categoryId: int("categoryId").notNull().references(() => inspectionCategories.id),
  regulationId: int("regulationId").notNull().references(() => inspectionRegulations.id),
});

export type CategoryRegulation = typeof categoryRegulations.$inferSelect;

/**
 * Inspecciones de aeródromo
 */
export const aerodromInspections = mysqlTable("aerodromo_inspections", {
  id: int("id").autoincrement().primaryKey(),
  correlativo: varchar("correlativo", { length: 30 }).notNull().unique(),
  categoryId: int("categoryId").notNull().references(() => inspectionCategories.id),
  status: mysqlEnum("status", ["abierta", "en_seguimiento", "cerrada"]).default("abierta").notNull(),
  description: text("description"),
  findings: text("findings"),
  correctiveActions: text("correctiveActions"),
  inspectionDate: bigint("inspectionDate", { mode: "number" }).notNull(),
  closedDate: bigint("closedDate", { mode: "number" }),
  inspector: varchar("inspector", { length: 255 }),
  location: varchar("location", { length: 255 }),
  priority: mysqlEnum("priority", ["baja", "media", "alta", "critica"]).default("media").notNull(),
  notes: text("notes"),
  createdById: int("createdById").notNull().references(() => users.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AerodromInspection = typeof aerodromInspections.$inferSelect;
export type InsertAerodromInspection = typeof aerodromInspections.$inferInsert;

/**
 * Fotos de evidencia de inspecciones
 */
export const inspectionPhotos = mysqlTable("inspection_photos", {
  id: int("id").autoincrement().primaryKey(),
  inspectionId: int("inspectionId").notNull().references(() => aerodromInspections.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  fileKey: varchar("fileKey", { length: 500 }).notNull(),
  caption: varchar("caption", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type InspectionPhoto = typeof inspectionPhotos.$inferSelect;
export type InsertInspectionPhoto = typeof inspectionPhotos.$inferInsert;

/**
 * Historial de cambios de estado de inspecciones
 */
export const inspectionStatusHistory = mysqlTable("inspection_status_history", {
  id: int("id").autoincrement().primaryKey(),
  inspectionId: int("inspectionId").notNull().references(() => aerodromInspections.id, { onDelete: "cascade" }),
  previousStatus: mysqlEnum("previousStatus", ["abierta", "en_seguimiento", "cerrada"]).notNull(),
  newStatus: mysqlEnum("newStatus", ["abierta", "en_seguimiento", "cerrada"]).notNull(),
  changedById: int("changedById").notNull().references(() => users.id),
  comment: text("comment"),
  changedAt: timestamp("changedAt").defaultNow().notNull(),
});

export type InspectionStatusHistory = typeof inspectionStatusHistory.$inferSelect;
export type InsertInspectionStatusHistory = typeof inspectionStatusHistory.$inferInsert;


/**
 * Tabla de Reportes de Riesgos Operacionales (Matriz de Riesgos)
 */
export const riskReports = mysqlTable("risk_reports", {
  id: int("id").autoincrement().primaryKey(),
  numero: int("numero").notNull().unique(),
  fecha: date("fecha").notNull(),
  formaReporte: varchar("formaReporte", { length: 500 }),
  reportadoPor: varchar("reportadoPor", { length: 255 }).notNull(),
  entidadOrigen: varchar("entidadOrigen", { length: 255 }),
  descripcion: text("descripcion").notNull(),
  tipoReporte: varchar("tipoReporte", { length: 255 }),
  tipoOcurrencia: varchar("tipoOcurrencia", { length: 255 }).notNull(),
  regulacionAplicable: varchar("regulacionAplicable", { length: 500 }),
  normativaAIES: varchar("normativaAIES", { length: 500 }),
  causaRaiz: text("causaRaiz"),
  probabilidad: int("probabilidad").default(1),
  severidad: int("severidad").default(1),
  indiceRiesgo: decimal("indiceRiesgo", { precision: 10, scale: 2 }),
  accionesAplicadas: text("accionesAplicadas"),
  responsabilidad: varchar("responsabilidad", { length: 255 }),
  seInvestiga: boolean("seInvestiga").default(false),
  seguimientoSMS: text("seguimientoSMS"),
  fechaImplementacion: date("fechaImplementacion"),
  indiceRiesgoResultante: decimal("indiceRiesgoResultante", { precision: 10, scale: 2 }),
  retroalimentacion: text("retroalimentacion"),
  numeroTabulacion: varchar("numeroTabulacion", { length: 100 }),
  procesadoRSC: boolean("procesadoRSC").default(false),
  estado: mysqlEnum("estado", ["ABIERTO", "SEGUIMIENTO", "CERRADO"]).default("ABIERTO").notNull(),
  comentarioAAC: text("comentarioAAC"),
  aceptacion: boolean("aceptacion").default(false),
  revisionAAC: boolean("revisionAAC").default(false),
  rsc: text("rsc"),
  createdById: int("createdById").notNull().references(() => users.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type RiskReport = typeof riskReports.$inferSelect;
export type InsertRiskReport = typeof riskReports.$inferInsert;

/**
 * Tabla de Seguimiento de Reportes de Riesgo
 */
export const riskReportFollowUp = mysqlTable("risk_report_followup", {
  id: int("id").autoincrement().primaryKey(),
  reportId: int("reportId").notNull().references(() => riskReports.id, { onDelete: "cascade" }),
  fecha: date("fecha").notNull(),
  descripcion: text("descripcion").notNull(),
  estado: mysqlEnum("estado", ["ABIERTO", "SEGUIMIENTO", "CERRADO"]).notNull(),
  responsable: varchar("responsable", { length: 255 }),
  createdById: int("createdById").notNull().references(() => users.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type RiskReportFollowUp = typeof riskReportFollowUp.$inferSelect;
export type InsertRiskReportFollowUp = typeof riskReportFollowUp.$inferInsert;

/**
 * Tabla de Acciones Correctivas
 */
export const correctiveActions = mysqlTable("corrective_actions", {
  id: int("id").autoincrement().primaryKey(),
  reportId: int("reportId").notNull().references(() => riskReports.id, { onDelete: "cascade" }),
  descripcion: text("descripcion").notNull(),
  responsable: varchar("responsable", { length: 255 }).notNull(),
  fechaVencimiento: date("fechaVencimiento"),
  estado: mysqlEnum("estado", ["PENDIENTE", "EN_PROGRESO", "COMPLETADA"]).default("PENDIENTE").notNull(),
  evidencia: text("evidencia"),
  createdById: int("createdById").notNull().references(() => users.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CorrectiveAction = typeof correctiveActions.$inferSelect;
export type InsertCorrectiveAction = typeof correctiveActions.$inferInsert;
