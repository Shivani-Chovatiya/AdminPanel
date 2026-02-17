import { useState } from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [menuName, setMenuName] = useState("Dashboard");
  const menu = [
    { name: "Dashboard", path: "/" },
    { name: "User Management", path: "/users" },
    { name: "Content Management", path: "/content" },
    { name: "Financial Report", path: "/finance" },
    { name: "Ticket/Support", path: "/ticketsupport" },
    { name: "Therapist", path: "/therapist" },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white shadow">
        <h2 className="font-bold">{menuName}</h2>
        <button onClick={() => setOpen(true)} className="text-2xl">
          ☰
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:static top-0 left-0 h-full z-50
          w-64 bg-white p-6 shadow
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <h2 className="text-xl font-bold mb-6">{menuName}</h2>

        <ul className="space-y-4">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              onClick={() => {
                setMenuName(item.name);
                setOpen(false);
              }}
              className={({ isActive }) =>
                `block p-3 rounded-lg cursor-pointer transition
                ${isActive ? "bg-orange-500 text-white" : "hover:bg-gray-100"}`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
