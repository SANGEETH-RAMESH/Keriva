
import { Routes } from "react-router-dom";
import AdminRoutes from "./routes/AdminRoutes";
import UserRoutes from "./routes/UserRoutes";
import './App.css'

export default function App() {
  return (
   <Routes>
      {UserRoutes()}
      {AdminRoutes()}
    </Routes>
  );
}