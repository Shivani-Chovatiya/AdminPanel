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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Page (No Sidebar) */}
        <Route path="/" element={<AdminLogin />} />

        {/* Admin Layout (With Sidebar) */}
        <Route element={<AdminLayout />}>
          <Route path="/dashboard/analytics" element={<Dashboard />} />
          <Route path="/dashboard/logs" element={<DashboardLogs />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/content" element={<ContentManagement />} />
          <Route path="/value" element={<ValueManagement />} />
          <Route path="/finance" element={<FinancialReportingPage />} />
          <Route path="/ticketsupport" element={<TicketSupportPage />} />
          <Route path="/therapist" element={<TherapistPage />} />
          <Route path="/therapist/add" element={<AddTherapistForm />} />
        </Route>
        <Route element={<TherapistLayout />}>
          <Route path="/therapist/dashboard" element={<TherapistDashboard />} />
          <Route path="/therapist/sessions" element={<TherapistSessions />} />
          <Route path="/therapist/profile" element={<TherapistProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
