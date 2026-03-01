import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useState } from "react";
import { Plus, Search, Filter } from "lucide-react";

export default function Evaluaciones() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [filterClasificacion, setFilterClasificacion] = useState("");

  // Fetch evaluaciones
  const { data: evaluaciones, isLoading } = trpc.evaluaciones.list.useQuery({
    search: searchTerm || undefined,
    estado: filterEstado || undefined,
    clasificacionId: filterClasificacion ? parseInt(filterClasificacion) : undefined,
    limit: 100,
  });

  if (loading || !user) {
    return <DashboardLayout>Cargando...</DashboardLayout>;
  }

  const getClasificacionLabel = (id: number) => {
    const labels: Record<number, string> = {
      1: "Bajo",
      2: "Medio",
      3: "Alto",
      4: "Crítico",
    };
    return labels[id] || "Desconocido";
  };

  const getClasificacionColor = (id: number) => {
    const colors: Record<number, string> = {
      1: "bg-green-100 text-green-800",
      2: "bg-yellow-100 text-yellow-800",
      3: "bg-orange-100 text-orange-800",
      4: "bg-red-100 text-red-800",
    };
    return colors[id] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (date: any) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("es-ES");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Evaluaciones de Riesgos</h1>
            <p className="text-gray-500 mt-1">Gestión de reportes de incidentes y peligros operacionales</p>
          </div>
          <Button onClick={() => setLocation("/evaluaciones/nueva")} className="bg-blue-600 hover:bg-blue-700 gap-2">
            <Plus className="w-4 h-4" />
            Nueva Evaluación
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar por descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filterEstado} onValueChange={setFilterEstado}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Todos los estados</SelectItem>
                  <SelectItem value="ABIERTO">Abierto</SelectItem>
                  <SelectItem value="CERRADO">Cerrado</SelectItem>
                  <SelectItem value="EN_REVISION">En Revisión</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterClasificacion} onValueChange={setFilterClasificacion}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por clasificación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Todas las clasificaciones</SelectItem>
                  <SelectItem value="1">Bajo</SelectItem>
                  <SelectItem value="2">Medio</SelectItem>
                  <SelectItem value="3">Alto</SelectItem>
                  <SelectItem value="4">Crítico</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Evaluaciones List */}
        <Card>
          <CardHeader>
            <CardTitle>Listado de Evaluaciones</CardTitle>
            <CardDescription>
              {evaluaciones?.length || 0} evaluaciones encontradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Cargando evaluaciones...</p>
              </div>
            ) : evaluaciones && evaluaciones.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Número</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Fecha</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Tipo de Ocurrencia</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Probabilidad</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Clasificación</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evaluaciones.map((evaluation: any) => (
                      <tr key={evaluation.id} className="border-b hover:bg-gray-50 transition">
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">
                          {evaluation.numeroReporte}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {formatDate(evaluation.fecha)}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {evaluation.tipoOcurrencia}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {evaluation.probabilidad}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getClasificacionColor(evaluation.clasificacionId)}`}>
                            {getClasificacionLabel(evaluation.clasificacionId)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            evaluation.estado === "ABIERTO" ? "bg-blue-100 text-blue-800" :
                            evaluation.estado === "CERRADO" ? "bg-green-100 text-green-800" :
                            "bg-yellow-100 text-yellow-800"
                          }`}>
                            {evaluation.estado}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setLocation(`/evaluaciones/${evaluation.id}`)}
                          >
                            Ver
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No hay evaluaciones registradas</p>
                <Button
                  onClick={() => setLocation("/evaluaciones/nueva")}
                  className="mt-4 bg-blue-600 hover:bg-blue-700"
                >
                  Crear Primera Evaluación
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
