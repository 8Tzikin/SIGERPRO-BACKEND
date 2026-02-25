import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, evaluaciones, seguimiento, bitacora, normativa, proveedores, severidad, clasificaciones, rsc, indicadores, inspectionCategories, inspectionRegulations, categoryRegulations, aerodromInspections, inspectionPhotos, inspectionStatusHistory, riskReports, riskReportFollowUp, correctiveActions } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    // Usar solo campos basicos que sabemos que existen
    const values: any = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    // Solo agregar campos opcionales si estan definidos
    if (user.nombre !== undefined) {
      values.nombre = user.nombre || '';
      updateSet.nombre = user.nombre || '';
    }
    if (user.email !== undefined) {
      values.email = user.email || '';
      updateSet.email = user.email || '';
    }
    if (user.loginMethod !== undefined) {
      values.loginMethod = user.loginMethod;
      updateSet.loginMethod = user.loginMethod;
    }
    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.roleId !== undefined) {
      values.roleId = user.roleId;
      updateSet.roleId = user.roleId;
    } else if (user.openId === ENV.ownerOpenId) {
      values.roleId = 1; // Admin role
      updateSet.roleId = 1;
    }

    // Si no hay nada para actualizar, al menos actualizar lastSignedIn
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("[Database] Failed to upsert user:", errorMsg);
    // No lanzar error, solo registrar para permitir que OAuth continue
    console.warn("[Database] Continuando sin sincronizar usuario en BD");
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  try {
    const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get user:", error);
    return undefined;
  }
}

// Funciones para RSC
export async function createRSC(evaluacionId: number, rscData: any) {
  const db = await getDb();
  if (!db) return null;
  try {
    return await db.insert(rsc).values({
      evaluacionId: evaluacionId,
      numeroRSC: rscData.numeroRSC,
      descripcion: rscData.descripcion,
      clasificacion: rscData.clasificacion,
      estado: rscData.estado || 'ABIERTO',
    });
  } catch (error) {
    console.error("[Database] Failed to create RSC:", error);
    return null;
  }
}

// Funciones para Indicadores
export async function getIndicadores(mes?: number, anio?: number) {
  const db = await getDb();
  if (!db) return [];
  try {
    return await db.select().from(indicadores).limit(100);
  } catch (error) {
    console.error("[Database] Failed to get indicadores:", error);
    return [];
  }
}

// Funciones para Severidades
export async function getSeveridades() {
  const db = await getDb();
  if (!db) return [];
  try {
    return await db.select().from(severidad).limit(100);
  } catch (error) {
    console.error("[Database] Failed to get severidades:", error);
    return [];
  }
}

// Funciones para Clasificaciones
export async function getClasificaciones() {
  const db = await getDb();
  if (!db) return [];
  try {
    return await db.select().from(clasificaciones).limit(100);
  } catch (error) {
    console.error("[Database] Failed to get clasificaciones:", error);
    return [];
  }
}

// Funciones para Proveedores
export async function listProveedores() {
  const db = await getDb();
  if (!db) return [];
  try {
    return await db.select().from(proveedores).limit(100);
  } catch (error) {
    console.error("[Database] Failed to list proveedores:", error);
    return [];
  }
}

export async function createProveedor(proveedorData: any) {
  const db = await getDb();
  if (!db) return null;
  try {
    return await db.insert(proveedores).values(proveedorData);
  } catch (error) {
    console.error("[Database] Failed to create proveedor:", error);
    return null;
  }
}

// Funciones para RSC
export async function listRSC(limit?: number, offset?: number) {
  const db = await getDb();
  if (!db) return [];
  try {
    return await db.select().from(rsc).limit(limit || 100).offset(offset || 0);
  } catch (error) {
    console.error("[Database] Failed to list RSC:", error);
    return [];
  }
}

export async function getRSCByEvaluacion(evaluacionId: number) {
  const db = await getDb();
  if (!db) return [];
  try {
    return await db.select().from(rsc).where(eq(rsc.evaluacionId, evaluacionId));
  } catch (error) {
    console.error("[Database] Failed to get RSC by evaluacion:", error);
    return [];
  }
}

// Funciones para Bitacora
export async function getBitacora() {
  const db = await getDb();
  if (!db) return [];
  try {
    return await db.select().from(bitacora).limit(100);
  } catch (error) {
    console.error("[Database] Failed to get bitacora:", error);
    return [];
  }
}

// Funciones para Normativa
export async function listNormativa() {
  const db = await getDb();
  if (!db) return [];
  try {
    return await db.select().from(normativa).limit(100);
  } catch (error) {
    console.error("[Database] Failed to list normativa:", error);
    return [];
  }
}

export async function createNormativa(normativaData: any) {
  const db = await getDb();
  if (!db) return null;
  try {
    return await db.insert(normativa).values(normativaData);
  } catch (error) {
    console.error("[Database] Failed to create normativa:", error);
    return null;
  }
}

