import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/store";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const user = useAppSelector((state) => state.auth.user);

  if (!user) {
    // nije logovan → šaljemo ga na login
    return <Navigate to="/" replace />;
  }

  // ako ima pristup → renderuj rutu
  return allowedRoles.includes(user.role) ? (
    <Outlet />
  ) : (
    <Navigate to="/unauthorized" replace />
  );
}
