import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { AlertCircle, TrendingUp, Users, FileText } from "lucide-react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  // Fetch evaluaciones data
  const { data: evaluaciones, isLoading: loadingEvaluaciones } = trpc.evaluaciones.list.useQuery({
    limit: 1000,
  });

  if (loading || !user) {
    return <DashboardLayout>Cargando...</DashboardLayout>;
  }

  // Calculate statistics
  const stats = {
    total: evaluaciones?.length || 0,
    abiertos: evaluaciones?.filter((e: any) => e.estado === "ABIERTO").length || 0,
    criticos: evaluaciones?.filter((e: any) => e.clasificacionId === 4).length || 0,
    altos: evaluaciones?.filter((e: any) => e.clasificacionId === 3).length || 0,
  };

  // Data for risk distribution chart
  const riskDistribution = [
    { name: "Bajo", value: evaluaciones?.filter((e: any) => e.clasificacionId === 1).length || 0 },
    { name: "Medio", value: evaluaciones?.filter((e: any) => e.clasificacionId === 2).length || 0 },
    { name: "Alto", value: evaluaciones?.filter((e: any) => e.clasificacionId === 3).length || 0 },
    { name: "Crítico", value: evaluaciones?.filter((e: any) => e.clasificacionId === 4).length || 0 },
  ];

  const COLORS = ["#10b981", "#f59e0b", "#ef5350", "#d32f2f"];

  // Data for status chart
  const statusData = [
    { name: "Abiertos", value: stats.abiertos },
    { name: "Cerrados", value: stats.total - stats.abiertos },
  ];

  const STATUS_COLORS = ["#3b82f6", "#6b7280"];

  // Trend data (mock)
  const trendData = [
    { mes: "Ene", evaluaciones: 12, criticos: 2 },
    { mes: "Feb", evaluaciones: 15, criticos: 3 },
    { mes: "Mar", evaluaciones: 18, criticos: 2 },
    { mes: "Abr", evaluaciones: 14, criticos: 4 },
    { mes: "May", evaluaciones: 22, criticos: 3 },
    { mes: "Jun", evaluaciones: 25, criticos: 5 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">Bienvenido, {user?.nombre}</p>
          </div>
          <Button onClick={() => setLocation("/evaluaciones/nueva")} className="bg-blue-600 hover:bg-blue-700">
            Nueva Evaluación
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Evaluaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
              <p className="text-xs text-gray-500 mt-1">Todas las evaluaciones registradas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Evaluaciones Abiertas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.abiertos}</div>
              <p className="text-xs text-gray-500 mt-1">Requieren seguimiento</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Riesgos Críticos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.criticos}</div>
              <p className="text-xs text-gray-500 mt-1">Requieren atención inmediata</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Riesgos Altos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{stats.altos}</div>
              <p className="text-xs text-gray-500 mt-1">Requieren seguimiento cercano</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Risk Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Distribución de Riesgos</CardTitle>
              <CardDescription>Por clasificación de severidad</CardDescription>
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
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Estado de Evaluaciones</CardTitle>
              <CardDescription>Abiertos vs Cerrados</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Tendencia de Evaluaciones</CardTitle>
            <CardDescription>Últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="evaluaciones" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="criticos" stroke="#ef5350" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Evaluations */}
        <Card>
          <CardHeader>
            <CardTitle>Evaluaciones Recientes</CardTitle>
            <CardDescription>Últimas 5 evaluaciones registradas</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingEvaluaciones ? (
              <p className="text-gray-500">Cargando...</p>
            ) : evaluaciones && evaluaciones.length > 0 ? (
              <div className="space-y-4">
                {evaluaciones.slice(0, 5).map((evaluation: any) => (
                  <div key={evaluation.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{evaluation.tipoOcurrencia}</p>
                      <p className="text-sm text-gray-500">{evaluation.numeroReporte}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        evaluation.clasificacionId === 4 ? "bg-red-100 text-red-800" :
                        evaluation.clasificacionId === 3 ? "bg-orange-100 text-orange-800" :
                        evaluation.clasificacionId === 2 ? "bg-yellow-100 text-yellow-800" :
                        "bg-green-100 text-green-800"
                      }`}>
                        {evaluation.clasificacionId === 4 ? "Crítico" :
                         evaluation.clasificacionId === 3 ? "Alto" :
                         evaluation.clasificacionId === 2 ? "Medio" :
                         "Bajo"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No hay evaluaciones registradas</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
