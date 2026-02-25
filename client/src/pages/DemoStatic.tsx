import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, AlertTriangle, TrendingUp, Download, Plus, Home } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

/**
 * Demo Static - Completely standalone, no backend required
 */

const riskDistribution = [
  { name: "Bajo", value: 17, fill: "#22c55e" },
  { name: "Medio", value: 10, fill: "#eab308" },
  { name: "Alto", value: 53, fill: "#f97316" },
  { name: "Crítico", value: 94, fill: "#dc2626" },
];

const monthlyTrends = [
  { mes: "Ago", total: 120, criticos: 45 },
  { mes: "Sep", total: 135, criticos: 52 },
  { mes: "Oct", total: 148, criticos: 68 },
  { mes: "Nov", total: 162, criticos: 78 },
  { mes: "Dic", total: 168, criticos: 85 },
  { mes: "Ene", total: 171, criticos: 89 },
  { mes: "Feb", total: 174, criticos: 94 },
];

const evaluacionesPorTipo = [
  { tipo: "Incidente", cantidad: 45 },
  { tipo: "Hallazgo", cantidad: 89 },
  { tipo: "Observación", cantidad: 40 },
];

export default function DemoStatic() {
  const handleGenerarReporte = () => {
    toast.success("Reporte generado exitosamente");
  };

  const handleDescargarDatos = () => {
    toast.success("Descargando datos en Excel...");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Dashboard - Modo Demo
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Datos de ejemplo (174 evaluaciones importadas de 2025)
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleGenerarReporte} className="gap-2">
                <Plus className="w-4 h-4" />
                Generar Reporte
              </Button>
              <Button variant="outline" onClick={handleDescargarDatos} className="gap-2">
                <Download className="w-4 h-4" />
                Exportar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Total Evaluaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">174</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">+12 este mes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-600 dark:text-green-400">
                Riesgo Bajo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">17</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">9.8% del total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-orange-600 dark:text-orange-400">
                Riesgo Alto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">53</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">30.5% del total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-red-600 dark:text-red-400">
                Riesgo Crítico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">94</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">54.0% del total</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Risk Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Distribución de Riesgos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Tendencias Mensuales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="total" stroke="#3b82f6" name="Total" />
                  <Line type="monotone" dataKey="criticos" stroke="#dc2626" name="Críticos" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Evaluations by Type */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Evaluaciones por Tipo de Ocurrencia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={evaluacionesPorTipo}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tipo" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cantidad" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Info Box */}
        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              ℹ️ Modo Demo - Datos de Ejemplo
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
              Estás viendo el dashboard con datos de demostración. Los gráficos muestran las 174 evaluaciones importadas del Excel 2025 con la distribución de riesgos según estándares OACI.
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/")}
                className="border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 gap-2"
              >
                <Home className="w-4 h-4" />
                Volver a Inicio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
