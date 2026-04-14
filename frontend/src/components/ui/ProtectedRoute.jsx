import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const raw = localStorage.getItem("blink_user");

  if (!raw) {
    return <Navigate to="/auth" replace />;
  }

  try {
    const user = JSON.parse(raw);
    if (!user || !user.perfil) {
      return <Navigate to="/auth" replace />;
    }
  } catch {
    return <Navigate to="/auth" replace />;
  }

  return children;
}