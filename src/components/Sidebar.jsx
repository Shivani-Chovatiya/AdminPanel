// import { useState } from "react";
// import { NavLink } from "react-router-dom";

// const Sidebar = () => {
//   const [open, setOpen] = useState(false);
//   const [menuName, setMenuName] = useState("Dashboard");
//   const menu = [
//     { name: "Dashboard", path: "/" },
//     { name: "User Management", path: "/users" },
//     { name: "Content Management", path: "/content" },
//     { name: "Financial Report", path: "/finance" },
//     { name: "Ticket/Support", path: "/ticketsupport" },
//     { name: "Therapist", path: "/therapist" },
//   ];

//   return (
//     <>
//       {/* Mobile Header */}
//       <div className="md:hidden flex items-center justify-between p-4 bg-white shadow">
//         <h2 className="font-bold">{menuName}</h2>
//         <button onClick={() => setOpen(true)} className="text-2xl">
//           ☰
//         </button>
//       </div>

//       {/* Overlay */}
//       {open && (
//         <div
//           className="fixed inset-0 bg-black/40 z-40 md:hidden"
//           onClick={() => setOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <div
//         className={`
//           fixed md:static top-0 left-0 h-full z-50
//           w-64 bg-white p-6 shadow
//           transform transition-transform duration-300
//           ${open ? "translate-x-0" : "-translate-x-full"}
//           md:translate-x-0
//         `}
//       >
//         <h2 className="text-xl font-bold mb-6">{menuName}</h2>

//         <ul className="space-y-4">
//           {menu.map((item) => (
//             <NavLink
//               key={item.path}
//               to={item.path}
//               end={item.path === "/"}
//               onClick={() => {
//                 setMenuName(item.name);
//                 setOpen(false);
//               }}
//               className={({ isActive }) =>
//                 `block p-3 rounded-lg cursor-pointer transition
//                 ${isActive ? "bg-orange-500 text-white" : "hover:bg-gray-100"}`
//               }
//             >
//               {item.name}
//             </NavLink>
//           ))}
//         </ul>
//       </div>
//     </>
//   );
// };

// export default Sidebar;
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
} from "lucide-react";

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/dashboard/analytics", icon: LayoutDashboard },
    { name: "User Management", path: "/users", icon: Users },
    {
      name: "Therapist Management",
      path: "/therapist",
      icon: BriefcaseMedical,
    },
    { name: "Content Management", path: "/content", icon: FileText },
    { name: "Value Management", path: "/value", icon: FileText },
    // { name: "Financial Reporting", path: "/finance", icon: DollarSign },
    // { name: "Support / Tickets", path: "/ticketsupport", icon: Ticket },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <div className="md:hidden p-4 bg-white shadow flex justify-between">
        <h2 className="font-semibold">Steer-U Admin</h2>
        <button onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <aside
        className={`bg-white shadow-md w-64 p-5 space-y-6 fixed md:static inset-y-0 left-0 transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 z-50`}
      >
        <h1 className="text-xl font-bold text-gray-700">Steer-U Admin</h1>

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

export default Sidebar;
