// import React, { useState } from "react";
// import MotivatingLinePage from "../ContentmanagementPages/MotivatingLinePage";
// import ReviewPage from "../ContentmanagementPages/ReviewPage";
// import FreeAssessmentsPage from "../ContentmanagementPages/FreeAssessmentsPage";
// import ClarifyPage from "../ContentmanagementPages/ClarifyPage";
// import RecoveryFactsPage from "../ContentmanagementPages/RecoveryFactsPage";

// const ContentManagement = () => {
//   const [activeTab, setActiveTab] = useState("Motivating Lines");
//   return (
//     <div>
//       <h1 className="text-xl md:text-2xl font-bold mb-4">Content Management</h1>
//       <div className="bg-white p-6 rounded-2xl shadow">
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5  gap-2   p-1 mb-4">
//           {[
//             "Motivating Lines",
//             "Reviews",
//             "Free Assessments",
//             "Clarify",
//             "Recovery Facts",
//           ].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`px-5 py-2 rounded-xl border capitalize shrink-0 text-sm ${
//                 activeTab === tab
//                   ? "bg-orange-500 text-white"
//                   : "text-gray-500 hover:bg-gray-100"
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>
//         {activeTab === "Motivating Lines" ? <MotivatingLinePage /> : <></>}
//         {activeTab === "Reviews" ? <ReviewPage /> : <></>}
//         {activeTab === "Free Assessments" ? <FreeAssessmentsPage /> : <></>}
//         {activeTab === "Clarify" ? <ClarifyPage /> : <></>}
//         {activeTab === "Recovery Facts" ? <RecoveryFactsPage /> : <></>}
//       </div>{" "}
//     </div>
//   );
// };

// export default ContentManagement;
import { Edit, Edit2, Eye, Trash2 } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";
import Switch from "react-switch";
import JoditEditor from "jodit-react";
import FreeAssessmentsPage from "../ContentmanagementPages/FreeAssessmentsPage";
import PaidAssessment from "../ContentmanagementPages/PaidAssessment";
import FuturePredictionQuestion from "../ContentmanagementPages/FuturePredictionQuestion";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import Swal from "sweetalert2";
import CompatibilityPage from "../ContentmanagementPages/CompatibilityPage";
import FAQPage from "../ContentmanagementPages/FAQPage";
import { toast } from "react-toastify";

const initialReports = [
  {
    title: "Managing Anxiety at Work",
    date: "Oct 24, 2023",
    status: "Active",
    description: "Essential guide for stress management",
  },
  {
    title: "Grounding Techniques",
    date: "Oct 21, 2023",
    status: "Active",
    description: "Physical activities to refocus thoughts",
  },
  {
    title: "Morning Journaling Habits",
    date: "Oct 18, 2023",
    status: "Inactive",
    description: "Reflective prompts for self-discovery",
  },
  {
    title: "Overcoming Sleep Insomnia",
    date: "Oct 15, 2023",
    status: "Active",
    description: "A guide to better sleep hygiene",
  },
];

const ContentManagement = () => {
  const [type, setType] = useState("Therapy Tips");
  const [currentPage, setCurrentPage] = useState(1);
  const [reports, setReports] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    title: "",
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
      const querySnapshot = await getDocs(collection(db, "therapyTips"));
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
      title: "",
      date: "",
      status: "Active",
      // description: "",
    });
    setDescription("");
  };

  const handleEdit = (report) => {
    setIsEditing(true);
    setFormData(report);
    setDescription(report.description);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This tip will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "therapyTips", id));

        await Swal.fire({
          title: "Deleted!",
          text: "The tip has been deleted successfully.",
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
    // 🔍 Check duplicate title
    const q = query(
      collection(db, "therapyTips"),
      where("title", "==", formData.title.trim()),
    );

    const querySnapshot = await getDocs(q);

    // ❌ If adding new & title exists
    if (!formData.id && !querySnapshot.empty) {
      toast.error("Title already exists!");
      return;
    }

    // ❌ If editing & title exists in another doc
    if (formData.id && !querySnapshot.empty) {
      const isSameDoc = querySnapshot.docs.some(
        (docItem) => docItem.id === formData.id,
      );

      if (!isSameDoc) {
        toast.error("Title already exists!");
        return;
      }
    }

    try {
      if (formData.id) {
        // UPDATE
        const tipRef = doc(db, "therapyTips", formData.id);
        await updateDoc(tipRef, {
          title: formData.title,
          description: description,
          status: formData.status,
          updatedAt: serverTimestamp(),
        });
        Swal.fire("Updated!", "Tips updated.", "success");
      } else {
        // CREATE
        await addDoc(collection(db, "therapyTips"), {
          title: formData.title,
          description: description,
          status: formData.status,
          createdAt: serverTimestamp(),
        });
        Swal.fire("Saved!", "Tips added.", "success");
      }

      fetchTips(); // refresh list
      setIsEditing(false);

      setFormData({
        id: null,
        title: "",
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
      <div className="flex flex-wrap border-b border-orange-100 px-4 sm:px-6">
        {[
          "Therapy Tips",
          "Free Assessments",
          "Paid Assessments",
          "Future Prediction Question",
          "Compatibility Questions",
          // "FAQ",
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => setType(tab)}
            className={`py-2 px-3 text-xs font-semibold m-1 ${
              type === tab
                ? "border-b-2 border-primary text-primary"
                : "text-slate-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      {type === "Therapy Tips" && (
        <div className="flex flex-row justify-between gap-5 p-2 md:p-6">
          <h1 className="text-black font-bold text-xl">Therapy Tips</h1>
          <button
            className="bg-primary rounded-2xl px-2 py-1 text-white text-xs md:text-sm"
            onClick={handleAddNew}
          >
            + Add New Tip
          </button>
        </div>
      )}

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
              {formData.id ? "Edit Tip" : "Add New Tip"}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Title"
                name="title"
                value={formData.title}
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
      {type === "Therapy Tips" ? (
        <>
          {" "}
          <div className="p-3 md:p-6 overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700">
                    Title
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
                      {report.title}
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
        </>
      ) : type === "Free Assessments" ? (
        <FreeAssessmentsPage />
      ) : type === "Paid Assessments" ? (
        <PaidAssessment />
      ) : type === "Future Prediction Question" ? (
        <FuturePredictionQuestion />
      ) : type === "Compatibility Questions" ? (
        <CompatibilityPage />
      ) : (
        // ) : type === "FAQ" ? (
        //   <FAQPage />
        <></>
      )}
    </div>
  );
};

export default ContentManagement;
