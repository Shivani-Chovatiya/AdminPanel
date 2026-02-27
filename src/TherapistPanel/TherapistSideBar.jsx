import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  DollarSign,
  Ticket,
  UserCheck,
  Menu,
  X,
  BriefcaseMedical,
  Calendar,
} from "lucide-react";

const TherapistSideBar = () => {
  const [open, setOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/therapist/dashboard", icon: LayoutDashboard },
    { name: "Sessions", path: "/therapist/sessions", icon: Calendar },
    {
      name: "Profile",
      path: "/therapist/profile",
      icon: Users,
    },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <div className="md:hidden p-4 bg-white shadow flex justify-between">
        <h2 className="font-semibold">Therapist Panel</h2>
        <button onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <aside
        className={`bg-white shadow-md w-64 p-5 space-y-6 fixed md:static inset-y-0 left-0 transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 z-50`}
      >
        <h1 className="text-xl font-bold text-gray-700">Therapist Panel</h1>

        <nav className="space-y-2">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${
                  isActive
                    ? "bg-orange-100 text-orange-600 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
              onClick={() => setOpen(false)}
            >
              <item.icon size={18} />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="pt-10 border-t text-sm text-gray-500">
          © 2026 Admin Panel
        </div>
      </aside>
    </>
  );
};

export default TherapistSideBar;
