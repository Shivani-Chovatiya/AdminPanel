import React, { useState } from "react";

const FuturePrediction = () => {
  const sessionsData = [
    {
      therapist: "Dr. Marcus Sterling",
      date: "Oct 24, 2023",
      status: "Completed",
      type: "Cognitive Behavioral Therapy",
      time: "02:30 PM - 03:30 PM (EST)",
    },
    {
      therapist: "Dr. Elena Rodriguez",
      date: "Oct 31, 2023",
      status: "Scheduled",
      type: "Family Counseling",
      time: "10:00 AM - 11:00 AM (EST)",
    },
    {
      therapist: "Dr. Marcus Sterling",
      date: "Oct 17, 2023",
      status: "Cancelled",
      type: "Cognitive Behavioral Therapy",
      time: "02:30 PM - 03:30 PM (EST)",
    },
    {
      therapist: "Dr. Marcus Sterling",
      date: "Oct 10, 2023",
      status: "Completed",
      type: "Cognitive Behavioral Therapy",
      time: "02:30 PM - 03:30 PM (EST)",
    },
    // Add more sessions here...
  ];

  const [statusFilter, setStatusFilter] = useState("All");

  const filteredSessions =
    statusFilter === "All"
      ? sessionsData
      : sessionsData.filter((s) => s.status === statusFilter);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 3;
  const [activeTab, setActiveTab] = useState(1);
  // Calculate pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = filteredSessions.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredSessions.length / rowsPerPage);

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
      <div className="p-6 bg-white rounded-xl shadow-md w-full max-w-6xl mx-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Session History
        </h2>

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
          <input
            type="text"
            placeholder="Filter by therapist or date..."
            className="px-4 py-2 border border-gray-300 rounded-md w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="All">All</option>
            <option value="Completed">Completed</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Cancelled">Cancelled</option>
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
                  Session Date & Time
                </th>
                <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700">
                  Status
                </th>
                {/* <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Action
                </th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentData.map((session, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-2 py-2 text-xs text-gray-800">
                    {session.therapist}
                  </td>
                  <td className="px-2 py-2 text-xs text-gray-800">
                    <div>{session.date}</div>
                    <div className="text-gray-500 text-sm">{session.time}</div>
                  </td>
                  <td
                    className={`px-2 py-2 text-xs font-medium ${
                      session.status === "Completed"
                        ? "text-green-600"
                        : session.status === "Scheduled"
                          ? "text-blue-600"
                          : "text-red-600"
                    }`}
                  >
                    {session.status}
                  </td>
                  {/* <td className="px-4 py-3 text-blue-600 hover:underline cursor-pointer">
                    {session.type}
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between flex-col md:flex-row gap-3 p-3 md:p-6 border-t border-slate-200">
          <div>
            <h1 className="font-bold text-xs text-black">
              Total Data: {filteredSessions.length}
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

export default FuturePrediction;
