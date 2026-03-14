import { doc, getDoc } from "firebase/firestore";
import { Download } from "lucide-react";
import React, { useEffect, useState } from "react";
import { db } from "../../config/firebase";

const AssessmentPage = ({ user }) => {
  const reportData = [
    { name: "Mental Health", status: "Free", actions: "View" },
    { name: "Self Harm", status: "Paid", actions: "View" },
    // Add more rows as needed
  ];
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [reports, setReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    const loadAssessments = async () => {
      if (!user) return;
      setLoading(true);
      let combined = [];

      // FREE assessments
      if (user?.selectedSymptoms) {
        for (const id of user.selectedSymptoms) {
          const snap = await getDoc(doc(db, "assessments", id));
          if (snap.exists()) {
            combined.push({
              id,
              name: snap.data().sentence,
              status: "Free",
            });
          }
        }
      }

      // PAID assessments
      if (user?.purchasedAssessments) {
        for (const id of user.purchasedAssessments) {
          const snap = await getDoc(doc(db, "paid_assessments", id));
          if (snap.exists()) {
            combined.push({
              id,
              name: snap.data().sentence,
              status: "Paid",
              price: snap.data().price,
              usdPrice: snap.data().usdPrice,
            });
          }
        }
      }

      setReports(combined);
      setLoading(false);
    };

    loadAssessments();
  }, [user]);

  const filteredReports =
    filter === "All" ? reports : reports.filter((r) => r.status === filter);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = filteredReports.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredReports.length / rowsPerPage);

  return (
    <div className="">
      {/*<div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">
     
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-24">
            <img
              src="https://i.pravatar.cc/150?img=3"
              alt="Profile"
              className="w-full h-full rounded-xl border-4 border-gray-50 shadow-sm object-cover"
            />
            
            <div className="absolute bottom-0 right-0 bg-green-500 border-4 border-white rounded-full px-2 py-0.5 flex items-center justify-center text-white text-xs font-bold uppercase">
              Online
            </div>
          </div>

        
          <div className="flex flex-col gap-1">
            <h2 className="text-gray-900 font-bold text-xl md:text-2xl">
              {user?.fullName}
            </h2>
          
          </div>
        </div> 
      </div>*/}
      <div className="p-2 md:p-3">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Standard Report History
          </h2>
          {/* <button className="text-orange-600 font-medium hover:underline">
            View All Parameters
          </button> */}

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded-lg px-3 py-1 text-sm"
          >
            <option value="All">All</option>
            <option value="Free">Free</option>
            <option value="Paid">Paid</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                  Assessment Name
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                  Result Status
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                  Price
                </th>
                {/* <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                  Actions
                </th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="2" className="text-center py-6 text-gray-500">
                    Loading assessments...
                  </td>
                </tr>
              ) : currentData.length === 0 ? (
                <tr>
                  <td colSpan="2" className="text-center py-6 text-gray-500">
                    No assessments found
                  </td>
                </tr>
              ) : (
                currentData.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800 text-xs">
                      {report.name}
                    </td>

                    <td
                      className={`px-4 py-3 text-xs ${
                        report.status === "Paid"
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {report.status}
                    </td>

                    <td
                      className={`px-4 py-3 text-xs ${
                        report.status === "Paid"
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {report.status === "Paid"
                        ? user.locationData.country === "India"
                          ? `₹${report.price}`
                          : `$${report.usdPrice}`
                        : 0}
                    </td>

                    {/* <td className="px-4 py-3">
                    <button className="text-blue-600 hover:underline">
        <Download className="size-5" />
      </button>
                  </td> */}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between flex-col md:flex-row gap-3 p-3 md:p-6 border-t border-slate-200">
          <div>
            <h1 className="font-bold text-xs text-black">
              Total Data: {filteredReports.length}
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
      </div>
    </div>
  );
};

export default AssessmentPage;
