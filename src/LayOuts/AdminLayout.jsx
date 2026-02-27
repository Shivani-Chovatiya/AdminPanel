import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const AdminLayout = () => {
  return (
    <div className="md:grid md:grid-cols-[256px_1fr] min-h-screen ">
      <Sidebar />

      <main className="">
        {/* p-4 md:p-6 */}
        <Header />
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
