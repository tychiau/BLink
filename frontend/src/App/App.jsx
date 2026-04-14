import { Navigate, Route, Routes } from "react-router-dom";
import AuthPage from "../pages/Auth/AuthPage";
import ClienteDashboardPage from "../pages/Cliente/ClienteDashboardPage";
import VendedorRegistroPage from "../pages/Vendedor/VendedorRegistroPage";
import DashboardVendedor from "../pages/Vendedor/DashboardVendedor";
import IntermediarioDashboardPage from "../pages/Intermediario/IntermediarioRegistroPage";
import ProtectedRoute from "../components/ui/ProtectedRoute";
export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />

      <Route
        path="/cliente/dashboard"
        element={
          <ProtectedRoute>
            <ClienteDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/vendedor/registro"
        element={
          <ProtectedRoute>
            <VendedorRegistroPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vendedor/dashboard"
        element={
          <ProtectedRoute>
            <DashboardVendedor />
          </ProtectedRoute>
        }
      />

      <Route
        path="/intermediario/dashboard"
        element={
          <ProtectedRoute>
            <IntermediarioDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
}