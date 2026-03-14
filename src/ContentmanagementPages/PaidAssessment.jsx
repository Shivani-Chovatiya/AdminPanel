import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { Activity, ArrowDown, ArrowUp, Edit, Eye, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { toast } from "react-toastify";
import Switch from "react-switch";
import Swal from "sweetalert2";

const PaidAssessment = () => {
  const [assessments, setAssessments] = useState([]);
  const [filter, setFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [sentence, setSentence] = useState("");
  const [price, setPrice] = useState("");
  const [usdPrice, setUsdPrice] = useState("");
  const [status, setStatus] = useState("Active");

  const rowsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const [stats, setStats] = useState([]);

  const fetchPaymentStats = async () => {
    try {
      const snapshot = await getDocs(collection(db, "payments"));

      let totalRevenue = 0;
      let totalUSDRevenue = 0;
      let totalSales = 0;
      let activePaidTests = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();

        if (data.paidAssessments === "PaidAssessments") {
          totalSales += 1;

          if (data.amount) {
            if (data.currency === "INR") totalRevenue += Number(data.amount);
            if (data.currency === "USD") totalUSDRevenue += Number(data.amount);
          }

          if (data.status === "active" || data.status === "completed") {
            activePaidTests += 1;
          }
        }
      });

      setStats([
        {
          label: "Total Revenue",
          value: `₹${totalRevenue}`,
          valueUSD: `$${totalUSDRevenue}`,
          change: "+0%",
          changeColor: "text-green-500",
          bgColor: "bg-green-100",
          iconBg: "bg-green-500",
          icon: <Activity className="w-5 h-5 text-blue-700" />,
        },
        // {
        //   label: "Active Paid Tests",
        //   value: activePaidTests,
        //   change: "+0%",
        //   changeColor: "text-green-500",
        //   bgColor: "bg-green-100",
        //   iconBg: "bg-green-500",
        //   icon: <Activity className="w-5 h-5 text-blue-700" />,
        // },
        // {
        //   label: "Total Sales",
        //   value: totalSales,
        //   change: "+0%",
        //   changeColor: "text-green-500",
        //   bgColor: "bg-green-100",
        //   iconBg: "bg-green-500",
        //   icon: <Activity className="w-5 h-5 text-blue-700" />,
        // },
      ]);
    } catch (error) {
      console.error("Error fetching payment stats:", error);
    }
  };
  useEffect(() => {
    fetchPaymentStats();
  }, []);
  const reports = [
    { title: "Depression", date: "Oct 12, 2023", status: "Active" },
    { title: "Anxiety", date: "Oct 10, 2023", status: "Inactive" },
    { title: "Stress", date: "Oct 15, 2023", status: "Active" },
    { title: "Depression", date: "Oct 12, 2023", status: "Active" },
    { title: "Depression", date: "Oct 12, 2023", status: "Active" },
  ];
  const fetchAssessments = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "paid_assessments"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAssessments(data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  const handleSave = async () => {
    if (!sentence || !price || !usdPrice) {
      toast.error("All fields required");
      return;
    }

    try {
      if (editingId) {
        await updateDoc(doc(db, "paid_assessments", editingId), {
          sentence,
          price,
          usdPrice,
          status,
        });

        toast.success("Assessment Updated");
      } else {
        await addDoc(collection(db, "paid_assessments"), {
          sentence,
          price,
          usdPrice,
          status,
          createdAt: serverTimestamp(),
        });

        toast.success("Assessment Added");
      }

      setSentence("");
      setPrice("");
      setUsdPrice("");
      setStatus("Active");
      setEditingId(null);
      setShowModal(false);

      fetchAssessments();
    } catch (error) {
      console.log(error);
      toast.error("Operation failed");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this assessment!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "paid_assessments", id));

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Assessment has been deleted.",
          timer: 1500,
          showConfirmButton: false,
        });

        fetchAssessments();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Delete failed",
        });
      }
    }
  };

  const handleEdit = (item) => {
    setSentence(item.sentence);
    setPrice(item.price);
    setUsdPrice(item.usdPrice || "");
    setStatus(item.status);
    setEditingId(item.id);
    setShowModal(true);
  };

  const filteredReports =
    filter === "All"
      ? assessments
      : assessments.filter((item) => item.status === filter);
  const uniqueTitles = ["All", ...new Set(reports.map((r) => r.status))];
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = filteredReports.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredReports.length / rowsPerPage);

  return (
    <div>
      <div className="flex flex-row justify-between gap-5 p-2 md:p-6">
        <h1 className="text-black font-bold text-xl">Paid Assessment</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary text-white px-4 py-2 rounded-xl"
        >
          + Add New Assessment
        </button>
      </div>
      <div className="justify-center items-center flex p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="flex flex-col p-6 gap-3  bg-white border border-primary shadow-sm rounded-xl"
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
              <div className="flex flex-col gap-2 items-baseline justify-between">
                <span className="text-black text-3xl font-bold">
                  {stat.value}
                </span>
                <span className="text-black text-3xl font-bold">
                  {stat.valueUSD}
                </span>
                {/* <span className={`text-xs font-bold ${stat.changeColor}`}>
                  {stat.change}
                </span> */}
              </div>
            </div>
          ))}
        </div>
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
          <table className="w-full bg-white border rounded-lg">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 text-center  text-xs">Sentence</th>
                <th className="p-3 text-center  text-xs">Indian Price</th>
                <th className="p-3 text-center  text-xs">USD Price</th>
                <th className="p-3 text-center  text-xs">Status</th>
                <th className="p-3 text-center  text-xs">Action</th>
              </tr>
            </thead>

            <tbody>
              {currentData.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="text-center p-3  text-xs">{item.sentence}</td>
                  <td className="text-center p-3  text-xs">₹{item.price}</td>
                  <td className="text-center p-3  text-xs">${item.usdPrice}</td>
                  <td className="text-center p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        item.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="text-center flex justify-center gap-3 p-3">
                    <button onClick={() => handleEdit(item)}>
                      <Edit className="w-5 text-green-600" />
                    </button>

                    <button onClick={() => handleDelete(item.id)}>
                      <Trash2 className="w-5 text-red-600" />
                    </button>
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
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl ">
            <h2 className="text-lg font-bold mb-4">
              {editingId ? "Edit Assessment" : "Add Assessment"}
            </h2>

            <input
              type="text"
              placeholder="Sentence"
              value={sentence}
              onChange={(e) => setSentence(e.target.value)}
              className="border w-full p-2 mb-3 rounded"
            />

            {/* <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border w-full p-2 mb-3 rounded"
            /> */}
            {/* INR Price */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">
                Price Per Session (Indian)
              </label>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  ₹
                </span>

                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  onWheel={(e) => e.target.blur()}
                  placeholder="Enter Price"
                  className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>

            {/* USD Price */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">
                Price Per Session (USD)
              </label>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>

                <input
                  type="number"
                  value={usdPrice}
                  onChange={(e) => setUsdPrice(e.target.value)}
                  onWheel={(e) => e.target.blur()}
                  placeholder="Enter Price"
                  className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span>Status:</span>
              <input
                type="checkbox"
                checked={status === "Active"}
                onChange={(e) =>
                  setStatus(e.target.checked ? "Active" : "Inactive")
                }
              />
              <span>{status}</span>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="bg-primary text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaidAssessment;
