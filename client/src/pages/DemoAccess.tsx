import { useEffect } from "react";
import { useLocation } from "wouter";

/**
 * Demo Access - Bypass OAuth for testing
 * Creates a demo session token and redirects to dashboard
 */

export default function DemoAccess() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Create a demo session token
    const demoToken = btoa(
      JSON.stringify({
        openId: "demo-user-001",
        appId: "sigerpro",
        name: "Usuario Demo",
      })
    );

    // Store in localStorage for demo purposes
    localStorage.setItem("demo_session", demoToken);

    // Redirect to dashboard
    setLocation("/dashboard");
  }, [setLocation]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-muted-foreground">Iniciando sesión de demostración...</p>
      </div>
    </div>
  );
}
