import { Search, Bell, User, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TherapistHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const basePath =
    "/" +
    location.pathname.split("/")[1] +
    "/" +
    location.pathname.split("/")[2];
  console.log(basePath);
  const routeMap = {
    "/therapist/dashboard": {
      title: "Therapist Dashboard",
      // parent: "Home",
      // options: [
      //   { label: "Analytics", path: "/dashboard/analytics" },
      //   { label: "Logs", path: "/dashboard/logs" },
      // ],
    },
    "/therapist/sessions": {
      title: "Sessions",
      //   parent: "Home",
      //   options: [
      //     { label: "Analytics", path: "/dashboard/analytics" },
      //     { label: "Logs", path: "/dashboard/logs" },
      //   ],
    },
    "/therapist/profile": {
      title: "Profile",
    },
  };
  const currentRoute = routeMap[basePath];

  // 3️⃣ If route has options (like dashboard)
  const currentOption =
    currentRoute?.options?.find((opt) => opt.path === location.pathname) ||
    currentRoute?.options?.[0];

  return (
    <header className="w-full border-t bg-white border-b border-gray-200 px-6 md:px-8 h-16 flex items-center justify-between">
      {/* LEFT SIDE */}
      <div className="flex items-start flex-col ">
        <h2 className="text-lg font-bold text-gray-900 mr-2">
          {currentRoute.title}
        </h2>
        {currentRoute.title === "Sessions" && (
          <h1 className="text-gray-400  text-xs md:text-sm">
            Manage your therapy sessions
          </h1>
        )}
      </div>

      {/* RIGHT SIDE */}
      {/* <div className="flex items-center space-x-6">
      
        <div className="relative hidden md:block">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Global search..."
            className="w-3/4 bg-gray-100 pl-10 pr-4 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

       
        {!location.pathname.includes("/therapist") && (
          <div className="relative cursor-pointer">
            <Bell size={22} className="text-gray-500" />
            <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
              2
            </span>
          </div>
        )}

 
        {!location.pathname.includes("/therapist") && (
          <User size={22} className="text-gray-500 cursor-pointer" />
        )}
        {location.pathname.includes("/therapist") && (
          <button
            className="bg-primary rounded-2xl px-2 py-1 text-white text-xs md:text-sm"
            onClick={() => navigate("/therapist/add")}
          >
            + Add Therapist
          </button>
        )}
      </div> */}
    </header>
  );
};

export default TherapistHeader;
