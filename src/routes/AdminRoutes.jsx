import { Routes, Route } from "react-router-dom";
import AdminLogin from "../components/Admin/Login/AdminLogin";
import AdminLayout from "../components/Admin/Common/Sidebar";
import Contact from "../components/Admin/Contact/Contact";
import JourneySubmissions from "../components/Admin/Journey/Journey";
import Experience from '../components/Admin/Experience/Experience'
import AddExperience from "../components/Admin/Experience/AddExperience";
import AdminAbout from "../components/Admin/About/AdminAbout";
import AddAbout from "../components/Admin/About/AddAbout";
import AdminJournal from "../components/Admin/Journal/AdminJournal";
import AddJournal from "../components/Admin/Journal/AddJournal";
import EditAbout from "../components/Admin/About/EditAbout";
import AdminExploreKerala from "../components/Admin/Explore/AdminExploreKerala";
import AddExploreKerala from "../components/Admin/Explore/AddExploreKerala";
import EditExploreKerala from "../components/Admin/Explore/EditExploreKerala";
import AdminDashboard from "../components/Admin/Dashboard/AdminDashboard";
import AdminPublicRoute from "../protected-routes/AdminPublicRoute";
import AdminPrivateRoute from "../protected-routes/AdminPrivateRoute";
import AdminLanding from "../components/Admin/Landing/AdminLanding";
import AddLandingSlide from "../components/Admin/Landing/AddLanding";
import EditLandingSlide from "../components/Admin/Landing/EditLanding";
import AdminReview from "../components/Admin/Review/AdminReview";
import AddReview from "../components/Admin/Review/AddReview";
import EditReview from "../components/Admin/Review/EditReview";

export default function AdminRoutes() {
  return (
    <>
      <Route element={<AdminPublicRoute />}>
        <Route path="/admin/login" element={<AdminLogin />} />
      </Route>

      <Route element={<AdminPrivateRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="contact" element={<Contact />} />
          <Route path="journey" element={<JourneySubmissions />} />
          <Route path="experience" element={<Experience />} />
          <Route path="add-experience" element={<AddExperience />} />
          <Route path="about" element={<AdminAbout />} />
          <Route path="add-about" element={<AddAbout />} />
          <Route path="edit-about/:id" element={<EditAbout />} />
          <Route path="journal" element={<AdminJournal />} />
          <Route path="add-journal" element={<AddJournal />} />
          <Route path="explore-kerala" element={<AdminExploreKerala />} />
          <Route path="add-explore" element={<AddExploreKerala />} />
          <Route path="edit-explore/:section" element={<EditExploreKerala />} />
          <Route path="edit-explore/:section/:id" element={<EditExploreKerala />} />
          <Route path="landing" element={<AdminLanding />} />
          <Route path="add-landing" element={<AddLandingSlide />} />
          <Route path="edit-landing/:id" element={<EditLandingSlide />} />
          <Route path="review" element={<AdminReview/>}/>
          <Route path="add-review" element={<AddReview/>}/>
          <Route path="edit-review/:id" element={<EditReview/>}/>
        </Route>
      </Route>
    </>
  );
}