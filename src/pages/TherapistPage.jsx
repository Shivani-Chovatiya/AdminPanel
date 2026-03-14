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
import { Edit, Eye, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../config/firebase"; // adjust path
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

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
  const [therapistsData, setTherapistsData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const rowsPerPage = 5;

  // 🔥 Fetch therapists
  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "therapists"));

        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTherapistsData(data);
      } catch (error) {
        console.error("Error fetching therapists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTherapists();
  }, []);

  // 🔥 Filter
  const filteredData =
    statusFilter === "All"
      ? therapistsData
      : therapistsData.filter((t) => t.status === statusFilter);

  // 🔥 Pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const handleDeleteTherapist = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This therapist will be permanently deleted!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await deleteDoc(doc(db, "therapists", id));

        Swal.fire({
          title: "Deleted!",
          text: "Therapist has been deleted successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        setTherapistsData((prev) => prev.filter((item) => item.id !== id));
        console.log("Deleted therapist with ID:", id);
      }
    } catch (error) {
      console.error("Error deleting therapist:", error);

      Swal.fire({
        title: "Error!",
        text: "Something went wrong while deleting.",
        icon: "error",
      });
    }
  };
  return (
    <div className="p-6 bg-white rounded-xl shadow-md w-full max-w-7xl mx-auto">
      {/* Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded-md w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
      {loading ? (
        <div className="text-center py-10">Loading therapists...</div>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-2  text-xs text-center font-semibold text-gray-700">
                    Therapist
                  </th>
                  <th className="px-2 py-2  text-xs text-center font-semibold text-gray-700">
                    Service Type
                  </th>
                  <th className="px-2 py-2  text-xs text-center font-semibold text-gray-700">
                    Charge(Indian)
                  </th>
                  <th className="px-2 py-2  text-xs text-center font-semibold text-gray-700">
                    Charge(USD)
                  </th>
                  {/* <th className="px-2 py-2  text-xs text-center font-semibold text-gray-700">
                    Total Sessions
                  </th>
                  <th className="px-2 py-2  text-xs text-center font-semibold text-gray-700">
                    Total Earnings
                  </th> */}
                  {/* <th className="px-2 py-2  text-xs text-center font-semibold text-gray-700">
                    Pending Payout
                  </th> */}
                  <th className="px-2 py-2  text-xs text-center font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-2 py-2  text-xs text-center font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-500">
                      No therapists found
                    </td>
                  </tr>
                ) : (
                  currentData.map((therapist, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-2 py-3 text-xs text-gray-800">
                        {therapist.name} <br />
                        <span className="text-gray-500 text-sm">
                          {therapist.id}
                        </span>
                      </td>
                      <td className="px-2 py-3 text-xs text-center text-gray-800">
                        {therapist.serviceType}
                      </td>
                      <td className="px-2 py-3 text-xs text-center text-gray-800">
                        ₹{therapist.price}
                      </td>
                      <td className="px-2 py-3 text-xs text-center text-gray-800">
                        ${therapist.usdPrice}
                      </td>
                      {/* <td className="px-2 py-3 text-xs text-center text-gray-800">
                        {therapist.sessions || 0}
                      </td>
                      <td className="px-2 py-3 text-xs text-center text-gray-800">
                        ₹
                        {therapist.totalEarnings
                          ? therapist.totalEarnings.toLocaleString()
                          : 0}
                      </td> */}
                      {/* <td className="px-2 py-3 text-xs text-center text-gray-800">
                        ₹
                        {therapist.pendingPayout
                          ? therapist.pendingPayout.toLocaleString()
                          : 0}
                      </td> */}
                      <td
                        className={`px-2 py-3 text-xs text-center font-medium ${
                          therapist.status === "Active"
                            ? "text-green-600 "
                            : "text-red-600"
                        }`}
                      >
                        <span
                          className={`px-2 py-1 rounded-full text-center text-xs font-semibold ${
                            therapist.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {therapist.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-blue-600 hover:underline cursor-pointer text-center items-center flex justify-center">
                        <div className="flex gap-2 items-center">
                          <button
                            onClick={() =>
                              navigate(`/therapist/view/${therapist.id}`)
                            }
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/therapist/add/${therapist.id}`)
                            }
                          >
                            <Edit className="w-4 h-4 text-green-500" />
                          </button>
                          <button
                            onClick={() => handleDeleteTherapist(therapist.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
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
                Prev
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
        </>
      )}
    </div>
  );
};

export default TherapistPage;
