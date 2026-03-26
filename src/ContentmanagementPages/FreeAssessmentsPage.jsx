import { Activity, ArrowDown, ArrowUp, Edit, Eye, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  where,
  query,
} from "firebase/firestore";
import { db } from "../config/firebase";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const FreeAssessmentsPage = () => {
  const stats = [
    {
      label: "Active Categories",
      value: 14,
      change: "+80%",
      changeColor: "text-green-500",
      bgColor: "bg-green-100",
      iconBg: "bg-green-500",
      icon: <Activity className="w-4 h-4 text-green-700" />,
    },
    {
      label: "Total Questions",
      value: 186,
      change: "+12%",
      changeColor: "text-blue-500",
      bgColor: "bg-blue-100",
      iconBg: "bg-blue-500",
      icon: <ArrowUp className="w-4 h-4 text-blue-600" />,
    },
    {
      label: "Assessments Completed",
      value: "2.4k",
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
  const [assessments, setAssessments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    sentence: "",
    status: "Active",
    id: "",
  });

  const fetchAssessments = async () => {
    const snapshot = await getDocs(collection(db, "assessments"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setAssessments(data);
  };
  useEffect(() => {
    fetchAssessments();
  }, []);
  const filteredReports =
    filter === "All"
      ? reports
      : reports.filter((report) => report.title === filter);

  const uniqueTitles = ["All", ...new Set(reports.map((r) => r.title))];

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [activeTab, setActiveTab] = useState(1);
  // Calculate pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = assessments.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(assessments.length / rowsPerPage);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.sentence.trim()) return;
    console.log(formData);
    // 🔍 Check duplicate title
    const q = query(
      collection(db, "assessments"),
      where("sentence", "==", formData.sentence.trim()),
    );

    const querySnapshot = await getDocs(q);

    // ❌ If adding new & title exists
    if (!formData.id && !querySnapshot.empty) {
      toast.error("Assessment already exists!");
      return;
    }

    // ❌ If editing & title exists in another doc
    if (formData.id && !querySnapshot.empty) {
      const isSameDoc = querySnapshot.docs.some(
        (docItem) => docItem.id === formData.id,
      );

      if (!isSameDoc) {
        toast.error("Assessment already exists!");
        return;
      }
    }

    try {
      if (editingId) {
        await updateDoc(doc(db, "assessments", editingId), formData);
        Swal.fire("Updated!", "Assessment updated.", "success");
      } else {
        await addDoc(collection(db, "assessments"), formData);
        Swal.fire("Saved!", "Assessment added.", "success");
      }

      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ sentence: "", status: "Active", id: "" });
      fetchAssessments();
    } catch (error) {
      console.error(error);
    }
  };
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      await deleteDoc(doc(db, "assessments", id));
      fetchAssessments();
    }
  };
  const handleEdit = (item) => {
    setFormData({
      sentence: item.sentence,
      status: item.status,
      id: item.id,
    });
    setEditingId(item.id);
    setIsModalOpen(true);
  };
  return (
    <div>
      <div className="flex flex-row justify-between gap-5 p-2 md:p-6">
        <h1 className="text-black font-bold text-xl">Assessment Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary rounded-2xl px-2 py-1 text-white text-xs md:text-sm"
        >
          + Add New Assessment
        </button>
      </div>
      {/* 
      <div className="flex flex-col md:flex-row justify-center gap-6 p-4 md:p-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="flex flex-col p-6 gap-3 w-full max-w-xs bg-white border border-orange-50 shadow-sm rounded-xl"
          >
           
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
      </div> */}
      <div className="p-4 md:p-6">
        {/* <div className="flex flex-row justify-between items-center mb-4 gap-4">
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
        </div> */}

        <div className="overflow-x-auto ">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700">
                  Title
                </th>
                <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700">
                  Status
                </th>{" "}
                <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="text-center px-4 py-2  text-xs">
                    {item.sentence}
                  </td>
                  <td className="text-center px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        item.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="text-center px-4 py-2 flex justify-center gap-3">
                    <button onClick={() => handleEdit(item)}>
                      <Edit className="w-5 h-5 text-green-600" />
                    </button>
                    <button onClick={() => handleDelete(item.id)}>
                      <Trash2 className="w-5 h-5 text-red-600" />
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
              Total Data: {assessments.length}
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <h2 className="text-lg font-bold mb-4">
              {editingId ? "Edit Assessment" : "Add Assessment"}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Enter sentence"
                value={formData.sentence}
                onChange={(e) =>
                  setFormData({ ...formData, sentence: e.target.value })
                }
                className="border px-3 py-2 rounded-md"
                required
              />

              <div className="flex items-center gap-3">
                <span>Status:</span>
                <input
                  type="checkbox"
                  checked={formData.status === "Active"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.checked ? "Active" : "Inactive",
                    })
                  }
                />
                <span>{formData.status}</span>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ sentence: "", status: "Active", id: "" });
                    setIsModalOpen(false);
                  }}
                  className="px-4 py-2 bg-gray-300 rounded-md"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FreeAssessmentsPage;
