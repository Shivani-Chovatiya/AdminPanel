import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiX } from "react-icons/fi";

const ReviewPage = () => {
  const contents = [
    {
      name: "ABC",
      rating: 5,
      title: "Daily Horoscope",
      status: "Approve",
      duedate: "12/03/2026",
    },
    {
      name: "ABC",
      rating: 5,
      title: "Weekly Prediction",
      status: "Reject",
      duedate: "12/03/2026",
    },
    {
      name: "ABC",
      rating: 5,
      title: "Weekly Prediction",
      status: "Pending",
      duedate: "12/03/2026",
    },
    {
      name: "ABC",
      rating: 5,
      title: "Love Tips",
      status: "Approve",
      duedate: "12/03/2026",
    },
  ];
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedData, setSelectedData] = useState();
  const [status, setStatus] = useState("");
  const itemsPerPage = 10;

  const filteredData = contents.filter((u) =>
    `${u.title} ${u.status}`.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);
  useEffect(() => {
    if (open && selectedData) {
      setComment(selectedData.title);
      setStatus(selectedData.status || "");
    }
  }, [open, selectedData]);
  const handleSaveNote = () => {
    console.log("");
  };
  return (
    <div className=" ">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <input
          type="text"
          placeholder="Search Data..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full md:w-64"
        />
        {/* <button
          onClick={() => setOpen(true)}
          className="bg-orange-500 p-3 text-white rounded-xl"
        >
          + Add Review
        </button> */}
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">Name</th>
              <th className="p-2">Line</th>
              <th className="p-2">Rating</th>
              <th className="p-2">Status</th>
              <th className="p-2">Due Date</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((c, i) => (
              <tr key={i + 1} className="border-b">
                <td className="p-2">{c.name}</td>
                <td className="p-2">{c.title}</td>
                <td className="p-2">{c.rating}</td>
                <td className="p-2">
                  <span className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        c.status === "Approve"
                          ? "bg-green-500"
                          : c.status === "Pending"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    ></span>
                    {c.status}
                  </span>
                </td>{" "}
                <td className="p-2">{c.duedate}</td>
                <td className="p-2">
                  <div className="flex items-center gap-3">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => {
                        setSelectedData(c);
                        setOpen(true);
                      }}
                    >
                      <FiEdit size={18} />
                    </button>

                    <button className="text-red-500 hover:text-red-700">
                      <FiTrash2 size={18} />
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
      {open && selectedData && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[95%] max-w-xl p-6 relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-black"
            >
              <FiX size={20} />
            </button>

            <h2 className="text-lg font-semibold mb-3">Customer Review</h2>

            {/* Content */}
            <div className="text-sm space-y-3">
              <div className="space-y-4">
                <textarea
                  className="w-full border rounded-lg p-3 min-h-[120px]"
                  placeholder="Review..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  disabled
                />
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    {" "}
                    <option value="" disabled>
                      Select Status
                    </option>
                    <option value="Approve">Approve</option>
                    <option value="Reject">Reject</option>
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
    </div>
  );
};

export default ReviewPage;
