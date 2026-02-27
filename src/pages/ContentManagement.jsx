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
import React, { useRef, useState } from "react";
import Switch from "react-switch";
import JoditEditor from "jodit-react";
import FreeAssessmentsPage from "../ContentmanagementPages/FreeAssessmentsPage";
import PaidAssessment from "../ContentmanagementPages/PaidAssessment";
import FuturePredictionQuestion from "../ContentmanagementPages/FuturePredictionQuestion";

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
  const [reports, setReports] = useState(initialReports);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    date: "",
    status: "Active",
    description: "",
  });
  const editor = useRef(null);
  const rowsPerPage = 3;
  // Calculate pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = reports.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(reports.length / rowsPerPage);

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
      description: "",
    });
  };

  const handleEdit = (report) => {
    setIsEditing(true);
    setFormData(report);
  };

  const handleDelete = (id) => {
    const filtered = reports.filter((r) => r.id !== id);
    setReports(filtered);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.id) {
      // Update existing
      const updated = reports.map((r) => (r.id === formData.id ? formData : r));
      setReports(updated);
    } else {
      // Add new
      const newTip = { ...formData, id: Date.now() };
      setReports([newTip, ...reports]);
    }
    setIsEditing(false);
    setFormData({
      id: null,
      title: "",
      date: "",
      status: "Active",
      description: "",
    });
  };

  return (
    <div>
      <div className="flex flex-wrap border-b border-orange-100 px-4 sm:px-6">
        {[
          "Therapy Tips",
          "Free Assessments",
          "Paid Assessments",
          "Future Prediction Question",
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          {/* Modal content */}
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
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
                  value={formData.description}
                  tabIndex={1} // tabIndex of textarea
                  onBlur={(newContent) =>
                    setFormData({ ...formData, description: newContent })
                  }
                  onChange={() => {}}
                  config={{
                    readonly: false,
                    height: 400,
                  }}
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
                  <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">
                    Title
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">
                    Modified
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">
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
                    <td className="px-2 py-2 text-center text-sm font-medium text-gray-900">
                      {report.title}
                    </td>
                    <td className="px-2 py-2 text-center text-sm text-gray-600">
                      {report.date}
                    </td>
                    <td className="px-2 py-2 text-center text-sm">
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
                    <td className="  gap-3 px-2 py-2 text-center text-sm  ">
                      <div className="flex justify-center items-center gap-3">
                        <button onClick={() => alert(report.description)}>
                          <Eye className="w-5 h-5 text-blue-600" />
                        </button>
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
                Previous
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
      ) : (
        <></>
      )}
    </div>
  );
};

export default ContentManagement;