// Funciones para Seguimiento
export async function addSeguimiento(evaluacionId: number, comentario: string) {
  const db = await getDb();
  if (!db) return null;
  try {
    return await db.insert(seguimiento).values({
      evaluacionId,
      comentario,
      fecha: new Date(),
    });
  } catch (error) {
    console.error("[Database] Failed to add seguimiento:", error);
    return null;
  }
}

// Funciones para Evaluaciones
export async function getClasificacionByRango(riesgo: number) {
  // Clasificación según rango de riesgo
  if (riesgo <= 4) return 'BAJO';
  if (riesgo <= 8) return 'MEDIO';
  if (riesgo <= 12) return 'ALTO';
  return 'CRÍTICO';
}

export async function updateEvaluacion(evaluacionId: number, data: any) {
  const db = await getDb();
  if (!db) return null;
  try {
    return await db.update(evaluaciones).set(data).where(eq(evaluaciones.id, evaluacionId));
  } catch (error) {
    console.error("[Database] Failed to update evaluacion:", error);
    return null;
  }
}

export async function getSeguimientoByEvaluacion(evaluacionId: number) {
  const db = await getDb();
  if (!db) return [];
  try {
    return await db.select().from(seguimiento).where(eq(seguimiento.evaluacionId, evaluacionId));
  } catch (error) {
    console.error("[Database] Failed to get seguimiento:", error);
    return [];
  }
}

export async function createRSCWithParams(evaluacionId: number, numeroRSC: string, descripcion: string, clasificacion?: string) {
  const db = await getDb();
  if (!db) return null;
  try {
    return await db.insert(rsc).values({
      evaluacionId: evaluacionId,
      numeroRSC,
      descripcion,
      clasificacion,
      estado: 'ABIERTO',
    });
  } catch (error) {
    console.error("[Database] Failed to create RSC:", error);
    return null;
  }
}

// Funciones para crear y obtener evaluaciones
export async function createEvaluacion(evalData: any) {
  const db = await getDb();
  if (!db) return null;
  try {
    return await db.insert(evaluaciones).values(evalData);
  } catch (error) {
    console.error("[Database] Failed to create evaluacion:", error);
    return null;
  }
}

