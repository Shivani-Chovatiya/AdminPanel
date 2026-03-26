import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../config/firebase";

const FuturePrediction = ({ user }) => {
  const tabs = [
    {
      id: 1,
      label: "Future Prediction Ques. History",
      color: "text-orange-600",
      iconBg: "bg-orange-600",
    },
    {
      id: 2,
      label: "Compatibility Ques. History",
      color: "text-gray-500",
      iconBg: "bg-gray-400",
    },
  ];
  const sessionsData = [
    {
      therapist: "Dr. Marcus Sterling",
      date: "Oct 24, 2023",
      status: "Completed",
      type: "Cognitive Behavioral Therapy",
      time: "02:30 PM - 03:30 PM (EST)",
    },
    {
      therapist: "Dr. Elena Rodriguez",
      date: "Oct 31, 2023",
      status: "Scheduled",
      type: "Family Counseling",
      time: "10:00 AM - 11:00 AM (EST)",
    },
    {
      therapist: "Dr. Marcus Sterling",
      date: "Oct 17, 2023",
      status: "Cancelled",
      type: "Cognitive Behavioral Therapy",
      time: "02:30 PM - 03:30 PM (EST)",
    },
    {
      therapist: "Dr. Marcus Sterling",
      date: "Oct 10, 2023",
      status: "Completed",
      type: "Cognitive Behavioral Therapy",
      time: "02:30 PM - 03:30 PM (EST)",
    },
    // Add more sessions here...
  ];

  const [statusFilter, setStatusFilter] = useState("All");
  const [predictions, setPredictions] = useState([]);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const [activeTab, setActiveTab] = useState(1);
  const getLatestPredictions2 = async () => {
    if (!user?.futurePrediction) return;

    try {
      const list = await Promise.all(
        Object.values(user.futurePrediction).map(async (item) => {
          let originalCredits = 0;
          let category = "";
          let answer = "";
          // 🔥 Fetch from predictionQuestions collection
          if (item.questionId) {
            const docRef = doc(db, "predictionQuestions", item.questionId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
              originalCredits = docSnap.data().credits || 0;
              category = docSnap.data().category || "";
              answer = item.answer || "No answer available";
            }
          }

          return {
            question: item.question,
            creditsUsed: item.creditsUsed || 0,
            originalCredits,
            category,
            answer,
            status: item.status,
            createdAt: item.createdAt,
          };
        }),
      );

      // ✅ Sort latest first
      const sorted = list.sort((a, b) => {
        const dateA = a.createdAt?.toDate
          ? a.createdAt.toDate()
          : new Date(a.createdAt);

        const dateB = b.createdAt?.toDate
          ? b.createdAt.toDate()
          : new Date(b.createdAt);

        return dateB - dateA;
      });

      setPredictions(sorted);
    } catch (error) {
      console.error("Error fetching predictions:", error);
    }
  };
  const getLatestPredictions = async () => {
    if (!user) return;

    try {
      let combined = [];

      // ================= FUTURE =================
      if (user.futurePrediction) {
        const futureList = await Promise.all(
          Object.values(user.futurePrediction).map(async (item) => {
            let originalCredits = 0;
            let category = "";
            let answer = item.answer || "No answer available";

            if (item.questionId) {
              const docRef = doc(db, "predictionQuestions", item.questionId);
              const docSnap = await getDoc(docRef);

              if (docSnap.exists()) {
                originalCredits = docSnap.data().credits || 0;
                category = docSnap.data().category || "";
              }
            }

            return {
              type: "future",
              question: item.question,
              creditsUsed: item.creditsUsed || 0,
              originalCredits,
              category,
              answer,
              status: item.status,
              createdAt: item.createdAt,
            };
          }),
        );

        combined.push(...futureList);
      }

      // ================= COMPATIBILITY =================
      if (user.compatibility) {
        const compatibilityList = await Promise.all(
          Object.values(user.compatibility).map(async (item) => {
            let originalCredits = 0;
            let category = "Compatibility";
            let answer = item.answer || "No answer available";

            if (item.compatibilityQuestionsId) {
              const docRef = doc(
                db,
                "compatibilityQuestions",
                item.compatibilityQuestionsId,
              );
              const docSnap = await getDoc(docRef);

              if (docSnap.exists()) {
                originalCredits = docSnap.data().credits || 0;
              }
            }

            return {
              type: "compatibility",
              question: item.question,
              creditsUsed: item.creditsUsed || 0,
              originalCredits,
              category,
              answer,
              status: item.status,
              createdAt: item.createdAt,
              person1: item.person1,
              person2: item.person2,
            };
          }),
        );

        combined.push(...compatibilityList);
      }

      // ✅ SORT LATEST
      const sorted = combined.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
        return dateB - dateA;
      });

      setPredictions(sorted);
    } catch (error) {
      console.error("Error fetching predictions:", error);
    }
  };
  useEffect(() => {
    if (user) {
      getLatestPredictions();
    }
  }, [user]);

  // const filteredSessions =
  //   statusFilter === "All"
  //     ? predictions
  //     : predictions.filter((s) => s.status === statusFilter);
  const filteredSessions = predictions
    .filter((item) =>
      activeTab === 1 ? item.type === "future" : item.type === "compatibility",
    )
    .filter((item) =>
      statusFilter === "All" ? true : item.status === statusFilter,
    );

  // Calculate pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = filteredSessions.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredSessions.length / rowsPerPage);
  return (
    <div className="">
      {/* <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">

        <div className="flex items-center gap-4">
          
          <div className="relative w-24 h-24">
            <img
              src="https://i.pravatar.cc/150?img=3"
              alt="Profile"
              className="w-full h-full rounded-xl border-4 border-gray-50 shadow-sm object-cover"
            />
           
            <div className="absolute bottom-0 right-0 bg-green-500 border-4 border-white rounded-full px-2 py-0.5 flex items-center justify-center text-white text-xs font-bold uppercase">
              Online
            </div>
          </div>

        
          <div className="flex flex-col gap-1">
            <h2 className="text-gray-900 font-bold text-xl md:text-2xl">
              John Doe
            </h2>
            <div className="flex items-center gap-2 text-gray-500 text-sm md:text-base">
              <div className="w-3 h-2 bg-gray-400"></div>
              <span>Software Engineer at Company</span>
            </div>
          </div>
        </div>
      </div> */}

      <div className="border-b border-orange-100  p-4 md:p-6">
        <div className="flex gap-6 overflow-x-auto  flex-row flex-wrap">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-row items-center gap-2 pb-2 border-b-2 ${
                  isActive ? "border-orange-600" : "border-transparent"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full ${
                    isActive ? "bg-orange-600" : "bg-gray-400"
                  }`}
                ></div>
                <span
                  className={`text-xs font-medium ${
                    isActive ? "text-orange-600" : "text-gray-500"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      {activeTab === 1 && (
        <div className="p-6 bg-white rounded-xl shadow-md w-full max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Future Prediction Ques. History
          </h2>

          {/* Filters */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
            {/* <input
              type="text"
              placeholder="Filter by therapist or date..."
              className="px-4 py-2 border border-gray-300 rounded-md w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            /> */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="All">All</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Table */}
          <div className="border border-orange-100 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                {/* Header */}
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold">
                      Question Text
                    </th>
                    <th className="text-center px-4 py-3 font-semibold">
                      Credits Used
                    </th>
                    <th className="text-center px-4 py-3 font-semibold">
                      Status
                    </th>
                    <th className="text-center px-4 py-3 font-semibold">
                      Category
                    </th>
                    <th className="text-center px-4 py-3 font-semibold">
                      Refund Status
                    </th>
                    <th className="text-center px-4 py-3 font-semibold">
                      Answer
                    </th>
                  </tr>
                </thead>

                {/* Body */}
                <tbody>
                  {currentData.map((item, index) => (
                    <tr key={index} className="border-t border-orange-50">
                      {/* Question */}
                      <td className="px-4 py-4 text-slate-900">
                        <div>
                          <h1 className="font-bold">{item.question}</h1>
                          <span className="text-xs">
                            Total Credits: {item.originalCredits}
                          </span>
                        </div>
                      </td>

                      {/* Credits */}
                      <td className="px-4 py-4 text-center font-bold text-slate-900">
                        {item.creditsUsed}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            item.status === "success"
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center font-bold text-slate-900">
                        {item.category}
                      </td>
                      {/* Refund Status */}
                      <td className="px-4 py-4 text-center">
                        {item.status === "failed" ? (
                          <span className="text-green-600 font-semibold">
                            Refunded
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {item.status === "success" ? (
                          <button
                            onClick={() => {
                              setSelectedAnswer(item.answer);
                              setSelectedQuestion(item.question);
                              setShowAnswerModal(true);
                            }}
                            className="px-3 py-1 bg-primary text-white rounded-md text-xs font-semibold hover:opacity-90"
                          >
                            View
                          </button>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between flex-col md:flex-row gap-3 p-3 md:p-6 border-t border-slate-200">
            <div>
              <h1 className="font-bold text-xs text-black">
                Total Data: {filteredSessions.length}
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
      )}
      {activeTab === 2 && (
        <div className="p-6 bg-white rounded-xl shadow-md w-full max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Compatibility Ques. History
          </h2>

          {/* Filter */}
          <div className="mb-6">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="All">All</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {currentData.map((item, index) => (
              <div
                key={index}
                className="border border-purple-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
              >
                {/* Top */}
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full font-semibold">
                    Compatibility
                  </span>

                  <span
                    className={`text-xs px-2 py-1 rounded font-bold ${
                      item.status === "success"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                {/* Persons */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-center">
                    <p className="font-semibold text-gray-900 text-sm">
                      {item.person1?.name || "Person 1"}
                    </p>
                    <p className="text-xs text-gray-400">You</p>
                  </div>

                  <div className="text-purple-500 font-bold text-lg"></div>
                  {/* ❤️ */}
                  <div className="text-center">
                    <p className="font-semibold text-gray-900 text-sm">
                      {item.person2?.name || "Person 2"}
                    </p>
                    <p className="text-xs text-gray-400">Partner</p>
                  </div>
                </div>

                {/* Question */}
                <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                  {item.question}
                </p>

                {/* Credits */}
                <div className="flex justify-between text-xs text-gray-500 mb-3">
                  <span>Credits Used: {item.creditsUsed}</span>
                  <span>Total: {item.originalCredits}</span>
                </div>

                {/* Action */}
                <div className="flex justify-between items-center mt-4">
                  {item.status === "failed" ? (
                    <span className="text-green-600 text-xs font-semibold">
                      Refunded
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs">—</span>
                  )}

                  {item.status === "success" && (
                    <button
                      onClick={() => {
                        setSelectedAnswer(item.answer);
                        setSelectedQuestion(item.question);
                        setShowAnswerModal(true);
                      }}
                      className="px-3 py-1 bg-purple-600 text-white rounded-md text-xs font-semibold hover:opacity-90"
                    >
                      View Answer
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination SAME */}
          <div className="flex justify-between items-center mt-6">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-3 py-1 border border-purple-500 rounded-md disabled:opacity-40"
            >
              Prev
            </button>

            <span className="text-sm font-semibold">
              {currentPage} / {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-3 py-1 border border-purple-500 rounded-md disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
      {showAnswerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          {/* Modal Box */}
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-lg font-bold text-gray-900">
                Prediction Answer
              </h2>

              <button
                onClick={() => setShowAnswerModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>

            {/* Question */}
            <div className="px-6 py-3 border-b bg-gray-50">
              <p className="text-sm text-gray-600 font-medium">
                {selectedQuestion}
              </p>
            </div>

            {/* Answer Content (Scrollable 🔥) */}
            <div
              className="px-6 py-4 overflow-y-auto"
              style={{ maxHeight: "300px" }}
            >
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {selectedAnswer}
              </p>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t flex justify-end">
              <button
                onClick={() => setShowAnswerModal(false)}
                className="px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:opacity-90"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FuturePrediction;
