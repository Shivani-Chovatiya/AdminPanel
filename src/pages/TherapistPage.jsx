// import React, { useState } from "react";
// import TherapistsListPage from "../TherapistsPages/TherapistsListPage";
// import AddTherapistForm from "../TherapistsPages/AddTherapistForm";
// import Availability from "../TherapistsPages/Availability";
// import Performance from "../TherapistsPages/Performance";

// const TherapistPage = () => {
//   const [activeTab, setActiveTab] = useState("Therapists List");
//   return (
//     <div>
//       <h1 className="text-xl md:text-2xl font-bold mb-4">Therapist</h1>
//       <div className="bg-white p-6 rounded-2xl shadow">
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-2   p-1 mb-4">
//           {[
//             "Therapists List",
//             "Add New Therapist",
//             "Availability",
//             "Performance",
//           ].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`px-5 py-2 rounded-xl border capitalize shrink-0 text-sm ${
//                 activeTab === tab
//                   ? "bg-orange-500 text-white"
//                   : "text-gray-500 hover:bg-gray-100"
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>
//         {activeTab === "Therapists List" ? <TherapistsListPage /> : <></>}
//         {activeTab === "Add New Therapist" ? <AddTherapistForm /> : <></>}
//         {activeTab === "Availability" ? <Availability /> : <></>}
//         {activeTab === "Performance" ? <Performance /> : <></>}
//       </div>{" "}
//     </div>
//   );
// };

// export default TherapistPage;
import { Eye } from "lucide-react";
import React, { useState } from "react";
const therapistsData = [
  {
    firstName: "Sarah",
    lastName: "Jenkins",
    service: "Counselling",
    charge: 120,
    sessions: 432,
    totalEarnings: 51840,
    pendingPayout: 1240,
    status: "Active",
    id: "#TH-09221",
  },
  {
    firstName: "Marcus",
    lastName: "Thorne",
    service: "Hypnotherapy",
    charge: 150,
    sessions: 215,
    totalEarnings: 32250,
    pendingPayout: 0,
    status: "Inactive",
    id: "#TH-09235",
  },
  {
    firstName: "Elena",
    lastName: "Rodriguez",
    service: "Counselling",
    charge: 110,
    sessions: 891,
    totalEarnings: 98010,
    pendingPayout: 4550,
    status: "Active",
    id: "#TH-09244",
  },
  {
    firstName: "David",
    lastName: "Kim",
    service: "Hypnotherapy",
    charge: 175,
    sessions: 124,
    totalEarnings: 21700,
    pendingPayout: 0,
    status: "Active",
    id: "#TH-09289",
  },
];

const TherapistPage = () => {
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredData =
    statusFilter === "All"
      ? therapistsData
      : therapistsData.filter((t) => t.status === statusFilter);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 3;
  // Calculate pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  return (
    <div className="p-6 bg-white rounded-xl shadow-md w-full max-w-7xl mx-auto">
      {/* Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700">
                Therapist
              </th>
              <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700">
                Service Type
              </th>
              <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700">
                Charge
              </th>
              <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700">
                Total Sessions
              </th>
              <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700">
                Total Earnings
              </th>
              <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700">
                Pending Payout
              </th>
              <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700">
                Status
              </th>
              <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentData.map((therapist, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-2 py-3 text-xs text-gray-800">
                  {therapist.firstName} {therapist.lastName} <br />
                  <span className="text-gray-500 text-sm">{therapist.id}</span>
                </td>
                <td className="px-2 py-3 text-xs text-gray-800">
                  {therapist.service}
                </td>
                <td className="px-2 py-3 text-xs text-gray-800">
                  ₹{therapist.charge}.00
                </td>
                <td className="px-2 py-3 text-xs text-gray-800">
                  {therapist.sessions}
                </td>
                <td className="px-2 py-3 text-xs text-gray-800">
                  ₹{therapist.totalEarnings.toLocaleString()}
                </td>
                <td className="px-2 py-3 text-xs text-gray-800">
                  ₹{therapist.pendingPayout.toLocaleString()}
                </td>
                <td
                  className={`px-2 py-3 text-xs font-medium ${
                    therapist.status === "Active"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {therapist.status}
                </td>
                <td className="px-4 py-3 text-blue-600 hover:underline cursor-pointer">
                  <Eye className="" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Placeholder */}
      <div className="flex items-center justify-between flex-col md:flex-row gap-3 p-3 md:p-6 border-t border-slate-200">
        <div>
          <h1 className="font-bold text-xs text-black">
            Total Data: {filteredData.length}
          </h1>
        </div>
        <div className="flex gap-1 items-center  px-6 py-4 ">
          {/* Previous */}
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="px-3 py-1 text-sm border border-primary rounded-md disabled:opacity-40"
          >
            Previous
          </button>

          {/* Page Numbers */}
          <div className="flex gap-2">
            {currentPage}/{totalPages}
          </div>

          {/* Next */}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-3 py-1 text-sm border border-primary rounded-md disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TherapistPage;
