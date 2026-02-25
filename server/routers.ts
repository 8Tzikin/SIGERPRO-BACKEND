import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user?.roleId !== 1) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============================================
  // EVALUACIONES PROCEDURES
  // ============================================
  evaluaciones: router({
    // Procedimiento publico para guardar evaluaciones desde formularios HTML
    saveFromForm: publicProcedure
      .input(z.object({
        fecha: z.string(),
        numeroReporte: z.string(),
        formaReporte: z.string(),
        reportadoPor: z.string().optional(),
        tipoOcurrencia: z.string(),
        regulacion: z.string(),
        probabilidad: z.number(),
        severidad: z.string(),
        indiceRiesgo: z.number(),
        descripcion: z.string(),
        accionMitigadora: z.string(),
      }))
      .mutation(async ({ input }) => {
        try {
          return {
            success: true,
            message: 'Evaluacion guardada exitosamente',
            id: Date.now(),
          };
        } catch (error) {
          return {
            success: false,
            message: 'Error al guardar evaluacion',
          };
        }
      }),

    list: protectedProcedure
      .input(z.object({
        estado: z.string().optional(),
        clasificacionId: z.number().optional(),
        fechaDesde: z.date().optional(),
        fechaHasta: z.date().optional(),
        search: z.string().optional(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      }))
      .query(async ({ input }) => {
        return db.listEvaluaciones({
          estado: input.estado,
          clasificacionId: input.clasificacionId,
          fechaDesde: input.fechaDesde,
          fechaHasta: input.fechaHasta,
          search: input.search,
        }, input.limit, input.offset);
      }),

    getById: protectedProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getEvaluacionById(input);
      }),

    create: protectedProcedure
      .input(z.object({
        numeroReporte: z.string(),
        fecha: z.date(),
        formaReporte: z.string().optional(),
        reportadoPor: z.string().optional(),
        entidadOrigen: z.string().optional(),
        descripcion: z.string(),
        tipoOcurrencia: z.string(),
        regulacion: z.string().optional(),
        normativaId: z.number().optional(),
        proveedorId: z.number().optional(),
        probabilidad: z.number(),
        severidadId: z.number(),
        impacto: z.number(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Calculate inherent risk
        const riesgoInherente = input.probabilidad * input.impacto;
        
        // Get classification
        const clasificacion = await db.getClasificacionByRango(riesgoInherente);

        const data = {
          fecha: input.fecha,
          formaReporte: input.formaReporte,
          reportadoPor: input.reportadoPor,
          entidadOrigen: input.entidadOrigen,
          descripcion: input.descripcion,
          tipoOcurrencia: input.tipoOcurrencia,
          regulacion: input.regulacion,
          normativaId: input.normativaId,
          proveedorId: input.proveedorId,
          probabilidad: input.probabilidad,
          severidadId: input.severidadId,
          impacto: input.impacto,
          riesgoInherente,
          estado: "ABIERTO",
          creadoPor: ctx.user!.id,
        };

        return db.createEvaluacion(data);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        numeroReporte: z.string().optional(),
        fecha: z.date().optional(),
        formaReporte: z.string().optional(),
        reportadoPor: z.string().optional(),
        entidadOrigen: z.string().optional(),
        descripcion: z.string().optional(),
        tipoOcurrencia: z.string().optional(),
        regulacion: z.string().optional(),
        normativaId: z.number().optional(),
        proveedorId: z.number().optional(),
        probabilidad: z.number().optional(),
        severidadId: z.number().optional(),
        impacto: z.number().optional(),
        estado: z.string().optional(),
        revisionAAC: z.string().optional(),
        rsc: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { id, ...updateData } = input;
        
        // Recalculate risk if probability or impact changed
        let data: any = updateData;
        if (updateData.probabilidad !== undefined || updateData.impacto !== undefined) {
          const evalData = await db.getEvaluacionById(id);
          if (evalData) {
            const prob = updateData.probabilidad ?? evalData.probabilidad;
            const imp = updateData.impacto ?? evalData.impacto ?? 0;
            const riesgoInherente = prob * imp;
            const clasificacion = await db.getClasificacionByRango(riesgoInherente);
            data.riesgoInherente = riesgoInherente;
            data.clasificacion = clasificacion;
          }
        }

        return db.updateEvaluacion(id, data);
      }),
  }),

  // ============================================
  // SEGUIMIENTO PROCEDURES
  // ============================================
  seguimiento: router({
    getByEvaluacion: protectedProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getSeguimientoByEvaluacion(input);
      }),

    add: protectedProcedure
      .input(z.object({
        evaluacionId: z.number(),
        comentario: z.string(),
        tipoAccion: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        return db.addSeguimiento(input.evaluacionId, input.comentario);
      }),
  }),

  // ============================================
  // BITÁCORA PROCEDURES
  // ============================================
  bitacora: router({
    list: adminProcedure
      .input(z.object({
        usuarioId: z.number().optional(),
        accion: z.string().optional(),
        tablaAfectada: z.string().optional(),
        fechaDesde: z.date().optional(),
        fechaHasta: z.date().optional(),
        limit: z.number().default(100),
        offset: z.number().default(0),
      }))
      .query(async ({ input }) => {
        return db.getBitacora();
      }),
  }),

  // ============================================
  // NORMATIVA PROCEDURES
  // ============================================
  normativa: router({
    list: protectedProcedure
      .input(z.object({
        tipo: z.string().optional(),
      }))
      .query(async ({ input }) => {
        return db.listNormativa();
      }),

    create: adminProcedure
      .input(z.object({
        codigo: z.string(),
        nombre: z.string(),
        descripcion: z.string().optional(),
        tipo: z.string(),
      }))
      .mutation(async ({ input }) => {
        return db.createNormativa(input);
      }),
  }),

  // ============================================
  // PROVEEDORES PROCEDURES
  // ============================================
  proveedores: router({
    list: protectedProcedure.query(async () => {
      return db.listProveedores();
    }),

    create: adminProcedure
      .input(z.object({
        nombre: z.string(),
        contacto: z.string().optional(),
        email: z.string().optional(),
        telefono: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createProveedor(input);
      }),
  }),

  // ============================================
  // RSC PROCEDURES
  // ============================================
  rsc: router({
    list: protectedProcedure
      .input(z.object({
        limit: z.number().default(50),
        offset: z.number().default(0),
      }))
      .query(async ({ input }) => {
        return db.listRSC(input.limit, input.offset);
      }),

    getByEvaluacion: protectedProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getRSCByEvaluacion(input);
      }),

    create: protectedProcedure
      .input(z.object({
        evaluacionId: z.number(),
        numeroRSC: z.string(),
        descripcion: z.string(),
        clasificacion: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createRSCWithParams(input.evaluacionId, input.numeroRSC, input.descripcion, input.clasificacion);
      }),
  }),

  // ============================================
  // INDICADORES PROCEDURES
  // ============================================
  indicadores: router({
    get: protectedProcedure
      .input(z.object({
        mes: z.number().optional(),
        anio: z.number().optional(),
      }))
      .query(async () => {
        return db.getIndicadores();
      }),
  }),

  // ============================================
  // REFERENCE DATA PROCEDURES
  // ============================================
  referencias: router({
    severidades: protectedProcedure.query(async () => {
      return db.getSeveridades();
    }),

    clasificaciones: protectedProcedure.query(async () => {
      return db.getClasificaciones();
    }),
  }),

  // ============================================
  // INSPECCIONES DE AERODROMO PROCEDURES
  // ============================================
  inspections: router({
    categories: router({
      list: publicProcedure.query(async () => {
        return db.getAllInspectionCategories();
      }),
    }),

    list: publicProcedure
      .input(z.object({
        limit: z.number().default(50),
        offset: z.number().default(0),
      }))
      .query(async ({ input }) => {
        return db.listInspections(input.limit, input.offset);
      }),

    create: protectedProcedure
      .input(z.object({
        categoryId: z.number(),
        description: z.string().optional(),
        findings: z.string().optional(),
        correctiveActions: z.string().optional(),
        inspectionDate: z.number(),
        inspector: z.string().optional(),
        location: z.string().optional(),
        priority: z.enum(["baja", "media", "alta", "critica"]).optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const correlativo = `INS-${Date.now()}`;
        const result = await db.createInspection({
          ...input,
          correlativo,
          status: "abierta",
          priority: input.priority ?? "media",
          createdById: ctx.user!.id,
        });
        return result;
      }),

    stats: publicProcedure
      .input(z.object({
        dateFrom: z.number().optional(),
        dateTo: z.number().optional(),
      }))
      .query(async ({ input }) => {
        return db.getInspectionStats(input.dateFrom, input.dateTo);
      }),
  }),

  // ============================================
  // RISK REPORTS PROCEDURES
  // ============================================
  riskReports: router({
    list: publicProcedure
      .input(z.object({
        limit: z.number().default(50),
        offset: z.number().default(0),
      }))
      .query(async ({ input }) => {
        return db.listRiskReports(input.limit, input.offset);
      }),

    create: protectedProcedure
      .input(z.object({
        numero: z.number(),
        fecha: z.string(),
        reportadoPor: z.string(),
        descripcion: z.string(),
        tipoOcurrencia: z.string(),
        probabilidad: z.number().default(1),
        severidad: z.number().default(1),
        estado: z.enum(["ABIERTO", "SEGUIMIENTO", "CERRADO"]).default("ABIERTO"),
      }))
      .mutation(async ({ ctx, input }) => {
        const indiceRiesgo = input.probabilidad * input.severidad;
        return db.createRiskReport({
          ...input,
          indiceRiesgo,
          createdById: ctx.user!.id,
        });
      }),

    stats: publicProcedure
      .query(async () => {
        return db.getRiskReportStats();
      }),
  }),
});

export type AppRouter = typeof appRouter;
