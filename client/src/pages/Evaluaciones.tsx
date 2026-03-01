import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useState } from "react";
import { Plus, Search } from "lucide-react";

export default function Evaluaciones() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  // Estados corregidos
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterEstado, setFilterEstado] = useState<string>("none");
  const [filterClasificacion, setFilterClasificacion] = useState<string>("none");

  // Fetch evaluaciones (ignorando "none")
  const { data: evaluaciones, isLoading } = trpc.evaluaciones.list.useQuery({
    search: searchTerm || undefined,
    estado: filterEstado !== "none" ? filterEstado : undefined,
    clasificacionId:
      filterClasificacion !== "none"
        ? parseInt(filterClasificacion)
        : undefined,
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
    <div>TEST SIN COMPONENTES</div>
  </DashboardLayout>
);
}
