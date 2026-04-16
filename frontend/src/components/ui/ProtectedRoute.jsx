import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const raw = localStorage.getItem("blink_user");

  if (!raw) {
    return <Navigate to="/auth" replace />;
  }

  try {
    const user = JSON.parse(raw);
    // Alterado de user.perfil para user.tipo_usuario
    if (!user || (!user.tipo_usuario && !user.visitante)) {
      return <Navigate to="/auth" replace />;
    }
  } catch {
    return <Navigate to="/auth" replace />;
  }

  return children;
}