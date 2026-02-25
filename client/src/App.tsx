import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Evaluaciones from "@/pages/Evaluaciones";
import NuevaEvaluacion from "@/pages/NuevaEvaluacion";
import Reportes from "@/pages/Reportes";
import DemoStatic from "@/pages/DemoStatic";
import InspeccionesAerodromo from "@/pages/InspeccionesAerodromo";
import NuevaInspección from "@/pages/NuevaInspección";
import NuevoReporte from "@/pages/NuevoReporte";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/evaluaciones"} component={Evaluaciones} />
      <Route path={"/evaluaciones/nueva"} component={NuevaEvaluacion} />
      <Route path={"/inspecciones"} component={InspeccionesAerodromo} />
      <Route path={"/inspecciones/nueva"} component={NuevaInspección} />
      <Route path={"/reportes"} component={Reportes} />
      <Route path={"/reportes/nuevo"} component={NuevoReporte} />
      <Route path={"/demo"} component={DemoStatic} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
