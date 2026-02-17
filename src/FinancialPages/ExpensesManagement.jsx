import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiX } from "react-icons/fi";

const ExpensesManagement = ({ expensesData }) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [selectedData, setSelectedData] = useState();
  const itemsPerPage = 10;

  const filteredData = expensesData.filter((u) =>
    `${u.title} ${u.category}`.toLowerCase().includes(search.toLowerCase()),
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
    if (isEdit && selectedData) {
      setTitle(selectedData.title);
      setCategory(selectedData.category || "");
      setAmount(selectedData.amount);
      setNote(selectedData.notes);
      if (selectedData.date) {
        const [day, month, year] = selectedData.date.split("/");
        setDate(`${year}-${month}-${day}`);
      }
    }
  }, [isEdit, selectedData]);
  const handleSaveNote = () => {
    console.log("");
  };
  return (
    <div className="bg-white rounded-2xl p-3">
      {" "}
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
              <th className="p-2">Title</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Category</th>
              <th className="p-2">Note</th>
              <th className="p-2">Date</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((c, i) => (
              <tr key={i} className="border-b">
                <td className="p-2">{c.title}</td>
                <td className="p-2">{c.amount}</td>
                <td className="p-2">{c.category}</td>
                <td className="p-2">{c.notes}</td>
                <td className="p-2">{c.date}</td>
                <td className="p-2">
                  <div className="flex items-center gap-3">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => {
                        setSelectedData(c);
                        setIsEdit(true);
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
      {isEdit && selectedData && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[95%] max-w-xl p-6 relative">
            <button
              onClick={() => {
                setTitle("");
                setNote("");
                setCategory("");
                setDate("");
                setAmount("");
                setIsEdit(false);
              }}
              className="absolute right-4 top-4 text-gray-500 hover:text-black"
            >
              <FiX size={20} />
            </button>

            <h2 className="text-lg font-semibold mb-3">
              Update Infrastructure Expense
            </h2>

            {/* Content */}
            <div className="text-sm space-y-3">
              <div className="space-y-4">
                <input
                  className="w-full border rounded-lg p-3 "
                  placeholder="Add Title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <input
                  className="w-full border rounded-lg p-3 "
                  placeholder="Add Amount..."
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <input
                  className="w-full border rounded-lg p-3 "
                  placeholder="Select Date.."
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Select Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    {" "}
                    <option value="" disabled>
                      Select
                    </option>
                    <option value="Infrastructure">Infrastructure</option>{" "}
                    <option value="Marketing">Marketing</option>{" "}
                    <option value="Operations">Operations</option>
                  </select>
                </div>
                <input
                  className="w-full border rounded-lg p-3 "
                  placeholder="Add Notes.."
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpensesManagement;
