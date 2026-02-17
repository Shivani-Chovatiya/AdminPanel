import React, { useEffect, useState } from "react";
import { FiEye, FiDownload, FiX, FiEdit } from "react-icons/fi";

const Info = ({ label, value }) => (
  <div className="flex justify-between border-b pb-2">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

const TicketSupportPage = () => {
  const [open, setOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [userName, setUserName] = useState("");
  const [issueType, setIssueType] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const ticketSupportData = [
    {
      id: 1,
      ticketId: "INV-2025-001",
      userName: "Alyvia Kelley",
      issueType: "Payment Issue",
      dueDate: "25/12/2025",
      assignedTo: "Support Team",
      status: "Open",
    },
    {
      id: 2,
      ticketId: "INV-2025-002",
      userName: "Jaiden Nixon",
      issueType: "Therapist Unavailable",
      dueDate: "25/12/2025",
      assignedTo: "Admin",
      status: "Pending",
    },
    {
      id: 3,
      ticketId: "INV-2025-003",
      userName: "Ace Foley",
      issueType: "Payment Issue",
      dueDate: "25/12/2025",
      assignedTo: "Support Team",
      status: "Open",
    },
    {
      id: 4,
      ticketId: "INV-2025-004",
      userName: "Nikolai Schmidt",
      issueType: "Therapist Unavailable",
      dueDate: "25/12/2025",
      assignedTo: "Admin",
      status: "Close",
    },
    {
      id: 5,
      ticketId: "INV-2025-005",
      userName: "Clayton Charles",
      issueType: "Payment Issue",
      dueDate: "25/12/2025",
      assignedTo: "Support Team",
      status: "Open",
    },
    {
      id: 6,
      ticketId: "INV-2025-006",
      userName: "Prince Chen",
      issueType: "Therapist Unavailable",
      dueDate: "25/12/2025",
      assignedTo: "Admin",
      status: "Close",
    },
    {
      id: 7,
      ticketId: "INV-2025-007",
      userName: "Reece Duran",
      issueType: "Payment Issue",
      dueDate: "25/12/2025",
      assignedTo: "Support Team",
      status: "Open",
    },
    {
      id: 8,
      ticketId: "INV-2025-008",
      userName: "Anastasia Mcdaniel",
      issueType: "Therapist Unavailable",
      dueDate: "25/12/2025",
      assignedTo: "Admin",
      status: "Pending",
    },
    {
      id: 9,
      ticketId: "INV-2025-009",
      userName: "Melvin Boyle",
      issueType: "Payment Issue",
      dueDate: "25/12/2025",
      assignedTo: "Support Team",
      status: "Close",
    },
    {
      id: 10,
      ticketId: "INV-2025-010",
      userName: "Kailee Thomas",
      issueType: "Therapist Unavailable",
      dueDate: "25/12/2025",
      assignedTo: "Admin",
      status: "Pending",
    },
  ];

  const handleSaveNote = () => {
    console.log("Saved note:", note);
  };

  const filteredTicketSupportData = ticketSupportData.filter((u) =>
    `${u.name} ${u.email} ${u.phone}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredTicketSupportData.length / itemsPerPage);

  const paginatedTicketSupportData = filteredTicketSupportData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  useEffect(() => {
    if (open && selectedData) {
      setUserName(selectedData.userName);
      setAssignedTo(selectedData.assignedTo || "");
      setIssueType(selectedData.issueType);
      setStatus(selectedData.status);
      if (selectedData.dueDate) {
        const [day, month, year] = selectedData.dueDate.split("/");
        setDueDate(`${year}-${month}-${day}`);
      }
    }
  }, [open, selectedData]);
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);
  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold mb-4">Ticket/Support</h1>
      <div className="bg-white p-6 rounded-2xl shadow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <input
            type="text"
            placeholder="Search Data..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-4 py-2 w-full md:w-64"
          />
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left border-b">
                <th className="p-2">Ticket Id</th>
                <th className="p-2">User Name</th>
                <th className="p-2">Issue Type</th>
                <th className="p-2">Due Date</th>
                <th className="p-2">Assigned To</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTicketSupportData.map((u, i) => (
                <tr key={i} className="border-b">
                  <td className="p-2">{u.ticketId}</td>
                  <td className="p-2">{u.userName}</td>
                  <td className="p-2">{u.issueType}</td>
                  <td className="p-2">{u.dueDate}</td>
                  <td className="p-2">{u.assignedTo}</td>
                  <td className="p-2">
                    <span className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          u.status === "Open"
                            ? "bg-green-500"
                            : u.status === "Pending"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      ></span>
                      {u.status}
                    </span>
                  </td>
                  <td className="p-2">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          setSelectedData(u);
                          setOpen(true);
                        }}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FiEdit size={18} />
                      </button>

                      <button className="text-green-500 hover:text-green-700">
                        <FiDownload size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end mt-4 gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Prev
          </button>

          <span className="px-3 py-1 border rounded bg-orange-500 text-white">
            {currentPage} / {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>

        {open && selectedData && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-[95%] max-w-xl p-6 relative">
              <button
                onClick={() => setOpen(false)}
                className="absolute right-4 top-4 text-gray-500 hover:text-black"
              >
                <FiX size={20} />
              </button>

              <h2 className="text-lg font-semibold mb-3">
                Ticket Details - {selectedData.ticketId}
              </h2>

              <div className="text-sm space-y-3">
                <div className="space-y-4">
                  <div>
                    {" "}
                    <label className="block mb-1 text-sm font-medium">
                      User Name
                    </label>
                    <input
                      className="w-full border rounded-lg p-3 "
                      placeholder="Add User Name..."
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Issue Type
                    </label>
                    <input
                      className="w-full border rounded-lg p-3 "
                      placeholder="Add Issue Type..."
                      value={issueType}
                      onChange={(e) => setIssueType(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Created Date
                    </label>
                    <input
                      className="w-full border rounded-lg p-3 "
                      placeholder="Select Date.."
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Select Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    >
                      <option value="" disabled>
                        Select Status
                      </option>
                      <option value="Open">Open</option>{" "}
                      <option value="Close">Close</option>{" "}
                      <option value="Pending">Pending</option>
                    </select>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveNote}
                      className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>{" "}
    </div>
  );
};

export default TicketSupportPage;
