import Dashboard from "./components/Dashboard";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import UserManagement from "./pages/UserManagement";
import ContentManagement from "./pages/ContentManagement";
import FinancialReportingPage from "./pages/FinancialReportingPage";
import TherapistPage from "./pages/TherapistPage";
import TicketSupportPage from "./pages/TicketSupportPage";

function App() {
  return (
    <BrowserRouter>
      {/* <ToastContainer position="top-right" autoClose={2000} /> */}

      <div className="md:grid md:grid-cols-[240px_1fr] min-h-screen bg-gray-100">
        <Sidebar />

        <main className="p-4 md:p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/content" element={<ContentManagement />} />
            <Route path="/finance" element={<FinancialReportingPage />} />
            <Route path="/ticketsupport" element={<TicketSupportPage />} />
            <Route path="/therapist" element={<TherapistPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
