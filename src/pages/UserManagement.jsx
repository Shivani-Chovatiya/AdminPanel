import React, { useEffect, useState } from "react";
import { FiEye, FiDownload, FiX } from "react-icons/fi";

const Info = ({ label, value }) => (
  <div className="flex justify-between border-b pb-2">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

const UserManagement = () => {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [note, setNote] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const users = [
    {
      name: "John Doe",
      email: "john@mail.com",
      status: "Active",
      phone: 1234567890,
      duedate: "12/03/2026",
    },
    {
      name: "Anna Smith",
      email: "anna@mail.com",
      status: "Pending",
      phone: 9874563210,
      duedate: "12/03/2026",
    },
    {
      name: "Mark Lee",
      email: "mark@mail.com",
      status: "Blocked",
      phone: 1598746320,
      duedate: "12/03/2026",
    },
  ];

  const handleSaveNote = () => {
    console.log("Saved note:", note);
  };

  const filteredUsers = users.filter((u) =>
    `${u.name} ${u.email} ${u.phone}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);
  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold mb-4">User Management</h1>
      <div className="bg-white p-6 rounded-2xl shadow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-4 py-2 w-full md:w-64"
          />
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left border-b">
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Status</th>
                <th className="p-2">Phone No.</th>
                <th className="p-2">Due Date</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((u, i) => (
                <tr key={i} className="border-b">
                  <td className="p-2">{u.name}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">
                    <span className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          u.status === "Active"
                            ? "bg-green-500"
                            : u.status === "Pending"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      ></span>
                      {u.status}
                    </span>
                  </td>
                  <td className="p-2">{u.phone}</td>
                  <td className="p-2">{u.duedate}</td>
                  <td className="p-2">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          setSelectedUser(u);
                          setOpen(true);
                          setActiveTab("profile");
                        }}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FiEye size={18} />
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

          {/* {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1
                ? "bg-orange-500 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))} */}
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

        {open && selectedUser && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-[95%] max-w-xl p-6 relative">
              <button
                onClick={() => setOpen(false)}
                className="absolute right-4 top-4 text-gray-500 hover:text-black"
              >
                <FiX size={20} />
              </button>

              <h2 className="text-lg font-semibold mb-3">User Details</h2>

              <div className="grid grid-cols-2 md:grid-cols-4  gap-2   p-1 mb-4">
                {["profile", "booking", "payment", "notes"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-2 rounded-full border capitalize shrink-0 text-sm ${
                      activeTab === tab
                        ? "bg-orange-500 text-white"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="text-sm space-y-3">
                {activeTab === "profile" && (
                  <>
                    <Info label="Name" value={selectedUser.name} />
                    <Info label="Email" value={selectedUser.email} />
                    <Info label="Phone" value={selectedUser.phone} />
                    <Info label="Status" value={selectedUser.status} />
                  </>
                )}

                {activeTab === "booking" && (
                  <>
                    <Info label="Name" value={selectedUser.name} />
                    <Info label="Email" value={selectedUser.email} />
                    <Info label="Phone" value={selectedUser.phone} />
                    <Info label="Booking Date" value={selectedUser.duedate} />
                    <Info label="Service" value="Astrology Session" />
                    <Info label="Mode" value="Online" />
                  </>
                )}

                {activeTab === "payment" && (
                  <>
                    <Info label="Amount" value="₹1500" />
                    <Info label="Method" value="UPI" />
                    <Info label="Status" value="Paid" />
                  </>
                )}

                {activeTab === "notes" && (
                  <div className="space-y-4">
                    <textarea
                      className="w-full border rounded-lg p-3 min-h-[120px]"
                      placeholder="Add notes..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />

                    <div className="flex justify-end">
                      <button
                        onClick={handleSaveNote}
                        className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