export async function getEvaluacionById(id: number) {
  const db = await getDb();
  if (!db) return null;
  try {
    const result = await db.select().from(evaluaciones).where(eq(evaluaciones.id, id)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to get evaluacion:", error);
    return null;
  }
}

// Funciones para listar evaluaciones
export async function listEvaluaciones(filters?: any, limit?: number, offset?: number) {
  const db = await getDb();
  if (!db) return [];
  try {
    let query = db.select().from(evaluaciones);
    // Aquí se pueden agregar filtros si es necesario
    return await query.limit(limit || 50).offset(offset || 0);
  } catch (error) {
    console.error("[Database] Failed to list evaluaciones:", error);
    return [];
  }
}

// TODO: add feature queries here as your schema grows.


// ============================================
// FUNCIONES PARA INSPECCIONES DE AERÓDROMO
// ============================================

export async function getAllInspectionCategories() {
  const db = await getDb();
  if (!db) return [];
  try {
    return await db.select().from(inspectionCategories);
  } catch (error) {
    console.error("[Database] Failed to get inspection categories:", error);
    return [];
  }
}

export async function getAllInspectionRegulations() {
  const db = await getDb();
  if (!db) return [];
  try {
    return await db.select().from(inspectionRegulations);
  } catch (error) {
    console.error("[Database] Failed to get inspection regulations:", error);
    return [];
  }
}

export async function getCategoryRegulations(categoryId: number) {
  const db = await getDb();
  if (!db) return [];
  try {
    return await db.select().from(inspectionRegulations)
      .innerJoin(categoryRegulations, eq(inspectionRegulations.id, categoryRegulations.regulationId))
      .where(eq(categoryRegulations.categoryId, categoryId));
  } catch (error) {
    console.error("[Database] Failed to get category regulations:", error);
    return [];
  }
}

export async function createInspection(data: any) {
  const db = await getDb();
  if (!db) return null;
  try {
    const result = await db.insert(aerodromInspections).values(data);
    return result;
  } catch (error) {
    console.error("[Database] Failed to create inspection:", error);
    return null;
  }
}

export async function getInspectionById(id: number) {
  const db = await getDb();
  if (!db) return null;
  try {
    const result = await db.select().from(aerodromInspections).where(eq(aerodromInspections.id, id)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to get inspection:", error);
    return null;
  }
}

export async function listInspections(limit?: number, offset?: number) {
  const db = await getDb();
  if (!db) return { items: [], total: 0 };
  try {
    const items = await db.select().from(aerodromInspections).limit(limit || 50).offset(offset || 0);
    return { items, total: items.length };
  } catch (error) {
    console.error("[Database] Failed to list inspections:", error);
    return { items: [], total: 0 };
  }
}

export async function updateInspection(id: number, data: any) {
  const db = await getDb();
  if (!db) return null;
  try {
    return await db.update(aerodromInspections).set(data).where(eq(aerodromInspections.id, id));
  } catch (error) {
    console.error("[Database] Failed to update inspection:", error);
    return null;
  }
}

export async function addStatusHistory(data: any) {
  const db = await getDb();
  if (!db) return null;
  try {
    return await db.insert(inspectionStatusHistory).values(data);
  } catch (error) {
    console.error("[Database] Failed to add status history:", error);
    return null;
  }
}

export async function addInspectionPhoto(data: any) {
  const db = await getDb();
  if (!db) return null;
  try {
    return await db.insert(inspectionPhotos).values(data);
  } catch (error) {
    console.error("[Database] Failed to add inspection photo:", error);
    return null;
  }
}

export async function getInspectionPhotos(inspectionId: number) {
  const db = await getDb();
  if (!db) return [];
  try {
    return await db.select().from(inspectionPhotos).where(eq(inspectionPhotos.inspectionId, inspectionId));
  } catch (error) {
    console.error("[Database] Failed to get inspection photos:", error);
    return [];
  }
}

export async function getInspectionStats(dateFrom?: number, dateTo?: number) {
  const db = await getDb();
  if (!db) return [];
  try {
    return await db.select().from(aerodromInspections).limit(100);
  } catch (error) {
    console.error("[Database] Failed to get inspection stats:", error);
    return [];
  }
}


// ============================================
// RISK REPORTS FUNCTIONS
// ============================================

export async function createRiskReport(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    const result = await db.insert(riskReports).values({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return result;
  } catch (error) {
    console.error("[Database] Failed to create risk report:", error);
    throw error;
  }
}

export async function listRiskReports(limit: number = 50, offset: number = 0, filters?: any) {
  const db = await getDb();
  if (!db) return { items: [], total: 0 };
  try {
    const items = await db.select().from(riskReports).limit(limit).offset(offset);
    const countResult = await db.select().from(riskReports);
    
    return {
      items,
      total: countResult.length,
    };
  } catch (error) {
    console.error("[Database] Failed to list risk reports:", error);
    return { items: [], total: 0 };
  }
}

export async function getRiskReportById(id: number) {
  const db = await getDb();
  if (!db) return null;
  try {
    const result = await db.select().from(riskReports).where(eq(riskReports.id, id));
    return result[0] || null;
  } catch (error) {
    console.error("[Database] Failed to get risk report:", error);
    return null;
  }
}

export async function updateRiskReport(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    await db.update(riskReports).set({
      ...data,
      updatedAt: new Date(),
    }).where(eq(riskReports.id, id));
    return true;
  } catch (error) {
    console.error("[Database] Failed to update risk report:", error);
    throw error;
  }
}

export async function deleteRiskReport(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    await db.delete(riskReports).where(eq(riskReports.id, id));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete risk report:", error);
    throw error;
  }
}

export async function getRiskReportStats(dateFrom?: number, dateTo?: number) {
  const db = await getDb();
  if (!db) return { total: 0, abiertos: 0, seguimiento: 0, cerrados: 0 };
  try {
    const reports = await db.select().from(riskReports);
    return {
      total: reports.length,
      abiertos: reports.filter(r => r.estado === "ABIERTO").length,
      seguimiento: reports.filter(r => r.estado === "SEGUIMIENTO").length,
      cerrados: reports.filter(r => r.estado === "CERRADO").length,
    };
  } catch (error) {
    console.error("[Database] Failed to get risk report stats:", error);
    return { total: 0, abiertos: 0, seguimiento: 0, cerrados: 0 };
  }
}

export async function addFollowUp(reportId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    await db.insert(riskReportFollowUp).values({
      reportId,
      ...data,
      createdAt: new Date(),
    });
    return true;
  } catch (error) {
    console.error("[Database] Failed to add follow-up:", error);
    throw error;
  }
}

export async function getFollowUps(reportId: number) {
  const db = await getDb();
  if (!db) return [];
  try {
    return await db.select().from(riskReportFollowUp).where(eq(riskReportFollowUp.reportId, reportId));
  } catch (error) {
    console.error("[Database] Failed to get follow-ups:", error);
    return [];
  }
}

export async function addCorrectiveAction(reportId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    await db.insert(correctiveActions).values({
      reportId,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return true;
  } catch (error) {
    console.error("[Database] Failed to add corrective action:", error);
    throw error;
  }
}

export async function getCorrectiveActions(reportId: number) {
  const db = await getDb();
  if (!db) return [];
  try {
    return await db.select().from(correctiveActions).where(eq(correctiveActions.reportId, reportId));
  } catch (error) {
    console.error("[Database] Failed to get corrective actions:", error);
    return [];
  }
}
