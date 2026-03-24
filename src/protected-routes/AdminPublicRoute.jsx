import { Navigate, Outlet } from "react-router-dom";

function AdminPublicRoute() {
  const isLoggedIn = !!localStorage.getItem("adminAccessToken");
  return isLoggedIn ? <Navigate to="/admin/dashboard" replace /> : <Outlet />;
}

export default AdminPublicRoute;