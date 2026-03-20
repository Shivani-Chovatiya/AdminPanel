import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { db } from "../config/firebase";
import { Edit, Trash2 } from "lucide-react";

const FuturePredictionQuestion = () => {
  const [type, setType] = useState("1 Credits");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    question: "",
    credits: "",
    category: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Calculate pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentquestions = questions.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(questions.length / rowsPerPage);
  useEffect(() => {
    setCurrentPage(1); // Reset to first page when type changes
  }, [type]);
  const fetchquestions = async () => {
    const q = query(
      collection(db, "predictionQuestions"),
      where("credits", "==", Number(type.split(" ")[0])),
    );

    const querySnapshot = await getDocs(q);

    const questionsList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setQuestions(questionsList);
  };

  useEffect(() => {
    fetchquestions();
  }, [type]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const setCredits = () => {
    if (type === "1 Credits") {
      setFormData({ ...formData, credits: "1" });
    } else if (type === "2 Credits") {
      setFormData({ ...formData, credits: "2" });
    } else if (type === "3 Credits") {
      setFormData({ ...formData, credits: "3" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.question.trim()) {
      toast.error("Question cannot be empty");
      return;
    }
    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }
    try {
      if (isEditMode) {
        // Update existing question
        const questionRef = doc(db, "predictionQuestions", selectedQuestionId);
        await updateDoc(questionRef, {
          question: formData.question,
          credits: Number(formData.credits),
          type: type,
          category: formData.category,
        });

        toast.success("Question updated successfully");
      } else {
        // Add new question
        await addDoc(collection(db, "predictionQuestions"), {
          question: formData.question,
          credits: Number(formData.credits),
          type: type,
          category: formData.category,
          createdAt: serverTimestamp(),
        });

        toast.success("Question added successfully");
      }

      setFormData({ question: "", credits: "", category: "" });
      setIsModalOpen(false);
      setIsEditMode(false);
      setSelectedQuestionId(null);
      fetchquestions();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add question");
    }
  };

  const handleEdit = (q) => {
    setFormData({
      question: q.question,
      credits: String(q.credits),
      category: q.category || "",
    });
    setSelectedQuestionId(q.id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This Question will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ea580c",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete",
    });

    if (result.isConfirmed) {
      try {
        // Delete from Firestore
        await deleteDoc(doc(db, "predictionQuestions", id));

        fetchquestions();
        Swal.fire("Deleted!", "Question has been removed.", "success");
      } catch (error) {
        console.error(error);
        Swal.fire("Error!", "Failed to delete question.", "error");
      }
    }
  };

  const renderContent = () => {
    let title = "";
    let description = "";

    switch (type) {
      case "1 Credits":
        title = "1 Credit Prediction Question";
        description =
          "Manage and curate low-cost future prediction prompts. These templates are optimized for high-volume, standard accuracy predictions.";
        break;
      case "2 Credits":
        title = "2 Credit Prediction Question";
        description =
          "Manage high-complexity prediction models for premium questions. 2-credit templates include extended data points and multi-variant analysis features.";
        break;
      case "3 Credits":
        title = "3 Credit Prediction Question";
        description =
          "Manage high-fidelity predictive modeling templates. These questions require triple credit validation for maximum accuracy and data depth.";
        break;
      default:
        break;
    }

    return (
      <div className="flex flex-col md:flex-row justify-center md:justify-between gap-5 p-2 md:p-6">
        <div>
          <h1 className="text-black font-bold text-xl">{title}</h1>
          <p className="text-gray-400 text-xs md:w-1/2">{description}</p>
        </div>
        <div className="flex justify-center items-center">
          <button
            onClick={() => {
              setCredits();
              setIsModalOpen(true);
            }}
            className="bg-primary rounded-2xl px-4 py-2 w-1/2 md:w-full text-white text-xs md:text-sm"
          >
            + Add New Question
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex flex-wrap border-b border-orange-100 px-4 sm:px-6">
        {["1 Credits", "2 Credits", "3 Credits"].map((tab) => (
          <button
            key={tab}
            onClick={() => setType(tab)}
            className={`py-2 px-3 text-xs font-semibold m-1 border border-primary rounded-xl ${
              type === tab ? "bg-primary text-white" : "text-primary"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {renderContent()}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg w-11/12 md:w-1/3 p-6">
            <h2 className="text-lg font-bold mb-4">Add New Question</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="question"
                placeholder="Enter Question"
                value={formData.question}
                onChange={handleInputChange}
                className="border px-3 py-2 rounded-md"
                required
              />
              <input
                type="number"
                name="credits"
                placeholder="Enter Credits"
                value={formData.credits}
                onChange={handleInputChange}
                className="border px-3 py-2 rounded-md"
                min={1}
                onWheel={(e) => e.target.blur()}
                required
                disabled
              />
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="border px-3 py-2 rounded-md"
                required
              >
                <option value="" disabled>
                  Select Category
                </option>
                <option value="General">General</option>
                <option value="Career">Career</option>
                <option value="Marriage">Marriage</option>
              </select>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setIsEditMode(false);
                    setFormData({ question: "", credits: "" });
                  }}
                  className="bg-gray-300 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary px-4 py-2 rounded-md text-white"
                >
                  {isEditMode ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="w-full overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          {/* Table Head */}
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-6 py-4 font-semibold text-center">Questions</th>
              <th className="px-6 py-4 font-semibold text-center">Category</th>
              <th className="px-6 py-4 font-semibold text-center">Credits</th>
              <th className="px-6 py-4 font-semibold text-right">Action</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-200">
            {currentquestions.map((q) => (
              <tr key={q.id} className="hover:bg-slate-50">
                {/* Name */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {q.question}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center text-slate-900">
                  {q.category || ""}
                </td>
                {/* Phone */}
                <td className="px-6 py-4 text-center text-slate-900">
                  {q.credits}
                </td>

                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleEdit(q)}
                    className="text-blue-600 font-medium text-xs hover:underline"
                  >
                    <Edit size={18} />
                  </button>{" "}
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="text-orange-600 font-medium text-xs hover:underline"
                  >
                    <Trash2 size={18} />
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
            Total questions: {questions.length}
          </h1>
        </div>
        <div className="flex items-center  px-6 py-4 ">
          {/* Previous */}
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="px-3 py-1 text-sm border rounded-md disabled:opacity-40"
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
            className="px-3 py-1 text-sm border rounded-md disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default FuturePredictionQuestion;
