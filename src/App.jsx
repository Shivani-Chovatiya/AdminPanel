import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import UserManagement from "./pages/UserManagement";
import ContentManagement from "./pages/ContentManagement";
import FinancialReportingPage from "./pages/FinancialReportingPage";
import TherapistPage from "./pages/TherapistPage";
import TicketSupportPage from "./pages/TicketSupportPage";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./LayOuts/AdminLayout";
import DashboardLogs from "./components/Dashboard/DashboardLogs";
import ValueManagement from "./pages/ValueManagement";
import AddTherapistForm from "./TherapistsPages/AddTherapistForm";
import TherapistLayout from "./LayOuts/TherapistLayout";
import TherapistDashboard from "./TherapistPanel/TherapistDashboard";
import TherapistSessions from "./TherapistPanel/TherapistSessions";
import TherapistProfile from "./TherapistPanel/TherapistProfile";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./ProtectedRoute";
import TherapistProtectedRoute from "./TherapistProtectedRoute";
import ViewTherapistPage from "./TherapistsPages/ViewTherapistPage";
import NotificationsScreen from "./components/Dashboard/NotificationsScreen";
import { useEffect } from "react";

function App() {
  // useEffect(() => {
  //   const handleBeforeUnload = (e) => {
  //     e.preventDefault();
  //     e.returnValue = ""; // required for Chrome
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, []);
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Page (No Sidebar) */}
        <Route path="/" element={<AdminLogin />} />

        {/* Admin Layout (With Sidebar) */}
        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard/analytics" element={<Dashboard />} />
          <Route path="/dashboard/logs" element={<DashboardLogs />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/content" element={<ContentManagement />} />
          <Route path="/value" element={<ValueManagement />} />
          <Route path="/finance" element={<FinancialReportingPage />} />
          <Route path="/ticketsupport" element={<TicketSupportPage />} />
          <Route path="/therapist" element={<TherapistPage />} />
          <Route path="/therapist/add" element={<AddTherapistForm />} />
          <Route path="/therapist/add/:id" element={<AddTherapistForm />} />
          <Route path="/therapist/view/:id" element={<ViewTherapistPage />} />
          <Route path="/notification" element={<NotificationsScreen />} />
        </Route>
        <Route
          element={
            <TherapistProtectedRoute>
              <TherapistLayout />
            </TherapistProtectedRoute>
          }
        >
          <Route path="/therapist/dashboard" element={<TherapistDashboard />} />
          <Route path="/therapist/sessions" element={<TherapistSessions />} />
          <Route path="/therapist/profile" element={<TherapistProfile />} />
        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;
