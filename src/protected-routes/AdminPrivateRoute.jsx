import { Navigate, Outlet } from "react-router-dom";

function AdminPrivateRoute() {
  const isLoggedIn = !!localStorage.getItem("adminRefreshToken");

  return isLoggedIn ? <Outlet /> : <Navigate to="/admin/login" replace />;
}

export default AdminPrivateRoute;