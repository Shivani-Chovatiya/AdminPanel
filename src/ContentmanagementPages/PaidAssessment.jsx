import { Activity, ArrowDown, ArrowUp, Edit, Eye, Trash2 } from "lucide-react";
import React, { useState } from "react";

const PaidAssessment = () => {
  const stats = [
    {
      label: "Total Revenue",
      value: "$45,200",
      change: "+80%",
      changeColor: "text-green-500",
      bgColor: "bg-green-100",
      iconBg: "bg-green-500",
      icon: <Activity className="w-4 h-4 text-green-700" />,
    },
    {
      label: "Active Paid Tests",
      value: 186,
      change: "+12%",
      changeColor: "text-blue-500",
      bgColor: "bg-blue-100",
      iconBg: "bg-blue-500",
      icon: <ArrowUp className="w-4 h-4 text-blue-600" />,
    },
    {
      label: "Total Sales",
      value: "1042",
      change: "-5%",
      changeColor: "text-red-500",
      bgColor: "bg-red-100",
      iconBg: "bg-red-500",
      icon: <ArrowDown className="w-4 h-4 text-primary" />,
    },
  ];

  const reports = [
    { title: "Depression", date: "Oct 12, 2023", status: "Active" },
    { title: "Anxiety", date: "Oct 10, 2023", status: "Inactive" },
    { title: "Stress", date: "Oct 15, 2023", status: "Active" },
    { title: "Depression", date: "Oct 12, 2023", status: "Active" },
    { title: "Depression", date: "Oct 12, 2023", status: "Active" },
  ];
  const [filter, setFilter] = useState("All");

  const filteredReports =
    filter === "All"
      ? reports
      : reports.filter((report) => report.title === filter);

  const uniqueTitles = ["All", ...new Set(reports.map((r) => r.title))];

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 3;
  const [activeTab, setActiveTab] = useState(1);
  // Calculate pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = filteredReports.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredReports.length / rowsPerPage);

  return (
    <div>
      <div className="flex flex-row justify-between gap-5 p-2 md:p-6">
        <h1 className="text-black font-bold text-xl">Paid Assessment</h1>
        <button className="bg-primary rounded-2xl px-2 py-1 text-white text-xs md:text-sm">
          + Add New Assessment
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-6 p-4 md:p-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="flex flex-col p-6 gap-3 w-full max-w-xs bg-white border border-orange-50 shadow-sm rounded-xl"
          >
            {/* Label + Icon */}
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm font-medium">
                  {stat.label}
                </span>
              </div>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-lg ${stat.bgColor}`}
              >
                {stat.icon}
              </div>
            </div>

            {/* Value + Change */}
            <div className="flex flex-row items-baseline justify-between">
              <span className="text-black text-3xl font-bold">
                {stat.value}
              </span>
              <span className={`text-xs font-bold ${stat.changeColor}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 md:p-6">
        <div className="flex flex-row justify-between items-center mb-4 gap-4">
          <h2 className="text-xl font-bold text-black">Reports</h2>
          <select
            className="border px-3 py-2 rounded-md text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {uniqueTitles.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto ">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Title
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Date
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>{" "}
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((report, idx) => (
                <tr
                  key={idx}
                  className="border-t border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2 text-sm text-gray-900">
                    {report.title}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {report.date}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        report.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {report.status}
                    </span>
                  </td>{" "}
                  <td className="  gap-3 px-2 py-2 text-center text-sm  ">
                    <div className="flex justify-center items-center gap-3">
                      <button>
                        <Eye className="w-5 h-5 text-blue-600" />
                      </button>
                      <button>
                        <Edit className="w-5 h-5 text-green-600" />
                      </button>
                      <button>
                        <Trash2 className="w-5 h-5 text-red-700" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mb-16 flex items-center justify-between flex-row gap-3 p-3 md:p-6 border-t border-slate-200">
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
    </div>
  );
};

export default PaidAssessment;
