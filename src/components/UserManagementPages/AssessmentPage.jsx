import { Download } from "lucide-react";
import React from "react";

const AssessmentPage = () => {
  const reportData = [
    { name: "Mental Health", status: "Free", actions: "View" },
    { name: "Self Harm", status: "Paid", actions: "View" },
    // Add more rows as needed
  ];

  return (
    <div className="">
      <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">
        {/* Profile Info */}
        <div className="flex items-center gap-4">
          {/* Profile Image with status */}
          <div className="relative w-24 h-24">
            <img
              src="https://i.pravatar.cc/150?img=3"
              alt="Profile"
              className="w-full h-full rounded-xl border-4 border-gray-50 shadow-sm object-cover"
            />
            {/* Status badge */}
            <div className="absolute bottom-0 right-0 bg-green-500 border-4 border-white rounded-full px-2 py-0.5 flex items-center justify-center text-white text-xs font-bold uppercase">
              Online
            </div>
          </div>

          {/* Name & Details */}
          <div className="flex flex-col gap-1">
            <h2 className="text-gray-900 font-bold text-xl md:text-2xl">
              John Doe
            </h2>
            <div className="flex items-center gap-2 text-gray-500 text-sm md:text-base">
              <div className="w-3 h-2 bg-gray-400"></div>
              <span>Software Engineer at Company</span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-2 md:p-3">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Standard Report History
          </h2>
          <button className="text-orange-600 font-medium hover:underline">
            View All Parameters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Assessment Name
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Result Status
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reportData.map((report, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-800">{report.name}</td>
                  <td
                    className={`px-4 py-3 font-medium ${report.status === "Paid" ? "text-green-600" : "text-gray-600"}`}
                  >
                    {report.status}
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-blue-600 hover:underline">
                      <Download className="size-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AssessmentPage;
