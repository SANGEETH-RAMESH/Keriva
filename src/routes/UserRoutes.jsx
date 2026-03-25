import { Route, Routes } from "react-router-dom";
import LandingPage from "../components/User/Landing/LandingPage";
import Login from "../components/User/Login/Login";
import Register from "../components/User/SignUp/Register";
import ForgotPassword from "../components/User/Password/ForgotPassword";
import ResetPasswordPage from "../components/User/Password/ResetPassword";
import TicketPage from "../components/User/Ticket/Ticket";
import Explore from "../components/User/Explore/Explore";
import AboutPage from "../components/User/About/AboutPage";
import GatewayPage from "../components/User/Gateway/GatewayPage";
import ExperiencePage from "../components/User/Experience/ExperiencePage";
import JournalPage from "../components/User/Journal/JournalPage";
import ContactPage from "../components/User/Contact/ContactPage";
import AppLoading from "../components/User/Landing/AppLoading";

export default function UserRoutes() {
  return (
    <>
      <Route path="/" element={<AppLoading />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="/ticket" element={<TicketPage />} />
      <Route path="/experience" element={<ExperiencePage />} />
      <Route path="/explore-kerala" element={<Explore />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/gateway" element={<GatewayPage />} />
      <Route path="/journal" element={<JournalPage />} />
      <Route path="/contact" element={<ContactPage />} />
    </>
  );
}