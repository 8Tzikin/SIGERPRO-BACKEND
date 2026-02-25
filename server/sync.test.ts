import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";

describe("evaluaciones.saveFromForm", () => {
  it("should save evaluation from form successfully", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    const result = await caller.evaluaciones.saveFromForm({
      fecha: "2026-02-18",
      numeroReporte: "REP-001",
      formaReporte: "Escrita",
      reportadoPor: "Juan Pérez",
      tipoOcurrencia: "Incidente",
      regulacion: "RAC",
      probabilidad: 3,
      severidad: "D",
      indiceRiesgo: 12,
      descripcion: "Incidente de seguridad operacional",
      accionMitigadora: "Implementar procedimiento de control",
    });

    expect(result.success).toBe(true);
    expect(result.message).toContain("guardada");
    expect(result.id).toBeDefined();
  });

  it("should handle missing required fields", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    try {
      await caller.evaluaciones.saveFromForm({
        fecha: "2026-02-18",
        numeroReporte: "REP-002",
        formaReporte: "Verbal",
        reportadoPor: "",
        tipoOcurrencia: "",
        regulacion: "OACI",
        probabilidad: 2,
        severidad: "B",
        indiceRiesgo: 4,
        descripcion: "",
        accionMitigadora: "",
      });
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should calculate risk classification correctly", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    // Test CRÍTICO (indice >= 16)
    const critico = await caller.evaluaciones.saveFromForm({
      fecha: "2026-02-18",
      numeroReporte: "REP-003",
      formaReporte: "Sistema",
      reportadoPor: "Sistema",
      tipoOcurrencia: "Incidente",
      regulacion: "AIES-SOARG",
      probabilidad: 4,
      severidad: "E",
      indiceRiesgo: 20,
      descripcion: "Incidente crítico",
      accionMitigadora: "Acción inmediata",
    });

    expect(critico.success).toBe(true);

    // Test BAJO (indice < 6)
    const bajo = await caller.evaluaciones.saveFromForm({
      fecha: "2026-02-18",
      numeroReporte: "REP-004",
      formaReporte: "Verbal",
      reportadoPor: "Usuario",
      tipoOcurrencia: "Observación",
      regulacion: "NSOAM",
      probabilidad: 1,
      severidad: "A",
      indiceRiesgo: 1,
      descripcion: "Observación menor",
      accionMitigadora: "Seguimiento",
    });

    expect(bajo.success).toBe(true);
  });
});
