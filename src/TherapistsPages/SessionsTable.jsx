import { MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";

export default function SessionsTable({ sessions }) {
  const sessions2 = [
    {
      date: "Oct 24, 2023",
      time: "09:00 AM - 10:00 AM",
      user: "John Doe",
      type: "Video Call",
      status: "Upcoming",
    },
    {
      date: "Oct 24, 2023",
      time: "11:30 AM - 12:30 PM",
      user: "Emma Watson",
      type: "Chat Session",
      status: "Completed",
    },
    {
      date: "Oct 25, 2023",
      time: "02:00 PM - 03:00 PM",
      user: "Michael Lee",
      type: "Video Call",
      status: "Upcoming",
    },
  ];

  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const filteredSessions =
    filter === "All" ? sessions : sessions.filter((s) => s.status === filter);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = filteredSessions.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredSessions.length / rowsPerPage);
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);
  return (
    <div className="mb-16 bg-white border border-slate-200 rounded-xl shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-900">Sessions</h3>
        </div>

        {/* Tabs */}
        <div className="bg-slate-100 rounded-lg p-1 inline-flex gap-1">
          <button
            className={`${filter === "All" ? "bg-white" : ""} shadow-sm px-4 py-1.5 rounded text-xs font-bold`}
            onClick={() => setFilter("All")}
          >
            All
          </button>
          <button
            className={`${filter === "Upcoming" ? "bg-white" : ""} shadow-sm px-4 py-1.5 rounded text-xs font-bold`}
            onClick={() => setFilter("Upcoming")}
          >
            Upcoming
          </button>
          <button
            className={`${filter === "Completed" ? "bg-white" : ""} shadow-sm px-4 py-1.5 rounded text-xs font-bold`}
            onClick={() => setFilter("Completed")}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          {/* Table Head */}
          <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] ">
            <tr>
              <th className="text-center px-6 py-3">Date</th>
              <th className="text-center px-6 py-3">User</th>
              <th className="text-center px-6 py-3">Type</th>
              <th className="text-center px-6 py-3">Status</th>
              {/* <th className="text-left px-6 py-3"></th> */}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {currentData.map((session, index) => (
              <tr
                key={index}
                className="border-t border-slate-100 hover:bg-slate-50"
              >
                {/* Date */}
                {/* <td className="px-6 py-2">
                  <div className="font-semibold text-slate-900">
                    {session.date}
                  </div>
                  <div className="text-xs text-slate-500">{session.time}</div>
                </td> */}
                <td className="px-3 md:px-6 py-2 text-center">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900 text-xs md:text-base">
                      {session.date}
                    </span>
                    <span className="text-xs text-slate-500">
                      {session.time}
                    </span>
                  </div>
                </td>
                {/* User */}
                <td className="px-6 py-2 text-center gap-3">
                  <span className="font-medium text-slate-900">
                    {session.user}
                  </span>
                </td>

                {/* Type */}
                <td className="px-6 py-2 text-slate-800 text-center">
                  {session.type}
                </td>

                {/* Status */}
                <td className="px-6 py-2 text-center">
                  {session.status === "Upcoming" && (
                    <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-1 rounded">
                      UPCOMING
                    </span>
                  )}

                  {session.status === "Completed" && (
                    <span className="bg-orange-100 text-[#D14600] text-[10px] font-bold px-2 py-1 rounded">
                      COMPLETED
                    </span>
                  )}
                </td>

                {/* Action */}
                {/* <td className="px-6 py-4">
                  <MoreHorizontal size={16} className="text-slate-400" />
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className=" flex justify-between items-center p-6 border-t border-slate-100">
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
  );
}
