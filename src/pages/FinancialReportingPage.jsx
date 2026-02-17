import React, { useState } from "react";
import StatCard from "../components/StatCard";
import RevenueAnalysis from "../FinancialPages/RevenueAnalysis";
import ExpensesManagement from "../FinancialPages/ExpensesManagement";
import { FiX } from "react-icons/fi";

const FinancialReportingPage = () => {
  const expensesData = [
    {
      id: 1,
      title: "Server Hosting",
      category: "Infrastructure",
      notes: "AWS monthly charges",
      amount: 3000,
      date: "25/12/2025",
    },
    {
      id: 2,
      title: "Marketing Campaign",
      category: "Marketing",
      notes: "Social media ads",
      amount: 4000,
      date: "25/12/2025",
    },
    {
      id: 3,
      title: "Office Rent",
      category: "Infrastructure",
      notes: "Monthly office rent",
      amount: 5000,
      date: "25/12/2025",
    },
    {
      id: 4,
      title: "Server Hosting",
      category: "Marketing",
      notes: "AWS monthly charges",
      amount: 1000,
      date: "25/12/2025",
    },
    {
      id: 5,
      title: "Marketing Campaign",
      category: "Marketing",
      notes: "Monthly office rent",
      amount: 2000,
      date: "25/12/2025",
    },
    {
      id: 6,
      title: "Server Hosting",
      category: "Infrastructure",
      notes: "Social media ads",
      amount: 2500,
      date: "25/12/2025",
    },
    {
      id: 7,
      title: "Office Rent",
      category: "Festival",
      notes: "AWS monthly charges",
      amount: 6000,
      date: "25/12/2025",
    },
    {
      id: 8,
      title: "Marketing Campaign",
      category: "Infrastructure",
      notes: "Social media ads",
      amount: 3000,
      date: "25/12/2025",
    },
    {
      id: 9,
      title: "Server Hosting",
      category: "Marketing",
      notes: "AWS monthly charges",
      amount: 4000,
      date: "25/12/2025",
    },
    {
      id: 10,
      title: "Marketing Campaign",
      category: "Operations",
      notes: "Social media ads",
      amount: 4500,
      date: "25/12/2025",
    },
  ];

  const [option, setOption] = useState("Expenses Management");
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");

  const handleSaveNote = () => {
    console.log("");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Financial Reporting</h1>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div></div>
        <button
          onClick={() => setOpen(true)}
          className="bg-orange-500 p-3 text-white rounded-xl"
        >
          + Add Expenses
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Revenue" value="₹85,000" />
        <StatCard title="Total Expenses" value="₹1,850,000" />
        <StatCard title="Net Profit" value="3162" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border rounded-xl p-3 m-4 bg-white">
        <button
          onClick={() => setOption("Expenses Management")}
          className={`${option === "Expenses Management" ? "bg-orange-500 text-white" : "bg-gray-200 text-black"} p-3 text-white rounded-xl`}
        >
          Expenses Management
        </button>{" "}
        <button
          onClick={() => setOption("Revenue Analysis")}
          className={`${option === "Revenue Analysis" ? "bg-orange-500 text-white" : "bg-gray-200 text-black"} p-3 text-white rounded-xl`}
        >
          Revenue Analysis
        </button>
      </div>
      {option === "Revenue Analysis" ? (
        <RevenueAnalysis />
      ) : (
        <ExpensesManagement expensesData={expensesData} />
      )}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[95%] max-w-xl p-6 relative">
            <button
              onClick={() => {
                setTitle("");
                setNote("");
                setCategory("");
                setDate("");
                setAmount("");
                setOpen(false);
              }}
              className="absolute right-4 top-4 text-gray-500 hover:text-black"
            >
              <FiX size={20} />
            </button>

            <h2 className="text-lg font-semibold mb-3">
              Add Infrastructure Expense
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

export default FinancialReportingPage;
