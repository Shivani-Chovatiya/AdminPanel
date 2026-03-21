import { Edit, Edit2, Eye, Trash2 } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";
import Switch from "react-switch";
import JoditEditor from "jodit-react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";
import Swal from "sweetalert2";

const FAQPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [reports, setReports] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    question: "",

    date: "",
    status: "Active",
  });
  const [description, setDescription] = useState("");
  const editor = useRef(null);
  const rowsPerPage = 5;
  // Calculate pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = reports.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(reports.length / rowsPerPage);

  const fetchTips = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "faqs"));
      const tips = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReports(tips);
    } catch (error) {
      console.error("Error fetching tips:", error);
    }
  };

  useEffect(() => {
    fetchTips();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddNew = () => {
    setIsEditing(true);
    setFormData({
      id: null,
      question: "",

      date: "",
      status: "Active",
      // description: "",
    });
    setDescription("");
  };

  const handleEdit = (report) => {
    setIsEditing(true);
    setFormData(report);
    setDescription(report.answer);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This faq will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "faqs", id));

        await Swal.fire({
          title: "Deleted!",
          text: "The faq has been deleted successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        fetchTips();
      } catch (error) {
        console.error("Error deleting tip:", error);

        Swal.fire({
          title: "Error!",
          text: "Something went wrong while deleting.",
          icon: "error",
        });
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formData.id) {
        // UPDATE
        const tipRef = doc(db, "faqs", formData.id);
        await updateDoc(tipRef, {
          question: formData.question,
          answer: description,
          status: formData.status,
          updatedAt: serverTimestamp(),
        });
      } else {
        // CREATE
        await addDoc(collection(db, "faqs"), {
          question: formData.question,
          answer: description,
          status: formData.status,
          createdAt: serverTimestamp(),
        });
      }

      fetchTips(); // refresh list
      setIsEditing(false);

      setFormData({
        id: null,
        question: "",

        date: "",
        status: "Active",
        // description: "",
      });
      setDescription("");
    } catch (error) {
      console.error("Error saving tip:", error);
    }
  };

  const config = {
    readonly: false, // all options from https://xdsoft.net/jodit/docs/,
    height: 250,
    placeholder: "Start typing...",
    uploader: {
      insertImageAsBase64URI: true,
      imagesExtensions: ["jpg", "png", "jpeg", "gif"],
      filesVariableName: function () {
        return "file";
      },
      url: "/upload", // Use a dummy URL, we'll handle the upload ourselves
      isSuccess: function (resp) {
        return !resp.error;
      },
      process: function (resp) {
        return {
          files: resp.files.map((file) => file.base64),
        };
      },
      error: function (e) {
        console.log(e);
      },
    },
    buttons: ["bold", "italic", "underline", "link", "unlink", "image"],
  };
  return (
    <div>
      <div className="flex flex-row justify-between gap-5 p-2 md:p-6">
        <h1 className="text-black font-bold text-xl">FAQs</h1>
        <button
          className="bg-primary rounded-2xl px-2 py-1 text-white text-xs md:text-sm"
          onClick={handleAddNew}
        >
          + Add FAQs
        </button>
      </div>

      {isEditing && (
        // Modal overlay
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 md:p-6">
          {/* Modal content */}
          {/* <div className="bg-white rounded-lg p-6 w-full max-w-md relative"> */}
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
            {/* Close button */}
            <button
              onClick={() => setIsEditing(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <h2 className="text-lg font-bold mb-4">
              {formData.id ? "Edit FAQ" : "Add New FAQ"}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Question"
                name="question"
                value={formData.question}
                onChange={handleInputChange}
                className="border px-3 py-2 rounded-md w-full"
                required
              />

              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Status:</span>
                <Switch
                  checked={formData.status === "Active"}
                  onChange={(checked) =>
                    setFormData({
                      ...formData,
                      status: checked ? "Active" : "Inactive",
                    })
                  }
                  onColor="#22C55E"
                  offColor="#E5E7EB"
                  uncheckedIcon={false}
                  checkedIcon={false}
                  height={22}
                  width={48}
                />
                <span className="text-sm">
                  {formData.status === "Active" ? "Active" : "Inactive"}
                </span>
              </div>
              {/* <textarea
                placeholder="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="border px-3 py-2 rounded-md w-full"
                required
              /> */}
              <div>
                <JoditEditor
                  ref={editor}
                  value={description}
                  tabIndex={1} // tabIndex of textarea
                  onBlur={(newContent) => setDescription(newContent)}
                  onChange={(newContent) => {}}
                  config={config}
                />
              </div>
              <div className="flex gap-2 justify-end mt-2">
                <button
                  type="submit"
                  className="bg-primary px-4 py-2 rounded-md text-white"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-300 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="p-3 md:p-6 overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700">
                Question
              </th>
              <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700">
                Modified
              </th>
              <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700">
                Status
              </th>
              <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((report, index) => (
              <tr
                key={index}
                className="border-t border-gray-200 hover:bg-gray-50 transition"
              >
                <td className="px-2 py-2 text-center text-xs font-medium text-gray-900">
                  {report.question}
                </td>
                <td className="px-2 py-2 text-center text-xs text-gray-600">
                  {report.createdAt?.toDate().toLocaleDateString()}
                </td>
                <td className="px-2 py-2 text-center text-xs">
                  <span
                    className={`px-2 py-1 rounded-full text-center text-xs font-semibold ${
                      report.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {report.status}
                  </span>
                </td>
                <td className="  gap-3 px-2 py-2 text-center text-xs  ">
                  <div className="flex justify-center items-center gap-3">
                    {/* <button onClick={() => alert(report.description)}>
                          <Eye className="w-5 h-5 text-blue-600" />
                        </button> */}
                    <button onClick={() => handleEdit(report)}>
                      <Edit className="w-5 h-5 text-green-600" />
                    </button>
                    <button onClick={() => handleDelete(report.id)}>
                      <Trash2 className="w-5 h-5 text-red-700" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between flex-row gap-3 p-3 md:p-6 border-t border-slate-200">
        <div>
          <h1 className="font-bold text-xs text-black">
            Total Data: {reports.length}
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
};

export default FAQPage;
